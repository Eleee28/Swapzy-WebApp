const { Favorite } = require('../sequelize/models');
const { Product } = require('../sequelize/models');

// Controller method to get favorite products
exports.getFavorite = async function (req, res) {
    const username = req.session.username;

    if (!username) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const products = await Product.sequelize.query(`
            SELECT p.id as id, p.name as name, p.price as price, p.image_url as image_url
            FROM product p
            INNER JOIN favorite f ON p.id = f.product_id
            WHERE f.user = :username
            ORDER BY p.created_at DESC
            LIMIT 10;
            `, {
                replacements: { username }
            });
        res.json(products[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products" });
    }
}

// Controller to add a product to favorite
exports.addFavorite = async function (req, res) {
    const { prodId } = req.body;
    const username = req.session.username;

    try {
        const existFav = await Favorite.findOne({
            where: { product_id: prodId, user: username }
        });

        if (existFav)
            return res.status(400).json({ message: 'Product already in favorites' });

        // Insert product into favorites
        await Favorite.create({ product_id: prodId, user: username });

        res.status(200).json({ message: 'Product added to favorites' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding product to favorites'});
    }
}

// Controller to delete a product from favorite
exports.deleteFavorite = async function (req, res) {
    const { prodId } = req.body;
    const username = req.session.username;

    try {
        const existFav = await Favorite.findOne({
            where: { product_id: prodId, user: username }
        });

        if (!existFav)
            return res.status(400).json({ message: 'Product not in favorites' });

        await existFav.destroy(); // Delete favorite record

        res.status(200).json({ message: 'Product deleted from favorites' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting product from favorites' });
    }
}

// Controller method to get favorite product ids
exports.getIds = async function (req, res) {
    const username = req.session.username;

    if (!username) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const products = await Product.sequelize.query(`
            SELECT p.id as id
            FROM product p
            INNER JOIN favorite f ON p.id = f.product_id
            WHERE f.user = :username;
            `, {
                replacements: { username }
            });
        res.json(products[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products" });
    }
}