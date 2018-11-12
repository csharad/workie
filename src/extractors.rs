use actix_web::{
    dev::PayloadConfig, middleware::identity::RequestIdentity, FromRequest, HttpRequest,
};
use model::user::User;
use std::ops::Deref;
use {
    result::{Error, WResult},
    Context,
};

pub(crate) struct AuthUser(User);

impl AuthUser {
    pub fn into_inner(self) -> User {
        self.0
    }
}

impl FromRequest<Context> for AuthUser {
    type Config = PayloadConfig;
    type Result = WResult<Self>;

    #[inline]
    fn from_request(req: &HttpRequest<Context>, _: &Self::Config) -> Self::Result {
        if let Some(id) = req.identity() {
            let id: i32 = id.parse().unwrap();
            let user = User::find(id, &*req.state().conn()?)?;
            Ok(AuthUser(user))
        } else {
            Err(Error::Unauthorized)
        }
    }
}

impl Deref for AuthUser {
    type Target = User;

    fn deref(&self) -> &User {
        &self.0
    }
}
