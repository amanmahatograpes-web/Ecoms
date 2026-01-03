import mongoose from 'mongoose';
import PricingData from '../models/PricingData.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';

const seedPricingData = async () => {
  try {
    console.log('🌱 Seeding pricing data...');

    // Clear existing data
    await PricingData.deleteMany({});
    console.log('✅ Cleared existing pricing data');

    // Sample pricing data
    const pricingSamples = [
      {
        sku: 'AMZ-BOOK-001',
        productName: 'The Art of Programming',
        costPrice: 15.50,
        listPrice: 29.99,
        salePrice: null,
        recommendedPrice: 27.50,
        profitMargin: 48.3,
        profitAmount: 14.49,
        roi: 93.5,
        fbaFees: {
          referralFee: 2.40,
          fulfillmentFee: 3.25,
          storageFee: 0.85,
          totalFees: 6.50
        },
        competitorCount: 12,
        lowestCompetitorPrice: 26.95,
        averageCompetitorPrice: 31.25,
        highestCompetitorPrice: 35.99,
        priceDifference: -10.1,
        isBuyBoxWinner: false,
        pricingStatus: 'competitive',
        autoPricingEnabled: true,
        category: 'Books',
        brand: 'TechBooks Inc',
        salesVolume: 145,
        salesTrend: 'up'
      },
      {
        sku: 'AMZ-ELEC-002',
        productName: 'Wireless Bluetooth Headphones',
        costPrice: 45.00,
        listPrice: 89.99,
        salePrice: null,
        recommendedPrice: 85.00,
        profitMargin: 50.1,
        profitAmount: 44.99,
        roi: 100.0,
        fbaFees: {
          referralFee: 7.20,
          fulfillmentFee: 4.50,
          storageFee: 1.25,
          totalFees: 12.95
        },
        competitorCount: 28,
        lowestCompetitorPrice: 82.50,
        averageCompetitorPrice: 92.75,
        highestCompetitorPrice: 105.99,
        priceDifference: 9.0,
        isBuyBoxWinner: true,
        pricingStatus: 'high',
        autoPricingEnabled: false,
        category: 'Electronics',
        brand: 'AudioTech',
        salesVolume: 89,
        salesTrend: 'stable'
      },
      {
        sku: 'AMZ-HOME-003',
        productName: 'Stainless Steel Kitchen Knife Set',
        costPrice: 25.75,
        listPrice: 49.99,
        salePrice: 39.99,
        recommendedPrice: 52.00,
        profitMargin: 48.6,
        profitAmount: 24.24,
        roi: 94.2,
        fbaFees: {
          referralFee: 4.00,
          fulfillmentFee: 3.75,
          storageFee: 0.95,
          totalFees: 8.70
        },
        competitorCount: 15,
        lowestCompetitorPrice: 45.50,
        averageCompetitorPrice: 52.25,
        highestCompetitorPrice: 59.99,
        priceDifference: 9.9,
        isBuyBoxWinner: false,
        pricingStatus: 'competitive',
        autoPricingEnabled: true,
        category: 'Home & Kitchen',
        brand: 'KitchenPro',
        salesVolume: 203,
        salesTrend: 'up'
      },
      {
        sku: 'AMZ-SPORT-004',
        productName: 'Yoga Mat Premium',
        costPrice: 12.50,
        listPrice: 24.99,
        salePrice: null,
        recommendedPrice: 22.50,
        profitMargin: 50.0,
        profitAmount: 12.49,
        roi: 99.9,
        fbaFees: {
          referralFee: 2.00,
          fulfillmentFee: 2.85,
          storageFee: 0.65,
          totalFees: 5.50
        },
        competitorCount: 8,
        lowestCompetitorPrice: 21.95,
        averageCompetitorPrice: 25.75,
        highestCompetitorPrice: 29.99,
        priceDifference: 13.7,
        isBuyBoxWinner: false,
        pricingStatus: 'high',
        autoPricingEnabled: true,
        category: 'Sports & Outdoors',
        brand: 'FitLife',
        salesVolume: 67,
        salesTrend: 'down'
      },
      {
        sku: 'AMZ-BEAUTY-005',
        productName: 'Organic Face Moisturizer',
        costPrice: 18.25,
        listPrice: 34.99,
        salePrice: null,
        recommendedPrice: 32.50,
        profitMargin: 47.9,
        profitAmount: 16.74,
        roi: 91.7,
        fbaFees: {
          referralFee: 2.80,
          fulfillmentFee: 3.15,
          storageFee: 0.75,
          totalFees: 6.70
        },
        competitorCount: 22,
        lowestCompetitorPrice: 31.50,
        averageCompetitorPrice: 36.25,
        highestCompetitorPrice: 42.99,
        priceDifference: 10.7,
        isBuyBoxWinner: true,
        pricingStatus: 'competitive',
        autoPricingEnabled: false,
        category: 'Beauty & Personal Care',
        brand: 'NaturalGlow',
        salesVolume: 156,
        salesTrend: 'stable'
      },
      {
        sku: 'AMZ-BOOK-006',
        productName: 'JavaScript: The Good Parts',
        costPrice: 8.75,
        listPrice: 16.99,
        salePrice: null,
        recommendedPrice: 15.50,
        profitMargin: 48.6,
        profitAmount: 8.24,
        roi: 94.2,
        fbaFees: {
          referralFee: 1.36,
          fulfillmentFee: 2.25,
          storageFee: 0.45,
          totalFees: 4.06
        },
        competitorCount: 5,
        lowestCompetitorPrice: 14.95,
        averageCompetitorPrice: 17.50,
        highestCompetitorPrice: 19.99,
        priceDifference: 13.7,
        isBuyBoxWinner: false,
        pricingStatus: 'high',
        autoPricingEnabled: true,
        category: 'Books',
        brand: 'CodeMasters',
        salesVolume: 234,
        salesTrend: 'up'
      },
      {
        sku: 'AMZ-ELEC-007',
        productName: 'USB-C Charging Cable',
        costPrice: 3.25,
        listPrice: 12.99,
        salePrice: 9.99,
        recommendedPrice: 11.50,
        profitMargin: 64.7,
        profitAmount: 9.74,
        roi: 299.7,
        fbaFees: {
          referralFee: 1.04,
          fulfillmentFee: 1.85,
          storageFee: 0.25,
          totalFees: 3.14
        },
        competitorCount: 45,
        lowestCompetitorPrice: 9.50,
        averageCompetitorPrice: 13.75,
        highestCompetitorPrice: 16.99,
        priceDifference: 36.8,
        isBuyBoxWinner: false,
        pricingStatus: 'high',
        autoPricingEnabled: true,
        category: 'Electronics',
        brand: 'TechAccess',
        salesVolume: 445,
        salesTrend: 'up'
      },
      {
        sku: 'AMZ-HOME-008',
        productName: 'Ceramic Coffee Mug Set',
        costPrice: 7.50,
        listPrice: 19.99,
        salePrice: null,
        recommendedPrice: 18.50,
        profitMargin: 62.5,
        profitAmount: 12.49,
        roi: 166.5,
        fbaFees: {
          referralFee: 1.60,
          fulfillmentFee: 2.50,
          storageFee: 0.35,
          totalFees: 4.45
        },
        competitorCount: 18,
        lowestCompetitorPrice: 17.25,
        averageCompetitorPrice: 21.50,
        highestCompetitorPrice: 24.99,
        priceDifference: 15.9,
        isBuyBoxWinner: true,
        pricingStatus: 'competitive',
        autoPricingEnabled: false,
        category: 'Home & Kitchen',
        brand: 'HomeStyle',
        salesVolume: 98,
        salesTrend: 'stable'
      }
    ];

    // Insert sample data
    const insertedData = await PricingData.insertMany(pricingSamples);
    console.log(`✅ Inserted ${insertedData.length} pricing records`);

    // Create some sample inventory and product references (optional)
    console.log('✅ Pricing data seeding completed');

  } catch (error) {
    console.error('❌ Error seeding pricing data:', error);
    throw error;
  }
};

export { seedPricingData };

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  const mongoose = require('mongoose');

  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedPricingData();
  })
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}