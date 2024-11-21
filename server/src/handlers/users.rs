use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use crate::db::{DbPool, models::User};
use serde::Deserialize;

/// Estructura para recibir datos de registro.
#[derive(Deserialize)]
pub struct RegisterUser {
    pub name: String,
    pub email: String,
    pub password: String,
}

/// Estructura para recibir datos de inicio de sesión.
#[derive(Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

/// Registro de un nuevo usuario.
pub async fn register_user(
    pool: web::Data<DbPool>,
    form: web::Json<RegisterUser>,
) -> impl Responder {
    let conn = pool.get().expect("Error al obtener conexión de la base de datos");
    let new_user = form.into_inner();

    // Lógica para insertar el usuario en la base de datos.
    // (Ejemplo simple, omitiendo cifrado de contraseñas)
    let result = diesel::insert_into(crate::schema::users::dsl::users)
        .values((
            crate::schema::users::dsl::name.eq(new_user.name),
            crate::schema::users::dsl::email.eq(new_user.email),
            crate::schema::users::dsl::password.eq(new_user.password),
        ))
        .execute(&conn);

    match result {
        Ok(_) => HttpResponse::Created().json("Usuario registrado exitosamente"),
        Err(err) => {
            eprintln!("Error al registrar usuario: {:?}", err);
            HttpResponse::InternalServerError().json("Error al registrar usuario")
        }
    }
}

/// Inicio de sesión de usuario.
pub async fn login_user(
    pool: web::Data<DbPool>,
    form: web::Json<LoginUser>,
) -> impl Responder {
    let conn = pool.get().expect("Error al obtener conexión de la base de datos");
    let credentials = form.into_inner();

    use crate::schema::users::dsl::*;
    let user = users
        .filter(email.eq(&credentials.email))
        .first::<User>(&conn);

    match user {
        Ok(user) if user.password == credentials.password => {
            // Aquí se generaría el token JWT
            HttpResponse::Ok().json("Inicio de sesión exitoso")
        }
        _ => HttpResponse::Unauthorized().json("Credenciales incorrectas"),
    }
}
