// This file is the entry point of the application

// Import external modules
const express = require('express'); // Express module
const http = require('http'); // HTTP module
const session = require('express-session'); // Express session
const redis = require('redis'); // Redis module
const RedisStore = require('connect-redis').default; // Connect redis
require('dotenv').config(); // Load environment variables

// Import internal modules
const sequelize = require('./sequelize/config/database'); // Database configuration

// Import routes
const userRoutes = require('./routes/userRoutes'); // User routes
const prodRoutes = require('./routes/productRoutes'); // Product routes
const favRoutes = require('./routes/favoriteRoutes'); // Favorite routes

var app = express(); // Initialize express application

// Serve static files from "view" directory
app.use(express.static(__dirname + "/view"));

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define application port
var port = process.env.PORT || 8080;

// Redis Client setup
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

// Configure session with Redis store
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        resave: false, // Prevents session from being saved back if it wasn't modified
        saveUninitialized: false, // Prevents saving uninitialized sessions
        cookie: { // Session cookie configuration
            httpOnly: true, // Help prevent cross-site scripting (XSS) attacks -- Chat-gpt
            maxAge: 30 * 60 * 1000, // 30 minutes of inactivity timeout (milliseconds)
            //expires: new Date(Date.now() + 30 * 60 * 100), // exact expiration time ?
        }
    })
)

// Serve main HTML page on the root route
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/main.html');
});

//DEBUG - session expiry
// app.use((req, res, next) => {
//     console.log('Session ID: ', req.sessionID);
//     console.log('Session username: ', req.session.username);
//     next();
// })

// Set up routes
app.use('/', userRoutes);
app.use('/', prodRoutes);
app.use('/', favRoutes);

// Handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
})

// Sync database and start server
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
        process.exit(1); // Exit if database connection fails
    });

// Close database connection when app is terminated
process.on('SIGINT', () => {
    try {
        sequelize.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error closing database connection:", error.message || error);
    }
    process.exit(0);
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
