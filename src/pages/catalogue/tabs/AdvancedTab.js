import React from "react";
import { batteryTypes, taxCodes, productTypes, variationThemes } from "../productData";

export default function AdvancedTab({ product, handleChange }) {
  return (
    <div className="space-y-10 text-[14px] text-gray-800">

      {/* SECTION HEADER */}
      <h2 className="text-xl font-semibold border-b pb-2 text-gray-900">
        Advanced Listing Details
      </h2>

      {/* SEARCH TERMS */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Search Terms</h3>
        <p className="text-sm text-gray-500">
          Improve your product discoverability in Amazon search results.
        </p>

        <textarea
          name="keywords"
          value={product.keywords}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500"
          placeholder="Enter relevant search keywords (comma separated)"
        />
        <p className="text-xs text-gray-500">
          Example: wireless mouse, portable mouse, USB mouse
        </p>
      </div>

      {/* VARIATIONS */}
      <div className="bg-gray-50 border rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Product Variations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium">Product Type</label>
            <select
              name="productType"
              value={product.productType}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500"
            >
              {productTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select the primary attribute for variations (color, size, etc.)
            </p>
          </div>

          <div>
            <label className="font-medium">Variation Theme</label>
            <select
              name="variationTheme"
              value={product.variationTheme}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500"
            >
              {variationThemes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Defines how variations will be grouped on Amazon.
            </p>
          </div>
        </div>
      </div>

      {/* SAFETY & COMPLIANCE */}
      <div className="bg-gray-50 border rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          Safety & Compliance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* HAZARDOUS */}
          <div>
            <label className="font-medium">Is this product hazardous?</label>
            <select
              name="hazardous"
              value={product.hazardous}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500"
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Required to determine shipping restrictions.
            </p>
          </div>

          {/* BATTERY TYPE */}
          <div>
            <label className="font-medium">Battery Type</label>
            <select
              name="batteryType"
              value={product.batteryType}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500"
            >
              <option value="">Select battery type</option>
              {batteryTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select only if the product contains batteries.
            </p>
          </div>

          {/* TAX CODE */}
          <div>
            <label className="font-medium">Tax Code</label>
            <select
              name="taxCode"
              value={product.taxCode}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500"
            >
              {taxCodes.map((code) => (
                <option key={code.value} value={code.value}>
                  {code.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select the correct GST/Tax code for compliance.
            </p>
          </div>

          {/* ADULT PRODUCT */}
          <div className="flex items-start mt-1">
            <input
              type="checkbox"
              name="adultProduct"
              checked={product.adultProduct}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-orange-600"
            />
            <label className="ml-2 text-sm leading-tight">
              This listing contains adult or restricted content.
            </label>
          </div>
        </div>
      </div>

      {/* MANUFACTURER INFO */}
      <div className="space-y-2">
        <label className="font-medium">Manufacturer / Brand Owner</label>
        <input
          type="text"
          name="manufacturer"
          value={product.manufacturer}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500"
          placeholder="Enter brand manufacturer or company name"
        />
      </div>

      {/* CONDITION NOTE */}
      <div className="space-y-2">
        <label className="font-medium">Condition Note</label>
        <textarea
          name="conditionNote"
          value={product.conditionNote}
          onChange={handleChange}
          rows="2"
          className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500"
          placeholder="Explain condition details for refurbished/used items"
        />
        <p className="text-xs text-gray-500">
          Only required for Used, Renewed, or Refurbished listings.
        </p>
      </div>
    </div>
  );
}
