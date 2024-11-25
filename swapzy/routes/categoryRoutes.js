const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

// Route to get all categories
router.get('/api/categories', categoryController.getCategories);

module.exports = router;