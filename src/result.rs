use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use diesel::result::{DatabaseErrorKind, Error as DieselError};
use failure::Fail;

pub(crate) type WResult<T> = Result<T, Error>;

#[derive(Debug, Fail)]
pub(crate) enum Error {
    #[fail(display = "DieselError: {}", _0)]
    Diesel(#[cause] DieselError),
    #[fail(display = "BcryptError: {}", _0)]
    Bcrypt(#[cause] bcrypt::BcryptError),
    #[fail(display = "R2D2PoolError: {}", _0)]
    R2D2(#[cause] diesel::r2d2::PoolError),
    #[fail(display = "The request is unauthorized.")]
    Unauthorized,
}

impl From<DieselError> for Error {
    fn from(err: DieselError) -> Error {
        Error::Diesel(err)
    }
}

impl From<bcrypt::BcryptError> for Error {
    fn from(err: bcrypt::BcryptError) -> Error {
        Error::Bcrypt(err)
    }
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        match self {
            Error::Diesel(err) => build_diesel_error(err),
            Error::Bcrypt(_) => internal_server_error(),
            Error::R2D2(_) => internal_server_error(),
            Error::Unauthorized => message(
                StatusCode::UNAUTHORIZED,
                r#"{ "kind": "UNAUTHORIZED", "message": "Request in unauthorized" }"#,
            ),
        }
    }
}

fn build_diesel_error(err: &DieselError) -> HttpResponse {
    match err {
        DieselError::NotFound => message(
            StatusCode::NOT_FOUND,
            r#"{ "kind": "NOT_FOUND", "message": "Requested resource could not be found" }"#,
        ),
        DieselError::QueryBuilderError(_) => message(
            StatusCode::BAD_REQUEST,
            r#"{ "kind": "BAD_REQUEST", "message": "Tried to update records with nothing." }"#,
        ),
        DieselError::DatabaseError(kind, _) => build_database_error(kind),
        _ => internal_server_error(),
    }
}

fn build_database_error(kind: &DatabaseErrorKind) -> HttpResponse {
    match kind {
        DatabaseErrorKind::UniqueViolation => message(
            StatusCode::BAD_REQUEST, 
            r#"{ "kind": "NOT_UNIQUE", "message": "One/more fields of the record are not unique." }"#
        ),
        DatabaseErrorKind::ForeignKeyViolation => message(
            StatusCode::NOT_FOUND, 
            r#"{ "kind": "NOT_FOUND", "message": "Requested resource could not be found." }"#
        ),
        _ => internal_server_error(),
    }
}

fn message(code: StatusCode, body: &'static str) -> HttpResponse {
    HttpResponse::build(code)
        .header("Content-Type", "application/json")
        .body(body)
}

fn internal_server_error() -> HttpResponse {
    message(
        StatusCode::INTERNAL_SERVER_ERROR,
        r#"{ "kind": "INTERNAL_SERVER_ERROR", "message": "Something bad happened." }"#,
    )
}
