use sqlx::FromRow;

#[derive(FromRow, Debug)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub role: String,
}

