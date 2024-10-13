require('dotenv').config({ path: '../.env' }); // Load environment variables
const dbConfig = require('./dbConfig');

module.exports = {
  development: dbConfig.development,
  test: dbConfig.test,
  production: dbConfig.production,
};


// Previous (delete when new proven to work)

// module.exports = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_URL,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//     // dialectOptions: {
//     //   ssl: {
//     //     require: true,
//     //     rejectUnathorized: false, 
//     //   },
//     // },
//   },
//   test: {
//     username: root,
//     password: null,
//     database: database_test,
//     host: '127.0.0.1',
//     dialect: 'postgres',
//   },
//   production: {
//     username: root,
//     password: null,
//     database: database_production,
//     host: '127.0.0.1',
//     dialect: 'postgres',
//   }
// }
