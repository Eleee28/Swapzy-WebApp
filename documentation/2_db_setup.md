# Database Setup Notes

[Sequelize](https://sequelize.org/)

[Sequelize Querying](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)

[Getting Started video](https://www.youtube.com/watch?v=p-yKR7GusqM)

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

**Comments** can be added using 'comment:' to an attribute. This comment will be added to the table definition in SQL.

## DataTypes

[Sequelize datatypes](https://sequelize.org/docs/v7/models/data-types/)

[PostGIS install and cheatsheets](https://www.postgis.net/)

To be able to use GEOGRAPHY data type, must install and enable PostGIS on PostgreSQL:

- [Install](https://docs.vultr.com/how-to-install-the-postgis-extension-for-postgresql) 

- Enable: ``create extension postgis;``

**Geography DataType**

- [Sequelize man](https://sequelize.org/api/v6/class/src/data-types.js~geography)

- [Sequelize org (functions man)](https://sequelize.org/api/v7/classes/_sequelize_core.index._internal_.geography)

**Decimal DataType**

``DECIMAL(3, 2)`` 

3 is the precision (how many digits)
2 is the scale (how many digits to the right of the decimal point)

## Associations and Foreign Keys

[Associations Manual](https://sequelize.org/docs/v6/core-concepts/assocs/)

[Video](https://www.youtube.com/watch?v=NXeDkp9BZAY&list=PLp8YCP6EV3eLGyNdFyZ5uGfAjRN0KjwTv&index=3)

Associoations must be defined in both models.
Define the attributes as usual but add references attribute inside the fk.
Then define the aasociations in the associations function.

### Migrations
Migrations can be thought as commits or log for some change in database.

They have an up and a down function. The **up** function is executed when we run the migration. The **down** function is executed when we undo the migration.

~~~ bash
# Run migration
npx sequelize-cli db:migrate

# Undo migration
npx sequelize-cli db:migrate:undo
~~~

## Database structure

![db structure](db_structure.png)

~~~ DBML
Table user {
  username string [primary key]
  email string
  password string
  location geography
  profile_img string // image url
}

Table product {
  id integer [primary key]
  seller string // foreign key
  name string
  description string // maybe more chars (text)
  condition enum // 'new', 'like new', ...
  price double
  category string // foreign key
  location geography
  image_url string
}

Table category {
  name string [primary key]
}

Table favorites {
  id integer [primary key]
  user integer // fk
  product_id integer // fk
}

Ref: product.seller < user.username

Ref: product.category < category.name

Ref: favorites.user < user.username

Ref: favorites.product_id < product.id
~~~