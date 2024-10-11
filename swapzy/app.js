// This file is the entry point of the application

var express = require('express'); // Include express module
var dotenv = require('dotenv'); // Include dotenv module (for loading environment variables)

var app = express(); // Create express application
dotenv.config(); // Load environment variables


// Hello world example - https://expressjs.com/en/starter/hello-world.html
app.get('/', (req, res) => {
    res.send('Hello World!');
});

var port = 3000; // Will later be changed with env vars

app.listen(port, () => {
    console.log('Example app listening on port ${port}');
});