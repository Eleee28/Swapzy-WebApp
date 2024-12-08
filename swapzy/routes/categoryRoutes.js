const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

const sanitizeMiddleware = require('../middleware/sanitizeMiddleware');

// Apply sanitize middleware
router.use(sanitizeMiddleware);

// Route to get all categories
router.get('/api/categories', categoryController.getCategories);

module.exports = router;