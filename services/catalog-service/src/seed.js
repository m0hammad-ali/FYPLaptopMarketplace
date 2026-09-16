const fs = require('fs');
const path = require('path');
const { sequelize, Laptop, Specification } = require('./models');

async function seed() {
  const dataPath = path.join(__dirname, '..', 'seed-data', 'laptops.json');

  if (!fs.existsSync(dataPath)) {
    console.error('ERROR: seed-data/laptops.json not found.');
    console.error('Run the scraper first: cd scripts/scraper && python run.py');
    process.exit(1);
  }

  const laptops = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Loaded ${laptops.length} laptops from JSON`);

  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync({ force: true });
    console.log('Tables recreated');

    let count = 0;
    for (const item of laptops) {
      const spec = item.specification || {};

      const laptop = await Laptop.create({
        brand: item.brand,
        model: item.model,
        release_year: item.release_year || 2023,
        category: item.category || 'everyday',
      });

      await Specification.create({
        laptop_id: laptop.id,
        cpu_model: spec.cpu_model,
        cpu_benchmark: spec.cpu_benchmark,
        gpu_model: spec.gpu_model,
        gpu_benchmark: spec.gpu_benchmark,
        ram_gb: spec.ram_gb,
        storage_gb: spec.storage_gb,
        storage_type: spec.storage_type,
        display_size: spec.display_size,
        weight_kg: spec.weight_kg,
        battery_wh: spec.battery_wh,
        price_pkr: item.price_pkr,
      });

      count++;
    }

    console.log(`Seeded ${count} laptops successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
