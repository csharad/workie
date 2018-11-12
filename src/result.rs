use actix_web::{http::StatusCode, HttpResponse, ResponseError, Body};
use diesel::result::{DatabaseErrorKind, Error as DieselError};
use failure::Fail;
use validator::ValidationErrors;

pub(crate) type WResult<T> = Result<T, Error>;

#[derive(Debug, Fail)]
pub(crate) enum Error {
    #[fail(display = "DieselError: {}", _0)]
    Diesel(#[cause] DieselError),
    #[fail(display = "BcryptError: {}", _0)]
    Bcrypt(#[cause] bcrypt::BcryptError),
    #[fail(display = "R2D2PoolError: {}", _0)]
    R2D2(#[cause] diesel::r2d2::PoolError),
    #[fail(display = "ValidationError: {}", _0)]
    Validation(#[cause] ValidationErrors),
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

impl From<ValidationErrors> for Error {
    fn from(err: ValidationErrors) -> Error {
        Error::Validation(err)
    }
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        match self {
            Error::Diesel(err) => build_diesel_error(err),
            Error::Bcrypt(_) => internal_server_error(),
            Error::R2D2(_) => internal_server_error(),
            Error::Validation(err) => {
                let errors = match serde_json::to_string(err) {
                    Ok(errors) => errors,
                    Err(_) => return internal_server_error()
                };
                message(
                    StatusCode::BAD_REQUEST,
                    format!("{{ 
                        \"kind\": \"VALIDATION\", 
                        \"message\": \"Request failed validation constraints.\", 
                        \"errors\": {} 
                    }}", errors)
                )
            },
            Error::Unauthorized => message(
                StatusCode::UNAUTHORIZED,
                r#"{ "kind": "UNAUTHORIZED", "message": "Request in unauthorized" }"#,
            )
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

fn message<T: Into<Body>>(code: StatusCode, body: T) -> HttpResponse {
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
