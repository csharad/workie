use super::functions::lower;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use validator::Validate;
use {
    result::{Error, WResult},
    schema::users,
};

/// A struct representing an authenticable user.
#[derive(Identifiable, Queryable, Serialize)]
pub(crate) struct User {
    pub id: i32,
    pub full_name: Option<String>,
    pub email: String,
    #[serde(skip)]
    password: String,
}

impl User {
    pub fn find(id: i32, conn: &PgConnection) -> WResult<User> {
        Ok(users::table.find(id).get_result(conn)?)
    }

    pub fn find_by_email(email: &str, conn: &PgConnection) -> WResult<User> {
        Ok(users::table
            .filter(lower(users::email).eq(lower(email)))
            .get_result(conn)?)
    }

    fn delete(self, conn: &PgConnection) -> WResult<User> {
        diesel::delete(&self).execute(conn)?;
        Ok(self)
    }
}

/// A new user to be inserted in the database.
#[derive(Insertable, Deserialize, Validate)]
#[table_name = "users"]
pub(crate) struct NewUser {
    #[validate(length(min = "1"))]
    full_name: Option<String>,
    #[validate(email)]
    email: String,
    #[validate(length(min = "8"))]
    password: String,
}

impl NewUser {
    /// Save the user in the database.
    pub fn save(mut self, conn: &PgConnection) -> WResult<User> {
        self.validate()?;
        // Hash the password before inserting.
        self.password = bcrypt::hash(&self.password, bcrypt::DEFAULT_COST)?;

        let user = diesel::insert_into(users::table)
            .values(self)
            .get_result(conn)?;
        Ok(user)
    }
}

/// A patch to update a user in the database.
#[derive(AsChangeset)]
#[table_name = "users"]
struct UserPatchBase {
    full_name: Option<Option<String>>,
    email: Option<String>,
    password: Option<String>,
}

#[derive(Deserialize, Validate)]
pub(crate) struct UserPatch {
    full_name: Option<String>,
    #[validate(email)]
    email: Option<String>,
    #[validate(length(min = "8"))]
    new_password: Option<String>,
    #[validate(length(min = "8"))]
    password: String,
}

impl UserPatch {
    /// Update the user with `id`.
    pub fn save(self, user: User, conn: &PgConnection) -> WResult<User> {
        self.validate()?;
        if !bcrypt::verify(&self.password, &user.password)? {
            return Err(Error::Unauthorized);
        }

        let password = if let Some(password) = self.new_password {
            Some(bcrypt::hash(&password, bcrypt::DEFAULT_COST)?)
        } else {
            None
        };

        let user_patch = UserPatchBase {
            full_name: self
                .full_name
                .map(|name| if name.is_empty() { None } else { Some(name) }),
            email: self.email,
            password,
        };

        let user = diesel::update(&user).set(user_patch).get_result(conn)?;
        Ok(user)
    }
}

#[derive(Deserialize, Validate)]
pub(crate) struct LoginUser {
    #[validate(email)]
    email: String,
    #[validate(length(min = "8"))]
    password: String,
}

impl LoginUser {
    pub fn login(self, conn: &PgConnection) -> WResult<User> {
        self.validate()?;
        let user = User::find_by_email(&self.email, conn)?;
        if bcrypt::verify(&self.password, &user.password)? {
            Ok(user)
        } else {
            Err(Error::Unauthorized)
        }
    }
}

#[derive(Deserialize, Validate)]
pub(crate) struct DeleteUser {
    #[validate(length(min = "8"))]
    password: String,
}

impl DeleteUser {
    pub fn delete(self, id: i32, conn: &PgConnection) -> WResult<User> {
        let user = User::find(id, conn)?;
        if bcrypt::verify(&self.password, &user.password)? {
            user.delete(conn)
        } else {
            Err(Error::Unauthorized)
        }
    }
}
