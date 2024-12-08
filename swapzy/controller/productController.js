const { Product } = require('../sequelize/models');
const { Op } = require('sequelize');

// Controller method to get all products
exports.getAll = async function (req, res) {
    try {
        var category = req.query.category;
        var seller = req.query.seller;

        const filter = {};
        
        if (category) {
            category = decodeURIComponent(category);
            if (category !== "favorite")
                filter.category = category;
        }

        if (seller) {
            seller = decodeURIComponent(seller);
            filter.seller = seller;
        }

        const products = await Product.findAll({
            attributes: ['id', 'name', 'description', 'price', 'condition', 'location', 'image_url'],
            where: filter,
            order: [['created_at', 'DESC']]
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products"});
    }
}

// Controller method to get most recent products
exports.getRecent = async function (req, res) {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'image_url'],
            order: [['created_at', 'DESC']],
            limit: 10,
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products"});
    }
}

// Controller to get a product by ID
exports.getByID = async function (req, res) {
    const id = req.params.id;

    try {
        const product = await Product.findByPk(id);
        if (!product)
            res.status(404).json({ message: "Product not found" });
        else
            res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
    
};

// Controller to save a product
exports.saveProduct = async function (req, res) {
    try {
        const { name, category, price, description, condition, image_url, location } = req.body;
        const user = req.session.username;

        if (!name || !category || !price || !description || !condition || !image_url || !location.lat || !location.lng) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const product = await Product.create({
            seller: user,
            name,
            description,
            condition: condition,
            price,
            category,
            location: {
                type: 'Point',
                coordinates: [location.lng, location.lat],
            },
            image_url: image_url
        })
        res.status(201).json({ message: 'Product saved succesfully', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error ocurred saving the product' });
    }
}

exports.getConditionValues = function (req, res) {
    const conditionEnumValues = Product.rawAttributes.condition.values;
    res.json(conditionEnumValues);
}

// Controller for search functionality
exports.search = async function (req, res) {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } }, // Case-insensitive match for name
                ]
            },
            attributes: ['id', 'name', 'price', 'image_url'],
            limit: 6
        });

        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching search results: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Controller method to delete a product by id
exports.deleteProduct = async function (req, res) {
    const id = req.body.prodId;

    try {
        const product = await Product.findByPk(id);
        if (product) {
            await product.destroy();
            res.json(product);
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};