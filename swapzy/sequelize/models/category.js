'use strict';
const { Model } = require('sequelize');
const predefinedCategories = require('../data/predefined-categories');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.Product, { foreignKey: 'category' });
    }

    // Mehtod to enforce table has always predefined info (predefined-categories.js) - Chat-GPT
    static async enforceIntegrity() {
      const existingCategories = await Category.findAll();
      const existingIds = existingCategories.map(cat => cat.name_id);

      // Add missing categories
      for (const category of predefinedCategories) {
        if (!existingIds.includes(category.name_id)) {
          await Category.create(category);
        } else {
          const existingCategory = existingCategories.find(cat => cat.name_id === category.name_id);
          if (existingCategory.image !== category.image) {
            existingCategory.image = category.image;
            await existingCategory.save();
          }
        }
      }

      // Remove extra categories
      for (const category of existingCategories) {
        if (!predefinedCategories.find(cat => cat.name_id === category.name_id)) {
          await category.destroy();
        }
      }

      console.log('Category table integrity enforced.');
    }
    // End Chat-GPT snipet
  }
  Category.init({
    name_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'category',
    underscored: true,
  });

  // Chat-GPT snippet start
  // Hooks to prevent modification
  Category.beforeDestroy(() => {
    throw new Error('Deleting categories is not allowed.');
  });

  Category.beforeCreate((category) => {
    const validCategories = predefinedCategories.map(cat => cat.name_id);
    if (!validCategories.includes(category.name_id)) {
      throw new Error(`The category '${category.name_id}' is not allowed.`);
    }
  });
  // End Chat-GPT snippet

  return Category;
};

