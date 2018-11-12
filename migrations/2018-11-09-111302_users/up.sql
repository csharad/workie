CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE UNIQUE INDEX unique_email on users (LOWER(email));
