const { sequelize, Shop } = require('./models');

// Demo shops based on real Gulhaji Plaza coordinates
const demoShops = [
  {
    vendor_id: 1,
    name: 'Ali Computers',
    address: 'Gulhaji Plaza, Floor 1, Shop 12, Peshawar',
    latitude: 34.0151,
    longitude: 71.5249,
    phone: '+923001234567',
  },
  {
    vendor_id: 2,
    name: 'Star Tech Laptops',
    address: 'Gulhaji Plaza, Floor 2, Shop 5, Peshawar',
    latitude: 34.0152,
    longitude: 71.525,
    phone: '+923007654321',
  },
  {
    vendor_id: 3,
    name: 'Peshawar IT Hub',
    address: 'Gulhaji Plaza, Ground Floor, Shop 20, Peshawar',
    latitude: 34.015,
    longitude: 71.5248,
    phone: '+923009876543',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

    for (const s of demoShops) {
      await Shop.findOrCreate({ where: { name: s.name }, defaults: s });
    }

    console.log(`Seeded ${demoShops.length} demo shops`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
