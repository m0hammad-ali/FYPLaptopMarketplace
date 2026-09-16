const sequelize = require('../config/database');
const Inventory = require('./Inventory');
const PriceHistory = require('./PriceHistory');
const User = require('./User');
const Vendor = require('./Vendor');

// Associations
Inventory.hasMany(PriceHistory, { foreignKey: 'inventory_id', onDelete: 'CASCADE' });
PriceHistory.belongsTo(Inventory, { foreignKey: 'inventory_id' });

User.hasOne(Vendor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Vendor.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, Inventory, PriceHistory, User, Vendor };
