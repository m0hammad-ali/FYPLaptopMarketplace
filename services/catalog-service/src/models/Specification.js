const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Specification = sequelize.define('Specification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  laptop_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cpu_model: {
    type: DataTypes.STRING,
  },
  cpu_benchmark: {
    type: DataTypes.INTEGER,
  },
  gpu_model: {
    type: DataTypes.STRING,
  },
  gpu_benchmark: {
    type: DataTypes.INTEGER,
  },
  ram_gb: {
    type: DataTypes.INTEGER,
  },
  storage_gb: {
    type: DataTypes.INTEGER,
  },
  storage_type: {
    type: DataTypes.STRING,
  },
  display_size: {
    type: DataTypes.FLOAT,
  },
  weight_kg: {
    type: DataTypes.FLOAT,
  },
  battery_wh: {
    type: DataTypes.INTEGER,
  },
  price_pkr: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'specifications',
  timestamps: false,
});

module.exports = Specification;
