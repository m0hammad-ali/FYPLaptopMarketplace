const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Laptop = sequelize.define('Laptop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  release_year: {
    type: DataTypes.INTEGER,
  },
  category: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'laptops',
  timestamps: false,
});

module.exports = Laptop;
