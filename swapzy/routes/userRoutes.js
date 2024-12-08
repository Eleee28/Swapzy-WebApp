const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

const sanitizeMiddleware = require('../middleware/sanitizeMiddleware');

// Apply sanitize middleware
router.use(sanitizeMiddleware);

//  Route to register a user
router.post('/api/register', userController.createUser);

// Route for user login
router.post('/api/login', userController.login);

// Route for user logout
router.post('/api/logout', userController.logout);

// Route to get user by username
router.get('/api/users/:username', userController.getById);

// Route to update a user by username
router.put('/api/users', userController.updateUser);

// Route to check login
router.get('/api/check-login', userController.checkLogin);

// Route to get user's location
router.get('/api/location', userController.getUserLocation);

// Route for alerting user when session is about to expire
router.get('/api/session-info', userController.sessionInfo);

// Route to delete current user
router.delete('/api/delete-user', userController.deleteUser);


module.exports = router;