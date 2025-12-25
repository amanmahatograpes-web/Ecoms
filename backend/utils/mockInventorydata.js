// utils/mockInventoryData.js
const generateMockInventoryData = (count = 100) => {
  const categories = [
    'Electronics',
    'Books',
    'Home & Kitchen',
    'Clothing',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Health & Household',
    'Grocery'
  ];
  
  const warehouses = ['FBA-1', 'FBA-2', 'FBA-3', 'FBM-1', 'FBM-2'];
  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];
  const statuses = ['active', 'inactive', 'stranded'];
  
  const products = [];
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const dailySales = Math.random() * 50 + 5;
    const currentStock = Math.floor(Math.random() * 500);
    const reorderPoint = Math.floor(dailySales * 14); // 14 days coverage
    const maxStock = Math.floor(dailySales * 45); // 45 days coverage
    const unitCost = Math.random() * 100 + 10;
    const leadTime = Math.floor(Math.random() * 21) + 7; // 7-28 days
    
    products.push({
      id: `INV-${1000 + i}`,
      productName: `${category} Product ${i + 1}`,
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      category,
      warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      currentStock,
      reorderPoint,
      maxStockLevel: maxStock,
      safetyStock: Math.floor(reorderPoint * 0.3),
      dailySales: parseFloat(dailySales.toFixed(2)),
      avgDailySales: parseFloat((dailySales * (0.8 + Math.random() * 0.4)).toFixed(2)),
      unitCost: parseFloat(unitCost.toFixed(2)),
      leadTime,
      image: `https://picsum.photos/seed/${i + 1}/100/100`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    });
  }
  
  return products;
};

module.exports = generateMockInventoryData;