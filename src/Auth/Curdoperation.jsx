import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Copy, Upload, Download, Package, BarChart, AlertCircle, CheckCircle, XCircle, Image as ImageIcon, DollarSign, Tag, Box, Layers, TrendingUp, Clock, ShoppingCart, Zap, FileText, Users, Star, Settings, GitBranch, AlertTriangle, RefreshCw } from 'lucide-react';

const SellerProductPanel = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formStep, setFormStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showVariations, setShowVariations] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Enhanced product data with more fields
  const [products, setProducts] = useState([
    {
      id: 1,
      sku: 'PROD-001',
      asin: 'B08XYZ1234',
      name: 'Premium Wireless Headphones',
      image: '/api/placeholder/80/80',
      price: 79.99,
      quantity: 150,
      status: 'active',
      category: 'Electronics',
      brand: 'TechPro',
      salesRank: 1245,
      buyBoxPercentage: 85,
      hasVariations: false,
      listingQuality: 78,
      fulfillmentMethod: 'FBA',
      ipiScore: 720
    },
    {
      id: 2,
      sku: 'PROD-002-PARENT',
      asin: 'B08ABC5678',
      name: 'Smart Fitness Watch',
      image: '/api/placeholder/80/80',
      price: 149.99,
      quantity: 0,
      status: 'out_of_stock',
      category: 'Electronics',
      brand: 'FitTrack',
      salesRank: 523,
      buyBoxPercentage: 0,
      hasVariations: true,
      variationCount: 3,
      listingQuality: 92,
      fulfillmentMethod: 'FBM',
      ipiScore: 680
    }
  ]);

  // Variation data for parent products
  const [variations] = useState({
    'B08ABC5678': [
      { sku: 'PROD-002-BLK-SM', color: 'Black', size: 'Small', price: 149.99, quantity: 5, asin: 'B08ABC5679' },
      { sku: 'PROD-002-BLK-MD', color: 'Black', size: 'Medium', price: 149.99, quantity: 0, asin: 'B08ABC5680' },
      { sku: 'PROD-002-SLV-SM', color: 'Silver', size: 'Small', price: 159.99, quantity: 8, asin: 'B08ABC5681' }
    ]
  });

  const [productForm, setProductForm] = useState({
    productId: '',
    productIdType: 'UPC',
    sku: '',
    productName: '',
    brand: '',
    manufacturer: '',
    category: '',
    bulletPoints: ['', '', '', '', ''],
    description: '',
    price: '',
    salePrice: '',
    quantity: '',
    condition: 'New',
    images: [],
    keywords: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    fulfillmentMethod: 'FBM',
    isParent: false,
    variationTheme: '',
    variations: []
  });

  const handleSelectProduct = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Active' },
      out_of_stock: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Out of Stock' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: 'Inactive' },
      suppressed: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Suppressed' },
      incomplete: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Incomplete' },
      stranded: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle, text: 'Stranded' }
    };
    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.asin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Bulk Upload Modal
  const BulkUploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Bulk Upload Products</h3>
          <button onClick={() => setShowBulkUpload(false)} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Step 1: Download Template</h4>
            <p className="text-sm text-blue-800 mb-3">Choose your product category template</p>
            <select className="w-full px-3 py-2 border rounded-lg mb-3">
              <option>Electronics - Template</option>
              <option>Clothing & Accessories - Template</option>
              <option>Home & Kitchen - Template</option>
              <option>Sports & Outdoors - Template</option>
              <option>Books - Template</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Step 2: Fill Template</h4>
            <p className="text-sm text-gray-600">Complete all required fields in the Excel/CSV file</p>
          </div>

          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium mb-2">Step 3: Upload Completed File</h4>
            <p className="text-sm text-gray-600 mb-4">Drag and drop or click to browse</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Select File
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> Processing may take 15-45 minutes. You'll receive an email when complete.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Product List View
  const ProductListView = () => (
    <div className="space-y-4">
      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'active').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{products.filter(p => p.status === 'out_of_stock').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg IPI Score</p>
              <p className="text-2xl font-bold text-purple-600">700</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Product Name, SKU, ASIN, FNSKU..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button 
              onClick={() => setShowBulkUpload(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg ${filterStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
          >
            All ({products.length})
          </button>
          <button 
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-lg ${filterStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilterStatus('out_of_stock')}
            className={`px-4 py-2 rounded-lg ${filterStatus === 'out_of_stock' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
          >
            Out of Stock
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-100">
            Suppressed
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-100">
            Incomplete
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-100">
            Stranded (FBA)
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white border text-blue-700 rounded text-sm">Update Price</button>
              <button className="px-3 py-1.5 bg-white border text-blue-700 rounded text-sm">Update Quantity</button>
              <button className="px-3 py-1.5 bg-white border text-blue-700 rounded text-sm">Change Status</button>
              <button className="px-3 py-1.5 bg-white border text-red-700 rounded text-sm">Delete Selected</button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Products Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU / ASIN</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inventory</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metrics</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map(product => (
              <React.Fragment key={product.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded border" />
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {product.name}
                          {product.hasVariations && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                              {product.variationCount} variations
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{product.brand} • {product.category}</div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {product.fulfillmentMethod}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Quality: {product.listingQuality}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium">{product.sku}</div>
                      <div className="text-gray-500">{product.asin}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">${product.price}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <span className={`font-medium ${product.quantity === 0 ? 'text-red-600' : product.quantity < 10 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {product.quantity}
                      </span>
                      <span className="text-gray-500"> units</span>
                      {product.quantity < 10 && product.quantity > 0 && (
                        <div className="text-xs text-orange-600 mt-1">Low stock</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span>Rank: #{product.salesRank}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3 text-blue-600" />
                        <span>Buy Box: {product.buyBoxPercentage}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {product.hasVariations && (
                        <button 
                          onClick={() => setShowVariations(!showVariations)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" 
                          title="View Variations"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded" title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Variation rows */}
                {product.hasVariations && showVariations && variations[product.asin] && (
                  variations[product.asin].map((variation, idx) => (
                    <tr key={idx} className="bg-gray-50">
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2" colSpan="7">
                        <div className="flex items-center gap-4 text-sm ml-8">
                          <GitBranch className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{variation.color} - {variation.size}</span>
                          <span className="text-gray-500">SKU: {variation.sku}</span>
                          <span className="text-gray-500">ASIN: {variation.asin}</span>
                          <span className="font-medium">${variation.price}</span>
                          <span className={variation.quantity === 0 ? 'text-red-600' : 'text-gray-900'}>
                            {variation.quantity} units
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Create/Edit Form with all 5 steps
  const CreateProductForm = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: 'Product Identity', icon: Package },
            { num: 2, label: 'Details & Variations', icon: Box },
            { num: 3, label: 'Images & Content', icon: ImageIcon },
            { num: 4, label: 'Pricing & Inventory', icon: DollarSign },
            { num: 5, label: 'SEO & Compliance', icon: Tag }
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    formStep >= step.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {formStep > step.num ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs mt-2 font-medium text-center">{step.label}</span>
                </div>
                {idx < 4 && <div className={`w-20 h-0.5 mx-2 ${formStep > step.num ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Product Identity */}
        {formStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Product Identity & Classification</h3>
            
            {/* Match existing product first */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Do you want to match an existing product?</h4>
              <p className="text-sm text-yellow-800 mb-3">Search if your product already exists in Amazon's catalog</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Search by UPC, EAN, ISBN, or ASIN" className="flex-1 px-3 py-2 border rounded-lg" />
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Search</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product ID Type *</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>UPC</option>
                  <option>EAN</option>
                  <option>ISBN</option>
                  <option>GTIN</option>
                  <option>Request GTIN Exemption</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Product ID Number *</label>
                <input type="text" placeholder="Enter barcode number" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your SKU *</label>
                <input 
                  type="text" 
                  placeholder="Unique identifier"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name *</label>
                <input 
                  type="text" 
                  placeholder="Brand"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={productForm.brand}
                  onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Product Title * (Max 200 chars)</label>
                <input 
                  type="text" 
                  placeholder="Include: Brand + Product Type + Key Features + Size/Color"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={productForm.productName}
                  onChange={(e) => setProductForm({...productForm, productName: e.target.value})}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{productForm.productName.length}/200</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Manufacturer</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Electronics</option>
                  <option>Clothing & Accessories</option>
                  <option>Home & Kitchen</option>
                  <option>Sports & Outdoors</option>
                  <option>Health & Personal Care</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details & Variations */}
        {formStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Product Details & Variations</h3>

            {/* Variation Setup */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-purple-900">Does this product have variations?</h4>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={productForm.isParent}
                    onChange={(e) => setProductForm({...productForm, isParent: e.target.checked})}
                  />
                  <span className="text-sm">Yes, create parent-child relationship</span>
                </label>
              </div>
              {productForm.isParent && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Variation Theme</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-lg"
                      value={productForm.variationTheme}
                      onChange={(e) => setProductForm({...productForm, variationTheme: e.target.value})}
                    >
                      <option>Select Theme</option>
                      <option>Size</option>
                      <option>Color</option>
                      <option>Size-Color</option>
                      <option>Style</option>
                      <option>Flavor</option>
                    </select>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-gray-600 mb-2">Add variations manually or upload spreadsheet</p>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">+ Add Variation</button>
                  </div>
                </div>
              )}
            </div>

            {/* Bullet Points */}
            <div>
              <label className="block text-sm font-medium mb-2">Key Features (5 Bullet Points) *</label>
              {productForm.bulletPoints.map((bullet, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Feature ${idx + 1} - Highlight key benefits (Max 500 chars)`}
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                  value={bullet}
                  onChange={(e) => {
                    const newBullets = [...productForm.bulletPoints];
                    newBullets[idx] = e.target.value;
                    setProductForm({...productForm, bulletPoints: newBullets});
                  }}
                  maxLength={500}
                />
              ))}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Description * (HTML supported)</label>
              <textarea
                rows={8}
                placeholder="Detailed description with benefits, specifications, usage instructions..."
                className="w-full px-3 py-2 border rounded-lg"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">{productForm.description.length} characters</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Condition *</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>New</option>
                  <option>Used - Like New</option>
                  <option>Used - Very Good</option>
                  <option>Refurbished</option>
                  <option>Collectible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Handling Time (Days)</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="1-2 days" />
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Product Dimensions & Weight</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Length (in)</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Width (in)</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Height (in)</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Weight (lb)</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Images & Content */}
        {formStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Images, Videos & Enhanced Content</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-blue-600 inline mr-2" />
              <strong>Requirements:</strong> Min 1000x1000px (2000x2000px recommended), white background, 85% frame fill
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium mb-3">Main Image * (Required)</label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-400 cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">Upload main product image</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium mb-3">Additional Images (Up to 8)</label>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={num} className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Image {num}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium mb-3">Product Video (Optional)</label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-400 cursor-pointer">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">Upload demonstration video</p>
                <p className="text-xs text-gray-500">MP4, MOV up to 500MB</p>
              </div>
            </div>

            {/* A+ Content */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">A+ Content (Enhanced Brand Content)</h4>
              <p className="text-sm text-green-800 mb-3">Create rich product descriptions with images and comparison charts</p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                Create A+ Content
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Pricing & Inventory */}
        {formStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Pricing, Inventory & Fulfillment</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Price * ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sale Price ($)</label>
                <input type="number" step="0.01" placeholder="Optional" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Price (B2B) ($)</label>
                <input type="number" step="0.01" placeholder="Optional" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity Available *</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={productForm.quantity}
                  onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                />
              </div>
            </div>

            {/* Sale Schedule */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Sale Schedule</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
            </div>

            {/* Quantity Discounts */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Quantity Discounts (Tiered Pricing)</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Quantity</label>
                    <input type="number" placeholder="5" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Discount %</label>
                    <input type="number" placeholder="10" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div className="flex items-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm w-full">+ Add Tier</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Fulfillment Method */}
            <div>
              <label className="block text-sm font-medium mb-2">Fulfillment Method *</label>
              <div className="space-y-3">
                <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="fulfillment" value="FBM" className="mt-1 mr-3" defaultChecked />
                  <div className="flex-1">
                    <div className="font-medium">FBM - Fulfilled by Merchant</div>
                    <div className="text-sm text-gray-500">You handle storage, packing, and shipping</div>
                  </div>
                </label>
                <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="fulfillment" value="FBA" className="mt-1 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium">FBA - Fulfilled by Amazon</div>
                    <div className="text-sm text-gray-500">Amazon handles storage, packing, and shipping. Prime eligible.</div>
                    <div className="mt-2 text-xs text-blue-600">
                      • Automatic Prime badge • Higher visibility • Multi-channel fulfillment
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* FBA Prep Settings */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">FBA Prep & Labeling</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Prep service required</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="labeling" defaultChecked />
                  <span className="text-sm">Amazon labels products (fee applies)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="labeling" />
                  <span className="text-sm">I will label products</span>
                </label>
              </div>
            </div>

            {/* Fee Preview */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Estimated Fees</h4>
              <div className="space-y-1 text-sm text-yellow-800">
                <div className="flex justify-between">
                  <span>Referral Fee (15%):</span>
                  <span>$11.99</span>
                </div>
                <div className="flex justify-between">
                  <span>FBA Fulfillment Fee:</span>
                  <span>$3.22</span>
                </div>
                <div className="flex justify-between font-medium border-t border-yellow-300 pt-1 mt-1">
                  <span>Your Profit:</span>
                  <span>$64.78</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: SEO & Compliance */}
        {formStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Keywords, SEO & Compliance</h3>
            
            {/* Backend Keywords */}
            <div>
              <label className="block text-sm font-medium mb-2">Search Terms (Backend Keywords) - Max 250 bytes</label>
              <textarea
                rows={4}
                placeholder="Enter keywords separated by spaces. Use synonyms, alternate spellings, related terms..."
                className="w-full px-3 py-2 border rounded-lg"
                value={productForm.keywords}
                onChange={(e) => setProductForm({...productForm, keywords: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">{new Blob([productForm.keywords]).size}/250 bytes</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-blue-600 inline mr-2" />
              <strong>Keyword Tips:</strong> Use relevant terms, include misspellings, avoid duplicate words from title
            </div>

            {/* Additional Attributes */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <input type="text" placeholder="Men, Women, Kids, Unisex" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age Range</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Select Age Range</option>
                  <option>0-12 months</option>
                  <option>1-3 years</option>
                  <option>4-7 years</option>
                  <option>8-13 years</option>
                  <option>14+ years</option>
                  <option>Adult</option>
                </select>
              </div>
            </div>

            {/* Compliance Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-3">Product Compliance & Safety</h4>
              <div className="space-y-3">
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <div className="text-sm">
                    <div className="font-medium">Product contains batteries</div>
                    <div className="text-gray-600">Required for hazmat classification</div>
                  </div>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <div className="text-sm">
                    <div className="font-medium">Product is a hazardous material</div>
                    <div className="text-gray-600">Flammable, pressurized, or dangerous goods</div>
                  </div>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <div className="text-sm">
                    <div className="font-medium">Product requires age verification</div>
                    <div className="text-gray-600">18+ or 21+ age gate required</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Tax & Legal */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Tax Code</label>
                <input type="text" placeholder="Optional" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country of Origin</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Select Country</option>
                  <option>United States</option>
                  <option>China</option>
                  <option>India</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Gift Options */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1" />
              <label className="text-sm">
                <div className="font-medium">Enable Gift Options</div>
                <div className="text-gray-600">Allow gift wrap and gift messages</div>
              </label>
            </div>

            {/* Final Review */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✓ Ready to Submit!</h4>
              <p className="text-sm text-green-800 mb-3">
                Your product will be reviewed and typically goes live within 24 hours.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Submit & Publish Now
                </button>
                <button className="px-4 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t mt-8">
          <button
            onClick={() => setFormStep(Math.max(1, formStep - 1))}
            disabled={formStep === 1}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('list')}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            
            {formStep < 5 ? (
              <button
                onClick={() => setFormStep(formStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={() => {
                  alert('Product submitted successfully!');
                  setActiveTab('list');
                  setFormStep(1);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Analytics Dashboard
  const AnalyticsDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Sales</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">$12,458</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% vs last month</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Units Sold</span>
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">342</div>
          <div className="text-xs text-blue-600 mt-1">↑ 8% vs last month</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Conversion Rate</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">12.5%</div>
          <div className="text-xs text-gray-500 mt-1">Industry avg: 10%</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Buy Box %</span>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold">78%</div>
          <div className="text-xs text-yellow-600 mt-1">Good performance</div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
        <div className="space-y-3">
          {products.slice(0, 3).map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <img src={product.image} className="w-10 h-10 rounded" alt="" />
                <div>
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-gray-500">Rank: #{product.salesRank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${product.price}</div>
                <div className="text-xs text-green-600">142 units sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">In Stock</span>
              <span className="font-medium">{products.filter(p => p.quantity > 0).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Out of Stock</span>
              <span className="font-medium text-red-600">{products.filter(p => p.quantity === 0).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Low Stock</span>
              <span className="font-medium text-orange-600">{products.filter(p => p.quantity > 0 && p.quantity < 10).length}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-sm font-medium">IPI Score</span>
              <span className="font-bold text-purple-600">700</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Listing Quality</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Score</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>✓ High quality images</div>
              <div>✓ Complete bullet points</div>
              <div className="text-orange-600">⚠ Missing A+ Content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {/* <h1 className="text-2xl font-bold text-gray-900">Amazon Seller Central</h1> */}
              <h1 className="text-sm text-gray-500">Complete Product Management System</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">Total Products</div>
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">Active Listings</div>
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === 'active').length}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">IPI Score</div>
                <div className="text-2xl font-bold text-purple-600">700</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Manage Inventory
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('create'); setFormStep(1); }}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'create' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Product
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Analytics
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'reports' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Reports
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'list' && <ProductListView />}
        {activeTab === 'create' && <CreateProductForm />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'reports' && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Download Reports</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">All Listings Report</h4>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Complete inventory export with all details</p>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Active Listings Report</h4>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Only active products</p>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Inactive Listings Report</h4>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Products not currently selling</p>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Suppressed Listings</h4>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Products with issues</p>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">FBA Inventory Report</h4>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">FBA stock levels and locations</p>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Stranded Inventory</h4>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">FBA inventory without active listings</p>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Fee Preview Report</h4>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Estimated fees per product</p>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Listing Quality Report</h4>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Products needing improvements</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Settings & Preferences</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Default Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Default Fulfillment Method</div>
                      <div className="text-xs text-gray-600">Applied to new products</div>
                    </div>
                    <select className="px-3 py-2 border rounded-lg text-sm">
                      <option>FBM</option>
                      <option>FBA</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Default Handling Time</div>
                      <div className="text-xs text-gray-600">Days to ship</div>
                    </div>
                    <input type="number" defaultValue="2" className="w-20 px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Low Stock Alert Threshold</div>
                      <div className="text-xs text-gray-600">Notify when inventory falls below</div>
                    </div>
                    <input type="number" defaultValue="10" className="w-20 px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Automation</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Auto-restock Recommendations</div>
                      <div className="text-xs text-gray-600">Get automated restock suggestions</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Competitive Pricing Alerts</div>
                      <div className="text-xs text-gray-600">Notify when competitors change prices</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Automated Repricing</div>
                      <div className="text-xs text-gray-600">Automatically adjust prices to stay competitive</div>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Email Notifications</div>
                      <div className="text-xs text-gray-600">Inventory alerts, policy updates</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">SMS Alerts</div>
                      <div className="text-xs text-gray-600">Critical inventory issues</div>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUpload && <BulkUploadModal />}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button 
          onClick={() => setActiveTab('create')}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
          title="Add Product"
        >
          <Plus className="w-6 h-6" />
        </button>
        <button 
          className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center"
          title="Refresh Data"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SellerProductPanel;