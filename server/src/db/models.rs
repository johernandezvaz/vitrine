use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};

/// Modelo de Usuario
#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
    pub role: String, // 'client' o 'provider'
}

/// Modelo de Proyecto
#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Project {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub user_id: i32, // ID del usuario relacionado
    pub service_id: i32,
    pub status: String, // 'active', 'completed', etc.
}
