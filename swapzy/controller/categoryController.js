const { Category } = require('../sequelize/models');

// Controller method to get all categories
exports.getCategories = async function (re, res) {
    try {
        const categories = await Category.findAll({
            attributes: ['name_id', 'image'],
            order: [['created_at', 'ASC']]
        });

        res.status(200).json(categories);
    } catch (err) {
        console.error("Error fetching categories: ", err);
        res.status(500).json({ message: "Error fetching categories" });
    }
}