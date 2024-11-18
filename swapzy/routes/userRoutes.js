const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Route to get all users
//router.get('/', userController.getAllUsers);

// Route to get a user by id
//router.get('/:id', userController.getUserById);

// Route to create a new user
//router.post('/', userController.createUser);

// Route to update a user by id
//router.put('/:id', userController.updateUser);

// Route to delete a user by id
//router.delete('/:id', userController.deleteUser);

//  Route to register a user
router.post('/register', userController.createUser);

// Route for user login
router.post('/login', userController.login);

// Route for user logout
router.post('/logout', userController.logout);

// Route to get user by username
router.get('/api/users/:username', userController.getById);

// Route to update a user by username
router.put('/api/users', userController.updateUser);

// Route to check login
router.get('/api/check-login', userController.checkLogin);

// Route to get user's location
router.get('/api/location', userController.getUserLocation);

module.exports = router;