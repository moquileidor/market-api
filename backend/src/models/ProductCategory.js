const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'ProductCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'product_categories',
      underscored: true,
      timestamps: false,
    }
  );
