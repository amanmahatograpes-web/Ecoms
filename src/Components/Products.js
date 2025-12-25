// // import React, { useState, useEffect } from 'react';
// // import { Search, Plus, Upload, Download, Filter, ChevronDown, ChevronRight, Package, AlertTriangle, TrendingUp, ShoppingCart, Edit, Trash2, DollarSign, BarChart3 } from 'lucide-react';

// // // Mock API Service
// // const API = {
// //   async getProducts() {
// //     const stored = localStorage.getItem('products');
// //     return stored ? JSON.parse(stored) : [];
// //   },
  
// //   async saveProducts(products) {
// //     localStorage.setItem('products', JSON.stringify(products));
// //     return products;
// //   },
  
// //   async createProduct(product) {
// //     const products = await this.getProducts();
// //     const newProduct = { ...product, id: Date.now().toString(), createdAt: new Date().toISOString() };
// //     products.push(newProduct);
// //     await this.saveProducts(products);
// //     return newProduct;
// //   },
  
// //   async updateProduct(id, updates) {
// //     const products = await this.getProducts();
// //     const index = products.findIndex(p => p.id === id);
// //     if (index !== -1) {
// //       products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
// //       await this.saveProducts(products);
// //       return products[index];
// //     }
// //     throw new Error('Product not found');
// //   },
  
// //   async deleteProduct(id) {
// //     const products = await this.getProducts();
// //     const filtered = products.filter(p => p.id !== id);
// //     await this.saveProducts(filtered);
// //     return true;
// //   },
  
// //   async bulkUpdate(ids, updates) {
// //     const products = await this.getProducts();
// //     ids.forEach(id => {
// //       const index = products.findIndex(p => p.id === id);
// //       if (index !== -1) {
// //         products[index] = { ...products[index], ...updates };
// //       }
// //     });
// //     await this.saveProducts(products);
// //     return true;
// //   }
// // };

// // // Main App Component
// // export default function AmazonProductManager() {
// //   const [view, setView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedProducts, setSelectedProducts] = useState([]);
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     status: 'all',
// //     fulfillment: 'all'
// //   });

// //   useEffect(() => {
// //     loadProducts();
// //   }, []);

// //   const loadProducts = async () => {
// //     setLoading(true);
// //     const data = await API.getProducts();
// //     setProducts(data);
// //     setLoading(false);
// //   };

// //   const stats = {
// //     total: products.length,
// //     active: products.filter(p => p.status === 'active').length,
// //     outOfStock: products.filter(p => p.quantity === 0).length,
// //     ipiScore: 750
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <h1 className="text-2xl font-bold">Product Manager</h1>
// //           <nav className="flex gap-4">
// //             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Dashboard
// //             </button>
// //             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Products
// //             </button>
// //             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Create Product
// //             </button>
// //             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Reports
// //             </button>
// //           </nav>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto p-6">
// //         {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
// //         {view === 'products' && (
// //           <ProductList
// //             products={products}
// //             filters={filters}
// //             setFilters={setFilters}
// //             selectedProducts={selectedProducts}
// //             setSelectedProducts={setSelectedProducts}
// //             onRefresh={loadProducts}
// //             setView={setView}
// //           />
// //         )}
// //         {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); setView('products'); }} />}
// //         {view === 'reports' && <Reports products={products} />}
// //       </main>

// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setView('create')}
// //         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
// //       >
// //         <Plus size={24} />
// //       </button>
// //     </div>
// //   );
// // }

// // // Dashboard Component
// // function Dashboard({ stats, products }) {
// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-3xl font-bold">Dashboard</h2>
      
// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
// //         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
// //         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
// //         <StatCard title="IPI Score" value={stats.ipiScore} icon={<BarChart3 />} color="bg-purple-500" />
// //       </div>

// //       {/* Top Products */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h3 className="text-xl font-bold mb-4">Top Performing Products</h3>
// //         <div className="space-y-2">
// //           {products.slice(0, 5).map(product => (
// //             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
// //               <div>
// //                 <p className="font-semibold">{product.title}</p>
// //                 <p className="text-sm text-gray-500">SKU: {product.sku}</p>
// //               </div>
// //               <div className="text-right">
// //                 <p className="font-bold text-green-600">${product.price}</p>
// //                 <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function StatCard({ title, value, icon, color }) {
// //   return (
// //     <div className="bg-white rounded-lg shadow p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-gray-500 text-sm">{title}</p>
// //           <p className="text-3xl font-bold mt-2">{value}</p>
// //         </div>
// //         <div className={`${color} text-white p-3 rounded-lg`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Product List Component
// // function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh, setView }) {
// //   const [expandedProducts, setExpandedProducts] = useState([]);

// //   const filteredProducts = products.filter(p => {
// //     const matchesSearch = !filters.search || 
// //       p.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
// //       p.sku?.toLowerCase().includes(filters.search.toLowerCase()) ||
// //       p.asin?.toLowerCase().includes(filters.search.toLowerCase());
    
// //     const matchesStatus = filters.status === 'all' || p.status === filters.status;
// //     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
// //     return matchesSearch && matchesStatus && matchesFulfillment;
// //   });

// //   const handleSelectAll = (e) => {
// //     if (e.target.checked) {
// //       setSelectedProducts(filteredProducts.map(p => p.id));
// //     } else {
// //       setSelectedProducts([]);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if ((`Delete ${selectedProducts.length} products?`)) {
// //       for (const id of selectedProducts) {
// //         await API.deleteProduct(id);
// //       }
// //       setSelectedProducts([]);
// //       onRefresh();
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Products</h2>
// //         <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// //           Refresh
// //         </button>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow p-4">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search by Name, SKU, ASIN..."
// //               value={filters.search}
// //               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
// //               className="w-full pl-10 pr-4 py-2 border rounded"
// //             />
// //           </div>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //             <option value="outofstock">Out of Stock</option>
// //             <option value="suppressed">Suppressed</option>
// //             <option value="stranded">Stranded</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA</option>
// //             <option value="FBM">FBM</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Bulk Actions */}
// //       {selectedProducts.length > 0 && (
// //         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
// //           <span className="font-semibold">{selectedProducts.length} products selected</span>
// //           <div className="flex gap-2">
// //             <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
// //               Delete Selected
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Products Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-50 border-b">
// //             <tr>
// //               <th className="p-4 text-left">
// //                 <input
// //                   type="checkbox"
// //                   onChange={handleSelectAll}
// //                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
// //                 />
// //               </th>
// //               <th className="p-4 text-left">Product</th>
// //               <th className="p-4 text-left">SKU</th>
// //               <th className="p-4 text-left">Status</th>
// //               <th className="p-4 text-left">Price</th>
// //               <th className="p-4 text-left">Quantity</th>
// //               <th className="p-4 text-left">Fulfillment</th>
// //               <th className="p-4 text-left">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredProducts.map(product => (
// //               <tr key={product.id} className="border-b hover:bg-gray-50">
// //                 <td className="p-4">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedProducts.includes(product.id)}
// //                     onChange={(e) => {
// //                       if (e.target.checked) {
// //                         setSelectedProducts([...selectedProducts, product.id]);
// //                       } else {
// //                         setSelectedProducts(selectedProducts.filter(id => id !== product.id));
// //                       }
// //                     }}
// //                   />
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
// //                       <Package size={20} className="text-gray-400" />
// //                     </div>
// //                     <div>
// //                       <p className="font-semibold">{product.title}</p>
// //                       <p className="text-sm text-gray-500">{product.brand}</p>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                     'bg-red-100 text-red-800'
// //                   }`}>
// //                     {product.status?.toUpperCase()}
// //                   </span>
// //                 </td>
// //                 <td className="p-4 font-semibold">${product.price}</td>
// //                 <td className="p-4">
// //                   <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
// //                     {product.quantity}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                   }`}>
// //                     {product.fulfillment}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex gap-2">
// //                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
// //                       <Edit size={18} />
// //                     </button>
// //                     <button
// //                       onClick={async () => {
// //                         if (('Delete this product?')) {
// //                           await API.deleteProduct(product.id);
// //                           onRefresh();
// //                         }
// //                       }}
// //                       className="p-2 text-red-600 hover:bg-red-50 rounded"
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
        
// //         {filteredProducts.length === 0 && (
// //           <div className="p-12 text-center text-gray-500">
// //             <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //             <p>No products found</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // Create Product Component (5-Step Form)
// // function CreateProduct({ onSuccess }) {
// //   const [step, setStep] = useState(1);
// //   const [formData, setFormData] = useState({
// //     // Step 1
// //     productIdType: 'ASIN',
// //     productId: '',
// //     sku: '',
// //     brand: '',
// //     title: '',
// //     category: '',
// //     gtinExemption: false,
    
// //     // Step 2
// //     hasVariations: false,
// //     variations: [],
// //     bulletPoints: ['', '', '', '', ''],
// //     description: '',
// //     condition: 'new',
// //     dimensions: { length: '', width: '', height: '', weight: '' },
    
// //     // Step 3
// //     images: [],
// //     hasVideo: false,
// //     videoUrl: '',
// //     hasAPlusContent: false,
    
// //     // Step 4
// //     price: '',
// //     salePrice: '',
// //     businessPrice: '',
// //     saleStart: '',
// //     saleEnd: '',
// //     quantity: '',
// //     fulfillment: 'FBA',
// //     prepSettings: { labeling: 'amazon', polybagging: false },
    
// //     // Step 5
// //     keywords: '',
// //     targetAudience: '',
// //     ageRange: '',
// //     hasBatteries: false,
// //     isHazmat: false,
// //     requiresAgeVerification: false,
// //     taxCode: '',
// //     countryOfOrigin: '',
// //     giftOptions: false,
    
// //     status: 'active'
// //   });

// //   const handleSubmit = async () => {
// //     try {
// //       await API.createProduct(formData);
// //       alert('Product created successfully!');
// //       onSuccess();
// //     } catch (error) {
// //       alert('Error creating product: ' + error.message);
// //     }
// //   };

// //   const updateFormData = (updates) => {
// //     setFormData({ ...formData, ...updates });
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
// //       {/* Progress Steps */}
// //       <div className="bg-white rounded-lg shadow p-6 mb-6">
// //         <div className="flex justify-between items-center">
// //           {[1, 2, 3, 4, 5].map(s => (
// //             <div key={s} className="flex items-center">
// //               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
// //                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
// //               }`}>
// //                 {s}
// //               </div>
// //               {s < 5 && <div className={`w-20 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
// //             </div>
// //           ))}
// //         </div>
// //         <div className="flex justify-between mt-2 text-sm">
// //           <span>Identity</span>
// //           <span>Details</span>
// //           <span>Images</span>
// //           <span>Pricing</span>
// //           <span>SEO</span>
// //         </div>
// //       </div>

// //       {/* Form Content */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
// //         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} />}
// //         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}
// //         {step === 4 && <Step4 formData={formData} updateFormData={updateFormData} />}
// //         {step === 5 && <Step5 formData={formData} updateFormData={updateFormData} />}

// //         {/* Navigation Buttons */}
// //         <div className="flex justify-between mt-8 pt-6 border-t">
// //           <button
// //             onClick={() => setStep(Math.max(1, step - 1))}
// //             disabled={step === 1}
// //             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
// //           >
// //             Previous
// //           </button>
          
// //           {step < 5 ? (
// //             <button
// //               onClick={() => setStep(Math.min(5, step + 1))}
// //               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
// //             >
// //               Next
// //             </button>
// //           ) : (
// //             <button
// //               onClick={handleSubmit}
// //               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //             >
// //               Create Product
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 1: Product Identity
// // function Step1({ formData, updateFormData }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
// //       <div className="grid grid-cols-2 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
// //           <select
// //             value={formData.productIdType}
// //             onChange={(e) => updateFormData({ productIdType: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //           >
// //             <option value="ASIN">ASIN</option>
// //             <option value="UPC">UPC</option>
// //             <option value="EAN">EAN</option>
// //             <option value="ISBN">ISBN</option>
// //           </select>
// //         </div>
        
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID</label>
// //           <input
// //             type="text"
// //             value={formData.productId}
// //             onChange={(e) => updateFormData({ productId: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="B08N5WRWNW"
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">SKU *</label>
// //         <input
// //           type="text"
// //           value={formData.sku}
// //           onChange={(e) => updateFormData({ sku: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="SKU-12345"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Brand *</label>
// //         <input
// //           type="text"
// //           value={formData.brand}
// //           onChange={(e) => updateFormData({ brand: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Your Brand Name"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Title * (200 chars max)</label>
// //         <input
// //           type="text"
// //           value={formData.title}
// //           onChange={(e) => updateFormData({ title: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Product Title with Key Features"
// //           maxLength={200}
// //           required
// //         />
// //         <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 characters</p>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Category *</label>
// //         <select
// //           value={formData.category}
// //           onChange={(e) => updateFormData({ category: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           required
// //         >
// //           <option value="">Select Category</option>
// //           <option value="electronics">Electronics</option>
// //           <option value="clothing">Clothing</option>
// //           <option value="home">Home & Kitchen</option>
// //           <option value="sports">Sports & Outdoors</option>
// //           <option value="books">Books</option>
// //         </select>
// //       </div>

// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           id="gtinExemption"
// //           checked={formData.gtinExemption}
// //           onChange={(e) => updateFormData({ gtinExemption: e.target.checked })}
// //         />
// //         <label htmlFor="gtinExemption" className="text-sm">Request GTIN Exemption</label>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 2: Details & Variations
// // function Step2({ formData, updateFormData }) {
// //   const updateBulletPoint = (index, value) => {
// //     const newBulletPoints = [...formData.bulletPoints];
// //     newBulletPoints[index] = value;
// //     updateFormData({ bulletPoints: newBulletPoints });
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 2: Product Details & Variations</h3>

// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           id="hasVariations"
// //           checked={formData.hasVariations}
// //           onChange={(e) => updateFormData({ hasVariations: e.target.checked })}
// //         />
// //         <label htmlFor="hasVariations" className="text-sm font-semibold">This product has variations (Size, Color, etc.)</label>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Bullet Points (5 max, 500 chars each)</label>
// //         {formData.bulletPoints.map((bullet, index) => (
// //           <div key={index} className="mb-3">
// //             <textarea
// //               value={bullet}
// //               onChange={(e) => updateBulletPoint(index, e.target.value)}
// //               className="w-full px-4 py-2 border rounded"
// //               placeholder={`Feature ${index + 1}`}
// //               maxLength={500}
// //               rows={2}
// //             />
// //             <p className="text-xs text-gray-500 mt-1">{bullet.length}/500 characters</p>
// //           </div>
// //         ))}
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Description</label>
// //         <textarea
// //           value={formData.description}
// //           onChange={(e) => updateFormData({ description: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           rows={6}
// //           placeholder="Detailed product description..."
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Condition</label>
// //         <select
// //           value={formData.condition}
// //           onChange={(e) => updateFormData({ condition: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //         >
// //           <option value="new">New</option>
// //           <option value="used-like-new">Used - Like New</option>
// //           <option value="used-very-good">Used - Very Good</option>
// //           <option value="used-good">Used - Good</option>
// //           <option value="used-acceptable">Used - Acceptable</option>
// //         </select>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Dimensions & Weight</label>
// //         <div className="grid grid-cols-4 gap-4">
// //           <input
// //             type="number"
// //             placeholder="Length (in)"
// //             value={formData.dimensions.length}
// //             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, length: e.target.value } })}
// //             className="px-4 py-2 border rounded"
// //           />
// //           <input
// //             type="number"
// //             placeholder="Width (in)"
// //             value={formData.dimensions.width}
// //             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, width: e.target.value } })}
// //             className="px-4 py-2 border rounded"
// //           />
// //           <input
// //             type="number"
// //             placeholder="Height (in)"
// //             value={formData.dimensions.height}
// //             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, height: e.target.value } })}
// //             className="px-4 py-2 border rounded"
// //           />
// //           <input
// //             type="number"
// //             placeholder="Weight (lb)"
// //             value={formData.dimensions.weight}
// //             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, weight: e.target.value } })}
// //             className="px-4 py-2 border rounded"
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 3: Images & Content
// // function Step3({ formData, updateFormData }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 3: Images & Content</h3>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
// //         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
// //           <Upload className="mx-auto text-gray-400 mb-4" size={48} />
// //           <p className="text-gray-600 mb-2">Drag and drop images here or click to upload</p>
// //           <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels or larger</p>
// //           <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// //             Choose Files
// //           </button>
// //         </div>
// //         <p className="text-xs text-gray-500 mt-2">First image will be the main product image</p>
// //       </div>

// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           id="hasVideo"
// //           checked={formData.hasVideo}
// //           onChange={(e) => updateFormData({ hasVideo: e.target.checked })}
// //         />
// //         <label htmlFor="hasVideo" className="text-sm font-semibold">Add Product Video</label>
// //       </div>

// //       {formData.hasVideo && (
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Video URL</label>
// //           <input
// //             type="url"
// //             value={formData.videoUrl}
// //             onChange={(e) => updateFormData({ videoUrl: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="https://youtube.com/watch?v=..."
// //           />
// //         </div>
// //       )}

// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           id="hasAPlusContent"
// //           checked={formData.hasAPlusContent}
// //           onChange={(e) => updateFormData({ hasAPlusContent: e.target.checked })}
// //         />
// //         <label htmlFor="hasAPlusContent" className="text-sm font-semibold">Enable A+ Content</label>
// //       </div>

// //       <div className="bg-blue-50 border border-blue-200 rounded p-4">
// //         <p className="text-sm text-blue-800">
// //           <strong>Image Requirements:</strong><br />
// //           • JPEG or PNG format<br />
// //           • Minimum 1000 x 1000 pixels<br />
// //           • Product must fill 85% or more of the image<br />
// //           • Pure white background (RGB 255, 255, 255)<br />
// //           • No watermarks, text overlays, or borders
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 4: Pricing & Inventory
// // function Step4({ formData, updateFormData }) {
// //   const calculateFees = () => {
// //     const price = parseFloat(formData.price) || 0;
// //     const referralFee = price * 0.15;
// //     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
// //     const totalFees = referralFee + fbaFee;
// //     const netProceeds = price - totalFees;
    
// //     return { referralFee, fbaFee, totalFees, netProceeds };
// //   };

// //   const fees = calculateFees();

// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 4: Pricing & Inventory</h3>

// //       <div className="grid grid-cols-3 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.price}
// //               onChange={(e) => updateFormData({ price: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //               required
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Sale Price</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.salePrice}
// //               onChange={(e) => updateFormData({ salePrice: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Business Price (B2B)</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.businessPrice}
// //               onChange={(e) => updateFormData({ businessPrice: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {formData.salePrice && (
// //         <div className="grid grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-sm font-semibold mb-2">Sale Start Date</label>
// //             <input
// //               type="date"
// //               value={formData.saleStart}
// //               onChange={(e) => updateFormData({ saleStart: e.target.value })}
// //               className="w-full px-4 py-2 border rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-semibold mb-2">Sale End Date</label>
// //             <input
// //               type="date"
// //               value={formData.saleEnd}
// //               onChange={(e) => updateFormData({ saleEnd: e.target.value })}
// //               className="w-full px-4 py-2 border rounded"
// //             />
// //           </div>
// //         </div>
// //       )}

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Quantity *</label>
// //         <input
// //           type="number"
// //           value={formData.quantity}
// //           onChange={(e) => updateFormData({ quantity: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="0"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
// //         <div className="flex gap-4">
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBA"
// //               checked={formData.fulfillment === 'FBA'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Amazon (FBA)</span>
// //           </label>
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBM"
// //               checked={formData.fulfillment === 'FBM'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Merchant (FBM)</span>
// //           </label>
// //         </div>
// //       </div>

// //       {formData.fulfillment === 'FBA' && (
// //         <div className="bg-gray-50 border rounded p-4 space-y-4">
// //           <h4 className="font-semibold">FBA Prep & Labeling Settings</h4>
          
// //           <div>
// //             <label className="block text-sm font-semibold mb-2">Who Labels</label>
// //             <select
// //               value={formData.prepSettings.labeling}
// //               onChange={(e) => updateFormData({ prepSettings: { ...formData.prepSettings, labeling: e.target.value } })}
// //               className="w-full px-4 py-2 border rounded"
// //             >
// //               <option value="amazon">Amazon Labels (Fee applies)</option>
// //               <option value="merchant">Merchant Labels</option>
// //             </select>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <input
// //               type="checkbox"
// //               id="polybagging"
// //               checked={formData.prepSettings.polybagging}
// //               onChange={(e) => updateFormData({ prepSettings: { ...formData.prepSettings, polybagging: e.target.checked } })}
// //             />
// //             <label htmlFor="polybagging" className="text-sm">Requires Polybagging</label>
// //           </div>
// //         </div>
// //       )}

// //       <div className="bg-green-50 border border-green-200 rounded p-4">
// //         <h4 className="font-semibold mb-3">Fee Preview</h4>
// //         <div className="space-y-2 text-sm">
// //           <div className="flex justify-between">
// //             <span>Price:</span>
// //             <span className="font-semibold">${formData.price || '0.00'}</span>
// //           </div>
// //           <div className="flex justify-between text-red-600">
// //             <span>Referral Fee (15%):</span>
// //             <span>-${fees.referralFee.toFixed(2)}</span>
// //           </div>
// //           {formData.fulfillment === 'FBA' && (
// //             <div className="flex justify-between text-red-600">
// //               <span>FBA Fee:</span>
// //               <span>-${fees.fbaFee.toFixed(2)}</span>
// //             </div>
// //           )}
// //           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
// //             <span>Total Fees:</span>
// //             <span>-${fees.totalFees.toFixed(2)}</span>
// //           </div>
// //           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
// //             <span>Your Net Proceeds:</span>
// //             <span>${fees.netProceeds.toFixed(2)}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 5: SEO & Compliance
// // function Step5({ formData, updateFormData }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 5: SEO & Compliance</h3>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Backend Keywords (250 bytes max)</label>
// //         <textarea
// //           value={formData.keywords}
// //           onChange={(e) => updateFormData({ keywords: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           rows={3}
// //           placeholder="Comma-separated keywords for search optimization"
// //           maxLength={250}
// //         />
// //         <p className="text-sm text-gray-500 mt-1">{formData.keywords.length}/250 bytes</p>
// //         <p className="text-xs text-gray-500 mt-1">These keywords improve search visibility but are not visible to customers</p>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Target Audience</label>
// //         <input
// //           type="text"
// //           value={formData.targetAudience}
// //           onChange={(e) => updateFormData({ targetAudience: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="e.g., Men, Women, Kids"
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Age Range</label>
// //         <select
// //           value={formData.ageRange}
// //           onChange={(e) => updateFormData({ ageRange: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //         >
// //           <option value="">Not Applicable</option>
// //           <option value="0-3">0-3 months</option>
// //           <option value="3-6">3-6 months</option>
// //           <option value="6-12">6-12 months</option>
// //           <option value="1-2">1-2 years</option>
// //           <option value="3-5">3-5 years</option>
// //           <option value="5-8">5-8 years</option>
// //           <option value="8-13">8-13 years</option>
// //           <option value="13+">13+ years</option>
// //         </select>
// //       </div>

// //       <div className="border rounded p-4 space-y-3">
// //         <h4 className="font-semibold">Compliance Checkboxes</h4>
        
// //         <div className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             id="hasBatteries"
// //             checked={formData.hasBatteries}
// //             onChange={(e) => updateFormData({ hasBatteries: e.target.checked })}
// //           />
// //           <label htmlFor="hasBatteries" className="text-sm">Product contains batteries</label>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             id="isHazmat"
// //             checked={formData.isHazmat}
// //             onChange={(e) => updateFormData({ isHazmat: e.target.checked })}
// //           />
// //           <label htmlFor="isHazmat" className="text-sm">Product is hazardous material (Hazmat)</label>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             id="requiresAgeVerification"
// //             checked={formData.requiresAgeVerification}
// //             onChange={(e) => updateFormData({ requiresAgeVerification: e.target.checked })}
// //           />
// //           <label htmlFor="requiresAgeVerification" className="text-sm">Requires age verification (18+)</label>
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Tax Code</label>
// //         <input
// //           type="text"
// //           value={formData.taxCode}
// //           onChange={(e) => updateFormData({ taxCode: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="A_GEN_NOTAX"
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Country of Origin</label>
// //         <select
// //           value={formData.countryOfOrigin}
// //           onChange={(e) => updateFormData({ countryOfOrigin: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //         >
// //           <option value="">Select Country</option>
// //           <option value="US">United States</option>
// //           <option value="CN">China</option>
// //           <option value="IN">India</option>
// //           <option value="MX">Mexico</option>
// //           <option value="CA">Canada</option>
// //           <option value="DE">Germany</option>
// //           <option value="JP">Japan</option>
// //         </select>
// //       </div>

// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           id="giftOptions"
// //           checked={formData.giftOptions}
// //           onChange={(e) => updateFormData({ giftOptions: e.target.checked })}
// //         />
// //         <label htmlFor="giftOptions" className="text-sm font-semibold">Enable gift wrapping and gift message</label>
// //       </div>

// //       <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
// //         <p className="text-sm text-yellow-800">
// //           <strong>Important:</strong> Please ensure all product information is accurate and complies with Amazon's policies. 
// //           Incorrect information may result in listing suppression or account suspension.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // // Reports Component
// // function Reports({ products }) {
// //   const [reportType, setReportType] = useState('all');

// //   const generateReport = () => {
// //     let data = products;
    
// //     switch(reportType) {
// //       case 'active':
// //         data = products.filter(p => p.status === 'active');
// //         break;
// //       case 'inactive':
// //         data = products.filter(p => p.status === 'inactive');
// //         break;
// //       case 'suppressed':
// //         data = products.filter(p => p.status === 'suppressed');
// //         break;
// //       case 'fba':
// //         data = products.filter(p => p.fulfillment === 'FBA');
// //         break;
// //       case 'stranded':
// //         data = products.filter(p => p.status === 'stranded');
// //         break;
// //       case 'lowstock':
// //         data = products.filter(p => p.quantity < 10);
// //         break;
// //     }
    
// //     return data;
// //   };

// //   const reportData = generateReport();

// //   const downloadCSV = () => {
// //     const headers = ['SKU', 'Title', 'Brand', 'Price', 'Quantity', 'Status', 'Fulfillment'];
// //     const rows = reportData.map(p => [
// //       p.sku, p.title, p.brand, p.price, p.quantity, p.status, p.fulfillment
// //     ]);
    
// //     const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
// //     const blob = new Blob([csv], { type: 'text/csv' });
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
// //     a.click();
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Reports</h2>
// //         <button
// //           onClick={downloadCSV}
// //           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //         >
// //           <Download size={20} />
// //           Download CSV
// //         </button>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         <label className="block text-sm font-semibold mb-2">Report Type</label>
// //         <select
// //           value={reportType}
// //           onChange={(e) => setReportType(e.target.value)}
// //           className="w-full max-w-md px-4 py-2 border rounded"
// //         >
// //           <option value="all">All Listings Report</option>
// //           <option value="active">Active Listings</option>
// //           <option value="inactive">Inactive Listings</option>
// //           <option value="suppressed">Suppressed Listings</option>
// //           <option value="fba">FBA Inventory Report</option>
// //           <option value="stranded">Stranded Inventory</option>
// //           <option value="lowstock">Low Stock Alert</option>
// //         </select>
// //       </div>

// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="p-4 bg-gray-50 border-b">
// //           <h3 className="font-semibold">
// //             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
// //           </h3>
// //         </div>
        
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50 border-b">
// //               <tr>
// //                 <th className="p-4 text-left">SKU</th>
// //                 <th className="p-4 text-left">Title</th>
// //                 <th className="p-4 text-left">Brand</th>
// //                 <th className="p-4 text-left">Price</th>
// //                 <th className="p-4 text-left">Quantity</th>
// //                 <th className="p-4 text-left">Status</th>
// //                 <th className="p-4 text-left">Fulfillment</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {reportData.map(product => (
// //                 <tr key={product.id} className="border-b hover:bg-gray-50">
// //                   <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                   <td className="p-4">{product.title}</td>
// //                   <td className="p-4">{product.brand}</td>
// //                   <td className="p-4 font-semibold">${product.price}</td>
// //                   <td className="p-4">
// //                     <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
// //                       {product.quantity}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                       'bg-red-100 text-red-800'
// //                     }`}>
// //                       {product.status?.toUpperCase()}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                     }`}>
// //                       {product.fulfillment}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
          
// //           {reportData.length === 0 && (
// //             <div className="p-12 text-center text-gray-500">
// //               <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //               <p>No products found for this report</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// // import React, { useState, useEffect } from 'react';
// // import { Search, Plus, Upload, Download, Filter, ChevronDown, 
// //   ChevronRight, Package, AlertTriangle, TrendingUp, ShoppingCart, Edit, Trash2, DollarSign, BarChart3 } from 'lucide-react';

// // // In-memory data store
// // const dataStore = {
// //   products: []
// // };

// // // API Service with in-memory storage
// // const API = {
// //   async getProducts() {
// //     return [...dataStore.products];
// //   },
  
// //   async saveProducts(products) {
// //     dataStore.products = products;
// //     return products;
// //   },
  
// //   async createProduct(product) {
// //     const products = await this.getProducts();
// //     const newProduct = { ...product, id: Date.now().toString(), createdAt: new Date().toISOString() };
// //     products.push(newProduct);
// //     await this.saveProducts(products);
// //     return newProduct;
// //   },
  
// //   async updateProduct(id, updates) {
// //     const products = await this.getProducts();
// //     const index = products.findIndex(p => p.id === id);
// //     if (index !== -1) {
// //       products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
// //       await this.saveProducts(products);
// //       return products[index];
// //     }
// //     throw new Error('Product not found');
// //   },
  
// //   async deleteProduct(id) {
// //     const products = await this.getProducts();
// //     const filtered = products.filter(p => p.id !== id);
// //     await this.saveProducts(filtered);
// //     return true;
// //   },
  
// //   async bulkUpdate(ids, updates) {
// //     const products = await this.getProducts();
// //     ids.forEach(id => {
// //       const index = products.findIndex(p => p.id === id);
// //       if (index !== -1) {
// //         products[index] = { ...products[index], ...updates };
// //       }
// //     });
// //     await this.saveProducts(products);
// //     return true;
// //   }
// // };

// // // Main App Component
// // export default function AmazonProductManager() {
// //   const [view, setView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedProducts, setSelectedProducts] = useState([]);
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     status: 'all',
// //     fulfillment: 'all'
// //   });
// //   const [formData, setFormData] = useState({
// //   images: [],
// //   hasVideo: false,
// //   videoUrl: "",
// //   price: "",
// //   image: null,
// //   description: "",
// //   hasAPlusContent: false,
// // });
// // // const [formData, setFormData] = useState({
// // //   name: "",
// // //   price: "",
// // //   image: null,
// // //   description: "",
// // // });

// //   useEffect(() => {
// //     loadProducts();
// //   }, []);

// //   const loadProducts = async () => {
// //     setLoading(true);
// //     const data = await API.getProducts();
// //     setProducts(data);
// //     setLoading(false);
// //   };

// //   const stats = {
// //     total: products.length,
// //     active: products.filter(p => p.status === 'active').length,
// //     outOfStock: products.filter(p => p.quantity === 0).length,
// //     ipiScore: 750
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <h1 className="text-2xl font-bold">Product Manager</h1>
// //           <nav className="flex gap-4">
// //             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Dashboard
// //             </button>
// //             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Products
// //             </button>
// //             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Create Product
// //             </button>
// //             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Reports
// //             </button>
// //           </nav>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto p-6">
// //         {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
// //         {view === 'products' && (
// //           <ProductList
// //             products={products}
// //             filters={filters}
// //             setFilters={setFilters}
// //             selectedProducts={selectedProducts}
// //             setSelectedProducts={setSelectedProducts}
// //             onRefresh={loadProducts}
// //             setView={setView}
// //           />
// //         )}
// //         {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); setView('products'); }} />}
// //         {view === 'reports' && <Reports products={products} />}
// //       </main>

// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setView('create')}
// //         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
// //       >
// //         <Plus size={24} />
// //       </button>
// //     </div>
// //   );
// // }

// // // Dashboard Component
// // function Dashboard({ stats, products }) {
// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-3xl font-bold">Dashboard</h2>
      
// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
// //         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
// //         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
// //         <StatCard title="IPI Score" value={stats.ipiScore} icon={<BarChart3 />} color="bg-purple-500" />
// //       </div>

// //       {/* Top Products */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h3 className="text-xl font-bold mb-4">Top Performing Products</h3>
// //         <div className="space-y-2">
// //           {products.slice(0, 5).map(product => (
// //             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
// //               <div>
// //                 <p className="font-semibold">{product.title}</p>
// //                 <p className="text-sm text-gray-500">SKU: {product.sku}</p>
// //               </div>
// //               <div className="text-right">
// //                 <p className="font-bold text-green-600">${product.price}</p>
// //                 <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
// //               </div>
// //             </div>
// //           ))}
// //           {products.length === 0 && (
// //             <p className="text-gray-500 text-center py-8">No products yet. Create your first product to get started!</p>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function StatCard({ title, value, icon, color }) {
// //   return (
// //     <div className="bg-white rounded-lg shadow p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-gray-500 text-sm">{title}</p>
// //           <p className="text-3xl font-bold mt-2">{value}</p>
// //         </div>
// //         <div className={`${color} text-white p-3 rounded-lg`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Product List Component
// // function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh, setView }) {
// //   const [expandedProducts, setExpandedProducts] = useState([]);

// //   const filteredProducts = products.filter(p => {
// //     const matchesSearch = !filters.search || 
// //       p.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
// //       p.sku?.toLowerCase().includes(filters.search.toLowerCase()) ||
// //       p.asin?.toLowerCase().includes(filters.search.toLowerCase());
    
// //     const matchesStatus = filters.status === 'all' || p.status === filters.status;
// //     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
// //     return matchesSearch && matchesStatus && matchesFulfillment;
// //   });

// //   const handleSelectAll = (e) => {
// //     if (e.target.checked) {
// //       setSelectedProducts(filteredProducts.map(p => p.id));
// //     } else {
// //       setSelectedProducts([]);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
// //       for (const id of selectedProducts) {
// //         await API.deleteProduct(id);
// //       }
// //       setSelectedProducts([]);
// //       onRefresh();
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Products</h2>
// //         <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// //           Refresh
// //         </button>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow p-4">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search by Name, SKU, ASIN..."
// //               value={filters.search}
// //               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
// //               className="w-full pl-10 pr-4 py-2 border rounded"
// //             />
// //           </div>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //             <option value="outofstock">Out of Stock</option>
// //             <option value="suppressed">Suppressed</option>
// //             <option value="stranded">Stranded</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA</option>
// //             <option value="FBM">FBM</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Bulk Actions */}
// //       {selectedProducts.length > 0 && (
// //         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
// //           <span className="font-semibold">{selectedProducts.length} products selected</span>
// //           <div className="flex gap-2">
// //             <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
// //               Delete Selected
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Products Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-50 border-b">
// //             <tr>
// //               <th className="p-4 text-left">
// //                 <input
// //                   type="checkbox"
// //                   onChange={handleSelectAll}
// //                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
// //                 />
// //               </th>
// //               <th className="p-4 text-left">Product</th>
// //               <th className="p-4 text-left">SKU</th>
// //               <th className="p-4 text-left">Status</th>
// //               <th className="p-4 text-left">Price</th>
// //               <th className="p-4 text-left">Quantity</th>
// //               <th className="p-4 text-left">Fulfillment</th>
// //               <th className="p-4 text-left">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredProducts.map(product => (
// //               <tr key={product.id} className="border-b hover:bg-gray-50">
// //                 <td className="p-4">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedProducts.includes(product.id)}
// //                     onChange={(e) => {
// //                       if (e.target.checked) {
// //                         setSelectedProducts([...selectedProducts, product.id]);
// //                       } else {
// //                         setSelectedProducts(selectedProducts.filter(id => id !== product.id));
// //                       }
// //                     }}
// //                   />
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
// //                       <Package size={20} className="text-gray-400" />
// //                     </div>
// //                     <div>
// //                       <p className="font-semibold">{product.title}</p>
// //                       <p className="text-sm text-gray-500">{product.brand}</p>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                     'bg-red-100 text-red-800'
// //                   }`}>
// //                     {product.status?.toUpperCase()}
// //                   </span>
// //                 </td>
// //                 <td className="p-4 font-semibold">${product.price}</td>
// //                 <td className="p-4">
// //                   <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
// //                     {product.quantity}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                   }`}>
// //                     {product.fulfillment}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex gap-2">
// //                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
// //                       <Edit size={18} />
// //                     </button>
// //                     <button
// //                       onClick={async () => {
// //                         if (window.confirm('Delete this product?')) {
// //                           await API.deleteProduct(product.id);
// //                           onRefresh();
// //                         }
// //                       }}
// //                       className="p-2 text-red-600 hover:bg-red-50 rounded"
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
        
// //         {filteredProducts.length === 0 && (
// //           <div className="p-12 text-center text-gray-500">
// //             <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //             <p>No products found</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// // const handleImageUpload = (files) => {
// //   const selected = Array.from(files);

// //   let images = [...formData.images];

// //   selected.forEach((file) => {
// //     if (images.length < 9) {
// //       images.push({
// //         file,
// //         preview: URL.createObjectURL(file),
// //       });
// //     }
// //   });

// //   updateFormData({ images });
// // };

// // const removeImage = (index) => {
// //   const updated = [...formData.images];
// //   updated.splice(index, 1);
// //   updateFormData({ images: updated });
// // };


// // const updateFormData = (changes) => {
// //   setFormData((prev) => ({ ...prev, ...changes }));
// // };

// // // Create Product Component (5-Step Form)
// // function CreateProduct({ onSuccess }) {
// //   const [step, setStep] = useState(1);
// //   const [formData, setFormData] = useState({
// //     productIdType: 'ASIN',
// //     productId: '',
// //     sku: '',
// //     brand: '',
// //     title: '',
// //     category: '',
// //     gtinExemption: false,
// //     hasVariations: false,
// //     variations: [],
// //     bulletPoints: ['', '', '', '', ''],
// //     description: '',
// //     condition: 'new',
// //     dimensions: { length: '', width: '', height: '', weight: '' },
// //     images: [],
// //     hasVideo: false,
// //     videoUrl: '',
// //     hasAPlusContent: false,
// //     price: '',
// //     salePrice: '',
// //     businessPrice: '',
// //     saleStart: '',
// //     saleEnd: '',
// //     quantity: '',
// //     fulfillment: 'FBA',
// //     prepSettings: { labeling: 'amazon', polybagging: false },
// //     keywords: '',
// //     targetAudience: '',
// //     ageRange: '',
// //     hasBatteries: false,
// //     isHazmat: false,
// //     requiresAgeVerification: false,
// //     taxCode: '',
// //     countryOfOrigin: '',
// //     giftOptions: false,
// //     status: 'active'
// //   });

// //   const handleSubmit = async () => {
// //     try {
// //       await API.createProduct(formData);
// //       alert('Product created successfully!');
// //       onSuccess();
// //     } catch (error) {
// //       alert('Error creating product: ' + error.message);
// //     }
// //   };

// //   const updateFormData = (updates) => {
// //     setFormData({ ...formData, ...updates });
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
// //       {/* Progress Steps */}
// //       <div className="bg-white rounded-lg shadow p-6 mb-6">
// //         <div className="flex justify-between items-center">
// //           {[1, 2, 3, 4, 5].map(s => (
// //             <div key={s} className="flex items-center">
// //               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
// //                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
// //               }`}>
// //                 {s}
// //               </div>
// //               {s < 5 && <div className={`w-20 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
// //             </div>
// //           ))}
// //         </div>
// //         <div className="flex justify-between mt-2 text-sm">
// //           <span>Identity</span>
// //           <span>Details</span>
// //           <span>Images</span>
// //           <span>Pricing</span>
// //           <span>SEO</span>
// //         </div>
// //       </div>

// //       {/* Form Content */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
// //         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} />}
// //         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}
// //         {step === 4 && <Step4 formData={formData} updateFormData={updateFormData} />}
// //         {step === 5 && <Step5 formData={formData} updateFormData={updateFormData} />}

// //         {/* Navigation Buttons */}
// //         <div className="flex justify-between mt-8 pt-6 border-t">
// //           <button
// //             onClick={() => setStep(Math.max(1, step - 1))}
// //             disabled={step === 1}
// //             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
// //           >
// //             Previous
// //           </button>
          
// //           {step < 5 ? (
// //             <button
// //               onClick={() => setStep(Math.min(5, step + 1))}
// //               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
// //             >
// //               Next
// //             </button>
// //           ) : (
// //             <button
// //               onClick={handleSubmit}
// //               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //             >
// //               Create Product
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 1: Product Identity
// // function Step1({ formData, updateFormData }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
// //       <div className="grid grid-cols-2 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
// //           <select
// //             value={formData.productIdType}
// //             onChange={(e) => updateFormData({ productIdType: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //           >
// //             <option value="ASIN">ASIN</option>
// //             <option value="UPC">UPC</option>
// //             <option value="EAN">EAN</option>
// //             <option value="ISBN">ISBN</option>
// //           </select>
// //         </div>
        
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID</label>
// //           <input
// //             type="text"
// //             value={formData.productId}
// //             onChange={(e) => updateFormData({ productId: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="B08N5WRWNW"
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">SKU *</label>
// //         <input
// //           type="text"
// //           value={formData.sku}
// //           onChange={(e) => updateFormData({ sku: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="SKU-12345"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Brand *</label>
// //         <input
// //           type="text"
// //           value={formData.brand}
// //           onChange={(e) => updateFormData({ brand: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Your Brand Name"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Title * (200 chars max)</label>
// //         <input
// //           type="text"
// //           value={formData.title}
// //           onChange={(e) => updateFormData({ title: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Product Title with Key Features"
// //           maxLength={200}
// //           required
// //         />
// //         <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 characters</p>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Category *</label>
// //         <select
// //           value={formData.category}
// //           onChange={(e) => updateFormData({ category: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           required
// //         >
// //           <option value="">Select Category</option>
// //           <option value="electronics">Electronics</option>
// //           <option value="clothing">Clothing</option>
// //           <option value="home">Home & Kitchen</option>
// //           <option value="sports">Sports & Outdoors</option>
// //           <option value="books">Books</option>
// //         </select>
// //       </div>

// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           id="gtinExemption"
// //           checked={formData.gtinExemption}
// //           onChange={(e) => updateFormData({ gtinExemption: e.target.checked })}
// //         />
// //         <label htmlFor="gtinExemption" className="text-sm">Request GTIN Exemption</label>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 2: Details & Variations
// // function Step2({ formData, updateFormData }) {
// //   const updateBulletPoint = (index, value) => {
// //     const newBulletPoints = [...formData.bulletPoints];
// //     newBulletPoints[index] = value;
// //     updateFormData({ bulletPoints: newBulletPoints });
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 2: Product Details & Variations</h3>

// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           id="hasVariations"
// //           checked={formData.hasVariations}
// //           onChange={(e) => updateFormData({ hasVariations: e.target.checked })}
// //         />
// //         <label htmlFor="hasVariations" className="text-sm font-semibold">This product has variations (Size, Color, etc.)</label>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Bullet Points (5 max, 500 chars each)</label>
// //         {formData.bulletPoints.map((bullet, index) => (
// //           <div key={index} className="mb-3">
// //             <textarea
// //               value={bullet}
// //               onChange={(e) => updateBulletPoint(index, e.target.value)}
// //               className="w-full px-4 py-2 border rounded"
// //               placeholder={`Feature ${index + 1}`}
// //               maxLength={500}
// //               rows={2}
// //             />
// //             <p className="text-xs text-gray-500 mt-1">{bullet.length}/500 characters</p>
// //           </div>
// //         ))}
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Description</label>
// //         <textarea
// //           value={formData.description}
// //           onChange={(e) => updateFormData({ description: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           rows={6}
// //           placeholder="Detailed product description..."
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Condition</label>
// //         <select
// //           value={formData.condition}
// //           onChange={(e) => updateFormData({ condition: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //         >
// //           <option value="new">New</option>
// //           <option value="used-like-new">Used - Like New</option>
// //           <option value="used-very-good">Used - Very Good</option>
// //           <option value="used-good">Used - Good</option>
// //           <option value="used-acceptable">Used - Acceptable</option>
// //         </select>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Dimensions & Weight</label>
// //         <div className="grid grid-cols-4 gap-4">
// //           <input
// //             type="number"
// //             placeholder="Length (in)"
// //             value={formData.dimensions.length}
// //             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, length: e.target.value } })}
// //             className="px-4 py-2 border rounded"
// //           />
// //           <input
// //             type="number"
// //             placeholder="Width (in)"
// //             value={formData.dimensions.width}
// //             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, width: e.target.value } })}
// //             className="px-4 py-2 border rounded"
// //           />
// //           <input
// //             type="number"
// //             placeholder="Height (in)"
// //             value={formData.dimensions.height}
// //             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, height: e.target.value } })}
// //             className="px-4 py-2 border rounded"
// //           />
// //           <input
// //             type="number"
// //             placeholder="Weight (lb)"
// //             value={formData.dimensions.weight}
// //             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, weight: e.target.value } })}
// //             className="px-4 py-2 border rounded"
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 3: Images & Content
// // function Step3({ formData, updateFormData }) {
// //   return (
// //     // <div className="space-y-6">
// //     //   <h3 className="text-xl font-bold">Step 3: Images & Content</h3>

// //     //   <div>
// //     //     <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
// //     //     <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
// //     //       <Upload className="mx-auto text-gray-400 mb-4" size={48} />
// //     //       <p className="text-gray-600 mb-2">Drag and drop images here or click to upload</p>
// //     //       <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels or larger</p>
// //     //       <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// //     //         Choose Files
// //     //       </button>
// //     //     </div>
// //     //     <p className="text-xs text-gray-500 mt-2">First image will be the main product image</p>
// //     //   </div>

// //     //   <div className="flex items-center gap-2">
// //     //     <input
// //     //       type="checkbox"
// //     //       id="hasVideo"
// //     //       checked={formData.hasVideo}
// //     //       onChange={(e) => updateFormData({ hasVideo: e.target.checked })}
// //     //     />
// //     //     <label htmlFor="hasVideo" className="text-sm font-semibold">Add Product Video</label>
// //     //   </div>

// //     //   {formData.hasVideo && (
// //     //     <div>
// //     //       <label className="block text-sm font-semibold mb-2">Video URL</label>
// //     //       <input
// //     //         type="url"
// //     //         value={formData.videoUrl}
// //     //         onChange={(e) => updateFormData({ videoUrl: e.target.value })}
// //     //         className="w-full px-4 py-2 border rounded"
// //     //         placeholder="https://youtube.com/watch?v=..."
// //     //       />
// //     //     </div>
// //     //   )}

// //     //   <div className="flex items-center gap-2">
// //     //     <input
// //     //       type="checkbox"
// //     //       id="hasAPlusContent"
// //     //       checked={formData.hasAPlusContent}
// //     //       onChange={(e) => updateFormData({ hasAPlusContent: e.target.checked })}
// //     //     />
// //     //     <label htmlFor="hasAPlusContent" className="text-sm font-semibold">Enable A+ Content</label>
// //     //   </div>

// //     //   <div className="bg-blue-50 border border-blue-200 rounded p-4">
// //     //     <p className="text-sm text-blue-800">
// //     //       <strong>Image Requirements:</strong><br />
// //     //       • JPEG or PNG format<br />
// //     //       • Minimum 1000 x 1000 pixels<br />
// //     //       • Product must fill 85% or more of the image<br />
// //     //       • Pure white background (RGB 255, 255, 255)<br />
// //     //       • No watermarks, text overlays, or borders
// //     //     </p>
// //     //   </div>
// //     // </div>
// //     <div className="space-y-6">
// //   <h3 className="text-xl font-bold">Step 3: Images & Content</h3>

// //   {/* IMAGE UPLOAD */}
// //   <div>
// //     <label className="block text-sm font-semibold mb-2">
// //       Product Images (9 max)
// //     </label>

// //     <div
// //       className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
// //       onClick={() => document.getElementById("uploadImagesInput").click()}
// //       onDragOver={(e) => e.preventDefault()}
// //       onDrop={(e) => {
// //         e.preventDefault();
// //         const files = e.dataTransfer.files;
// //         handleImageUpload(files);
// //       }}
// //     >
// //       <Upload className="mx-auto text-gray-400 mb-4" size={48} />
// //       <p className="text-gray-600 mb-2">
// //         Drag and drop images here or click to upload
// //       </p>
// //       <p className="text-sm text-gray-500">
// //         Recommended: 1000 x 1000 pixels or larger
// //       </p>

// //       <button
// //         onClick={() => document.getElementById("uploadImagesInput").click()}
// //         type="button"
// //         className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //       >
// //         Choose Files
// //       </button>

// //       {/* Hidden File Input */}
// //       <input
// //         type="file"
// //         id="uploadImagesInput"
// //         accept="image/*"
// //         multiple
// //         className="hidden"
// //         onChange={(e) => handleImageUpload(e.target.files)}
// //       />
// //     </div>

// //     <p className="text-xs text-gray-500 mt-2">
// //       First image will be the main product image
// //     </p>
// //   </div>

// //   {/* IMAGE PREVIEW GRID */}
// //   {formData.images?.length > 0 && (
// //     <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
// //       {formData.images.map((img, index) => (
// //         <div key={index} className="relative group">
// //           <img
// //             src={img.preview}
// //             className="w-full h-28 object-cover rounded border"
// //             alt="preview"
// //           />

// //           <button
// //             type="button"
// //             onClick={() => removeImage(index)}
// //             className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hidden group-hover:block"
// //           >
// //             <svg
// //               xmlns="http://www.w3.org/2000/svg"
// //               className="h-4 w-4 text-red-500"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //             >
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //             </svg>
// //           </button>
// //         </div>
// //       ))}
// //     </div>
// //   )}

// //   {/* VIDEO TOGGLE */}
// //   <div className="flex items-center gap-2">
// //     <input
// //       type="checkbox"
// //       id="hasVideo"
// //       checked={formData.hasVideo}
// //       onChange={(e) => updateFormData({ hasVideo: e.target.checked })}
// //     />
// //     <label htmlFor="hasVideo" className="text-sm font-semibold">
// //       Add Product Video
// //     </label>
// //   </div>

// //   {/* VIDEO FIELD */}
// //   {formData.hasVideo && (
// //     <div>
// //       <label className="block text-sm font-semibold mb-2">Video URL</label>
// //       <input
// //         type="url"
// //         value={formData.videoUrl}
// //         onChange={(e) => updateFormData({ videoUrl: e.target.value })}
// //         className="w-full px-4 py-2 border rounded"
// //         placeholder="https://youtube.com/watch?v=..."
// //       />
// //     </div>
// //   )}

// //   {/* A+ CONTENT */}
// //   <div className="flex items-center gap-2">
// //     <input
// //       type="checkbox"
// //       id="hasAPlusContent"
// //       checked={formData.hasAPlusContent}
// //       onChange={(e) => updateFormData({ hasAPlusContent: e.target.checked })}
// //     />
// //     <label htmlFor="hasAPlusContent" className="text-sm font-semibold">
// //       Enable A+ Content
// //     </label>
// //   </div>

// //   {/* IMAGE REQUIREMENTS */}
// //   <div className="bg-blue-50 border border-blue-200 rounded p-4">
// //     <p className="text-sm text-blue-800">
// //       <strong>Image Requirements:</strong><br />
// //       • JPEG or PNG format<br />
// //       • Minimum 1000 x 1000 pixels<br />
// //       • Product must fill 85% or more of the image<br />
// //       • Pure white background (RGB 255, 255, 255)<br />
// //       • No watermarks, text overlays, or borders
// //     </p>
// //   </div>
// // </div>

// //   );
// // }

// // // Step 4: Pricing & Inventory
// // function Step4({ formData, updateFormData }) {
// //   const calculateFees = () => {
// //     const price = parseFloat(formData.price) || 0;
// //     const referralFee = price * 0.15;
// //     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
// //     const totalFees = referralFee + fbaFee;
// //     const netProceeds = price - totalFees;
    
// //     return { referralFee, fbaFee, totalFees, netProceeds };
// //   };

// //   const fees = calculateFees();

// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 4: Pricing & Inventory</h3>

// //       <div className="grid grid-cols-3 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.price}
// //               onChange={(e) => updateFormData({ price: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //               required
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Sale Price</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.salePrice}
// //               onChange={(e) => updateFormData({ salePrice: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Business Price (B2B)</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.businessPrice}
// //               onChange={(e) => updateFormData({ businessPrice: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {formData.salePrice && (
// //         <div className="grid grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-sm font-semibold mb-2">Sale Start Date</label>
// //             <input
// //               type="date"
// //               value={formData.saleStart}
// //               onChange={(e) => updateFormData({ saleStart: e.target.value })}
// //               className="w-full px-4 py-2 border rounded"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-semibold mb-2">Sale End Date</label>
// //             <input
// //               type="date"
// //               value={formData.saleEnd}
// //               onChange={(e) => updateFormData({ saleEnd: e.target.value })}
// //               className="w-full px-4 py-2 border rounded"
// //             />
// //           </div>
// //         </div>
// //       )}

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Quantity *</label>
// //         <input
// //           type="number"
// //           value={formData.quantity}
// //           onChange={(e) => updateFormData({ quantity: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="0"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
// //         <div className="flex gap-4">
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBA"
// //               checked={formData.fulfillment === 'FBA'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Amazon (FBA)</span>
// //           </label>
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBM"
// //               checked={formData.fulfillment === 'FBM'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Merchant (FBM)</span>
// //           </label>
// //         </div>
// //       </div>

// //       {formData.fulfillment === 'FBA' && (
// //         <div className="bg-gray-50 border rounded p-4 space-y-4">
// //           <h4 className="font-semibold">FBA Prep & Labeling Settings</h4>
          
// //           <div>
// //             <label className="block text-sm font-semibold mb-2">Who Labels</label>
// //             <select
// //               value={formData.prepSettings.labeling}
// //               onChange={(e) => updateFormData({ prepSettings: { ...formData.prepSettings, labeling: e.target.value } })}
// //               className="w-full px-4 py-2 border rounded"
// //             >
// //               <option value="amazon">Amazon Labels (Fee applies)</option>
// //               <option value="merchant">Merchant Labels</option>
// //             </select>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <input
// //               type="checkbox"
// //               id="polybagging"
// //               checked={formData.prepSettings.polybagging}
// //               onChange={(e) => updateFormData({ prepSettings: { ...formData.prepSettings, polybagging: e.target.checked } })}
// //             />
// //             <label htmlFor="polybagging" className="text-sm">Requires Polybagging</label>
// //           </div>
// //         </div>
// //       )}

// //       <div className="bg-green-50 border border-green-200 rounded p-4">
// //         <h4 className="font-semibold mb-3">Fee Preview</h4>
// //         <div className="space-y-2 text-sm">
// //           <div className="flex justify-between">
// //             <span>Price:</span>
// //             <span className="font-semibold">${formData.price || '0.00'}</span>
// //           </div>
// //           <div className="flex justify-between text-red-600">
// //             <span>Referral Fee (15%):</span>
// //             <span>-${fees.referralFee.toFixed(2)}</span>
// //           </div>
// //           {formData.fulfillment === 'FBA' && (
// //             <div className="flex justify-between text-red-600">
// //               <span>FBA Fee:</span>
// //               <span>-${fees.fbaFee.toFixed(2)}</span>
// //             </div>
// //           )}
// //           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
// //             <span>Total Fees:</span>
// //             <span>-${fees.totalFees.toFixed(2)}</span>
// //           </div>
// //           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
// //             <span>Your Net Proceeds:</span>
// //             <span>${fees.netProceeds.toFixed(2)}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step 5: SEO & Compliance
// // function Step5({ formData, updateFormData }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 5: SEO & Compliance</h3>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Backend Keywords (250 bytes max)</label>
// //         <textarea
// //           value={formData.keywords}
// //           onChange={(e) => updateFormData({ keywords: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           rows={3}
// //           placeholder="Comma-separated keywords for search optimization"
// //           maxLength={250}
// //         />
// //         <p className="text-sm text-gray-500 mt-1">{formData.keywords.length}/250 bytes</p>
// //         <p className="text-xs text-gray-500 mt-1">These keywords improve search visibility but are not visible to customers</p>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Target Audience</label>
// //         <input
// //           type="text"
// //           value={formData.targetAudience}
// //           onChange={(e) => updateFormData({ targetAudience: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="e.g., Men, Women, Kids"
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Age Range</label>
// //         <select
// //           value={formData.ageRange}
// //           onChange={(e) => updateFormData({ ageRange: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //         >
// //           <option value="">Not Applicable</option>
// //           <option value="0-3">0-3 months</option>
// //           <option value="3-6">3-6 months</option>
// //           <option value="6-12">6-12 months</option>
// //           <option value="1-2">1-2 years</option>
// //           <option value="3-5">3-5 years</option>
// //           <option value="5-8">5-8 years</option>
// //           <option value="8-13">8-13 years</option>
// //           <option value="13+">13+ years</option>
// //         </select>
// //       </div>

// //       <div className="border rounded p-4 space-y-3">
// //         <h4 className="font-semibold">Compliance Checkboxes</h4>
        
// //         <div className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             id="hasBatteries"
// //             checked={formData.hasBatteries}
// //             onChange={(e) => updateFormData({ hasBatteries: e.target.checked })}
// //           />
// //           <label htmlFor="hasBatteries" className="text-sm">Product contains batteries</label>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             id="isHazmat"
// //             checked={formData.isHazmat}
// //             onChange={(e) => updateFormData({ isHazmat: e.target.checked })}
// //           />
// //           <label htmlFor="isHazmat" className="text-sm">Product is hazardous material (Hazmat)</label>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             id="requiresAgeVerification"
// //             checked={formData.requiresAgeVerification}
// //             onChange={(e) => updateFormData({ requiresAgeVerification: e.target.checked })}
// //           />
// //           <label htmlFor="requiresAgeVerification" className="text-sm">Requires age verification (18+)</label>
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Tax Code</label>
// //         <input
// //           type="text"
// //           value={formData.taxCode}
// //           onChange={(e) => updateFormData({ taxCode: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="A_GEN_NOTAX"
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Country of Origin</label>
// //         <select
// //           value={formData.countryOfOrigin}
// //           onChange={(e) => updateFormData({ countryOfOrigin: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //         >
// //           <option value="">Select Country</option>
// //           <option value="US">United States</option>
// //           <option value="CN">China</option>
// //           <option value="IN">India</option>
// //           <option value="MX">Mexico</option>
// //           <option value="CA">Canada</option>
// //           <option value="DE">Germany</option>
// //           <option value="JP">Japan</option>
// //         </select>
// //       </div>

// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           id="giftOptions"
// //           checked={formData.giftOptions}
// //           onChange={(e) => updateFormData({ giftOptions: e.target.checked })}
// //         />
// //         <label htmlFor="giftOptions" className="text-sm font-semibold">Enable gift wrapping and gift message</label>
// //       </div>

// //       <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
// //         <p className="text-sm text-yellow-800">
// //           <strong>Important:</strong> Please ensure all product information is accurate and complies with Amazon's policies. 
// //           Incorrect information may result in listing suppression or account suspension.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // // Reports Component
// // function Reports({ products }) {
// //   const [reportType, setReportType] = useState('all');

// //   const generateReport = () => {
// //     let data = products;
    
// //     switch(reportType) {
// //       case 'active':
// //         data = products.filter(p => p.status === 'active');
// //         break;
// //       case 'inactive':
// //         data = products.filter(p => p.status === 'inactive');
// //         break;
// //       case 'suppressed':
// //         data = products.filter(p => p.status === 'suppressed');
// //         break;
// //       case 'fba':
// //         data = products.filter(p => p.fulfillment === 'FBA');
// //         break;
// //       case 'stranded':
// //         data = products.filter(p => p.status === 'stranded');
// //         break;
// //       case 'lowstock':
// //         data = products.filter(p => p.quantity < 10);
// //         break;
// //     }
    
// //     return data;
// //   };

// //   const reportData = generateReport();

// //   const downloadCSV = () => {
// //     const headers = ['SKU', 'Title', 'Brand', 'Price', 'Quantity', 'Status', 'Fulfillment'];
// //     const rows = reportData.map(p => [
// //       p.sku, p.title, p.brand, p.price, p.quantity, p.status, p.fulfillment
// //     ]);
    
// //     const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
// //     const blob = new Blob([csv], { type: 'text/csv' });
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
// //     a.click();
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Reports</h2>
// //         <button
// //           onClick={downloadCSV}
// //           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //         >
// //           <Download size={20} />
// //           Download CSV
// //         </button>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         <label className="block text-sm font-semibold mb-2">Report Type</label>
// //         <select
// //           value={reportType}
// //           onChange={(e) => setReportType(e.target.value)}
// //           className="w-full max-w-md px-4 py-2 border rounded"
// //         >
// //           <option value="all">All Listings Report</option>
// //           <option value="active">Active Listings</option>
// //           <option value="inactive">Inactive Listings</option>
// //           <option value="suppressed">Suppressed Listings</option>
// //           <option value="fba">FBA Inventory Report</option>
// //           <option value="stranded">Stranded Inventory</option>
// //           <option value="lowstock">Low Stock Alert</option>
// //         </select>
// //       </div>

// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="p-4 bg-gray-50 border-b">
// //           <h3 className="font-semibold">
// //             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
// //           </h3>
// //         </div>
        
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50 border-b">
// //               <tr>
// //                 <th className="p-4 text-left">SKU</th>
// //                 <th className="p-4 text-left">Title</th>
// //                 <th className="p-4 text-left">Brand</th>
// //                 <th className="p-4 text-left">Price</th>
// //                 <th className="p-4 text-left">Quantity</th>
// //                 <th className="p-4 text-left">Status</th>
// //                 <th className="p-4 text-left">Fulfillment</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {reportData.map(product => (
// //                 <tr key={product.id} className="border-b hover:bg-gray-50">
// //                   <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                   <td className="p-4">{product.title}</td>
// //                   <td className="p-4">{product.brand}</td>
// //                   <td className="p-4 font-semibold">${product.price}</td>
// //                   <td className="p-4">
// //                     <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
// //                       {product.quantity}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                       'bg-red-100 text-red-800'
// //                     }`}>
// //                       {product.status?.toUpperCase()}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                     }`}>
// //                       {product.fulfillment}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
          
// //           {reportData.length === 0 && (
// //             <div className="p-12 text-center text-gray-500">
// //               <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //               <p>No products found for this report</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// // import React, { useState, useEffect } from 'react';
// // import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';
// // // import StatCard from "StatCard";

// // // API Configuration
// // const API_BASE_URL = 'http://localhost:8000/api';

// // // API Service with backend integration and fallback to persistent storage
// // const API = {
// //   STORAGE_KEY: "products-data",
// //   VENDOR_KEY: "current-vendor",

// //   getFromStorage: async () => {
// //     try {
// //       const data = localStorage.getItem(API.STORAGE_KEY);
// //       return data ? JSON.parse(data) : [];
// //     } catch (e) {
// //       console.error("Storage read error:", e);
// //       return [];
// //     }
// //   },

// //   saveToStorage: async (products) => {
// //     try {
// //       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
// //       return products;
// //     } catch (e) {
// //       console.error("Storage write error:", e);
// //       throw e;
// //     }
// //   },

// //   getCurrentVendor: async () => {
// //     try {
// //       const result = await window.storage.get(API.VENDOR_KEY);
// //       return result ? result.value : "default-vendor";
// //     } catch {
// //       return "default-vendor";
// //     }
// //   },

// //   setCurrentVendor: async (vendorId) => {
// //     try {
// //       await window.storage.set(API.VENDOR_KEY, vendorId);
// //     } catch (e) {
// //       console.error("Vendor save error:", e);
// //     }
// //   },

// //   getProducts: async () => {
// //     try {
// //       const vendorId = await API.getCurrentVendor();
// //       const response = await fetch(`${API_BASE_URL}/products?vendorId=${vendorId}`);

// //       if (!response.ok) throw new Error("API failed");

// //       const data = await response.json();
// //       return data.products || data;
// //     } catch {
// //       console.log("Using local storage");
// //       return await API.getFromStorage();
// //     }
// //   },

// //   createProduct: async (product) => {
// //     const vendorId = await API.getCurrentVendor();

// //     const productData = {
// //       ...product,
// //       vendorId,
// //       createdAt: new Date().toISOString(),
// //     };

// //     try {
// //       const response = await fetch(`${API_BASE_URL}/products`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(productData),
// //       });

// //       if (!response.ok) throw new Error("API failed");

// //       const data = await response.json();
// //       return data.product || data;

// //     } catch {
// //       console.log("Saving locally");
// //       const products = await API.getFromStorage();
// //       const newProduct = { ...productData, id: Date.now().toString() };
// //       products.push(newProduct);
// //       await API.saveToStorage(products);
// //       return newProduct;
// //     }
// //   },

// //   updateProduct: async (id, updates) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/products/${id}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(updates),
// //       });

// //       if (!response.ok) throw new Error("API failed");

// //       const data = await response.json();
// //       return data.product || data;
// //     } catch {
// //       console.log("Updating locally");
// //       const products = await API.getFromStorage();
// //       const index = products.findIndex((p) => p.id === id);

// //       if (index !== -1) {
// //         products[index] = {
// //           ...products[index],
// //           ...updates,
// //           updatedAt: new Date().toISOString(),
// //         };
// //         await API.saveToStorage(products);
// //         return products[index];
// //       }

// //       throw new Error("Product not found");
// //     }
// //   },

// //   deleteProduct: async (id) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/products/${id}`, {
// //         method: "DELETE",
// //       });

// //       if (!response.ok) throw new Error("API failed");

// //       return true;

// //     } catch {
// //       console.log("Deleting locally");
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => p.id !== id);
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   },
// // };



// // // Main App Component
// // export default function AmazonProductManager() {
// //   const [view, setView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedProducts, setSelectedProducts] = useState([]);
// //   const [currentVendor, setCurrentVendor] = useState(API.getCurrentVendor());
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     status: 'all',
// //     fulfillment: 'all'
// //   });

// //   useEffect(() => {
// //     loadProducts();
// //   }, [currentVendor]);

// //   const loadProducts = async () => {
// //     setLoading(true);
// //     try {
// //       const data = await API.getProducts();
// //       setProducts(data);
// //     } catch (error) {
// //       console.error('Error loading products:', error);
// //       alert('Failed to load products. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVendorChange = (vendorId) => {
// //     API.setCurrentVendor(vendorId);
// //     setCurrentVendor(vendorId);
// //   };

// //   const stats = {
// //     total: products.length,
// //     active: products.filter(p => p.status === 'active').length,
// //     outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
// //     ipiScore: 750
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <h1 className="text-2xl font-bold">Product Manager</h1>
// //             <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
// //               <User size={18} />
// //               <select
// //                 value={currentVendor}
// //                 onChange={(e) => handleVendorChange(e.target.value)}
// //                 className="bg-transparent border-none text-white text-sm focus:outline-none"
// //               >
// //                 <option value="default-vendor">Default Vendor</option>
// //                 <option value="vendor-1">Vendor 1</option>
// //                 <option value="vendor-2">Vendor 2</option>
// //                 <option value="vendor-3">Vendor 3</option>
// //               </select>
// //             </div>
// //           </div>
// //           <nav className="flex gap-4">
// //             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Dashboard
// //             </button>
// //             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Products
// //             </button>
// //             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Create Product
// //             </button>
// //             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Reports
// //             </button>
// //           </nav>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto p-6">
// //         {loading ? (
// //           <div className="flex items-center justify-center h-64">
// //             <div className="text-gray-500">Loading...</div>
// //           </div>
// //         ) : (
// //           <>
// //             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
// //             {view === 'products' && (
// //               <ProductList
// //                 products={products}
// //                 filters={filters}
// //                 setFilters={setFilters}
// //                 selectedProducts={selectedProducts}
// //                 setSelectedProducts={setSelectedProducts}
// //                 onRefresh={loadProducts}
// //                 setView={setView}
// //               />
// //             )}
// //             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); setView('products'); }} />}
// //             {view === 'reports' && <Reports products={products} />}
// //           </>
// //         )}
// //       </main>

// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setView('create')}
// //         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
// //       >
// //         <Plus size={24} />
// //       </button>
// //     </div>
// //   );
// // }

// // // Dashboard Component
// // // function Dashboard({ stats, products }) {
// // //   return (
// // //     <div className="space-y-6">
// // //       <h2 className="text-3xl font-bold">Dashboard</h2>
      
// // //       {/* Stats Cards */}
// // //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // //         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
// // //         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
// // //         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
// // //         <StatCard title="IPI Score" value={stats.ipiScore} icon={<BarChart3 />} color="bg-purple-500" />
// // //       </div>

// // //       {/* Top Products */}
// // //       <div className="bg-white rounded-lg shadow p-6">
// // //         <h3 className="text-xl font-bold mb-4">Top Performing Products</h3>
// // //         <div className="space-y-2">
// // //           {products.slice(0, 5).map(product => (
// // //             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
// // //               <div>
// // //                 <p className="font-semibold">{product.title}</p>
// // //                 <p className="text-sm text-gray-500">SKU: {product.sku}</p>
// // //               </div>
// // //               <div className="text-right">
// // //                 <p className="font-bold text-green-600">${product.price}</p>
// // //                 <p className="text-sm text-gray-500">Qty: {product.quantity || 0}</p>
// // //               </div>
// // //             </div>
// // //           ))}
// // //           {products.length === 0 && (
// // //             <p className="text-gray-500 text-center py-8">No products yet. Create your first product to get started!</p>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function StatCard({ title, value, icon, color }) {
// // //   return (
// // //     <div className="bg-white rounded-lg shadow p-6">
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <p className="text-gray-500 text-sm">{title}</p>
// // //           <p className="text-3xl font-bold mt-2">{value}</p>
// // //         </div>
// // //         <div className={`${color} text-white p-3 rounded-lg`}>
// // //           {icon}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // // Dashboard Component
// // function Dashboard({ stats, products }) {
// //   const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0);
// //   const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0;
// //   const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity < 10).length;
// //   const fbaCount = products.filter(p => p.fulfillment === 'FBA').length;
// //   const fbmCount = products.filter(p => p.fulfillment === 'FBM').length;

// //   const categoryBreakdown = products.reduce((acc, p) => {
// //     acc[p.category] = (acc[p.category] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const statusBreakdown = products.reduce((acc, p) => {
// //     acc[p.status] = (acc[p.status] || 0) + 1;
// //     return acc;
// //   }, {});

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-3xl font-bold">Dashboard</h2>
      
// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
// //         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
// //         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
// //         <StatCard title="Low Stock Alert" value={lowStockCount} icon={<AlertTriangle />} color="bg-orange-500" />
// //       </div>

// //       {/* Secondary Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">Total Inventory Value</p>
// //           <p className="text-2xl font-bold text-green-600 mt-1">${totalValue.toFixed(2)}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">Average Price</p>
// //           <p className="text-2xl font-bold text-blue-600 mt-1">${avgPrice.toFixed(2)}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">FBA Products</p>
// //           <p className="text-2xl font-bold text-purple-600 mt-1">{fbaCount}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">FBM Products</p>
// //           <p className="text-2xl font-bold text-yellow-600 mt-1">{fbmCount}</p>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         {/* Category Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Category</h3>
// //           <div className="space-y-3">
// //             {Object.entries(categoryBreakdown).map(([category, count]) => (
// //               <div key={category} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-32 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className="bg-blue-500 h-2 rounded-full" 
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(categoryBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No categories yet</p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Status Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Status</h3>
// //           <div className="space-y-3">
// //             {Object.entries(statusBreakdown).map(([status, count]) => (
// //               <div key={status} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{status}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-32 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className={`h-2 rounded-full ${
// //                         status === 'active' ? 'bg-green-500' : 
// //                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
// //                       }`}
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(statusBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No products yet</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Products */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h3 className="text-xl font-bold mb-4">Recent Products</h3>
// //         <div className="space-y-2">
// //           {products.slice(0, 5).map(product => (
// //             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
// //               <div className="flex items-center gap-3">
// //                 <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
// //                   {product.images && product.images.length > 0 ? (
// //                     <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
// //                   ) : (
// //                     <Package size={20} className="text-gray-400" />
// //                   )}
// //                 </div>
// //                 <div>
// //                   <p className="font-semibold">{product.title}</p>
// //                   <p className="text-sm text-gray-500">SKU: {product.sku} | {product.brand}</p>
// //                 </div>
// //               </div>
// //               <div className="text-right">
// //                 <p className="font-bold text-green-600">${product.price}</p>
// //                 <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
// //                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                 }`}>
// //                   {product.fulfillment}
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //           {products.length === 0 && (
// //             <div className="text-center py-12">
// //               <Package size={64} className="mx-auto text-gray-300 mb-4" />
// //               <p className="text-gray-500 text-lg mb-2">No products yet</p>
// //               <p className="text-gray-400 text-sm">Create your first product to get started!</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Alerts Section */}
// //       {(stats.outOfStock > 0 || lowStockCount > 0) && (
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
// //             <AlertTriangle className="text-orange-500" />
// //             Inventory Alerts
// //           </h3>
// //           <div className="space-y-3">
// //             {stats.outOfStock > 0 && (
// //               <div className="bg-red-50 border border-red-200 rounded p-4">
// //                 <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
// //                 <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
// //               </div>
// //             )}
// //             {lowStockCount > 0 && (
// //               <div className="bg-orange-50 border border-orange-200 rounded p-4">
// //                 <p className="font-semibold text-orange-800">{lowStockCount} product(s) running low (less than 10 units)</p>
// //                 <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// // // Product List Component
// // function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
// //   const filteredProducts = products.filter(p => {
// //     const matchesSearch = !filters.search || 
// //       p.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
// //       p.sku?.toLowerCase().includes(filters.search.toLowerCase()) ||
// //       p.asin?.toLowerCase().includes(filters.search.toLowerCase());
    
// //     const matchesStatus = filters.status === 'all' || p.status === filters.status;
// //     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
// //     return matchesSearch && matchesStatus && matchesFulfillment;
// //   });

// //   const handleSelectAll = (e) => {
// //     if (e.target.checked) {
// //       setSelectedProducts(filteredProducts.map(p => p.id));
// //     } else {
// //       setSelectedProducts([]);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
// //       try {
// //         await API.bulkDelete(selectedProducts);
// //         setSelectedProducts([]);
// //         onRefresh();
// //       } catch (error) {
// //         alert('Error deleting products: ' + error.message);
// //       }
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Products</h2>
// //         <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// //           Refresh
// //         </button>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow p-4">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search by Name, SKU, ASIN..."
// //               value={filters.search}
// //               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
// //               className="w-full pl-10 pr-4 py-2 border rounded"
// //             />
// //           </div>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //             <option value="outofstock">Out of Stock</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA</option>
// //             <option value="FBM">FBM</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Bulk Actions */}
// //       {selectedProducts.length > 0 && (
// //         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
// //           <span className="font-semibold">{selectedProducts.length} products selected</span>
// //           <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
// //             Delete Selected
// //           </button>
// //         </div>
// //       )}

// //       {/* Products Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-50 border-b">
// //             <tr>
// //               <th className="p-4 text-left">
// //                 <input
// //                   type="checkbox"
// //                   onChange={handleSelectAll}
// //                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
// //                 />
// //               </th>
// //               <th className="p-4 text-left">Product</th>
// //               <th className="p-4 text-left">SKU</th>
// //               <th className="p-4 text-left">Status</th>
// //               <th className="p-4 text-left">Price</th>
// //               <th className="p-4 text-left">Quantity</th>
// //               <th className="p-4 text-left">Fulfillment</th>
// //               <th className="p-4 text-left">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredProducts.map(product => (
// //               <tr key={product.id} className="border-b hover:bg-gray-50">
// //                 <td className="p-4">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedProducts.includes(product.id)}
// //                     onChange={(e) => {
// //                       if (e.target.checked) {
// //                         setSelectedProducts([...selectedProducts, product.id]);
// //                       } else {
// //                         setSelectedProducts(selectedProducts.filter(id => id !== product.id));
// //                       }
// //                     }}
// //                   />
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
// //                       {product.images && product.images.length > 0 ? (
// //                         <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
// //                       ) : (
// //                         <Package size={20} className="text-gray-400" />
// //                       )}
// //                     </div>
// //                     <div>
// //                       <p className="font-semibold">{product.title}</p>
// //                       <p className="text-sm text-gray-500">{product.brand}</p>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                     'bg-red-100 text-red-800'
// //                   }`}>
// //                     {product.status?.toUpperCase()}
// //                   </span>
// //                 </td>
// //                 <td className="p-4 font-semibold">${product.price}</td>
// //                 <td className="p-4">
// //                   <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
// //                     {product.quantity || 0}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                   }`}>
// //                     {product.fulfillment}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex gap-2">
// //                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
// //                       <Edit size={18} />
// //                     </button>
// //                     <button
// //                       onClick={async () => {
// //                         if (window.confirm('Delete this product?')) {
// //                           await API.deleteProduct(product.id);
// //                           onRefresh();
// //                         }
// //                       }}
// //                       className="p-2 text-red-600 hover:bg-red-50 rounded"
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
        
// //         {filteredProducts.length === 0 && (
// //           <div className="p-12 text-center text-gray-500">
// //             <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //             <p>No products found</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // Create Product Component
// // function CreateProduct({ onSuccess }) {
// //   const [step, setStep] = useState(1);
// //   const [formData, setFormData] = useState({
// //     productIdType: 'ASIN',
// //     productId: '',
// //     sku: '',
// //     brand: '',
// //     title: '',
// //     category: '',
// //     bulletPoints: ['', '', '', '', ''],
// //     description: '',
// //     images: [],
// //     price: '',
// //     quantity: '',
// //     fulfillment: 'FBA',
// //     status: 'active'
// //   });

// //   const handleSubmit = async () => {
// //     try {
// //       await API.createProduct(formData);
// //       alert('Product created successfully!');
// //       onSuccess();
// //     } catch (error) {
// //       alert('Error creating product: ' + error.message);
// //     }
// //   };

// //   const updateFormData = (updates) => {
// //     setFormData({ ...formData, ...updates });
// //   };
  
// //   const handleImageUpload = (files) => {
// //     const selected = Array.from(files);
// //     let images = [...formData.images];

// //     selected.forEach((file) => {
// //       if (images.length < 9) {
// //         images.push({
// //           file,
// //           preview: URL.createObjectURL(file),
// //         });
// //       }
// //     });

// //     updateFormData({ images });
// //   };

// //   const removeImage = (index) => {
// //     const updated = [...formData.images];
// //     updated.splice(index, 1);
// //     updateFormData({ images: updated });
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
// //       <div className="bg-white rounded-lg shadow p-6 mb-6">
// //         <div className="flex justify-between items-center">
// //           {[1, 2, 3].map(s => (
// //             <div key={s} className="flex items-center flex-1">
// //               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
// //                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
// //               }`}>
// //                 {s}
// //               </div>
// //               {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
// //             </div>
// //           ))}
// //         </div>
// //         <div className="flex justify-between mt-2 text-sm">
// //           <span>Identity</span>
// //           <span>Images</span>
// //           <span>Pricing</span>
// //         </div>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
// //         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} handleImageUpload={handleImageUpload} removeImage={removeImage} />}
// //         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}

// //         <div className="flex justify-between mt-8 pt-6 border-t">
// //           <button
// //             onClick={() => setStep(Math.max(1, step - 1))}
// //             disabled={step === 1}
// //             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
// //           >
// //             Previous
// //           </button>
          
// //           {step < 3 ? (
// //             <button
// //               onClick={() => setStep(Math.min(3, step + 1))}
// //               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
// //             >
// //               Next
// //             </button>
// //           ) : (
// //             <button
// //               onClick={handleSubmit}
// //               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //             >
// //               Create Product
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function Step1({ formData, updateFormData }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
// //       <div className="grid grid-cols-2 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
// //           <select
// //             value={formData.productIdType}
// //             onChange={(e) => updateFormData({ productIdType: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //           >
// //             <option value="ASIN">ASIN</option>
// //             <option value="UPC">UPC</option>
// //             <option value="EAN">EAN</option>
// //           </select>
// //         </div>
        
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID</label>
// //           <input
// //             type="text"
// //             value={formData.productId}
// //             onChange={(e) => updateFormData({ productId: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="B08N5WRWNW"
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">SKU *</label>
// //         <input
// //           type="text"
// //           value={formData.sku}
// //           onChange={(e) => updateFormData({ sku: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="SKU-12345"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Brand *</label>
// //         <input
// //           type="text"
// //           value={formData.brand}
// //           onChange={(e) => updateFormData({ brand: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Your Brand Name"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Title *</label>
// //         <input
// //           type="text"
// //           value={formData.title}
// //           onChange={(e) => updateFormData({ title: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Product Title with Key Features"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Category *</label>
// //         <select
// //           value={formData.category}
// //           onChange={(e) => updateFormData({ category: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           required
// //         >
// //           <option value="">Select Category</option>
// //           <option value="electronics">Electronics</option>
// //           <option value="clothing">Clothing</option>
// //           <option value="home">Home & Kitchen</option>
// //           <option value="sports">Sports & Outdoors</option>
// //           <option value="books">Books</option>
// //         </select>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Description</label>
// //         <textarea
// //           value={formData.description}
// //           onChange={(e) => updateFormData({ description: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           rows={4}
// //           placeholder="Detailed product description..."
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // function Step2({ formData, updateFormData, handleImageUpload, removeImage }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 2: Product Images</h3>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
// //         <div
// //           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
// //           onClick={() => document.getElementById("uploadImagesInput").click()}
// //           onDragOver={(e) => e.preventDefault()}
// //           onDrop={(e) => {
// //             e.preventDefault();
// //             handleImageUpload(e.dataTransfer.files);
// //           }}
// //         >
// //           <Upload className="mx-auto text-gray-400 mb-4" size={48} />
// //           <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
// //           <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels</p>
// //           <input
// //             type="file"
// //             id="uploadImagesInput"
// //             accept="image/*"
// //             multiple
// //             className="hidden"
// //             onChange={(e) => handleImageUpload(e.target.files)}
// //           />
// //         </div>
// //       </div>

// //       {formData.images?.length > 0 && (
// //         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
// //           {formData.images.map((img, index) => (
// //             <div key={index} className="relative group">
// //               <img
// //                 src={img.preview}
// //                 className="w-full h-28 object-cover rounded border"
// //                 alt={`Preview ${index + 1}`}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => removeImage(index)}
// //                 className="absolute top-1 right-1 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
// //               >
// //                 <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //               {index === 0 && (
// //                 <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
// //                   Main
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function Step3({ formData, updateFormData }) {
// //   const calculateFees = () => {
// //     const price = parseFloat(formData.price) || 0;
// //     const referralFee = price * 0.15;
// //     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
// //     const totalFees = referralFee + fbaFee;
// //     const netProceeds = price - totalFees;
    
// //     return { referralFee, fbaFee, totalFees, netProceeds };
// //   };

// //   const fees = calculateFees();

// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 3: Pricing & Inventory</h3>

// //       <div className="grid grid-cols-2 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.price}
// //               onChange={(e) => updateFormData({ price: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //               required
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Quantity *</label>
// //           <input
// //             type="number"
// //             value={formData.quantity}
// //             onChange={(e) => updateFormData({ quantity: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="0"
// //             required
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
// //         <div className="flex gap-4">
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBA"
// //               checked={formData.fulfillment === 'FBA'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Amazon (FBA)</span>
// //           </label>
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBM"
// //               checked={formData.fulfillment === 'FBM'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Merchant (FBM)</span>
// //           </label>
// //         </div>
// //       </div>

// //       <div className="bg-green-50 border border-green-200 rounded p-4">
// //         <h4 className="font-semibold mb-3">Fee Preview</h4>
// //         <div className="space-y-2 text-sm">
// //           <div className="flex justify-between">
// //             <span>Price:</span>
// //             <span className="font-semibold">${formData.price || '0.00'}</span>
// //           </div>
// //           <div className="flex justify-between text-red-600">
// //             <span>Referral Fee (15%):</span>
// //             <span>-${fees.referralFee.toFixed(2)}</span>
// //           </div>
// //           {formData.fulfillment === 'FBA' && (
// //             <div className="flex justify-between text-red-600">
// //               <span>FBA Fee:</span>
// //               <span>-${fees.fbaFee.toFixed(2)}</span>
// //             </div>
// //           )}
// //           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
// //             <span>Total Fees:</span>
// //             <span>-${fees.totalFees.toFixed(2)}</span>
// //           </div>
// //           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
// //             <span>Your Net Proceeds:</span>
// //             <span>${fees.netProceeds.toFixed(2)}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Reports Component
// // function Reports({ products }) {
// //   const [reportType, setReportType] = useState('all');

// //   const generateReport = () => {
// //     let data = products;
    
// //     switch(reportType) {
// //       case 'active':
// //         data = products.filter(p => p.status === 'active');
// //         break;
// //       case 'inactive':
// //         data = products.filter(p => p.status === 'inactive');
// //         break;
// //       case 'fba':
// //         data = products.filter(p => p.fulfillment === 'FBA');
// //         break;
// //       case 'lowstock':
// //         data = products.filter(p => p.quantity < 10);
// //         break;
// //       default:
// //         data = products;
// //     }
    
// //     return data;
// //   };

// //   const reportData = generateReport();

// //   const downloadCSV = () => {
// //     const headers = ['SKU', 'Title', 'Brand', 'Price', 'Quantity', 'Status', 'Fulfillment'];
// //     const rows = reportData.map(p => [
// //       p.sku, p.title, p.brand, p.price, p.quantity, p.status, p.fulfillment
// //     ]);
    
// //     const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
// //     const blob = new Blob([csv], { type: 'text/csv' });
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
// //     a.click();
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Reports</h2>
// //         <button
// //           onClick={downloadCSV}
// //           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //         >
// //           <Download size={20} />
// //           Download CSV
// //         </button>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         <label className="block text-sm font-semibold mb-2">Report Type</label>
// //         <select
// //           value={reportType}
// //           onChange={(e) => setReportType(e.target.value)}
// //           className="w-full max-w-md px-4 py-2 border rounded"
// //         >
// //           <option value="all">All Listings Report</option>
// //           <option value="active">Active Listings</option>
// //           <option value="inactive">Inactive Listings</option>
// //           <option value="fba">FBA Inventory Report</option>
// //           <option value="lowstock">Low Stock Alert</option>
// //         </select>
// //       </div>

// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="p-4 bg-gray-50 border-b">
// //           <h3 className="font-semibold">
// //             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
// //           </h3>
// //         </div>
        
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50 border-b">
// //               <tr>
// //                 <th className="p-4 text-left">SKU</th>
// //                 <th className="p-4 text-left">Title</th>
// //                 <th className="p-4 text-left">Brand</th>
// //                 <th className="p-4 text-left">Price</th>
// //                 <th className="p-4 text-left">Quantity</th>
// //                 <th className="p-4 text-left">Status</th>
// //                 <th className="p-4 text-left">Fulfillment</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {reportData.map(product => (
// //                 <tr key={product.id} className="border-b hover:bg-gray-50">
// //                   <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                   <td className="p-4">{product.title}</td>
// //                   <td className="p-4">{product.brand}</td>
// //                   <td className="p-4 font-semibold">${product.price}</td>
// //                   <td className="p-4">
// //                     <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
// //                       {product.quantity || 0}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                       'bg-red-100 text-red-800'
// //                     }`}>
// //                       {product.status?.toUpperCase()}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                     }`}>
// //                       {product.fulfillment}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
          
// //           {reportData.length === 0 && (
// //             <div className="p-12 text-center text-gray-500">
// //               <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //               <p>No products found for this report</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // import React, { useState, useEffect } from 'react';
// // import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';

// // // API Configuration
// // const API_BASE_URL = 'http://localhost:8000/api';

// // // API Service with backend integration and fallback to persistent storage
// // const API = {
// //   STORAGE_KEY: "products-data",
// //   VENDOR_KEY: "current-vendor",

// //   getFromStorage: async () => {
// //     try {
// //       const data = localStorage.getItem(API.STORAGE_KEY);
// //       return data ? JSON.parse(data) : [];
// //     } catch (e) {
// //       console.error("Storage read error:", e);
// //       return [];
// //     }
// //   },

// //   saveToStorage: async (products) => {
// //     try {
// //       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
// //       return products;
// //     } catch (e) {
// //       console.error("Storage write error:", e);
// //       throw e;
// //     }
// //   },

// //   getCurrentVendor: async () => {
// //     try {
// //       // Fallback to localStorage if window.storage doesn't exist
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         const vendor = localStorage.getItem(API.VENDOR_KEY);
// //         return vendor || "default-vendor";
// //       }
// //       return "default-vendor";
// //     } catch {
// //       return "default-vendor";
// //     }
// //   },

// //   setCurrentVendor: async (vendorId) => {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         localStorage.setItem(API.VENDOR_KEY, vendorId);
// //       }
// //     } catch (e) {
// //       console.error("Vendor save error:", e);
// //     }
// //   },

// //   getProducts: async () => {
// //     try {
// //       const vendorId = await API.getCurrentVendor();
      
// //       // Only try to fetch if API_BASE_URL is available and we're not in test environment
// //       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
// //         const response = await fetch(`${API_BASE_URL}/products?vendorId=${vendorId}`);
        
// //         if (!response.ok) throw new Error("API failed");
        
// //         const data = await response.json();
// //         return data.products || data;
// //       } else {
// //         throw new Error("Using local storage");
// //       }
// //     } catch {
// //       console.log("Using local storage");
// //       return await API.getFromStorage();
// //     }
// //   },

// //   createProduct: async (product) => {
// //     const vendorId = await API.getCurrentVendor();

// //     const productData = {
// //       ...product,
// //       vendorId,
// //       id: Date.now().toString(), // Ensure ID is always generated
// //       createdAt: new Date().toISOString(),
// //     };

// //     try {
// //       // Only try API if available
// //       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
// //         const response = await fetch(`${API_BASE_URL}/products`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(productData),
// //         });

// //         if (!response.ok) throw new Error("API failed");

// //         const data = await response.json();
// //         return data.product || data;
// //       } else {
// //         throw new Error("Using local storage");
// //       }
// //     } catch {
// //       console.log("Saving locally");
// //       const products = await API.getFromStorage();
// //       products.push(productData);
// //       await API.saveToStorage(products);
// //       return productData;
// //     }
// //   },

// //   updateProduct: async (id, updates) => {
// //     try {
// //       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
// //         const response = await fetch(`${API_BASE_URL}/products/${id}`, {
// //           method: "PUT",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(updates),
// //         });

// //         if (!response.ok) throw new Error("API failed");

// //         const data = await response.json();
// //         return data.product || data;
// //       } else {
// //         throw new Error("Using local storage");
// //       }
// //     } catch {
// //       console.log("Updating locally");
// //       const products = await API.getFromStorage();
// //       const index = products.findIndex((p) => p.id === id);

// //       if (index !== -1) {
// //         products[index] = {
// //           ...products[index],
// //           ...updates,
// //           updatedAt: new Date().toISOString(),
// //         };
// //         await API.saveToStorage(products);
// //         return products[index];
// //       }

// //       throw new Error("Product not found");
// //     }
// //   },

// //   deleteProduct: async (id) => {
// //     try {
// //       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
// //         const response = await fetch(`${API_BASE_URL}/products/${id}`, {
// //           method: "DELETE",
// //         });

// //         if (!response.ok) throw new Error("API failed");
// //         return true;
// //       } else {
// //         throw new Error("Using local storage");
// //       }
// //     } catch {
// //       console.log("Deleting locally");
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => p.id !== id);
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   },

// //   // Add missing bulkDelete method
// //   bulkDelete: async (productIds) => {
// //     try {
// //       // Try API first if available
// //       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
// //         const response = await fetch(`${API_BASE_URL}/products/bulk-delete`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ productIds }),
// //         });

// //         if (!response.ok) throw new Error("API failed");
// //         return true;
// //       } else {
// //         throw new Error("Using local storage");
// //       }
// //     } catch {
// //       console.log("Deleting locally");
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => !productIds.includes(p.id));
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   }
// // };

// // // StatCard Component (was commented out)
// // function StatCard({ title, value, icon, color }) {
// //   return (
// //     <div className="bg-white rounded-lg shadow p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-gray-500 text-sm">{title}</p>
// //           <p className="text-3xl font-bold mt-2">{value}</p>
// //         </div>
// //         <div className={`${color} text-white p-3 rounded-lg`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Main App Component
// // export default function AmazonProductManager() {
// //   const [view, setView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedProducts, setSelectedProducts] = useState([]);
// //   const [currentVendor, setCurrentVendor] = useState("default-vendor");
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     status: 'all',
// //     fulfillment: 'all'
// //   });

// //   useEffect(() => {
// //     loadCurrentVendor();
// //     loadProducts();
// //   }, []);

// //   useEffect(() => {
// //     if (currentVendor) {
// //       loadProducts();
// //     }
// //   }, [currentVendor]);

// //   const loadCurrentVendor = async () => {
// //     const vendor = await API.getCurrentVendor();
// //     setCurrentVendor(vendor);
// //   };

// //   const loadProducts = async () => {
// //     setLoading(true);
// //     try {
// //       const data = await API.getProducts();
// //       setProducts(Array.isArray(data) ? data : []);
// //     } catch (error) {
// //       console.error('Error loading products:', error);
// //       alert('Failed to load products. Please try again.');
// //       setProducts([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVendorChange = async (vendorId) => {
// //     await API.setCurrentVendor(vendorId);
// //     setCurrentVendor(vendorId);
// //   };

// //   const stats = {
// //     total: products.length,
// //     active: products.filter(p => p.status === 'active').length,
// //     outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
// //     ipiScore: 750
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <h1 className="text-2xl font-bold">Product Manager</h1>
// //             <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
// //               <User size={18} />
// //               <select
// //                 value={currentVendor}
// //                 onChange={(e) => handleVendorChange(e.target.value)}
// //                 className="bg-transparent border-none text-white text-sm focus:outline-none"
// //               >
// //                 <option value="default-vendor">Default Vendor</option>
// //                 <option value="vendor-1">Vendor 1</option>
// //                 <option value="vendor-2">Vendor 2</option>
// //                 <option value="vendor-3">Vendor 3</option>
// //               </select>
// //             </div>
// //           </div>
// //           <nav className="flex gap-4">
// //             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Dashboard
// //             </button>
// //             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Products
// //             </button>
// //             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Create Product
// //             </button>
// //             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Reports
// //             </button>
// //           </nav>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto p-6">
// //         {loading ? (
// //           <div className="flex items-center justify-center h-64">
// //             <div className="text-gray-500">Loading...</div>
// //           </div>
// //         ) : (
// //           <>
// //             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
// //             {view === 'products' && (
// //               <ProductList
// //                 products={products}
// //                 filters={filters}
// //                 setFilters={setFilters}
// //                 selectedProducts={selectedProducts}
// //                 setSelectedProducts={setSelectedProducts}
// //                 onRefresh={loadProducts}
// //                 setView={setView}
// //               />
// //             )}
// //             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); setView('products'); }} />}
// //             {view === 'reports' && <Reports products={products} />}
// //           </>
// //         )}
// //       </main>

// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setView('create')}
// //         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
// //       >
// //         <Plus size={24} />
// //       </button>
// //     </div>
// //   );
// // }

// // // Dashboard Component
// // function Dashboard({ stats, products }) {
// //   const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0);
// //   const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0;
// //   const lowStockCount = products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length;
// //   const fbaCount = products.filter(p => p.fulfillment === 'FBA').length;
// //   const fbmCount = products.filter(p => p.fulfillment === 'FBM').length;

// //   const categoryBreakdown = products.reduce((acc, p) => {
// //     const category = p.category || 'uncategorized';
// //     acc[category] = (acc[category] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const statusBreakdown = products.reduce((acc, p) => {
// //     const status = p.status || 'inactive';
// //     acc[status] = (acc[status] || 0) + 1;
// //     return acc;
// //   }, {});

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-3xl font-bold">Dashboard</h2>
      
// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
// //         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
// //         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
// //         <StatCard title="Low Stock Alert" value={lowStockCount} icon={<AlertTriangle />} color="bg-orange-500" />
// //       </div>

// //       {/* Secondary Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">Total Inventory Value</p>
// //           <p className="text-2xl font-bold text-green-600 mt-1">${totalValue.toFixed(2)}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">Average Price</p>
// //           <p className="text-2xl font-bold text-blue-600 mt-1">${avgPrice.toFixed(2)}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">FBA Products</p>
// //           <p className="text-2xl font-bold text-purple-600 mt-1">{fbaCount}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">FBM Products</p>
// //           <p className="text-2xl font-bold text-yellow-600 mt-1">{fbmCount}</p>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         {/* Category Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Category</h3>
// //           <div className="space-y-3">
// //             {Object.entries(categoryBreakdown).map(([category, count]) => (
// //               <div key={category} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-32 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className="bg-blue-500 h-2 rounded-full" 
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(categoryBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No categories yet</p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Status Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Status</h3>
// //           <div className="space-y-3">
// //             {Object.entries(statusBreakdown).map(([status, count]) => (
// //               <div key={status} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{status}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-32 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className={`h-2 rounded-full ${
// //                         status === 'active' ? 'bg-green-500' : 
// //                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
// //                       }`}
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(statusBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No products yet</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Products */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h3 className="text-xl font-bold mb-4">Recent Products</h3>
// //         <div className="space-y-2">
// //           {products.slice(0, 5).map(product => (
// //             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
// //               <div className="flex items-center gap-3">
// //                 <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
// //                   {product.images && product.images.length > 0 ? (
// //                     <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
// //                   ) : (
// //                     <Package size={20} className="text-gray-400" />
// //                   )}
// //                 </div>
// //                 <div>
// //                   <p className="font-semibold">{product.title || 'Untitled Product'}</p>
// //                   <p className="text-sm text-gray-500">SKU: {product.sku} | {product.brand}</p>
// //                 </div>
// //               </div>
// //               <div className="text-right">
// //                 <p className="font-bold text-green-600">${product.price || '0.00'}</p>
// //                 <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
// //                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                 }`}>
// //                   {product.fulfillment || 'FBM'}
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //           {products.length === 0 && (
// //             <div className="text-center py-12">
// //               <Package size={64} className="mx-auto text-gray-300 mb-4" />
// //               <p className="text-gray-500 text-lg mb-2">No products yet</p>
// //               <p className="text-gray-400 text-sm">Create your first product to get started!</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Alerts Section */}
// //       {(stats.outOfStock > 0 || lowStockCount > 0) && (
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
// //             <AlertTriangle className="text-orange-500" />
// //             Inventory Alerts
// //           </h3>
// //           <div className="space-y-3">
// //             {stats.outOfStock > 0 && (
// //               <div className="bg-red-50 border border-red-200 rounded p-4">
// //                 <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
// //                 <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
// //               </div>
// //             )}
// //             {lowStockCount > 0 && (
// //               <div className="bg-orange-50 border border-orange-200 rounded p-4">
// //                 <p className="font-semibold text-orange-800">{lowStockCount} product(s) running low (less than 10 units)</p>
// //                 <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // Product List Component
// // function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
// //   const filteredProducts = products.filter(p => {
// //     const matchesSearch = !filters.search || 
// //       (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.sku && p.sku.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.asin && p.asin.toLowerCase().includes(filters.search.toLowerCase()));
    
// //     const matchesStatus = filters.status === 'all' || p.status === filters.status;
// //     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
// //     return matchesSearch && matchesStatus && matchesFulfillment;
// //   });

// //   const handleSelectAll = (e) => {
// //     if (e.target.checked) {
// //       setSelectedProducts(filteredProducts.map(p => p.id));
// //     } else {
// //       setSelectedProducts([]);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
// //       try {
// //         await API.bulkDelete(selectedProducts);
// //         setSelectedProducts([]);
// //         onRefresh();
// //       } catch (error) {
// //         alert('Error deleting products: ' + error.message);
// //       }
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Products</h2>
// //         <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// //           Refresh
// //         </button>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow p-4">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search by Name, SKU, ASIN..."
// //               value={filters.search}
// //               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
// //               className="w-full pl-10 pr-4 py-2 border rounded"
// //             />
// //           </div>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //             <option value="outofstock">Out of Stock</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA</option>
// //             <option value="FBM">FBM</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Bulk Actions */}
// //       {selectedProducts.length > 0 && (
// //         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
// //           <span className="font-semibold">{selectedProducts.length} products selected</span>
// //           <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
// //             Delete Selected
// //           </button>
// //         </div>
// //       )}

// //       {/* Products Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-50 border-b">
// //             <tr>
// //               <th className="p-4 text-left">
// //                 <input
// //                   type="checkbox"
// //                   onChange={handleSelectAll}
// //                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
// //                 />
// //               </th>
// //               <th className="p-4 text-left">Product</th>
// //               <th className="p-4 text-left">SKU</th>
// //               <th className="p-4 text-left">Status</th>
// //               <th className="p-4 text-left">Price</th>
// //               <th className="p-4 text-left">Quantity</th>
// //               <th className="p-4 text-left">Fulfillment</th>
// //               <th className="p-4 text-left">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredProducts.map(product => (
// //               <tr key={product.id} className="border-b hover:bg-gray-50">
// //                 <td className="p-4">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedProducts.includes(product.id)}
// //                     onChange={(e) => {
// //                       if (e.target.checked) {
// //                         setSelectedProducts([...selectedProducts, product.id]);
// //                       } else {
// //                         setSelectedProducts(selectedProducts.filter(id => id !== product.id));
// //                       }
// //                     }}
// //                   />
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
// //                       {product.images && product.images.length > 0 ? (
// //                         <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
// //                       ) : (
// //                         <Package size={20} className="text-gray-400" />
// //                       )}
// //                     </div>
// //                     <div>
// //                       <p className="font-semibold">{product.title || 'Untitled Product'}</p>
// //                       <p className="text-sm text-gray-500">{product.brand}</p>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                     'bg-red-100 text-red-800'
// //                   }`}>
// //                     {(product.status || 'inactive')?.toUpperCase()}
// //                   </span>
// //                 </td>
// //                 <td className="p-4 font-semibold">${product.price || '0.00'}</td>
// //                 <td className="p-4">
// //                   <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
// //                     {product.quantity || 0}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                   }`}>
// //                     {product.fulfillment || 'FBM'}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex gap-2">
// //                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
// //                       <Edit size={18} />
// //                     </button>
// //                     <button
// //                       onClick={async () => {
// //                         if (window.confirm('Delete this product?')) {
// //                           await API.deleteProduct(product.id);
// //                           onRefresh();
// //                         }
// //                       }}
// //                       className="p-2 text-red-600 hover:bg-red-50 rounded"
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
        
// //         {filteredProducts.length === 0 && (
// //           <div className="p-12 text-center text-gray-500">
// //             <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //             <p>No products found</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // Create Product Component (rest of the code remains the same as in your original)
// // function CreateProduct({ onSuccess }) {
// //   const [step, setStep] = useState(1);
// //   const [formData, setFormData] = useState({
// //     productIdType: 'ASIN',
// //     productId: '',
// //     sku: '',
// //     brand: '',
// //     title: '',
// //     category: '',
// //     bulletPoints: ['', '', '', '', ''],
// //     description: '',
// //     images: [],
// //     price: '',
// //     quantity: '',
// //     fulfillment: 'FBA',
// //     status: 'active'
// //   });

// //   const handleSubmit = async () => {
// //     try {
// //       await API.createProduct(formData);
// //       alert('Product created successfully!');
// //       onSuccess();
// //     } catch (error) {
// //       alert('Error creating product: ' + error.message);
// //     }
// //   };

// //   const updateFormData = (updates) => {
// //     setFormData({ ...formData, ...updates });
// //   };
  
// //   const handleImageUpload = (files) => {
// //     const selected = Array.from(files);
// //     let images = [...formData.images];

// //     selected.forEach((file) => {
// //       if (images.length < 9) {
// //         images.push({
// //           file,
// //           preview: URL.createObjectURL(file),
// //         });
// //       }
// //     });

// //     updateFormData({ images });
// //   };

// //   const removeImage = (index) => {
// //     const updated = [...formData.images];
// //     updated.splice(index, 1);
// //     updateFormData({ images: updated });
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
// //       <div className="bg-white rounded-lg shadow p-6 mb-6">
// //         <div className="flex justify-between items-center">
// //           {[1, 2, 3].map(s => (
// //             <div key={s} className="flex items-center flex-1">
// //               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
// //                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
// //               }`}>
// //                 {s}
// //               </div>
// //               {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
// //             </div>
// //           ))}
// //         </div>
// //         <div className="flex justify-between mt-2 text-sm">
// //           <span>Identity</span>
// //           <span>Images</span>
// //           <span>Pricing</span>
// //         </div>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
// //         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} handleImageUpload={handleImageUpload} removeImage={removeImage} />}
// //         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}

// //         <div className="flex justify-between mt-8 pt-6 border-t">
// //           <button
// //             onClick={() => setStep(Math.max(1, step - 1))}
// //             disabled={step === 1}
// //             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
// //           >
// //             Previous
// //           </button>
          
// //           {step < 3 ? (
// //             <button
// //               onClick={() => setStep(Math.min(3, step + 1))}
// //               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
// //             >
// //               Next
// //             </button>
// //           ) : (
// //             <button
// //               onClick={handleSubmit}
// //               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //             >
// //               Create Product
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function Step1({ formData, updateFormData }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
// //       <div className="grid grid-cols-2 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
// //           <select
// //             value={formData.productIdType}
// //             onChange={(e) => updateFormData({ productIdType: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //           >
// //             <option value="ASIN">ASIN</option>
// //             <option value="UPC">UPC</option>
// //             <option value="EAN">EAN</option>
// //           </select>
// //         </div>
        
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID</label>
// //           <input
// //             type="text"
// //             value={formData.productId}
// //             onChange={(e) => updateFormData({ productId: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="B08N5WRWNW"
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">SKU *</label>
// //         <input
// //           type="text"
// //           value={formData.sku}
// //           onChange={(e) => updateFormData({ sku: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="SKU-12345"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Brand *</label>
// //         <input
// //           type="text"
// //           value={formData.brand}
// //           onChange={(e) => updateFormData({ brand: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Your Brand Name"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Title *</label>
// //         <input
// //           type="text"
// //           value={formData.title}
// //           onChange={(e) => updateFormData({ title: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //           placeholder="Product Title with Key Features"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Category *</label>
// //         <select
// //           value={formData.category}
// //           onChange={(e) => updateFormData({ category: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           required
// //         >
// //           <option value="">Select Category</option>
// //           <option value="electronics">Electronics</option>
// //           <option value="clothing">Clothing</option>
// //           <option value="home">Home & Kitchen</option>
// //           <option value="sports">Sports & Outdoors</option>
// //           <option value="books">Books</option>
// //         </select>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Description</label>
// //         <textarea
// //           value={formData.description}
// //           onChange={(e) => updateFormData({ description: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           rows={4}
// //           placeholder="Detailed product description..."
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // function Step2({ formData, updateFormData, handleImageUpload, removeImage }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 2: Product Images</h3>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
// //         <div
// //           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
// //           onClick={() => document.getElementById("uploadImagesInput").click()}
// //           onDragOver={(e) => e.preventDefault()}
// //           onDrop={(e) => {
// //             e.preventDefault();
// //             handleImageUpload(e.dataTransfer.files);
// //           }}
// //         >
// //           <Upload className="mx-auto text-gray-400 mb-4" size={48} />
// //           <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
// //           <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels</p>
// //           <input
// //             type="file"
// //             id="uploadImagesInput"
// //             accept="image/*"
// //             multiple
// //             className="hidden"
// //             onChange={(e) => handleImageUpload(e.target.files)}
// //           />
// //         </div>
// //       </div>

// //       {formData.images?.length > 0 && (
// //         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
// //           {formData.images.map((img, index) => (
// //             <div key={index} className="relative group">
// //               <img
// //                 src={img.preview}
// //                 className="w-full h-28 object-cover rounded border"
// //                 alt={`Preview ${index + 1}`}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => removeImage(index)}
// //                 className="absolute top-1 right-1 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
// //               >
// //                 <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //               {index === 0 && (
// //                 <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
// //                   Main
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function Step3({ formData, updateFormData }) {
// //   const calculateFees = () => {
// //     const price = parseFloat(formData.price) || 0;
// //     const referralFee = price * 0.15;
// //     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
// //     const totalFees = referralFee + fbaFee;
// //     const netProceeds = price - totalFees;
    
// //     return { referralFee, fbaFee, totalFees, netProceeds };
// //   };

// //   const fees = calculateFees();

// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 3: Pricing & Inventory</h3>

// //       <div className="grid grid-cols-2 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.price}
// //               onChange={(e) => updateFormData({ price: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //               required
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Quantity *</label>
// //           <input
// //             type="number"
// //             value={formData.quantity}
// //             onChange={(e) => updateFormData({ quantity: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="0"
// //             required
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
// //         <div className="flex gap-4">
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBA"
// //               checked={formData.fulfillment === 'FBA'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Amazon (FBA)</span>
// //           </label>
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBM"
// //               checked={formData.fulfillment === 'FBM'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Merchant (FBM)</span>
// //           </label>
// //         </div>
// //       </div>

// //       <div className="bg-green-50 border border-green-200 rounded p-4">
// //         <h4 className="font-semibold mb-3">Fee Preview</h4>
// //         <div className="space-y-2 text-sm">
// //           <div className="flex justify-between">
// //             <span>Price:</span>
// //             <span className="font-semibold">${formData.price || '0.00'}</span>
// //           </div>
// //           <div className="flex justify-between text-red-600">
// //             <span>Referral Fee (15%):</span>
// //             <span>-${fees.referralFee.toFixed(2)}</span>
// //           </div>
// //           {formData.fulfillment === 'FBA' && (
// //             <div className="flex justify-between text-red-600">
// //               <span>FBA Fee:</span>
// //               <span>-${fees.fbaFee.toFixed(2)}</span>
// //             </div>
// //           )}
// //           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
// //             <span>Total Fees:</span>
// //             <span>-${fees.totalFees.toFixed(2)}</span>
// //           </div>
// //           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
// //             <span>Your Net Proceeds:</span>
// //             <span>${fees.netProceeds.toFixed(2)}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Reports Component (rest remains the same)
// // function Reports({ products }) {
// //   const [reportType, setReportType] = useState('all');

// //   const generateReport = () => {
// //     let data = products;
    
// //     switch(reportType) {
// //       case 'active':
// //         data = products.filter(p => p.status === 'active');
// //         break;
// //       case 'inactive':
// //         data = products.filter(p => p.status === 'inactive');
// //         break;
// //       case 'fba':
// //         data = products.filter(p => p.fulfillment === 'FBA');
// //         break;
// //       case 'lowstock':
// //         data = products.filter(p => (p.quantity || 0) < 10);
// //         break;
// //       default:
// //         data = products;
// //     }
    
// //     return data;
// //   };

// //   const reportData = generateReport();

// //   const downloadCSV = () => {
// //     const headers = ['SKU', 'Title', 'Brand', 'Price', 'Quantity', 'Status', 'Fulfillment'];
// //     const rows = reportData.map(p => [
// //       p.sku, 
// //       p.title || 'Untitled Product', 
// //       p.brand, 
// //       p.price || '0.00', 
// //       p.quantity || 0, 
// //       p.status || 'inactive', 
// //       p.fulfillment || 'FBM'
// //     ]);
    
// //     const csv = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
// //     const blob = new Blob([csv], { type: 'text/csv' });
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
// //     a.click();
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Reports</h2>
// //         <button
// //           onClick={downloadCSV}
// //           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //         >
// //           <Download size={20} />
// //           Download CSV
// //         </button>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         <label className="block text-sm font-semibold mb-2">Report Type</label>
// //         <select
// //           value={reportType}
// //           onChange={(e) => setReportType(e.target.value)}
// //           className="w-full max-w-md px-4 py-2 border rounded"
// //         >
// //           <option value="all">All Listings Report</option>
// //           <option value="active">Active Listings</option>
// //           <option value="inactive">Inactive Listings</option>
// //           <option value="fba">FBA Inventory Report</option>
// //           <option value="lowstock">Low Stock Alert</option>
// //         </select>
// //       </div>

// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="p-4 bg-gray-50 border-b">
// //           <h3 className="font-semibold">
// //             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
// //           </h3>
// //         </div>
        
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50 border-b">
// //               <tr>
// //                 <th className="p-4 text-left">SKU</th>
// //                 <th className="p-4 text-left">Title</th>
// //                 <th className="p-4 text-left">Brand</th>
// //                 <th className="p-4 text-left">Price</th>
// //                 <th className="p-4 text-left">Quantity</th>
// //                 <th className="p-4 text-left">Status</th>
// //                 <th className="p-4 text-left">Fulfillment</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {reportData.map(product => (
// //                 <tr key={product.id} className="border-b hover:bg-gray-50">
// //                   <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                   <td className="p-4">{product.title || 'Untitled Product'}</td>
// //                   <td className="p-4">{product.brand}</td>
// //                   <td className="p-4 font-semibold">${product.price || '0.00'}</td>
// //                   <td className="p-4">
// //                     <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
// //                       {product.quantity || 0}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                       'bg-red-100 text-red-800'
// //                     }`}>
// //                       {(product.status || 'inactive')?.toUpperCase()}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                     }`}>
// //                       {product.fulfillment || 'FBM'}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
          
// //           {reportData.length === 0 && (
// //             <div className="p-12 text-center text-gray-500">
// //               <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //               <p>No products found for this report</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }





// // import React, { useState, useEffect } from 'react';
// // import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';

// // // API Configuration
// // const API_BASE_URL = 'http://localhost:8000/api';

// // // Enhanced API Service with proper payload handling
// // const API = {
// //   STORAGE_KEY: "products-data",
// //   VENDOR_KEY: "current-vendor",

// //   // Helper method to handle API requests
// //   async makeRequest(endpoint, options = {}) {
// //     try {
// //       const url = `${API_BASE_URL}${endpoint}`;
// //       console.log(`Making API request to: ${url}`, options);
      
// //       const response = await fetch(url, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           ...options.headers,
// //         },
// //         ...options,
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
// //       }

// //       const data = await response.json();
// //       console.log(`API response from ${url}:`, data);
// //       return data;
// //     } catch (error) {
// //       console.error('API request failed:', error);
// //       throw error;
// //     }
// //   },

// //   getFromStorage: async () => {
// //     try {
// //       const data = localStorage.getItem(API.STORAGE_KEY);
// //       return data ? JSON.parse(data) : [];
// //     } catch (e) {
// //       console.error("Storage read error:", e);
// //       return [];
// //     }
// //   },

// //   saveToStorage: async (products) => {
// //     try {
// //       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
// //       return products;
// //     } catch (e) {
// //       console.error("Storage write error:", e);
// //       throw e;
// //     }
// //   },

// //   getCurrentVendor: async () => {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         const vendor = localStorage.getItem(API.VENDOR_KEY);
// //         return vendor || "default";
// //       }
// //       return "default";
// //     } catch {
// //       return "default";
// //     }
// //   },

// //   setCurrentVendor: async (vendorId) => {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         localStorage.setItem(API.VENDOR_KEY, vendorId);
// //       }
// //     } catch (e) {
// //       console.error("Vendor save error:", e);
// //     }
// //   },

// //   // Get all products - REMOVED vendor filtering to show all products
// //   getProducts: async () => {
// //     try {
// //       console.log(`Fetching all products...`);
      
// //       const data = await API.makeRequest(`/products`);
      
// //       // Handle different response formats
// //       if (data.success && data.products) {
// //         console.log(`Received ${data.products.length} products from API`);
// //         return data.products;
// //       } else if (Array.isArray(data)) {
// //         console.log(`Received ${data.length} products from API (array format)`);
// //         return data;
// //       } else {
// //         console.log('Unexpected API response format:', data);
// //         return [];
// //       }
// //     } catch (error) {
// //       console.log("Using local storage due to API error:", error);
// //       const localProducts = await API.getFromStorage();
// //       console.log(`Loaded ${localProducts.length} products from local storage`);
// //       return localProducts;
// //     }
// //   },

// //   // Create new product with complete payload - FIXED
// //   createProduct: async (product) => {
// //     // Auto-generate vendor ID based on user or use default
// //     const vendorId = "default"; // You can modify this to get from user context

// //     const productData = {
// //       ...product,
// //       vendorId,
// //       // Remove client-generated ID - let MongoDB generate _id
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //     };

// //     // Remove the client-generated ID for API calls
// //     delete productData.id;

// //     try {
// //       console.log('Creating product via API:', productData);
// //       const data = await API.makeRequest('/products', {
// //         method: 'POST',
// //         body: JSON.stringify(productData),
// //       });
      
// //       if (data.success && data.product) {
// //         console.log('Product created successfully via API');
// //         return data.product;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Saving locally due to API error:", error);
// //       // For local storage, we still need an ID
// //       const localProduct = {
// //         ...productData,
// //         id: Date.now().toString(),
// //       };
// //       const products = await API.getFromStorage();
// //       products.push(localProduct);
// //       await API.saveToStorage(products);
// //       console.log('Product saved locally');
// //       return localProduct;
// //     }
// //   },

// //   // Update product with complete payload - FIXED
// //   updateProduct: async (id, updates) => {
// //     const updateData = {
// //       ...updates,
// //       updatedAt: new Date().toISOString(),
// //     };

// //     try {
// //       console.log(`Updating product ${id} via API:`, updateData);
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'PUT',
// //         body: JSON.stringify(updateData),
// //       });
      
// //       if (data.success && data.product) {
// //         console.log('Product updated successfully via API');
// //         return data.product;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Updating locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const index = products.findIndex((p) => p.id === id);

// //       if (index !== -1) {
// //         products[index] = {
// //           ...products[index],
// //           ...updateData,
// //         };
// //         await API.saveToStorage(products);
// //         console.log('Product updated locally');
// //         return products[index];
// //       }

// //       throw new Error("Product not found");
// //     }
// //   },

// //   // Delete product - FIXED
// //   deleteProduct: async (id) => {
// //     try {
// //       console.log(`Deleting product ${id} via API`);
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'DELETE',
// //       });
      
// //       if (data.success) {
// //         console.log('Product deleted successfully via API');
// //         return true;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Deleting locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => p.id !== id);
// //       await API.saveToStorage(filtered);
// //       console.log('Product deleted locally');
// //       return true;
// //     }
// //   },

// //   // Bulk delete products - FIXED
// //   bulkDelete: async (productIds) => {
// //     try {
// //       console.log(`Bulk deleting products via API:`, productIds);
// //       const data = await API.makeRequest('/products/bulk-delete', {
// //         method: 'POST',
// //         body: JSON.stringify({ productIds }),
// //       });
      
// //       if (data.success) {
// //         console.log(`Bulk delete successful via API, deleted ${data.deletedCount} products`);
// //         return true;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Bulk deleting locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => !productIds.includes(p.id));
// //       await API.saveToStorage(filtered);
// //       console.log('Products deleted locally');
// //       return true;
// //     }
// //   },

// //   // Get product statistics - FIXED (all vendors)
// //   getProductStats: async () => {
// //     try {
// //       console.log(`Fetching stats for all products...`);
      
// //       const data = await API.makeRequest(`/products/stats`);
      
// //       if (data.success && data.stats) {
// //         console.log('Received stats from API:', data.stats);
// //         return data.stats;
// //       } else {
// //         throw new Error('Invalid API response format for stats');
// //       }
// //     } catch (error) {
// //       console.log("Using local storage for stats due to API error:", error);
// //       const products = await API.getFromStorage();
      
// //       const stats = {
// //         total: products.length,
// //         active: products.filter(p => p.status === 'active').length,
// //         outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
// //         lowStock: products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length,
// //         fbaCount: products.filter(p => p.fulfillment === 'FBA').length,
// //         fbmCount: products.filter(p => p.fulfillment === 'FBM').length,
// //         totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0),
// //         avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0,
// //       };
      
// //       console.log('Calculated stats locally:', stats);
// //       return stats;
// //     }
// //   },

// //   // Get all vendors from products
// //   getVendors: async () => {
// //     try {
// //       const products = await API.getProducts();
// //       const vendors = [...new Set(products.map(p => p.vendorId).filter(Boolean))];
// //       return vendors;
// //     } catch (error) {
// //       console.error('Error getting vendors:', error);
// //       return [];
// //     }
// //   }
// // };

// // // StatCard Component
// // function StatCard({ title, value, icon, color }) {
// //   return (
// //     <div className="bg-white rounded-lg shadow p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-gray-500 text-sm">{title}</p>
// //           <p className="text-3xl font-bold mt-2">{value}</p>
// //         </div>
// //         <div className={`${color} text-white p-3 rounded-lg`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Main App Component - REMOVED vendor dropdown
// // export default function AmazonProductManager() {
// //   const [view, setView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedProducts, setSelectedProducts] = useState([]);
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     status: 'all',
// //     fulfillment: 'all'
// //   });
// //   const [stats, setStats] = useState({
// //     total: 0,
// //     active: 0,
// //     outOfStock: 0,
// //     lowStock: 0,
// //     fbaCount: 0,
// //     fbmCount: 0,
// //     totalValue: 0,
// //     avgPrice: 0
// //   });

// //   useEffect(() => {
// //     loadProducts();
// //     loadStats();
// //   }, []);

// //   const loadProducts = async () => {
// //     setLoading(true);
// //     try {
// //       console.log('Loading products...');
// //       const data = await API.getProducts();
// //       console.log('Products loaded:', data);
// //       setProducts(Array.isArray(data) ? data : []);
// //     } catch (error) {
// //       console.error('Error loading products:', error);
// //       alert('Failed to load products. Please try again.');
// //       setProducts([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadStats = async () => {
// //     try {
// //       console.log('Loading stats...');
// //       const data = await API.getProductStats();
// //       console.log('Stats loaded:', data);
// //       setStats(data);
// //     } catch (error) {
// //       console.error('Error loading stats:', error);
// //       // Set default stats on error
// //       setStats({
// //         total: 0,
// //         active: 0,
// //         outOfStock: 0,
// //         lowStock: 0,
// //         fbaCount: 0,
// //         fbmCount: 0,
// //         totalValue: 0,
// //         avgPrice: 0
// //       });
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header - REMOVED vendor dropdown */}
// //       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <h1 className="text-2xl font-bold">Amazon Product Manager</h1>
// //             <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
// //               <User size={18} />
// //               <span className="text-sm">All Products</span>
// //             </div>
// //           </div>
// //           <nav className="flex gap-4">
// //             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Dashboard
// //             </button>
// //             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Products
// //             </button>
// //             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Create Product
// //             </button>
// //             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Reports
// //             </button>
// //           </nav>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto p-6">
// //         {loading ? (
// //           <div className="flex items-center justify-center h-64">
// //             <div className="text-gray-500">Loading products...</div>
// //           </div>
// //         ) : (
// //           <>
// //             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
// //             {view === 'products' && (
// //               <ProductList
// //                 products={products}
// //                 filters={filters}
// //                 setFilters={setFilters}
// //                 selectedProducts={selectedProducts}
// //                 setSelectedProducts={setSelectedProducts}
// //                 onRefresh={loadProducts}
// //                 setView={setView}
// //               />
// //             )}
// //             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); loadStats(); setView('products'); }} />}
// //             {view === 'reports' && <Reports products={products} />}
// //           </>
// //         )}
// //       </main>

// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setView('create')}
// //         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
// //       >
// //         <Plus size={24} />
// //       </button>
// //     </div>
// //   );
// // }

// // // Dashboard Component - UPDATED to show all products
// // function Dashboard({ stats, products }) {
// //   const categoryBreakdown = products.reduce((acc, p) => {
// //     const category = p.category || 'uncategorized';
// //     acc[category] = (acc[category] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const statusBreakdown = products.reduce((acc, p) => {
// //     const status = p.status || 'inactive';
// //     acc[status] = (acc[status] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const vendorBreakdown = products.reduce((acc, p) => {
// //     const vendor = p.vendorId || 'default';
// //     acc[vendor] = (acc[vendor] || 0) + 1;
// //     return acc;
// //   }, {});

// //   // Helper function to get product ID (handles both MongoDB _id and local id)
// //   const getProductId = (product) => {
// //     return product._id || product.id;
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-3xl font-bold">Dashboard - All Products</h2>
      
// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
// //         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
// //         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
// //         <StatCard title="Low Stock Alert" value={stats.lowStock} icon={<AlertTriangle />} color="bg-orange-500" />
// //       </div>

// //       {/* Secondary Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">Total Inventory Value</p>
// //           <p className="text-2xl font-bold text-green-600 mt-1">${stats.totalValue?.toFixed(2) || '0.00'}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">Average Price</p>
// //           <p className="text-2xl font-bold text-blue-600 mt-1">${stats.avgPrice?.toFixed(2) || '0.00'}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">FBA Products</p>
// //           <p className="text-2xl font-bold text-purple-600 mt-1">{stats.fbaCount || 0}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">FBM Products</p>
// //           <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.fbmCount || 0}</p>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         {/* Category Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Category</h3>
// //           <div className="space-y-3">
// //             {Object.entries(categoryBreakdown).map(([category, count]) => (
// //               <div key={category} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className="bg-blue-500 h-2 rounded-full" 
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(categoryBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No categories yet</p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Status Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Status</h3>
// //           <div className="space-y-3">
// //             {Object.entries(statusBreakdown).map(([status, count]) => (
// //               <div key={status} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{status}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className={`h-2 rounded-full ${
// //                         status === 'active' ? 'bg-green-500' : 
// //                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
// //                       }`}
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(statusBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No products yet</p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Vendor Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Vendor</h3>
// //           <div className="space-y-3">
// //             {Object.entries(vendorBreakdown).map(([vendor, count]) => (
// //               <div key={vendor} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{vendor}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className="bg-purple-500 h-2 rounded-full" 
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(vendorBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No vendors yet</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Products */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h3 className="text-xl font-bold mb-4">Recent Products</h3>
// //         <div className="space-y-2">
// //           {products.slice(0, 5).map(product => (
// //             <div key={getProductId(product)} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
// //               <div className="flex items-center gap-3">
// //                 <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
// //                   {product.images && product.images.length > 0 ? (
// //                     <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
// //                   ) : (
// //                     <Package size={20} className="text-gray-400" />
// //                   )}
// //                 </div>
// //                 <div>
// //                   <p className="font-semibold">{product.title || 'Untitled Product'}</p>
// //                   <p className="text-sm text-gray-500">SKU: {product.sku} | Vendor: {product.vendorId || 'default'}</p>
// //                 </div>
// //               </div>
// //               <div className="text-right">
// //                 <p className="font-bold text-green-600">${product.price || '0.00'}</p>
// //                 <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
// //                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                 }`}>
// //                   {product.fulfillment || 'FBM'}
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //           {products.length === 0 && (
// //             <div className="text-center py-12">
// //               <Package size={64} className="mx-auto text-gray-300 mb-4" />
// //               <p className="text-gray-500 text-lg mb-2">No products yet</p>
// //               <p className="text-gray-400 text-sm">Create your first product to get started!</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Alerts Section */}
// //       {(stats.outOfStock > 0 || stats.lowStock > 0) && (
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
// //             <AlertTriangle className="text-orange-500" />
// //             Inventory Alerts
// //           </h3>
// //           <div className="space-y-3">
// //             {stats.outOfStock > 0 && (
// //               <div className="bg-red-50 border border-red-200 rounded p-4">
// //                 <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
// //                 <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
// //               </div>
// //             )}
// //             {stats.lowStock > 0 && (
// //               <div className="bg-orange-50 border border-orange-200 rounded p-4">
// //                 <p className="font-semibold text-orange-800">{stats.lowStock} product(s) running low (less than 10 units)</p>
// //                 <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // Product List Component - UPDATED to handle all products
// // function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
// //   // Helper function to get product ID (handles both MongoDB _id and local id)
// //   const getProductId = (product) => {
// //     return product._id || product.id;
// //   };

// //   const filteredProducts = products.filter(p => {
// //     const matchesSearch = !filters.search || 
// //       (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.sku && p.sku.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.productId && p.productId.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.vendorId && p.vendorId.toLowerCase().includes(filters.search.toLowerCase()));
    
// //     const matchesStatus = filters.status === 'all' || p.status === filters.status;
// //     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
// //     return matchesSearch && matchesStatus && matchesFulfillment;
// //   });

// //   const handleSelectAll = (e) => {
// //     if (e.target.checked) {
// //       setSelectedProducts(filteredProducts.map(p => getProductId(p)));
// //     } else {
// //       setSelectedProducts([]);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
// //       try {
// //         await API.bulkDelete(selectedProducts);
// //         setSelectedProducts([]);
// //         onRefresh();
// //       } catch (error) {
// //         alert('Error deleting products: ' + error.message);
// //       }
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">All Products ({products.length})</h2>
// //         <div className="flex gap-2">
// //           <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// //             Refresh
// //           </button>
// //         </div>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow p-4">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search by Name, SKU, Product ID, Vendor..."
// //               value={filters.search}
// //               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
// //               className="w-full pl-10 pr-4 py-2 border rounded"
// //             />
// //           </div>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //             <option value="outofstock">Out of Stock</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA</option>
// //             <option value="FBM">FBM</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Bulk Actions */}
// //       {selectedProducts.length > 0 && (
// //         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
// //           <span className="font-semibold">{selectedProducts.length} products selected</span>
// //           <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
// //             Delete Selected
// //           </button>
// //         </div>
// //       )}

// //       {/* Products Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-50 border-b">
// //             <tr>
// //               <th className="p-4 text-left">
// //                 <input
// //                   type="checkbox"
// //                   onChange={handleSelectAll}
// //                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
// //                 />
// //               </th>
// //               <th className="p-4 text-left">Product</th>
// //               <th className="p-4 text-left">SKU</th>
// //               <th className="p-4 text-left">Vendor</th>
// //               <th className="p-4 text-left">Status</th>
// //               <th className="p-4 text-left">Price</th>
// //               <th className="p-4 text-left">Quantity</th>
// //               <th className="p-4 text-left">Fulfillment</th>
// //               <th className="p-4 text-left">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredProducts.map(product => (
// //               <tr key={getProductId(product)} className="border-b hover:bg-gray-50">
// //                 <td className="p-4">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedProducts.includes(getProductId(product))}
// //                     onChange={(e) => {
// //                       const productId = getProductId(product);
// //                       if (e.target.checked) {
// //                         setSelectedProducts([...selectedProducts, productId]);
// //                       } else {
// //                         setSelectedProducts(selectedProducts.filter(id => id !== productId));
// //                       }
// //                     }}
// //                   />
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
// //                       {product.images && product.images.length > 0 ? (
// //                         <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
// //                       ) : (
// //                         <Package size={20} className="text-gray-400" />
// //                       )}
// //                     </div>
// //                     <div>
// //                       <p className="font-semibold">{product.title || 'Untitled Product'}</p>
// //                       <p className="text-sm text-gray-500">{product.brand}</p>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                 <td className="p-4">
// //                   <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
// //                     {product.vendorId || 'default'}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                     'bg-red-100 text-red-800'
// //                   }`}>
// //                     {(product.status || 'inactive')?.toUpperCase()}
// //                   </span>
// //                 </td>
// //                 <td className="p-4 font-semibold">${product.price || '0.00'}</td>
// //                 <td className="p-4">
// //                   <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
// //                     {product.quantity || 0}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                   }`}>
// //                     {product.fulfillment || 'FBM'}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex gap-2">
// //                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
// //                       <Edit size={18} />
// //                     </button>
// //                     <button
// //                       onClick={async () => {
// //                         if (window.confirm('Delete this product?')) {
// //                           await API.deleteProduct(getProductId(product));
// //                           onRefresh();
// //                         }
// //                       }}
// //                       className="p-2 text-red-600 hover:bg-red-50 rounded"
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
        
// //         {filteredProducts.length === 0 && (
// //           <div className="p-12 text-center text-gray-500">
// //             <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //             <p>No products found</p>
// //             {products.length > 0 && (
// //               <p className="text-sm text-gray-400 mt-2">Try adjusting your search filters</p>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // Create Product Component - UPDATED to handle API responses properly
// // function CreateProduct({ onSuccess }) {
// //   const [step, setStep] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [formData, setFormData] = useState({
// //     productIdType: 'ASIN',
// //     productId: '',
// //     sku: '',
// //     brand: '',
// //     title: '',
// //     category: '',
// //     bulletPoints: ['', '', '', '', ''],
// //     description: '',
// //     images: [],
// //     price: '',
// //     quantity: '',
// //     fulfillment: 'FBA',
// //     status: 'active'
// //   });

// //   const handleSubmit = async () => {
// //     setLoading(true);
// //     try {
// //       // Prepare the payload with all form data
// //       const payload = {
// //         ...formData,
// //         price: parseFloat(formData.price) || 0,
// //         quantity: parseInt(formData.quantity) || 0,
// //         // Convert images to base64 for API submission
// //         images: await Promise.all(
// //           formData.images.map(async (img) => {
// //             if (img.file) {
// //               // Convert file to base64 for API submission
// //               return await convertFileToBase64(img.file);
// //             }
// //             return img;
// //           })
// //         )
// //       };

// //       console.log('Submitting product:', payload);
// //       const result = await API.createProduct(payload);
// //       console.log('Product creation result:', result);
      
// //       alert('Product created successfully!');
// //       onSuccess();
// //     } catch (error) {
// //       console.error('Error creating product:', error);
// //       alert('Error creating product: ' + error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Helper function to convert file to base64
// //   const convertFileToBase64 = (file) => {
// //     return new Promise((resolve, reject) => {
// //       const reader = new FileReader();
// //       reader.readAsDataURL(file);
// //       reader.onload = () => resolve({
// //         filename: file.name,
// //         data: reader.result,
// //         preview: URL.createObjectURL(file)
// //       });
// //       reader.onerror = error => reject(error);
// //     });
// //   };

// //   const updateFormData = (updates) => {
// //     setFormData({ ...formData, ...updates });
// //   };
  
// //   const handleImageUpload = (files) => {
// //     const selected = Array.from(files);
// //     let images = [...formData.images];

// //     selected.forEach((file) => {
// //       if (images.length < 9) {
// //         images.push({
// //           file,
// //           preview: URL.createObjectURL(file),
// //         });
// //       }
// //     });

// //     updateFormData({ images });
// //   };

// //   const removeImage = (index) => {
// //     const updated = [...formData.images];
// //     updated.splice(index, 1);
// //     updateFormData({ images: updated });
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
// //       <div className="bg-white rounded-lg shadow p-6 mb-6">
// //         <div className="flex justify-between items-center">
// //           {[1, 2, 3].map(s => (
// //             <div key={s} className="flex items-center flex-1">
// //               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
// //                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
// //               }`}>
// //                 {s}
// //               </div>
// //               {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
// //             </div>
// //           ))}
// //         </div>
// //         <div className="flex justify-between mt-2 text-sm">
// //           <span>Identity</span>
// //           <span>Images</span>
// //           <span>Pricing</span>
// //         </div>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
// //         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} handleImageUpload={handleImageUpload} removeImage={removeImage} />}
// //         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}

// //         <div className="flex justify-between mt-8 pt-6 border-t">
// //           <button
// //             onClick={() => setStep(Math.max(1, step - 1))}
// //             disabled={step === 1 || loading}
// //             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
// //           >
// //             Previous
// //           </button>
          
// //           {step < 3 ? (
// //             <button
// //               onClick={() => setStep(Math.min(3, step + 1))}
// //               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
// //               disabled={loading}
// //             >
// //               Next
// //             </button>
// //           ) : (
// //             <button
// //               onClick={handleSubmit}
// //               disabled={loading}
// //               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
// //             >
// //               {loading ? 'Creating...' : 'Create Product'}
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Step components remain the same...
// // function Step1({ formData, updateFormData }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
// //       <div className="grid grid-cols-2 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
// //           <select
// //             value={formData.productIdType}
// //             onChange={(e) => updateFormData({ productIdType: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //           >
// //             <option value="ASIN">ASIN</option>
// //             <option value="UPC">UPC</option>
// //             <option value="EAN">EAN</option>
// //           </select>
// //         </div>
        
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Product ID</label>
// //           <input
// //             type="text"
// //             value={formData.productId}
// //             onChange={(e) => updateFormData({ productId: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="B08N5WRWNW"
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">SKU *</label>
// //         <input
// //           type="text"
// //           value={formData.sku}
// //           onChange={(e) => updateFormData({ sku: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="SKU-12345"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Brand *</label>
// //         <input
// //           type="text"
// //           value={formData.brand}
// //           onChange={(e) => updateFormData({ brand: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Your Brand Name"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Title *</label>
// //         <input
// //           type="text"
// //           value={formData.title}
// //           onChange={(e) => updateFormData({ title: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           placeholder="Product Title with Key Features"
// //           required
// //         />
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Category *</label>
// //         <select
// //           value={formData.category}
// //           onChange={(e) => updateFormData({ category: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           required
// //         >
// //           <option value="">Select Category</option>
// //           <option value="electronics">Electronics</option>
// //           <option value="clothing">Clothing</option>
// //           <option value="home">Home & Kitchen</option>
// //           <option value="sports">Sports & Outdoors</option>
// //           <option value="books">Books</option>
// //         </select>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Description</label>
// //         <textarea
// //           value={formData.description}
// //           onChange={(e) => updateFormData({ description: e.target.value })}
// //           className="w-full px-4 py-2 border rounded"
// //           rows={4}
// //           placeholder="Detailed product description..."
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // function Step2({ formData, updateFormData, handleImageUpload, removeImage }) {
// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 2: Product Images</h3>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
// //         <div
// //           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
// //           onClick={() => document.getElementById("uploadImagesInput").click()}
// //           onDragOver={(e) => e.preventDefault()}
// //           onDrop={(e) => {
// //             e.preventDefault();
// //             handleImageUpload(e.dataTransfer.files);
// //           }}
// //         >
// //           <Upload className="mx-auto text-gray-400 mb-4" size={48} />
// //           <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
// //           <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels</p>
// //           <input
// //             type="file"
// //             id="uploadImagesInput"
// //             accept="image/*"
// //             multiple
// //             className="hidden"
// //             onChange={(e) => handleImageUpload(e.target.files)}
// //           />
// //         </div>
// //       </div>

// //       {formData.images?.length > 0 && (
// //         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
// //           {formData.images.map((img, index) => (
// //             <div key={index} className="relative group">
// //               <img
// //                 src={img.preview}
// //                 className="w-full h-28 object-cover rounded border"
// //                 alt={`Preview ${index + 1}`}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => removeImage(index)}
// //                 className="absolute top-1 right-1 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
// //               >
// //                 <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //               {index === 0 && (
// //                 <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
// //                   Main
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function Step3({ formData, updateFormData }) {
// //   const calculateFees = () => {
// //     const price = parseFloat(formData.price) || 0;
// //     const referralFee = price * 0.15;
// //     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
// //     const totalFees = referralFee + fbaFee;
// //     const netProceeds = price - totalFees;
    
// //     return { referralFee, fbaFee, totalFees, netProceeds };
// //   };

// //   const fees = calculateFees();

// //   return (
// //     <div className="space-y-6">
// //       <h3 className="text-xl font-bold">Step 3: Pricing & Inventory</h3>

// //       <div className="grid grid-cols-2 gap-4">
// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
// //           <div className="relative">
// //             <span className="absolute left-3 top-2 text-gray-500">$</span>
// //             <input
// //               type="number"
// //               step="0.01"
// //               value={formData.price}
// //               onChange={(e) => updateFormData({ price: e.target.value })}
// //               className="w-full pl-8 pr-4 py-2 border rounded"
// //               placeholder="0.00"
// //               required
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold mb-2">Quantity *</label>
// //           <input
// //             type="number"
// //             value={formData.quantity}
// //             onChange={(e) => updateFormData({ quantity: e.target.value })}
// //             className="w-full px-4 py-2 border rounded"
// //             placeholder="0"
// //             required
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
// //         <div className="flex gap-4">
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBA"
// //               checked={formData.fulfillment === 'FBA'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Amazon (FBA)</span>
// //           </label>
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="radio"
// //               value="FBM"
// //               checked={formData.fulfillment === 'FBM'}
// //               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
// //             />
// //             <span>Fulfillment by Merchant (FBM)</span>
// //           </label>
// //         </div>
// //       </div>

// //       <div className="bg-green-50 border border-green-200 rounded p-4">
// //         <h4 className="font-semibold mb-3">Fee Preview</h4>
// //         <div className="space-y-2 text-sm">
// //           <div className="flex justify-between">
// //             <span>Price:</span>
// //             <span className="font-semibold">${formData.price || '0.00'}</span>
// //           </div>
// //           <div className="flex justify-between text-red-600">
// //             <span>Referral Fee (15%):</span>
// //             <span>-${fees.referralFee.toFixed(2)}</span>
// //           </div>
// //           {formData.fulfillment === 'FBA' && (
// //             <div className="flex justify-between text-red-600">
// //               <span>FBA Fee:</span>
// //               <span>-${fees.fbaFee.toFixed(2)}</span>
// //             </div>
// //           )}
// //           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
// //             <span>Total Fees:</span>
// //             <span>-${fees.totalFees.toFixed(2)}</span>
// //           </div>
// //           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
// //             <span>Your Net Proceeds:</span>
// //             <span>${fees.netProceeds.toFixed(2)}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Reports Component - UPDATED to handle all products
// // function Reports({ products }) {
// //   const [reportType, setReportType] = useState('all');

// //   const generateReport = () => {
// //     let data = products;
    
// //     switch(reportType) {
// //       case 'active':
// //         data = products.filter(p => p.status === 'active');
// //         break;
// //       case 'inactive':
// //         data = products.filter(p => p.status === 'inactive');
// //         break;
// //       case 'fba':
// //         data = products.filter(p => p.fulfillment === 'FBA');
// //         break;
// //       case 'lowstock':
// //         data = products.filter(p => (p.quantity || 0) < 10);
// //         break;
// //       default:
// //         data = products;
// //     }
    
// //     return data;
// //   };

// //   const reportData = generateReport();

// //   const downloadCSV = () => {
// //     const headers = ['SKU', 'Title', 'Brand', 'Vendor', 'Price', 'Quantity', 'Status', 'Fulfillment'];
// //     const rows = reportData.map(p => [
// //       p.sku, 
// //       p.title || 'Untitled Product', 
// //       p.brand, 
// //       p.vendorId || 'default',
// //       p.price || '0.00', 
// //       p.quantity || 0, 
// //       p.status || 'inactive', 
// //       p.fulfillment || 'FBM'
// //     ]);
    
// //     const csv = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
// //     const blob = new Blob([csv], { type: 'text/csv' });
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
// //     a.click();
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">Reports - All Products</h2>
// //         <button
// //           onClick={downloadCSV}
// //           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //         >
// //           <Download size={20} />
// //           Download CSV
// //         </button>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         <label className="block text-sm font-semibold mb-2">Report Type</label>
// //         <select
// //           value={reportType}
// //           onChange={(e) => setReportType(e.target.value)}
// //           className="w-full max-w-md px-4 py-2 border rounded"
// //         >
// //           <option value="all">All Listings Report</option>
// //           <option value="active">Active Listings</option>
// //           <option value="inactive">Inactive Listings</option>
// //           <option value="fba">FBA Inventory Report</option>
// //           <option value="lowstock">Low Stock Alert</option>
// //         </select>
// //       </div>

// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="p-4 bg-gray-50 border-b">
// //           <h3 className="font-semibold">
// //             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
// //           </h3>
// //         </div>
        
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50 border-b">
// //               <tr>
// //                 <th className="p-4 text-left">SKU</th>
// //                 <th className="p-4 text-left">Title</th>
// //                 <th className="p-4 text-left">Brand</th>
// //                 <th className="p-4 text-left">Vendor</th>
// //                 <th className="p-4 text-left">Price</th>
// //                 <th className="p-4 text-left">Quantity</th>
// //                 <th className="p-4 text-left">Status</th>
// //                 <th className="p-4 text-left">Fulfillment</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {reportData.map(product => (
// //                 <tr key={product._id || product.id} className="border-b hover:bg-gray-50">
// //                   <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                   <td className="p-4">{product.title || 'Untitled Product'}</td>
// //                   <td className="p-4">{product.brand}</td>
// //                   <td className="p-4">
// //                     <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
// //                       {product.vendorId || 'default'}
// //                     </span>
// //                   </td>
// //                   <td className="p-4 font-semibold">${product.price || '0.00'}</td>
// //                   <td className="p-4">
// //                     <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
// //                       {product.quantity || 0}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                       'bg-red-100 text-red-800'
// //                     }`}>
// //                       {(product.status || 'inactive')?.toUpperCase()}
// //                     </span>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                     }`}>
// //                       {product.fulfillment || 'FBM'}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
          
// //           {reportData.length === 0 && (
// //             <div className="p-12 text-center text-gray-500">
// //               <Package size={48} className="mx-auto mb-4 text-gray-300" />
// //               <p>No products found for this report</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// // import React, { useState, useEffect } from 'react';
// // import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';

// // // API Configuration
// // const API_BASE_URL = 'http://localhost:8000/api';





// // // Enhanced API Service with proper payload handling
// // const API = {
// //   STORAGE_KEY: "products-data",
// //   VENDOR_KEY: "current-vendor",

// //   // Helper method to handle API requests
// //   async makeRequest(endpoint, options = {}) {
// //     try {
// //       const url = `${API_BASE_URL}${endpoint}`;
// //       console.log(`Making API request to: ${url}`, options);
      
// //       const response = await fetch(url, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           ...options.headers,
// //         },
// //         ...options,
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
// //       }

// //       const data = await response.json();
// //       console.log(`API response from ${url}:`, data);
// //       return data;
// //     } catch (error) {
// //       console.error('API request failed:', error);
// //       throw error;
// //     }
// //   },

// //   getFromStorage: async () => {
// //     try {
// //       const data = localStorage.getItem(API.STORAGE_KEY);
// //       return data ? JSON.parse(data) : [];
// //     } catch (e) {
// //       console.error("Storage read error:", e);
// //       return [];
// //     }
// //   },

// //   saveToStorage: async (products) => {
// //     try {
// //       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
// //       return products;
// //     } catch (e) {
// //       console.error("Storage write error:", e);
// //       throw e;
// //     }
// //   },

// //   getCurrentVendor: async () => {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         const vendor = localStorage.getItem(API.VENDOR_KEY);
// //         return vendor || "default";
// //       }
// //       return "default";
// //     } catch {
// //       return "default";
// //     }
// //   },

// //   setCurrentVendor: async (vendorId) => {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         localStorage.setItem(API.VENDOR_KEY, vendorId);
// //       }
// //     } catch (e) {
// //       console.error("Vendor save error:", e);
// //     }
// //   },

// //   // Get all products - REMOVED vendor filtering to show all products
// //   getProducts: async () => {
// //     try {
// //       console.log(`Fetching all products...`);
      
// //       const data = await API.makeRequest(`/products`);
      
// //       // Handle different response formats
// //       if (data.success && data.products) {
// //         console.log(`Received ${data.products.length} products from API`);
// //         return data.products;
// //       } else if (Array.isArray(data)) {
// //         console.log(`Received ${data.length} products from API (array format)`);
// //         return data;
// //       } else {
// //         console.log('Unexpected API response format:', data);
// //         return [];
// //       }
// //     } catch (error) {
// //       console.log("Using local storage due to API error:", error);
// //       const localProducts = await API.getFromStorage();
// //       console.log(`Loaded ${localProducts.length} products from local storage`);
// //       return localProducts;
// //     }
// //   },

// //   // Create new product with complete payload - FIXED
// //   createProduct: async (product) => {
// //     // Auto-generate vendor ID based on user or use default
// //     const vendorId = "default"; // You can modify this to get from user context

// //     const productData = {
// //       ...product,
// //       vendorId,
// //       // Remove client-generated ID - let MongoDB generate _id
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //     };

// //     // Remove the client-generated ID for API calls
// //     delete productData.id;

// //     try {
// //       console.log('Creating product via API:', productData);
// //       const data = await API.makeRequest('/products', {
// //         method: 'POST',
// //         body: JSON.stringify(productData),
// //       });
      
// //       if (data.success && data.product) {
// //         console.log('Product created successfully via API');
// //         return data.product;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Saving locally due to API error:", error);
// //       // For local storage, we still need an ID
// //       const localProduct = {
// //         ...productData,
// //         id: Date.now().toString(),
// //       };
// //       const products = await API.getFromStorage();
// //       products.push(localProduct);
// //       await API.saveToStorage(products);
// //       console.log('Product saved locally');
// //       return localProduct;
// //     }
// //   },

// //   // Update product with complete payload - FIXED
// //   updateProduct: async (id, updates) => {
// //     const updateData = {
// //       ...updates,
// //       updatedAt: new Date().toISOString(),
// //     };

// //     try {
// //       console.log(`Updating product ${id} via API:`, updateData);
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'PUT',
// //         body: JSON.stringify(updateData),
// //       });
      
// //       if (data.success && data.product) {
// //         console.log('Product updated successfully via API');
// //         return data.product;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Updating locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const index = products.findIndex((p) => p.id === id);

// //       if (index !== -1) {
// //         products[index] = {
// //           ...products[index],
// //           ...updateData,
// //         };
// //         await API.saveToStorage(products);
// //         console.log('Product updated locally');
// //         return products[index];
// //       }

// //       throw new Error("Product not found");
// //     }
// //   },

// //   // Delete product - FIXED
// //   deleteProduct: async (id) => {
// //     try {
// //       console.log(`Deleting product ${id} via API`);
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'DELETE',
// //       });
      
// //       if (data.success) {
// //         console.log('Product deleted successfully via API');
// //         return true;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Deleting locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => p.id !== id);
// //       await API.saveToStorage(filtered);
// //       console.log('Product deleted locally');
// //       return true;
// //     }
// //   },

// //   // Bulk delete products - FIXED
// //   bulkDelete: async (productIds) => {
// //     try {
// //       console.log(`Bulk deleting products via API:`, productIds);
// //       const data = await API.makeRequest('/products/bulk-delete', {
// //         method: 'POST',
// //         body: JSON.stringify({ productIds }),
// //       });
      
// //       if (data.success) {
// //         console.log(`Bulk delete successful via API, deleted ${data.deletedCount} products`);
// //         return true;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Bulk deleting locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => !productIds.includes(p.id));
// //       await API.saveToStorage(filtered);
// //       console.log('Products deleted locally');
// //       return true;
// //     }
// //   },

// //   // Get product statistics - FIXED (all vendors)
// //   getProductStats: async () => {
// //     try {
// //       console.log(`Fetching stats for all products...`);
      
// //       const data = await API.makeRequest(`/products/stats`);
      
// //       if (data.success && data.stats) {
// //         console.log('Received stats from API:', data.stats);
// //         return data.stats;
// //       } else {
// //         throw new Error('Invalid API response format for stats');
// //       }
// //     } catch (error) {
// //       console.log("Using local storage for stats due to API error:", error);
// //       const products = await API.getFromStorage();
      
// //       const stats = {
// //         total: products.length,
// //         active: products.filter(p => p.status === 'active').length,
// //         outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
// //         lowStock: products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length,
// //         fbaCount: products.filter(p => p.fulfillment === 'FBA').length,
// //         fbmCount: products.filter(p => p.fulfillment === 'FBM').length,
// //         totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0),
// //         avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0,
// //       };
      
// //       console.log('Calculated stats locally:', stats);
// //       return stats;
// //     }
// //   },

// //   // Get all vendors from products
// //   getVendors: async () => {
// //     try {
// //       const products = await API.getProducts();
// //       const vendors = [...new Set(products.map(p => p.vendorId).filter(Boolean))];
// //       return vendors;
// //     } catch (error) {
// //       console.error('Error getting vendors:', error);
// //       return [];
// //     }
// //   }
// // };
   
// // // StatCard Component
// // function StatCard({ title, value, icon, color }) {
// //   return (
// //     <div className="bg-white rounded-lg shadow p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-gray-500 text-sm">{title}</p>
// //           <p className="text-3xl font-bold mt-2">{value}</p>
// //         </div>
// //         <div className={`${color} text-white p-3 rounded-lg`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Create Product Component
// // function CreateProduct({ onSuccess }) {
// //   const initialProductState = {
// //     title: '',
// //     sku: '',
// //     brand: '',
// //     price: 0.00,
// //     quantity: 0,
// //     category: '',
// //     status: 'active',
// //     fulfillment: 'FBM',
// //     description: '',
// //     productId: '',
// //     images: [], // Placeholder for a simple image object
// //   };
// //   const [product, setProduct] = useState(initialProductState);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [error, setError] = useState(null);

// //   const handleChange = (e) => {
// //     const { name, value, type } = e.target;
// //     setProduct(prev => ({
// //       ...prev,
// //       [name]: type === 'number' ? parseFloat(value) || 0 : value,
// //     }));
// //   };

// //   const handleImageChange = (e) => {
// //     // Simple placeholder for image handling
// //     const file = e.target.files[0];
// //     if (file) {
// //       setProduct(prev => ({
// //         ...prev,
// //         images: [{ 
// //           url: URL.createObjectURL(file), 
// //           preview: URL.createObjectURL(file), 
// //           alt: file.name 
// //         }],
// //       }));
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);
// //     setError(null);

// //     // Simple validation
// //     if (!product.title || !product.sku || product.price <= 0) {
// //       setError("Title, SKU, and Price are required.");
// //       setIsSubmitting(false);
// //       return;
// //     }

// //     try {
// //       await API.createProduct(product);
// //       setProduct(initialProductState); // Reset form
// //       onSuccess(); // Navigate to products list and refresh data
// //       alert('Product created successfully!');
// //     } catch (err) {
// //       setError(`Failed to create product: ${err.message}`);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-3xl font-bold">Create New Product</h2>
// //       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6">
// //         {error && (
// //           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
// //             <strong className="font-bold">Error!</strong>
// //             <span className="block sm:inline"> {error}</span>
// //           </div>
// //         )}

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {/* Title and Brand */}
// //           <label className="block">
// //             <span className="text-gray-700">Product Title*</span>
// //             <input
// //               type="text"
// //               name="title"
// //               value={product.title}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //               required
// //             />
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700">Brand</span>
// //             <input
// //               type="text"
// //               name="brand"
// //               value={product.brand}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //             />
// //           </label>

// //           {/* SKU and Product ID */}
// //           <label className="block">
// //             <span className="text-gray-700">SKU*</span>
// //             <input
// //               type="text"
// //               name="sku"
// //               value={product.sku}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //               required
// //             />
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700">Amazon Product ID (ASIN/ISBN/etc)</span>
// //             <input
// //               type="text"
// //               name="productId"
// //               value={product.productId}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //             />
// //           </label>

// //           {/* Price and Quantity */}
// //           <label className="block">
// //             <span className="text-gray-700">Price ($)*</span>
// //             <input
// //               type="number"
// //               name="price"
// //               value={product.price}
// //               onChange={handleChange}
// //               min="0.01"
// //               step="0.01"
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //               required
// //             />
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700">Quantity</span>
// //             <input
// //               type="number"
// //               name="quantity"
// //               value={product.quantity}
// //               onChange={handleChange}
// //               min="0"
// //               step="1"
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //             />
// //           </label>

// //           {/* Category and Fulfillment */}
// //           <label className="block">
// //             <span className="text-gray-700">Category</span>
// //             <input
// //               type="text"
// //               name="category"
// //               value={product.category}
// //               onChange={handleChange}
// //               placeholder="e.g., Electronics, HomeGoods"
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //             />
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700">Fulfillment</span>
// //             <select
// //               name="fulfillment"
// //               value={product.fulfillment}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //             >
// //               <option value="FBM">FBM (Fulfilled by Merchant)</option>
// //               <option value="FBA">FBA (Fulfilled by Amazon)</option>
// //             </select>
// //           </label>
// //         </div>

// //         {/* Status and Description */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <label className="block">
// //             <span className="text-gray-700">Status</span>
// //             <select
// //               name="status"
// //               value={product.status}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //             >
// //               <option value="active">Active</option>
// //               <option value="inactive">Inactive</option>
// //             </select>
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700">Description</span>
// //             <textarea
// //               name="description"
// //               value={product.description}
// //               onChange={handleChange}
// //               rows="3"
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
// //             ></textarea>
// //           </label>
// //         </div>

// //         {/* Image Upload Placeholder */}
// //         <div className="border p-4 rounded-md">
// //           <h4 className="text-lg font-semibold mb-2">Product Images (Placeholder)</h4>
// //           <input
// //             type="file"
// //             accept="image/*"
// //             onChange={handleImageChange}
// //             className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
// //           />
// //           {product.images.length > 0 && (
// //             <div className="mt-4 flex flex-wrap gap-2">
// //               {product.images.map((img, index) => (
// //                 <div key={index} className="w-16 h-16 relative border rounded overflow-hidden">
// //                   <img src={img.preview} alt={img.alt} className="w-full h-full object-cover" />
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* Submit Button */}
// //         <button
// //           type="submit"
// //           disabled={isSubmitting}
// //           className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
// //         >
// //           {isSubmitting ? 'Creating...' : (
// //             <>
// //               <Plus size={20} />
// //               Create Product
// //             </>
// //           )}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // // Reports Component
// // function Reports({ products }) {
// //   const getInventoryReport = () => {
// //     return products.map(p => ({
// //       'Product Title': p.title,
// //       SKU: p.sku,
// //       Price: `$${p.price.toFixed(2)}`,
// //       Quantity: p.quantity,
// //       'Total Value': `$${(p.price * p.quantity).toFixed(2)}`,
// //       Status: p.status,
// //       Fulfillment: p.fulfillment,
// //       Vendor: p.vendorId || 'default',
// //     }));
// //   };

// //   const downloadCSV = (data, filename) => {
// //     if (data.length === 0) return;
// //     const header = Object.keys(data[0]).join(',') + '\n';
// //     const rows = data.map(obj => Object.values(obj).join(',') + '\n');
// //     const csv = header + rows.join('');

// //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// //     const link = document.createElement('a');
// //     if (link.download !== undefined) {
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', filename);
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //     }
// //   };

// //   const inventoryReport = getInventoryReport();

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-3xl font-bold">Product Reports & Analytics</h2>
      
// //       {/* Report Generation */}
// //       <div className="bg-white rounded-lg shadow p-6 space-y-4">
// //         <h3 className="text-xl font-bold flex items-center gap-2">
// //           <BarChart3 className="text-blue-500" />
// //           Inventory Data Export
// //         </h3>
// //         <p className="text-gray-600">Generate and download a CSV file containing all product inventory details.</p>
// //         <button
// //           onClick={() => downloadCSV(inventoryReport, 'product_inventory_report.csv')}
// //           className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
// //         >
// //           <Download size={20} />
// //           Download Full Inventory CSV
// //         </button>
// //       </div>

// //       {/* Low Stock Report Preview */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
// //           <AlertTriangle className="text-red-500" />
// //           Low Stock Report (Quantity &lt; 10)
// //         </h3>
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {products
// //                 .filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10)
// //                 .map((product) => (
// //                   <tr key={product._id || product.id}>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{product.quantity}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.vendorId || 'default'}</td>
// //                   </tr>
// //                 ))}
// //               {products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length === 0 && (
// //                 <tr>
// //                   <td colSpan="4" className="text-center py-4 text-gray-500">No low stock items currently.</td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // // Main App Component - REMOVED vendor dropdown
// // export default function AmazonProductManager() {
// //   const [view, setView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedProducts, setSelectedProducts] = useState([]);
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     status: 'all',
// //     fulfillment: 'all'
// //   });
// //   const [stats, setStats] = useState({
// //     total: 0,
// //     active: 0,
// //     outOfStock: 0,
// //     lowStock: 0,
// //     fbaCount: 0,
// //     fbmCount: 0,
// //     totalValue: 0,
// //     avgPrice: 0
// //   });

// //   useEffect(() => {
// //     loadProducts();
// //     loadStats();
// //   }, []);

// //   const loadProducts = async () => {
// //     setLoading(true);
// //     try {
// //       console.log('Loading products...');
// //       const data = await API.getProducts();
// //       console.log('Products loaded:', data);
// //       setProducts(Array.isArray(data) ? data : []);
// //     } catch (error) {
// //       console.error('Error loading products:', error);
// //       alert('Failed to load products. Please try again.');
// //       setProducts([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadStats = async () => {
// //     try {
// //       console.log('Loading stats...');
// //       const data = await API.getProductStats();
// //       console.log('Stats loaded:', data);
// //       setStats(data);
// //     } catch (error) {
// //       console.error('Error loading stats:', error);
// //       // Set default stats on error
// //       setStats({
// //         total: 0,
// //         active: 0,
// //         outOfStock: 0,
// //         lowStock: 0,
// //         fbaCount: 0,
// //         fbmCount: 0,
// //         totalValue: 0,
// //         avgPrice: 0
// //       });
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header - REMOVED vendor dropdown */}
// //       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <h1 className="text-2xl font-bold">Amazon Product Manager</h1>
// //             <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
// //               <User size={18} />
// //               <span className="text-sm">All Products</span>
// //             </div>
// //           </div>
// //           <nav className="flex gap-4">
// //             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Dashboard
// //             </button>
// //             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Products
// //             </button>
// //             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Create Product
// //             </button>
// //             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
// //               Reports
// //             </button>
// //           </nav>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto p-6">
// //         {loading ? (
// //           <div className="flex items-center justify-center h-64">
// //             <div className="text-gray-500">Loading products...</div>
// //           </div>
// //         ) : (
// //           <>
// //             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
// //             {view === 'products' && (
// //               <ProductList
// //                 products={products}
// //                 filters={filters}
// //                 setFilters={setFilters}
// //                 selectedProducts={selectedProducts}
// //                 setSelectedProducts={setSelectedProducts}
// //                 onRefresh={loadProducts}
// //                 setView={setView}
// //               />
// //             )}
// //             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); loadStats(); setView('products'); }} />}
// //             {view === 'reports' && <Reports products={products} />}
// //           </>
// //         )}
// //       </main>

// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setView('create')}
// //         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
// //       >
// //         <Plus size={24} />
// //       </button>
// //     </div>
// //   );
// // }

// // // Dashboard Component - UPDATED to show all products
// // function Dashboard({ stats, products }) {
// //   const categoryBreakdown = products.reduce((acc, p) => {
// //     const category = p.category || 'uncategorized';
// //     acc[category] = (acc[category] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const statusBreakdown = products.reduce((acc, p) => {
// //     const status = p.status || 'inactive';
// //     acc[status] = (acc[status] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const vendorBreakdown = products.reduce((acc, p) => {
// //     const vendor = p.vendorId || 'default';
// //     acc[vendor] = (acc[vendor] || 0) + 1;
// //     return acc;
// //   }, {});

// //   // Helper function to get product ID (handles both MongoDB _id and local id)
// //   const getProductId = (product) => {
// //     return product._id || product.id;
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-3xl font-bold">Dashboard - All Products</h2>
      
// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
// //         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
// //         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
// //         <StatCard title="Low Stock Alert" value={stats.lowStock} icon={<AlertTriangle />} color="bg-orange-500" />
// //       </div>

// //       {/* Secondary Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">Total Inventory Value</p>
// //           <p className="text-2xl font-bold text-green-600 mt-1">${stats.totalValue?.toFixed(2) || '0.00'}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">Average Price</p>
// //           <p className="text-2xl font-bold text-blue-600 mt-1">${stats.avgPrice?.toFixed(2) || '0.00'}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">FBA Products</p>
// //           <p className="text-2xl font-bold text-purple-600 mt-1">{stats.fbaCount || 0}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <p className="text-gray-500 text-sm">FBM Products</p>
// //           <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.fbmCount || 0}</p>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         {/* Category Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Category</h3>
// //           <div className="space-y-3">
// //             {Object.entries(categoryBreakdown).map(([category, count]) => (
// //               <div key={category} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className="bg-blue-500 h-2 rounded-full" 
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(categoryBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No categories yet</p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Status Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Status</h3>
// //           <div className="space-y-3">
// //             {Object.entries(statusBreakdown).map(([status, count]) => (
// //               <div key={status} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{status}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className={`h-2 rounded-full ${
// //                         status === 'active' ? 'bg-green-500' : 
// //                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
// //                       }`}
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(statusBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No products yet</p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Vendor Breakdown */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4">Products by Vendor</h3>
// //           <div className="space-y-3">
// //             {Object.entries(vendorBreakdown).map(([vendor, count]) => (
// //               <div key={vendor} className="flex items-center justify-between">
// //                 <span className="text-gray-700 capitalize">{vendor}</span>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className="bg-purple-500 h-2 rounded-full" 
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(vendorBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-4">No vendors yet</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Products */}
// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h3 className="text-xl font-bold mb-4">Recent Products</h3>
// //         <div className="space-y-2">
// //           {products.slice(0, 5).map(product => (
// //             <div key={getProductId(product)} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
// //               <div className="flex items-center gap-3">
// //                 <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
// //                   {product.images && product.images.length > 0 ? (
// //                     <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
// //                   ) : (
// //                     <Package size={20} className="text-gray-400" />
// //                   )}
// //                 </div>
// //                 <div>
// //                   <p className="font-semibold">{product.title || 'Untitled Product'}</p>
// //                   <p className="text-sm text-gray-500">SKU: {product.sku} | Vendor: {product.vendorId || 'default'}</p>
// //                 </div>
// //               </div>
// //               <div className="text-right">
// //                 <p className="font-bold text-green-600">${product.price || '0.00'}</p>
// //                 <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
// //                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                 }`}>
// //                   {product.fulfillment || 'FBM'}
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //           {products.length === 0 && (
// //             <div className="text-center py-12">
// //               <Package size={64} className="mx-auto text-gray-300 mb-4" />
// //               <p className="text-gray-500 text-lg mb-2">No products yet</p>
// //               <p className="text-gray-400 text-sm">Create your first product to get started!</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Alerts Section */}
// //       {(stats.outOfStock > 0 || stats.lowStock > 0) && (
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
// //             <AlertTriangle className="text-orange-500" />
// //             Inventory Alerts
// //           </h3>
// //           <div className="space-y-3">
// //             {stats.outOfStock > 0 && (
// //               <div className="bg-red-50 border border-red-200 rounded p-4">
// //                 <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
// //                 <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
// //               </div>
// //             )}
// //             {stats.lowStock > 0 && (
// //               <div className="bg-orange-50 border border-orange-200 rounded p-4">
// //                 <p className="font-semibold text-orange-800">{stats.lowStock} product(s) running low (less than 10 units)</p>
// //                 <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // Product List Component - UPDATED to handle all products
// // function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
// //   // Helper function to get product ID (handles both MongoDB _id and local id)
// //   const getProductId = (product) => {
// //     return product._id || product.id;
// //   };
// // const [currentPage, setCurrentPage] = useState(1);
// // const itemsPerPage = 10;

// //   const filteredProducts = products.filter(p => {
// //     const matchesSearch = !filters.search || 
// //       (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.sku && p.sku.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.productId && p.productId.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.vendorId && p.vendorId.toLowerCase().includes(filters.search.toLowerCase()));
    
// //     const matchesStatus = filters.status === 'all' || p.status === filters.status;
// //     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
// //     return matchesSearch && matchesStatus && matchesFulfillment;
// //   });

// //   const handleSelectAll = (e) => {
// //     if (e.target.checked) {
// //       setSelectedProducts(filteredProducts.map(p => getProductId(p)));
// //     } else {
// //       setSelectedProducts([]);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
// //       try {
// //         await API.bulkDelete(selectedProducts);
// //         setSelectedProducts([]);
// //         onRefresh();
// //       } catch (error) {
// //         alert('Error deleting products: ' + error.message);
// //       }
// //     }
// //   };
// // const indexOfLastItem = currentPage * itemsPerPage;
// // const indexOfFirstItem = indexOfLastItem - itemsPerPage;

// // const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

// // const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

// //   // Inline action handlers
// //   const handleDeleteProduct = async (id) => {
// //     if (window.confirm('Delete this product?')) {
// //       try {
// //         await API.deleteProduct(id);
// //         onRefresh();
// //       } catch (error) {
// //         alert('Error deleting product: ' + error.message);
// //       }
// //     }
// //   };

// //   const handleEditProduct = (product) => {
// //     // In a full application, this would open a modal/edit view
// //     alert(`Editing product: ${product.title} (ID: ${getProductId(product)})`);
// //     // For a real application, you would pass the product and switch view: setView('edit', product)
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-3xl font-bold">All Products ({products.length})</h2>
// //         <div className="flex gap-2">
// //           <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// //             Refresh
// //           </button>
// //         </div>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow p-4">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search by Name, SKU, Product ID, Vendor..."
// //               value={filters.search}
// //               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
// //               className="w-full pl-10 pr-4 py-2 border rounded"
// //             />
// //           </div>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //             <option value="outofstock">Out of Stock</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="px-4 py-2 border rounded"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA</option>
// //             <option value="FBM">FBM</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Bulk Actions */}
// //       {selectedProducts.length > 0 && (
// //         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
// //           <span className="font-semibold">{selectedProducts.length} products selected</span>
// //           <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
// //             Delete Selected
// //           </button>
// //         </div>
// //       )}

// //       {/* Products Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-50 border-b">
// //             <tr>
// //               <th className="p-4 text-left">
// //                 <input
// //                   type="checkbox"
// //                   onChange={handleSelectAll}
// //                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
// //                 />
// //               </th>
// //               <th className="p-4 text-left">Product</th>
// //               <th className="p-4 text-left">SKU</th>
// //               <th className="p-4 text-left">Vendor</th>
// //               <th className="p-4 text-left">Status</th>
// //               <th className="p-4 text-left">Price</th>
// //               <th className="p-4 text-left">Quantity</th>
// //               <th className="p-4 text-left">Fulfillment</th>
// //               <th className="p-4 text-left">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {currentProducts.map(product => (
// //               <tr key={getProductId(product)} className="border-b hover:bg-gray-50">
// //                 <td className="p-4">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedProducts.includes(getProductId(product))}
// //                     onChange={(e) => {
// //                       const productId = getProductId(product);
// //                       if (e.target.checked) {
// //                         setSelectedProducts([...selectedProducts, productId]);
// //                       } else {
// //                         setSelectedProducts(selectedProducts.filter(id => id !== productId));
// //                       }
// //                     }}
// //                   />
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
// //                       {product.images && product.images.length > 0 ? (
// //                         <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
// //                       ) : (
// //                         <Package size={20} className="text-gray-400" />
// //                       )}
// //                     </div>
// //                     <div>
// //                       <p className="font-semibold">{product.title || 'Untitled Product'}</p>
// //                       <p className="text-sm text-gray-500">{product.brand}</p>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="p-4 font-mono text-sm">{product.sku}</td>
// //                 <td className="p-4">
// //                   <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
// //                     {product.vendorId || 'default'}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                     'bg-red-100 text-red-800'
// //                   }`}>
// //                     {(product.status || 'inactive')?.toUpperCase()}
// //                   </span>
// //                 </td>
// //                 <td className="p-4 font-semibold">${product.price || '0.00'}</td>
// //                 <td className="p-4">
// //                   <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
// //                     {product.quantity || 0}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                   }`}>
// //                     {product.fulfillment || 'FBM'}
// //                   </span>
// //                 </td>
// //                 <td className="p-4">
// //                   <div className="flex gap-2">
// //                     <button 
// //                       onClick={() => handleEditProduct(product)}
// //                       className="p-2 text-blue-600 hover:bg-blue-50 rounded"
// //                     >
// //                       <Edit size={18} />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDeleteProduct(getProductId(product))}
// //                       className="p-2 text-red-600 hover:bg-red-50 rounded"
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //         {/* Pagination */}
// // {filteredProducts.length > 0 && (
// //   <div className="flex items-center justify-between p-4 border-t bg-gray-50">

// //     {/* Showing count */}
// //     <p className="text-sm text-gray-600">
// //       Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
// //     </p>

// //     {/* Pagination Buttons */}
// //     <div className="flex gap-2">
// //       <button
// //         disabled={currentPage === 1}
// //         onClick={() => setCurrentPage(prev => prev - 1)}
// //         className={`px-3 py-1 border rounded ${
// //           currentPage === 1
// //             ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// //             : "bg-white hover:bg-gray-100"
// //         }`}
// //       >
// //         Previous
// //       </button>

// //       {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
// //         <button
// //           key={page}
// //           onClick={() => setCurrentPage(page)}
// //           className={`px-3 py-1 border rounded ${
// //             currentPage === page
// //               ? "bg-blue-500 text-white"
// //               : "bg-white hover:bg-gray-100"
// //           }`}
// //         >
// //           {page}
// //         </button>
// //       ))}

// //       <button
// //         disabled={currentPage === totalPages}
// //         onClick={() => setCurrentPage(prev => prev + 1)}
// //         className={`px-3 py-1 border rounded ${
// //           currentPage === totalPages
// //             ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// //             : "bg-white hover:bg-gray-100"
// //         }`}
// //       >
// //         Next
// //       </button>
// //     </div>
// //   </div>
// // )}

// //         {/* {filteredProducts.length === 0 && (
// //           <div className="p-12 text-center text-gray-500">
// //             <Filter size={48} className="mx-auto text-gray-300 mb-4" />
// //             <p className="text-lg font-semibold">No products match your filters.</p>
// //             <p className="text-sm">Try adjusting your search or filter selections.</p>
// //           </div>
// //         )} */}
// //       </div>
// //     </div>
// //   );
// // }




// // import React, { useState, useEffect } from 'react';
// // import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User, Menu, X } from 'lucide-react';

// // // API Configuration (same as before)
// // const API_BASE_URL = 'http://localhost:8000/api';

// // const API = {
// //   STORAGE_KEY: "products-data",
// //   VENDOR_KEY: "current-vendor",

// //   async makeRequest(endpoint, options = {}) {
// //     try {
// //       const url = `${API_BASE_URL}${endpoint}`;
// //       console.log(`Making API request to: ${url}`, options);
      
// //       const response = await fetch(url, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           ...options.headers,
// //         },
// //         ...options,
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
// //       }

// //       const data = await response.json();
// //       console.log(`API response from ${url}:`, data);
// //       return data;
// //     } catch (error) {
// //       console.error('API request failed:', error);
// //       throw error;
// //     }
// //   },

// //   getFromStorage: async () => {
// //     try {
// //       const data = localStorage.getItem(API.STORAGE_KEY);
// //       return data ? JSON.parse(data) : [];
// //     } catch (e) {
// //       console.error("Storage read error:", e);
// //       return [];
// //     }
// //   },

// //   saveToStorage: async (products) => {
// //     try {
// //       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
// //       return products;
// //     } catch (e) {
// //       console.error("Storage write error:", e);
// //       throw e;
// //     }
// //   },

// //   getCurrentVendor: async () => {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         const vendor = localStorage.getItem(API.VENDOR_KEY);
// //         return vendor || "default";
// //       }
// //       return "default";
// //     } catch {
// //       return "default";
// //     }
// //   },

// //   setCurrentVendor: async (vendorId) => {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         localStorage.setItem(API.VENDOR_KEY, vendorId);
// //       }
// //     } catch (e) {
// //       console.error("Vendor save error:", e);
// //     }
// //   },

// //   getProducts: async () => {
// //     try {
// //       console.log(`Fetching all products...`);
// //       const data = await API.makeRequest(`/products`);
      
// //       if (data.success && data.products) {
// //         console.log(`Received ${data.products.length} products from API`);
// //         return data.products;
// //       } else if (Array.isArray(data)) {
// //         console.log(`Received ${data.length} products from API (array format)`);
// //         return data;
// //       } else {
// //         console.log('Unexpected API response format:', data);
// //         return [];
// //       }
// //     } catch (error) {
// //       console.log("Using local storage due to API error:", error);
// //       const localProducts = await API.getFromStorage();
// //       console.log(`Loaded ${localProducts.length} products from local storage`);
// //       return localProducts;
// //     }
// //   },

// //   createProduct: async (product) => {
// //     const vendorId = "default";
// //     const productData = {
// //       ...product,
// //       vendorId,
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //     };

// //     delete productData.id;

// //     try {
// //       console.log('Creating product via API:', productData);
// //       const data = await API.makeRequest('/products', {
// //         method: 'POST',
// //         body: JSON.stringify(productData),
// //       });
      
// //       if (data.success && data.product) {
// //         console.log('Product created successfully via API');
// //         return data.product;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Saving locally due to API error:", error);
// //       const localProduct = {
// //         ...productData,
// //         id: Date.now().toString(),
// //       };
// //       const products = await API.getFromStorage();
// //       products.push(localProduct);
// //       await API.saveToStorage(products);
// //       console.log('Product saved locally');
// //       return localProduct;
// //     }
// //   },

// //   updateProduct: async (id, updates) => {
// //     const updateData = {
// //       ...updates,
// //       updatedAt: new Date().toISOString(),
// //     };

// //     try {
// //       console.log(`Updating product ${id} via API:`, updateData);
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'PUT',
// //         body: JSON.stringify(updateData),
// //       });
      
// //       if (data.success && data.product) {
// //         console.log('Product updated successfully via API');
// //         return data.product;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Updating locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const index = products.findIndex((p) => p.id === id);

// //       if (index !== -1) {
// //         products[index] = {
// //           ...products[index],
// //           ...updateData,
// //         };
// //         await API.saveToStorage(products);
// //         console.log('Product updated locally');
// //         return products[index];
// //       }

// //       throw new Error("Product not found");
// //     }
// //   },

// //   deleteProduct: async (id) => {
// //     try {
// //       console.log(`Deleting product ${id} via API`);
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'DELETE',
// //       });
      
// //       if (data.success) {
// //         console.log('Product deleted successfully via API');
// //         return true;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Deleting locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => p.id !== id);
// //       await API.saveToStorage(filtered);
// //       console.log('Product deleted locally');
// //       return true;
// //     }
// //   },

// //   bulkDelete: async (productIds) => {
// //     try {
// //       console.log(`Bulk deleting products via API:`, productIds);
// //       const data = await API.makeRequest('/products/bulk-delete', {
// //         method: 'POST',
// //         body: JSON.stringify({ productIds }),
// //       });
      
// //       if (data.success) {
// //         console.log(`Bulk delete successful via API, deleted ${data.deletedCount} products`);
// //         return true;
// //       } else {
// //         throw new Error('Invalid API response format');
// //       }
// //     } catch (error) {
// //       console.log("Bulk deleting locally due to API error:", error);
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter((p) => !productIds.includes(p.id));
// //       await API.saveToStorage(filtered);
// //       console.log('Products deleted locally');
// //       return true;
// //     }
// //   },

// //   getProductStats: async () => {
// //     try {
// //       console.log(`Fetching stats for all products...`);
// //       const data = await API.makeRequest(`/products/stats`);
      
// //       if (data.success && data.stats) {
// //         console.log('Received stats from API:', data.stats);
// //         return data.stats;
// //       } else {
// //         throw new Error('Invalid API response format for stats');
// //       }
// //     } catch (error) {
// //       console.log("Using local storage for stats due to API error:", error);
// //       const products = await API.getFromStorage();
      
// //       const stats = {
// //         total: products.length,
// //         active: products.filter(p => p.status === 'active').length,
// //         outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
// //         lowStock: products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length,
// //         fbaCount: products.filter(p => p.fulfillment === 'FBA').length,
// //         fbmCount: products.filter(p => p.fulfillment === 'FBM').length,
// //         totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0),
// //         avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0,
// //       };
      
// //       console.log('Calculated stats locally:', stats);
// //       return stats;
// //     }
// //   },

// //   getVendors: async () => {
// //     try {
// //       const products = await API.getProducts();
// //       const vendors = [...new Set(products.map(p => p.vendorId).filter(Boolean))];
// //       return vendors;
// //     } catch (error) {
// //       console.error('Error getting vendors:', error);
// //       return [];
// //     }
// //   }
// // };

// // // StatCard Component - Responsive
// // function StatCard({ title, value, icon, color }) {
// //   return (
// //     <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
// //       <div className="flex items-center justify-between">
// //         <div className="flex-1 min-w-0">
// //           <p className="text-gray-500 text-xs sm:text-sm truncate">{title}</p>
// //           <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 truncate">{value}</p>
// //         </div>
// //         <div className={`${color} text-white p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2 sm:ml-4`}>
// //           {React.cloneElement(icon, { size: window.innerWidth < 640 ? 20 : 24 })}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Create Product Component - Responsive
// // function CreateProduct({ onSuccess }) {
// //   const initialProductState = {
// //     title: '',
// //     sku: '',
// //     brand: '',
// //     price: 0.00,
// //     quantity: 0,
// //     category: '',
// //     status: 'active',
// //     fulfillment: 'FBM',
// //     description: '',
// //     productId: '',
// //     images: [],
// //   };
// //   const [product, setProduct] = useState(initialProductState);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [error, setError] = useState(null);

// //   const handleChange = (e) => {
// //     const { name, value, type } = e.target;
// //     setProduct(prev => ({
// //       ...prev,
// //       [name]: type === 'number' ? parseFloat(value) || 0 : value,
// //     }));
// //   };

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setProduct(prev => ({
// //         ...prev,
// //         images: [{ 
// //           url: URL.createObjectURL(file), 
// //           preview: URL.createObjectURL(file), 
// //           alt: file.name 
// //         }],
// //       }));
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);
// //     setError(null);

// //     if (!product.title || !product.sku || product.price <= 0) {
// //       setError("Title, SKU, and Price are required.");
// //       setIsSubmitting(false);
// //       return;
// //     }

// //     try {
// //       await API.createProduct(product);
// //       setProduct(initialProductState);
// //       onSuccess();
// //       alert('Product created successfully!');
// //     } catch (err) {
// //       setError(`Failed to create product: ${err.message}`);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-4 sm:space-y-6">
// //       <h2 className="text-2xl sm:text-3xl font-bold">Create New Product</h2>
// //       <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow space-y-4 sm:space-y-6">
// //         {error && (
// //           <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative text-sm sm:text-base">
// //             <strong className="font-bold">Error!</strong>
// //             <span className="block sm:inline"> {error}</span>
// //           </div>
// //         )}

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Product Title*</span>
// //             <input
// //               type="text"
// //               name="title"
// //               value={product.title}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //               required
// //             />
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Brand</span>
// //             <input
// //               type="text"
// //               name="brand"
// //               value={product.brand}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //             />
// //           </label>

// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">SKU*</span>
// //             <input
// //               type="text"
// //               name="sku"
// //               value={product.sku}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //               required
// //             />
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Amazon Product ID</span>
// //             <input
// //               type="text"
// //               name="productId"
// //               value={product.productId}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //             />
// //           </label>

// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Price ($)*</span>
// //             <input
// //               type="number"
// //               name="price"
// //               value={product.price}
// //               onChange={handleChange}
// //               min="0.01"
// //               step="0.01"
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //               required
// //             />
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Quantity</span>
// //             <input
// //               type="number"
// //               name="quantity"
// //               value={product.quantity}
// //               onChange={handleChange}
// //               min="0"
// //               step="1"
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //             />
// //           </label>

// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Category</span>
// //             <input
// //               type="text"
// //               name="category"
// //               value={product.category}
// //               onChange={handleChange}
// //               placeholder="e.g., Electronics, HomeGoods"
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //             />
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Fulfillment</span>
// //             <select
// //               name="fulfillment"
// //               value={product.fulfillment}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //             >
// //               <option value="FBM">FBM (Fulfilled by Merchant)</option>
// //               <option value="FBA">FBA (Fulfilled by Amazon)</option>
// //             </select>
// //           </label>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Status</span>
// //             <select
// //               name="status"
// //               value={product.status}
// //               onChange={handleChange}
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //             >
// //               <option value="active">Active</option>
// //               <option value="inactive">Inactive</option>
// //             </select>
// //           </label>
// //           <label className="block">
// //             <span className="text-gray-700 text-sm sm:text-base">Description</span>
// //             <textarea
// //               name="description"
// //               value={product.description}
// //               onChange={handleChange}
// //               rows="3"
// //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
// //             ></textarea>
// //           </label>
// //         </div>

// //         <div className="border p-3 sm:p-4 rounded-md">
// //           <h4 className="text-base sm:text-lg font-semibold mb-2">Product Images (Placeholder)</h4>
// //           <input
// //             type="file"
// //             accept="image/*"
// //             onChange={handleImageChange}
// //             className="mt-1 block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
// //           />
// //           {product.images.length > 0 && (
// //             <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
// //               {product.images.map((img, index) => (
// //                 <div key={index} className="w-12 h-12 sm:w-16 sm:h-16 relative border rounded overflow-hidden">
// //                   <img src={img.preview} alt={img.alt} className="w-full h-full object-cover" />
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         <button
// //           type="submit"
// //           disabled={isSubmitting}
// //           className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm sm:text-base"
// //         >
// //           {isSubmitting ? 'Creating...' : (
// //             <>
// //               <Plus size={16} className="sm:w-5 sm:h-5" />
// //               Create Product
// //             </>
// //           )}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // // Reports Component - Responsive
// // function Reports({ products }) {
// //   const getInventoryReport = () => {
// //     return products.map(p => ({
// //       'Product Title': p.title,
// //       SKU: p.sku,
// //       Price: `$${p.price.toFixed(2)}`,
// //       Quantity: p.quantity,
// //       'Total Value': `$${(p.price * p.quantity).toFixed(2)}`,
// //       Status: p.status,
// //       Fulfillment: p.fulfillment,
// //       Vendor: p.vendorId || 'default',
// //     }));
// //   };

// //   const downloadCSV = (data, filename) => {
// //     if (data.length === 0) return;
// //     const header = Object.keys(data[0]).join(',') + '\n';
// //     const rows = data.map(obj => Object.values(obj).join(',') + '\n');
// //     const csv = header + rows.join('');

// //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// //     const link = document.createElement('a');
// //     if (link.download !== undefined) {
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', filename);
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //     }
// //   };

// //   const inventoryReport = getInventoryReport();

// //   return (
// //     <div className="space-y-4 sm:space-y-6">
// //       <h2 className="text-2xl sm:text-3xl font-bold">Product Reports & Analytics</h2>
      
// //       <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-3 sm:space-y-4">
// //         <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
// //           <BarChart3 className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
// //           Inventory Data Export
// //         </h3>
// //         <p className="text-gray-600 text-sm sm:text-base">Generate and download a CSV file containing all product inventory details.</p>
// //         <button
// //           onClick={() => downloadCSV(inventoryReport, 'product_inventory_report.csv')}
// //           className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
// //         >
// //           <Download size={16} className="sm:w-5 sm:h-5" />
// //           Download Full Inventory CSV
// //         </button>
// //       </div>

// //       <div className="bg-white rounded-lg shadow p-4 sm:p-6">
// //         <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
// //           <AlertTriangle className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
// //           Low Stock Report (Quantity &lt; 10)
// //         </h3>
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
// //                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
// //                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
// //                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {products
// //                 .filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10)
// //                 .map((product) => (
// //                   <tr key={product._id || product.id}>
// //                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
// //                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
// //                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-bold text-red-600">{product.quantity}</td>
// //                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">{product.vendorId || 'default'}</td>
// //                   </tr>
// //                 ))}
// //               {products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length === 0 && (
// //                 <tr>
// //                   <td colSpan="4" className="text-center py-4 text-gray-500 text-sm sm:text-base">No low stock items currently.</td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Main App Component - Fully Responsive
// // export default function AmazonProductManager() {
// //   const [view, setView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedProducts, setSelectedProducts] = useState([]);
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     status: 'all',
// //     fulfillment: 'all'
// //   });
// //   const [stats, setStats] = useState({
// //     total: 0,
// //     active: 0,
// //     outOfStock: 0,
// //     lowStock: 0,
// //     fbaCount: 0,
// //     fbmCount: 0,
// //     totalValue: 0,
// //     avgPrice: 0
// //   });
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// //   useEffect(() => {
// //     loadProducts();
// //     loadStats();
// //   }, []);

// //   const loadProducts = async () => {
// //     setLoading(true);
// //     try {
// //       console.log('Loading products...');
// //       const data = await API.getProducts();
// //       console.log('Products loaded:', data);
// //       setProducts(Array.isArray(data) ? data : []);
// //     } catch (error) {
// //       console.error('Error loading products:', error);
// //       alert('Failed to load products. Please try again.');
// //       setProducts([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadStats = async () => {
// //     try {
// //       console.log('Loading stats...');
// //       const data = await API.getProductStats();
// //       console.log('Stats loaded:', data);
// //       setStats(data);
// //     } catch (error) {
// //       console.error('Error loading stats:', error);
// //       setStats({
// //         total: 0,
// //         active: 0,
// //         outOfStock: 0,
// //         lowStock: 0,
// //         fbaCount: 0,
// //         fbmCount: 0,
// //         totalValue: 0,
// //         avgPrice: 0
// //       });
// //     }
// //   };

// //   const toggleMobileMenu = () => {
// //     setMobileMenuOpen(!mobileMenuOpen);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header - Responsive */}
// //       <header className="bg-gray-900 text-white p-3 sm:p-4 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-2 sm:gap-4">
// //               <button 
// //                 onClick={toggleMobileMenu}
// //                 className="lg:hidden p-2 rounded hover:bg-gray-800 transition-colors"
// //               >
// //                 {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
// //               </button>
// //               <h1 className="text-xl sm:text-2xl font-bold truncate">Amazon Product Manager</h1>
// //               <div className="hidden sm:flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
// //                 <User size={16} className="sm:w-4 sm:h-4" />
// //                 <span className="text-sm">All Products</span>
// //               </div>
// //             </div>
            
// //             {/* Desktop Navigation */}
// //             <nav className="hidden lg:flex gap-2">
// //               <button 
// //                 onClick={() => setView('dashboard')} 
// //                 className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base transition-colors ${
// //                   view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'
// //                 }`}
// //               >
// //                 Dashboard
// //               </button>
// //               <button 
// //                 onClick={() => setView('products')} 
// //                 className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base transition-colors ${
// //                   view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'
// //                 }`}
// //               >
// //                 Products
// //               </button>
// //               <button 
// //                 onClick={() => setView('create')} 
// //                 className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base transition-colors ${
// //                   view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'
// //                 }`}
// //               >
// //                 Create Product
// //               </button>
// //               <button 
// //                 onClick={() => setView('reports')} 
// //                 className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base transition-colors ${
// //                   view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'
// //                 }`}
// //               >
// //                 Reports
// //               </button>
// //             </nav>
// //           </div>

// //           {/* Mobile Navigation */}
// //           {mobileMenuOpen && (
// //             <nav className="lg:hidden mt-3 space-y-2 border-t border-gray-700 pt-3">
// //               <button 
// //                 onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }} 
// //                 className={`block w-full text-left px-3 py-2 rounded text-base transition-colors ${
// //                   view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'
// //                 }`}
// //               >
// //                 Dashboard
// //               </button>
// //               <button 
// //                 onClick={() => { setView('products'); setMobileMenuOpen(false); }} 
// //                 className={`block w-full text-left px-3 py-2 rounded text-base transition-colors ${
// //                   view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'
// //                 }`}
// //               >
// //                 Products
// //               </button>
// //               <button 
// //                 onClick={() => { setView('create'); setMobileMenuOpen(false); }} 
// //                 className={`block w-full text-left px-3 py-2 rounded text-base transition-colors ${
// //                   view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'
// //                 }`}
// //               >
// //                 Create Product
// //               </button>
// //               <button 
// //                 onClick={() => { setView('reports'); setMobileMenuOpen(false); }} 
// //                 className={`block w-full text-left px-3 py-2 rounded text-base transition-colors ${
// //                   view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'
// //                 }`}
// //               >
// //                 Reports
// //               </button>
// //             </nav>
// //           )}
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
// //         {loading ? (
// //           <div className="flex items-center justify-center h-48 sm:h-64">
// //             <div className="text-gray-500 text-sm sm:text-base">Loading products...</div>
// //           </div>
// //         ) : (
// //           <>
// //             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
// //             {view === 'products' && (
// //               <ProductList
// //                 products={products}
// //                 filters={filters}
// //                 setFilters={setFilters}
// //                 selectedProducts={selectedProducts}
// //                 setSelectedProducts={setSelectedProducts}
// //                 onRefresh={loadProducts}
// //                 setView={setView}
// //               />
// //             )}
// //             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); loadStats(); setView('products'); }} />}
// //             {view === 'reports' && <Reports products={products} />}
// //           </>
// //         )}
// //       </main>

// //       {/* Floating Action Button - Responsive */}
// //       <button
// //         onClick={() => setView('create')}
// //         className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-orange-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all z-40"
// //       >
// //         <Plus size={20} className="sm:w-6 sm:h-6" />
// //       </button>
// //     </div>
// //   );
// // }

// // // Dashboard Component - Fully Responsive
// // function Dashboard({ stats, products }) {
// //   const categoryBreakdown = products.reduce((acc, p) => {
// //     const category = p.category || 'uncategorized';
// //     acc[category] = (acc[category] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const statusBreakdown = products.reduce((acc, p) => {
// //     const status = p.status || 'inactive';
// //     acc[status] = (acc[status] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const vendorBreakdown = products.reduce((acc, p) => {
// //     const vendor = p.vendorId || 'default';
// //     acc[vendor] = (acc[vendor] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const getProductId = (product) => {
// //     return product._id || product.id;
// //   };

// //   return (
// //     <div className="space-y-4 sm:space-y-6">
// //       <h2 className="text-2xl sm:text-3xl font-bold">Dashboard - All Products</h2>
      
// //       {/* Stats Cards - Responsive Grid */}
// //       <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
// //         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
// //         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
// //         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
// //         <StatCard title="Low Stock Alert" value={stats.lowStock} icon={<AlertTriangle />} color="bg-orange-500" />
// //       </div>

// //       {/* Secondary Stats - Responsive Grid */}
// //       <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
// //         <div className="bg-white rounded-lg shadow p-3 sm:p-4">
// //           <p className="text-gray-500 text-xs sm:text-sm">Total Inventory Value</p>
// //           <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mt-1 truncate">${stats.totalValue?.toFixed(2) || '0.00'}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-3 sm:p-4">
// //           <p className="text-gray-500 text-xs sm:text-sm">Average Price</p>
// //           <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mt-1 truncate">${stats.avgPrice?.toFixed(2) || '0.00'}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-3 sm:p-4">
// //           <p className="text-gray-500 text-xs sm:text-sm">FBA Products</p>
// //           <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mt-1 truncate">{stats.fbaCount || 0}</p>
// //         </div>
// //         <div className="bg-white rounded-lg shadow p-3 sm:p-4">
// //           <p className="text-gray-500 text-xs sm:text-sm">FBM Products</p>
// //           <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 mt-1 truncate">{stats.fbmCount || 0}</p>
// //         </div>
// //       </div>

// //       {/* Breakdown Sections - Responsive Grid */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
// //         <div className="bg-white rounded-lg shadow p-4 sm:p-6">
// //           <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Products by Category</h3>
// //           <div className="space-y-2 sm:space-y-3">
// //             {Object.entries(categoryBreakdown).map(([category, count]) => (
// //               <div key={category} className="flex items-center justify-between">
// //                 <span className="text-gray-700 text-sm sm:text-base capitalize truncate pr-2">{category || 'Uncategorized'}</span>
// //                 <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
// //                   <div className="w-16 sm:w-20 lg:w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className="bg-blue-500 h-2 rounded-full" 
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-6 sm:w-8 text-right text-sm">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(categoryBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">No categories yet</p>
// //             )}
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-lg shadow p-4 sm:p-6">
// //           <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Products by Status</h3>
// //           <div className="space-y-2 sm:space-y-3">
// //             {Object.entries(statusBreakdown).map(([status, count]) => (
// //               <div key={status} className="flex items-center justify-between">
// //                 <span className="text-gray-700 text-sm sm:text-base capitalize truncate pr-2">{status}</span>
// //                 <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
// //                   <div className="w-16 sm:w-20 lg:w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className={`h-2 rounded-full ${
// //                         status === 'active' ? 'bg-green-500' : 
// //                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
// //                       }`}
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-6 sm:w-8 text-right text-sm">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(statusBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">No products yet</p>
// //             )}
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-lg shadow p-4 sm:p-6">
// //           <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Products by Vendor</h3>
// //           <div className="space-y-2 sm:space-y-3">
// //             {Object.entries(vendorBreakdown).map(([vendor, count]) => (
// //               <div key={vendor} className="flex items-center justify-between">
// //                 <span className="text-gray-700 text-sm sm:text-base capitalize truncate pr-2">{vendor}</span>
// //                 <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
// //                   <div className="w-16 sm:w-20 lg:w-24 bg-gray-200 rounded-full h-2">
// //                     <div 
// //                       className="bg-purple-500 h-2 rounded-full" 
// //                       style={{ width: `${(count / products.length) * 100}%` }}
// //                     />
// //                   </div>
// //                   <span className="font-semibold text-gray-900 w-6 sm:w-8 text-right text-sm">{count}</span>
// //                 </div>
// //               </div>
// //             ))}
// //             {Object.keys(vendorBreakdown).length === 0 && (
// //               <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">No vendors yet</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Products */}
// //       <div className="bg-white rounded-lg shadow p-4 sm:p-6">
// //         <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Recent Products</h3>
// //         <div className="space-y-2">
// //           {products.slice(0, 5).map(product => (
// //             <div key={getProductId(product)} className="flex justify-between items-center p-2 sm:p-3 border rounded hover:bg-gray-50">
// //               <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
// //                 <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
// //                   {product.images && product.images.length > 0 ? (
// //                     <img src={product.images[0].preview} alt={product.title} className="w-full h-full object-cover" />
// //                   ) : (
// //                     <Package size={14} className="sm:w-4 sm:h-4 text-gray-400" />
// //                   )}
// //                 </div>
// //                 <div className="min-w-0 flex-1">
// //                   <p className="font-semibold text-sm sm:text-base truncate">{product.title || 'Untitled Product'}</p>
// //                   <p className="text-xs sm:text-sm text-gray-500 truncate">SKU: {product.sku} | Vendor: {product.vendorId || 'default'}</p>
// //                 </div>
// //               </div>
// //               <div className="text-right flex-shrink-0 ml-2">
// //                 <p className="font-bold text-green-600 text-sm sm:text-base">${product.price || '0.00'}</p>
// //                 <p className="text-xs sm:text-sm text-gray-500">Stock: {product.quantity || 0}</p>
// //                 <span className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold ${
// //                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                 }`}>
// //                   {product.fulfillment || 'FBM'}
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //           {products.length === 0 && (
// //             <div className="text-center py-8 sm:py-12">
// //               <Package size={48} className="mx-auto text-gray-300 mb-3 sm:mb-4" />
// //               <p className="text-gray-500 text-base sm:text-lg mb-2">No products yet</p>
// //               <p className="text-gray-400 text-sm sm:text-base">Create your first product to get started!</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Alerts Section */}
// //       {(stats.outOfStock > 0 || stats.lowStock > 0) && (
// //         <div className="bg-white rounded-lg shadow p-4 sm:p-6">
// //           <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
// //             <AlertTriangle className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
// //             Inventory Alerts
// //           </h3>
// //           <div className="space-y-2 sm:space-y-3">
// //             {stats.outOfStock > 0 && (
// //               <div className="bg-red-50 border border-red-200 rounded p-3 sm:p-4">
// //                 <p className="font-semibold text-red-800 text-sm sm:text-base">{stats.outOfStock} product(s) out of stock</p>
// //                 <p className="text-xs sm:text-sm text-red-600 mt-1">Review and restock these items immediately</p>
// //               </div>
// //             )}
// //             {stats.lowStock > 0 && (
// //               <div className="bg-orange-50 border border-orange-200 rounded p-3 sm:p-4">
// //                 <p className="font-semibold text-orange-800 text-sm sm:text-base">{stats.lowStock} product(s) running low (less than 10 units)</p>
// //                 <p className="text-xs sm:text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // Product List Component - Fully Responsive
// // function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
// //   const getProductId = (product) => {
// //     return product._id || product.id;
// //   };
  
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;

// //   const filteredProducts = products.filter(p => {
// //     const matchesSearch = !filters.search || 
// //       (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.sku && p.sku.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.productId && p.productId.toLowerCase().includes(filters.search.toLowerCase())) ||
// //       (p.vendorId && p.vendorId.toLowerCase().includes(filters.search.toLowerCase()));
    
// //     const matchesStatus = filters.status === 'all' || p.status === filters.status;
// //     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
// //     return matchesSearch && matchesStatus && matchesFulfillment;
// //   });

// //   const handleSelectAll = (e) => {
// //     if (e.target.checked) {
// //       setSelectedProducts(filteredProducts.map(p => getProductId(p)));
// //     } else {
// //       setSelectedProducts([]);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
// //       try {
// //         await API.bulkDelete(selectedProducts);
// //         setSelectedProducts([]);
// //         onRefresh();
// //       } catch (error) {
// //         alert('Error deleting products: ' + error.message);
// //       }
// //     }
// //   };

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

// //   const handleDeleteProduct = async (id) => {
// //     if (window.confirm('Delete this product?')) {
// //       try {
// //         await API.deleteProduct(id);
// //         onRefresh();
// //       } catch (error) {
// //         alert('Error deleting product: ' + error.message);
// //       }
// //     }
// //   };

// //   const handleEditProduct = (product) => {
// //     alert(`Editing product: ${product.title} (ID: ${getProductId(product)})`);
// //   };

// //   return (
// //     <div className="space-y-3 sm:space-y-4">
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
// //         <h2 className="text-2xl sm:text-3xl font-bold">All Products ({products.length})</h2>
// //         <div className="flex gap-2 w-full sm:w-auto">
// //           <button onClick={onRefresh} className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base flex-1 sm:flex-none">
// //             Refresh
// //           </button>
// //         </div>
// //       </div>

// //       {/* Filters - Responsive */}
// //       <div className="bg-white rounded-lg shadow p-3 sm:p-4">
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
// //           <div className="relative sm:col-span-2 lg:col-span-1">
// //             <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
// //             <input
// //               type="text"
// //               placeholder="Search by Name, SKU, Product ID, Vendor..."
// //               value={filters.search}
// //               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
// //               className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border rounded text-sm sm:text-base"
// //             />
// //           </div>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="px-3 sm:px-4 py-2 border rounded text-sm sm:text-base"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //             <option value="outofstock">Out of Stock</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="px-3 sm:px-4 py-2 border rounded text-sm sm:text-base"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA</option>
// //             <option value="FBM">FBM</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Bulk Actions */}
// //       {selectedProducts.length > 0 && (
// //         <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
// //           <span className="font-semibold text-sm sm:text-base">{selectedProducts.length} products selected</span>
// //           <button onClick={handleBulkDelete} className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base w-full sm:w-auto">
// //             Delete Selected
// //           </button>
// //         </div>
// //       )}

// //       {/* Products Table - Responsive */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full min-w-full">
// //             <thead className="bg-gray-50 border-b">
// //               <tr>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left">
// //                   <input
// //                     type="checkbox"
// //                     onChange={handleSelectAll}
// //                     checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
// //                     className="w-4 h-4"
// //                   />
// //                 </th>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">SKU</th>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Vendor</th>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Qty</th>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fulfillment</th>
// //                 <th className="p-2 sm:p-3 lg:p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {currentProducts.map(product => (
// //                 <tr key={getProductId(product)} className="border-b hover:bg-gray-50">
// //                   <td className="p-2 sm:p-3 lg:p-4">
// //                     <input
// //                       type="checkbox"
// //                       checked={selectedProducts.includes(getProductId(product))}
// //                       onChange={(e) => {
// //                         const productId = getProductId(product);
// //                         if (e.target.checked) {
// //                           setSelectedProducts([...selectedProducts, productId]);
// //                         } else {
// //                           setSelectedProducts(selectedProducts.filter(id => id !== productId));
// //                         }
// //                       }}
// //                       className="w-4 h-4"
// //                     />
// //                   </td>
// //                   <td className="p-2 sm:p-3 lg:p-4">
// //                     <div className="flex items-center gap-2 sm:gap-3">
// //                       <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
// //                         {product.images && product.images.length > 0 ? (
// //                           <img src={product.images[0].preview} alt={product.title} className="w-full h-full object-cover" />
// //                         ) : (
// //                           <Package size={14} className="sm:w-4 sm:h-4 text-gray-400" />
// //                         )}
// //                       </div>
// //                       <div className="min-w-0 flex-1">
// //                         <p className="font-semibold text-sm sm:text-base truncate">{product.title || 'Untitled Product'}</p>
// //                         <p className="text-xs text-gray-500 truncate sm:hidden">SKU: {product.sku}</p>
// //                         <p className="text-xs text-gray-500 truncate hidden sm:block lg:hidden">Vendor: {product.vendorId || 'default'}</p>
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="p-2 sm:p-3 lg:p-4 font-mono text-sm hidden sm:table-cell">{product.sku}</td>
// //                   <td className="p-2 sm:p-3 lg:p-4 hidden lg:table-cell">
// //                     <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
// //                       {product.vendorId || 'default'}
// //                     </span>
// //                   </td>
// //                   <td className="p-2 sm:p-3 lg:p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.status === 'active' ? 'bg-green-100 text-green-800' :
// //                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
// //                       'bg-red-100 text-red-800'
// //                     }`}>
// //                       {(product.status || 'inactive')?.toUpperCase()}
// //                     </span>
// //                   </td>
// //                   <td className="p-2 sm:p-3 lg:p-4 font-semibold text-sm sm:text-base">${product.price || '0.00'}</td>
// //                   <td className="p-2 sm:p-3 lg:p-4 hidden md:table-cell">
// //                     <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold text-sm sm:text-base' : 'text-sm sm:text-base'}>
// //                       {product.quantity || 0}
// //                     </span>
// //                   </td>
// //                   <td className="p-2 sm:p-3 lg:p-4 hidden sm:table-cell">
// //                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
// //                     }`}>
// //                       {product.fulfillment || 'FBM'}
// //                     </span>
// //                   </td>
// //                   <td className="p-2 sm:p-3 lg:p-4">
// //                     <div className="flex gap-1 sm:gap-2">
// //                       <button 
// //                         onClick={() => handleEditProduct(product)}
// //                         className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded text-sm"
// //                       >
// //                         <Edit size={14} className="sm:w-4 sm:h-4" />
// //                       </button>
// //                       <button
// //                         onClick={() => handleDeleteProduct(getProductId(product))}
// //                         className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded text-sm"
// //                       >
// //                         <Trash2 size={14} className="sm:w-4 sm:h-4" />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Pagination - Responsive */}
// //         {filteredProducts.length > 0 && (
// //           <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 border-t bg-gray-50 gap-3 sm:gap-0">
// //             <p className="text-xs sm:text-sm text-gray-600">
// //               Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
// //             </p>

// //             <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
// //               <button
// //                 disabled={currentPage === 1}
// //                 onClick={() => setCurrentPage(prev => prev - 1)}
// //                 className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm ${
// //                   currentPage === 1
// //                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// //                     : "bg-white hover:bg-gray-100"
// //                 }`}
// //               >
// //                 Previous
// //               </button>

// //               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
// //                 <button
// //                   key={page}
// //                   onClick={() => setCurrentPage(page)}
// //                   className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm ${
// //                     currentPage === page
// //                       ? "bg-blue-500 text-white"
// //                       : "bg-white hover:bg-gray-100"
// //                   }`}
// //                 >
// //                   {page}
// //                 </button>
// //               ))}

// //               <button
// //                 disabled={currentPage === totalPages}
// //                 onClick={() => setCurrentPage(prev => prev + 1)}
// //                 className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm ${
// //                   currentPage === totalPages
// //                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// //                     : "bg-white hover:bg-gray-100"
// //                 }`}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {filteredProducts.length === 0 && (
// //           <div className="p-8 sm:p-12 text-center text-gray-500">
// //             <Filter size={32} className="sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
// //             <p className="text-base sm:text-lg font-semibold">No products match your filters.</p>
// //             <p className="text-sm sm:text-base">Try adjusting your search or filter selections.</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }






// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Search, Plus, Upload, Download, Filter, Package, AlertTriangle, 
// //   TrendingUp, Edit, Trash2, BarChart3, User, Menu, X, Eye,
// //   ShoppingCart, DollarSign, Percent, Crown, Award, Truck,
// //   Warehouse, Star, ChevronDown, ChevronUp, Grid, List,
// //   Image, Layers, Box, Package2, Barcode, QrCode, Zap,
// //   Target, Calendar, Users, PieChart, ArrowUpDown, RotateCcw,Settings,
// // } from 'lucide-react';

// // // Enhanced API Configuration with Amazon features
// // const API_BASE_URL = 'http://localhost:8000/api';

// // const API = {
// //   STORAGE_KEY: "amazon-products-data",

// //   async makeRequest(endpoint, options = {}) {
// //     try {
// //       const url = `${API_BASE_URL}${endpoint}`;
// //       const response = await fetch(url, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           ...options.headers,
// //         },
// //         ...options,
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('API request failed:', error);
// //       throw error;
// //     }
// //   },

// //   // Enhanced product methods with Amazon data
// //   getProducts: async () => {
// //     try {
// //       const data = await API.makeRequest('/products');
// //       return data.products || data || [];
// //     } catch (error) {
// //       return API.getFromStorage();
// //     }
// //   },


// //   // Amazon-style product creation
// //   createProduct: async (product) => {
// //     const productData = {
// //       ...product,
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //       // Amazon-specific fields
// //       asin: product.asin || `B0${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
// //       amazonStatus: 'draft',
// //       buyBox: Math.random() > 0.7,
// //       buyBoxPercentage: Math.floor(Math.random() * 100),
// //       salesRank: Math.floor(Math.random() * 10000),
// //       reviews: Math.floor(Math.random() * 1000),
// //       rating: (Math.random() * 2 + 3).toFixed(1),
// //       totalSales: Math.floor(Math.random() * 1000),
// //       revenue: Math.floor(Math.random() * 10000),
// //       conversionRate: (Math.random() * 5).toFixed(1),
// //       pageViews: Math.floor(Math.random() * 5000),
// //       featuredMerchant: Math.random() > 0.5,
// //       // Competition data
// //       lowestCompetitorPrice: (parseFloat(product.price) * (0.8 + Math.random() * 0.4)).toFixed(2),
// //       buyBoxCompetitor: Math.random() > 0.5 ? 'Competitor Inc' : '',
// //       // Performance metrics
// //       customerReturns: Math.floor(Math.random() * 10),
// //       negativeFeedback: Math.floor(Math.random() * 5),
// //       orderDefectRate: (Math.random() * 2).toFixed(1)
// //     };

// //     try {
// //       const data = await API.makeRequest('/products', {
// //         method: 'POST',
// //         body: JSON.stringify(productData),
// //       });
// //       return data.product;
// //     } catch (error) {
// //       const localProduct = {
// //         ...productData,
// //         id: Date.now().toString(),
// //       };
// //       const products = await API.getFromStorage();
// //       products.push(localProduct);
// //       await API.saveToStorage(products);
// //       return localProduct;
// //     }
// //   },

// //   // Enhanced analytics
// //   getProductAnalytics: async () => {
// //     try {
// //       const data = await API.makeRequest('/products/analytics');
// //       return data;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       return {
// //         totalSales: products.reduce((sum, p) => sum + (p.totalSales || 0), 0),
// //         totalRevenue: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
// //         conversionRate: 3.2,
// //         buyBoxPercentage: 67.8,
// //         activeListings: products.filter(p => p.status === 'active').length,
// //         outOfStock: products.filter(p => p.quantity === 0).length,
// //         lowStockCount: products.filter(p => p.quantity < 10).length,
// //         featuredMerchantPercentage: 45.2
// //       };
// //     }
// //   },

// //   // Existing methods
// //   updateProduct: async (id, updates) => {
// //     try {
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'PUT',
// //         body: JSON.stringify(updates),
// //       });
// //       return data.product;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const index = products.findIndex(p => p.id === id);
// //       if (index !== -1) {
// //         products[index] = { ...products[index], ...updates };
// //         await API.saveToStorage(products);
// //         return products[index];
// //       }
// //       throw new Error("Product not found");
// //     }
// //   },

// //   deleteProduct: async (id) => {
// //     try {
// //       await API.makeRequest(`/products/${id}`, { method: 'DELETE' });
// //       return true;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter(p => p.id !== id);
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   },

// //   bulkDelete: async (productIds) => {
// //     try {
// //       await API.makeRequest('/products/bulk-delete', {
// //         method: 'POST',
// //         body: JSON.stringify({ productIds }),
// //       });
// //       return true;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter(p => !productIds.includes(p.id));
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   },

// //   getFromStorage: async () => {
// //     const data = localStorage.getItem(API.STORAGE_KEY);
// //     return data ? JSON.parse(data) : [];
// //   },

// //   saveToStorage: async (products) => {
// //     localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
// //     return products;
// //   }
// // };

// // // Enhanced StatCard with Amazon styling
// // function StatCard({ title, value, subtitle, icon, color, trend }) {
// //   return (
// //     <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-sm transition-shadow">
// //       <div className="flex items-center justify-between">
// //         <div className="flex-1 min-w-0">
// //           <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
// //           <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{value}</p>
// //           {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
// //           {trend && (
// //             <div className={`flex items-center mt-2 text-xs ${
// //               trend > 0 ? 'text-green-600' : 'text-red-600'
// //             }`}>
// //               <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
// //               <span className="ml-1">{Math.abs(trend)}%</span>
// //             </div>
// //           )}
// //         </div>
// //         <div className={`${color} text-white p-3 rounded-lg flex-shrink-0 ml-4`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Amazon Performance Badge
// // function PerformanceBadge({ type, value }) {
// //   const getConfig = (type, value) => {
// //     const configs = {
// //       buyBox: {
// //         excellent: { color: 'bg-green-100 text-green-800', label: 'Buy Box Winning', icon: <Crown size={12} /> },
// //         good: { color: 'bg-blue-100 text-blue-800', label: 'Buy Box Eligible', icon: <Award size={12} /> },
// //         poor: { color: 'bg-yellow-100 text-yellow-800', label: 'Buy Box Losing', icon: <TrendingUp size={12} /> }
// //       },
// //       inventory: {
// //         excellent: { color: 'bg-green-100 text-green-800', label: 'In Stock', icon: <Package size={12} /> },
// //         warning: { color: 'bg-orange-100 text-orange-800', label: 'Low Stock', icon: <AlertTriangle size={12} /> },
// //         critical: { color: 'bg-red-100 text-red-800', label: 'Out of Stock', icon: <AlertTriangle size={12} /> }
// //       },
// //       rating: {
// //         excellent: { color: 'bg-green-100 text-green-800', label: 'High Rating', icon: <Star size={12} /> },
// //         good: { color: 'bg-blue-100 text-blue-800', label: 'Good Rating', icon: <Star size={12} /> },
// //         poor: { color: 'bg-yellow-100 text-yellow-800', label: 'Needs Improvement', icon: <Star size={12} /> }
// //       }
// //     };

// //     if (type === 'buyBox') {
// //       return value > 70 ? configs.buyBox.excellent : 
// //              value > 30 ? configs.buyBox.good : configs.buyBox.poor;
// //     }
    
// //     if (type === 'inventory') {
// //       return value > 20 ? configs.inventory.excellent :
// //              value > 0 ? configs.inventory.warning : configs.inventory.critical;
// //     }
    
// //     return configs.rating.good;
// //   };

// //   const config = getConfig(type, value);

// //   return (
// //     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
// //       {config.icon && React.cloneElement(config.icon, { className: "mr-1", size: 10 })}
// //       {config.label}
// //     </span>
// //   );
// // }

// // // Enhanced Create Product with Amazon-specific fields
// // function CreateProduct({ onSuccess }) {
// //   const initialProductState = {
// //     title: '',
// //     sku: '',
// //     asin: '',
// //     brand: '',
// //     price: '',
// //     quantity: '',
// //     category: '',
// //     status: 'draft',
// //     fulfillment: 'FBM',
// //     description: '',
// //     bulletPoints: ['', '', '', '', ''],
// //     keywords: '',
// //     mainImage: '',
// //     additionalImages: [],
// //     weight: '',
// //     dimensions: { length: '', width: '', height: '' },
// //     packageDimensions: { length: '', width: '', height: '' },
// //     packageWeight: '',
// //     hazardous: false,
// //     adultProduct: false,
// //     condition: 'New',
// //     conditionNote: '',
// //     taxCode: 'A_GEN_TAX',
// //     productType: '',
// //     variationTheme: '',
// //     parentChild: '',
// //     parentSku: '',
// //     relationshipType: '',
// //   };

// //   const [product, setProduct] = useState(initialProductState);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [activeTab, setActiveTab] = useState('basic');

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setProduct(prev => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value,
// //     }));
// //   };

// //   const handleBulletPointChange = (index, value) => {
// //     const newBulletPoints = [...product.bulletPoints];
// //     newBulletPoints[index] = value;
// //     setProduct(prev => ({ ...prev, bulletPoints: newBulletPoints }));
// //   };

// //   const handleDimensionChange = (type, field, value) => {
// //     setProduct(prev => ({
// //       ...prev,
// //       [type]: {
// //         ...prev[type],
// //         [field]: value
// //       }
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);
// //     setError(null);

// //     if (!product.title || !product.sku || !product.price) {
// //       setError("Title, SKU, and Price are required.");
// //       setIsSubmitting(false);
// //       return;
// //     }

// //     try {
// //       await API.createProduct(product);
// //       setProduct(initialProductState);
// //       onSuccess();
// //     } catch (err) {
// //       setError(`Failed to create product: ${err.message}`);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const tabs = [
// //     { id: 'basic', name: 'Basic Info', icon: <Package size={16} /> },
// //     { id: 'offer', name: 'Offer', icon: <DollarSign size={16} /> },
// //      { id: 'images', name: 'Images', icon: <Image size={16} /> },
// //     { id: 'shipping', name: 'Shipping', icon: <Truck size={16} /> },
// //     { id: 'advanced', name: 'Advanced', icon: <Settings size={16} /> },
// //   ];

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-2xl sm:text-3xl font-bold">Add a Product</h2>
// //         <div className="flex space-x-2">
// //           <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
// //             Save as Draft
// //           </button>
// //           <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
// //             Preview Listing
// //           </button>
// //         </div>
// //       </div>

// //       {/* Progress Steps */}
// //       <div className="bg-white rounded-lg border border-gray-200 p-6">
// //         <div className="flex items-center justify-between mb-6">
// //           {tabs.map((tab, index) => (
// //             <div key={tab.id} className="flex items-center">
// //               <button
// //                 onClick={() => setActiveTab(tab.id)}
// //                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
// //                   activeTab === tab.id 
// //                     ? 'bg-orange-100 text-orange-700 border border-orange-200' 
// //                     : 'text-gray-500 hover:text-gray-700'
// //                 }`}
// //               >
// //                 <span>{tab.icon}</span>
// //                 <span className="hidden sm:inline">{tab.name}</span>
// //               </button>
// //               {index < tabs.length - 1 && (
// //                 <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
// //               )}
// //             </div>
// //           ))}
// //         </div>

// //         <form onSubmit={handleSubmit}>
// //           {error && (
// //             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
// //               <div className="flex items-center">
// //                 <AlertTriangle className="text-red-400 mr-2" size={20} />
// //                 <p className="text-red-800 text-sm">{error}</p>
// //               </div>
// //             </div>
// //           )}

// //           {/* Basic Information Tab */}
// //           {activeTab === 'basic' && (
// //             <div className="space-y-6">
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Product Title *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="title"
// //                     value={product.title}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="Enter product title as it appears on Amazon"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Brand *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="brand"
// //                     value={product.brand}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="Brand name"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     SKU (Stock Keeping Unit) *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="sku"
// //                     value={product.sku}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="Unique SKU"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     ASIN (Amazon Standard Identification Number)
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="asin"
// //                     value={product.asin}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="B0XXXXXXXXX"
// //                   />
// //                 </div>

// //                 <div className="lg:col-span-2">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Product Description
// //                   </label>
// //                   <textarea
// //                     name="description"
// //                     value={product.description}
// //                     onChange={handleChange}
// //                     rows="4"
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="Detailed product description"
// //                   />
// //                 </div>

// //                 <div className="lg:col-span-2">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Key Product Features (Bullet Points)
// //                   </label>
// //                   <div className="space-y-2">
// //                     {product.bulletPoints.map((point, index) => (
// //                       <input
// //                         key={index}
// //                         type="text"
// //                         value={point}
// //                         onChange={(e) => handleBulletPointChange(index, e.target.value)}
// //                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                         placeholder={`Feature ${index + 1}`}
// //                       />
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Offer Tab */}
// //           {activeTab === 'offer' && (
// //             <div className="space-y-6">
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Your Price *
// //                   </label>
// //                   <div className="relative">
// //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                       <DollarSign className="text-gray-400" size={16} />
// //                     </div>
// //                     <input
// //                       type="number"
// //                       name="price"
// //                       value={product.price}
// //                       onChange={handleChange}
// //                       min="0.01"
// //                       step="0.01"
// //                       className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Quantity *
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="quantity"
// //                     value={product.quantity}
// //                     onChange={handleChange}
// //                     min="0"
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Condition
// //                   </label>
// //                   <select
// //                     name="condition"
// //                     value={product.condition}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                   >
// //                     <option value="New">New</option>
// //                     <option value="Refurbished">Refurbished</option>
// //                     <option value="UsedLikeNew">Used - Like New</option>
// //                     <option value="UsedVeryGood">Used - Very Good</option>
// //                     <option value="UsedGood">Used - Good</option>
// //                     <option value="UsedAcceptable">Used - Acceptable</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="border-t pt-6">
// //                 <h3 className="text-lg font-medium text-gray-900 mb-4">Fulfillment Options</h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <label className="relative flex cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none">
// //                     <input
// //                       type="radio"
// //                       name="fulfillment"
// //                       value="FBM"
// //                       checked={product.fulfillment === 'FBM'}
// //                       onChange={handleChange}
// //                       className="sr-only"
// //                     />
// //                     <div className="flex w-full items-center justify-between">
// //                       <div className="flex items-center">
// //                         <div className="text-sm">
// //                           <p className="font-medium text-gray-900">Fulfilled by Merchant (FBM)</p>
// //                           <p className="text-gray-500">You store and ship products yourself</p>
// //                         </div>
// //                       </div>
// //                       <div className={`h-4 w-4 rounded-full border-2 ${
// //                         product.fulfillment === 'FBM' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
// //                       }`}></div>
// //                     </div>
// //                   </label>

// //                   <label className="relative flex cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none">
// //                     <input
// //                       type="radio"
// //                       name="fulfillment"
// //                       value="FBA"
// //                       checked={product.fulfillment === 'FBA'}
// //                       onChange={handleChange}
// //                       className="sr-only"
// //                     />
// //                     <div className="flex w-full items-center justify-between">
// //                       <div className="flex items-center">
// //                         <div className="text-sm">
// //                           <p className="font-medium text-gray-900">Fulfilled by Amazon (FBA)</p>
// //                           <p className="text-gray-500">Amazon stores and ships your products</p>
// //                         </div>
// //                       </div>
// //                       <div className={`h-4 w-4 rounded-full border-2 ${
// //                         product.fulfillment === 'FBA' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
// //                       }`}></div>
// //                     </div>
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Continue with other tabs... */}

// //           <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
// //             <button
// //               type="button"
// //               className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               disabled={isSubmitting}
// //               className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
// //             >
// //               <Plus size={16} />
// //               <span>{isSubmitting ? 'Creating...' : 'Save and Continue'}</span>
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // // Enhanced Dashboard with Amazon Analytics
// // function Dashboard({ stats, products, analytics }) {
// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-2xl sm:text-3xl font-bold">Seller Central Dashboard</h2>
// //         <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
// //           <option value="7d">Last 7 days</option>
// //           <option value="30d">Last 30 days</option>
// //           <option value="90d">Last 90 days</option>
// //         </select>
// //       </div>

// //       {/* Key Metrics */}
// //       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //         <StatCard
// //           title="Total Sales"
// //           value={analytics.totalSales?.toLocaleString() || '0'}
// //           subtitle="Units sold"
// //           icon={<ShoppingCart size={24} />}
// //           color="bg-blue-500"
// //           trend={12.5}
// //         />
// //         <StatCard
// //           title="Total Revenue"
// //           value={`$${(analytics.totalRevenue || 0).toLocaleString()}`}
// //           subtitle="Gross revenue"
// //           icon={<DollarSign size={24} />}
// //           color="bg-green-500"
// //           trend={8.2}
// //         />
// //         <StatCard
// //           title="Buy Box %"
// //           value={`${analytics.buyBoxPercentage || '0'}%`}
// //           subtitle="Win rate"
// //           icon={<Crown size={24} />}
// //           color="bg-purple-500"
// //           trend={-1.5}
// //         />
// //         <StatCard
// //           title="Active Listings"
// //           value={analytics.activeListings?.toString() || '0'}
// //           subtitle="Live products"
// //           icon={<Package size={24} />}
// //           color="bg-orange-500"
// //         />
// //       </div>

// //       {/* Enhanced Product Table */}
// //       <div className="bg-white rounded-lg border border-gray-200">
// //         <div className="p-6 border-b border-gray-200">
// //           <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
// //         </div>
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASIN</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Box</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rank</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {products.slice(0, 10).map(product => (
// //                 <tr key={product.id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="flex items-center">
// //                       <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
// //                         <Package size={20} className="text-orange-600" />
// //                       </div>
// //                       <div className="ml-4">
// //                         <div className="text-sm font-medium text-gray-900">{product.title}</div>
// //                         <div className="text-sm text-gray-500">SKU: {product.sku}</div>
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
// //                     {product.asin}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
// //                     ${product.price}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <PerformanceBadge type="buyBox" value={product.buyBoxPercentage} />
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                     {product.salesRank?.toLocaleString() || 'N/A'}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="flex items-center">
// //                       <Star size={14} className="text-yellow-400 fill-current" />
// //                       <span className="ml-1 text-sm text-gray-900">{product.rating}</span>
// //                       <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <PerformanceBadge type="inventory" value={product.quantity} />
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Enhanced Product List with Amazon features
// // function ProductList({ products, onRefresh, onEdit }) {
// //   const [viewMode, setViewMode] = useState('grid');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filters, setFilters] = useState({
// //     status: 'all',
// //     fulfillment: 'all',
// //     buyBox: 'all'
// //   });

// //   const filteredProducts = products.filter(product => {
// //     const matchesSearch = !searchTerm || 
// //       product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       product.asin?.toLowerCase().includes(searchTerm.toLowerCase());

// //     const matchesFilters = 
// //       (filters.status === 'all' || product.status === filters.status) &&
// //       (filters.fulfillment === 'all' || product.fulfillment === filters.fulfillment) &&
// //       (filters.buyBox === 'all' || 
// //        (filters.buyBox === 'winning' && product.buyBox) ||
// //        (filters.buyBox === 'losing' && !product.buyBox));

// //     return matchesSearch && matchesFilters;
// //   });

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h2 className="text-2xl sm:text-3xl font-bold">Manage Inventory</h2>
// //           <p className="text-gray-600 text-sm mt-1">
// //             {products.length} products • {products.filter(p => p.status === 'active').length} active
// //           </p>
// //         </div>
        
// //         <div className="flex items-center space-x-3">
// //           <div className="flex border border-gray-300 rounded-lg">
// //             <button
// //               onClick={() => setViewMode('grid')}
// //               className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
// //             >
// //               <Grid size={16} />
// //             </button>
// //             <button
// //               onClick={() => setViewMode('list')}
// //               className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
// //             >
// //               <List size={16} />
// //             </button>
// //           </div>
          
// //           <button
// //             onClick={onRefresh}
// //             className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
// //           >
// //             <RotateCcw size={16} />
// //             <span>Refresh</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Enhanced Filters */}
// //       <div className="bg-white rounded-lg border border-gray-200 p-4">
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
// //           <div className="lg:col-span-2">
// //             <div className="relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
// //               <input
// //                 type="text"
// //                 placeholder="Search by title, SKU, or ASIN..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //               />
// //             </div>
// //           </div>
          
// //           <select
// //             value={filters.buyBox}
// //             onChange={(e) => setFilters({ ...filters, buyBox: e.target.value })}
// //             className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //           >
// //             <option value="all">All Buy Box</option>
// //             <option value="winning">Buy Box Winning</option>
// //             <option value="losing">Buy Box Losing</option>
// //           </select>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA Only</option>
// //             <option value="FBM">FBM Only</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Enhanced Product Table */}
// //       <div className="bg-white rounded-lg border border-gray-200">
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASIN/SKU</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Box</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rank</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {filteredProducts.map(product => (
// //                 <tr key={product.id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4">
// //                     <div className="flex items-center">
// //                       <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
// //                         <Package size={20} className="text-orange-600" />
// //                       </div>
// //                       <div className="ml-4">
// //                         <div className="text-sm font-medium text-gray-900">{product.title}</div>
// //                         <div className="text-sm text-gray-500">{product.brand}</div>
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4">
// //                     <div className="text-sm text-gray-900 font-mono">{product.asin}</div>
// //                     <div className="text-sm text-gray-500">SKU: {product.sku}</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
// //                     ${product.price}
// //                   </td>
// //                   <td className="px-6 py-4">
// //                     <PerformanceBadge type="buyBox" value={product.buyBoxPercentage} />
// //                     <div className="text-xs text-gray-500 mt-1">{product.buyBoxPercentage}%</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                     {product.salesRank?.toLocaleString() || 'N/A'}
// //                   </td>
// //                   <td className="px-6 py-4">
// //                     <div className="flex items-center">
// //                       <Star size={14} className="text-yellow-400 fill-current" />
// //                       <span className="ml-1 text-sm text-gray-900">{product.rating}</span>
// //                       <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className={`text-sm font-semibold ${
// //                       product.quantity < 10 ? 'text-red-600' : 'text-gray-900'
// //                     }`}>
// //                       {product.quantity}
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <PerformanceBadge type="inventory" value={product.quantity} />
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                     <div className="flex space-x-2">
// //                       <button
// //                         onClick={() => onEdit(product)}
// //                         className="text-blue-600 hover:text-blue-900"
// //                       >
// //                         Edit
// //                       </button>
// //                       <button className="text-red-600 hover:text-red-900">
// //                         Delete
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Main App Component
// // export default function AmazonSellerCentral() {
// //   const [currentView, setCurrentView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [analytics, setAnalytics] = useState({});
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const loadData = async () => {
// //     setLoading(true);
// //     try {
// //       const [productsData, analyticsData] = await Promise.all([
// //         API.getProducts(),
// //         API.getProductAnalytics()
// //       ]);
// //       setProducts(productsData);
// //       setAnalytics(analyticsData);
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading Amazon Seller Central...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16">
// //             <div className="flex items-center">
// //               <div className="flex items-center space-x-3">
// //                 <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded flex items-center justify-center">
// //                   <ShoppingCart className="text-white" size={16} />
// //                 </div>
// //                 <span className="text-xl font-bold text-gray-900">Seller Central</span>
// //               </div>
              
// //               <nav className="hidden md:ml-8 md:flex space-x-8">
// //                 {['dashboard', 'inventory', 'pricing', 'orders', 'advertising', 'reports'].map((item) => (
// //                   <button
// //                     key={item}
// //                     onClick={() => setCurrentView(item)}
// //                     className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
// //                       currentView === item
// //                         ? 'text-orange-600 bg-orange-50'
// //                         : 'text-gray-500 hover:text-gray-700'
// //                     }`}
// //                   >
// //                     {item}
// //                   </button>
// //                 ))}
// //               </nav>
// //             </div>

// //             <div className="flex items-center space-x-4">
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
// //                 <input
// //                   type="text"
// //                   placeholder="Search products..."
// //                   className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {currentView === 'dashboard' && (
// //           <Dashboard stats={{}} products={products} analytics={analytics} />
// //         )}
        
// //         {currentView === 'inventory' && (
// //           <ProductList
// //             products={products}
// //             onRefresh={loadData}
// //             onEdit={(product) => {
// //               // Handle edit
// //               console.log('Edit product:', product);
// //             }}
// //           />
// //         )}
        
// //         {currentView === 'add-product' && (
// //           <CreateProduct onSuccess={() => {
// //             loadData();
// //             setCurrentView('inventory');
// //           }} />
// //         )}
// //       </main>

// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setCurrentView('add-product')}
// //         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
// //       >
// //         <Plus size={24} />
// //       </button>
// //     </div>
// //   );
// // }



// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Search, Plus, Upload, Download, Filter, Package, AlertTriangle, 
// //   TrendingUp, Edit, Trash2, BarChart3, User, Menu, X, Eye,
// //   ShoppingCart, DollarSign, Percent, Crown, Award, Truck,
// //   Warehouse, Star, ChevronDown, ChevronUp, Grid, List,
// //   Image, Layers, Box, Package2, Barcode, QrCode, Zap,
// //   Target, Calendar, Users, PieChart, ArrowUpDown, RotateCcw, Settings,
// // } from 'lucide-react';

// // // Enhanced API Configuration with Amazon features
// // const API_BASE_URL = 'http://localhost:8000/api';

// // const API = {
// //   STORAGE_KEY: "amazon-products-data",

// //   async makeRequest(endpoint, options = {}) {
// //     try {
// //       const url = `${API_BASE_URL}${endpoint}`;
// //       const response = await fetch(url, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           ...options.headers,
// //         },
// //         ...options,
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('API request failed:', error);
// //       throw error;
// //     }
// //   },

// //   // Enhanced product methods with Amazon data
// //   getProducts: async () => {
// //     try {
// //       const data = await API.makeRequest('/products');
// //       return data.products || data || [];
// //     } catch (error) {
// //       return API.getFromStorage();
// //     }
// //   },

// //   // Amazon-style product creation
// //   createProduct: async (product) => {
// //     const productData = {
// //       ...product,
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //       // Amazon-specific fields
// //       asin: product.asin || `B0${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
// //       amazonStatus: 'draft',
// //       buyBox: Math.random() > 0.7,
// //       buyBoxPercentage: Math.floor(Math.random() * 100),
// //       salesRank: Math.floor(Math.random() * 10000),
// //       reviews: Math.floor(Math.random() * 1000),
// //       rating: (Math.random() * 2 + 3).toFixed(1),
// //       totalSales: Math.floor(Math.random() * 1000),
// //       revenue: Math.floor(Math.random() * 10000),
// //       conversionRate: (Math.random() * 5).toFixed(1),
// //       pageViews: Math.floor(Math.random() * 5000),
// //       featuredMerchant: Math.random() > 0.5,
// //       // Competition data
// //       lowestCompetitorPrice: (parseFloat(product.price) * (0.8 + Math.random() * 0.4)).toFixed(2),
// //       buyBoxCompetitor: Math.random() > 0.5 ? 'Competitor Inc' : '',
// //       // Performance metrics
// //       customerReturns: Math.floor(Math.random() * 10),
// //       negativeFeedback: Math.floor(Math.random() * 5),
// //       orderDefectRate: (Math.random() * 2).toFixed(1)
// //     };

// //     try {
// //       const data = await API.makeRequest('/products', {
// //         method: 'POST',
// //         body: JSON.stringify(productData),
// //       });
// //       return data.product;
// //     } catch (error) {
// //       const localProduct = {
// //         ...productData,
// //         id: Date.now().toString(),
// //       };
// //       const products = await API.getFromStorage();
// //       products.push(localProduct);
// //       await API.saveToStorage(products);
// //       return localProduct;
// //     }
// //   },

// //   // Enhanced analytics
// //   getProductAnalytics: async () => {
// //     try {
// //       const data = await API.makeRequest('/products/analytics');
// //       return data;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       return {
// //         totalSales: products.reduce((sum, p) => sum + (p.totalSales || 0), 0),
// //         totalRevenue: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
// //         conversionRate: 3.2,
// //         buyBoxPercentage: 67.8,
// //         activeListings: products.filter(p => p.status === 'active').length,
// //         outOfStock: products.filter(p => p.quantity === 0).length,
// //         lowStockCount: products.filter(p => p.quantity < 10).length,
// //         featuredMerchantPercentage: 45.2
// //       };
// //     }
// //   },

// //   // Existing methods
// //   updateProduct: async (id, updates) => {
// //     try {
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'PUT',
// //         body: JSON.stringify(updates),
// //       });
// //       return data.product;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const index = products.findIndex(p => p.id === id);
// //       if (index !== -1) {
// //         products[index] = { ...products[index], ...updates };
// //         await API.saveToStorage(products);
// //         return products[index];
// //       }
// //       throw new Error("Product not found");
// //     }
// //   },

// //   deleteProduct: async (id) => {
// //     try {
// //       await API.makeRequest(`/products/${id}`, { method: 'DELETE' });
// //       return true;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter(p => p.id !== id);
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   },

// //   bulkDelete: async (productIds) => {
// //     try {
// //       await API.makeRequest('/products/bulk-delete', {
// //         method: 'POST',
// //         body: JSON.stringify({ productIds }),
// //       });
// //       return true;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter(p => !productIds.includes(p.id));
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   },

// //   getFromStorage: async () => {
// //     const data = localStorage.getItem(API.STORAGE_KEY);
// //     return data ? JSON.parse(data) : [];
// //   },

// //   saveToStorage: async (products) => {
// //     localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
// //     return products;
// //   }
// // };

// // // Enhanced StatCard with Amazon styling
// // function StatCard({ title, value, subtitle, icon, color, trend }) {
// //   return (
// //     <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-sm transition-shadow">
// //       <div className="flex items-center justify-between">
// //         <div className="flex-1 min-w-0">
// //           <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
// //           <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{value}</p>
// //           {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
// //           {trend && (
// //             <div className={`flex items-center mt-2 text-xs ${
// //               trend > 0 ? 'text-green-600' : 'text-red-600'
// //             }`}>
// //               <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
// //               <span className="ml-1">{Math.abs(trend)}%</span>
// //             </div>
// //           )}
// //         </div>
// //         <div className={`${color} text-white p-3 rounded-lg flex-shrink-0 ml-4`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Amazon Performance Badge
// // function PerformanceBadge({ type, value }) {
// //   const getConfig = (type, value) => {
// //     const configs = {
// //       buyBox: {
// //         excellent: { color: 'bg-green-100 text-green-800', label: 'Buy Box Winning', icon: <Crown size={12} /> },
// //         good: { color: 'bg-blue-100 text-blue-800', label: 'Buy Box Eligible', icon: <Award size={12} /> },
// //         poor: { color: 'bg-yellow-100 text-yellow-800', label: 'Buy Box Losing', icon: <TrendingUp size={12} /> }
// //       },
// //       inventory: {
// //         excellent: { color: 'bg-green-100 text-green-800', label: 'In Stock', icon: <Package size={12} /> },
// //         warning: { color: 'bg-orange-100 text-orange-800', label: 'Low Stock', icon: <AlertTriangle size={12} /> },
// //         critical: { color: 'bg-red-100 text-red-800', label: 'Out of Stock', icon: <AlertTriangle size={12} /> }
// //       },
// //       rating: {
// //         excellent: { color: 'bg-green-100 text-green-800', label: 'High Rating', icon: <Star size={12} /> },
// //         good: { color: 'bg-blue-100 text-blue-800', label: 'Good Rating', icon: <Star size={12} /> },
// //         poor: { color: 'bg-yellow-100 text-yellow-800', label: 'Needs Improvement', icon: <Star size={12} /> }
// //       }
// //     };

// //     if (type === 'buyBox') {
// //       return value > 70 ? configs.buyBox.excellent : 
// //              value > 30 ? configs.buyBox.good : configs.buyBox.poor;
// //     }
    
// //     if (type === 'inventory') {
// //       return value > 20 ? configs.inventory.excellent :
// //              value > 0 ? configs.inventory.warning : configs.inventory.critical;
// //     }
    
// //     return configs.rating.good;
// //   };

// //   const config = getConfig(type, value);

// //   return (
// //     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
// //       {config.icon && React.cloneElement(config.icon, { className: "mr-1", size: 10 })}
// //       {config.label}
// //     </span>
// //   );
// // }

// // // Enhanced Create Product with Amazon-specific fields
// // function CreateProduct({ onSuccess }) {
// //   const initialProductState = {
// //     title: '',
// //     sku: '',
// //     asin: '',
// //     brand: '',
// //     price: '',
// //     quantity: '',
// //     category: '',
// //     status: 'draft',
// //     fulfillment: 'FBM',
// //     description: '',
// //     bulletPoints: ['', '', '', '', ''],
// //     keywords: '',
// //     mainImage: '',
// //     additionalImages: [],
// //     weight: '',
// //     dimensions: { length: '', width: '', height: '' },
// //     packageDimensions: { length: '', width: '', height: '' },
// //     packageWeight: '',
// //     hazardous: false,
// //     adultProduct: false,
// //     condition: 'New',
// //     conditionNote: '',
// //     taxCode: 'A_GEN_TAX',
// //     productType: '',
// //     variationTheme: '',
// //     parentChild: '',
// //     parentSku: '',
// //     relationshipType: '',
// //   };

// //   const [product, setProduct] = useState(initialProductState);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [activeTab, setActiveTab] = useState('basic');

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setProduct(prev => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value,
// //     }));
// //   };

// //   const handleBulletPointChange = (index, value) => {
// //     const newBulletPoints = [...product.bulletPoints];
// //     newBulletPoints[index] = value;
// //     setProduct(prev => ({ ...prev, bulletPoints: newBulletPoints }));
// //   };

// //   const handleDimensionChange = (type, field, value) => {
// //     setProduct(prev => ({
// //       ...prev,
// //       [type]: {
// //         ...prev[type],
// //         [field]: value
// //       }
// //     }));
// //   };



// //   const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setIsSubmitting(true);
// //   setError(null);
// //   setSuccess(null);

// //   // Enhanced validation
// //   const validationErrors = [];

// //   // Required field validation
// //   if (!product.title?.trim()) {
// //     validationErrors.push("Product title is required");
// //   }
  
// //   if (!product.sku?.trim()) {
// //     validationErrors.push("SKU is required");
// //   }
  
// //   if (!product.price) {
// //     validationErrors.push("Price is required");
// //   }
  
// //   if (!product.brand?.trim()) {
// //     validationErrors.push("Brand is required");
// //   }
  
// //   if (!product.quantity && product.quantity !== 0) {
// //     validationErrors.push("Quantity is required");
// //   }

// //   // Advanced validation rules
// //   if (product.title?.length > 500) {
// //     validationErrors.push("Product title must be less than 500 characters");
// //   }

// //   if (product.sku?.length > 40) {
// //     validationErrors.push("SKU must be less than 40 characters");
// //   }

// //   if (product.price && (parseFloat(product.price) <= 0 || parseFloat(product.price) > 100000)) {
// //     validationErrors.push("Price must be between $0.01 and $100,000");
// //   }

// //   if (product.quantity && (parseInt(product.quantity) < 0 || parseInt(product.quantity) > 999999)) {
// //     validationErrors.push("Quantity must be between 0 and 999,999");
// //   }

// //   // ASIN validation (if provided)
// //   if (product.asin && !/^[A-Z0-9]{10}$/.test(product.asin)) {
// //     validationErrors.push("ASIN must be exactly 10 characters (letters and numbers)");
// //   }

// //   // Bullet points validation - at least one meaningful bullet point
// //   const meaningfulBulletPoints = product.bulletPoints.filter(point => 
// //     point && point.trim().length > 0
// //   );
// //   if (meaningfulBulletPoints.length === 0) {
// //     validationErrors.push("At least one key product feature is required");
// //   }

// //   // If there are validation errors, show them and stop submission
// //   if (validationErrors.length > 0) {
// //     setError(validationErrors.join(", "));
// //     setIsSubmitting(false);
// //     return;
// //   }

// //   try {
// //     // Prepare product data for submission
// //     const productData = {
// //       ...product,
// //       // Clean up data
// //       title: product.title.trim(),
// //       sku: product.sku.trim(),
// //       brand: product.brand.trim(),
// //       price: parseFloat(product.price).toFixed(2),
// //       quantity: parseInt(product.quantity),
// //       // Filter out empty bullet points
// //       bulletPoints: product.bulletPoints.filter(point => point && point.trim().length > 0),
// //       // Ensure proper data types
// //       asin: product.asin?.trim() || undefined,
// //       description: product.description?.trim() || '',
// //       // Add timestamps
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //     };

// //     console.log("Submitting product:", productData);

// //     // Create product via API
// //     const createdProduct = await API.createProduct(productData);
    
// //     // Success handling
// //     setSuccess(`Product "${createdProduct.title}" has been successfully created!`);
    
// //     // Reset form
// //     setProduct(initialProductState);
    
// //     // Show success message for 3 seconds before calling onSuccess
// //     setTimeout(() => {
// //       onSuccess();
// //     }, 3000);

// //   } catch (err) {
// //     console.error("Product creation error:", err);
    
// //     // Enhanced error messages based on error type
// //     let errorMessage = `Failed to create product: ${err.message}`;
    
// //     if (err.message.includes("network") || err.message.includes("fetch")) {
// //       errorMessage = "Network error: Unable to connect to server. Please check your connection.";
// //     } else if (err.message.includes("409") || err.message.includes("duplicate")) {
// //       errorMessage = "A product with this SKU or ASIN already exists. Please use a unique SKU.";
// //     } else if (err.message.includes("400") || err.message.includes("validation")) {
// //       errorMessage = "Invalid product data. Please check all fields and try again.";
// //     }
    
// //     setError(errorMessage);
    
// //     // Auto-clear error after 5 seconds
// //     setTimeout(() => {
// //       setError(null);
// //     }, 5000);
    
// //   } finally {
// //     setIsSubmitting(false);
// //   }
// // };
// //   // const handleSubmit = async (e) => {
// //   //   e.preventDefault();
// //   //   setIsSubmitting(true);
// //   //   setError(null);

// //   //   if (!product.title || !product.sku || !product.price) {
// //   //     setError("Title, SKU, and Price are required.");
// //   //     setIsSubmitting(false);
// //   //     return;
// //   //   }

// //   //   try {
// //   //     await API.createProduct(product);
// //   //     setProduct(initialProductState);
// //   //     onSuccess();
// //   //   } catch (err) {
// //   //     setError(`Failed to create product: ${err.message}`);
// //   //   } finally {
// //   //     setIsSubmitting(false);
// //   //   }
// //   // };
// // const handleImageUpload = (e, type) => {
// //   const files = Array.from(e.target.files);

// //   if (type === "main") {
// //     const file = files[0];
// //     const url = URL.createObjectURL(file);
// //     setProduct({ ...product, mainImage: url });
// //   }

// //   if (type === "additional") {
// //     const newImages = files.map((f) => URL.createObjectURL(f));
// //     setProduct({
// //       ...product,
// //       additionalImages: [...product.additionalImages, ...newImages].slice(0, 6),
// //     });
// //   }
// // };
// // const [success, setSuccess] = useState(null);

// //   const tabs = [
// //     { id: 'basic', name: 'Basic Info', icon: <Package size={16} /> },
// //     { id: 'offer', name: 'Offer', icon: <DollarSign size={16} /> },
// //     { id: 'images', name: 'Images', icon: <Image size={16} /> },
// //     { id: 'shipping', name: 'Shipping', icon: <Truck size={16} /> },
// //     { id: 'advanced', name: 'Advanced', icon: <Settings size={16} /> },
// //   ];

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-2xl sm:text-3xl font-bold">Add a Product</h2>
// //         <div className="flex space-x-2">
// //           <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
// //             Save as Draft
// //           </button>
// //           <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
// //             Preview Listing
// //           </button>
// //         </div>
// //       </div>

// //        {success && (
// //     <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
// //       <div className="flex items-center">
// //         <div className="flex-shrink-0">
// //           <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
// //             <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
// //             </svg>
// //           </div>
// //         </div>
// //         <div className="ml-3">
// //           <p className="text-green-800 font-medium text-sm">Product Created Successfully!</p>
// //           <p className="text-green-700 text-sm mt-1">{success}</p>
// //           <p className="text-green-600 text-xs mt-1">Redirecting to inventory...</p>
// //         </div>
// //       </div>
// //     </div>
// //   )}

// //       {/* Progress Steps */}
// //       <div className="bg-white rounded-lg border border-gray-200 p-6">
// //         <div className="flex items-center justify-between mb-6">
// //           {tabs.map((tab, index) => (
// //             <div key={tab.id} className="flex items-center">
// //               <button
// //                 onClick={() => setActiveTab(tab.id)}
// //                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
// //                   activeTab === tab.id 
// //                     ? 'bg-orange-100 text-orange-700 border border-orange-200' 
// //                     : 'text-gray-500 hover:text-gray-700'
// //                 }`}
// //               >
// //                 <span>{tab.icon}</span>
// //                 <span className="hidden sm:inline">{tab.name}</span>
// //               </button>
// //               {index < tabs.length - 1 && (
// //                 <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
// //               )}
// //             </div>
// //           ))}
// //         </div>

// //         <form onSubmit={handleSubmit}>
// //           {error && (
// //             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
// //               <div className="flex items-center">
// //                 <AlertTriangle className="text-red-400 mr-2" size={20} />
// //                 <p className="text-red-800 text-sm">{error}</p>
// //               </div>
// //             </div>
// //           )}

// //           {/* Basic Information Tab */}
// //           {activeTab === 'basic' && (
// //             <div className="space-y-6">
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Product Title *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="title"
// //                     value={product.title}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="Enter product title as it appears on Amazon"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Brand *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="brand"
// //                     value={product.brand}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="Brand name"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     SKU (Stock Keeping Unit) *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="sku"
// //                     value={product.sku}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="Unique SKU"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     ASIN (Amazon Standard Identification Number)
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="asin"
// //                     value={product.asin}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="B0XXXXXXXXX"
// //                   />
// //                 </div>

// //                 <div className="lg:col-span-2">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Product Description
// //                   </label>
// //                   <textarea
// //                     name="description"
// //                     value={product.description}
// //                     onChange={handleChange}
// //                     rows="4"
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     placeholder="Detailed product description"
// //                   />
// //                 </div>

// //                 <div className="lg:col-span-2">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Key Product Features (Bullet Points)
// //                   </label>
// //                   <div className="space-y-2">
// //                     {product.bulletPoints.map((point, index) => (
// //                       <input
// //                         key={index}
// //                         type="text"
// //                         value={point}
// //                         onChange={(e) => handleBulletPointChange(index, e.target.value)}
// //                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                         placeholder={`Feature ${index + 1}`}
// //                       />
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Offer Tab */}
// //           {activeTab === 'offer' && (
// //             <div className="space-y-6">
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Your Price *
// //                   </label>
// //                   <div className="relative">
// //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                       <DollarSign className="text-gray-400" size={16} />
// //                     </div>
// //                     <input
// //                       type="number"
// //                       name="price"
// //                       value={product.price}
// //                       onChange={handleChange}
// //                       min="0.01"
// //                       step="0.01"
// //                       className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Quantity *
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="quantity"
// //                     value={product.quantity}
// //                     onChange={handleChange}
// //                     min="0"
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Condition
// //                   </label>
// //                   <select
// //                     name="condition"
// //                     value={product.condition}
// //                     onChange={handleChange}
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                   >
// //                     <option value="New">New</option>
// //                     <option value="Refurbished">Refurbished</option>
// //                     <option value="UsedLikeNew">Used - Like New</option>
// //                     <option value="UsedVeryGood">Used - Very Good</option>
// //                     <option value="UsedGood">Used - Good</option>
// //                     <option value="UsedAcceptable">Used - Acceptable</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="border-t pt-6">
// //                 <h3 className="text-lg font-medium text-gray-900 mb-4">Fulfillment Options</h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <label className="relative flex cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none">
// //                     <input
// //                       type="radio"
// //                       name="fulfillment"
// //                       value="FBM"
// //                       checked={product.fulfillment === 'FBM'}
// //                       onChange={handleChange}
// //                       className="sr-only"
// //                     />
// //                     <div className="flex w-full items-center justify-between">
// //                       <div className="flex items-center">
// //                         <div className="text-sm">
// //                           <p className="font-medium text-gray-900">Fulfilled by Merchant (FBM)</p>
// //                           <p className="text-gray-500">You store and ship products yourself</p>
// //                         </div>
// //                       </div>
// //                       <div className={`h-4 w-4 rounded-full border-2 ${
// //                         product.fulfillment === 'FBM' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
// //                       }`}></div>
// //                     </div>
// //                   </label>

// //                   <label className="relative flex cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none">
// //                     <input
// //                       type="radio"
// //                       name="fulfillment"
// //                       value="FBA"
// //                       checked={product.fulfillment === 'FBA'}
// //                       onChange={handleChange}
// //                       className="sr-only"
// //                     />
// //                     <div className="flex w-full items-center justify-between">
// //                       <div className="flex items-center">
// //                         <div className="text-sm">
// //                           <p className="font-medium text-gray-900">Fulfilled by Amazon (FBA)</p>
// //                           <p className="text-gray-500">Amazon stores and ships your products</p>
// //                         </div>
// //                       </div>
// //                       <div className={`h-4 w-4 rounded-full border-2 ${
// //                         product.fulfillment === 'FBA' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
// //                       }`}></div>
// //                     </div>
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //          {/* Images Tab */}
// // {activeTab === 'images' && (
// //   <div className="space-y-6">
// //     {/* Main Image */}
// //     <div>
// //       <label className="block text-sm font-medium text-gray-700 mb-2">
// //         Main Image *
// //       </label>
// //       <input
// //         type="file"
// //         accept="image/*"
// //         onChange={(e) => handleImageUpload(e, "main")}
// //         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //       />

// //       {product.mainImage && (
// //         <img
// //           src={product.mainImage}
// //           alt="Main"
// //           className="mt-4 w-40 h-40 object-cover rounded-lg border"
// //         />
// //       )}
// //     </div>

// //     {/* Additional Images */}
// //     <div>
// //       <label className="block text-sm font-medium text-gray-700 mb-2">
// //         Additional Images (Up to 6)
// //       </label>
// //       <input
// //         type="file"
// //         accept="image/*"
// //         multiple
// //         onChange={(e) => handleImageUpload(e, "additional")}
// //         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //       />

// //       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
// //         {product.additionalImages.map((img, i) => (
// //           <img
// //             key={i}
// //             src={img}
// //             className="w-full h-32 object-cover rounded-lg border"
// //           />
// //         ))}
// //       </div>
// //     </div>

// //     <p className="text-xs text-gray-500">
// //       Amazon recommends square images (1000×1000px) for zoom support.
// //     </p>
// //   </div>
// // )}

// // {/* Shipping Tab */}
// // {activeTab === 'shipping' && (
// //   <div className="space-y-6">
// //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// //       {/* Weight */}
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700 mb-2">
// //           Item Weight (kg) *
// //         </label>
// //         <input
// //           type="number"
// //           name="weight"
// //           value={product.weight}
// //           onChange={handleChange}
// //           min="0"
// //           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //           placeholder="Ex: 0.50"
// //         />
// //       </div>

// //       {/* Length */}
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700 mb-2">
// //           Package Length (cm) *
// //         </label>
// //         <input
// //           type="number"
// //           name="length"
// //           value={product.dimensions.length}
// //           onChange={(e) =>
// //             setProduct({
// //               ...product,
// //               dimensions: { ...product.dimensions, length: e.target.value },
// //             })
// //           }
// //           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //           placeholder="Ex: 20"
// //         />
// //       </div>

// //       {/* Width */}
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700 mb-2">
// //           Package Width (cm) *
// //         </label>
// //         <input
// //           type="number"
// //           name="width"
// //           value={product.dimensions.width}
// //           onChange={(e) =>
// //             setProduct({
// //               ...product,
// //               dimensions: { ...product.dimensions, width: e.target.value },
// //             })
// //           }
// //           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //           placeholder="Ex: 12"
// //         />
// //       </div>

// //       {/* Height */}
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700 mb-2">
// //           Package Height (cm) *
// //         </label>
// //         <input
// //           type="number"
// //           name="height"
// //           value={product.dimensions.height}
// //           onChange={(e) =>
// //             setProduct({
// //               ...product,
// //               dimensions: { ...product.dimensions, height: e.target.value },
// //             })
// //           }
// //           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //           placeholder="Ex: 5"
// //         />
// //       </div>
// //     </div>

// //     <div>
// //       <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Settings</h3>

// //       <select
// //         name="shippingType"
// //         value={product.shippingType}
// //         onChange={handleChange}
// //         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //       >
// //         <option value="Standard">Standard Shipping</option>
// //         <option value="Expedited">Expedited Shipping</option>
// //         <option value="International">International Shipping</option>
// //       </select>
// //     </div>
// //   </div>
// // )}

// // {/* Advanced Tab */}
// // {activeTab === 'advanced' && (
// //   <div className="space-y-6">
    
// //     {/* Search Terms */}
// //     <div>
// //       <label className="block text-sm font-medium text-gray-700 mb-2">
// //         Search Keywords (Backend Search Terms)
// //       </label>
// //       <textarea
// //         name="keywords"
// //         value={product.keywords}
// //         onChange={handleChange}
// //         rows="3"
// //         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //         placeholder="Enter keywords to improve product search visibility"
// //       />
// //     </div>

// //     {/* Safety Section */}
// //     <div className="border rounded-lg p-5 bg-gray-50">
// //       <h3 className="text-lg font-medium text-gray-900 mb-4">
// //         Safety & Compliance
// //       </h3>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Is this product hazardous?
// //           </label>
// //           <select
// //             name="hazardous"
// //             value={product.hazardous}
// //             onChange={handleChange}
// //             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //           >
// //             <option value="No">No</option>
// //             <option value="Yes">Yes</option>
// //           </select>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Battery Type (If applicable)
// //           </label>
// //           <select
// //             name="batteryType"
// //             value={product.batteryType}
// //             onChange={handleChange}
// //             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //           >
// //             <option value="">None</option>
// //             <option value="Lithium">Lithium</option>
// //             <option value="AA">AA</option>
// //             <option value="AAA">AAA</option>
// //             <option value="Rechargeable">Rechargeable</option>
// //           </select>
// //         </div>
// //       </div>
// //     </div>

// //     {/* Other Attributes */}
// //     <div>
// //       <label className="block text-sm font-medium text-gray-700 mb-2">
// //         Manufacturer / Origin Info
// //       </label>
// //       <input
// //         type="text"
// //         name="manufacturer"
// //         value={product.manufacturer}
// //         onChange={handleChange}
// //         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
// //         placeholder="Brand Manufacturer Name / Company"
// //       />
// //     </div>
// //   </div>
// // )}


// //           <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
// //             <button
// //               type="button"
// //               className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               disabled={isSubmitting}
// //               className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
// //             >
// //               <Plus size={16} />
// //               <span>{isSubmitting ? 'Creating...' : 'Save and Continue'}</span>
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // // Enhanced Dashboard with Amazon Analytics
// // function Dashboard({ stats, products, analytics }) {
// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-2xl sm:text-3xl font-bold">Seller Central Dashboard</h2>
// //         <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
// //           <option value="7d">Last 7 days</option>
// //           <option value="30d">Last 30 days</option>
// //           <option value="90d">Last 90 days</option>
// //         </select>
// //       </div>

// //       {/* Key Metrics */}
// //       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //         <StatCard
// //           title="Total Sales"
// //           value={analytics.totalSales?.toLocaleString() || '0'}
// //           subtitle="Units sold"
// //           icon={<ShoppingCart size={24} />}
// //           color="bg-blue-500"
// //           trend={12.5}
// //         />
// //         <StatCard
// //           title="Total Revenue"
// //           value={`$${(analytics.totalRevenue || 0).toLocaleString()}`}
// //           subtitle="Gross revenue"
// //           icon={<DollarSign size={24} />}
// //           color="bg-green-500"
// //           trend={8.2}
// //         />
// //         <StatCard
// //           title="Buy Box %"
// //           value={`${analytics.buyBoxPercentage || '0'}%`}
// //           subtitle="Win rate"
// //           icon={<Crown size={24} />}
// //           color="bg-purple-500"
// //           trend={-1.5}
// //         />
// //         <StatCard
// //           title="Active Listings"
// //           value={analytics.activeListings?.toString() || '0'}
// //           subtitle="Live products"
// //           icon={<Package size={24} />}
// //           color="bg-orange-500"
// //         />
// //       </div>

// //       {/* Enhanced Product Table */}
// //       <div className="bg-white rounded-lg border border-gray-200">
// //         <div className="p-6 border-b border-gray-200">
// //           <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
// //         </div>
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASIN</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Box</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rank</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {products.slice(0, 10).map(product => (
// //                 <tr key={product.id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="flex items-center">
// //                       <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
// //                         <Package size={20} className="text-orange-600" />
// //                       </div>
// //                       <div className="ml-4">
// //                         <div className="text-sm font-medium text-gray-900">{product.title}</div>
// //                         <div className="text-sm text-gray-500">SKU: {product.sku}</div>
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
// //                     {product.asin}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
// //                     ${product.price}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <PerformanceBadge type="buyBox" value={product.buyBoxPercentage} />
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                     {product.salesRank?.toLocaleString() || 'N/A'}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="flex items-center">
// //                       <Star size={14} className="text-yellow-400 fill-current" />
// //                       <span className="ml-1 text-sm text-gray-900">{product.rating}</span>
// //                       <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <PerformanceBadge type="inventory" value={product.quantity} />
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Enhanced Product List with Amazon features
// // function ProductList({ products, onRefresh, onEdit }) {
// //   const [viewMode, setViewMode] = useState('grid');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filters, setFilters] = useState({
// //     status: 'all',
// //     fulfillment: 'all',
// //     buyBox: 'all'
// //   });

// //   const filteredProducts = products.filter(product => {
// //     const matchesSearch = !searchTerm || 
// //       product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       product.asin?.toLowerCase().includes(searchTerm.toLowerCase());

// //     const matchesFilters = 
// //       (filters.status === 'all' || product.status === filters.status) &&
// //       (filters.fulfillment === 'all' || product.fulfillment === filters.fulfillment) &&
// //       (filters.buyBox === 'all' || 
// //        (filters.buyBox === 'winning' && product.buyBox) ||
// //        (filters.buyBox === 'losing' && !product.buyBox));

// //     return matchesSearch && matchesFilters;
// //   });

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h2 className="text-2xl sm:text-3xl font-bold">Manage Inventory</h2>
// //           <p className="text-gray-600 text-sm mt-1">
// //             {products.length} products • {products.filter(p => p.status === 'active').length} active
// //           </p>
// //         </div>
        
// //         <div className="flex items-center space-x-3">
// //           <div className="flex border border-gray-300 rounded-lg">
// //             <button
// //               onClick={() => setViewMode('grid')}
// //               className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
// //             >
// //               <Grid size={16} />
// //             </button>
// //             <button
// //               onClick={() => setViewMode('list')}
// //               className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
// //             >
// //               <List size={16} />
// //             </button>
// //           </div>
          
// //           <button
// //             onClick={onRefresh}
// //             className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
// //           >
// //             <RotateCcw size={16} />
// //             <span>Refresh</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Enhanced Filters */}
// //       <div className="bg-white rounded-lg border border-gray-200 p-4">
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
// //           <div className="lg:col-span-2">
// //             <div className="relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
// //               <input
// //                 type="text"
// //                 placeholder="Search by title, SKU, or ASIN..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //               />
// //             </div>
// //           </div>
          
// //           <select
// //             value={filters.buyBox}
// //             onChange={(e) => setFilters({ ...filters, buyBox: e.target.value })}
// //             className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //           >
// //             <option value="all">All Buy Box</option>
// //             <option value="winning">Buy Box Winning</option>
// //             <option value="losing">Buy Box Losing</option>
// //           </select>
          
// //           <select
// //             value={filters.status}
// //             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //             className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //           >
// //             <option value="all">All Status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //           </select>
          
// //           <select
// //             value={filters.fulfillment}
// //             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
// //             className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //           >
// //             <option value="all">All Fulfillment</option>
// //             <option value="FBA">FBA Only</option>
// //             <option value="FBM">FBM Only</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Enhanced Product Table */}
// //       <div className="bg-white rounded-lg border border-gray-200">
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASIN/SKU</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Box</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rank</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {filteredProducts.map(product => (
// //                 <tr key={product.id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4">
// //                     <div className="flex items-center">
// //                       <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
// //                         <Package size={20} className="text-orange-600" />
// //                       </div>
// //                       <div className="ml-4">
// //                         <div className="text-sm font-medium text-gray-900">{product.title}</div>
// //                         <div className="text-sm text-gray-500">{product.brand}</div>
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4">
// //                     <div className="text-sm text-gray-900 font-mono">{product.asin}</div>
// //                     <div className="text-sm text-gray-500">SKU: {product.sku}</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
// //                     ${product.price}
// //                   </td>
// //                   <td className="px-6 py-4">
// //                     <PerformanceBadge type="buyBox" value={product.buyBoxPercentage} />
// //                     <div className="text-xs text-gray-500 mt-1">{product.buyBoxPercentage}%</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                     {product.salesRank?.toLocaleString() || 'N/A'}
// //                   </td>
// //                   <td className="px-6 py-4">
// //                     <div className="flex items-center">
// //                       <Star size={14} className="text-yellow-400 fill-current" />
// //                       <span className="ml-1 text-sm text-gray-900">{product.rating}</span>
// //                       <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className={`text-sm font-semibold ${
// //                       product.quantity < 10 ? 'text-red-600' : 'text-gray-900'
// //                     }`}>
// //                       {product.quantity}
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <PerformanceBadge type="inventory" value={product.quantity} />
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                     <div className="flex space-x-2">
// //                       <button
// //                         onClick={() => onEdit(product)}
// //                         className="text-blue-600 hover:text-blue-900"
// //                       >
// //                         Edit
// //                       </button>
// //                       <button className="text-red-600 hover:text-red-900">
// //                         Delete
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Additional View Components
// // function PricingView({ products }) {
// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-2xl sm:text-3xl font-bold">Pricing & Buy Box</h2>
// //         <button className="px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
// //           Reprice All
// //         </button>
// //       </div>
// //       <div className="bg-white rounded-lg border border-gray-200 p-6">
// //         <p className="text-gray-600">Pricing dashboard coming soon...</p>
// //       </div>
// //     </div>
// //   );
// // }

// // function OrdersView() {
// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-2xl sm:text-3xl font-bold">Order Management</h2>
// //       <div className="bg-white rounded-lg border border-gray-200 p-6">
// //         <p className="text-gray-600">Order management coming soon...</p>
// //       </div>
// //     </div>
// //   );
// // }

// // function AdvertisingView() {
// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-2xl sm:text-3xl font-bold">Advertising Campaigns</h2>
// //       <div className="bg-white rounded-lg border border-gray-200 p-6">
// //         <p className="text-gray-600">Advertising dashboard coming soon...</p>
// //       </div>
// //     </div>
// //   );
// // }

// // function ReportsView() {
// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-2xl sm:text-3xl font-bold">Analytics & Reports</h2>
// //       <div className="bg-white rounded-lg border border-gray-200 p-6">
// //         <p className="text-gray-600">Reports dashboard coming soon...</p>
// //       </div>
// //     </div>
// //   );
// // }

// // // Main App Component
// // export default function AmazonSellerCentral() {
// //   const [currentView, setCurrentView] = useState('dashboard');
// //   const [products, setProducts] = useState([]);
// //   const [analytics, setAnalytics] = useState({});
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const loadData = async () => {
// //     setLoading(true);
// //     try {
// //       const [productsData, analyticsData] = await Promise.all([
// //         API.getProducts(),
// //         API.getProductAnalytics()
// //       ]);
// //       setProducts(productsData);
// //       setAnalytics(analyticsData);
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const renderCurrentView = () => {
// //     switch (currentView) {
// //       case 'dashboard':
// //         return <Dashboard stats={{}} products={products} analytics={analytics} />;
// //       case 'inventory':
// //         return <ProductList products={products} onRefresh={loadData} onEdit={(product) => console.log('Edit:', product)} />;
// //       case 'pricing':
// //         return <PricingView products={products} />;
// //       case 'orders':
// //         return <OrdersView />;
// //       case 'advertising':
// //         return <AdvertisingView />;
// //       case 'reports':
// //         return <ReportsView />;
// //       case 'add-product':
// //         return <CreateProduct onSuccess={() => {
// //           loadData();
// //           setCurrentView('inventory');
// //         }} />;
// //       default:
// //         return <Dashboard stats={{}} products={products} analytics={analytics} />;
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading Amazon Seller Central...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16">
// //             <div className="flex items-center">
// //               <div className="flex items-center space-x-3">
// //                 <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded flex items-center justify-center">
// //                   <ShoppingCart className="text-white" size={16} />
// //                 </div>
// //                 <span className="text-xl font-bold text-gray-900">Seller Central</span>
// //               </div>
              
// //               <nav className="hidden md:ml-8 md:flex space-x-8">
// //                 {['dashboard', 'inventory', 'pricing', 'orders', 'advertising', 'reports'].map((item) => (
// //                   <button
// //                     key={item}
// //                     onClick={() => setCurrentView(item)}
// //                     className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
// //                       currentView === item
// //                         ? 'text-orange-600 bg-orange-50'
// //                         : 'text-gray-500 hover:text-gray-700'
// //                     }`}
// //                   >
// //                     {item}
// //                   </button>
// //                 ))}
// //               </nav>
// //             </div>

// //             <div className="flex items-center space-x-4">
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
// //                 <input
// //                   type="text"
// //                   placeholder="Search products..."
// //                   className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {renderCurrentView()}
// //       </main>

// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setCurrentView('add-product')}
// //         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
// //       >
// //         <Plus size={24} />
// //       </button>
// //     </div>
// //   );
// // }




// import React, { useState, useEffect } from 'react';
// import { 
//   Search, Plus, Upload, Download, Filter, Package, AlertTriangle, 
//   TrendingUp, Edit, Trash2, BarChart3, User, Menu, X, Eye,
//   ShoppingCart, DollarSign, Percent, Crown, Award, Truck,
//   Warehouse, Star, ChevronDown, ChevronUp, Grid, List,
//   Image, Layers, Box, Package2, Barcode, QrCode, Zap,
//   Target, Calendar, Users, PieChart, ArrowUpDown, RotateCcw, Settings,
// } from 'lucide-react';
// import AmazonOrderManagement from './Product';
// import Sidebar from "./Sidebar";
// // Enhanced API Configuration with Amazon features
// // const API_BASE_URL = 'http://localhost:8000/api';

// // const API = {
// //   STORAGE_KEY: "amazon-products-data",

// //   async makeRequest(endpoint, options = {}) {
// //     try {
// //       const url = `${API_BASE_URL}${endpoint}`;
// //       const response = await fetch(url, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           ...options.headers,
// //         },
// //         ...options,
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('API request failed:', error);
// //       throw error;
// //     }
// //   },

// //   // Enhanced product methods with Amazon data
// //   getProducts: async () => {
// //     try {
// //       const data = await API.makeRequest('/products');
// //       return data.products || data || [];
// //     } catch (error) {
// //       return API.getFromStorage();
// //     }
// //   },

// //   // Amazon-style product creation
// //   createProduct: async (product) => {
// //     const productData = {
// //       ...product,
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //       // Amazon-specific fields
// //       asin: product.asin || `B0${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
// //       amazonStatus: 'draft',
// //       buyBox: Math.random() > 0.7,
// //       buyBoxPercentage: Math.floor(Math.random() * 100),
// //       salesRank: Math.floor(Math.random() * 10000),
// //       reviews: Math.floor(Math.random() * 1000),
// //       rating: (Math.random() * 2 + 3).toFixed(1),
// //       totalSales: Math.floor(Math.random() * 1000),
// //       revenue: Math.floor(Math.random() * 10000),
// //       conversionRate: (Math.random() * 5).toFixed(1),
// //       pageViews: Math.floor(Math.random() * 5000),
// //       featuredMerchant: Math.random() > 0.5,
// //       // Competition data
// //       lowestCompetitorPrice: (parseFloat(product.price) * (0.8 + Math.random() * 0.4)).toFixed(2),
// //       buyBoxCompetitor: Math.random() > 0.5 ? 'Competitor Inc' : '',
// //       // Performance metrics
// //       customerReturns: Math.floor(Math.random() * 10),
// //       negativeFeedback: Math.floor(Math.random() * 5),
// //       orderDefectRate: (Math.random() * 2).toFixed(1)
// //     };

// //     try {
// //       const data = await API.makeRequest('/products', {
// //         method: 'POST',
// //         body: JSON.stringify(productData),
// //       });
// //       return data.product;
// //     } catch (error) {
// //       const localProduct = {
// //         ...productData,
// //         id: Date.now().toString(),
// //       };
// //       const products = await API.getFromStorage();
// //       products.push(localProduct);
// //       await API.saveToStorage(products);
// //       return localProduct;
// //     }
// //   },

// //   // Enhanced analytics
// //   getProductAnalytics: async () => {
// //     try {
// //       const data = await API.makeRequest('/products/analytics');
// //       return data;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       return {
// //         totalSales: products.reduce((sum, p) => sum + (p.totalSales || 0), 0),
// //         totalRevenue: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
// //         conversionRate: 3.2,
// //         buyBoxPercentage: 67.8,
// //         activeListings: products.filter(p => p.status === 'active').length,
// //         outOfStock: products.filter(p => p.quantity === 0).length,
// //         lowStockCount: products.filter(p => p.quantity < 10).length,
// //         featuredMerchantPercentage: 45.2
// //       };
// //     }
// //   },

// //   // Existing methods
// //   updateProduct: async (id, updates) => {
// //     try {
// //       const data = await API.makeRequest(`/products/${id}`, {
// //         method: 'PUT',
// //         body: JSON.stringify(updates),
// //       });
// //       return data.product;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const index = products.findIndex(p => p.id === id);
// //       if (index !== -1) {
// //         products[index] = { ...products[index], ...updates };
// //         await API.saveToStorage(products);
// //         return products[index];
// //       }
// //       throw new Error("Product not found");
// //     }
// //   },

// //   deleteProduct: async (id) => {
// //     try {
// //       await API.makeRequest(`/products/${id}`, { method: 'DELETE' });
// //       return true;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter(p => p.id !== id);
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   },

// //   bulkDelete: async (productIds) => {
// //     try {
// //       await API.makeRequest('/products/bulk-delete', {
// //         method: 'POST',
// //         body: JSON.stringify({ productIds }),
// //       });
// //       return true;
// //     } catch (error) {
// //       const products = await API.getFromStorage();
// //       const filtered = products.filter(p => !productIds.includes(p.id));
// //       await API.saveToStorage(filtered);
// //       return true;
// //     }
// //   },

// //   getFromStorage: async () => {
// //     const data = localStorage.getItem(API.STORAGE_KEY);
// //     return data ? JSON.parse(data) : [];
// //   },

// //   saveToStorage: async (products) => {
// //     localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
// //     return products;
// //   }
// // };


// const API_BASE_URL = 'http://localhost:8000/api';

// const API = {
//   STORAGE_KEY: "amazon-products-data",
//   VENDORS_KEY: "amazon-vendors-data",
//   CURRENT_VENDOR_KEY: "current-vendor-id",

//   /* -----------------------------------------
//      GLOBAL REQUEST HANDLER
//   ------------------------------------------ */
//   async makeRequest(endpoint, options = {}) {
//     try {
//       const url = `${API_BASE_URL}${endpoint}`;
//       const vendorId = this.getCurrentVendorId();

//       const response = await fetch(url, {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Vendor-Id': vendorId || '',
//           ...options.headers,
//         },
//         ...options,
//       });

//       return await response.json();
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   },
  

//   /* -----------------------------------------
//      VENDOR MANAGEMENT
//   ------------------------------------------ */
//   getCurrentVendorId() {
//     return localStorage.getItem(API.CURRENT_VENDOR_KEY);
//   },

//   setCurrentVendor(vendorId) {
//     localStorage.setItem(API.CURRENT_VENDOR_KEY, vendorId);
//   },

//   async getVendors() {
//     try {
//       const data = await API.makeRequest('/vendors');
//       return data.vendors || data || [];
//     } catch (error) {
//       const vendors = localStorage.getItem(API.VENDORS_KEY);
//       return vendors ? JSON.parse(vendors) : [];
//     }
//   },

//   async createVendor(vendor) {
//     const vendorData = {
//       ...vendor,
//       id: `vendor_${Date.now()}`,
//       createdAt: new Date().toISOString(),
//       status: 'active',
//       totalProducts: 0,
//       totalSales: 0,
//       rating: 0,
//       performance: {
//         orderFulfillment: 0,
//         responseTime: 0,
//         customerSatisfaction: 0
//       }
//     };

//     try {
//       const data = await API.makeRequest('/vendors', {
//         method: 'POST',
//         body: JSON.stringify(vendorData),
//       });
//       return data.vendor;
//     } catch (error) {
//       const vendors = await API.getVendors();
//       vendors.push(vendorData);
//       localStorage.setItem(API.VENDORS_KEY, JSON.stringify(vendors));
//       return vendorData;
//     }
//   },

//   /* -----------------------------------------
//      PRODUCT MANAGEMENT (Amazon Style)
//   ------------------------------------------ */

//   async getProducts() {
//     try {
//       const data = await API.makeRequest('/products');
//       return data.products || data || [];
//     } catch (error) {
//       return API.getFromStorage();
//     }
//   },

//   async createProduct(product) {
//     const productData = {
//       ...product,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),

//       // Amazon fields
//       asin: product.asin || `B0${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
//       amazonStatus: 'draft',
//       buyBox: Math.random() > 0.7,
//       buyBoxPercentage: Math.floor(Math.random() * 100),
//       salesRank: Math.floor(Math.random() * 10000),
//       reviews: Math.floor(Math.random() * 1000),
//       rating: (Math.random() * 2 + 3).toFixed(1),
//       totalSales: Math.floor(Math.random() * 1000),
//       revenue: Math.floor(Math.random() * 10000),
//       conversionRate: (Math.random() * 5).toFixed(1),
//       pageViews: Math.floor(Math.random() * 5000),
//       featuredMerchant: Math.random() > 0.5,

//       lowestCompetitorPrice:
//         (parseFloat(product.price) * (0.8 + Math.random() * 0.4)).toFixed(2),
//       buyBoxCompetitor: Math.random() > 0.5 ? 'Competitor Inc' : '',

//       customerReturns: Math.floor(Math.random() * 10),
//       negativeFeedback: Math.floor(Math.random() * 5),
//       orderDefectRate: (Math.random() * 2).toFixed(1)
//     };

//     try {
//       const data = await API.makeRequest('/products', {
//         method: 'POST',
//         body: JSON.stringify(productData),
//       });
//       return data.product;
//     } catch (error) {
//       const localProduct = {
//         ...productData,
//         id: Date.now().toString(),
//       };
//       const products = await API.getFromStorage();
//       products.push(localProduct);
//       await API.saveToStorage(products);
//       return localProduct;
//     }
//   },

//   /* -----------------------------------------
//      PRODUCT ANALYTICS
//   ------------------------------------------ */
//   async getProductAnalytics() {
//     try {
//       return await API.makeRequest('/products/analytics');
//     } catch (error) {
//       const products = await API.getFromStorage();

//       return {
//         totalSales: products.reduce((sum, p) => sum + (p.totalSales || 0), 0),
//         totalRevenue: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
//         conversionRate: 3.2,
//         buyBoxPercentage: 67.8,
//         activeListings: products.filter(p => p.status === 'active').length,
//         outOfStock: products.filter(p => p.quantity === 0).length,
//         lowStockCount: products.filter(p => p.quantity < 10).length,
//         featuredMerchantPercentage: 45.2
//       };
//     }
//   },

//   /* -----------------------------------------
//      PRODUCT UPDATE / DELETE
//   ------------------------------------------ */
//   async updateProduct(id, updates) {
//     try {
//       const data = await API.makeRequest(`/products/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(updates),
//       });
//       return data.product;
//     } catch (error) {
//       const products = await API.getFromStorage();
//       const index = products.findIndex(p => p.id === id);

//       if (index !== -1) {
//         products[index] = { ...products[index], ...updates };
//         await API.saveToStorage(products);
//         return products[index];
//       }

//       throw new Error("Product not found");
//     }
//   },

//   async deleteProduct(id) {
//     try {
//       await API.makeRequest(`/products/${id}`, { method: 'DELETE' });
//       return true;
//     } catch (error) {
//       const products = await API.getFromStorage();
//       const filtered = products.filter(p => p.id !== id);
//       await API.saveToStorage(filtered);
//       return true;
//     }
//   },

//   async bulkDelete(productIds) {
//     try {
//       await API.makeRequest('/products/bulk-delete', {
//         method: 'POST',
//         body: JSON.stringify({ productIds }),
//       });
//       return true;
//     } catch (error) {
//       const products = await API.getFromStorage();
//       const filtered = products.filter(p => !productIds.includes(p.id));
//       await API.saveToStorage(filtered);
//       return true;
//     }
//   },

//   /* -----------------------------------------
//      LOCAL STORAGE
//   ------------------------------------------ */
//   async getFromStorage() {
//     const data = localStorage.getItem(API.STORAGE_KEY);
//     return data ? JSON.parse(data) : [];
//   },

//   async saveToStorage(products) {
//     localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
//     return products;
//   }
// };

// // Enhanced StatCard with Amazon styling
// function StatCard({ title, value, subtitle, icon, color, trend }) {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-sm transition-shadow">
//       <div className="flex items-center justify-between">
//         <div className="flex-1 min-w-0">
//           <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
//           <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{value}</p>
//           {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//           {trend && (
//             <div className={`flex items-center mt-2 text-xs ${
//               trend > 0 ? 'text-green-600' : 'text-red-600'
//             }`}>
//               <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
//               <span className="ml-1">{Math.abs(trend)}%</span>
//             </div>
//           )}
//         </div>
//         <div className={`${color} text-white p-3 rounded-lg flex-shrink-0 ml-4`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Amazon Performance Badge
// function PerformanceBadge({ type, value }) {
//   const getConfig = (type, value) => {
//     const configs = {
//       buyBox: {
//         excellent: { color: 'bg-green-100 text-green-800', label: 'Buy Box Winning', icon: <Crown size={12} /> },
//         good: { color: 'bg-blue-100 text-blue-800', label: 'Buy Box Eligible', icon: <Award size={12} /> },
//         poor: { color: 'bg-yellow-100 text-yellow-800', label: 'Buy Box Losing', icon: <TrendingUp size={12} /> }
//       },
//       inventory: {
//         excellent: { color: 'bg-green-100 text-green-800', label: 'In Stock', icon: <Package size={12} /> },
//         warning: { color: 'bg-orange-100 text-orange-800', label: 'Low Stock', icon: <AlertTriangle size={12} /> },
//         critical: { color: 'bg-red-100 text-red-800', label: 'Out of Stock', icon: <AlertTriangle size={12} /> }
//       },
//       rating: {
//         excellent: { color: 'bg-green-100 text-green-800', label: 'High Rating', icon: <Star size={12} /> },
//         good: { color: 'bg-blue-100 text-blue-800', label: 'Good Rating', icon: <Star size={12} /> },
//         poor: { color: 'bg-yellow-100 text-yellow-800', label: 'Needs Improvement', icon: <Star size={12} /> }
//       }
//     };

//     if (type === 'buyBox') {
//       return value > 70 ? configs.buyBox.excellent : 
//              value > 30 ? configs.buyBox.good : configs.buyBox.poor;
//     }
    
//     if (type === 'inventory') {
//       return value > 20 ? configs.inventory.excellent :
//              value > 0 ? configs.inventory.warning : configs.inventory.critical;
//     }
    
//     return configs.rating.good;
//   };

//   const config = getConfig(type, value);

//   return (
//     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
//       {config.icon && React.cloneElement(config.icon, { className: "mr-1", size: 10 })}
//       {config.label}
//     </span>
//   );
// }

// // Enhanced Create Product with Amazon-specific fields
// function CreateProduct({ onSuccess }) {
//   const initialProductState = {
//     title: '',
//     sku: '',
//     asin: '',
//     brand: '',
//     price: '',
//     quantity: '',
//     category: '',
//     status: 'draft',
//     fulfillment: 'FBM',
//     description: '',
//     bulletPoints: ['', '', '', '', ''],
//     keywords: '',
//     mainImage: '',
//     additionalImages: [],
//     weight: '',
//     dimensions: { length: '', width: '', height: '' },
//     packageDimensions: { length: '', width: '', height: '' },
//     packageWeight: '',
//     hazardous: false,
//     adultProduct: false,
//     condition: 'New',
//     conditionNote: '',
//     taxCode: 'A_GEN_TAX',
//     productType: '',
//     variationTheme: '',
//     parentChild: '',
//     parentSku: '',
//     relationshipType: '',
//     shippingType: 'Standard',
//     batteryType: '',
//     manufacturer: ''
//   };

//   const [product, setProduct] = useState(initialProductState);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [activeTab, setActiveTab] = useState('basic');

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProduct(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleBulletPointChange = (index, value) => {
//     const newBulletPoints = [...product.bulletPoints];
//     newBulletPoints[index] = value;
//     setProduct(prev => ({ ...prev, bulletPoints: newBulletPoints }));
//   };

//   const handleDimensionChange = (type, field, value) => {
//     setProduct(prev => ({
//       ...prev,
//       [type]: {
//         ...prev[type],
//         [field]: value
//       }
//     }));
//   };

//   const handleImageUpload = (e, type) => {
//     const files = Array.from(e.target.files);

//     if (type === "main") {
//       const file = files[0];
//       const url = URL.createObjectURL(file);
//       setProduct({ ...product, mainImage: url });
//     }

//     if (type === "additional") {
//       const newImages = files.map((f) => URL.createObjectURL(f));
//       setProduct({
//         ...product,
//         additionalImages: [...product.additionalImages, ...newImages].slice(0, 6),
//       });
//     }
//   };


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);
//   setError(null);
//   setSuccess(null);

//   const validationErrors = [];

//   // Required validation
//   if (!product?.title?.trim()) validationErrors.push("Product title is required");
//   if (!product?.sku?.trim()) validationErrors.push("SKU is required");
//   if (!product?.price) validationErrors.push("Price is required");
//   if (!product?.brand?.trim()) validationErrors.push("Brand is required");
//   if (product?.quantity === "" || product?.quantity === null) {
//     validationErrors.push("Quantity is required");
//   }

//   // Advanced validation
//   if (product.title?.length > 500) validationErrors.push("Product title must be less than 500 characters");
//   if (product.sku?.length > 40) validationErrors.push("SKU must be less than 40 characters");

//   if (product.price && (parseFloat(product.price) <= 0 || parseFloat(product.price) > 100000)) {
//     validationErrors.push("Price must be between $0.01 and $100,000");
//   }
// if (!product.category?.trim()) 
//   validationErrors.push("Category is required");

// if (!product.mainImage?.trim())
//   validationErrors.push("Main image is required");

//   if (product.quantity && (parseInt(product.quantity) < 0 || parseInt(product.quantity) > 999999)) {
//     validationErrors.push("Quantity must be between 0 and 999,999");
//   }

//   if (product.asin && !/^[A-Z0-9]{10}$/.test(product.asin)) {
//     validationErrors.push("ASIN must be exactly 10 characters (letters and numbers)");
//   }

//   const meaningfulBulletPoints = product.bulletPoints?.filter(
//     (p) => p && p.trim().length > 0
//   );
//   if (!meaningfulBulletPoints || meaningfulBulletPoints.length === 0) {
//     validationErrors.push("At least one key product feature is required");
//   }

//   if (validationErrors.length > 0) {
//     setError(validationErrors.join(", "));
//     setIsSubmitting(false);
//     return;
//   }

//   // Clean + prepare product for backend
//   const productData = {
//     ...product,
//     title: product.title.trim(),
//     sku: product.sku.trim(),
//     brand: product.brand.trim(),
//     price: parseFloat(product.price),
//     quantity: parseInt(product.quantity),
//     bulletPoints: meaningfulBulletPoints,
//     asin: product.asin?.trim() || undefined,
//     description: product.description?.trim() || "",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };

//   console.log("Final Product Sent to Server:", productData);

//   try {
//     // 🔥 USE FETCH EXACTLY AS YOU ASKED
//     const response = await fetch("http://localhost:8000/api/products", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(productData), // SEND CLEANED PRODUCT
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Server validation error:", data);
//       setError("Failed to create product: " + (data.message || "Invalid data"));
//       setIsSubmitting(false);
//       return;
//     }

//     // SUCCESS
//     setSuccess(`Product "${data.title}" created successfully!`);

//     // Reset form
//     setProduct(initialProductState);

//     setTimeout(() => {
//       onSuccess();
//     }, 3000);

//   } catch (err) {
//     console.error("Product creation error:", err);

//     let errorMessage = `Failed to create product: ${err.message}`;

//     if (err.message.includes("network")) {
//       errorMessage = "Network error: Server not reachable.";
//     }

//     setError(errorMessage);

//     setTimeout(() => {
//       setError(null);
//     }, 5000);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setIsSubmitting(true);
//   //   setError(null);
//   //   setSuccess(null);

//   //   // Enhanced validation
//   //   const validationErrors = [];

//   //   // Required field validation
//   //   if (!product.title?.trim()) {
//   //     validationErrors.push("Product title is required");
//   //   }
    
//   //   if (!product.sku?.trim()) {
//   //     validationErrors.push("SKU is required");
//   //   }
    
//   //   if (!product.price) {
//   //     validationErrors.push("Price is required");
//   //   }
    
//   //   if (!product.brand?.trim()) {
//   //     validationErrors.push("Brand is required");
//   //   }
    
//   //   if (!product.quantity && product.quantity !== 0) {
//   //     validationErrors.push("Quantity is required");
//   //   }

//   //   // Advanced validation rules
//   //   if (product.title?.length > 500) {
//   //     validationErrors.push("Product title must be less than 500 characters");
//   //   }

//   //   if (product.sku?.length > 40) {
//   //     validationErrors.push("SKU must be less than 40 characters");
//   //   }

//   //   if (product.price && (parseFloat(product.price) <= 0 || parseFloat(product.price) > 100000)) {
//   //     validationErrors.push("Price must be between $0.01 and $100,000");
//   //   }

//   //   if (product.quantity && (parseInt(product.quantity) < 0 || parseInt(product.quantity) > 999999)) {
//   //     validationErrors.push("Quantity must be between 0 and 999,999");
//   //   }

//   //   // ASIN validation (if provided)
//   //   if (product.asin && !/^[A-Z0-9]{10}$/.test(product.asin)) {
//   //     validationErrors.push("ASIN must be exactly 10 characters (letters and numbers)");
//   //   }

//   //   // Bullet points validation - at least one meaningful bullet point
//   //   const meaningfulBulletPoints = product.bulletPoints.filter(point => 
//   //     point && point.trim().length > 0
//   //   );
//   //   if (meaningfulBulletPoints.length === 0) {
//   //     validationErrors.push("At least one key product feature is required");
//   //   }

//   //   // If there are validation errors, show them and stop submission
//   //   if (validationErrors.length > 0) {
//   //     setError(validationErrors.join(", "));
//   //     setIsSubmitting(false);
//   //     return;
//   //   }

//   //   try {
//   //     // Prepare product data for submission
//   //     const productData = {
//   //       ...product,
//   //       // Clean up data
//   //       title: product.title.trim(),
//   //       sku: product.sku.trim(),
//   //       brand: product.brand.trim(),
//   //       price: parseFloat(product.price).toFixed(2),
//   //       quantity: parseInt(product.quantity),
//   //       // Filter out empty bullet points
//   //       bulletPoints: product.bulletPoints.filter(point => point && point.trim().length > 0),
//   //       // Ensure proper data types
//   //       asin: product.asin?.trim() || undefined,
//   //       description: product.description?.trim() || '',
//   //       // Add timestamps
//   //       createdAt: new Date().toISOString(),
//   //       updatedAt: new Date().toISOString(),
//   //     };

//   //     console.log("Submitting product:", productData);

//   //     // Create product via API
//   //     const createdProduct = await API.createProduct(productData);
      
//   //     // Success handling
//   //     setSuccess(`Product "${createdProduct.title}" has been successfully created!`);
      
//   //     // Reset form
//   //     setProduct(initialProductState);
      
//   //     // Show success message for 3 seconds before calling onSuccess
//   //     setTimeout(() => {
//   //       onSuccess();
//   //     }, 3000);

//   //   } catch (err) {
//   //     console.error("Product creation error:", err);
      
//   //     // Enhanced error messages based on error type
//   //     let errorMessage = `Failed to create product: ${err.message}`;
      
//   //     if (err.message.includes("network") || err.message.includes("fetch")) {
//   //       errorMessage = "Network error: Unable to connect to server. Please check your connection.";
//   //     } else if (err.message.includes("409") || err.message.includes("duplicate")) {
//   //       errorMessage = "A product with this SKU or ASIN already exists. Please use a unique SKU.";
//   //     } else if (err.message.includes("400") || err.message.includes("validation")) {
//   //       errorMessage = "Invalid product data. Please check all fields and try again.";
//   //     }
      
//   //     setError(errorMessage);
      
//   //     // Auto-clear error after 5 seconds
//   //     setTimeout(() => {
//   //       setError(null);
//   //     }, 5000);
      
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

//   const tabs = [
//     { id: 'basic', name: 'Basic Info', icon: <Package size={16} /> },
//     { id: 'offer', name: 'Offer', icon: <DollarSign size={16} /> },
//     { id: 'images', name: 'Images', icon: <Image size={16} /> },
//     { id: 'shipping', name: 'Shipping', icon: <Truck size={16} /> },
//     { id: 'advanced', name: 'Advanced', icon: <Settings size={16} /> },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl sm:text-3xl font-bold">Add a Product</h2>
//         <div className="flex space-x-2">
//           <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
//             Save as Draft
//           </button>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//             Preview Listing
//           </button>
//         </div>
//       </div>

//       {/* Success Message */}
//       {success && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
//                 <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//             </div>
//             <div className="ml-3">
//               <p className="text-green-800 font-medium text-sm">Product Created Successfully!</p>
//               <p className="text-green-700 text-sm mt-1">{success}</p>
//               <p className="text-green-600 text-xs mt-1">Redirecting to inventory...</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Progress Steps */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-6">
//           {tabs.map((tab, index) => (
//             <div key={tab.id} className="flex items-center">
//               <button
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
//                   activeTab === tab.id 
//                     ? 'bg-orange-100 text-orange-700 border border-orange-200' 
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 <span>{tab.icon}</span>
//                 <span className="hidden sm:inline">{tab.name}</span>
//               </button>
//               {index < tabs.length - 1 && (
//                 <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
//               )}
//             </div>
//           ))}
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//               <div className="flex items-center">
//                 <AlertTriangle className="text-red-400 mr-2" size={20} />
//                 <div>
//                   <p className="text-red-800 font-medium text-sm">Unable to create product</p>
//                   <p className="text-red-700 text-sm mt-1">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Basic Information Tab */}
//           {activeTab === 'basic' && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Title *
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={product.title}
//                     onChange={(e) => setProduct({ ...product, title: e.target.value })}
//                     // onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="Enter product title as it appears on Amazon"
//                     required
//                     maxLength={500}
//                   />
//                   <p className="text-xs text-gray-500 mt-1">{product.title.length}/500 characters</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Brand *
//                   </label>
//                   <input
//                     type="text"
//                     name="brand"
//                     value={product.brand}
//                       onChange={(e) => setProduct({ ...product, brand: e.target.value })}

//                     // onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="Brand name"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     SKU (Stock Keeping Unit) *
//                   </label>
//                   <input
//                     type="text"
//                     name="sku"
//                     value={product.sku}
//                       onChange={(e) => setProduct({ ...product, sku: e.target.value })}

//                     // onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="Unique SKU"
//                     required
//                     maxLength={40}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ASIN (Amazon Standard Identification Number)
//                   </label>
//                   <input
//                     type="text"
//                     name="asin"
//                     value={product.asin}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="B0XXXXXXXXX"
//                     pattern="[A-Z0-9]{10}"
//                     title="ASIN must be exactly 10 uppercase letters and numbers"
//                   />
//                 </div>

//                 <div className="lg:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={product.description}
//                     onChange={handleChange}
//                     rows="4"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="Detailed product description"
//                   />
//                 </div>
//                 <select
//   value={product.condition}
//   onChange={(e) => setProduct({ ...product, condition: e.target.value })}
//   className="border p-2 rounded w-full"
// >
//   <option value="new">New</option>
//   <option value="used-like-new">Used - Like New</option>
//   <option value="used-very-good">Used - Very Good</option>
//   <option value="used-good">Used - Good</option>
//   <option value="used-acceptable">Used - Acceptable</option>
// </select>

//                 <div className="lg:col-span-2">
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Category <span className="text-red-500">*</span>
//   </label>

//   <select
//     required
//     value={product.category}
//     onChange={(e) =>
//       setProduct({ 
//         ...product, 
//         category: e.target.value 
//       })
//     }
//     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//   >
//     <option value="">Select Category</option>
//     <option value="Electronics">Electronics</option>
//     <option value="Fashion">Fashion</option>
//     <option value="Home & Kitchen">Home & Kitchen</option>
//     <option value="Beauty">Beauty</option>
//     <option value="Sports">Sports</option>
//     <option value="Automotive">Automotive</option>
//     <option value="Grocery">Grocery</option>
//   </select>
// </div>

//                 <div className="lg:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Key Product Features (Bullet Points) *
//                   </label>
//                   <div className="space-y-2">
//                     {product.bulletPoints.map((point, index) => (
//                       <input
//                         key={index}
//                         type="text"
//                         value={point}
//                         onChange={(e) => handleBulletPointChange(index, e.target.value)}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                         placeholder={`Feature ${index + 1}`}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">At least one feature is required</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Offer Tab */}
//           {activeTab === 'offer' && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Price *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <DollarSign className="text-gray-400" size={16} />
//                     </div>
//                     <input
//                       type="number"
//                       name="price"
//                       value={product.price}
//                       onChange={handleChange}
//                       min="0.01"
//                       step="0.01"
//                       className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Quantity *
//                   </label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     value={product.quantity}
//                     onChange={handleChange}
//                     min="0"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Condition
//                   </label>
//                   <select
//                     name="condition"
//                     value={product.condition}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                   >
//                     <option value="New">New</option>
//                     <option value="Refurbished">Refurbished</option>
//                     <option value="UsedLikeNew">Used - Like New</option>
//                     <option value="UsedVeryGood">Used - Very Good</option>
//                     <option value="UsedGood">Used - Good</option>
//                     <option value="UsedAcceptable">Used - Acceptable</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="border-t pt-6">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Fulfillment Options</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <label className="relative flex cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none">
//                     <input
//                       type="radio"
//                       name="fulfillment"
//                       value="FBM"
//                       checked={product.fulfillment === 'FBM'}
//                       onChange={handleChange}
//                       className="sr-only"
//                     />
//                     <div className="flex w-full items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="text-sm">
//                           <p className="font-medium text-gray-900">Fulfilled by Merchant (FBM)</p>
//                           <p className="text-gray-500">You store and ship products yourself</p>
//                         </div>
//                       </div>
//                       <div className={`h-4 w-4 rounded-full border-2 ${
//                         product.fulfillment === 'FBM' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
//                       }`}></div>
//                     </div>
//                   </label>

//                   <label className="relative flex cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none">
//                     <input
//                       type="radio"
//                       name="fulfillment"
//                       value="FBA"
//                       checked={product.fulfillment === 'FBA'}
//                       onChange={handleChange}
//                       className="sr-only"
//                     />
//                     <div className="flex w-full items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="text-sm">
//                           <p className="font-medium text-gray-900">Fulfilled by Amazon (FBA)</p>
//                           <p className="text-gray-500">Amazon stores and ships your products</p>
//                         </div>
//                       </div>
//                       <div className={`h-4 w-4 rounded-full border-2 ${
//                         product.fulfillment === 'FBA' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
//                       }`}></div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Images Tab */}
//           {activeTab === 'images' && (
//             <div className="space-y-6">
//               {/* Main Image */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Main Image *
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleImageUpload(e, "main")}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//                 />

//                 {product.mainImage && (
//                   <img
//                     src={product.mainImage}
//                     alt="Main"
//                     className="mt-4 w-40 h-40 object-cover rounded-lg border"
//                   />
//                 )}
//               </div>

//               {/* Additional Images */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Additional Images (Up to 6)
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={(e) => handleImageUpload(e, "additional")}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//                 />

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
//                   {product.additionalImages.map((img, i) => (
//                     <img
//                       key={i}
//                       src={img}
//                       alt={`Additional ${i + 1}`}
//                       className="w-full h-32 object-cover rounded-lg border"
//                     />
//                   ))}
//                 </div>
//               </div>

//               <p className="text-xs text-gray-500">
//                 Amazon recommends square images (1000×1000px) for zoom support.
//               </p>
//             </div>
//           )}

//           {/* Shipping Tab */}
//           {activeTab === 'shipping' && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Weight */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Item Weight (kg) *
//                   </label>
//                   <input
//                     type="number"
//                     name="weight"
//                     value={product.weight}
//                     onChange={handleChange}
//                     min="0"
//                     step="0.01"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="Ex: 0.50"
//                     required
//                   />
//                 </div>

//                 {/* Length */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Package Length (cm) *
//                   </label>
//                   <input
//                     type="number"
//                     name="length"
//                     value={product.dimensions.length}
//                     onChange={(e) => handleDimensionChange('dimensions', 'length', e.target.value)}
//                     min="0"
//                     step="0.1"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="Ex: 20"
//                     required
//                   />
//                 </div>

//                 {/* Width */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Package Width (cm) *
//                   </label>
//                   <input
//                     type="number"
//                     name="width"
//                     value={product.dimensions.width}
//                     onChange={(e) => handleDimensionChange('dimensions', 'width', e.target.value)}
//                     min="0"
//                     step="0.1"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="Ex: 12"
//                     required
//                   />
//                 </div>

//                 {/* Height */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Package Height (cm) *
//                   </label>
//                   <input
//                     type="number"
//                     name="height"
//                     value={product.dimensions.height}
//                     onChange={(e) => handleDimensionChange('dimensions', 'height', e.target.value)}
//                     min="0"
//                     step="0.1"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     placeholder="Ex: 5"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Settings</h3>
//                 <select
//                   name="shippingType"
//                   value={product.shippingType}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                 >
//                   <option value="Standard">Standard Shipping</option>
//                   <option value="Expedited">Expedited Shipping</option>
//                   <option value="International">International Shipping</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {/* Advanced Tab */}
//           {activeTab === 'advanced' && (
//             <div className="space-y-6">
//               {/* Search Terms */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Search Keywords (Backend Search Terms)
//                 </label>
//                 <textarea
//                   name="keywords"
//                   value={product.keywords}
//                   onChange={handleChange}
//                   rows="3"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                   placeholder="Enter keywords to improve product search visibility"
//                 />
//               </div>

//               {/* Safety Section */}
//               <div className="border rounded-lg p-5 bg-gray-50">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">
//                   Safety & Compliance
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Is this product hazardous?
//                     </label>
//                     <select
//                       name="hazardous"
//                       value={product.hazardous}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     >
//                       <option value={false}>No</option>
//                       <option value={true}>Yes</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Battery Type (If applicable)
//                     </label>
//                     <select
//                       name="batteryType"
//                       value={product.batteryType}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                     >
//                       <option value="">None</option>
//                       <option value="Lithium">Lithium</option>
//                       <option value="AA">AA</option>
//                       <option value="AAA">AAA</option>
//                       <option value="Rechargeable">Rechargeable</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Other Attributes */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Manufacturer / Origin Info
//                 </label>
//                 <input
//                   type="text"
//                   name="manufacturer"
//                   value={product.manufacturer}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                   placeholder="Brand Manufacturer Name / Company"
//                 />
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
//             <button
//               type="button"
//               onClick={() => {
//                 if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
//                   setProduct(initialProductState);
//                   setError(null);
//                   setSuccess(null);
//                 }
//               }}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Creating Product...</span>
//                 </>
//               ) : (
//                 <>
//                   <Plus size={16} />
//                   <span>Create Product</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // Enhanced Dashboard with Amazon Analytics
// function Dashboard({ stats, products, analytics }) {
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   // Calculate pagination values
//   const totalPages = Math.ceil(products.length / itemsPerPage);
//   const currentProducts = products.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Product Dashboard</h1>
//           <p className="text-gray-600 text-sm mt-2">Monitor your Amazon business performance</p>
//         </div>
        
//         <div className="flex flex-col xs:flex-row gap-3">
//           <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm">
//             <option value="7d">Last 7 days</option>
//             <option value="30d">Last 30 days</option>
//             <option value="90d">Last 90 days</option>
//           </select>
//           <button className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             <span>Refresh Data</span>
//           </button>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Sales"
//           value={analytics.totalSales?.toLocaleString() || '0'}
//           subtitle="Units sold"
//           icon={<ShoppingCart size={20} />}
//           color="bg-blue-500"
//           trend={12.5}
//         />
//         <StatCard
//           title="Total Revenue"
//           value={`$${(analytics.totalRevenue || 0).toLocaleString()}`}
//           subtitle="Gross revenue"
//           icon={<DollarSign size={20} />}
//           color="bg-green-500"
//           trend={8.2}
//         />
//         <StatCard
//           title="Buy Box %"
//           value={`${analytics.buyBoxPercentage || '0'}%`}
//           subtitle="Win rate"
//           icon={<Crown size={20} />}
//           color="bg-purple-500"
//           trend={-1.5}
//         />
//         <StatCard
//           title="Active Listings"
//           value={analytics.activeListings?.toString() || '0'}
//           subtitle="Live products"
//           icon={<Package size={20} />}
//           color="bg-orange-500"
//         />
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Sales Chart */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
//             <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
//               <option>Weekly</option>
//               <option>Monthly</option>
//               <option>Quarterly</option>
//             </select>
//           </div>
//           <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
//             <div className="text-center">
//               <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//               <p className="text-gray-600 text-sm">Sales chart visualization</p>
//             </div>
//           </div>
//         </div>

//         {/* Inventory Health */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Inventory Health</h3>
//             <button className="px-3 py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors">
//               View All
//             </button>
//           </div>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div>
//                 <p className="font-medium text-sm text-gray-900">Low Stock Items</p>
//                 <p className="text-gray-600 text-xs">Needs replenishment</p>
//               </div>
//               <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">12</span>
//             </div>
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div>
//                 <p className="font-medium text-sm text-gray-900">Out of Stock</p>
//                 <p className="text-gray-600 text-xs">Requires attention</p>
//               </div>
//               <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">5</span>
//             </div>
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div>
//                 <p className="font-medium text-sm text-gray-900">Excess Inventory</p>
//                 <p className="text-gray-600 text-xs">Consider promotions</p>
//               </div>
//               <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">8</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Product Table */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         {/* Table Header */}
//         <div className="p-4 sm:p-6 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
//             <div className="flex flex-col xs:flex-row gap-2">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//               />
//               <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table Content */}
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[800px]">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASIN</th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Box</th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rank</th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentProducts.map(product => (
//                 <tr key={product.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-4 sm:px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                         <Package size={16} className="sm:w-5 sm:h-5 text-orange-600" />
//                       </div>
//                       <div className="ml-3 sm:ml-4">
//                         <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</div>
//                         <div className="text-xs text-gray-500">SKU: {product.sku}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-mono">
//                     {product.asin}
//                   </td>
//                   <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-green-600">
//                     ${product.price}
//                   </td>
//                   <td className="px-4 sm:px-6 py-4">
//                     <PerformanceBadge type="buyBox" value={product.buyBoxPercentage} />
//                   </td>
//                   <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
//                     {product.salesRank?.toLocaleString() || 'N/A'}
//                   </td>
//                   <td className="px-4 sm:px-6 py-4">
//                     <div className="flex items-center">
//                       <Star size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-400 fill-current" />
//                       <span className="ml-1 text-sm text-gray-900">{product.rating}</span>
//                       <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
//                     </div>
//                   </td>
//                   <td className="px-4 sm:px-6 py-4">
//                     <PerformanceBadge type="inventory" value={product.quantity} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 gap-3 sm:gap-0">
//           <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-2">
//             <span className="text-sm text-gray-700 whitespace-nowrap">
//               Showing{" "}
//               <span className="font-medium">
//                 {(currentPage - 1) * itemsPerPage + 1}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium">
//                 {Math.min(currentPage * itemsPerPage, products.length)}
//               </span>{" "}
//               of <span className="font-medium">{products.length}</span> products
//             </span>
            
//             {/* Items per page selector */}
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//             >
//               <option value={5}>5 / page</option>
//               <option value={10}>10 / page</option>
//               <option value={25}>25 / page</option>
//             </select>
//           </div>

//           <div className="flex items-center space-x-1 sm:space-x-2">
//             {/* Previous Button */}
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-2 sm:px-3 py-1.5 rounded border text-sm font-medium ${
//                 currentPage === 1
//                   ? "text-gray-400 bg-gray-100 cursor-not-allowed"
//                   : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
//               }`}
//             >
//               Previous
//             </button>

//             {/* Page Numbers */}
//             <div className="flex items-center space-x-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter(page => {
//                   // Show first 2 pages, last 2 pages, and pages around current page
//                   if (page <= 2) return true;
//                   if (page > totalPages - 2) return true;
//                   if (Math.abs(page - currentPage) <= 1) return true;
//                   return false;
//                 })
//                 .map((page, index, array) => {
//                   const showEllipsis = index > 0 && page - array[index - 1] > 1;
//                   return (
//                     <div key={page} className="flex items-center">
//                       {showEllipsis && (
//                         <span className="px-1 sm:px-2 text-gray-500 text-sm">...</span>
//                       )}
//                       <button
//                         onClick={() => setCurrentPage(page)}
//                         className={`px-2 sm:px-3 py-1.5 rounded text-sm font-medium ${
//                           currentPage === page
//                             ? "bg-orange-500 text-white border-orange-500"
//                             : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
//                         } border`}
//                       >
//                         {page}
//                       </button>
//                     </div>
//                   );
//                 })}
//             </div>

//             {/* Next Button */}
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className={`px-2 sm:px-3 py-1.5 rounded border text-sm font-medium ${
//                 currentPage === totalPages
//                   ? "text-gray-400 bg-gray-100 cursor-not-allowed"
//                   : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <button className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-orange-300 transition-colors text-left">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//             <div>
//               <h4 className="font-medium text-gray-900">View Reports</h4>
//               <p className="text-gray-600 text-sm">Detailed analytics</p>
//             </div>
//           </div>
//         </button>

//         <button className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-orange-300 transition-colors text-left">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//             </div>
//             <div>
//               <h4 className="font-medium text-gray-900">Add Product</h4>
//               <p className="text-gray-600 text-sm">Create new listing</p>
//             </div>
//           </div>
//         </button>

//         <button className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-orange-300 transition-colors text-left">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             </div>
//             <div>
//               <h4 className="font-medium text-gray-900">Run Analysis</h4>
//               <p className="text-gray-600 text-sm">Performance insights</p>
//             </div>
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// }

// // Enhanced Product List with Amazon features
// // function ProductList({ products, onRefresh, onEdit }) {
// //   const [viewMode, setViewMode] = useState('grid');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filters, setFilters] = useState({
// //     status: 'all',
// //     fulfillment: 'all',
// //     buyBox: 'all'
// //   });


// //   const [editModalOpen, setEditModalOpen] = useState(false);
// // const [editingProduct, setEditingProduct] = useState(null);

// // const openEditModal = (product) => {
// //   setEditingProduct(product);
// //   setEditModalOpen(true);
// // };

// // const closeEditModal = () => {
// //   setEditingProduct(null);
// //   setEditModalOpen(false);
// // };
// // // const [filteredProducts, setFilteredProducts] = useState([]);

// // const updateProduct = async () => {
// //   try {
// //     const response = await fetch(`http://localhost:8000/api/products/${editingProduct._id}`, {
// //       method: "PUT",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(editingProduct),
// //     });

// //     const data = await response.json();

// //     if (!response.ok) {
// //       alert("Update failed: " + data.message);
// //       return;
// //     }

// //     setFilteredProducts((prev) =>
// //       prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
// //     );

// //     closeEditModal();
// //     alert("Product updated successfully!");
// //   } catch (err) {
// //     console.error("Update error:", err);
// //   }
// // };

// // const onDelete = async (id) => {
// //   if (!window.confirm("Are you sure you want to delete this product?")) return;

// //   try {
// //     const response = await fetch(`http://localhost:8000/api/products/${id}`, {
// //       method: "DELETE",
// //     });

// //     const data = await response.json();

// //     if (!response.ok) {
// //       alert("Delete failed: " + data.message);
// //       return;
// //     }

// //     // Remove deleted product from UI
// //     setFilteredProducts((prev) => prev.filter((p) => p._id !== id));

// //     alert("Product deleted successfully!");
// //   } catch (err) {
// //     console.error("Delete error:", err);
// //   }
// // };


// //   const filteredProducts = products.filter(product => {
// //     const matchesSearch = !searchTerm || 
// //       product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       product.asin?.toLowerCase().includes(searchTerm.toLowerCase());

// //     const matchesFilters = 
// //       (filters.status === 'all' || product.status === filters.status) &&
// //       (filters.fulfillment === 'all' || product.fulfillment === filters.fulfillment) &&
// //       (filters.buyBox === 'all' || 
// //        (filters.buyBox === 'winning' && product.buyBox) ||
// //        (filters.buyBox === 'losing' && !product.buyBox));

// //     return matchesSearch && matchesFilters;
// //   });



// function ProductList({ products, onRefresh, onEdit }) {
//   const [viewMode, setViewMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     status: "all",
//     fulfillment: "all",
//     buyBox: "all",
//   });

//   // -------------------------------
//   // Edit Modal State
//   // -------------------------------
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // -------------------------------
//   // Pagination State
//   // -------------------------------
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
// // const [showCreate, setShowCreate] = useState(false);

//   const openEditModal = (product) => {
//     setEditingProduct(product);
//     setEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setEditingProduct(null);
//     setEditModalOpen(false);
//   };

//   // -------------------------------
//   // UPDATE PRODUCT
//   // -------------------------------
//   const updateProduct = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/products/${editingProduct._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(editingProduct),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         alert("Update failed: " + data.message);
//         return;
//       }

//       closeEditModal();
//       alert("Product updated successfully!");

//       // Refresh product list from backend
//       onRefresh();
//     } catch (err) {
//       console.error("Update error:", err);
//     }
//   };

//   // -------------------------------
//   // DELETE PRODUCT
//   // -------------------------------
//   const onDelete = async (id) => {
//     if (!window.confirm("Delete this product?")) return;

//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/products/${id}`,
//         { method: "DELETE" }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         alert("Delete failed: " + data.message);
//         return;
//       }

//       alert("Product deleted!");

//       // Refresh product list from backend
//       onRefresh();
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   // -------------------------------
//   // FILTERED PRODUCTS (NO ERRORS)
//   // -------------------------------
//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       !searchTerm ||
//       product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.asin?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesFilters =
//       (filters.status === "all" || product.status === filters.status) &&
//       (filters.fulfillment === "all" ||
//         product.fulfillment === filters.fulfillment) &&
//       (filters.buyBox === "all" ||
//         (filters.buyBox === "winning" && product.buyBox) ||
//         (filters.buyBox === "losing" && !product.buyBox));

//     return matchesSearch && matchesFilters;
//   });
//     // const [showCreate, setShowCreate] = useState(false);


//   // -------------------------------
//   // PAGINATION CALCULATIONS
//   // -------------------------------
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const currentProducts = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Reset to first page when filters or search change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filters]);

//   return (
//     <div className="space-y-4 lg:space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
//         <div className="w-full sm:w-auto">
//           <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Manage Inventory</h2>
//           <p className="text-gray-600 text-xs sm:text-sm mt-1">
//             {products.length} products • {products.filter(p => p.status === 'active').length} active
//           </p>
//         </div>
        
//         <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-normal">
//           <div className="flex border border-gray-300 rounded-lg">
//             <button
//               onClick={() => setViewMode('grid')}
//               className={`p-1 sm:p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
//             >
//               <Grid size={14} className="sm:w-4 sm:h-4" />
//             </button>
//             <button
//               onClick={() => setViewMode('list')}
//               className={`p-1 sm:p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
//             >
//               <List size={14} className="sm:w-4 sm:h-4" />
//             </button>
//           </div>
          
//           <button
//             onClick={onRefresh}
//             className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             <RotateCcw size={14} className="sm:w-4 sm:h-4" />
//             <span className="hidden xs:inline">Refresh</span>
//           </button>
//         </div>
//       </div>

//       {/* Enhanced Filters */}
//       <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//         <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
//           <div className="lg:col-span-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
//               <input
//                 type="text"
//                 placeholder="Search by title, SKU, or ASIN..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//               />
//             </div>
//           </div>
          
//           <select
//             value={filters.buyBox}
//             onChange={(e) => setFilters({ ...filters, buyBox: e.target.value })}
//             className="border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//           >
//             <option value="all">All Buy Box</option>
//             <option value="winning">Buy Box Winning</option>
//             <option value="losing">Buy Box Losing</option>
//           </select>
          
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
          
//           <select
//             value={filters.fulfillment}
//             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
//             className="border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//           >
//             <option value="all">All Fulfillment</option>
//             <option value="FBA">FBA Only</option>
//             <option value="FBM">FBM Only</option>
//           </select>
//         </div>
//       </div>

//       {/* Enhanced Product Table */}
//       <div className="bg-white rounded-lg border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[800px]">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASIN/SKU</th>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Box</th>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rank</th>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentProducts.map(product => (
//                 <tr key={product.id} className="hover:bg-gray-50">
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                         <Package size={16} className="sm:w-5 sm:h-5 text-orange-600" />
//                       </div>
//                       <div className="ml-2 sm:ml-4">
//                         <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">{product.title}</div>
//                         <div className="text-xs text-gray-500">{product.brand}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
//                     <div className="text-xs sm:text-sm text-gray-900 font-mono">{product.asin}</div>
//                     <div className="text-xs text-gray-500">SKU: {product.sku}</div>
//                   </td>
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600">
//                     ${product.price}
//                   </td>
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
//                     <PerformanceBadge type="buyBox" value={product.buyBoxPercentage} />
//                     <div className="text-xs text-gray-500 mt-1">{product.buyBoxPercentage}%</div>
//                   </td>
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
//                     {product.salesRank?.toLocaleString() || 'N/A'}
//                   </td>
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
//                     <div className="flex items-center">
//                       <Star size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-400 fill-current" />
//                       <span className="ml-1 text-xs sm:text-sm text-gray-900">{product.rating}</span>
//                       <span className="ml-1 text-xs sm:text-sm text-gray-500">({product.reviews})</span>
//                     </div>
//                   </td>
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
//                     <div className={`text-xs sm:text-sm font-semibold ${
//                       product.quantity < 10 ? 'text-red-600' : 'text-gray-900'
//                     }`}>
//                       {product.quantity}
//                     </div>
//                   </td>
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
//                     <PerformanceBadge type="inventory" value={product.quantity} />
//                   </td>
//                   <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
//                     <div className="flex flex-col xs:flex-row xs:space-x-1 sm:space-x-2 space-y-1 xs:space-y-0">
//                       <button
//                         onClick={() => openEditModal(product)}
//                         className="text-blue-600 hover:text-blue-900 px-1 py-0.5 text-left"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => onDelete(product._id)}
//                         className="text-red-600 hover:text-red-900 px-1 py-0.5 text-left"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Responsive Pagination */}
//         <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 gap-3 sm:gap-0">
//           <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-2">
//             <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
//               Showing{" "}
//               <span className="font-medium">
//                 {(currentPage - 1) * itemsPerPage + 1}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium">
//                 {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
//               </span>{" "}
//               of <span className="font-medium">{filteredProducts.length}</span>
//             </span>
            
//             {/* Items per page selector */}
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//             >
//               <option value={10}>10 / page</option>
//               <option value={25}>25 / page</option>
//               <option value={50}>50 / page</option>
//               <option value={100}>100 / page</option>
//             </select>
//           </div>

//           <div className="flex items-center space-x-1 sm:space-x-2">
//             {/* Previous Button */}
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-2 sm:px-3 py-1 rounded border text-xs sm:text-sm font-medium ${
//                 currentPage === 1
//                   ? "text-gray-400 bg-gray-100 cursor-not-allowed"
//                   : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
//               }`}
//             >
//               Prev
//             </button>

//             {/* Page Numbers - Responsive */}
//             <div className="flex items-center space-x-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter(page => {
//                   // On mobile, show fewer pages
//                   if (window.innerWidth < 640) {
//                     return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
//                   }
//                   // On tablet/desktop, show more pages
//                   if (page <= 2) return true;
//                   if (page > totalPages - 2) return true;
//                   if (Math.abs(page - currentPage) <= 1) return true;
//                   return false;
//                 })
//                 .map((page, index, array) => {
//                   const showEllipsis = index > 0 && page - array[index - 1] > 1;
//                   return (
//                     <div key={page} className="flex items-center">
//                       {showEllipsis && (
//                         <span className="px-1 sm:px-2 text-gray-500 text-xs">...</span>
//                       )}
//                       <button
//                         onClick={() => setCurrentPage(page)}
//                         className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium ${
//                           currentPage === page
//                             ? "bg-orange-600 text-white border-orange-600"
//                             : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
//                         } border`}
//                       >
//                         {page}
//                       </button>
//                     </div>
//                   );
//                 })}
//             </div>

//             {/* Next Button */}
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className={`px-2 sm:px-3 py-1 rounded border text-xs sm:text-sm font-medium ${
//                 currentPage === totalPages
//                   ? "text-gray-400 bg-gray-100 cursor-not-allowed"
//                   : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Responsive Edit Modal */}
//       {editModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3 sm:p-4">
//           <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-md lg:w-96 shadow-lg overflow-y-auto max-h-[90vh]">
//             <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Edit Product</h2>

//             {/* Title */}
//             <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">Title</label>
//             <input
//               type="text"
//               value={editingProduct.title}
//               onChange={(e) =>
//                 setEditingProduct({ ...editingProduct, title: e.target.value })
//               }
//               className="w-full border px-3 py-2 rounded text-xs sm:text-sm mb-2 sm:mb-3"
//             />

//             {/* Price */}
//             <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">Price</label>
//             <input
//               type="number"
//               value={editingProduct.price}
//               onChange={(e) =>
//                 setEditingProduct({ ...editingProduct, price: e.target.value })
//               }
//               className="w-full border px-3 py-2 rounded text-xs sm:text-sm mb-2 sm:mb-3"
//             />

//             {/* Quantity */}
//             <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">Quantity</label>
//             <input
//               type="number"
//               value={editingProduct.quantity}
//               onChange={(e) =>
//                 setEditingProduct({ ...editingProduct, quantity: e.target.value })
//               }
//               className="w-full border px-3 py-2 rounded text-xs sm:text-sm mb-3 sm:mb-4"
//             />

//             {/* Image Section */}
//             <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">Main Image</label>
//             {editingProduct.mainImage && (
//               <img
//                 src={editingProduct.mainImage}
//                 alt="Main"
//                 className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded mb-2"
//               />
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   const url = URL.createObjectURL(file);
//                   setEditingProduct({ ...editingProduct, mainImage: url });
//                 }
//               }}
//               className="w-full border px-3 py-2 rounded text-xs sm:text-sm mb-3 sm:mb-4"
//             />

//             {/* Additional Images */}
//             <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">Additional Images</label>
//             <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
//               {editingProduct.additionalImages?.map((img, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={img}
//                     alt="Additional"
//                     className="w-12 h-12 sm:w-20 sm:h-20 object-cover rounded border"
//                   />
//                   <button
//                     onClick={() => {
//                       const updated = editingProduct.additionalImages.filter(
//                         (_, i) => i !== index
//                       );
//                       setEditingProduct({ ...editingProduct, additionalImages: updated });
//                     }}
//                     className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={(e) => {
//                 const files = Array.from(e.target.files);
//                 const urls = files.map((file) => URL.createObjectURL(file));
//                 setEditingProduct({
//                   ...editingProduct,
//                   additionalImages: [...(editingProduct.additionalImages || []), ...urls],
//                 });
//               }}
//               className="w-full border px-3 py-2 rounded text-xs sm:text-sm mb-3 sm:mb-4"
//             />

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-3 sm:px-4 py-2 bg-gray-300 rounded text-xs sm:text-sm"
//                 onClick={closeEditModal}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded text-xs sm:text-sm"
//                 onClick={updateProduct}
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Additional View Components
// function PricingView({ products }) {
//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4">
//         <div className="w-full xs:w-auto">
//           <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Pricing & Buy Box</h2>
//           <p className="text-gray-600 text-xs sm:text-sm mt-1 hidden xs:block">
//             Manage pricing strategies and buy box performance
//           </p>
//         </div>
        
//         {/* Action Buttons */}
//         <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
//           <button className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded text-xs sm:text-sm hover:bg-orange-700 transition-colors w-full xs:w-auto">
//             Reprice All
//           </button>
//           <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-300 transition-colors w-full xs:w-auto">
//             Export Data
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//         {/* Buy Box Win Rate */}
//         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Buy Box Win Rate</h3>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">68%</p>
//           <p className="text-xs text-green-600 mt-1">+5% this week</p>
//         </div>

//         {/* Average Price */}
//         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Avg. Price</h3>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">$24.99</p>
//           <p className="text-xs text-gray-600 mt-1">Market avg: $26.50</p>
//         </div>

//         {/* Products Winning */}
//         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Winning Products</h3>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center">
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">42</p>
//           <p className="text-xs text-gray-600 mt-1">of {products?.length || 0} total</p>
//         </div>

//         {/* Price Changes */}
//         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Price Changes</h3>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">12</p>
//           <p className="text-xs text-gray-600 mt-1">Today</p>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//         {/* Pricing Rules Panel */}
//         <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
//             <h3 className="text-lg sm:text-xl font-semibold">Pricing Rules</h3>
//             <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto">
//               Add New Rule
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             {/* Rule 1 */}
//             <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
//                 <div>
//                   <h4 className="font-medium text-sm sm:text-base">Match Lowest Competitor</h4>
//                   <p className="text-xs sm:text-sm text-gray-600 mt-1">Match the lowest FBA seller price</p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
//                   <button className="text-gray-400 hover:text-gray-600">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Rule 2 */}
//             <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
//                 <div>
//                   <h4 className="font-medium text-sm sm:text-base">Beat by $0.01</h4>
//                   <p className="text-xs sm:text-sm text-gray-600 mt-1">Price $0.01 below lowest competitor</p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
//                   <button className="text-gray-400 hover:text-gray-600">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions Sidebar */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
//           <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Quick Actions</h3>
          
//           <div className="space-y-3">
//             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               <span>Run Price Analysis</span>
//             </button>

//             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//               <span>View Price History</span>
//             </button>

//             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>Schedule Repricing</span>
//             </button>
//           </div>

//           {/* Recent Activity */}
//           <div className="mt-6 sm:mt-8">
//             <h4 className="font-medium text-sm sm:text-base mb-3 sm:mb-4">Recent Activity</h4>
//             <div className="space-y-2 sm:space-y-3">
//               <div className="text-xs sm:text-sm text-gray-600">
//                 <p>Price updated for ASIN B08XYZ123</p>
//                 <p className="text-gray-400">2 hours ago</p>
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600">
//                 <p>Buy box lost for ASIN B08ABC456</p>
//                 <p className="text-gray-400">4 hours ago</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Coming Soon Notice */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
//         <div className="flex items-start space-x-3">
//           <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//             <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <div>
//             <h3 className="font-medium text-blue-900 text-sm sm:text-base">Enhanced Features Coming Soon</h3>
//             <p className="text-blue-700 text-xs sm:text-sm mt-1">
//               Advanced pricing analytics, competitor tracking, and automated repricing strategies are in development.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// function OrdersView() {
//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4">
//         <div>
//           <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Order Management</h2>
//           <p className="text-gray-600 text-xs sm:text-sm mt-1 hidden xs:block">
//             Track and manage your Amazon orders
//           </p>
//         </div>
        
//         {/* Action Buttons */}
//         <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
//           <button className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded text-xs sm:text-sm hover:bg-orange-700 transition-colors w-full xs:w-auto flex items-center justify-center space-x-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             <span>Sync Orders</span>
//           </button>
//           <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-300 transition-colors w-full xs:w-auto flex items-center justify-center space-x-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <span>Export</span>
//           </button>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//         {/* Total Orders */}
//         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Orders</h3>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">1,247</p>
//           <p className="text-xs text-green-600 mt-1">+12% this week</p>
//         </div>

//         {/* Pending Fulfillment */}
//         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Pending</h3>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center">
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">23</p>
//           <p className="text-xs text-gray-600 mt-1">Need attention</p>
//         </div>

//         {/* Shipped Today */}
//         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Shipped Today</h3>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">45</p>
//           <p className="text-xs text-gray-600 mt-1">On track</p>
//         </div>

//         {/* Revenue */}
//         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Revenue</h3>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">$2,847</p>
//           <p className="text-xs text-gray-600 mt-1">Today</p>
//         </div>
//       </div>

//       {/* Filter Bar */}
//       <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
//         <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
//           {/* Search */}
//           <div className="flex-1">
//             <div className="relative">
//               <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//               />
//             </div>
//           </div>
          
//           {/* Filters */}
//           <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
//             <select className="border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
//               <option>All Status</option>
//               <option>Pending</option>
//               <option>Shipped</option>
//               <option>Delivered</option>
//               <option>Cancelled</option>
//             </select>
            
//             <select className="border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
//               <option>All Channels</option>
//               <option>Amazon</option>
//               <option>Walmart</option>
//               <option>eBay</option>
//             </select>
            
//             <input
//               type="date"
//               className="border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
//           <h3 className="text-lg sm:text-xl font-semibold">Recent Orders</h3>
//           <div className="flex items-center space-x-2 text-xs sm:text-sm">
//             <span className="text-gray-600">Last updated: 2 hours ago</span>
//             <button className="text-orange-600 hover:text-orange-700">Refresh</button>
//           </div>
//         </div>
        
//         {/* Order Management Component */}
//         <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
//           <AmazonOrderManagement />
//         </div>
//       </div>

//       {/* Quick Actions Panel */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         {/* Bulk Actions */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
//           <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Bulk Actions</h3>
//           <div className="space-y-2">
//             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//               <span>Mark as Shipped</span>
//             </button>
//             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//               <span>Cancel Orders</span>
//             </button>
//           </div>
//         </div>

//         {/* Order Alerts */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
//           <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Order Alerts</h3>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded border border-yellow-200">
//               <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
//                 <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs sm:text-sm font-medium text-yellow-800">3 orders need shipping</p>
//                 <p className="text-xs text-yellow-600">Past due date</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 p-2 bg-red-50 rounded border border-red-200">
//               <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//                 <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs sm:text-sm font-medium text-red-800">1 cancelled order</p>
//                 <p className="text-xs text-red-600">Requires refund</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Performance Metrics */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
//           <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Performance</h3>
//           <div className="space-y-3">
//             <div>
//               <div className="flex justify-between text-xs sm:text-sm">
//                 <span className="text-gray-600">Fulfillment Rate</span>
//                 <span className="font-medium">98.2%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//                 <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.2%' }}></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-xs sm:text-sm">
//                 <span className="text-gray-600">On-Time Delivery</span>
//                 <span className="font-medium">94.7%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//                 <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.7%' }}></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-xs sm:text-sm">
//                 <span className="text-gray-600">Customer Satisfaction</span>
//                 <span className="font-medium">4.8/5</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//                 <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // function AdvertisingView() {
// //   return (
// //     <div className="space-y-4 sm:space-y-6">
// //       {/* Header Section */}
// //       <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4">
// //         <div>
// //           <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Advertising Campaigns</h2>
// //           <p className="text-gray-600 text-xs sm:text-sm mt-1 hidden xs:block">
// //             Manage your Amazon PPC campaigns and advertising performance
// //           </p>
// //         </div>
        
// //         {/* Action Buttons */}
// //         <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
// //           <button className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded text-xs sm:text-sm hover:bg-orange-700 transition-colors w-full xs:w-auto flex items-center justify-center space-x-2">
// //             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //             </svg>
// //             <span>New Campaign</span>
          

// //           </button>

       

  
// //           <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-300 transition-colors w-full xs:w-auto flex items-center justify-center space-x-2">
// //             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// //             </svg>
// //             <span>Sync Data</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Campaign Stats */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
// //         {/* Total Spend */}
// //         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
// //           <div className="flex items-center justify-between">
// //             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Spend</h3>
// //             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
// //               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
// //               </svg>
// //             </div>
// //           </div>
// //           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">$2,847</p>
// //           <p className="text-xs text-green-600 mt-1">This month</p>
// //         </div>

// //         {/* ROAS */}
// //         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
// //           <div className="flex items-center justify-between">
// //             <h3 className="text-xs sm:text-sm font-medium text-gray-500">ROAS</h3>
// //             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
// //               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
// //               </svg>
// //             </div>
// //           </div>
// //           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">4.2x</p>
// //           <p className="text-xs text-gray-600 mt-1">Return on ad spend</p>
// //         </div>

// //         {/* ACOS */}
// //         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
// //           <div className="flex items-center justify-between">
// //             <h3 className="text-xs sm:text-sm font-medium text-gray-500">ACOS</h3>
// //             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center">
// //               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
// //               </svg>
// //             </div>
// //           </div>
// //           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">18.5%</p>
// //           <p className="text-xs text-green-600 mt-1">Below target</p>
// //         </div>

// //         {/* Impressions */}
// //         <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
// //           <div className="flex items-center justify-between">
// //             <h3 className="text-xs sm:text-sm font-medium text-gray-500">Impressions</h3>
// //             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
// //               <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //               </svg>
// //             </div>
// //           </div>
// //           <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">245K</p>
// //           <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
// //         </div>
// //       </div>

// //       {/* Main Content Grid */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
// //         {/* Campaign Performance */}
// //         <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
// //           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
// //             <h3 className="text-lg sm:text-xl font-semibold">Campaign Performance</h3>
// //             <div className="flex items-center space-x-2">
// //               <select className="border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
// //                 <option>Last 7 days</option>
// //                 <option>Last 30 days</option>
// //                 <option>Last 90 days</option>
// //               </select>
// //             </div>
// //           </div>
          
// //           {/* Performance Chart Placeholder */}
// //           <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sm:p-8 flex items-center justify-center">
// //             <div className="text-center">
// //               <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
// //               </svg>
// //               <p className="text-gray-600 text-sm sm:text-base">Performance charts coming soon</p>
// //               <p className="text-gray-500 text-xs sm:text-sm mt-1">ROAS, ACOS, and spend trends</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Quick Actions */}
// //         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
// //           <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Quick Actions</h3>
          
// //           <div className="space-y-3">
// //             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
// //               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
// //               </svg>
// //               <span>Analyze Keywords</span>
// //             </button>

// //             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
// //               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //               <span>Schedule Reports</span>
// //             </button>

// //             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
// //               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
// //               </svg>
// //               <span>Budget Planning</span>
// //             </button>

// //             <button className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded text-xs sm:text-sm text-gray-700 transition-colors flex items-center justify-center space-x-2">
// //               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
// //               </svg>
// //               <span>Export Data</span>
// //             </button>
// //           </div>

// //           {/* Recent Activity */}
// //           <div className="mt-6 sm:mt-8">
// //             <h4 className="font-medium text-sm sm:text-base mb-3 sm:mb-4">Recent Activity</h4>
// //             <div className="space-y-2 sm:space-y-3">
// //               <div className="text-xs sm:text-sm text-gray-600">
// //                 <p>Campaign "Summer Sale" paused</p>
// //                 <p className="text-gray-400">2 hours ago</p>
// //               </div>
// //               <div className="text-xs sm:text-sm text-gray-600">
// //                 <p>Budget increased for "Product Launch"</p>
// //                 <p className="text-gray-400">5 hours ago</p>
// //               </div>
// //               <div className="text-xs sm:text-sm text-gray-600">
// //                 <p>New keyword added to "Auto Parts"</p>
// //                 <p className="text-gray-400">Yesterday</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Active Campaigns */}
// //       <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
// //           <h3 className="text-lg sm:text-xl font-semibold">Active Campaigns</h3>
// //           <button className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700 transition-colors flex items-center space-x-2">
// //             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //             </svg>
// //             <span>Create Campaign</span>
// //           </button>
// //         </div>

// //         {/* Campaign List */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //           {/* Campaign Card 1 */}
// //           <div className="border border-gray-200 rounded-lg p-4">
// //             <div className="flex justify-between items-start mb-3">
// //               <h4 className="font-medium text-sm sm:text-base">Summer Sale 2024</h4>
// //               <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
// //             </div>
// //             <div className="space-y-2 text-xs sm:text-sm">
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">Spend:</span>
// //                 <span className="font-medium">$1,247</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">ROAS:</span>
// //                 <span className="font-medium text-green-600">4.8x</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">ACOS:</span>
// //                 <span className="font-medium text-orange-600">16.2%</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Campaign Card 2 */}
// //           <div className="border border-gray-200 rounded-lg p-4">
// //             <div className="flex justify-between items-start mb-3">
// //               <h4 className="font-medium text-sm sm:text-base">Product Launch</h4>
// //               <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
// //             </div>
// //             <div className="space-y-2 text-xs sm:text-sm">
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">Spend:</span>
// //                 <span className="font-medium">$892</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">ROAS:</span>
// //                 <span className="font-medium text-green-600">3.2x</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">ACOS:</span>
// //                 <span className="font-medium text-orange-600">22.1%</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Campaign Card 3 */}
// //           <div className="border border-gray-200 rounded-lg p-4">
// //             <div className="flex justify-between items-start mb-3">
// //               <h4 className="font-medium text-sm sm:text-base">Brand Awareness</h4>
// //               <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Paused</span>
// //             </div>
// //             <div className="space-y-2 text-xs sm:text-sm">
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">Spend:</span>
// //                 <span className="font-medium">$456</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">ROAS:</span>
// //                 <span className="font-medium text-red-600">1.8x</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">ACOS:</span>
// //                 <span className="font-medium text-red-600">38.5%</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Coming Soon Notice */}
// //       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
// //         <div className="flex items-start space-x-3">
// //           <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
// //             <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //             </svg>
// //           </div>
// //           <div>
// //             <h3 className="font-medium text-blue-900 text-sm sm:text-base">Enhanced Advertising Features Coming Soon</h3>
// //             <p className="text-blue-700 text-xs sm:text-sm mt-1">
// //               Advanced campaign automation, AI-powered bidding strategies, and cross-channel analytics are in development.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// function AdvertisingView() {
//   const [showCreate, setShowCreate] = useState(false);
//   const [campaigns, setCampaigns] = useState([]);

//   // Load campaigns from backend
//   useEffect(() => {
//     fetch("/api/campaigns")
//       .then(res => res.json())
//       .then(data => setCampaigns(data))
//       .catch(err => console.error("Error loading campaigns:", err));
//   }, []);

//   // Form State
//   const [form, setForm] = useState({
//     name: "",
//     budget: "",
//     target: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Submit campaign
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch("/api/campaigns", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const newCampaign = await res.json();
//     setCampaigns([newCampaign, ...campaigns]); // update list instantly
//     setShowCreate(false);
//   };

//   const shareWhatsApp = (campaign) => {
//     const text = `📢 *New Campaign: ${campaign.name}*\n\nBudget: ${campaign.budget}\nTarget: ${campaign.target}`;
//     const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
//     window.open(url, "_blank");
//   };

//   return (
//     <div className="space-y-4 sm:space-y-6">

//       {/* ---------------------- NEW CAMPAIGN BUTTON ---------------------- */}
//       <div className="flex justify-end">
//         <button
//           onClick={() => setShowCreate(true)}
//           className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center space-x-2"
//         >
//           <span>New Campaign</span>
//         </button>
//       </div>

//       {/* ---------------------- POPUP / MODAL ---------------------- */}
//       {showCreate && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">

//             {/* CLOSE BUTTON */}
//             <button
//               onClick={() => setShowCreate(false)}
//               className="absolute top-3 right-3 text-gray-600 hover:text-black"
//             >
//               ✕
//             </button>

//             <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>

//             {/* FORM */}
//             <form onSubmit={handleSubmit} className="space-y-4">

//               <div>
//                 <label className="text-sm font-medium">Campaign Name</label>
//                 <input
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                   placeholder="Enter campaign name"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Budget ($)</label>
//                 <input
//                   name="budget"
//                   value={form.budget}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                   placeholder="Enter budget"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Target Audience</label>
//                 <input
//                   name="target"
//                   value={form.target}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                   placeholder="Enter target audience"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//               >
//                 Create Campaign
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ---------------------- ACTIVE CAMPAIGNS LIST ---------------------- */}
//       <div className="bg-white rounded-lg border p-4">
//         <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

//           {campaigns.map((c) => (
//             <div key={c._id} className="border rounded-lg p-4">
//               <div className="flex justify-between items-start mb-3">
//                 <h4 className="font-medium">{c.name}</h4>
//                 <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
//                   Active
//                 </span>
//               </div>

//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Budget:</span>
//                   <span className="font-medium">${c.budget}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Target:</span>
//                   <span className="font-medium">{c.target}</span>
//                 </div>
//               </div>

//               {/* WhatsApp Share */}
//               <button
//                 onClick={() => shareWhatsApp(c)}
//                 className="mt-3 w-full bg-green-500 text-white rounded py-1 text-sm hover:bg-green-600"
//               >
//                 Share on WhatsApp
//               </button>
//             </div>
//           ))}

//         </div>
//       </div>
//     </div>
//   );
// }


// function ReportsView() {
//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Analytics & Reports</h1>
//           <p className="text-gray-600 text-sm mt-2">Track performance metrics and generate business insights</p>
//         </div>
        
//         <div className="flex flex-col xs:flex-row gap-3">
//           <button className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <span>Generate Report</span>
//           </button>
//           <button className="px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//             </svg>
//             <span>Schedule</span>
//           </button>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         {/* Total Revenue */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
//             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">$24,847</p>
//           <div className="flex items-center mt-2">
//             <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
//             </svg>
//             <span className="text-sm text-green-600 font-medium ml-1">+12.4%</span>
//             <span className="text-sm text-gray-500 ml-2">vs last month</span>
//           </div>
//         </div>

//         {/* Orders */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">1,247</p>
//           <div className="flex items-center mt-2">
//             <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
//             </svg>
//             <span className="text-sm text-green-600 font-medium ml-1">+8.2%</span>
//             <span className="text-sm text-gray-500 ml-2">vs last month</span>
//           </div>
//         </div>

//         {/* Conversion Rate */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
//             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">3.8%</p>
//           <div className="flex items-center mt-2">
//             <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
//             </svg>
//             <span className="text-sm text-green-600 font-medium ml-1">+0.4%</span>
//             <span className="text-sm text-gray-500 ml-2">vs last month</span>
//           </div>
//         </div>

//         {/* Average Order Value */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
//             <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">$45.99</p>
//           <div className="flex items-center mt-2">
//             <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//             <span className="text-sm text-red-600 font-medium ml-1">-2.1%</span>
//             <span className="text-sm text-gray-500 ml-2">vs last month</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Reports & Analytics */}
//         <div className="xl:col-span-2 space-y-6">
//           {/* Date Range Filter */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//               <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
//                   <option>Last 7 days</option>
//                   <option>Last 30 days</option>
//                   <option>Last 90 days</option>
//                   <option>Year to date</option>
//                 </select>
//                 <div className="flex gap-2">
//                   <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
//                     Export
//                   </button>
//                   <button className="px-3 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-lg hover:bg-orange-600">
//                     Refresh
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Chart Placeholder */}
//             <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-8 flex items-center justify-center">
//               <div className="text-center">
//                 <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//                 <h4 className="text-lg font-medium text-gray-900 mb-2">Sales Performance</h4>
//                 <p className="text-gray-600 text-sm">Revenue trends and order metrics visualization</p>
//               </div>
//             </div>
//           </div>

//           {/* Report Types */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Sales Report */}
//               <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Sales Summary</h4>
//                     <p className="text-gray-600 text-sm mt-1">Daily revenue and order metrics</p>
//                   </div>
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <div className="flex items-center mt-3 text-sm text-gray-500">
//                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Updated 2 hours ago
//                 </div>
//               </div>

//               {/* Inventory Report */}
//               <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Inventory Status</h4>
//                     <p className="text-gray-600 text-sm mt-1">Stock levels and replenishment needs</p>
//                   </div>
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                   </svg>
//                 </div>
//                 <div className="flex items-center mt-3 text-sm text-gray-500">
//                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Updated 4 hours ago
//                 </div>
//               </div>

//               {/* Advertising Report */}
//               <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Advertising Performance</h4>
//                     <p className="text-gray-600 text-sm mt-1">ROAS, ACOS, and campaign metrics</p>
//                   </div>
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 </div>
//                 <div className="flex items-center mt-3 text-sm text-gray-500">
//                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Updated 1 hour ago
//                 </div>
//               </div>

//               {/* Customer Report */}
//               <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Customer Insights</h4>
//                     <p className="text-gray-600 text-sm mt-1">Demographics and purchase behavior</p>
//                   </div>
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//                 <div className="flex items-center mt-3 text-sm text-gray-500">
//                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Updated yesterday
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Scheduled Reports */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <p className="font-medium text-sm">Daily Sales Report</p>
//                   <p className="text-gray-600 text-xs">PDF, 8:00 AM</p>
//                 </div>
//                 <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <p className="font-medium text-sm">Weekly Inventory</p>
//                   <p className="text-gray-600 text-xs">Excel, Mondays</p>
//                 </div>
//                 <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <p className="font-medium text-sm">Monthly Performance</p>
//                   <p className="text-gray-600 text-xs">PDF, 1st of month</p>
//                 </div>
//                 <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Paused</span>
//               </div>
//             </div>
//             <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors">
//               + Schedule New Report
//             </button>
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
//             <div className="space-y-3">
//               <div className="flex items-start space-x-3">
//                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                   <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Sales report generated</p>
//                   <p className="text-gray-600 text-xs">2 hours ago</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//                   <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Inventory report exported</p>
//                   <p className="text-gray-600 text-xs">4 hours ago</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
//                   <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">New report scheduled</p>
//                   <p className="text-gray-600 text-xs">Yesterday</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main App Component
// export default function AmazonSellerCentral() {
//   const [currentView, setCurrentView] = useState('dashboard');
//   const [products, setProducts] = useState([]);
//   const [analytics, setAnalytics] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [productsData, analyticsData] = await Promise.all([
//         API.getProducts(),
//         API.getProductAnalytics()
//       ]);
//       setProducts(productsData);
//       setAnalytics(analyticsData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
// const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// // const [currentView, setCurrentView] = useState("dashboard");

//   const renderCurrentView = () => {
//     switch (currentView) {
//       case 'dashboard':
//         return <Dashboard stats={{}} products={products} analytics={analytics} />;
//       case 'inventory':
//         return <ProductList products={products} onRefresh={loadData} onEdit={(product) => console.log('Edit:', product)} />;
//       case 'pricing':
//         return <PricingView products={products} />;
//       case 'orders':
//         return <OrdersView />;
//       case 'advertising':
//         return <AdvertisingView />;
//       case 'reports':
//         return <ReportsView />;
//       case 'add-product':
//         return <CreateProduct onSuccess={() => {
//           loadData();
//           setCurrentView('inventory');
//         }} />;
//       default:
//         return <Dashboard stats={{}} products={products} analytics={analytics} />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading Amazon Seller Central...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//     <div className="flex h-screen bg-gray-50">

//   {/* ===================== SIDEBAR ===================== */}
//  <Sidebar currentView={currentView} setCurrentView={setCurrentView} />


//   {/* ======== BACKDROP for MOBILE ======== */}
//   {mobileMenuOpen && (
//     <div
//       onClick={() => setMobileMenuOpen(false)}
//       className="fixed inset-0 bg-black/30 z-30 md:hidden"
//     ></div>
//   )}

//   {/* ===================== MAIN AREA ===================== */}
//   <div className="flex-1 flex flex-col md:ml-64">

//     {/* TOP HEADER */}
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
//       <div className="flex items-center justify-between px-6 h-16">

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setMobileMenuOpen(true)}
//           className="md:hidden p-2 border rounded hover:bg-gray-100"
//         >
//           <Menu size={20} className="text-gray-800" />
//         </button>

//         {/* Search */}
//         <div className="relative w-full max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none"
//           />
//         </div>

//       </div>
//     </header>

//     {/* CONTENT AREA */}
//     <main className="p-6 overflow-y-auto">
//       { /* Your dashboard / pages will render here */ }
//     </main>

//   </div>
// </div>



//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {renderCurrentView()}
//       </main>

//       {/* Floating Action Button */}
//       <button
//         onClick={() => setCurrentView('add-product')}
//         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
//       >
//         <Plus size={24} />
//       </button>
//     </div>
//   );
// }