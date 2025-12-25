
import React from 'react';
import { shippingTypes } from '../productData';

const ShippingTab = ({ product, handleChange, handleDimensionChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Weight (kg) *
          </label>
          <input
            type="number"
            name="weight"
            value={product.weight}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ex: 0.50"
            required
          />
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Length (cm) *
          </label>
          <input
            type="number"
            name="length"
            value={product.dimensions.length}
            onChange={(e) => handleDimensionChange('dimensions', 'length', e.target.value)}
            min="0"
            step="0.1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ex: 20"
            required
          />
        </div>

        {/* Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Width (cm) *
          </label>
          <input
            type="number"
            name="width"
            value={product.dimensions.width}
            onChange={(e) => handleDimensionChange('dimensions', 'width', e.target.value)}
            min="0"
            step="0.1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ex: 12"
            required
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Height (cm) *
          </label>
          <input
            type="number"
            name="height"
            value={product.dimensions.height}
            onChange={(e) => handleDimensionChange('dimensions', 'height', e.target.value)}
            min="0"
            step="0.1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ex: 5"
            required
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Settings</h3>
        <select
          name="shippingType"
          value={product.shippingType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          {shippingTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-900 mb-2">Shipping Notes</h3>
        <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
          <li>Accurate dimensions and weight are required for shipping cost calculations</li>
          <li>For FBA products, these measurements determine storage fees</li>
          <li>Measurements should include packaging</li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingTab;