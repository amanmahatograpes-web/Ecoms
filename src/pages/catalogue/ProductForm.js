import React from 'react';
import { 
  Package, 
  DollarSign, 
  Image, 
  Truck, 
  Settings, 
  AlertTriangle, 
  Plus 
} from 'lucide-react';
import BasicInfoTab from './tabs/BasicInfoTab';
import OfferTab from './tabs/OfferTab';
import ImagesTab from './tabs/ImagesTab';
import ShippingTab from './tabs/ShippingTab';
import AdvancedTab from './tabs/AdvancedTab';
import { initialProductState } from './productData';

const ProductForm = ({
  product,
  setProduct,
  isSubmitting,
  error,
  success,
  activeTab,
  setActiveTab,
  handleChange,
  handleBulletPointChange,
  handleDimensionChange,
  handleImageUpload,
  handleSubmit,
  onSuccess
}) => {
  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: <Package size={16} /> },
    { id: 'offer', name: 'Offer', icon: <DollarSign size={16} /> },
    { id: 'images', name: 'Images', icon: <Image size={16} /> },
    { id: 'shipping', name: 'Shipping', icon: <Truck size={16} /> },
    { id: 'advanced', name: 'Advanced', icon: <Settings size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Add a Product</h2>
        <div className="flex space-x-2">
          <button 
            type="button"
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button 
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Preview Listing
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-medium text-sm">Product Created Successfully!</p>
              <p className="text-green-700 text-sm mt-1">{success}</p>
              <p className="text-green-600 text-xs mt-1">Redirecting to inventory...</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab.id 
                    ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
              {index < tabs.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="text-red-400 mr-2" size={20} />
                <div>
                  <p className="text-red-800 font-medium text-sm">Unable to create product</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'basic' && (
            <BasicInfoTab
              product={product}
              setProduct={setProduct}
              handleChange={handleChange}
              handleBulletPointChange={handleBulletPointChange}
            />
          )}

          {activeTab === 'offer' && (
            <OfferTab
              product={product}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'images' && (
            <ImagesTab
              product={product}
              handleImageUpload={handleImageUpload}
            />
          )}

          {activeTab === 'shipping' && (
            <ShippingTab
              product={product}
              handleChange={handleChange}
              handleDimensionChange={handleDimensionChange}
            />
          )}

          {activeTab === 'advanced' && (
            <AdvancedTab
              product={product}
              handleChange={handleChange}
            />
          )}

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                  setProduct(initialProductState);
                }
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Product...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create Product</span>
                </>
              )}
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;