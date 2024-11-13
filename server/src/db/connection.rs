use sqlx::mysql::MySqlPool;
use std::env;

pub async fn establish_connection() -> MySqlPool {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL debe estar configurada en el entorno");
    MySqlPool::connect(&database_url).await
        .expect("Error al conectarse a la base de datos")
}
