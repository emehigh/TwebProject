CREATE SCHEMA project;
SET search_path = project, pg_catalog;

CREATE SEQUENCE roles_seq START WITH 3 INCREMENT BY 1;

CREATE TABLE users (
    id uuid,
    username text,
    email text,
    password text,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id integer,
    name text,
    PRIMARY KEY (id)
);

CREATE TABLE user_role (
    user_id uuid NOT NULL,
    role_id integer NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES project.users (id),
    FOREIGN KEY (role_id) REFERENCES project.roles (id)
);

CREATE TABLE project.followers (
    id UUID PRIMARY KEY,
    user_id INTEGER NOT NULL,
    follower_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES project.users(id),
    CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES project.users(id)
);

CREATE TABLE project.posts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES project.users(id)
);

CREATE TABLE project.comments (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES project.posts(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES project.users(id)
);

create table project.likes (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES project.posts(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES project.users(id)
);

CREATE TABLE project.feedback (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    satisfaction VARCHAR(255) NOT NULL,
    recommend VARCHAR(255) NOT NULL,
    improvements TEXT,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (id, name)
VALUES
(1, 'ADMIN'),
(2, 'USER');


