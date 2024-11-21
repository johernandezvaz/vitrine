use actix_web::{web, HttpResponse, Result};
use serde::{Deserialize, Serialize};
use jsonwebtoken::{encode, Header, EncodingKey};
use crate::config::AppConfig;
use crate::db::models::User;

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
}

pub async fn login(
    data: web::Json<LoginRequest>,
    config: web::Data<AppConfig>,
) -> Result<HttpResponse> {
    // Simulamos la verificación de un usuario (en un caso real, consultar la base de datos)
    if data.username == "admin" && data.password == "password" {
        let claims = User {
            id: 1,
            username: data.username.clone(),
        };

        // Generar token JWT
        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(config.jwt_secret.as_ref()),
        )
        .map_err(|_| HttpResponse::InternalServerError().finish())?;

        Ok(HttpResponse::Ok().json(LoginResponse { token }))
    } else {
        Ok(HttpResponse::Unauthorized().body("Credenciales incorrectas"))
    }
}

pub async fn register() -> HttpResponse {
    HttpResponse::Ok().body("Registro de usuario no implementado")
}
