use actix_cors::Cors;
use actix_web::{get, App, HttpServer, HttpResponse, Responder};
use serde::Serialize;


#[derive(Serialize)]
struct Message{
    message: String
}


#[get("/api/hello")]
async fn hello() -> impl Responder{
    HttpResponse::Ok().json(Message {
        message: "Hola Mundo desde Rust".to_string(),
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()>{
    HttpServer::new(||{
        App::new()
            .wrap(Cors::permissive())
            .service(hello)
    })
    .bind(("127.0.0.1", 5000))?
    .run()
    .await
}
