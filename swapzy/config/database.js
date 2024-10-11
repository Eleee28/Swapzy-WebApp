const { Sequelize } = require('sequelize'); // Include only sequelize class (not the whole object)
require('dotenv').config(); // Load environment variables

// Sequelize connection - https://stackoverflow.com/questions/62556633/sequelize-6-import-models-from-file
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWD,
    {
        host: process.env.DB_URL,
        port: process.env.DB_PORT,
        dialect: "postgres",
        define: { freezeTableName: true }, // name of model same as table (no pluralize)
        logging: (msg) => console.log(msg), // turn to false once proyect is finished to avoid displaying queries on console
    }
)

// DEBUG - Test connection
console.info("SETUP - Connecting to database...");

sequelize.authenticate() // Try to connect with provided config
        .then(() => {
            console.info("INFO - Database connected");
        })
        .catch((e) => {
            console.log("ERROR - Unable to connect to database:", e)
        })

module.exports = sequelize; // Export sequelize instance to be used in other parts
