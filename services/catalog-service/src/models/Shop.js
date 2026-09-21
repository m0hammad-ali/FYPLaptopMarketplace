const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shop = sequelize.define('Shop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vendor_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  phone: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'shops',
  timestamps: false,
});

module.exports = Shop;
