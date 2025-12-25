import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sku: { type: String, required: true },
    brand: String,
    price: Number,
    quantity: Number,
    category: String,
    description: String,
    bulletPoints: [String],
    mainImage: String,
    additionalImages: [String],
    condition: String,
    fulfillment: String,
    asin: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    shippingType: String,
    keywords: String,
    hazardous: Boolean,
    adultProduct: Boolean,
    batteryType: String,
    manufacturer: String,
    taxCode: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
