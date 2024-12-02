const express = require('express');
const router = express.Router();
const prodController = require('../controller/productController');

// Route to get all products
router.get('/api/products', prodController.getAll);

// Route to get most recent products
router.get('/api/products/recent', prodController.getRecent);

// Router to get product by ID
router.get('/api/products/:id', prodController.getByID);

// Route to save a product
router.post('/api/products/save', prodController.saveProduct)

// Route to get product condition enum values
router.get('/api/condition-enum', prodController.getConditionValues);

// Router for search operation
router.get('/api/search', prodController.search);

module.exports = router;
