require('dotenv').config({ path: '../.env' }); // Load environment variables

const config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_URL,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    define: { freezeTableName: true, }, // name of model same as table (no pluralize)
};

// if finally needed or used (SSL)
// const sslConf = {
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorised: false,
//         },
//     },
// };

module.exports = {
    development: {
        ...config, // spread operator
        loggin: (msg) => console.log(msg), // for development show queries on console
    },
    // If needed
    test: {
        username: process.env.TEST_DB_USER || 'root',
        password: process.env.TEST_DB_PASSWORD || null,
        database: process.env.TEST_DB_NAME || 'test_db',
        host: '127.0.0.1',
        dialect: 'postgres',
    },
    production: {
        ...config,
        //...sslConf,
        logging: false, // disable logging in production
    },
};
