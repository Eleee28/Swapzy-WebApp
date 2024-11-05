// This file is the entry point of the application

const express = require('express'); // Include express module
const http = require('http');
require('dotenv').config(); // Load environment variables
const sequelize = require('./sequelize/config/database');
//const { Users, Product } = require ('./sequelize/models'); // Import models
const userRoutes = require('./routes/userRoutes');

var app = express(); // Create express application

// Serve static files from "view" directory
app.use(express.static(__dirname + "/view"));

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up port
var port = process.env.PORT || 8080;

// Serve index.html on the root route
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/html/index.html');
});

// Set up routes
app.use('/', userRoutes);

// Sync database and Start server
sequelize.sync()
    .then(() => {
        console.log("Database synced successfully");
        
        // Start the server after successful sync
        http.createServer(app).listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch(error => {
        console.error("Error syncing the database: ", error);

    });

// Close database connection when app is terminated
process.on('SIGINT', () => {
    sequelize.close();
    console.log("PostgreSQL client disconnected");
    process.exit();
});

/* NOTE - delete

// Serving data from database tests

// Route to serve users data from database (username and email)
app.get('/users', async function (req, res) {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'username', 'email']
        });
        res.json(users);
    } catch (err) {
        console.log("Error fetching users data ", err);
        res.status(500).send("Internal Server Error");
    }
});

// Dynamic route to specific user entry by id
app.get('/users/:id', async function (req, res) {
    var user_id = req.params.id;

    try {
        const user = await Users.findByPk(user_id, {
            attributes: ['username', 'email']
        });
        if (!user)
            return res.status(404).send("User not found");
        res.json(user);
    } catch (err) {
        console.log("Error fetching user ", err);
        res.status(500).send("Internal Server Error");
    }
});

// Route to serve product data from database (name and price)
app.get('/products', async function (req, res) {
    try {
        console.log('Product model: ', Product);

        const products = await Product.findAll({
            attributes: ['name', 'price'],
            include: [{
                model: Users,
                attributes: ['username']
            }]
        });
        res.json(products);
    } catch (err) {
        console.log("Error fetching products data ", err);
        res.status(500).send("Internal Server Error");
    }
});

// Dynamic route to specific user entry by id
app.get('/products/:id', async function (req, res) {
    var product_id = req.params.id;

    try {
        const product = await Product.findByPk(product_id, {
            attributes: ['name', 'price'],
            include: [{
                model: Users,
                attributes: ['username']
            }]
        });
        if (!product)
            return res.status(404).send("Product not found");
        res.json(product);
    } catch (err) {
        console.log("Error fetching product ", err);
        res.status(500).send("Internal Server Error");
    }
});

*/
