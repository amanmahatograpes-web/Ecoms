import React from "react";
import { categories, conditions } from "../productData";

/**
 * AMAZON-STYLE BASIC INFO UI
 * Clean spacing, bold labels, Amazon-like form structure
 */
export default function BasicInfoTab({ product, setProduct, handleChange, handleBulletPointChange }) {
  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Title + Brand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-900">Product Title *</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter product title as it appears on Amazon"
            required
            maxLength={500}
          />
          <p className="text-xs text-gray-500">{product.title.length}/500 characters</p>
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-900">Brand *</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Brand name"
            required
          />
        </div>
      </div>

      {/* SKU + ASIN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SKU */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-900">SKU (Stock Keeping Unit) *</label>
          <input
            type="text"
            name="sku"
            value={product.sku}
            onChange={(e) => setProduct({ ...product, sku: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Unique SKU"
            required
            maxLength={40}
          />
        </div>

        {/* ASIN */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-900">ASIN (Amazon ID)</label>
          <input
            type="text"
            name="asin"
            value={product.asin}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="B0XXXXXXXXX"
            pattern="[A-Z0-9]{10}"
            title="ASIN must be exactly 10 uppercase letters and numbers"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-900">Product Description</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          rows="4"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Detailed product description"
        />
      </div>

      {/* Condition + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Condition */}
        

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-900">Category *</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bullet Points */}
      <div>
        <label className="text-sm font-semibold text-gray-900">Key Product Features (Bullet Points) *</label>
        <div className="space-y-2 mt-2">
          {product.bulletPoints.map((point, index) => (
            <input
              key={index}
              type="text"
              value={point}
              onChange={(e) => handleBulletPointChange(index, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Feature ${index + 1}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">At least one feature is required</p>
      </div>
    </div>
  );
}
