#![allow(proc_macro_derive_resolution_fallback)]

#[macro_use]
extern crate diesel;
extern crate actix_web;
extern crate bcrypt;
extern crate chrono;
extern crate failure;
extern crate futures;
extern crate serde;
extern crate validator;
#[macro_use]
extern crate validator_derive;
extern crate serde_json;

use actix_web::{
    http::Method,
    middleware::{
        identity::{CookieIdentityPolicy, IdentityService},
        Logger,
    },
    App, HttpRequest,
};
use diesel::{
    r2d2::{ConnectionManager, Pool, PooledConnection},
    PgConnection,
};
use result::{Error, WResult};
use std::env;

mod extractors;
mod model;
mod result;
mod routes;
mod schema;

type PgPool = Pool<ConnectionManager<PgConnection>>;
type PooledPg = PooledConnection<ConnectionManager<PgConnection>>;

fn pg_pool() -> PgPool {
    let postgres_url = env::var("DATABASE_URL").expect("Could not find `DATABASE_URL` in the env.");
    let manager = ConnectionManager::<PgConnection>::new(postgres_url);
    Pool::new(manager).expect("Postgres connection pool could not be created")
}

fn logger() -> Logger {
    if cfg!(debug_assertions) {
        Logger::new(r#""%r" %s %b %D"#)
    } else {
        Logger::default()
    }
}

pub struct Context {
    pg_pool: PgPool,
}

impl Context {
    fn conn(&self) -> WResult<PooledPg> {
        self.pg_pool.get().map_err(Error::R2D2)
    }
}

type HttpReq = HttpRequest<Context>;

pub fn app() -> App<Context> {
    dotenv::dotenv().unwrap();

    let state = Context { pg_pool: pg_pool() };

    App::with_state(state)
        .prefix("/api")
        .middleware(logger())
        .middleware(IdentityService::new(
            CookieIdentityPolicy::new(&[0; 32])
                .name("workie-token")
                .secure(false),
        )).scope("/users", |s| {
            s.resource("", |r| {
                r.post().with_async(routes::create_user);
                r.method(Method::PATCH).with_async(routes::update_user);
                r.delete().with_async(routes::delete_user);
            }).resource("/me", |r| {
                r.get().with(routes::get_user);
            })
        }).resource("/login", |r| {
            r.post().with_async(routes::login);
        }).resource("/logout", |r| {
            r.post().with(routes::logout);
        }).scope("/tasks", |s| {
            s.resource("", |r| {
                r.post().with_async(routes::create_task);
                r.get().with_async(routes::get_tasks)
            }).resource("/{id}", |r| {
                r.method(Method::PATCH).with_async(routes::update_task);
                r.delete().with_async(routes::delete_task);
            })
        })
}
