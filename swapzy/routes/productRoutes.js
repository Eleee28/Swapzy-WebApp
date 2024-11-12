const express = require('express');
const router = express.Router();
const prodController = require('../controller/productController');

// Route to get all products
router.get('/api/products', prodController.getAll);

// Route to get most recent products
router.get('/api/products/recent', prodController.getRecent);

// Router to get product by ID
router.get('/api/products/:id', prodController.getByID);


module.exports = router;
