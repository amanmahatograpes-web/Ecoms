// require('dotenv').config();
// const mongoose = require('mongoose');
// const Application = require('./src/models/Application');

// const generateMockApplications = async (count = 100) => {
//   const statuses = ['pending', 'under_review', 'action_required', 'approved', 'declined', 'appeal'];
//   const categories = [
//     'Electronics',
//     'Books',
//     'Home & Kitchen',
//     'Clothing',
//     'Beauty & Personal Care',
//     'Sports & Outdoors',
//     'Toys & Games',
//     'Automotive',
//     'Health & Household',
//     'Grocery'
//   ];
//   const brands = [
//     'Apple',
//     'Samsung',
//     'Sony',
//     'Nike',
//     'Adidas',
//     'Amazon Basics',
//     'Philips',
//     'LG',
//     'HP',
//     'Dell'
//   ];
//   const registrationTypes = ['brand_registry', 'ungated', 'gated', 'restricted', ''];
//   const catalogueTypes = ['existing', 'new'];
//   const gtinExceptions = ['approved', 'pending', 'rejected', ''];

//   const applications = [];

//   for (let i = 0; i < count; i++) {
//     const status = statuses[Math.floor(Math.random() * statuses.length)];
//     const category = categories[Math.floor(Math.random() * categories.length)];
//     const brand = brands[Math.floor(Math.random() * brands.length)];
//     const appealSubmitted = status === 'declined' && Math.random() > 0.7;
//     const reviewedAt = status !== 'pending' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null;

//     const application = {
//       applicationId: `APP-${Date.now()}-${i}`,
//       userId: `user_${Math.floor(Math.random() * 10) + 1}`,
//       productName: `Product ${i + 1}`,
//       productDescription: `Description for product ${i + 1}`,
//       sku: `SKU-${1000 + i}`,
//       asin: `B0${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
//       category,
//       subCategory: `Sub-${category}`,
//       brand,
//       price: Math.floor(Math.random() * 1000) + 10,
//       quantity: Math.floor(Math.random() * 100) + 1,
//       registrationType: registrationTypes[Math.floor(Math.random() * registrationTypes.length)],
//       catalogueType: catalogueTypes[Math.floor(Math.random() * catalogueTypes.length)],
//       authenticationRequired: Math.random() > 0.5,
//       gtinException: gtinExceptions[Math.floor(Math.random() * gtinExceptions.length)],
//       status,
//       appealSubmitted,
//       appealReason: appealSubmitted ? 'I believe this should be reconsidered' : '',
//       feedback: status !== 'pending' ? `Feedback for application ${i + 1}` : '',
//       reviewerId: status !== 'pending' ? `reviewer_${Math.floor(Math.random() * 5) + 1}` : '',
//       reviewerNotes: status !== 'pending' ? `Notes from reviewer for app ${i + 1}` : '',
//       submittedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
//       reviewedAt,
//       isActive: true,
//       isArchived: false
//     };

//     applications.push(application);
//   }

//   try {
//     // Clear existing data
//     await Application.deleteMany({});
    
//     // Insert new data
//     await Application.insertMany(applications);
    
//     console.log(`✅ Generated ${count} mock applications`);
//     return applications;
//   } catch (error) {
//     console.error('Error generating mock data:', error);
//     throw error;
//   }
// };

// const seedDatabase = async () => {
//   try {
//     console.log('🌱 Starting database seeding...');
    
//     // Connect to database
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/selling_applications', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
    
//     // Generate mock applications
//     await generateMockApplications(100);
    
//     console.log('✅ Database seeding completed successfully!');
    
//     // Close connection
//     await mongoose.connection.close();
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Database seeding failed:', error);
//     process.exit(1);
//   }
// };

// seedDatabase();



// You can create a seed script in backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('./src/models/Plan');
const Coupon = require('./src/models/Coupon');

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Plan.deleteMany({});
        await Coupon.deleteMany({});

        // Create plans
        const plans = [
            {
                name: 'Basic',
                description: 'Perfect for small teams and startups',
                basePrice: 1999,
                currentPrice: 1999,
                period: 'month',
                features: [
                    'Up to 5 team members',
                    '100GB cloud storage',
                    'Basic analytics dashboard',
                    'Email support (48h response)',
                    'Basic API access (1000 calls/day)',
                    'Single project management'
                ],
                popular: false,
                category: 'starter',
                taxPercentage: 18,
                maxUsers: 5,
                storage: '100GB',
                supportType: 'email'
            },
            {
                name: 'Professional',
                description: 'For growing businesses and SMEs',
                basePrice: 4999,
                currentPrice: 4999,
                period: 'month',
                features: [
                    'Up to 20 team members',
                    '500GB cloud storage',
                    'Advanced analytics & reports',
                    'Priority support (24h response)',
                    'Custom API integrations',
                    'Advanced API (10,000 calls/day)',
                    'Multiple project management',
                    'Team collaboration tools'
                ],
                popular: true,
                category: 'growth',
                taxPercentage: 18,
                maxUsers: 20,
                storage: '500GB',
                supportType: 'priority'
            },
            {
                name: 'Enterprise',
                description: 'For large organizations & enterprises',
                basePrice: 14999,
                currentPrice: 14999,
                period: 'month',
                features: [
                    'Unlimited team members',
                    '2TB cloud storage',
                    'Enterprise-grade analytics',
                    '24/7 dedicated support',
                    'Custom solutions & integrations',
                    'White-label options',
                    'SLA guarantee (99.9% uptime)',
                    'Advanced security features',
                    'Custom training sessions',
                    'Personal account manager'
                ],
                popular: false,
                category: 'enterprise',
                taxPercentage: 18,
                maxUsers: 999,
                storage: '2TB',
                supportType: '24/7'
            }
        ];

        const createdPlans = await Plan.insertMany(plans);
        console.log(`${createdPlans.length} plans created`);

        // Create coupons
        const coupons = [
            {
                code: 'WELCOME20',
                name: 'Welcome Discount',
                description: '20% off for new customers',
                discountType: 'percentage',
                discountValue: 20,
                maxDiscountAmount: 5000,
                minPurchaseAmount: 1000,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
                maxUses: 1000,
                isActive: true
            },
            {
                code: 'SAVE15',
                name: 'Save More',
                description: '15% off on all plans',
                discountType: 'percentage',
                discountValue: 15,
                maxDiscountAmount: 3000,
                minPurchaseAmount: 2000,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
                maxUses: 500,
                isActive: true
            },
            {
                code: 'INDIAN10',
                name: 'Indian Customer Special',
                description: '10% off for Indian customers',
                discountType: 'percentage',
                discountValue: 10,
                maxDiscountAmount: 2000,
                minPurchaseAmount: 1000,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
                maxUses: 1000,
                isActive: true
            }
        ];

        const createdCoupons = await Coupon.insertMany(coupons);
        console.log(`${createdCoupons.length} coupons created`);

        console.log('Database seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();