use actix_cors::Cors;
use actix_web::{get, http, post, web, App, HttpResponse, HttpServer, Responder};
use bcrypt::{hash, DEFAULT_COST};
use serde::Serialize;
use serde::Deserialize;


#[derive(Serialize)]
struct Message{
    message: String
}

#[derive(serde::Deserialize)]
struct LoginData {
    email: String,
    password: String,
}

#[derive(Deserialize)]
struct RegisterData {
    name: String,
    email: String,
    password: String,
    role: String, // Debe ser 'client' o 'provider'
}

#[get("/api/hello")]
async fn hello() -> impl Responder{
    HttpResponse::Ok().json(Message {
        message: "Hola Mundo desde Rust".to_string(),
    })
}




#[post("/api/register")]
async fn register(data: web::Json<RegisterData>) -> impl Responder {
    let hashed_password = match hash(&data.password, DEFAULT_COST) {
        Ok(hash) => hash,
        Err(_) => return HttpResponse::InternalServerError().json("Error al cifrar la contraseña"),
    };

    // Aquí insertas los datos en la base de datos (ejemplo con SQL)
    let query = format!(
        "INSERT INTO Users (name, email, password, role) VALUES ('{}', '{}', '{}', '{}')",
        data.name, data.email, hashed_password, data.role
    );

    // Ejecuta la consulta en tu base de datos (usando tu conexión configurada)

    HttpResponse::Ok().json("Usuario registrado correctamente")
}



#[post("/api/login")]
async fn login(data: web::Json<LoginData>) -> impl Responder {
    // Aquí validas las credenciales con tu base de datos
    if data.email == "user@example.com" && data.password == "password" {
        HttpResponse::Ok().json("Login exitoso")
    } else {
        HttpResponse::Unauthorized().json("Credenciales inválidas")
    }
}


#[actix_web::main]
async fn main() -> std::io::Result<()>{
    HttpServer::new(||{

        let cors = Cors::default()
        .allowed_origin("http://localhost:5173")
        .allowed_methods(vec!["GET","POST"])
        .allowed_headers(vec![http::header::CONTENT_TYPE])
        .max_age(3600);

        App::new()
            .wrap(cors)
    })
    .bind(("127.0.0.1", 5000))?
    .run()
    .await
}
