const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Inventory = require('../models/Inventory');
dotenv.config();

const categories = ['Electronics', 'Clothing', 'Home', 'Toys', 'Books', 'Sports', 'Beauty', 'Food'];
const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];
const warehouses = ['Main Warehouse', 'East Warehouse', 'West Warehouse', 'North Warehouse'];

const generateRandomInventory = (count = 100) => {
  const inventoryItems = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const dailySales = Math.floor(Math.random() * 20) + 1;
    const leadTime = Math.floor(Math.random() * 14) + 3;
    const safetyStock = Math.ceil(dailySales * leadTime * 0.5);
    const reorderPoint = Math.ceil(dailySales * leadTime + safetyStock);
    const maxStock = Math.ceil(dailySales * 30);
    const currentStock = Math.floor(Math.random() * (maxStock * 1.5));
    
    const item = {
      sku: `SKU-${1000 + i}`,
      productName: `${category} Product ${i}`,
      category,
      description: `High-quality ${category.toLowerCase()} product`,
      currentStock,
      unitCost: parseFloat((Math.random() * 100 + 10).toFixed(2)),
      sellingPrice: parseFloat((Math.random() * 150 + 20).toFixed(2)),
      reorderPoint,
      safetyStock,
      maxStockLevel: maxStock,
      leadTime,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
      location: `Aisle ${Math.floor(Math.random() * 20) + 1}, Shelf ${Math.floor(Math.random() * 10) + 1}`,
      image: `https://picsum.photos/seed/${i}/200/200`,
      dailySales,
      weeklySales: dailySales * 7,
      monthlySales: dailySales * 30,
      totalSales: dailySales * 365,
      forecastDemand: Math.round(dailySales * 30 * (0.8 + Math.random() * 0.4)),
      forecastAccuracy: Math.floor(Math.random() * 20) + 80,
      status: ['active', 'active', 'active', 'seasonal', 'new'][Math.floor(Math.random() * 5)],
      turnoverRate: parseFloat((Math.random() * 8 + 2).toFixed(2)),
      daysOfSupply: Math.floor(currentStock / dailySales),
      salesHistory: Array.from({ length: 30 }, (_, idx) => ({
        date: new Date(Date.now() - (30 - idx) * 24 * 60 * 60 * 1000),
        quantity: Math.floor(dailySales * (0.5 + Math.random())),
        revenue: Math.floor(dailySales * (0.5 + Math.random()) * (Math.random() * 150 + 20))
      })),
      stockHistory: Array.from({ length: 5 }, (_, idx) => ({
        date: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
        quantity: Math.floor(Math.random() * 50) + 10,
        action: ['purchase', 'sale', 'adjustment'][Math.floor(Math.random() * 3)]
      }))
    };
    
    inventoryItems.push(item);
  }
  
  return inventoryItems;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Inventory.deleteMany({});
    console.log('Cleared existing inventory data');
    
    // Generate and insert new data
    const inventoryItems = generateRandomInventory(150);
    await Inventory.insertMany(inventoryItems);
    console.log(`Seeded ${inventoryItems.length} inventory items`);
    
    // Calculate summary statistics
    const stats = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$currentStock', '$unitCost'] } },
          avgTurnover: { $avg: '$turnoverRate' }
        }
      }
    ]);
    
    console.log('\nDatabase Statistics:');
    console.log(`Total Items: ${stats[0]?.totalItems || 0}`);
    console.log(`Total Inventory Value: $${(stats[0]?.totalValue || 0).toFixed(2)}`);
    console.log(`Average Turnover Rate: ${(stats[0]?.avgTurnover || 0).toFixed(2)}x`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();