import React from 'react';
import { DollarSign } from 'lucide-react';
import { fulfillmentOptions } from '../productData';

const OfferTab = ({ product, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Price *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="text-gray-400" size={16} />
            </div>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            name="condition"
            value={product.condition}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="New">New</option>
            <option value="Refurbished">Refurbished</option>
            <option value="UsedLikeNew">Used - Like New</option>
            <option value="UsedVeryGood">Used - Very Good</option>
            <option value="UsedGood">Used - Good</option>
            <option value="UsedAcceptable">Used - Acceptable</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fulfillment Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fulfillmentOptions.map((option) => (
            <label key={option.value} className="relative flex cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none">
              <input
                type="radio"
                name="fulfillment"
                value={option.value}
                checked={product.fulfillment === option.value}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-gray-500">
                      {option.value === 'FBM' 
                        ? 'You store and ship products yourself' 
                        : 'Amazon stores and ships your products'
                      }
                    </p>
                  </div>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 ${
                  product.fulfillment === option.value ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}></div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferTab;