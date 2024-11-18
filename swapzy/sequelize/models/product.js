'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //seller foreign key
      this.belongsTo(models.Users, { foreignKey: 'seller' });

      this.belongsTo(models.Category, { foreignKey: 'category' });

      this.hasMany(models.Favorite, { foreignKey: 'product_id' });
    }
  }
  Product.init({
    seller: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    condition: {
      type: DataTypes.ENUM('new', 'like new', 'used', 'damaged'),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'category',
        key: 'name'
      }
    },
    location: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
    underscored: true,
  });
  return Product;
};