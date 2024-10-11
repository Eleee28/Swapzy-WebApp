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

## Create a model

~~~ bash
npx sequelize-cli model:generate --name User --attributes first_name:string, email:string
~~~

Then modify the model file to change attributes (unique, primary keys, ...)