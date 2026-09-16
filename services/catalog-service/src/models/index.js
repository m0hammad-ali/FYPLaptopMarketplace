const sequelize = require('../config/database');

const User = require('./User');
const Vendor = require('./Vendor');
const Shop = require('./Shop');
const Laptop = require('./Laptop');
const Specification = require('./Specification');
const Review = require('./Review');
const Notification = require('./Notification');

// User 1:1 Vendor
User.hasOne(Vendor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Vendor.belongsTo(User, { foreignKey: 'user_id' });

// Vendor 1:N Shops
Vendor.hasMany(Shop, { foreignKey: 'vendor_id', onDelete: 'CASCADE' });
Shop.belongsTo(Vendor, { foreignKey: 'vendor_id' });

// Laptop 1:1 Specification
Laptop.hasOne(Specification, { foreignKey: 'laptop_id', onDelete: 'CASCADE' });
Specification.belongsTo(Laptop, { foreignKey: 'laptop_id' });

// User 1:N Reviews
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// Laptop 1:N Reviews
Laptop.hasMany(Review, { foreignKey: 'laptop_id' });
Review.belongsTo(Laptop, { foreignKey: 'laptop_id' });

// User 1:N Notifications
User.hasMany(Notification, { foreignKey: 'recipient_id' });
Notification.belongsTo(User, { foreignKey: 'recipient_id' });

module.exports = {
  sequelize,
  User,
  Vendor,
  Shop,
  Laptop,
  Specification,
  Review,
  Notification,
};
