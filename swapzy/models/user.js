const { Sequelize, DataTypes } = require('sequelize'); // Include only sequelize class and dataTypes object
const sequelize = require('../config/database'); // Include database connection

// Define user model
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    passwd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User; // Export model