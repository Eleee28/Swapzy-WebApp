const express = require('express');
const router = express.Router();
const favController = require('../controller/favoriteController');

const sanitizeMiddleware = require('../middleware/sanitizeMiddleware');

// Apply sanitize middleware
router.use(sanitizeMiddleware);

// Router to get favorite products
router.get('/api/favorite', favController.getFavorite);

// Router to add a product to favorite
router.post('/api/favorite/add', favController.addFavorite);

// Router to delete a product from favorite
router.post('/api/favorite/delete', favController.deleteFavorite);

// Router to get id of favorite products
router.get('/api/favorite/ids', favController.getIds);

module.exports = router;