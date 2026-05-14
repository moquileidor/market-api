const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'paid',
          'shipped',
          'delivered',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'orders',
      underscored: true,
    }
  );
