require('dotenv').config({ path: '../.env' }); // Load environment variables
const dbConfig = require('./dbConfig');

module.exports = {
  development: dbConfig.development,
  test: dbConfig.test,
  production: dbConfig.production,
};