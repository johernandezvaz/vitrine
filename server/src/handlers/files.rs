use actix_multipart::Multipart;
use actix_web::{web, HttpResponse, Responder};
use futures::StreamExt;
use std::io::Write;
use uuid::Uuid;

/// Ruta donde se guardarán los archivos.
const UPLOAD_DIR: &str = "./uploads/";

/// Cargar un archivo al servidor.
pub async fn upload_file(mut payload: Multipart) -> impl Responder {
    // Iterar sobre las partes del multipart form-data.
    while let Some(item) = payload.next().await {
        if let Ok(mut field) = item {
            let content_disposition = field.content_disposition();
            let file_name = content_disposition
                .and_then(|cd| cd.get_filename())
                .map(|f| f.to_string())
                .unwrap_or_else(|| Uuid::new_v4().to_string()); // Generar un nombre único si no hay nombre.

            // Crear la ruta completa del archivo.
            let file_path = format!("{}{}", UPLOAD_DIR, sanitize_filename::sanitize(file_name));
            let mut file = match std::fs::File::create(&file_path) {
                Ok(f) => f,
                Err(_) => return HttpResponse::InternalServerError().json("No se pudo crear el archivo"),
            };

            // Escribir los datos en el archivo.
            while let Some(chunk) = field.next().await {
                if let Ok(data) = chunk {
                    if let Err(_) = file.write_all(&data) {
                        return HttpResponse::InternalServerError().json("Error al escribir el archivo");
                    }
                }
            }
        }
    }

    HttpResponse::Ok().json("Archivo cargado exitosamente")
}

/// Descargar un archivo del servidor.
pub async fn download_file(file_name: web::Path<String>) -> impl Responder {
    let file_path = format!("{}{}", UPLOAD_DIR, sanitize_filename::sanitize(file_name.into_inner()));

    if std::path::Path::new(&file_path).exists() {
        // Enviar el archivo al cliente.
        match actix_files::NamedFile::open(file_path) {
            Ok(named_file) => named_file.into_response(&web::HttpRequest::default()),
            Err(_) => HttpResponse::InternalServerError().json("No se pudo abrir el archivo"),
        }
    } else {
        HttpResponse::NotFound().json("Archivo no encontrado")
    }
}
