'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.Product, { foreignKey: 'seller' });

      this.hasMany(models.Favorite, { foreignKey: 'user' });
    }
  }
  Users.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      comment: 'Location (latitude, longitude)',
    },
    profile_img: {
      type: DataTypes.STRING,
    },
    /*
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0,
    }, */
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    underscored: true,
    timestamps: true,
  });
  return Users;
};