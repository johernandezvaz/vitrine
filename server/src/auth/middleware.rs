use actix_service::Service;
use actix_web::{
    dev::{ServiceRequest, ServiceResponse},
    Error,
};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use futures::future::{ok, Ready};
use jsonwebtoken::{decode, Validation, DecodingKey};
use crate::config::AppConfig;
use crate::db::models::User;

pub async fn jwt_middleware(
    req: ServiceRequest,
    auth: BearerAuth,
    config: web::Data<AppConfig>,
) -> Result<ServiceResponse, Error> {
    let token = auth.token();
    let validation = Validation::default();

    match decode::<User>(
        token,
        &DecodingKey::from_secret(config.jwt_secret.as_ref()),
        &validation,
    ) {
        Ok(_) => Ok(req.into_response(HttpResponse::Ok().finish())),
        Err(_) => Ok(req.into_response(HttpResponse::Unauthorized().finish())),
    }
}
