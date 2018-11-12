use actix_web::{middleware::identity::RequestIdentity, HttpResponse, Json, Path};
use extractors::AuthUser;
use futures::Future;
use model::{
    task::{NewTask, Task, TaskPatch},
    user::{LoginUser, NewUser, User, UserPatch},
};
use {
    result::{Error, WResult},
    HttpReq, PooledPg,
};

pub(crate) fn get_user(user: AuthUser) -> Json<User> {
    Json(user.into_inner())
}

pub(crate) fn create_user(
    req: HttpReq,
    user: Json<NewUser>,
) -> impl Future<Item = Json<User>, Error = Error> {
    run_pg(&req, |conn| Ok(Json(user.into_inner().save(&conn)?)))
}

pub(crate) fn update_user(
    req: HttpReq,
    auth: AuthUser,
    user: Json<UserPatch>,
) -> impl Future<Item = Json<User>, Error = Error> {
    run_pg(&req, move |conn| {
        Ok(Json(user.into_inner().save(auth.id, &conn)?))
    })
}

pub(crate) fn delete_user(
    req: HttpReq,
    auth: AuthUser,
) -> impl Future<Item = Json<User>, Error = Error> {
    run_pg(&req, move |conn| Ok(Json(auth.into_inner().delete(&conn)?))).map(move |user| {
        req.forget();
        user
    })
}

pub(crate) fn login(
    req: HttpReq,
    user: Json<LoginUser>,
) -> impl Future<Item = Json<User>, Error = Error> {
    run_pg(&req, |conn| Ok(user.into_inner().login(&conn)?)).map(move |user| {
        req.remember(user.id.to_string());
        Json(user)
    })
}

pub(crate) fn logout(req: HttpReq, _: AuthUser) -> HttpResponse {
    req.forget();
    HttpResponse::Ok()
        .header("Content-Type", "application/json")
        .body(r#"{ "logged_out": "ok" }"#)
}

pub(crate) fn create_task(
    req: HttpReq,
    auth: AuthUser,
    task: Json<NewTask>,
) -> impl Future<Item = Json<Task>, Error = Error> {
    run_pg(&req, move |conn| {
        Ok(Json(task.into_inner().save(auth.id, &conn)?))
    })
}

pub(crate) fn update_task(
    req: HttpReq,
    id: Path<i32>,
    auth: AuthUser,
    task: Json<TaskPatch>,
) -> impl Future<Item = Json<Task>, Error = Error> {
    run_pg(&req, move |conn| {
        Ok(Json(task.into_inner().save(
            id.into_inner(),
            auth.id,
            &conn,
        )?))
    })
}

pub(crate) fn get_tasks(
    req: HttpReq,
    auth: AuthUser,
) -> impl Future<Item = Json<Vec<Task>>, Error = Error> {
    run_pg(&req, move |conn| {
        Ok(Json(Task::find_all_for_user(auth.id, &conn)?))
    })
}

pub(crate) fn delete_task(
    req: HttpReq,
    auth: AuthUser,
    id: Path<i32>,
) -> impl Future<Item = Json<Task>, Error = Error> {
    run_pg(&req, move |conn| {
        Ok(Json(Task::delete_for_user(
            id.into_inner(),
            auth.id,
            &conn,
        )?))
    })
}

fn run_pg<T, F>(req: &HttpReq, cb: F) -> impl Future<Item = T, Error = Error>
where
    T: 'static + Send,
    F: FnOnce(PooledPg) -> WResult<T> + Send + 'static,
{
    let pooled = req.state().conn();
    req.cpu_pool().spawn_fn(move || cb(pooled?))
}
