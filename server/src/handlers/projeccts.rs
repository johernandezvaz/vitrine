use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use crate::db::{DbPool, models::Project};
use serde::Deserialize;

/// Estructura para recibir datos de un proyecto nuevo.
#[derive(Deserialize)]
pub struct NewProject {
    pub title: String,
    pub description: String,
    pub user_id: i32,
    pub service_id: i32,
}

/// Crear un nuevo proyecto.
pub async fn create_project(
    pool: web::Data<DbPool>,
    form: web::Json<NewProject>,
) -> impl Responder {
    let conn = pool.get().expect("Error al obtener conexión de la base de datos");
    let new_project = form.into_inner();

    let result = diesel::insert_into(crate::schema::projects::dsl::projects)
        .values((
            crate::schema::projects::dsl::title.eq(new_project.title),
            crate::schema::projects::dsl::description.eq(new_project.description),
            crate::schema::projects::dsl::user_id.eq(new_project.user_id),
            crate::schema::projects::dsl::service_id.eq(new_project.service_id),
        ))
        .execute(&conn);

    match result {
        Ok(_) => HttpResponse::Created().json("Proyecto creado exitosamente"),
        Err(err) => {
            eprintln!("Error al crear proyecto: {:?}", err);
            HttpResponse::InternalServerError().json("Error al crear proyecto")
        }
    }
}

/// Obtener detalles de un proyecto.
pub async fn get_project(
    pool: web::Data<DbPool>,
    project_id: web::Path<i32>,
) -> impl Responder {
    let conn = pool.get().expect("Error al obtener conexión de la base de datos");
    use crate::schema::projects::dsl::*;

    let project = projects.filter(id.eq(project_id.into_inner())).first::<Project>(&conn);

    match project {
        Ok(project) => HttpResponse::Ok().json(project),
        Err(err) => {
            eprintln!("Error al obtener proyecto: {:?}", err);
            HttpResponse::NotFound().json("Proyecto no encontrado")
        }
    }
}
