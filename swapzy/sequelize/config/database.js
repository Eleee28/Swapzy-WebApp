const { Sequelize } = require('sequelize'); // Include only sequelize class (not the whole object)
const dbConfig = require('./dbConfig'); // Include db config file

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env]; // select correct environment config

// Sequelize connection
const sequelize = new Sequelize(
    config.database,
    config.username, 
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        define: config.define,
        logging: config.logging,
    }
);

// DEBUG - Test connection
console.info(`SETUP - Connecting to ${env} database...`);

sequelize.authenticate() // Try to connect with provided config
    .then(() => {
        console.info(`INFO - ${env} database connected`);
    })
    .catch((e) => {
        console.log(`ERROR - Unable to connect to ${env} database:`, e)
    });

module.exports = sequelize; // Export sequelize instance to be used in other parts



// Previous connection (delete when proven this to work)

// Sequelize connection - https://stackoverflow.com/questions/62556633/sequelize-6-import-models-from-file
// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_URL,
//         port: process.env.DB_PORT,
//         dialect: "postgres",
//         define: { freezeTableName: true }, // name of model same as table (no pluralize)
//         logging: (msg) => console.log(msg), // turn to false once proyect is finished to avoid displaying queries on console
//     }
// )

