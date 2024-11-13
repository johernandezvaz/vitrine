use sqlx::FromRow;

#[derive(FromRow, Debug)]
pub struct Project {
    pub id: i32,
    pub user_id: i32,
    pub service_id: i32,
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}
