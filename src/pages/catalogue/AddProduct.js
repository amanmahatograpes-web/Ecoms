import React, { useState } from 'react';
import { 
  Package, 
  DollarSign, 
  Image, 
  Truck, 
  Settings, 
  AlertTriangle, 
  Plus,
  Smartphone,
  Tablet,
  Monitor,
  Laptop
} from 'lucide-react';
import ProductForm from './ProductForm';
import { initialProductState } from './productData';

const API_BASE_URL = 'http://localhost:8000/api';

function CreateProduct({ onSuccess }) {
  const [product, setProduct] = useState(initialProductState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Device size indicator for debugging (remove in production)
  const DeviceIndicator = () => (
    <div className="fixed bottom-4 right-4 z-50 hidden md:flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-full text-xs">
      <Smartphone size={12} className="md:hidden" />
      <Tablet size={12} className="hidden md:block lg:hidden" />
      <Laptop size={12} className="hidden lg:block xl:hidden" />
      <Monitor size={12} className="hidden xl:block 2xl:hidden" />
      <Monitor size={14} className="hidden 2xl:block" />
      <span className="md:hidden">Mobile</span>
      <span className="hidden md:block lg:hidden">Tablet</span>
      <span className="hidden lg:block xl:hidden">Laptop</span>
      <span className="hidden xl:block 2xl:hidden">Desktop</span>
      <span className="hidden 2xl:block">Large Desktop</span>
    </div>
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBulletPointChange = (index, value) => {
    const newBulletPoints = [...product.bulletPoints];
    newBulletPoints[index] = value;
    setProduct(prev => ({ ...prev, bulletPoints: newBulletPoints }));
  };

  const handleDimensionChange = (type, field, value) => {
    setProduct(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }

    }));
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);

    if (type === "main") {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setProduct({ ...product, mainImage: url });
    }

    if (type === "additional") {
      const newImages = files.map((f) => URL.createObjectURL(f));
      setProduct({
        ...product,
        additionalImages: [...product.additionalImages, ...newImages].slice(0, 6),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    setSuccess(null);

    // Basic validation
    const validationErrors = [];
    if (!product?.title?.trim()) validationErrors.push("Product title is required");
    if (!product?.sku?.trim()) validationErrors.push("SKU is required");
    if (!product?.price) validationErrors.push("Price is required");
    if (!product?.brand?.trim()) validationErrors.push("Brand is required");
    if (!product?.category?.trim()) validationErrors.push("Category is required");
    if (product?.quantity === "" || product?.quantity === null) {
      validationErrors.push("Quantity is required");
    }

    // Bullet points validation
    const meaningfulBulletPoints = product.bulletPoints?.filter(p => p?.trim().length > 0);
    if (!meaningfulBulletPoints || meaningfulBulletPoints.length === 0) {
      validationErrors.push("At least one key product feature is required");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setIsSubmitting(false);
      return;
    }

    // Sanitize condition for backend enum
    const validConditions = ["New", "UsedLikeNew", "UsedVeryGood", "UsedGood", "UsedAcceptable"];
    const sanitizedCondition = validConditions.includes(product.condition)
      ? product.condition
      : "New";

    // Prepare product data
    const productData = {
      title: product.title.trim(),
      sku: product.sku.trim(),
      brand: product.brand.trim(),
      price: parseFloat(product.price) || 0,
      quantity: parseInt(product.quantity) || 0,
      category: product.category.trim(),
      status: "draft",
      description: product.description?.trim() || "",
      bulletPoints: meaningfulBulletPoints,
      mainImage: product.mainImage || "/uploads/images/default-product.jpg",
      additionalImages: product.additionalImages || [],
      condition: sanitizedCondition,
      fulfillment: product.fulfillment || "FBM",
      ...(product.asin?.trim() && { asin: product.asin.trim() }),
      ...(product.weight && { weight: parseFloat(product.weight) }),
      ...(product.dimensions?.length && {
        dimensions: {
          length: parseFloat(product.dimensions.length) || 0,
          width: parseFloat(product.dimensions.width) || 0,
          height: parseFloat(product.dimensions.height) || 0,
        },
      }),
      ...(product.shippingType && { shippingType: product.shippingType }),
      ...(product.keywords && { keywords: product.keywords }),
      ...(product.hazardous !== undefined && { hazardous: Boolean(product.hazardous) }),
      ...(product.adultProduct !== undefined && { adultProduct: Boolean(product.adultProduct) }),
      ...(product.batteryType && { batteryType: product.batteryType }),
      ...(product.manufacturer && { manufacturer: product.manufacturer }),
      ...(product.taxCode && { taxCode: product.taxCode }),
    };

    console.log("🚀 Sending product data to API:", productData);

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      console.log("✅ API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setSuccess(`Product "${data.data?.title || product.title}" created successfully!`);
      setProduct(initialProductState);

      // Call onSuccess callback after 2 seconds
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      console.error("❌ Product creation failed:", err);
      setError(err.message || "Failed to create product. Please try again.");

      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setProduct(initialProductState);
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Header with responsive title */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Create New Product
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
              Fill in all required fields to list your product
            </p>
          </div>
          
          {/* Responsive action buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
            >
              Menu
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm sm:text-base font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </div>
        
        {/* Progress indicator for mobile */}
        <div className="mt-4 sm:hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600">
              Step {['basic', 'images', 'shipping', 'advanced'].indexOf(activeTab) + 1} of 4
            </span>
            <span className="text-xs text-gray-500">
              {activeTab === 'basic' && 'Basic Info'}
              {activeTab === 'images' && 'Images'}
              {activeTab === 'shipping' && 'Shipping'}
              {activeTab === 'advanced' && 'Advanced'}
            </span>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(['basic', 'images', 'shipping', 'advanced'].indexOf(activeTab) + 1) * 25}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Tabs sidebar - hidden on mobile, shown as dropdown */}
        <div className={`
          ${isMobileMenuOpen ? 'block' : 'hidden'} 
          lg:block lg:w-64 xl:w-72 2xl:w-80
          bg-white rounded-lg shadow-sm p-4
          lg:sticky lg:top-6 lg:self-start
        `}>
          <h2 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base md:text-lg">
            Product Details
          </h2>
          
          <nav className="space-y-1">
            {[
              { id: 'basic', label: 'Basic Information', icon: Package },
              { id: 'images', label: 'Images & Media', icon: Image },
              { id: 'shipping', label: 'Shipping & Dimensions', icon: Truck },
              { id: 'advanced', label: 'Advanced Settings', icon: Settings },
              { id: 'pricing', label: 'Pricing & Inventory', icon: DollarSign },
              { id: 'compliance', label: 'Compliance', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 sm:py-3.5 rounded-lg text-left transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <tab.icon size={18} className="flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Form stats - hidden on mobile */}
          <div className="mt-6 pt-6 border-t border-gray-200 hidden lg:block">
            <h3 className="font-medium text-gray-700 mb-3 text-sm">Form Progress</h3>
            <div className="space-y-2">
              {[
                { label: 'Basic Info', completed: product.title && product.sku && product.brand },
                { label: 'Images', completed: product.mainImage },
                { label: 'Pricing', completed: product.price && product.quantity },
                { label: 'Shipping', completed: product.fulfillment }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{item.label}</span>
                  <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form content area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            {/* Responsive form content */}
            <ProductForm
              product={product}
              setProduct={setProduct}
              isSubmitting={isSubmitting}
              error={error}
              success={success}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleChange={handleChange}
              handleBulletPointChange={handleBulletPointChange}
              handleDimensionChange={handleDimensionChange}
              handleImageUpload={handleImageUpload}
              handleSubmit={handleSubmit}
              onCancel={handleCancel}
              onSuccess={onSuccess}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            
            {/* Mobile navigation buttons */}
            <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const tabs = ['basic', 'images', 'shipping', 'advanced'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                  disabled={activeTab === 'basic'}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => {
                    const tabs = ['basic', 'images', 'shipping', 'advanced'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                  disabled={activeTab === 'advanced'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          {/* Status messages */}
          {(error || success) && (
            <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${error ? 'bg-red-100' : 'bg-green-100'}`}>
                  {error ? <AlertTriangle size={18} className="text-red-600" /> : '✓'}
                </div>
                <div className="flex-1">
                  <p className={`text-sm sm:text-base font-medium ${error ? 'text-red-800' : 'text-green-800'}`}>
                    {error ? 'Error' : 'Success!'}
                  </p>
                  <p className={`text-xs sm:text-sm mt-1 ${error ? 'text-red-600' : 'text-green-600'}`}>
                    {error || success}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug device indicator (remove in production) */}
      {process.env.NODE_ENV === 'development' && <DeviceIndicator />}
    </div>
  );
}

export default CreateProduct;