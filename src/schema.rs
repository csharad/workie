table! {
    tasks (id) {
        id -> Int4,
        task -> Text,
        is_completed -> Nullable<Bool>,
        created_on -> Timestamp,
        completed_on -> Nullable<Timestamp>,
        user_id -> Int4,
    }
}

table! {
    users (id) {
        id -> Int4,
        full_name -> Nullable<Text>,
        email -> Text,
        password -> Text,
    }
}

joinable!(tasks -> users (user_id));

allow_tables_to_appear_in_same_query!(tasks, users,);
