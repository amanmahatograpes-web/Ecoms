// // models/Product.js
// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//   productIdType: { type: String, enum: ['ASIN', 'UPC', 'EAN', 'ISBN'], default: 'ASIN' },
//   productId: { type: String, default: '' },
//   sku: { type: String, required: true, unique: true },
//   brand: { type: String, default: '' },
//   title: { type: String, required: true, maxlength: 200 },
//   category: { type: String, default: '' },
//   gtinExemption: { type: Boolean, default: false },

//   hasVariations: { type: Boolean, default: false },
//   variations: { type: Array, default: [] },
//   bulletPoints: { type: [String], default: [] },
//   description: { type: String, default: '' },
//   condition: { type: String, default: 'new' },

//   dimensions: {
//     length: { type: Number, default: 0 },
//     width: { type: Number, default: 0 },
//     height: { type: Number, default: 0 },
//     weight: { type: Number, default: 0 }
//   },

//   images: { type: [String], default: [] },
//   videoUrl: { type: String, default: '' },
//   hasAPlusContent: { type: Boolean, default: false },

//   price: { type: Number, default: 0 },
//   salePrice: { type: Number, default: 0 },
//   businessPrice: { type: Number, default: 0 },
//   saleStart: Date,
//   saleEnd: Date,
//   quantity: { type: Number, default: 0 },
//   fulfillment: { type: String, enum: ['FBA', 'FBM'], default: 'FBA' },
//   prepSettings: { type: Object, default: {} },

//   keywords: { type: String, default: '' },
//   targetAudience: { type: String, default: '' },
//   ageRange: { type: String, default: '' },
//   hasBatteries: { type: Boolean, default: false },
//   isHazmat: { type: Boolean, default: false },
//   requiresAgeVerification: { type: Boolean, default: false },
//   taxCode: { type: String, default: '' },
//   countryOfOrigin: { type: String, default: '' },
//   giftOptions: { type: Boolean, default: false },

//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'outofstock', 'suppressed', 'stranded', 'incomplete'],
//     default: 'active'
//   },

//   listingQuality: { type: Number, default: 0 },
//   salesRank: Number,
//   buyBoxPercentage: Number,
//   totalSales: { type: Number, default: 0 },
//   unitsSold: { type: Number, default: 0 },
//   conversionRate: Number
// }, { timestamps: true });

// ProductSchema.index({ sku: 1 });
// ProductSchema.index({ title: 'text', description: 'text' });

// module.exports = mongoose.model('Product', ProductSchema);



import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: true,
      default: "default-vendor",
      index: true,
    },

    productIdType: {
      type: String,
      enum: ["ASIN", "UPC", "EAN", "ISBN"],
      default: "ASIN",
    },
    productId: String,

    sku: {
      type: String,
      required: true,
      index: true,
    },

    brand: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    bulletPoints: [String],
    description: String,

    condition: {
      type: String,
      enum: [
        "new",
        "used-like-new",
        "used-very-good",
        "used-good",
        "used-acceptable",
      ],
      default: "new",
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
    },

    images: [
      {
        preview: String,
        url: String,
      },
    ],

    hasVideo: { type: Boolean, default: false },
    videoUrl: String,
    hasAPlusContent: { type: Boolean, default: false },

    price: {
      type: Number,
      required: true,
    },

    salePrice: Number,
    businessPrice: Number,
    saleStart: Date,
    saleEnd: Date,

    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    fulfillment: {
      type: String,
      enum: ["FBA", "FBM"],
      default: "FBA",
    },

    prepSettings: {
      labeling: {
        type: String,
        enum: ["amazon", "merchant"],
        default: "amazon",
      },
      polybagging: { type: Boolean, default: false },
    },

    keywords: String,
    targetAudience: String,
    ageRange: String,
    hasBatteries: { type: Boolean, default: false },
    isHazmat: { type: Boolean, default: false },
    requiresAgeVerification: { type: Boolean, default: false },
    taxCode: String,
    countryOfOrigin: String,
    giftOptions: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["active", "inactive", "outofstock", "suppressed", "stranded"],
      default: "active",
    },

    hasVariations: { type: Boolean, default: false },
    variations: [mongoose.Schema.Types.Mixed],
  },
  {
    timestamps: true,
  }
);

// Unique Vendor + SKU
productSchema.index({ vendorId: 1, sku: 1 }, { unique: true });

// Search index
productSchema.index({
  title: "text",
  brand: "text",
  sku: "text",
  description: "text",
});

const Product = mongoose.model("Product", productSchema);
export default Product;
