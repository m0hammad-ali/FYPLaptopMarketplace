const { sequelize, Laptop, Specification } = require('./models');

const laptopsData = [
  {
    brand: 'HP',
    model: 'Pavilion 15',
    release_year: 2022,
    category: 'everyday',
    specification: {
      cpu_model: 'Intel Core i5-1235U',
      cpu_benchmark: 13500,
      gpu_model: 'Intel Iris Xe',
      gpu_benchmark: 3000,
      ram_gb: 8,
      storage_gb: 512,
      storage_type: 'NVMe SSD',
      display_size: 15.6,
      weight_kg: 1.75,
      battery_wh: 41,
      price_pkr: 182000,
    },
  },
  {
    brand: 'Dell',
    model: 'XPS 13',
    release_year: 2023,
    category: 'ultrabook',
    specification: {
      cpu_model: 'Intel Core i7-1360P',
      cpu_benchmark: 18000,
      gpu_model: 'Intel Iris Xe',
      gpu_benchmark: 3500,
      ram_gb: 16,
      storage_gb: 512,
      storage_type: 'NVMe SSD',
      display_size: 13.4,
      weight_kg: 1.2,
      battery_wh: 55,
      price_pkr: 336000,
    },
  },
  {
    brand: 'Apple',
    model: 'MacBook Air M2',
    release_year: 2022,
    category: 'ultrabook',
    specification: {
      cpu_model: 'Apple M2',
      cpu_benchmark: 17000,
      gpu_model: 'Apple M2 GPU',
      gpu_benchmark: 10000,
      ram_gb: 8,
      storage_gb: 256,
      storage_type: 'NVMe SSD',
      display_size: 13.6,
      weight_kg: 1.24,
      battery_wh: 52,
      price_pkr: 308000,
    },
  },
  {
    brand: 'Asus',
    model: 'ROG Strix G15',
    release_year: 2023,
    category: 'gaming',
    specification: {
      cpu_model: 'Intel Core i9-13900H',
      cpu_benchmark: 30000,
      gpu_model: 'NVIDIA RTX 4070',
      gpu_benchmark: 22000,
      ram_gb: 32,
      storage_gb: 1024,
      storage_type: 'NVMe SSD',
      display_size: 15.6,
      weight_kg: 2.1,
      battery_wh: 90,
      price_pkr: 560000,
    },
  },
  {
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon',
    release_year: 2023,
    category: 'office',
    specification: {
      cpu_model: 'Intel Core i7-1365U',
      cpu_benchmark: 16000,
      gpu_model: 'Intel Iris Xe',
      gpu_benchmark: 3000,
      ram_gb: 16,
      storage_gb: 512,
      storage_type: 'NVMe SSD',
      display_size: 14.0,
      weight_kg: 1.12,
      battery_wh: 57,
      price_pkr: 392000,
    },
  },
  {
    brand: 'Acer',
    model: 'Nitro 5',
    release_year: 2022,
    category: 'gaming',
    specification: {
      cpu_model: 'AMD Ryzen 7 5800H',
      cpu_benchmark: 20000,
      gpu_model: 'NVIDIA RTX 3060',
      gpu_benchmark: 16000,
      ram_gb: 16,
      storage_gb: 512,
      storage_type: 'NVMe SSD',
      display_size: 15.6,
      weight_kg: 2.3,
      battery_wh: 57,
      price_pkr: 266000,
    },
  },
  {
    brand: 'MSI',
    model: 'Prestige 14',
    release_year: 2023,
    category: 'workstation',
    specification: {
      cpu_model: 'Intel Core i7-13700H',
      cpu_benchmark: 22000,
      gpu_model: 'NVIDIA RTX 4060',
      gpu_benchmark: 18000,
      ram_gb: 32,
      storage_gb: 1024,
      storage_type: 'NVMe SSD',
      display_size: 14.0,
      weight_kg: 1.29,
      battery_wh: 72,
      price_pkr: 448000,
    },
  },
  {
    brand: 'Dell',
    model: 'Inspiron 15',
    release_year: 2023,
    category: 'everyday',
    specification: {
      cpu_model: 'AMD Ryzen 5 5500U',
      cpu_benchmark: 12000,
      gpu_model: 'AMD Radeon Graphics',
      gpu_benchmark: 2500,
      ram_gb: 8,
      storage_gb: 256,
      storage_type: 'SATA SSD',
      display_size: 15.6,
      weight_kg: 1.8,
      battery_wh: 41,
      price_pkr: 154000,
    },
  },
  {
    brand: 'HP',
    model: 'Spectre x360',
    release_year: 2022,
    category: 'ultrabook',
    specification: {
      cpu_model: 'Intel Core i7-1255U',
      cpu_benchmark: 15000,
      gpu_model: 'Intel Iris Xe',
      gpu_benchmark: 3000,
      ram_gb: 16,
      storage_gb: 512,
      storage_type: 'NVMe SSD',
      display_size: 13.5,
      weight_kg: 1.34,
      battery_wh: 66,
      price_pkr: 364000,
    },
  },
  {
    brand: 'Lenovo',
    model: 'Legion 5 Pro',
    release_year: 2023,
    category: 'gaming',
    specification: {
      cpu_model: 'AMD Ryzen 7 7745HX',
      cpu_benchmark: 28000,
      gpu_model: 'NVIDIA RTX 4060',
      gpu_benchmark: 18000,
      ram_gb: 16,
      storage_gb: 512,
      storage_type: 'NVMe SSD',
      display_size: 16.0,
      weight_kg: 2.5,
      battery_wh: 80,
      price_pkr: 420000,
    },
  },
  {
    brand: 'Apple',
    model: 'MacBook Pro 14',
    release_year: 2023,
    category: 'workstation',
    specification: {
      cpu_model: 'Apple M2 Pro',
      cpu_benchmark: 24000,
      gpu_model: 'Apple M2 Pro GPU',
      gpu_benchmark: 15000,
      ram_gb: 16,
      storage_gb: 512,
      storage_type: 'NVMe SSD',
      display_size: 14.2,
      weight_kg: 1.6,
      battery_wh: 70,
      price_pkr: 560000,
    },
  },
  {
    brand: 'Asus',
    model: 'Zenbook 14',
    release_year: 2023,
    category: 'everyday',
    specification: {
      cpu_model: 'AMD Ryzen 5 7530U',
      cpu_benchmark: 14000,
      gpu_model: 'AMD Radeon Graphics',
      gpu_benchmark: 2500,
      ram_gb: 8,
      storage_gb: 256,
      storage_type: 'NVMe SSD',
      display_size: 14.0,
      weight_kg: 1.39,
      battery_wh: 75,
      price_pkr: 196000,
    },
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync({ force: true });
    console.log('Tables recreated (force: true)');

    for (const item of laptopsData) {
      const laptop = await Laptop.create({
        brand: item.brand,
        model: item.model,
        release_year: item.release_year,
        category: item.category,
      });

      await Specification.create({
        laptop_id: laptop.id,
        ...item.specification,
      });
    }

    console.log(`Seeded ${laptopsData.length} laptops successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
