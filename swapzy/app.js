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
const { Category } = require('./sequelize/models'); // Import Category model to enforce integrity

// Import routes
const userRoutes = require('./routes/userRoutes'); // User routes
const prodRoutes = require('./routes/productRoutes'); // Product routes
const favRoutes = require('./routes/favoriteRoutes'); // Favorite routes
const catRoutes = require('./routes/categoryRoutes'); // Category routes

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
        }
    })
)

// REVIEW - need to catch the cookie to check if it expired or not
// Middleware to check session expiration
// app.use(function (req, res, next) {
//     if (!req.session)
//         return res.redirect('/'); // redirect user to root route
    
//     const sessionAge = req.session.cookie.expires;
//     if (sessionAge <= 0) {
//         try {
//             req.session.destroy();
//             return res.redirect('/');
//         } catch (err) {
//             console.error("Error destroying session: ", err);
//         }
//     } else {
//         next();
//     }
// })

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
app.use('/', catRoutes);

// Handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
})

// Sync database and start server
sequelize.sync()
    .then(async () => {
        console.log("Database synced successfully");
        
        // Enforce category table integrity
        try {
            await Category.enforceIntegrity();
        } catch (err) {
            console.error("Error enforcing category integrity: ", err);
        }

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
