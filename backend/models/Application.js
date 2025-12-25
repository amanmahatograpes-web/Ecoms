const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    default: () => `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  },
  userId: {
    type: String,
    required: true,
    default: 'user_12345'
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  productDescription: {
    type: String,
    required: [true, 'Product description is required']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true
  },
  asin: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
    ]
  },
  subCategory: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 1
  },
  registrationType: {
    type: String,
    enum: ['brand_registry', 'ungated', 'gated', 'restricted', ''],
    default: ''
  },
  catalogueType: {
    type: String,
    enum: ['existing', 'new', ''],
    default: 'new'
  },
  authenticationRequired: {
    type: Boolean,
    default: false
  },
  gtinException: {
    type: String,
    enum: ['approved', 'pending', 'rejected', ''],
    default: ''
  },
  status: {
    type: String,
    enum: [
      'pending',
      'under_review',
      'action_required',
      'approved',
      'declined',
      'appeal'
    ],
    default: 'pending'
  },
  appealSubmitted: {
    type: Boolean,
    default: false
  },
  appealReason: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  },
  reviewerId: {
    type: String,
    default: ''
  },
  reviewerNotes: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  estimatedReviewDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add pagination plugin
applicationSchema.plugin(mongoosePaginate);

// Indexes for better query performance
applicationSchema.index({ status: 1 });
applicationSchema.index({ category: 1 });
applicationSchema.index({ brand: 1 });
applicationSchema.index({ userId: 1 });
applicationSchema.index({ submittedAt: -1 });
applicationSchema.index({ applicationId: 1 });
applicationSchema.index({ 
  status: 1, 
  category: 1, 
  brand: 1, 
  submittedAt: -1 
});

// Pre-save middleware to generate estimated review date
applicationSchema.pre('save', function(next) {
  if (this.isNew) {
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 14);
    this.estimatedReviewDate = estimatedDate;
  }
  next();
});

// Static method to get statistics
applicationSchema.statics.getStatistics = async function(filters = {}) {
  const matchStage = { isActive: true, isArchived: false, ...filters };
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$count' },
        totalValue: { $sum: '$totalValue' },
        statuses: {
          $push: {
            status: '$_id',
            count: '$count'
          }
        }
      }
    }
  ]);
  
  return stats[0] || { total: 0, totalValue: 0, statuses: [] };
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;