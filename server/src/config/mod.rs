use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize)]
pub struct AppConfig {
    pub database_url: String,
    pub jwt_secret: String,
    pub server_host: String,
    pub server_port: u16,
}

impl AppConfig {
    /// Carga la configuración desde variables de entorno.
    pub fn from_env() -> Self {
        dotenv::dotenv().ok(); // Carga las variables desde un archivo `.env`

        Self {
            database_url: env::var("DATABASE_URL").expect("DATABASE_URL no configurada"),
            jwt_secret: env::var("JWT_SECRET").expect("JWT_SECRET no configurada"),
            server_host: env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string()),
            server_port: env::var("SERVER_PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse()
                .expect("SERVER_PORT debe ser un número"),
        }
    }
}
