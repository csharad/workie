extern crate actix_web;
extern crate env_logger;
extern crate workie_backend;

use actix_web::server;
use std::env;

fn main() {
    if env::var("RUST_LOG").is_err() {
        env::set_var("RUST_LOG", "actix_web=info");
    }
    env_logger::init();

    server::new(workie_backend::app)
        .bind("127.0.0.1:8000")
        .expect("Cannot bind to port 8000")
        .run();
}
