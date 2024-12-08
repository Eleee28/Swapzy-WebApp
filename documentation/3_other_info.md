# Other information

## CRUD operations

[Rest API and Implement CRUD oprations](https://medium.com/@mtalhanasir96/building-your-first-rest-api-with-node-js-express-and-sequelize-b041f9910b8a)

## Leaflet JS api documentation

[LeafletJS doc](https://leafletjs.com/examples/quick-start/)

## Application Security

To enforce application security, two important things must be done:

- Text input sanitize: this will be done using [``dompurify``](https://github.com/cure53/DOMPurify)

- Prevent code injection by preparing statements: we have no need to explicitly do this as sequelize internally handles it for us.

### DOMPurify

1. Install dependencies:

    ~~~ bash
    npm install dompurify jsdom
    ~~~