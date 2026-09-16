const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PriceHistory = sequelize.define('PriceHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  inventory_id: { type: DataTypes.INTEGER, allowNull: false },
  old_price_pkr: { type: DataTypes.INTEGER },
  new_price_pkr: { type: DataTypes.INTEGER },
  changed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'price_history',
  timestamps: false,
});

module.exports = PriceHistory;
