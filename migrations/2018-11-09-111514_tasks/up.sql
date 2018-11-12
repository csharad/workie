CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    is_completed BOOL,
    created_on TIMESTAMP NOT NULL,
    completed_on TIMESTAMP,
    user_id INT NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
