# Steps to Initialize the Node Project

## 1. Create Project Directory
~~~ bash
mkdir swapzy
cd swapzy
~~~

## 2. Initialize Node Porject
~~~ bash
npm init
~~~
This command initializes a new Node.js project and creates a ``package.json`` file, which will track dependencies and project configuration.

Project setup information:
~~~ bash
package name: (swapzy)
version: (1.0.0)
description: Web app for buying and selling products
entry point: (index.js) app.js
test conmmand:
git repository:
keywords:
author: my name
license: (ISC)
~~~

After that, a ``package.json`` file will be generated:
~~~ json
{
    "name": "swapzy",
    "version": "1.0.0",
    "description": "Web app for buying and selling products",
    "main": "app.js",
    "scripts": {
        "start": "node app.js",
        "dev": "nodemon app.js"
    },
    "author": "my name",
    "license": "ISC"
}
~~~

## 3. Install Dependencies

~~~ bash
npm install express sequelize sequelize-cli pg pg-hstore passport passport-google-oauth20 bcryptjs dotenv

npm install --save-dev nodemon
~~~

> **Nodemon** is a tool that helps by automatically restarting the node applications when file changes in the directory are detected. When executing the script, replace node by nodemon.

> Maybe also need ``express-session`` for managing user sessions

### Express - Web Framework for Node.js
**Express** is a minimal and flexible web framework for Node.js. it simplifies handling HTTP requests (GET, POST, PUT, DELETE) and allows to create APIs and web apps easily.

- Lets to create endpoints for APIs (``/login``, ``/register``, ``/products``).
- Middleware support essential for handling tasks like parsing incoming requests, authentication and logging.
- Simplifies server setup, clean and easy way to handle routes, manage requests/response cycles and error handling.

### Sequelize - ORM for Database Interaction
**Sequelize** is an **Object-Relational Mapping (ORM)** library for Node.js that helps you interact with relational databases like PostgreSQL using JavaScript instead of writing SQL queries.

- Simplified Database Management, with the use of JavaScript objects instead of SQL queries, to provide a more intuitive database interaction.
- Models map to database tables and Migrations allow the management of database schema changes easily.
- Easy to switch between different databases without changing the code much.

**Sequelize CLI** is the command line interface of sequelize and it allows running terminal commands to create models, run migrations, etc.

### Passport.js - Authentication Middleware
**Passport.js** is an authentication middleware for Node.js. It supports various authetication strategies. For this project OAuth.


### OAuth (Open Authorization) - Authentication Mechanism
**OAuth** is an authentication protocol that allows users to grant third-party applications access to their resources without sharing their passwords. In this case, OAuth enables users to log in user their existing accounts from services like Google, Facebook or Twitter.

**Benefits of OAuth**
- Users can log in using their existing accounts from trusted providers, reducing the need to create and remember new passwords.
- Mitigate risks associated with password storage and management, as we are not handling the passwords directly.

**How OAuth works**
1. User requests login by clicking on "Log in with Google button"
2. The app redirects the user to the Google authentication page, where they can log in.
3. Google asks the user to grant permission to the app to access their information.
4. Google redirects back to the app at a predefined callback (``/auth/google/callback``) with an authorization code.
5. The app uses this code to request and access token from Google, which can be used to fetch user information (email, profile data, ...).
6. Request user's profile information (name, email, ...) from Google.
7. Check if the user exists in database and log in, if not creates new user.
8. Manage sessions using server-side sessions or client-side storage. --> CHOOSE

### bcryptjs - Password Hashing
**Bcrypt** is an encryption algorithm designed for password hashing. It addes a salt (random bit of data) to the password before running the algorithm.

![Theory info](https://medium.com/nerd-for-tech/sha-2-and-bcrypt-encryption-algorithms-e0c0599b0da)

![Usage example](https://dev.to/mr_walkr/password-hashing-in-nodejs-using-bcryptjs-library-3j56)

### dotenv - Environment Variable Management
**dotenv** is a library tahta allows loading environment variables from a ``.env`` file into ``process.env``. This helps keep sensitive information, like API keys and database credentials, out of the codebase and version control system.

- Store database credentials in a ``.env`` file instead of hardcoding sensitive information.
- Reduce the risk of exposing sensitive information by keeping it aout of the codebase and Git.
- Easily switch beetween environments by changing the environment variables.

![Some info](https://stackoverflow.com/questions/48605484/environment-variables-env-in-node-js-express)

## 4. Setup ``app.js``

Create file ``app.js`` in the root of the project. This will be the entry point of the Node.js application.

Write basic setup code for the app.

## 5. Create ``.env`` for Environment Variables

``.env`` file will store database credentials, OAuth client IDs, server settings, etc.

> The port for the database must be **5432** as it is the port PostgreSQL works with.

## 6. Connect to PostgreSQL with Sequelize

### Create the database locally

1. Create database: ``create database swapzy_db;``
2. Create user: ``create user dev_username with encrypted password 'dev_passwd';``
3. Grant permissions to user: ``grant all privileges on database swapzy_db to dev_username;``
4. Exit psql prompt: ``\q``

Create a file ``config/database.js`` to configure Sequelize.

## 7. Setup Sequelize Models

Create a folder for models (What is a Sequelize Model?) ``models/``. Add a basic user model with hashed passwords, ``models/user.js``.

![Info on models](https://sequelize.org/docs/v6/core-concepts/model-basics/)

![Info on defining models](https://sequelize.org/api/v6/class/src/model.js~model#static-method-init)

> No need to use primary key column option nor define a primary key as sequelize does it automatically

## 8. Sync the Database

Shynchronize the Sequelize models with the database.

## 9. Run the Application

~~~ bash
npm start

# Logs displayed
# Server is running on port __
# Database synced
~~~

~~~ bash
npm run dev

# AUto restarts the server when making changes
~~~