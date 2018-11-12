pub mod task;
pub mod user;

mod functions {
    use diesel::sql_types::Text;

    sql_function!(fn lower(x: Text) -> Text);
}
