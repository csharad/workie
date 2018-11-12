use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use result::WResult;
use schema::tasks;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Identifiable, Queryable, Serialize)]
pub(crate) struct Task {
    id: i32,
    task: String,
    is_completed: Option<bool>,
    created_on: NaiveDateTime,
    completed_on: Option<NaiveDateTime>,
    user_id: i32,
}

impl Task {
    fn find_for_user(id: i32, user_id: i32, conn: &PgConnection) -> WResult<Task> {
        Ok(tasks::table
            .filter(tasks::id.eq(id).and(tasks::user_id.eq(user_id)))
            .get_result(conn)?)
    }

    pub fn find_all_for_user(user_id: i32, conn: &PgConnection) -> WResult<Vec<Task>> {
        Ok(tasks::table.filter(tasks::user_id.eq(user_id)).load(conn)?)
    }

    pub fn delete_for_user(id: i32, user_id: i32, conn: &PgConnection) -> WResult<Task> {
        let deleted =
            diesel::delete(tasks::table.filter(tasks::id.eq(id).and(tasks::user_id.eq(user_id))))
                .get_result(conn)?;
        Ok(deleted)
    }
}

#[derive(Insertable)]
#[table_name = "tasks"]
struct NewTaskBase {
    task: String,
    created_on: NaiveDateTime,
    user_id: i32,
}

#[derive(Deserialize, Validate)]
pub(crate) struct NewTask {
    #[validate(length(min = "1"))]
    task: String,
}

impl NewTask {
    pub fn save(self, user_id: i32, conn: &PgConnection) -> WResult<Task> {
        self.validate()?;
        let new_task = NewTaskBase {
            task: self.task,
            created_on: Utc::now().naive_utc(),
            user_id,
        };
        Ok(diesel::insert_into(tasks::table)
            .values(new_task)
            .get_result(conn)?)
    }
}

#[derive(AsChangeset)]
#[table_name = "tasks"]
struct TaskPatchBase {
    task: Option<String>,
    is_completed: Option<bool>,
    completed_on: Option<Option<NaiveDateTime>>,
}

#[derive(Deserialize, Validate)]
pub(crate) struct TaskPatch {
    #[validate(length(min = "1"))]
    task: Option<String>,
    is_completed: Option<bool>,
}

impl TaskPatch {
    pub fn save(self, id: i32, user_id: i32, conn: &PgConnection) -> WResult<Task> {
        self.validate()?;
        let task = Task::find_for_user(id, user_id, conn)?;

        // Set the completed_on field based on the previous value and current
        // request.
        let (is_completed, completed_on) = match self.is_completed {
            Some(true) => {
                if task.completed_on.is_some() {
                    // Already completed.
                    (None, None)
                } else {
                    (Some(true), Some(Some(Utc::now().naive_utc())))
                }
            }
            Some(false) => {
                if task.completed_on.is_none() {
                    // Incomplete still.
                    (None, None)
                } else {
                    (Some(false), Some(None))
                }
            }
            None => (None, None),
        };

        let task_patch = TaskPatchBase {
            task: self.task,
            is_completed,
            completed_on,
        };

        Ok(diesel::update(&task).set(task_patch).get_result(conn)?)
    }
}
