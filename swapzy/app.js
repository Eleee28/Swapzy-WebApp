// This file is the entry point of the application

const express = require('express'); // Include express module
const dotenv = require('dotenv'); // Include dotenv module (for loading environment variables)
const sequelize = require('./config/database');


var app = express(); // Create express application
dotenv.config(); // Load environment variables


// Hello world example - https://expressjs.com/en/starter/hello-world.html
app.get('/', (req, res) => {
    res.send('Welcome to Swapzy Server!');
});

var port = process.env.PORT || 3000; // Ensure port takes value if env var is not found

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});