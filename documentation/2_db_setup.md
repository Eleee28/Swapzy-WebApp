# Database Setup Notes

![Sequelize](https://sequelize.org/)

![Getting Started video](https://www.youtube.com/watch?v=p-yKR7GusqM)

## Setup

1. First initialize sequelize in the project to crate the needed directories: ``npx sequelize-cli init``.

2. Change sequelize configuration to add db info.

**Index.js**
sslmode -> check if we want to add TLS to provide with an encripted link between server and client.

**Config.js**
Research on ssl options and implementation, code commented.

## Important changes for improving sequelize files after first test ``database.js``

- Use a shared config file between ``database.js`` and ``config.js``, for having the logic for configuring database connection.
- This file will be imported to both files.

## Create a model

~~~ bash
npx sequelize-cli model:generate --name User --attributes email:string,passwd:string
~~~

Then modify the model file to change attributes (unique, primary keys, ...).

**Associate** is where all the foreing key associations would go.

### Migrations
Migrations can be thought as commits or log for some change in database.

They have an up and a down function. The **up** function is executed when we run the migration. The **down** function is executed when we undo the migration.

~~~ bash
# Run migration
npx sequelize-cli db:migrate

# Undo migration
npx sequelize-cli db:migrate:undo
~~~