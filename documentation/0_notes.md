# General Information to Consider

Ignoring for upload on github node_modules/ and .env. Make sure the dependencies and environment variable are locally.

Add protection such as test variables to replace the env ones in case they are not locally.

## Done
- db created
- users table created (maybe change to lowercase and redo migration)

## To do
- finish creating tables (first decide db table structure)
- implement crud operations

- sanitize all text input express sanitize --> test everything works --> dindt work, commented out
- prevent code injection by preparing statements before binding: https://www.postgresql.org/docs/current/sql-prepare.html  -> no need as sequelize automatically handñes sql parametrization, if sql query is used use replacements for parametrization.

- <iframe src="hello.html"></iframe> --> to load html inside html