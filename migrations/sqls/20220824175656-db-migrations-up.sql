/* Replace with your SQL commands */
CREATE TABLE users (id SERIAL PRIMARY KEY, "username" VARCHAR, "email" VARCHAR, password VARCHAR);
CREATE TABLE brands_types (id SERIAL PRIMARY KEY, brand VARCHAR, type VARCHAR, quantity INTEGER);
CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR, type VARCHAR, brand VARCHAR, description VARCHAR, price INTEGER, filename VARCHAR);
