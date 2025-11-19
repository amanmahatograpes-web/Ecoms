// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Upload, Download, Filter, ChevronDown, ChevronRight, Package, AlertTriangle, TrendingUp, ShoppingCart, Edit, Trash2, DollarSign, BarChart3 } from 'lucide-react';

// // Mock API Service
// const API = {
//   async getProducts() {
//     const stored = localStorage.getItem('products');
//     return stored ? JSON.parse(stored) : [];
//   },
  
//   async saveProducts(products) {
//     localStorage.setItem('products', JSON.stringify(products));
//     return products;
//   },
  
//   async createProduct(product) {
//     const products = await this.getProducts();
//     const newProduct = { ...product, id: Date.now().toString(), createdAt: new Date().toISOString() };
//     products.push(newProduct);
//     await this.saveProducts(products);
//     return newProduct;
//   },
  
//   async updateProduct(id, updates) {
//     const products = await this.getProducts();
//     const index = products.findIndex(p => p.id === id);
//     if (index !== -1) {
//       products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
//       await this.saveProducts(products);
//       return products[index];
//     }
//     throw new Error('Product not found');
//   },
  
//   async deleteProduct(id) {
//     const products = await this.getProducts();
//     const filtered = products.filter(p => p.id !== id);
//     await this.saveProducts(filtered);
//     return true;
//   },
  
//   async bulkUpdate(ids, updates) {
//     const products = await this.getProducts();
//     ids.forEach(id => {
//       const index = products.findIndex(p => p.id === id);
//       if (index !== -1) {
//         products[index] = { ...products[index], ...updates };
//       }
//     });
//     await this.saveProducts(products);
//     return true;
//   }
// };

// // Main App Component
// export default function AmazonProductManager() {
//   const [view, setView] = useState('dashboard');
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     fulfillment: 'all'
//   });

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     setLoading(true);
//     const data = await API.getProducts();
//     setProducts(data);
//     setLoading(false);
//   };

//   const stats = {
//     total: products.length,
//     active: products.filter(p => p.status === 'active').length,
//     outOfStock: products.filter(p => p.quantity === 0).length,
//     ipiScore: 750
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Product Manager</h1>
//           <nav className="flex gap-4">
//             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Dashboard
//             </button>
//             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Products
//             </button>
//             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Create Product
//             </button>
//             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Reports
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
//         {view === 'products' && (
//           <ProductList
//             products={products}
//             filters={filters}
//             setFilters={setFilters}
//             selectedProducts={selectedProducts}
//             setSelectedProducts={setSelectedProducts}
//             onRefresh={loadProducts}
//             setView={setView}
//           />
//         )}
//         {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); setView('products'); }} />}
//         {view === 'reports' && <Reports products={products} />}
//       </main>

//       {/* Floating Action Button */}
//       <button
//         onClick={() => setView('create')}
//         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
//       >
//         <Plus size={24} />
//       </button>
//     </div>
//   );
// }

// // Dashboard Component
// function Dashboard({ stats, products }) {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Dashboard</h2>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
//         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
//         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
//         <StatCard title="IPI Score" value={stats.ipiScore} icon={<BarChart3 />} color="bg-purple-500" />
//       </div>

//       {/* Top Products */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-bold mb-4">Top Performing Products</h3>
//         <div className="space-y-2">
//           {products.slice(0, 5).map(product => (
//             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
//               <div>
//                 <p className="font-semibold">{product.title}</p>
//                 <p className="text-sm text-gray-500">SKU: {product.sku}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-green-600">${product.price}</p>
//                 <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-500 text-sm">{title}</p>
//           <p className="text-3xl font-bold mt-2">{value}</p>
//         </div>
//         <div className={`${color} text-white p-3 rounded-lg`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Product List Component
// function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh, setView }) {
//   const [expandedProducts, setExpandedProducts] = useState([]);

//   const filteredProducts = products.filter(p => {
//     const matchesSearch = !filters.search || 
//       p.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
//       p.sku?.toLowerCase().includes(filters.search.toLowerCase()) ||
//       p.asin?.toLowerCase().includes(filters.search.toLowerCase());
    
//     const matchesStatus = filters.status === 'all' || p.status === filters.status;
//     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
//     return matchesSearch && matchesStatus && matchesFulfillment;
//   });

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedProducts(filteredProducts.map(p => p.id));
//     } else {
//       setSelectedProducts([]);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if ((`Delete ${selectedProducts.length} products?`)) {
//       for (const id of selectedProducts) {
//         await API.deleteProduct(id);
//       }
//       setSelectedProducts([]);
//       onRefresh();
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Products</h2>
//         <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//           Refresh
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by Name, SKU, ASIN..."
//               value={filters.search}
//               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//               className="w-full pl-10 pr-4 py-2 border rounded"
//             />
//           </div>
          
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="outofstock">Out of Stock</option>
//             <option value="suppressed">Suppressed</option>
//             <option value="stranded">Stranded</option>
//           </select>
          
//           <select
//             value={filters.fulfillment}
//             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Fulfillment</option>
//             <option value="FBA">FBA</option>
//             <option value="FBM">FBM</option>
//           </select>
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedProducts.length > 0 && (
//         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
//           <span className="font-semibold">{selectedProducts.length} products selected</span>
//           <div className="flex gap-2">
//             <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
//               Delete Selected
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-4 text-left">
//                 <input
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
//                 />
//               </th>
//               <th className="p-4 text-left">Product</th>
//               <th className="p-4 text-left">SKU</th>
//               <th className="p-4 text-left">Status</th>
//               <th className="p-4 text-left">Price</th>
//               <th className="p-4 text-left">Quantity</th>
//               <th className="p-4 text-left">Fulfillment</th>
//               <th className="p-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map(product => (
//               <tr key={product.id} className="border-b hover:bg-gray-50">
//                 <td className="p-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedProducts.includes(product.id)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedProducts([...selectedProducts, product.id]);
//                       } else {
//                         setSelectedProducts(selectedProducts.filter(id => id !== product.id));
//                       }
//                     }}
//                   />
//                 </td>
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
//                       <Package size={20} className="text-gray-400" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">{product.title}</p>
//                       <p className="text-sm text-gray-500">{product.brand}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-4 font-mono text-sm">{product.sku}</td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.status === 'active' ? 'bg-green-100 text-green-800' :
//                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {product.status?.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="p-4 font-semibold">${product.price}</td>
//                 <td className="p-4">
//                   <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
//                     {product.quantity}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {product.fulfillment}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={async () => {
//                         if (('Delete this product?')) {
//                           await API.deleteProduct(product.id);
//                           onRefresh();
//                         }
//                       }}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {filteredProducts.length === 0 && (
//           <div className="p-12 text-center text-gray-500">
//             <Package size={48} className="mx-auto mb-4 text-gray-300" />
//             <p>No products found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Create Product Component (5-Step Form)
// function CreateProduct({ onSuccess }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     // Step 1
//     productIdType: 'ASIN',
//     productId: '',
//     sku: '',
//     brand: '',
//     title: '',
//     category: '',
//     gtinExemption: false,
    
//     // Step 2
//     hasVariations: false,
//     variations: [],
//     bulletPoints: ['', '', '', '', ''],
//     description: '',
//     condition: 'new',
//     dimensions: { length: '', width: '', height: '', weight: '' },
    
//     // Step 3
//     images: [],
//     hasVideo: false,
//     videoUrl: '',
//     hasAPlusContent: false,
    
//     // Step 4
//     price: '',
//     salePrice: '',
//     businessPrice: '',
//     saleStart: '',
//     saleEnd: '',
//     quantity: '',
//     fulfillment: 'FBA',
//     prepSettings: { labeling: 'amazon', polybagging: false },
    
//     // Step 5
//     keywords: '',
//     targetAudience: '',
//     ageRange: '',
//     hasBatteries: false,
//     isHazmat: false,
//     requiresAgeVerification: false,
//     taxCode: '',
//     countryOfOrigin: '',
//     giftOptions: false,
    
//     status: 'active'
//   });

//   const handleSubmit = async () => {
//     try {
//       await API.createProduct(formData);
//       alert('Product created successfully!');
//       onSuccess();
//     } catch (error) {
//       alert('Error creating product: ' + error.message);
//     }
//   };

//   const updateFormData = (updates) => {
//     setFormData({ ...formData, ...updates });
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
//       {/* Progress Steps */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="flex justify-between items-center">
//           {[1, 2, 3, 4, 5].map(s => (
//             <div key={s} className="flex items-center">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
//               }`}>
//                 {s}
//               </div>
//               {s < 5 && <div className={`w-20 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between mt-2 text-sm">
//           <span>Identity</span>
//           <span>Details</span>
//           <span>Images</span>
//           <span>Pricing</span>
//           <span>SEO</span>
//         </div>
//       </div>

//       {/* Form Content */}
//       <div className="bg-white rounded-lg shadow p-6">
//         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
//         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} />}
//         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}
//         {step === 4 && <Step4 formData={formData} updateFormData={updateFormData} />}
//         {step === 5 && <Step5 formData={formData} updateFormData={updateFormData} />}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between mt-8 pt-6 border-t">
//           <button
//             onClick={() => setStep(Math.max(1, step - 1))}
//             disabled={step === 1}
//             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
//           >
//             Previous
//           </button>
          
//           {step < 5 ? (
//             <button
//               onClick={() => setStep(Math.min(5, step + 1))}
//               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Create Product
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Step 1: Product Identity
// function Step1({ formData, updateFormData }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
//           <select
//             value={formData.productIdType}
//             onChange={(e) => updateFormData({ productIdType: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//           >
//             <option value="ASIN">ASIN</option>
//             <option value="UPC">UPC</option>
//             <option value="EAN">EAN</option>
//             <option value="ISBN">ISBN</option>
//           </select>
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID</label>
//           <input
//             type="text"
//             value={formData.productId}
//             onChange={(e) => updateFormData({ productId: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="B08N5WRWNW"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">SKU *</label>
//         <input
//           type="text"
//           value={formData.sku}
//           onChange={(e) => updateFormData({ sku: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="SKU-12345"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Brand *</label>
//         <input
//           type="text"
//           value={formData.brand}
//           onChange={(e) => updateFormData({ brand: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Your Brand Name"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Title * (200 chars max)</label>
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => updateFormData({ title: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Product Title with Key Features"
//           maxLength={200}
//           required
//         />
//         <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 characters</p>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Category *</label>
//         <select
//           value={formData.category}
//           onChange={(e) => updateFormData({ category: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           required
//         >
//           <option value="">Select Category</option>
//           <option value="electronics">Electronics</option>
//           <option value="clothing">Clothing</option>
//           <option value="home">Home & Kitchen</option>
//           <option value="sports">Sports & Outdoors</option>
//           <option value="books">Books</option>
//         </select>
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="gtinExemption"
//           checked={formData.gtinExemption}
//           onChange={(e) => updateFormData({ gtinExemption: e.target.checked })}
//         />
//         <label htmlFor="gtinExemption" className="text-sm">Request GTIN Exemption</label>
//       </div>
//     </div>
//   );
// }

// // Step 2: Details & Variations
// function Step2({ formData, updateFormData }) {
//   const updateBulletPoint = (index, value) => {
//     const newBulletPoints = [...formData.bulletPoints];
//     newBulletPoints[index] = value;
//     updateFormData({ bulletPoints: newBulletPoints });
//   };

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 2: Product Details & Variations</h3>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="hasVariations"
//           checked={formData.hasVariations}
//           onChange={(e) => updateFormData({ hasVariations: e.target.checked })}
//         />
//         <label htmlFor="hasVariations" className="text-sm font-semibold">This product has variations (Size, Color, etc.)</label>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Bullet Points (5 max, 500 chars each)</label>
//         {formData.bulletPoints.map((bullet, index) => (
//           <div key={index} className="mb-3">
//             <textarea
//               value={bullet}
//               onChange={(e) => updateBulletPoint(index, e.target.value)}
//               className="w-full px-4 py-2 border rounded"
//               placeholder={`Feature ${index + 1}`}
//               maxLength={500}
//               rows={2}
//             />
//             <p className="text-xs text-gray-500 mt-1">{bullet.length}/500 characters</p>
//           </div>
//         ))}
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Description</label>
//         <textarea
//           value={formData.description}
//           onChange={(e) => updateFormData({ description: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           rows={6}
//           placeholder="Detailed product description..."
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Condition</label>
//         <select
//           value={formData.condition}
//           onChange={(e) => updateFormData({ condition: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//         >
//           <option value="new">New</option>
//           <option value="used-like-new">Used - Like New</option>
//           <option value="used-very-good">Used - Very Good</option>
//           <option value="used-good">Used - Good</option>
//           <option value="used-acceptable">Used - Acceptable</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Dimensions & Weight</label>
//         <div className="grid grid-cols-4 gap-4">
//           <input
//             type="number"
//             placeholder="Length (in)"
//             value={formData.dimensions.length}
//             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, length: e.target.value } })}
//             className="px-4 py-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Width (in)"
//             value={formData.dimensions.width}
//             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, width: e.target.value } })}
//             className="px-4 py-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Height (in)"
//             value={formData.dimensions.height}
//             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, height: e.target.value } })}
//             className="px-4 py-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Weight (lb)"
//             value={formData.dimensions.weight}
//             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, weight: e.target.value } })}
//             className="px-4 py-2 border rounded"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Step 3: Images & Content
// function Step3({ formData, updateFormData }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 3: Images & Content</h3>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//           <Upload className="mx-auto text-gray-400 mb-4" size={48} />
//           <p className="text-gray-600 mb-2">Drag and drop images here or click to upload</p>
//           <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels or larger</p>
//           <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//             Choose Files
//           </button>
//         </div>
//         <p className="text-xs text-gray-500 mt-2">First image will be the main product image</p>
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="hasVideo"
//           checked={formData.hasVideo}
//           onChange={(e) => updateFormData({ hasVideo: e.target.checked })}
//         />
//         <label htmlFor="hasVideo" className="text-sm font-semibold">Add Product Video</label>
//       </div>

//       {formData.hasVideo && (
//         <div>
//           <label className="block text-sm font-semibold mb-2">Video URL</label>
//           <input
//             type="url"
//             value={formData.videoUrl}
//             onChange={(e) => updateFormData({ videoUrl: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="https://youtube.com/watch?v=..."
//           />
//         </div>
//       )}

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="hasAPlusContent"
//           checked={formData.hasAPlusContent}
//           onChange={(e) => updateFormData({ hasAPlusContent: e.target.checked })}
//         />
//         <label htmlFor="hasAPlusContent" className="text-sm font-semibold">Enable A+ Content</label>
//       </div>

//       <div className="bg-blue-50 border border-blue-200 rounded p-4">
//         <p className="text-sm text-blue-800">
//           <strong>Image Requirements:</strong><br />
//           • JPEG or PNG format<br />
//           • Minimum 1000 x 1000 pixels<br />
//           • Product must fill 85% or more of the image<br />
//           • Pure white background (RGB 255, 255, 255)<br />
//           • No watermarks, text overlays, or borders
//         </p>
//       </div>
//     </div>
//   );
// }

// // Step 4: Pricing & Inventory
// function Step4({ formData, updateFormData }) {
//   const calculateFees = () => {
//     const price = parseFloat(formData.price) || 0;
//     const referralFee = price * 0.15;
//     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
//     const totalFees = referralFee + fbaFee;
//     const netProceeds = price - totalFees;
    
//     return { referralFee, fbaFee, totalFees, netProceeds };
//   };

//   const fees = calculateFees();

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 4: Pricing & Inventory</h3>

//       <div className="grid grid-cols-3 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.price}
//               onChange={(e) => updateFormData({ price: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2">Sale Price</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.salePrice}
//               onChange={(e) => updateFormData({ salePrice: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2">Business Price (B2B)</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.businessPrice}
//               onChange={(e) => updateFormData({ businessPrice: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//             />
//           </div>
//         </div>
//       </div>

//       {formData.salePrice && (
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-semibold mb-2">Sale Start Date</label>
//             <input
//               type="date"
//               value={formData.saleStart}
//               onChange={(e) => updateFormData({ saleStart: e.target.value })}
//               className="w-full px-4 py-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold mb-2">Sale End Date</label>
//             <input
//               type="date"
//               value={formData.saleEnd}
//               onChange={(e) => updateFormData({ saleEnd: e.target.value })}
//               className="w-full px-4 py-2 border rounded"
//             />
//           </div>
//         </div>
//       )}

//       <div>
//         <label className="block text-sm font-semibold mb-2">Quantity *</label>
//         <input
//           type="number"
//           value={formData.quantity}
//           onChange={(e) => updateFormData({ quantity: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="0"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
//         <div className="flex gap-4">
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBA"
//               checked={formData.fulfillment === 'FBA'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Amazon (FBA)</span>
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBM"
//               checked={formData.fulfillment === 'FBM'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Merchant (FBM)</span>
//           </label>
//         </div>
//       </div>

//       {formData.fulfillment === 'FBA' && (
//         <div className="bg-gray-50 border rounded p-4 space-y-4">
//           <h4 className="font-semibold">FBA Prep & Labeling Settings</h4>
          
//           <div>
//             <label className="block text-sm font-semibold mb-2">Who Labels</label>
//             <select
//               value={formData.prepSettings.labeling}
//               onChange={(e) => updateFormData({ prepSettings: { ...formData.prepSettings, labeling: e.target.value } })}
//               className="w-full px-4 py-2 border rounded"
//             >
//               <option value="amazon">Amazon Labels (Fee applies)</option>
//               <option value="merchant">Merchant Labels</option>
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               id="polybagging"
//               checked={formData.prepSettings.polybagging}
//               onChange={(e) => updateFormData({ prepSettings: { ...formData.prepSettings, polybagging: e.target.checked } })}
//             />
//             <label htmlFor="polybagging" className="text-sm">Requires Polybagging</label>
//           </div>
//         </div>
//       )}

//       <div className="bg-green-50 border border-green-200 rounded p-4">
//         <h4 className="font-semibold mb-3">Fee Preview</h4>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Price:</span>
//             <span className="font-semibold">${formData.price || '0.00'}</span>
//           </div>
//           <div className="flex justify-between text-red-600">
//             <span>Referral Fee (15%):</span>
//             <span>-${fees.referralFee.toFixed(2)}</span>
//           </div>
//           {formData.fulfillment === 'FBA' && (
//             <div className="flex justify-between text-red-600">
//               <span>FBA Fee:</span>
//               <span>-${fees.fbaFee.toFixed(2)}</span>
//             </div>
//           )}
//           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
//             <span>Total Fees:</span>
//             <span>-${fees.totalFees.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
//             <span>Your Net Proceeds:</span>
//             <span>${fees.netProceeds.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Step 5: SEO & Compliance
// function Step5({ formData, updateFormData }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 5: SEO & Compliance</h3>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Backend Keywords (250 bytes max)</label>
//         <textarea
//           value={formData.keywords}
//           onChange={(e) => updateFormData({ keywords: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           rows={3}
//           placeholder="Comma-separated keywords for search optimization"
//           maxLength={250}
//         />
//         <p className="text-sm text-gray-500 mt-1">{formData.keywords.length}/250 bytes</p>
//         <p className="text-xs text-gray-500 mt-1">These keywords improve search visibility but are not visible to customers</p>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Target Audience</label>
//         <input
//           type="text"
//           value={formData.targetAudience}
//           onChange={(e) => updateFormData({ targetAudience: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="e.g., Men, Women, Kids"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Age Range</label>
//         <select
//           value={formData.ageRange}
//           onChange={(e) => updateFormData({ ageRange: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//         >
//           <option value="">Not Applicable</option>
//           <option value="0-3">0-3 months</option>
//           <option value="3-6">3-6 months</option>
//           <option value="6-12">6-12 months</option>
//           <option value="1-2">1-2 years</option>
//           <option value="3-5">3-5 years</option>
//           <option value="5-8">5-8 years</option>
//           <option value="8-13">8-13 years</option>
//           <option value="13+">13+ years</option>
//         </select>
//       </div>

//       <div className="border rounded p-4 space-y-3">
//         <h4 className="font-semibold">Compliance Checkboxes</h4>
        
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="hasBatteries"
//             checked={formData.hasBatteries}
//             onChange={(e) => updateFormData({ hasBatteries: e.target.checked })}
//           />
//           <label htmlFor="hasBatteries" className="text-sm">Product contains batteries</label>
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="isHazmat"
//             checked={formData.isHazmat}
//             onChange={(e) => updateFormData({ isHazmat: e.target.checked })}
//           />
//           <label htmlFor="isHazmat" className="text-sm">Product is hazardous material (Hazmat)</label>
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="requiresAgeVerification"
//             checked={formData.requiresAgeVerification}
//             onChange={(e) => updateFormData({ requiresAgeVerification: e.target.checked })}
//           />
//           <label htmlFor="requiresAgeVerification" className="text-sm">Requires age verification (18+)</label>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Tax Code</label>
//         <input
//           type="text"
//           value={formData.taxCode}
//           onChange={(e) => updateFormData({ taxCode: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="A_GEN_NOTAX"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Country of Origin</label>
//         <select
//           value={formData.countryOfOrigin}
//           onChange={(e) => updateFormData({ countryOfOrigin: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//         >
//           <option value="">Select Country</option>
//           <option value="US">United States</option>
//           <option value="CN">China</option>
//           <option value="IN">India</option>
//           <option value="MX">Mexico</option>
//           <option value="CA">Canada</option>
//           <option value="DE">Germany</option>
//           <option value="JP">Japan</option>
//         </select>
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="giftOptions"
//           checked={formData.giftOptions}
//           onChange={(e) => updateFormData({ giftOptions: e.target.checked })}
//         />
//         <label htmlFor="giftOptions" className="text-sm font-semibold">Enable gift wrapping and gift message</label>
//       </div>

//       <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
//         <p className="text-sm text-yellow-800">
//           <strong>Important:</strong> Please ensure all product information is accurate and complies with Amazon's policies. 
//           Incorrect information may result in listing suppression or account suspension.
//         </p>
//       </div>
//     </div>
//   );
// }

// // Reports Component
// function Reports({ products }) {
//   const [reportType, setReportType] = useState('all');

//   const generateReport = () => {
//     let data = products;
    
//     switch(reportType) {
//       case 'active':
//         data = products.filter(p => p.status === 'active');
//         break;
//       case 'inactive':
//         data = products.filter(p => p.status === 'inactive');
//         break;
//       case 'suppressed':
//         data = products.filter(p => p.status === 'suppressed');
//         break;
//       case 'fba':
//         data = products.filter(p => p.fulfillment === 'FBA');
//         break;
//       case 'stranded':
//         data = products.filter(p => p.status === 'stranded');
//         break;
//       case 'lowstock':
//         data = products.filter(p => p.quantity < 10);
//         break;
//     }
    
//     return data;
//   };

//   const reportData = generateReport();

//   const downloadCSV = () => {
//     const headers = ['SKU', 'Title', 'Brand', 'Price', 'Quantity', 'Status', 'Fulfillment'];
//     const rows = reportData.map(p => [
//       p.sku, p.title, p.brand, p.price, p.quantity, p.status, p.fulfillment
//     ]);
    
//     const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Reports</h2>
//         <button
//           onClick={downloadCSV}
//           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           <Download size={20} />
//           Download CSV
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <label className="block text-sm font-semibold mb-2">Report Type</label>
//         <select
//           value={reportType}
//           onChange={(e) => setReportType(e.target.value)}
//           className="w-full max-w-md px-4 py-2 border rounded"
//         >
//           <option value="all">All Listings Report</option>
//           <option value="active">Active Listings</option>
//           <option value="inactive">Inactive Listings</option>
//           <option value="suppressed">Suppressed Listings</option>
//           <option value="fba">FBA Inventory Report</option>
//           <option value="stranded">Stranded Inventory</option>
//           <option value="lowstock">Low Stock Alert</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="p-4 bg-gray-50 border-b">
//           <h3 className="font-semibold">
//             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
//           </h3>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="p-4 text-left">SKU</th>
//                 <th className="p-4 text-left">Title</th>
//                 <th className="p-4 text-left">Brand</th>
//                 <th className="p-4 text-left">Price</th>
//                 <th className="p-4 text-left">Quantity</th>
//                 <th className="p-4 text-left">Status</th>
//                 <th className="p-4 text-left">Fulfillment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map(product => (
//                 <tr key={product.id} className="border-b hover:bg-gray-50">
//                   <td className="p-4 font-mono text-sm">{product.sku}</td>
//                   <td className="p-4">{product.title}</td>
//                   <td className="p-4">{product.brand}</td>
//                   <td className="p-4 font-semibold">${product.price}</td>
//                   <td className="p-4">
//                     <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
//                       {product.quantity}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.status === 'active' ? 'bg-green-100 text-green-800' :
//                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {product.status?.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {product.fulfillment}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {reportData.length === 0 && (
//             <div className="p-12 text-center text-gray-500">
//               <Package size={48} className="mx-auto mb-4 text-gray-300" />
//               <p>No products found for this report</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Upload, Download, Filter, ChevronDown, 
//   ChevronRight, Package, AlertTriangle, TrendingUp, ShoppingCart, Edit, Trash2, DollarSign, BarChart3 } from 'lucide-react';

// // In-memory data store
// const dataStore = {
//   products: []
// };

// // API Service with in-memory storage
// const API = {
//   async getProducts() {
//     return [...dataStore.products];
//   },
  
//   async saveProducts(products) {
//     dataStore.products = products;
//     return products;
//   },
  
//   async createProduct(product) {
//     const products = await this.getProducts();
//     const newProduct = { ...product, id: Date.now().toString(), createdAt: new Date().toISOString() };
//     products.push(newProduct);
//     await this.saveProducts(products);
//     return newProduct;
//   },
  
//   async updateProduct(id, updates) {
//     const products = await this.getProducts();
//     const index = products.findIndex(p => p.id === id);
//     if (index !== -1) {
//       products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
//       await this.saveProducts(products);
//       return products[index];
//     }
//     throw new Error('Product not found');
//   },
  
//   async deleteProduct(id) {
//     const products = await this.getProducts();
//     const filtered = products.filter(p => p.id !== id);
//     await this.saveProducts(filtered);
//     return true;
//   },
  
//   async bulkUpdate(ids, updates) {
//     const products = await this.getProducts();
//     ids.forEach(id => {
//       const index = products.findIndex(p => p.id === id);
//       if (index !== -1) {
//         products[index] = { ...products[index], ...updates };
//       }
//     });
//     await this.saveProducts(products);
//     return true;
//   }
// };

// // Main App Component
// export default function AmazonProductManager() {
//   const [view, setView] = useState('dashboard');
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     fulfillment: 'all'
//   });
//   const [formData, setFormData] = useState({
//   images: [],
//   hasVideo: false,
//   videoUrl: "",
//   price: "",
//   image: null,
//   description: "",
//   hasAPlusContent: false,
// });
// // const [formData, setFormData] = useState({
// //   name: "",
// //   price: "",
// //   image: null,
// //   description: "",
// // });

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     setLoading(true);
//     const data = await API.getProducts();
//     setProducts(data);
//     setLoading(false);
//   };

//   const stats = {
//     total: products.length,
//     active: products.filter(p => p.status === 'active').length,
//     outOfStock: products.filter(p => p.quantity === 0).length,
//     ipiScore: 750
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Product Manager</h1>
//           <nav className="flex gap-4">
//             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Dashboard
//             </button>
//             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Products
//             </button>
//             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Create Product
//             </button>
//             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Reports
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
//         {view === 'products' && (
//           <ProductList
//             products={products}
//             filters={filters}
//             setFilters={setFilters}
//             selectedProducts={selectedProducts}
//             setSelectedProducts={setSelectedProducts}
//             onRefresh={loadProducts}
//             setView={setView}
//           />
//         )}
//         {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); setView('products'); }} />}
//         {view === 'reports' && <Reports products={products} />}
//       </main>

//       {/* Floating Action Button */}
//       <button
//         onClick={() => setView('create')}
//         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
//       >
//         <Plus size={24} />
//       </button>
//     </div>
//   );
// }

// // Dashboard Component
// function Dashboard({ stats, products }) {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Dashboard</h2>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
//         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
//         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
//         <StatCard title="IPI Score" value={stats.ipiScore} icon={<BarChart3 />} color="bg-purple-500" />
//       </div>

//       {/* Top Products */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-bold mb-4">Top Performing Products</h3>
//         <div className="space-y-2">
//           {products.slice(0, 5).map(product => (
//             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
//               <div>
//                 <p className="font-semibold">{product.title}</p>
//                 <p className="text-sm text-gray-500">SKU: {product.sku}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-green-600">${product.price}</p>
//                 <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
//               </div>
//             </div>
//           ))}
//           {products.length === 0 && (
//             <p className="text-gray-500 text-center py-8">No products yet. Create your first product to get started!</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-500 text-sm">{title}</p>
//           <p className="text-3xl font-bold mt-2">{value}</p>
//         </div>
//         <div className={`${color} text-white p-3 rounded-lg`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Product List Component
// function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh, setView }) {
//   const [expandedProducts, setExpandedProducts] = useState([]);

//   const filteredProducts = products.filter(p => {
//     const matchesSearch = !filters.search || 
//       p.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
//       p.sku?.toLowerCase().includes(filters.search.toLowerCase()) ||
//       p.asin?.toLowerCase().includes(filters.search.toLowerCase());
    
//     const matchesStatus = filters.status === 'all' || p.status === filters.status;
//     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
//     return matchesSearch && matchesStatus && matchesFulfillment;
//   });

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedProducts(filteredProducts.map(p => p.id));
//     } else {
//       setSelectedProducts([]);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
//       for (const id of selectedProducts) {
//         await API.deleteProduct(id);
//       }
//       setSelectedProducts([]);
//       onRefresh();
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Products</h2>
//         <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//           Refresh
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by Name, SKU, ASIN..."
//               value={filters.search}
//               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//               className="w-full pl-10 pr-4 py-2 border rounded"
//             />
//           </div>
          
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="outofstock">Out of Stock</option>
//             <option value="suppressed">Suppressed</option>
//             <option value="stranded">Stranded</option>
//           </select>
          
//           <select
//             value={filters.fulfillment}
//             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Fulfillment</option>
//             <option value="FBA">FBA</option>
//             <option value="FBM">FBM</option>
//           </select>
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedProducts.length > 0 && (
//         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
//           <span className="font-semibold">{selectedProducts.length} products selected</span>
//           <div className="flex gap-2">
//             <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
//               Delete Selected
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-4 text-left">
//                 <input
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
//                 />
//               </th>
//               <th className="p-4 text-left">Product</th>
//               <th className="p-4 text-left">SKU</th>
//               <th className="p-4 text-left">Status</th>
//               <th className="p-4 text-left">Price</th>
//               <th className="p-4 text-left">Quantity</th>
//               <th className="p-4 text-left">Fulfillment</th>
//               <th className="p-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map(product => (
//               <tr key={product.id} className="border-b hover:bg-gray-50">
//                 <td className="p-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedProducts.includes(product.id)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedProducts([...selectedProducts, product.id]);
//                       } else {
//                         setSelectedProducts(selectedProducts.filter(id => id !== product.id));
//                       }
//                     }}
//                   />
//                 </td>
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
//                       <Package size={20} className="text-gray-400" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">{product.title}</p>
//                       <p className="text-sm text-gray-500">{product.brand}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-4 font-mono text-sm">{product.sku}</td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.status === 'active' ? 'bg-green-100 text-green-800' :
//                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {product.status?.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="p-4 font-semibold">${product.price}</td>
//                 <td className="p-4">
//                   <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
//                     {product.quantity}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {product.fulfillment}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={async () => {
//                         if (window.confirm('Delete this product?')) {
//                           await API.deleteProduct(product.id);
//                           onRefresh();
//                         }
//                       }}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {filteredProducts.length === 0 && (
//           <div className="p-12 text-center text-gray-500">
//             <Package size={48} className="mx-auto mb-4 text-gray-300" />
//             <p>No products found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// const handleImageUpload = (files) => {
//   const selected = Array.from(files);

//   let images = [...formData.images];

//   selected.forEach((file) => {
//     if (images.length < 9) {
//       images.push({
//         file,
//         preview: URL.createObjectURL(file),
//       });
//     }
//   });

//   updateFormData({ images });
// };

// const removeImage = (index) => {
//   const updated = [...formData.images];
//   updated.splice(index, 1);
//   updateFormData({ images: updated });
// };


// const updateFormData = (changes) => {
//   setFormData((prev) => ({ ...prev, ...changes }));
// };

// // Create Product Component (5-Step Form)
// function CreateProduct({ onSuccess }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     productIdType: 'ASIN',
//     productId: '',
//     sku: '',
//     brand: '',
//     title: '',
//     category: '',
//     gtinExemption: false,
//     hasVariations: false,
//     variations: [],
//     bulletPoints: ['', '', '', '', ''],
//     description: '',
//     condition: 'new',
//     dimensions: { length: '', width: '', height: '', weight: '' },
//     images: [],
//     hasVideo: false,
//     videoUrl: '',
//     hasAPlusContent: false,
//     price: '',
//     salePrice: '',
//     businessPrice: '',
//     saleStart: '',
//     saleEnd: '',
//     quantity: '',
//     fulfillment: 'FBA',
//     prepSettings: { labeling: 'amazon', polybagging: false },
//     keywords: '',
//     targetAudience: '',
//     ageRange: '',
//     hasBatteries: false,
//     isHazmat: false,
//     requiresAgeVerification: false,
//     taxCode: '',
//     countryOfOrigin: '',
//     giftOptions: false,
//     status: 'active'
//   });

//   const handleSubmit = async () => {
//     try {
//       await API.createProduct(formData);
//       alert('Product created successfully!');
//       onSuccess();
//     } catch (error) {
//       alert('Error creating product: ' + error.message);
//     }
//   };

//   const updateFormData = (updates) => {
//     setFormData({ ...formData, ...updates });
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
//       {/* Progress Steps */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="flex justify-between items-center">
//           {[1, 2, 3, 4, 5].map(s => (
//             <div key={s} className="flex items-center">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
//               }`}>
//                 {s}
//               </div>
//               {s < 5 && <div className={`w-20 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between mt-2 text-sm">
//           <span>Identity</span>
//           <span>Details</span>
//           <span>Images</span>
//           <span>Pricing</span>
//           <span>SEO</span>
//         </div>
//       </div>

//       {/* Form Content */}
//       <div className="bg-white rounded-lg shadow p-6">
//         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
//         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} />}
//         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}
//         {step === 4 && <Step4 formData={formData} updateFormData={updateFormData} />}
//         {step === 5 && <Step5 formData={formData} updateFormData={updateFormData} />}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between mt-8 pt-6 border-t">
//           <button
//             onClick={() => setStep(Math.max(1, step - 1))}
//             disabled={step === 1}
//             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
//           >
//             Previous
//           </button>
          
//           {step < 5 ? (
//             <button
//               onClick={() => setStep(Math.min(5, step + 1))}
//               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Create Product
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Step 1: Product Identity
// function Step1({ formData, updateFormData }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
//           <select
//             value={formData.productIdType}
//             onChange={(e) => updateFormData({ productIdType: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//           >
//             <option value="ASIN">ASIN</option>
//             <option value="UPC">UPC</option>
//             <option value="EAN">EAN</option>
//             <option value="ISBN">ISBN</option>
//           </select>
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID</label>
//           <input
//             type="text"
//             value={formData.productId}
//             onChange={(e) => updateFormData({ productId: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="B08N5WRWNW"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">SKU *</label>
//         <input
//           type="text"
//           value={formData.sku}
//           onChange={(e) => updateFormData({ sku: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="SKU-12345"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Brand *</label>
//         <input
//           type="text"
//           value={formData.brand}
//           onChange={(e) => updateFormData({ brand: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Your Brand Name"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Title * (200 chars max)</label>
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => updateFormData({ title: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Product Title with Key Features"
//           maxLength={200}
//           required
//         />
//         <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 characters</p>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Category *</label>
//         <select
//           value={formData.category}
//           onChange={(e) => updateFormData({ category: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           required
//         >
//           <option value="">Select Category</option>
//           <option value="electronics">Electronics</option>
//           <option value="clothing">Clothing</option>
//           <option value="home">Home & Kitchen</option>
//           <option value="sports">Sports & Outdoors</option>
//           <option value="books">Books</option>
//         </select>
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="gtinExemption"
//           checked={formData.gtinExemption}
//           onChange={(e) => updateFormData({ gtinExemption: e.target.checked })}
//         />
//         <label htmlFor="gtinExemption" className="text-sm">Request GTIN Exemption</label>
//       </div>
//     </div>
//   );
// }

// // Step 2: Details & Variations
// function Step2({ formData, updateFormData }) {
//   const updateBulletPoint = (index, value) => {
//     const newBulletPoints = [...formData.bulletPoints];
//     newBulletPoints[index] = value;
//     updateFormData({ bulletPoints: newBulletPoints });
//   };

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 2: Product Details & Variations</h3>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="hasVariations"
//           checked={formData.hasVariations}
//           onChange={(e) => updateFormData({ hasVariations: e.target.checked })}
//         />
//         <label htmlFor="hasVariations" className="text-sm font-semibold">This product has variations (Size, Color, etc.)</label>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Bullet Points (5 max, 500 chars each)</label>
//         {formData.bulletPoints.map((bullet, index) => (
//           <div key={index} className="mb-3">
//             <textarea
//               value={bullet}
//               onChange={(e) => updateBulletPoint(index, e.target.value)}
//               className="w-full px-4 py-2 border rounded"
//               placeholder={`Feature ${index + 1}`}
//               maxLength={500}
//               rows={2}
//             />
//             <p className="text-xs text-gray-500 mt-1">{bullet.length}/500 characters</p>
//           </div>
//         ))}
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Description</label>
//         <textarea
//           value={formData.description}
//           onChange={(e) => updateFormData({ description: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           rows={6}
//           placeholder="Detailed product description..."
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Condition</label>
//         <select
//           value={formData.condition}
//           onChange={(e) => updateFormData({ condition: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//         >
//           <option value="new">New</option>
//           <option value="used-like-new">Used - Like New</option>
//           <option value="used-very-good">Used - Very Good</option>
//           <option value="used-good">Used - Good</option>
//           <option value="used-acceptable">Used - Acceptable</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Dimensions & Weight</label>
//         <div className="grid grid-cols-4 gap-4">
//           <input
//             type="number"
//             placeholder="Length (in)"
//             value={formData.dimensions.length}
//             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, length: e.target.value } })}
//             className="px-4 py-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Width (in)"
//             value={formData.dimensions.width}
//             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, width: e.target.value } })}
//             className="px-4 py-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Height (in)"
//             value={formData.dimensions.height}
//             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, height: e.target.value } })}
//             className="px-4 py-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Weight (lb)"
//             value={formData.dimensions.weight}
//             onChange={(e) => updateFormData({ dimensions: { ...formData.dimensions, weight: e.target.value } })}
//             className="px-4 py-2 border rounded"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Step 3: Images & Content
// function Step3({ formData, updateFormData }) {
//   return (
//     // <div className="space-y-6">
//     //   <h3 className="text-xl font-bold">Step 3: Images & Content</h3>

//     //   <div>
//     //     <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
//     //     <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//     //       <Upload className="mx-auto text-gray-400 mb-4" size={48} />
//     //       <p className="text-gray-600 mb-2">Drag and drop images here or click to upload</p>
//     //       <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels or larger</p>
//     //       <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//     //         Choose Files
//     //       </button>
//     //     </div>
//     //     <p className="text-xs text-gray-500 mt-2">First image will be the main product image</p>
//     //   </div>

//     //   <div className="flex items-center gap-2">
//     //     <input
//     //       type="checkbox"
//     //       id="hasVideo"
//     //       checked={formData.hasVideo}
//     //       onChange={(e) => updateFormData({ hasVideo: e.target.checked })}
//     //     />
//     //     <label htmlFor="hasVideo" className="text-sm font-semibold">Add Product Video</label>
//     //   </div>

//     //   {formData.hasVideo && (
//     //     <div>
//     //       <label className="block text-sm font-semibold mb-2">Video URL</label>
//     //       <input
//     //         type="url"
//     //         value={formData.videoUrl}
//     //         onChange={(e) => updateFormData({ videoUrl: e.target.value })}
//     //         className="w-full px-4 py-2 border rounded"
//     //         placeholder="https://youtube.com/watch?v=..."
//     //       />
//     //     </div>
//     //   )}

//     //   <div className="flex items-center gap-2">
//     //     <input
//     //       type="checkbox"
//     //       id="hasAPlusContent"
//     //       checked={formData.hasAPlusContent}
//     //       onChange={(e) => updateFormData({ hasAPlusContent: e.target.checked })}
//     //     />
//     //     <label htmlFor="hasAPlusContent" className="text-sm font-semibold">Enable A+ Content</label>
//     //   </div>

//     //   <div className="bg-blue-50 border border-blue-200 rounded p-4">
//     //     <p className="text-sm text-blue-800">
//     //       <strong>Image Requirements:</strong><br />
//     //       • JPEG or PNG format<br />
//     //       • Minimum 1000 x 1000 pixels<br />
//     //       • Product must fill 85% or more of the image<br />
//     //       • Pure white background (RGB 255, 255, 255)<br />
//     //       • No watermarks, text overlays, or borders
//     //     </p>
//     //   </div>
//     // </div>
//     <div className="space-y-6">
//   <h3 className="text-xl font-bold">Step 3: Images & Content</h3>

//   {/* IMAGE UPLOAD */}
//   <div>
//     <label className="block text-sm font-semibold mb-2">
//       Product Images (9 max)
//     </label>

//     <div
//       className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
//       onClick={() => document.getElementById("uploadImagesInput").click()}
//       onDragOver={(e) => e.preventDefault()}
//       onDrop={(e) => {
//         e.preventDefault();
//         const files = e.dataTransfer.files;
//         handleImageUpload(files);
//       }}
//     >
//       <Upload className="mx-auto text-gray-400 mb-4" size={48} />
//       <p className="text-gray-600 mb-2">
//         Drag and drop images here or click to upload
//       </p>
//       <p className="text-sm text-gray-500">
//         Recommended: 1000 x 1000 pixels or larger
//       </p>

//       <button
//         onClick={() => document.getElementById("uploadImagesInput").click()}
//         type="button"
//         className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Choose Files
//       </button>

//       {/* Hidden File Input */}
//       <input
//         type="file"
//         id="uploadImagesInput"
//         accept="image/*"
//         multiple
//         className="hidden"
//         onChange={(e) => handleImageUpload(e.target.files)}
//       />
//     </div>

//     <p className="text-xs text-gray-500 mt-2">
//       First image will be the main product image
//     </p>
//   </div>

//   {/* IMAGE PREVIEW GRID */}
//   {formData.images?.length > 0 && (
//     <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
//       {formData.images.map((img, index) => (
//         <div key={index} className="relative group">
//           <img
//             src={img.preview}
//             className="w-full h-28 object-cover rounded border"
//             alt="preview"
//           />

//           <button
//             type="button"
//             onClick={() => removeImage(index)}
//             className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hidden group-hover:block"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 text-red-500"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//       ))}
//     </div>
//   )}

//   {/* VIDEO TOGGLE */}
//   <div className="flex items-center gap-2">
//     <input
//       type="checkbox"
//       id="hasVideo"
//       checked={formData.hasVideo}
//       onChange={(e) => updateFormData({ hasVideo: e.target.checked })}
//     />
//     <label htmlFor="hasVideo" className="text-sm font-semibold">
//       Add Product Video
//     </label>
//   </div>

//   {/* VIDEO FIELD */}
//   {formData.hasVideo && (
//     <div>
//       <label className="block text-sm font-semibold mb-2">Video URL</label>
//       <input
//         type="url"
//         value={formData.videoUrl}
//         onChange={(e) => updateFormData({ videoUrl: e.target.value })}
//         className="w-full px-4 py-2 border rounded"
//         placeholder="https://youtube.com/watch?v=..."
//       />
//     </div>
//   )}

//   {/* A+ CONTENT */}
//   <div className="flex items-center gap-2">
//     <input
//       type="checkbox"
//       id="hasAPlusContent"
//       checked={formData.hasAPlusContent}
//       onChange={(e) => updateFormData({ hasAPlusContent: e.target.checked })}
//     />
//     <label htmlFor="hasAPlusContent" className="text-sm font-semibold">
//       Enable A+ Content
//     </label>
//   </div>

//   {/* IMAGE REQUIREMENTS */}
//   <div className="bg-blue-50 border border-blue-200 rounded p-4">
//     <p className="text-sm text-blue-800">
//       <strong>Image Requirements:</strong><br />
//       • JPEG or PNG format<br />
//       • Minimum 1000 x 1000 pixels<br />
//       • Product must fill 85% or more of the image<br />
//       • Pure white background (RGB 255, 255, 255)<br />
//       • No watermarks, text overlays, or borders
//     </p>
//   </div>
// </div>

//   );
// }

// // Step 4: Pricing & Inventory
// function Step4({ formData, updateFormData }) {
//   const calculateFees = () => {
//     const price = parseFloat(formData.price) || 0;
//     const referralFee = price * 0.15;
//     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
//     const totalFees = referralFee + fbaFee;
//     const netProceeds = price - totalFees;
    
//     return { referralFee, fbaFee, totalFees, netProceeds };
//   };

//   const fees = calculateFees();

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 4: Pricing & Inventory</h3>

//       <div className="grid grid-cols-3 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.price}
//               onChange={(e) => updateFormData({ price: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2">Sale Price</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.salePrice}
//               onChange={(e) => updateFormData({ salePrice: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2">Business Price (B2B)</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.businessPrice}
//               onChange={(e) => updateFormData({ businessPrice: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//             />
//           </div>
//         </div>
//       </div>

//       {formData.salePrice && (
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-semibold mb-2">Sale Start Date</label>
//             <input
//               type="date"
//               value={formData.saleStart}
//               onChange={(e) => updateFormData({ saleStart: e.target.value })}
//               className="w-full px-4 py-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold mb-2">Sale End Date</label>
//             <input
//               type="date"
//               value={formData.saleEnd}
//               onChange={(e) => updateFormData({ saleEnd: e.target.value })}
//               className="w-full px-4 py-2 border rounded"
//             />
//           </div>
//         </div>
//       )}

//       <div>
//         <label className="block text-sm font-semibold mb-2">Quantity *</label>
//         <input
//           type="number"
//           value={formData.quantity}
//           onChange={(e) => updateFormData({ quantity: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="0"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
//         <div className="flex gap-4">
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBA"
//               checked={formData.fulfillment === 'FBA'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Amazon (FBA)</span>
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBM"
//               checked={formData.fulfillment === 'FBM'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Merchant (FBM)</span>
//           </label>
//         </div>
//       </div>

//       {formData.fulfillment === 'FBA' && (
//         <div className="bg-gray-50 border rounded p-4 space-y-4">
//           <h4 className="font-semibold">FBA Prep & Labeling Settings</h4>
          
//           <div>
//             <label className="block text-sm font-semibold mb-2">Who Labels</label>
//             <select
//               value={formData.prepSettings.labeling}
//               onChange={(e) => updateFormData({ prepSettings: { ...formData.prepSettings, labeling: e.target.value } })}
//               className="w-full px-4 py-2 border rounded"
//             >
//               <option value="amazon">Amazon Labels (Fee applies)</option>
//               <option value="merchant">Merchant Labels</option>
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               id="polybagging"
//               checked={formData.prepSettings.polybagging}
//               onChange={(e) => updateFormData({ prepSettings: { ...formData.prepSettings, polybagging: e.target.checked } })}
//             />
//             <label htmlFor="polybagging" className="text-sm">Requires Polybagging</label>
//           </div>
//         </div>
//       )}

//       <div className="bg-green-50 border border-green-200 rounded p-4">
//         <h4 className="font-semibold mb-3">Fee Preview</h4>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Price:</span>
//             <span className="font-semibold">${formData.price || '0.00'}</span>
//           </div>
//           <div className="flex justify-between text-red-600">
//             <span>Referral Fee (15%):</span>
//             <span>-${fees.referralFee.toFixed(2)}</span>
//           </div>
//           {formData.fulfillment === 'FBA' && (
//             <div className="flex justify-between text-red-600">
//               <span>FBA Fee:</span>
//               <span>-${fees.fbaFee.toFixed(2)}</span>
//             </div>
//           )}
//           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
//             <span>Total Fees:</span>
//             <span>-${fees.totalFees.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
//             <span>Your Net Proceeds:</span>
//             <span>${fees.netProceeds.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Step 5: SEO & Compliance
// function Step5({ formData, updateFormData }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 5: SEO & Compliance</h3>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Backend Keywords (250 bytes max)</label>
//         <textarea
//           value={formData.keywords}
//           onChange={(e) => updateFormData({ keywords: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           rows={3}
//           placeholder="Comma-separated keywords for search optimization"
//           maxLength={250}
//         />
//         <p className="text-sm text-gray-500 mt-1">{formData.keywords.length}/250 bytes</p>
//         <p className="text-xs text-gray-500 mt-1">These keywords improve search visibility but are not visible to customers</p>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Target Audience</label>
//         <input
//           type="text"
//           value={formData.targetAudience}
//           onChange={(e) => updateFormData({ targetAudience: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="e.g., Men, Women, Kids"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Age Range</label>
//         <select
//           value={formData.ageRange}
//           onChange={(e) => updateFormData({ ageRange: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//         >
//           <option value="">Not Applicable</option>
//           <option value="0-3">0-3 months</option>
//           <option value="3-6">3-6 months</option>
//           <option value="6-12">6-12 months</option>
//           <option value="1-2">1-2 years</option>
//           <option value="3-5">3-5 years</option>
//           <option value="5-8">5-8 years</option>
//           <option value="8-13">8-13 years</option>
//           <option value="13+">13+ years</option>
//         </select>
//       </div>

//       <div className="border rounded p-4 space-y-3">
//         <h4 className="font-semibold">Compliance Checkboxes</h4>
        
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="hasBatteries"
//             checked={formData.hasBatteries}
//             onChange={(e) => updateFormData({ hasBatteries: e.target.checked })}
//           />
//           <label htmlFor="hasBatteries" className="text-sm">Product contains batteries</label>
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="isHazmat"
//             checked={formData.isHazmat}
//             onChange={(e) => updateFormData({ isHazmat: e.target.checked })}
//           />
//           <label htmlFor="isHazmat" className="text-sm">Product is hazardous material (Hazmat)</label>
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="requiresAgeVerification"
//             checked={formData.requiresAgeVerification}
//             onChange={(e) => updateFormData({ requiresAgeVerification: e.target.checked })}
//           />
//           <label htmlFor="requiresAgeVerification" className="text-sm">Requires age verification (18+)</label>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Tax Code</label>
//         <input
//           type="text"
//           value={formData.taxCode}
//           onChange={(e) => updateFormData({ taxCode: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="A_GEN_NOTAX"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Country of Origin</label>
//         <select
//           value={formData.countryOfOrigin}
//           onChange={(e) => updateFormData({ countryOfOrigin: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//         >
//           <option value="">Select Country</option>
//           <option value="US">United States</option>
//           <option value="CN">China</option>
//           <option value="IN">India</option>
//           <option value="MX">Mexico</option>
//           <option value="CA">Canada</option>
//           <option value="DE">Germany</option>
//           <option value="JP">Japan</option>
//         </select>
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="giftOptions"
//           checked={formData.giftOptions}
//           onChange={(e) => updateFormData({ giftOptions: e.target.checked })}
//         />
//         <label htmlFor="giftOptions" className="text-sm font-semibold">Enable gift wrapping and gift message</label>
//       </div>

//       <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
//         <p className="text-sm text-yellow-800">
//           <strong>Important:</strong> Please ensure all product information is accurate and complies with Amazon's policies. 
//           Incorrect information may result in listing suppression or account suspension.
//         </p>
//       </div>
//     </div>
//   );
// }

// // Reports Component
// function Reports({ products }) {
//   const [reportType, setReportType] = useState('all');

//   const generateReport = () => {
//     let data = products;
    
//     switch(reportType) {
//       case 'active':
//         data = products.filter(p => p.status === 'active');
//         break;
//       case 'inactive':
//         data = products.filter(p => p.status === 'inactive');
//         break;
//       case 'suppressed':
//         data = products.filter(p => p.status === 'suppressed');
//         break;
//       case 'fba':
//         data = products.filter(p => p.fulfillment === 'FBA');
//         break;
//       case 'stranded':
//         data = products.filter(p => p.status === 'stranded');
//         break;
//       case 'lowstock':
//         data = products.filter(p => p.quantity < 10);
//         break;
//     }
    
//     return data;
//   };

//   const reportData = generateReport();

//   const downloadCSV = () => {
//     const headers = ['SKU', 'Title', 'Brand', 'Price', 'Quantity', 'Status', 'Fulfillment'];
//     const rows = reportData.map(p => [
//       p.sku, p.title, p.brand, p.price, p.quantity, p.status, p.fulfillment
//     ]);
    
//     const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Reports</h2>
//         <button
//           onClick={downloadCSV}
//           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           <Download size={20} />
//           Download CSV
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <label className="block text-sm font-semibold mb-2">Report Type</label>
//         <select
//           value={reportType}
//           onChange={(e) => setReportType(e.target.value)}
//           className="w-full max-w-md px-4 py-2 border rounded"
//         >
//           <option value="all">All Listings Report</option>
//           <option value="active">Active Listings</option>
//           <option value="inactive">Inactive Listings</option>
//           <option value="suppressed">Suppressed Listings</option>
//           <option value="fba">FBA Inventory Report</option>
//           <option value="stranded">Stranded Inventory</option>
//           <option value="lowstock">Low Stock Alert</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="p-4 bg-gray-50 border-b">
//           <h3 className="font-semibold">
//             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
//           </h3>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="p-4 text-left">SKU</th>
//                 <th className="p-4 text-left">Title</th>
//                 <th className="p-4 text-left">Brand</th>
//                 <th className="p-4 text-left">Price</th>
//                 <th className="p-4 text-left">Quantity</th>
//                 <th className="p-4 text-left">Status</th>
//                 <th className="p-4 text-left">Fulfillment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map(product => (
//                 <tr key={product.id} className="border-b hover:bg-gray-50">
//                   <td className="p-4 font-mono text-sm">{product.sku}</td>
//                   <td className="p-4">{product.title}</td>
//                   <td className="p-4">{product.brand}</td>
//                   <td className="p-4 font-semibold">${product.price}</td>
//                   <td className="p-4">
//                     <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
//                       {product.quantity}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.status === 'active' ? 'bg-green-100 text-green-800' :
//                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {product.status?.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {product.fulfillment}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {reportData.length === 0 && (
//             <div className="p-12 text-center text-gray-500">
//               <Package size={48} className="mx-auto mb-4 text-gray-300" />
//               <p>No products found for this report</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';
// // import StatCard from "StatCard";

// // API Configuration
// const API_BASE_URL = 'http://localhost:8000/api';

// // API Service with backend integration and fallback to persistent storage
// const API = {
//   STORAGE_KEY: "products-data",
//   VENDOR_KEY: "current-vendor",

//   getFromStorage: async () => {
//     try {
//       const data = localStorage.getItem(API.STORAGE_KEY);
//       return data ? JSON.parse(data) : [];
//     } catch (e) {
//       console.error("Storage read error:", e);
//       return [];
//     }
//   },

//   saveToStorage: async (products) => {
//     try {
//       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
//       return products;
//     } catch (e) {
//       console.error("Storage write error:", e);
//       throw e;
//     }
//   },

//   getCurrentVendor: async () => {
//     try {
//       const result = await window.storage.get(API.VENDOR_KEY);
//       return result ? result.value : "default-vendor";
//     } catch {
//       return "default-vendor";
//     }
//   },

//   setCurrentVendor: async (vendorId) => {
//     try {
//       await window.storage.set(API.VENDOR_KEY, vendorId);
//     } catch (e) {
//       console.error("Vendor save error:", e);
//     }
//   },

//   getProducts: async () => {
//     try {
//       const vendorId = await API.getCurrentVendor();
//       const response = await fetch(`${API_BASE_URL}/products?vendorId=${vendorId}`);

//       if (!response.ok) throw new Error("API failed");

//       const data = await response.json();
//       return data.products || data;
//     } catch {
//       console.log("Using local storage");
//       return await API.getFromStorage();
//     }
//   },

//   createProduct: async (product) => {
//     const vendorId = await API.getCurrentVendor();

//     const productData = {
//       ...product,
//       vendorId,
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(productData),
//       });

//       if (!response.ok) throw new Error("API failed");

//       const data = await response.json();
//       return data.product || data;

//     } catch {
//       console.log("Saving locally");
//       const products = await API.getFromStorage();
//       const newProduct = { ...productData, id: Date.now().toString() };
//       products.push(newProduct);
//       await API.saveToStorage(products);
//       return newProduct;
//     }
//   },

//   updateProduct: async (id, updates) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updates),
//       });

//       if (!response.ok) throw new Error("API failed");

//       const data = await response.json();
//       return data.product || data;
//     } catch {
//       console.log("Updating locally");
//       const products = await API.getFromStorage();
//       const index = products.findIndex((p) => p.id === id);

//       if (index !== -1) {
//         products[index] = {
//           ...products[index],
//           ...updates,
//           updatedAt: new Date().toISOString(),
//         };
//         await API.saveToStorage(products);
//         return products[index];
//       }

//       throw new Error("Product not found");
//     }
//   },

//   deleteProduct: async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("API failed");

//       return true;

//     } catch {
//       console.log("Deleting locally");
//       const products = await API.getFromStorage();
//       const filtered = products.filter((p) => p.id !== id);
//       await API.saveToStorage(filtered);
//       return true;
//     }
//   },
// };



// // Main App Component
// export default function AmazonProductManager() {
//   const [view, setView] = useState('dashboard');
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [currentVendor, setCurrentVendor] = useState(API.getCurrentVendor());
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     fulfillment: 'all'
//   });

//   useEffect(() => {
//     loadProducts();
//   }, [currentVendor]);

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       const data = await API.getProducts();
//       setProducts(data);
//     } catch (error) {
//       console.error('Error loading products:', error);
//       alert('Failed to load products. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVendorChange = (vendorId) => {
//     API.setCurrentVendor(vendorId);
//     setCurrentVendor(vendorId);
//   };

//   const stats = {
//     total: products.length,
//     active: products.filter(p => p.status === 'active').length,
//     outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
//     ipiScore: 750
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <h1 className="text-2xl font-bold">Product Manager</h1>
//             <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
//               <User size={18} />
//               <select
//                 value={currentVendor}
//                 onChange={(e) => handleVendorChange(e.target.value)}
//                 className="bg-transparent border-none text-white text-sm focus:outline-none"
//               >
//                 <option value="default-vendor">Default Vendor</option>
//                 <option value="vendor-1">Vendor 1</option>
//                 <option value="vendor-2">Vendor 2</option>
//                 <option value="vendor-3">Vendor 3</option>
//               </select>
//             </div>
//           </div>
//           <nav className="flex gap-4">
//             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Dashboard
//             </button>
//             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Products
//             </button>
//             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Create Product
//             </button>
//             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Reports
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-gray-500">Loading...</div>
//           </div>
//         ) : (
//           <>
//             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
//             {view === 'products' && (
//               <ProductList
//                 products={products}
//                 filters={filters}
//                 setFilters={setFilters}
//                 selectedProducts={selectedProducts}
//                 setSelectedProducts={setSelectedProducts}
//                 onRefresh={loadProducts}
//                 setView={setView}
//               />
//             )}
//             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); setView('products'); }} />}
//             {view === 'reports' && <Reports products={products} />}
//           </>
//         )}
//       </main>

//       {/* Floating Action Button */}
//       <button
//         onClick={() => setView('create')}
//         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
//       >
//         <Plus size={24} />
//       </button>
//     </div>
//   );
// }

// // Dashboard Component
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
// //                 <p className="text-sm text-gray-500">Qty: {product.quantity || 0}</p>
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



// // Dashboard Component
// function Dashboard({ stats, products }) {
//   const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0);
//   const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0;
//   const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity < 10).length;
//   const fbaCount = products.filter(p => p.fulfillment === 'FBA').length;
//   const fbmCount = products.filter(p => p.fulfillment === 'FBM').length;

//   const categoryBreakdown = products.reduce((acc, p) => {
//     acc[p.category] = (acc[p.category] || 0) + 1;
//     return acc;
//   }, {});

//   const statusBreakdown = products.reduce((acc, p) => {
//     acc[p.status] = (acc[p.status] || 0) + 1;
//     return acc;
//   }, {});

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Dashboard</h2>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
//         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
//         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
//         <StatCard title="Low Stock Alert" value={lowStockCount} icon={<AlertTriangle />} color="bg-orange-500" />
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">Total Inventory Value</p>
//           <p className="text-2xl font-bold text-green-600 mt-1">${totalValue.toFixed(2)}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">Average Price</p>
//           <p className="text-2xl font-bold text-blue-600 mt-1">${avgPrice.toFixed(2)}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">FBA Products</p>
//           <p className="text-2xl font-bold text-purple-600 mt-1">{fbaCount}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">FBM Products</p>
//           <p className="text-2xl font-bold text-yellow-600 mt-1">{fbmCount}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Category Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Category</h3>
//           <div className="space-y-3">
//             {Object.entries(categoryBreakdown).map(([category, count]) => (
//               <div key={category} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-32 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-500 h-2 rounded-full" 
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(categoryBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No categories yet</p>
//             )}
//           </div>
//         </div>

//         {/* Status Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Status</h3>
//           <div className="space-y-3">
//             {Object.entries(statusBreakdown).map(([status, count]) => (
//               <div key={status} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{status}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-32 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         status === 'active' ? 'bg-green-500' : 
//                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
//                       }`}
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(statusBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No products yet</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recent Products */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-bold mb-4">Recent Products</h3>
//         <div className="space-y-2">
//           {products.slice(0, 5).map(product => (
//             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
//                   {product.images && product.images.length > 0 ? (
//                     <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
//                   ) : (
//                     <Package size={20} className="text-gray-400" />
//                   )}
//                 </div>
//                 <div>
//                   <p className="font-semibold">{product.title}</p>
//                   <p className="text-sm text-gray-500">SKU: {product.sku} | {product.brand}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-green-600">${product.price}</p>
//                 <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
//                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {product.fulfillment}
//                 </span>
//               </div>
//             </div>
//           ))}
//           {products.length === 0 && (
//             <div className="text-center py-12">
//               <Package size={64} className="mx-auto text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg mb-2">No products yet</p>
//               <p className="text-gray-400 text-sm">Create your first product to get started!</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Alerts Section */}
//       {(stats.outOfStock > 0 || lowStockCount > 0) && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <AlertTriangle className="text-orange-500" />
//             Inventory Alerts
//           </h3>
//           <div className="space-y-3">
//             {stats.outOfStock > 0 && (
//               <div className="bg-red-50 border border-red-200 rounded p-4">
//                 <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
//                 <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
//               </div>
//             )}
//             {lowStockCount > 0 && (
//               <div className="bg-orange-50 border border-orange-200 rounded p-4">
//                 <p className="font-semibold text-orange-800">{lowStockCount} product(s) running low (less than 10 units)</p>
//                 <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// // Product List Component
// function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
//   const filteredProducts = products.filter(p => {
//     const matchesSearch = !filters.search || 
//       p.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
//       p.sku?.toLowerCase().includes(filters.search.toLowerCase()) ||
//       p.asin?.toLowerCase().includes(filters.search.toLowerCase());
    
//     const matchesStatus = filters.status === 'all' || p.status === filters.status;
//     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
//     return matchesSearch && matchesStatus && matchesFulfillment;
//   });

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedProducts(filteredProducts.map(p => p.id));
//     } else {
//       setSelectedProducts([]);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
//       try {
//         await API.bulkDelete(selectedProducts);
//         setSelectedProducts([]);
//         onRefresh();
//       } catch (error) {
//         alert('Error deleting products: ' + error.message);
//       }
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Products</h2>
//         <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//           Refresh
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by Name, SKU, ASIN..."
//               value={filters.search}
//               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//               className="w-full pl-10 pr-4 py-2 border rounded"
//             />
//           </div>
          
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="outofstock">Out of Stock</option>
//           </select>
          
//           <select
//             value={filters.fulfillment}
//             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Fulfillment</option>
//             <option value="FBA">FBA</option>
//             <option value="FBM">FBM</option>
//           </select>
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedProducts.length > 0 && (
//         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
//           <span className="font-semibold">{selectedProducts.length} products selected</span>
//           <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
//             Delete Selected
//           </button>
//         </div>
//       )}

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-4 text-left">
//                 <input
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
//                 />
//               </th>
//               <th className="p-4 text-left">Product</th>
//               <th className="p-4 text-left">SKU</th>
//               <th className="p-4 text-left">Status</th>
//               <th className="p-4 text-left">Price</th>
//               <th className="p-4 text-left">Quantity</th>
//               <th className="p-4 text-left">Fulfillment</th>
//               <th className="p-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map(product => (
//               <tr key={product.id} className="border-b hover:bg-gray-50">
//                 <td className="p-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedProducts.includes(product.id)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedProducts([...selectedProducts, product.id]);
//                       } else {
//                         setSelectedProducts(selectedProducts.filter(id => id !== product.id));
//                       }
//                     }}
//                   />
//                 </td>
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
//                       {product.images && product.images.length > 0 ? (
//                         <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
//                       ) : (
//                         <Package size={20} className="text-gray-400" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-semibold">{product.title}</p>
//                       <p className="text-sm text-gray-500">{product.brand}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-4 font-mono text-sm">{product.sku}</td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.status === 'active' ? 'bg-green-100 text-green-800' :
//                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {product.status?.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="p-4 font-semibold">${product.price}</td>
//                 <td className="p-4">
//                   <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
//                     {product.quantity || 0}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {product.fulfillment}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={async () => {
//                         if (window.confirm('Delete this product?')) {
//                           await API.deleteProduct(product.id);
//                           onRefresh();
//                         }
//                       }}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {filteredProducts.length === 0 && (
//           <div className="p-12 text-center text-gray-500">
//             <Package size={48} className="mx-auto mb-4 text-gray-300" />
//             <p>No products found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Create Product Component
// function CreateProduct({ onSuccess }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     productIdType: 'ASIN',
//     productId: '',
//     sku: '',
//     brand: '',
//     title: '',
//     category: '',
//     bulletPoints: ['', '', '', '', ''],
//     description: '',
//     images: [],
//     price: '',
//     quantity: '',
//     fulfillment: 'FBA',
//     status: 'active'
//   });

//   const handleSubmit = async () => {
//     try {
//       await API.createProduct(formData);
//       alert('Product created successfully!');
//       onSuccess();
//     } catch (error) {
//       alert('Error creating product: ' + error.message);
//     }
//   };

//   const updateFormData = (updates) => {
//     setFormData({ ...formData, ...updates });
//   };
  
//   const handleImageUpload = (files) => {
//     const selected = Array.from(files);
//     let images = [...formData.images];

//     selected.forEach((file) => {
//       if (images.length < 9) {
//         images.push({
//           file,
//           preview: URL.createObjectURL(file),
//         });
//       }
//     });

//     updateFormData({ images });
//   };

//   const removeImage = (index) => {
//     const updated = [...formData.images];
//     updated.splice(index, 1);
//     updateFormData({ images: updated });
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="flex justify-between items-center">
//           {[1, 2, 3].map(s => (
//             <div key={s} className="flex items-center flex-1">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
//               }`}>
//                 {s}
//               </div>
//               {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between mt-2 text-sm">
//           <span>Identity</span>
//           <span>Images</span>
//           <span>Pricing</span>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
//         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} handleImageUpload={handleImageUpload} removeImage={removeImage} />}
//         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}

//         <div className="flex justify-between mt-8 pt-6 border-t">
//           <button
//             onClick={() => setStep(Math.max(1, step - 1))}
//             disabled={step === 1}
//             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
//           >
//             Previous
//           </button>
          
//           {step < 3 ? (
//             <button
//               onClick={() => setStep(Math.min(3, step + 1))}
//               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Create Product
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Step1({ formData, updateFormData }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
//           <select
//             value={formData.productIdType}
//             onChange={(e) => updateFormData({ productIdType: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//           >
//             <option value="ASIN">ASIN</option>
//             <option value="UPC">UPC</option>
//             <option value="EAN">EAN</option>
//           </select>
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID</label>
//           <input
//             type="text"
//             value={formData.productId}
//             onChange={(e) => updateFormData({ productId: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="B08N5WRWNW"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">SKU *</label>
//         <input
//           type="text"
//           value={formData.sku}
//           onChange={(e) => updateFormData({ sku: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="SKU-12345"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Brand *</label>
//         <input
//           type="text"
//           value={formData.brand}
//           onChange={(e) => updateFormData({ brand: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Your Brand Name"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Title *</label>
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => updateFormData({ title: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Product Title with Key Features"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Category *</label>
//         <select
//           value={formData.category}
//           onChange={(e) => updateFormData({ category: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           required
//         >
//           <option value="">Select Category</option>
//           <option value="electronics">Electronics</option>
//           <option value="clothing">Clothing</option>
//           <option value="home">Home & Kitchen</option>
//           <option value="sports">Sports & Outdoors</option>
//           <option value="books">Books</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Description</label>
//         <textarea
//           value={formData.description}
//           onChange={(e) => updateFormData({ description: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           rows={4}
//           placeholder="Detailed product description..."
//         />
//       </div>
//     </div>
//   );
// }

// function Step2({ formData, updateFormData, handleImageUpload, removeImage }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 2: Product Images</h3>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
//         <div
//           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
//           onClick={() => document.getElementById("uploadImagesInput").click()}
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={(e) => {
//             e.preventDefault();
//             handleImageUpload(e.dataTransfer.files);
//           }}
//         >
//           <Upload className="mx-auto text-gray-400 mb-4" size={48} />
//           <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
//           <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels</p>
//           <input
//             type="file"
//             id="uploadImagesInput"
//             accept="image/*"
//             multiple
//             className="hidden"
//             onChange={(e) => handleImageUpload(e.target.files)}
//           />
//         </div>
//       </div>

//       {formData.images?.length > 0 && (
//         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
//           {formData.images.map((img, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={img.preview}
//                 className="w-full h-28 object-cover rounded border"
//                 alt={`Preview ${index + 1}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(index)}
//                 className="absolute top-1 right-1 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//               {index === 0 && (
//                 <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
//                   Main
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function Step3({ formData, updateFormData }) {
//   const calculateFees = () => {
//     const price = parseFloat(formData.price) || 0;
//     const referralFee = price * 0.15;
//     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
//     const totalFees = referralFee + fbaFee;
//     const netProceeds = price - totalFees;
    
//     return { referralFee, fbaFee, totalFees, netProceeds };
//   };

//   const fees = calculateFees();

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 3: Pricing & Inventory</h3>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.price}
//               onChange={(e) => updateFormData({ price: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2">Quantity *</label>
//           <input
//             type="number"
//             value={formData.quantity}
//             onChange={(e) => updateFormData({ quantity: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="0"
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
//         <div className="flex gap-4">
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBA"
//               checked={formData.fulfillment === 'FBA'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Amazon (FBA)</span>
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBM"
//               checked={formData.fulfillment === 'FBM'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Merchant (FBM)</span>
//           </label>
//         </div>
//       </div>

//       <div className="bg-green-50 border border-green-200 rounded p-4">
//         <h4 className="font-semibold mb-3">Fee Preview</h4>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Price:</span>
//             <span className="font-semibold">${formData.price || '0.00'}</span>
//           </div>
//           <div className="flex justify-between text-red-600">
//             <span>Referral Fee (15%):</span>
//             <span>-${fees.referralFee.toFixed(2)}</span>
//           </div>
//           {formData.fulfillment === 'FBA' && (
//             <div className="flex justify-between text-red-600">
//               <span>FBA Fee:</span>
//               <span>-${fees.fbaFee.toFixed(2)}</span>
//             </div>
//           )}
//           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
//             <span>Total Fees:</span>
//             <span>-${fees.totalFees.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
//             <span>Your Net Proceeds:</span>
//             <span>${fees.netProceeds.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Reports Component
// function Reports({ products }) {
//   const [reportType, setReportType] = useState('all');

//   const generateReport = () => {
//     let data = products;
    
//     switch(reportType) {
//       case 'active':
//         data = products.filter(p => p.status === 'active');
//         break;
//       case 'inactive':
//         data = products.filter(p => p.status === 'inactive');
//         break;
//       case 'fba':
//         data = products.filter(p => p.fulfillment === 'FBA');
//         break;
//       case 'lowstock':
//         data = products.filter(p => p.quantity < 10);
//         break;
//       default:
//         data = products;
//     }
    
//     return data;
//   };

//   const reportData = generateReport();

//   const downloadCSV = () => {
//     const headers = ['SKU', 'Title', 'Brand', 'Price', 'Quantity', 'Status', 'Fulfillment'];
//     const rows = reportData.map(p => [
//       p.sku, p.title, p.brand, p.price, p.quantity, p.status, p.fulfillment
//     ]);
    
//     const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Reports</h2>
//         <button
//           onClick={downloadCSV}
//           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           <Download size={20} />
//           Download CSV
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <label className="block text-sm font-semibold mb-2">Report Type</label>
//         <select
//           value={reportType}
//           onChange={(e) => setReportType(e.target.value)}
//           className="w-full max-w-md px-4 py-2 border rounded"
//         >
//           <option value="all">All Listings Report</option>
//           <option value="active">Active Listings</option>
//           <option value="inactive">Inactive Listings</option>
//           <option value="fba">FBA Inventory Report</option>
//           <option value="lowstock">Low Stock Alert</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="p-4 bg-gray-50 border-b">
//           <h3 className="font-semibold">
//             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
//           </h3>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="p-4 text-left">SKU</th>
//                 <th className="p-4 text-left">Title</th>
//                 <th className="p-4 text-left">Brand</th>
//                 <th className="p-4 text-left">Price</th>
//                 <th className="p-4 text-left">Quantity</th>
//                 <th className="p-4 text-left">Status</th>
//                 <th className="p-4 text-left">Fulfillment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map(product => (
//                 <tr key={product.id} className="border-b hover:bg-gray-50">
//                   <td className="p-4 font-mono text-sm">{product.sku}</td>
//                   <td className="p-4">{product.title}</td>
//                   <td className="p-4">{product.brand}</td>
//                   <td className="p-4 font-semibold">${product.price}</td>
//                   <td className="p-4">
//                     <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
//                       {product.quantity || 0}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.status === 'active' ? 'bg-green-100 text-green-800' :
//                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {product.status?.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {product.fulfillment}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {reportData.length === 0 && (
//             <div className="p-12 text-center text-gray-500">
//               <Package size={48} className="mx-auto mb-4 text-gray-300" />
//               <p>No products found for this report</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';

// // API Configuration
// const API_BASE_URL = 'http://localhost:8000/api';

// // API Service with backend integration and fallback to persistent storage
// const API = {
//   STORAGE_KEY: "products-data",
//   VENDOR_KEY: "current-vendor",

//   getFromStorage: async () => {
//     try {
//       const data = localStorage.getItem(API.STORAGE_KEY);
//       return data ? JSON.parse(data) : [];
//     } catch (e) {
//       console.error("Storage read error:", e);
//       return [];
//     }
//   },

//   saveToStorage: async (products) => {
//     try {
//       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
//       return products;
//     } catch (e) {
//       console.error("Storage write error:", e);
//       throw e;
//     }
//   },

//   getCurrentVendor: async () => {
//     try {
//       // Fallback to localStorage if window.storage doesn't exist
//       if (typeof window !== 'undefined' && window.localStorage) {
//         const vendor = localStorage.getItem(API.VENDOR_KEY);
//         return vendor || "default-vendor";
//       }
//       return "default-vendor";
//     } catch {
//       return "default-vendor";
//     }
//   },

//   setCurrentVendor: async (vendorId) => {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         localStorage.setItem(API.VENDOR_KEY, vendorId);
//       }
//     } catch (e) {
//       console.error("Vendor save error:", e);
//     }
//   },

//   getProducts: async () => {
//     try {
//       const vendorId = await API.getCurrentVendor();
      
//       // Only try to fetch if API_BASE_URL is available and we're not in test environment
//       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
//         const response = await fetch(`${API_BASE_URL}/products?vendorId=${vendorId}`);
        
//         if (!response.ok) throw new Error("API failed");
        
//         const data = await response.json();
//         return data.products || data;
//       } else {
//         throw new Error("Using local storage");
//       }
//     } catch {
//       console.log("Using local storage");
//       return await API.getFromStorage();
//     }
//   },

//   createProduct: async (product) => {
//     const vendorId = await API.getCurrentVendor();

//     const productData = {
//       ...product,
//       vendorId,
//       id: Date.now().toString(), // Ensure ID is always generated
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       // Only try API if available
//       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
//         const response = await fetch(`${API_BASE_URL}/products`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(productData),
//         });

//         if (!response.ok) throw new Error("API failed");

//         const data = await response.json();
//         return data.product || data;
//       } else {
//         throw new Error("Using local storage");
//       }
//     } catch {
//       console.log("Saving locally");
//       const products = await API.getFromStorage();
//       products.push(productData);
//       await API.saveToStorage(products);
//       return productData;
//     }
//   },

//   updateProduct: async (id, updates) => {
//     try {
//       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
//         const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updates),
//         });

//         if (!response.ok) throw new Error("API failed");

//         const data = await response.json();
//         return data.product || data;
//       } else {
//         throw new Error("Using local storage");
//       }
//     } catch {
//       console.log("Updating locally");
//       const products = await API.getFromStorage();
//       const index = products.findIndex((p) => p.id === id);

//       if (index !== -1) {
//         products[index] = {
//           ...products[index],
//           ...updates,
//           updatedAt: new Date().toISOString(),
//         };
//         await API.saveToStorage(products);
//         return products[index];
//       }

//       throw new Error("Product not found");
//     }
//   },

//   deleteProduct: async (id) => {
//     try {
//       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
//         const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//           method: "DELETE",
//         });

//         if (!response.ok) throw new Error("API failed");
//         return true;
//       } else {
//         throw new Error("Using local storage");
//       }
//     } catch {
//       console.log("Deleting locally");
//       const products = await API.getFromStorage();
//       const filtered = products.filter((p) => p.id !== id);
//       await API.saveToStorage(filtered);
//       return true;
//     }
//   },

//   // Add missing bulkDelete method
//   bulkDelete: async (productIds) => {
//     try {
//       // Try API first if available
//       if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
//         const response = await fetch(`${API_BASE_URL}/products/bulk-delete`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ productIds }),
//         });

//         if (!response.ok) throw new Error("API failed");
//         return true;
//       } else {
//         throw new Error("Using local storage");
//       }
//     } catch {
//       console.log("Deleting locally");
//       const products = await API.getFromStorage();
//       const filtered = products.filter((p) => !productIds.includes(p.id));
//       await API.saveToStorage(filtered);
//       return true;
//     }
//   }
// };

// // StatCard Component (was commented out)
// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-500 text-sm">{title}</p>
//           <p className="text-3xl font-bold mt-2">{value}</p>
//         </div>
//         <div className={`${color} text-white p-3 rounded-lg`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main App Component
// export default function AmazonProductManager() {
//   const [view, setView] = useState('dashboard');
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [currentVendor, setCurrentVendor] = useState("default-vendor");
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     fulfillment: 'all'
//   });

//   useEffect(() => {
//     loadCurrentVendor();
//     loadProducts();
//   }, []);

//   useEffect(() => {
//     if (currentVendor) {
//       loadProducts();
//     }
//   }, [currentVendor]);

//   const loadCurrentVendor = async () => {
//     const vendor = await API.getCurrentVendor();
//     setCurrentVendor(vendor);
//   };

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       const data = await API.getProducts();
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error loading products:', error);
//       alert('Failed to load products. Please try again.');
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVendorChange = async (vendorId) => {
//     await API.setCurrentVendor(vendorId);
//     setCurrentVendor(vendorId);
//   };

//   const stats = {
//     total: products.length,
//     active: products.filter(p => p.status === 'active').length,
//     outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
//     ipiScore: 750
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <h1 className="text-2xl font-bold">Product Manager</h1>
//             <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
//               <User size={18} />
//               <select
//                 value={currentVendor}
//                 onChange={(e) => handleVendorChange(e.target.value)}
//                 className="bg-transparent border-none text-white text-sm focus:outline-none"
//               >
//                 <option value="default-vendor">Default Vendor</option>
//                 <option value="vendor-1">Vendor 1</option>
//                 <option value="vendor-2">Vendor 2</option>
//                 <option value="vendor-3">Vendor 3</option>
//               </select>
//             </div>
//           </div>
//           <nav className="flex gap-4">
//             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Dashboard
//             </button>
//             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Products
//             </button>
//             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Create Product
//             </button>
//             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Reports
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-gray-500">Loading...</div>
//           </div>
//         ) : (
//           <>
//             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
//             {view === 'products' && (
//               <ProductList
//                 products={products}
//                 filters={filters}
//                 setFilters={setFilters}
//                 selectedProducts={selectedProducts}
//                 setSelectedProducts={setSelectedProducts}
//                 onRefresh={loadProducts}
//                 setView={setView}
//               />
//             )}
//             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); setView('products'); }} />}
//             {view === 'reports' && <Reports products={products} />}
//           </>
//         )}
//       </main>

//       {/* Floating Action Button */}
//       <button
//         onClick={() => setView('create')}
//         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
//       >
//         <Plus size={24} />
//       </button>
//     </div>
//   );
// }

// // Dashboard Component
// function Dashboard({ stats, products }) {
//   const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0);
//   const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0;
//   const lowStockCount = products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length;
//   const fbaCount = products.filter(p => p.fulfillment === 'FBA').length;
//   const fbmCount = products.filter(p => p.fulfillment === 'FBM').length;

//   const categoryBreakdown = products.reduce((acc, p) => {
//     const category = p.category || 'uncategorized';
//     acc[category] = (acc[category] || 0) + 1;
//     return acc;
//   }, {});

//   const statusBreakdown = products.reduce((acc, p) => {
//     const status = p.status || 'inactive';
//     acc[status] = (acc[status] || 0) + 1;
//     return acc;
//   }, {});

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Dashboard</h2>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
//         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
//         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
//         <StatCard title="Low Stock Alert" value={lowStockCount} icon={<AlertTriangle />} color="bg-orange-500" />
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">Total Inventory Value</p>
//           <p className="text-2xl font-bold text-green-600 mt-1">${totalValue.toFixed(2)}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">Average Price</p>
//           <p className="text-2xl font-bold text-blue-600 mt-1">${avgPrice.toFixed(2)}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">FBA Products</p>
//           <p className="text-2xl font-bold text-purple-600 mt-1">{fbaCount}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">FBM Products</p>
//           <p className="text-2xl font-bold text-yellow-600 mt-1">{fbmCount}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Category Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Category</h3>
//           <div className="space-y-3">
//             {Object.entries(categoryBreakdown).map(([category, count]) => (
//               <div key={category} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-32 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-500 h-2 rounded-full" 
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(categoryBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No categories yet</p>
//             )}
//           </div>
//         </div>

//         {/* Status Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Status</h3>
//           <div className="space-y-3">
//             {Object.entries(statusBreakdown).map(([status, count]) => (
//               <div key={status} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{status}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-32 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         status === 'active' ? 'bg-green-500' : 
//                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
//                       }`}
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(statusBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No products yet</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recent Products */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-bold mb-4">Recent Products</h3>
//         <div className="space-y-2">
//           {products.slice(0, 5).map(product => (
//             <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
//                   {product.images && product.images.length > 0 ? (
//                     <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
//                   ) : (
//                     <Package size={20} className="text-gray-400" />
//                   )}
//                 </div>
//                 <div>
//                   <p className="font-semibold">{product.title || 'Untitled Product'}</p>
//                   <p className="text-sm text-gray-500">SKU: {product.sku} | {product.brand}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-green-600">${product.price || '0.00'}</p>
//                 <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
//                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {product.fulfillment || 'FBM'}
//                 </span>
//               </div>
//             </div>
//           ))}
//           {products.length === 0 && (
//             <div className="text-center py-12">
//               <Package size={64} className="mx-auto text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg mb-2">No products yet</p>
//               <p className="text-gray-400 text-sm">Create your first product to get started!</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Alerts Section */}
//       {(stats.outOfStock > 0 || lowStockCount > 0) && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <AlertTriangle className="text-orange-500" />
//             Inventory Alerts
//           </h3>
//           <div className="space-y-3">
//             {stats.outOfStock > 0 && (
//               <div className="bg-red-50 border border-red-200 rounded p-4">
//                 <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
//                 <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
//               </div>
//             )}
//             {lowStockCount > 0 && (
//               <div className="bg-orange-50 border border-orange-200 rounded p-4">
//                 <p className="font-semibold text-orange-800">{lowStockCount} product(s) running low (less than 10 units)</p>
//                 <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Product List Component
// function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
//   const filteredProducts = products.filter(p => {
//     const matchesSearch = !filters.search || 
//       (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
//       (p.sku && p.sku.toLowerCase().includes(filters.search.toLowerCase())) ||
//       (p.asin && p.asin.toLowerCase().includes(filters.search.toLowerCase()));
    
//     const matchesStatus = filters.status === 'all' || p.status === filters.status;
//     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
//     return matchesSearch && matchesStatus && matchesFulfillment;
//   });

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedProducts(filteredProducts.map(p => p.id));
//     } else {
//       setSelectedProducts([]);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
//       try {
//         await API.bulkDelete(selectedProducts);
//         setSelectedProducts([]);
//         onRefresh();
//       } catch (error) {
//         alert('Error deleting products: ' + error.message);
//       }
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Products</h2>
//         <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//           Refresh
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by Name, SKU, ASIN..."
//               value={filters.search}
//               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//               className="w-full pl-10 pr-4 py-2 border rounded"
//             />
//           </div>
          
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="outofstock">Out of Stock</option>
//           </select>
          
//           <select
//             value={filters.fulfillment}
//             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Fulfillment</option>
//             <option value="FBA">FBA</option>
//             <option value="FBM">FBM</option>
//           </select>
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedProducts.length > 0 && (
//         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
//           <span className="font-semibold">{selectedProducts.length} products selected</span>
//           <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
//             Delete Selected
//           </button>
//         </div>
//       )}

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-4 text-left">
//                 <input
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
//                 />
//               </th>
//               <th className="p-4 text-left">Product</th>
//               <th className="p-4 text-left">SKU</th>
//               <th className="p-4 text-left">Status</th>
//               <th className="p-4 text-left">Price</th>
//               <th className="p-4 text-left">Quantity</th>
//               <th className="p-4 text-left">Fulfillment</th>
//               <th className="p-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map(product => (
//               <tr key={product.id} className="border-b hover:bg-gray-50">
//                 <td className="p-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedProducts.includes(product.id)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedProducts([...selectedProducts, product.id]);
//                       } else {
//                         setSelectedProducts(selectedProducts.filter(id => id !== product.id));
//                       }
//                     }}
//                   />
//                 </td>
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
//                       {product.images && product.images.length > 0 ? (
//                         <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
//                       ) : (
//                         <Package size={20} className="text-gray-400" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-semibold">{product.title || 'Untitled Product'}</p>
//                       <p className="text-sm text-gray-500">{product.brand}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-4 font-mono text-sm">{product.sku}</td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.status === 'active' ? 'bg-green-100 text-green-800' :
//                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {(product.status || 'inactive')?.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="p-4 font-semibold">${product.price || '0.00'}</td>
//                 <td className="p-4">
//                   <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
//                     {product.quantity || 0}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {product.fulfillment || 'FBM'}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={async () => {
//                         if (window.confirm('Delete this product?')) {
//                           await API.deleteProduct(product.id);
//                           onRefresh();
//                         }
//                       }}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {filteredProducts.length === 0 && (
//           <div className="p-12 text-center text-gray-500">
//             <Package size={48} className="mx-auto mb-4 text-gray-300" />
//             <p>No products found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Create Product Component (rest of the code remains the same as in your original)
// function CreateProduct({ onSuccess }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     productIdType: 'ASIN',
//     productId: '',
//     sku: '',
//     brand: '',
//     title: '',
//     category: '',
//     bulletPoints: ['', '', '', '', ''],
//     description: '',
//     images: [],
//     price: '',
//     quantity: '',
//     fulfillment: 'FBA',
//     status: 'active'
//   });

//   const handleSubmit = async () => {
//     try {
//       await API.createProduct(formData);
//       alert('Product created successfully!');
//       onSuccess();
//     } catch (error) {
//       alert('Error creating product: ' + error.message);
//     }
//   };

//   const updateFormData = (updates) => {
//     setFormData({ ...formData, ...updates });
//   };
  
//   const handleImageUpload = (files) => {
//     const selected = Array.from(files);
//     let images = [...formData.images];

//     selected.forEach((file) => {
//       if (images.length < 9) {
//         images.push({
//           file,
//           preview: URL.createObjectURL(file),
//         });
//       }
//     });

//     updateFormData({ images });
//   };

//   const removeImage = (index) => {
//     const updated = [...formData.images];
//     updated.splice(index, 1);
//     updateFormData({ images: updated });
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="flex justify-between items-center">
//           {[1, 2, 3].map(s => (
//             <div key={s} className="flex items-center flex-1">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
//               }`}>
//                 {s}
//               </div>
//               {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between mt-2 text-sm">
//           <span>Identity</span>
//           <span>Images</span>
//           <span>Pricing</span>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
//         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} handleImageUpload={handleImageUpload} removeImage={removeImage} />}
//         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}

//         <div className="flex justify-between mt-8 pt-6 border-t">
//           <button
//             onClick={() => setStep(Math.max(1, step - 1))}
//             disabled={step === 1}
//             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
//           >
//             Previous
//           </button>
          
//           {step < 3 ? (
//             <button
//               onClick={() => setStep(Math.min(3, step + 1))}
//               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Create Product
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Step1({ formData, updateFormData }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
//           <select
//             value={formData.productIdType}
//             onChange={(e) => updateFormData({ productIdType: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//           >
//             <option value="ASIN">ASIN</option>
//             <option value="UPC">UPC</option>
//             <option value="EAN">EAN</option>
//           </select>
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID</label>
//           <input
//             type="text"
//             value={formData.productId}
//             onChange={(e) => updateFormData({ productId: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="B08N5WRWNW"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">SKU *</label>
//         <input
//           type="text"
//           value={formData.sku}
//           onChange={(e) => updateFormData({ sku: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="SKU-12345"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Brand *</label>
//         <input
//           type="text"
//           value={formData.brand}
//           onChange={(e) => updateFormData({ brand: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Your Brand Name"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Title *</label>
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => updateFormData({ title: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//           placeholder="Product Title with Key Features"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Category *</label>
//         <select
//           value={formData.category}
//           onChange={(e) => updateFormData({ category: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           required
//         >
//           <option value="">Select Category</option>
//           <option value="electronics">Electronics</option>
//           <option value="clothing">Clothing</option>
//           <option value="home">Home & Kitchen</option>
//           <option value="sports">Sports & Outdoors</option>
//           <option value="books">Books</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Description</label>
//         <textarea
//           value={formData.description}
//           onChange={(e) => updateFormData({ description: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           rows={4}
//           placeholder="Detailed product description..."
//         />
//       </div>
//     </div>
//   );
// }

// function Step2({ formData, updateFormData, handleImageUpload, removeImage }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 2: Product Images</h3>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
//         <div
//           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
//           onClick={() => document.getElementById("uploadImagesInput").click()}
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={(e) => {
//             e.preventDefault();
//             handleImageUpload(e.dataTransfer.files);
//           }}
//         >
//           <Upload className="mx-auto text-gray-400 mb-4" size={48} />
//           <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
//           <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels</p>
//           <input
//             type="file"
//             id="uploadImagesInput"
//             accept="image/*"
//             multiple
//             className="hidden"
//             onChange={(e) => handleImageUpload(e.target.files)}
//           />
//         </div>
//       </div>

//       {formData.images?.length > 0 && (
//         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
//           {formData.images.map((img, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={img.preview}
//                 className="w-full h-28 object-cover rounded border"
//                 alt={`Preview ${index + 1}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(index)}
//                 className="absolute top-1 right-1 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//               {index === 0 && (
//                 <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
//                   Main
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function Step3({ formData, updateFormData }) {
//   const calculateFees = () => {
//     const price = parseFloat(formData.price) || 0;
//     const referralFee = price * 0.15;
//     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
//     const totalFees = referralFee + fbaFee;
//     const netProceeds = price - totalFees;
    
//     return { referralFee, fbaFee, totalFees, netProceeds };
//   };

//   const fees = calculateFees();

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 3: Pricing & Inventory</h3>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.price}
//               onChange={(e) => updateFormData({ price: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2">Quantity *</label>
//           <input
//             type="number"
//             value={formData.quantity}
//             onChange={(e) => updateFormData({ quantity: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="0"
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
//         <div className="flex gap-4">
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBA"
//               checked={formData.fulfillment === 'FBA'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Amazon (FBA)</span>
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBM"
//               checked={formData.fulfillment === 'FBM'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Merchant (FBM)</span>
//           </label>
//         </div>
//       </div>

//       <div className="bg-green-50 border border-green-200 rounded p-4">
//         <h4 className="font-semibold mb-3">Fee Preview</h4>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Price:</span>
//             <span className="font-semibold">${formData.price || '0.00'}</span>
//           </div>
//           <div className="flex justify-between text-red-600">
//             <span>Referral Fee (15%):</span>
//             <span>-${fees.referralFee.toFixed(2)}</span>
//           </div>
//           {formData.fulfillment === 'FBA' && (
//             <div className="flex justify-between text-red-600">
//               <span>FBA Fee:</span>
//               <span>-${fees.fbaFee.toFixed(2)}</span>
//             </div>
//           )}
//           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
//             <span>Total Fees:</span>
//             <span>-${fees.totalFees.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
//             <span>Your Net Proceeds:</span>
//             <span>${fees.netProceeds.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Reports Component (rest remains the same)
// function Reports({ products }) {
//   const [reportType, setReportType] = useState('all');

//   const generateReport = () => {
//     let data = products;
    
//     switch(reportType) {
//       case 'active':
//         data = products.filter(p => p.status === 'active');
//         break;
//       case 'inactive':
//         data = products.filter(p => p.status === 'inactive');
//         break;
//       case 'fba':
//         data = products.filter(p => p.fulfillment === 'FBA');
//         break;
//       case 'lowstock':
//         data = products.filter(p => (p.quantity || 0) < 10);
//         break;
//       default:
//         data = products;
//     }
    
//     return data;
//   };

//   const reportData = generateReport();

//   const downloadCSV = () => {
//     const headers = ['SKU', 'Title', 'Brand', 'Price', 'Quantity', 'Status', 'Fulfillment'];
//     const rows = reportData.map(p => [
//       p.sku, 
//       p.title || 'Untitled Product', 
//       p.brand, 
//       p.price || '0.00', 
//       p.quantity || 0, 
//       p.status || 'inactive', 
//       p.fulfillment || 'FBM'
//     ]);
    
//     const csv = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Reports</h2>
//         <button
//           onClick={downloadCSV}
//           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           <Download size={20} />
//           Download CSV
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <label className="block text-sm font-semibold mb-2">Report Type</label>
//         <select
//           value={reportType}
//           onChange={(e) => setReportType(e.target.value)}
//           className="w-full max-w-md px-4 py-2 border rounded"
//         >
//           <option value="all">All Listings Report</option>
//           <option value="active">Active Listings</option>
//           <option value="inactive">Inactive Listings</option>
//           <option value="fba">FBA Inventory Report</option>
//           <option value="lowstock">Low Stock Alert</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="p-4 bg-gray-50 border-b">
//           <h3 className="font-semibold">
//             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
//           </h3>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="p-4 text-left">SKU</th>
//                 <th className="p-4 text-left">Title</th>
//                 <th className="p-4 text-left">Brand</th>
//                 <th className="p-4 text-left">Price</th>
//                 <th className="p-4 text-left">Quantity</th>
//                 <th className="p-4 text-left">Status</th>
//                 <th className="p-4 text-left">Fulfillment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map(product => (
//                 <tr key={product.id} className="border-b hover:bg-gray-50">
//                   <td className="p-4 font-mono text-sm">{product.sku}</td>
//                   <td className="p-4">{product.title || 'Untitled Product'}</td>
//                   <td className="p-4">{product.brand}</td>
//                   <td className="p-4 font-semibold">${product.price || '0.00'}</td>
//                   <td className="p-4">
//                     <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
//                       {product.quantity || 0}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.status === 'active' ? 'bg-green-100 text-green-800' :
//                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {(product.status || 'inactive')?.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {product.fulfillment || 'FBM'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {reportData.length === 0 && (
//             <div className="p-12 text-center text-gray-500">
//               <Package size={48} className="mx-auto mb-4 text-gray-300" />
//               <p>No products found for this report</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';

// // API Configuration
// const API_BASE_URL = 'http://localhost:8000/api';

// // Enhanced API Service with proper payload handling
// const API = {
//   STORAGE_KEY: "products-data",
//   VENDOR_KEY: "current-vendor",

//   // Helper method to handle API requests
//   async makeRequest(endpoint, options = {}) {
//     try {
//       const url = `${API_BASE_URL}${endpoint}`;
//       console.log(`Making API request to: ${url}`, options);
      
//       const response = await fetch(url, {
//         headers: {
//           'Content-Type': 'application/json',
//           ...options.headers,
//         },
//         ...options,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log(`API response from ${url}:`, data);
//       return data;
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   },

//   getFromStorage: async () => {
//     try {
//       const data = localStorage.getItem(API.STORAGE_KEY);
//       return data ? JSON.parse(data) : [];
//     } catch (e) {
//       console.error("Storage read error:", e);
//       return [];
//     }
//   },

//   saveToStorage: async (products) => {
//     try {
//       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
//       return products;
//     } catch (e) {
//       console.error("Storage write error:", e);
//       throw e;
//     }
//   },

//   getCurrentVendor: async () => {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         const vendor = localStorage.getItem(API.VENDOR_KEY);
//         return vendor || "default";
//       }
//       return "default";
//     } catch {
//       return "default";
//     }
//   },

//   setCurrentVendor: async (vendorId) => {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         localStorage.setItem(API.VENDOR_KEY, vendorId);
//       }
//     } catch (e) {
//       console.error("Vendor save error:", e);
//     }
//   },

//   // Get all products - REMOVED vendor filtering to show all products
//   getProducts: async () => {
//     try {
//       console.log(`Fetching all products...`);
      
//       const data = await API.makeRequest(`/products`);
      
//       // Handle different response formats
//       if (data.success && data.products) {
//         console.log(`Received ${data.products.length} products from API`);
//         return data.products;
//       } else if (Array.isArray(data)) {
//         console.log(`Received ${data.length} products from API (array format)`);
//         return data;
//       } else {
//         console.log('Unexpected API response format:', data);
//         return [];
//       }
//     } catch (error) {
//       console.log("Using local storage due to API error:", error);
//       const localProducts = await API.getFromStorage();
//       console.log(`Loaded ${localProducts.length} products from local storage`);
//       return localProducts;
//     }
//   },

//   // Create new product with complete payload - FIXED
//   createProduct: async (product) => {
//     // Auto-generate vendor ID based on user or use default
//     const vendorId = "default"; // You can modify this to get from user context

//     const productData = {
//       ...product,
//       vendorId,
//       // Remove client-generated ID - let MongoDB generate _id
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     // Remove the client-generated ID for API calls
//     delete productData.id;

//     try {
//       console.log('Creating product via API:', productData);
//       const data = await API.makeRequest('/products', {
//         method: 'POST',
//         body: JSON.stringify(productData),
//       });
      
//       if (data.success && data.product) {
//         console.log('Product created successfully via API');
//         return data.product;
//       } else {
//         throw new Error('Invalid API response format');
//       }
//     } catch (error) {
//       console.log("Saving locally due to API error:", error);
//       // For local storage, we still need an ID
//       const localProduct = {
//         ...productData,
//         id: Date.now().toString(),
//       };
//       const products = await API.getFromStorage();
//       products.push(localProduct);
//       await API.saveToStorage(products);
//       console.log('Product saved locally');
//       return localProduct;
//     }
//   },

//   // Update product with complete payload - FIXED
//   updateProduct: async (id, updates) => {
//     const updateData = {
//       ...updates,
//       updatedAt: new Date().toISOString(),
//     };

//     try {
//       console.log(`Updating product ${id} via API:`, updateData);
//       const data = await API.makeRequest(`/products/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(updateData),
//       });
      
//       if (data.success && data.product) {
//         console.log('Product updated successfully via API');
//         return data.product;
//       } else {
//         throw new Error('Invalid API response format');
//       }
//     } catch (error) {
//       console.log("Updating locally due to API error:", error);
//       const products = await API.getFromStorage();
//       const index = products.findIndex((p) => p.id === id);

//       if (index !== -1) {
//         products[index] = {
//           ...products[index],
//           ...updateData,
//         };
//         await API.saveToStorage(products);
//         console.log('Product updated locally');
//         return products[index];
//       }

//       throw new Error("Product not found");
//     }
//   },

//   // Delete product - FIXED
//   deleteProduct: async (id) => {
//     try {
//       console.log(`Deleting product ${id} via API`);
//       const data = await API.makeRequest(`/products/${id}`, {
//         method: 'DELETE',
//       });
      
//       if (data.success) {
//         console.log('Product deleted successfully via API');
//         return true;
//       } else {
//         throw new Error('Invalid API response format');
//       }
//     } catch (error) {
//       console.log("Deleting locally due to API error:", error);
//       const products = await API.getFromStorage();
//       const filtered = products.filter((p) => p.id !== id);
//       await API.saveToStorage(filtered);
//       console.log('Product deleted locally');
//       return true;
//     }
//   },

//   // Bulk delete products - FIXED
//   bulkDelete: async (productIds) => {
//     try {
//       console.log(`Bulk deleting products via API:`, productIds);
//       const data = await API.makeRequest('/products/bulk-delete', {
//         method: 'POST',
//         body: JSON.stringify({ productIds }),
//       });
      
//       if (data.success) {
//         console.log(`Bulk delete successful via API, deleted ${data.deletedCount} products`);
//         return true;
//       } else {
//         throw new Error('Invalid API response format');
//       }
//     } catch (error) {
//       console.log("Bulk deleting locally due to API error:", error);
//       const products = await API.getFromStorage();
//       const filtered = products.filter((p) => !productIds.includes(p.id));
//       await API.saveToStorage(filtered);
//       console.log('Products deleted locally');
//       return true;
//     }
//   },

//   // Get product statistics - FIXED (all vendors)
//   getProductStats: async () => {
//     try {
//       console.log(`Fetching stats for all products...`);
      
//       const data = await API.makeRequest(`/products/stats`);
      
//       if (data.success && data.stats) {
//         console.log('Received stats from API:', data.stats);
//         return data.stats;
//       } else {
//         throw new Error('Invalid API response format for stats');
//       }
//     } catch (error) {
//       console.log("Using local storage for stats due to API error:", error);
//       const products = await API.getFromStorage();
      
//       const stats = {
//         total: products.length,
//         active: products.filter(p => p.status === 'active').length,
//         outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
//         lowStock: products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length,
//         fbaCount: products.filter(p => p.fulfillment === 'FBA').length,
//         fbmCount: products.filter(p => p.fulfillment === 'FBM').length,
//         totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0),
//         avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0,
//       };
      
//       console.log('Calculated stats locally:', stats);
//       return stats;
//     }
//   },

//   // Get all vendors from products
//   getVendors: async () => {
//     try {
//       const products = await API.getProducts();
//       const vendors = [...new Set(products.map(p => p.vendorId).filter(Boolean))];
//       return vendors;
//     } catch (error) {
//       console.error('Error getting vendors:', error);
//       return [];
//     }
//   }
// };

// // StatCard Component
// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-500 text-sm">{title}</p>
//           <p className="text-3xl font-bold mt-2">{value}</p>
//         </div>
//         <div className={`${color} text-white p-3 rounded-lg`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main App Component - REMOVED vendor dropdown
// export default function AmazonProductManager() {
//   const [view, setView] = useState('dashboard');
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     fulfillment: 'all'
//   });
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     outOfStock: 0,
//     lowStock: 0,
//     fbaCount: 0,
//     fbmCount: 0,
//     totalValue: 0,
//     avgPrice: 0
//   });

//   useEffect(() => {
//     loadProducts();
//     loadStats();
//   }, []);

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       console.log('Loading products...');
//       const data = await API.getProducts();
//       console.log('Products loaded:', data);
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error loading products:', error);
//       alert('Failed to load products. Please try again.');
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadStats = async () => {
//     try {
//       console.log('Loading stats...');
//       const data = await API.getProductStats();
//       console.log('Stats loaded:', data);
//       setStats(data);
//     } catch (error) {
//       console.error('Error loading stats:', error);
//       // Set default stats on error
//       setStats({
//         total: 0,
//         active: 0,
//         outOfStock: 0,
//         lowStock: 0,
//         fbaCount: 0,
//         fbmCount: 0,
//         totalValue: 0,
//         avgPrice: 0
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - REMOVED vendor dropdown */}
//       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <h1 className="text-2xl font-bold">Amazon Product Manager</h1>
//             <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
//               <User size={18} />
//               <span className="text-sm">All Products</span>
//             </div>
//           </div>
//           <nav className="flex gap-4">
//             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Dashboard
//             </button>
//             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Products
//             </button>
//             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Create Product
//             </button>
//             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Reports
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-gray-500">Loading products...</div>
//           </div>
//         ) : (
//           <>
//             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
//             {view === 'products' && (
//               <ProductList
//                 products={products}
//                 filters={filters}
//                 setFilters={setFilters}
//                 selectedProducts={selectedProducts}
//                 setSelectedProducts={setSelectedProducts}
//                 onRefresh={loadProducts}
//                 setView={setView}
//               />
//             )}
//             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); loadStats(); setView('products'); }} />}
//             {view === 'reports' && <Reports products={products} />}
//           </>
//         )}
//       </main>

//       {/* Floating Action Button */}
//       <button
//         onClick={() => setView('create')}
//         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
//       >
//         <Plus size={24} />
//       </button>
//     </div>
//   );
// }

// // Dashboard Component - UPDATED to show all products
// function Dashboard({ stats, products }) {
//   const categoryBreakdown = products.reduce((acc, p) => {
//     const category = p.category || 'uncategorized';
//     acc[category] = (acc[category] || 0) + 1;
//     return acc;
//   }, {});

//   const statusBreakdown = products.reduce((acc, p) => {
//     const status = p.status || 'inactive';
//     acc[status] = (acc[status] || 0) + 1;
//     return acc;
//   }, {});

//   const vendorBreakdown = products.reduce((acc, p) => {
//     const vendor = p.vendorId || 'default';
//     acc[vendor] = (acc[vendor] || 0) + 1;
//     return acc;
//   }, {});

//   // Helper function to get product ID (handles both MongoDB _id and local id)
//   const getProductId = (product) => {
//     return product._id || product.id;
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Dashboard - All Products</h2>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
//         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
//         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
//         <StatCard title="Low Stock Alert" value={stats.lowStock} icon={<AlertTriangle />} color="bg-orange-500" />
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">Total Inventory Value</p>
//           <p className="text-2xl font-bold text-green-600 mt-1">${stats.totalValue?.toFixed(2) || '0.00'}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">Average Price</p>
//           <p className="text-2xl font-bold text-blue-600 mt-1">${stats.avgPrice?.toFixed(2) || '0.00'}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">FBA Products</p>
//           <p className="text-2xl font-bold text-purple-600 mt-1">{stats.fbaCount || 0}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">FBM Products</p>
//           <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.fbmCount || 0}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Category Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Category</h3>
//           <div className="space-y-3">
//             {Object.entries(categoryBreakdown).map(([category, count]) => (
//               <div key={category} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-24 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-500 h-2 rounded-full" 
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(categoryBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No categories yet</p>
//             )}
//           </div>
//         </div>

//         {/* Status Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Status</h3>
//           <div className="space-y-3">
//             {Object.entries(statusBreakdown).map(([status, count]) => (
//               <div key={status} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{status}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-24 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         status === 'active' ? 'bg-green-500' : 
//                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
//                       }`}
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(statusBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No products yet</p>
//             )}
//           </div>
//         </div>

//         {/* Vendor Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Vendor</h3>
//           <div className="space-y-3">
//             {Object.entries(vendorBreakdown).map(([vendor, count]) => (
//               <div key={vendor} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{vendor}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-24 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-purple-500 h-2 rounded-full" 
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(vendorBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No vendors yet</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recent Products */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-bold mb-4">Recent Products</h3>
//         <div className="space-y-2">
//           {products.slice(0, 5).map(product => (
//             <div key={getProductId(product)} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
//                   {product.images && product.images.length > 0 ? (
//                     <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
//                   ) : (
//                     <Package size={20} className="text-gray-400" />
//                   )}
//                 </div>
//                 <div>
//                   <p className="font-semibold">{product.title || 'Untitled Product'}</p>
//                   <p className="text-sm text-gray-500">SKU: {product.sku} | Vendor: {product.vendorId || 'default'}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-green-600">${product.price || '0.00'}</p>
//                 <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
//                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {product.fulfillment || 'FBM'}
//                 </span>
//               </div>
//             </div>
//           ))}
//           {products.length === 0 && (
//             <div className="text-center py-12">
//               <Package size={64} className="mx-auto text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg mb-2">No products yet</p>
//               <p className="text-gray-400 text-sm">Create your first product to get started!</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Alerts Section */}
//       {(stats.outOfStock > 0 || stats.lowStock > 0) && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <AlertTriangle className="text-orange-500" />
//             Inventory Alerts
//           </h3>
//           <div className="space-y-3">
//             {stats.outOfStock > 0 && (
//               <div className="bg-red-50 border border-red-200 rounded p-4">
//                 <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
//                 <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
//               </div>
//             )}
//             {stats.lowStock > 0 && (
//               <div className="bg-orange-50 border border-orange-200 rounded p-4">
//                 <p className="font-semibold text-orange-800">{stats.lowStock} product(s) running low (less than 10 units)</p>
//                 <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Product List Component - UPDATED to handle all products
// function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
//   // Helper function to get product ID (handles both MongoDB _id and local id)
//   const getProductId = (product) => {
//     return product._id || product.id;
//   };

//   const filteredProducts = products.filter(p => {
//     const matchesSearch = !filters.search || 
//       (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
//       (p.sku && p.sku.toLowerCase().includes(filters.search.toLowerCase())) ||
//       (p.productId && p.productId.toLowerCase().includes(filters.search.toLowerCase())) ||
//       (p.vendorId && p.vendorId.toLowerCase().includes(filters.search.toLowerCase()));
    
//     const matchesStatus = filters.status === 'all' || p.status === filters.status;
//     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
//     return matchesSearch && matchesStatus && matchesFulfillment;
//   });

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedProducts(filteredProducts.map(p => getProductId(p)));
//     } else {
//       setSelectedProducts([]);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
//       try {
//         await API.bulkDelete(selectedProducts);
//         setSelectedProducts([]);
//         onRefresh();
//       } catch (error) {
//         alert('Error deleting products: ' + error.message);
//       }
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">All Products ({products.length})</h2>
//         <div className="flex gap-2">
//           <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by Name, SKU, Product ID, Vendor..."
//               value={filters.search}
//               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//               className="w-full pl-10 pr-4 py-2 border rounded"
//             />
//           </div>
          
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="outofstock">Out of Stock</option>
//           </select>
          
//           <select
//             value={filters.fulfillment}
//             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Fulfillment</option>
//             <option value="FBA">FBA</option>
//             <option value="FBM">FBM</option>
//           </select>
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedProducts.length > 0 && (
//         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
//           <span className="font-semibold">{selectedProducts.length} products selected</span>
//           <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
//             Delete Selected
//           </button>
//         </div>
//       )}

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-4 text-left">
//                 <input
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
//                 />
//               </th>
//               <th className="p-4 text-left">Product</th>
//               <th className="p-4 text-left">SKU</th>
//               <th className="p-4 text-left">Vendor</th>
//               <th className="p-4 text-left">Status</th>
//               <th className="p-4 text-left">Price</th>
//               <th className="p-4 text-left">Quantity</th>
//               <th className="p-4 text-left">Fulfillment</th>
//               <th className="p-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map(product => (
//               <tr key={getProductId(product)} className="border-b hover:bg-gray-50">
//                 <td className="p-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedProducts.includes(getProductId(product))}
//                     onChange={(e) => {
//                       const productId = getProductId(product);
//                       if (e.target.checked) {
//                         setSelectedProducts([...selectedProducts, productId]);
//                       } else {
//                         setSelectedProducts(selectedProducts.filter(id => id !== productId));
//                       }
//                     }}
//                   />
//                 </td>
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
//                       {product.images && product.images.length > 0 ? (
//                         <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
//                       ) : (
//                         <Package size={20} className="text-gray-400" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-semibold">{product.title || 'Untitled Product'}</p>
//                       <p className="text-sm text-gray-500">{product.brand}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-4 font-mono text-sm">{product.sku}</td>
//                 <td className="p-4">
//                   <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
//                     {product.vendorId || 'default'}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.status === 'active' ? 'bg-green-100 text-green-800' :
//                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {(product.status || 'inactive')?.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="p-4 font-semibold">${product.price || '0.00'}</td>
//                 <td className="p-4">
//                   <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
//                     {product.quantity || 0}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {product.fulfillment || 'FBM'}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={async () => {
//                         if (window.confirm('Delete this product?')) {
//                           await API.deleteProduct(getProductId(product));
//                           onRefresh();
//                         }
//                       }}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {filteredProducts.length === 0 && (
//           <div className="p-12 text-center text-gray-500">
//             <Package size={48} className="mx-auto mb-4 text-gray-300" />
//             <p>No products found</p>
//             {products.length > 0 && (
//               <p className="text-sm text-gray-400 mt-2">Try adjusting your search filters</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Create Product Component - UPDATED to handle API responses properly
// function CreateProduct({ onSuccess }) {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     productIdType: 'ASIN',
//     productId: '',
//     sku: '',
//     brand: '',
//     title: '',
//     category: '',
//     bulletPoints: ['', '', '', '', ''],
//     description: '',
//     images: [],
//     price: '',
//     quantity: '',
//     fulfillment: 'FBA',
//     status: 'active'
//   });

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       // Prepare the payload with all form data
//       const payload = {
//         ...formData,
//         price: parseFloat(formData.price) || 0,
//         quantity: parseInt(formData.quantity) || 0,
//         // Convert images to base64 for API submission
//         images: await Promise.all(
//           formData.images.map(async (img) => {
//             if (img.file) {
//               // Convert file to base64 for API submission
//               return await convertFileToBase64(img.file);
//             }
//             return img;
//           })
//         )
//       };

//       console.log('Submitting product:', payload);
//       const result = await API.createProduct(payload);
//       console.log('Product creation result:', result);
      
//       alert('Product created successfully!');
//       onSuccess();
//     } catch (error) {
//       console.error('Error creating product:', error);
//       alert('Error creating product: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to convert file to base64
//   const convertFileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve({
//         filename: file.name,
//         data: reader.result,
//         preview: URL.createObjectURL(file)
//       });
//       reader.onerror = error => reject(error);
//     });
//   };

//   const updateFormData = (updates) => {
//     setFormData({ ...formData, ...updates });
//   };
  
//   const handleImageUpload = (files) => {
//     const selected = Array.from(files);
//     let images = [...formData.images];

//     selected.forEach((file) => {
//       if (images.length < 9) {
//         images.push({
//           file,
//           preview: URL.createObjectURL(file),
//         });
//       }
//     });

//     updateFormData({ images });
//   };

//   const removeImage = (index) => {
//     const updated = [...formData.images];
//     updated.splice(index, 1);
//     updateFormData({ images: updated });
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Create New Product</h2>
      
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="flex justify-between items-center">
//           {[1, 2, 3].map(s => (
//             <div key={s} className="flex items-center flex-1">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                 step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
//               }`}>
//                 {s}
//               </div>
//               {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between mt-2 text-sm">
//           <span>Identity</span>
//           <span>Images</span>
//           <span>Pricing</span>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         {step === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
//         {step === 2 && <Step2 formData={formData} updateFormData={updateFormData} handleImageUpload={handleImageUpload} removeImage={removeImage} />}
//         {step === 3 && <Step3 formData={formData} updateFormData={updateFormData} />}

//         <div className="flex justify-between mt-8 pt-6 border-t">
//           <button
//             onClick={() => setStep(Math.max(1, step - 1))}
//             disabled={step === 1 || loading}
//             className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
//           >
//             Previous
//           </button>
          
//           {step < 3 ? (
//             <button
//               onClick={() => setStep(Math.min(3, step + 1))}
//               className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//               disabled={loading}
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
//             >
//               {loading ? 'Creating...' : 'Create Product'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Step components remain the same...
// function Step1({ formData, updateFormData }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 1: Product Identity</h3>
      
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID Type</label>
//           <select
//             value={formData.productIdType}
//             onChange={(e) => updateFormData({ productIdType: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//           >
//             <option value="ASIN">ASIN</option>
//             <option value="UPC">UPC</option>
//             <option value="EAN">EAN</option>
//           </select>
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold mb-2">Product ID</label>
//           <input
//             type="text"
//             value={formData.productId}
//             onChange={(e) => updateFormData({ productId: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="B08N5WRWNW"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">SKU *</label>
//         <input
//           type="text"
//           value={formData.sku}
//           onChange={(e) => updateFormData({ sku: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="SKU-12345"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Brand *</label>
//         <input
//           type="text"
//           value={formData.brand}
//           onChange={(e) => updateFormData({ brand: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Your Brand Name"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Title *</label>
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => updateFormData({ title: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Product Title with Key Features"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Category *</label>
//         <select
//           value={formData.category}
//           onChange={(e) => updateFormData({ category: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           required
//         >
//           <option value="">Select Category</option>
//           <option value="electronics">Electronics</option>
//           <option value="clothing">Clothing</option>
//           <option value="home">Home & Kitchen</option>
//           <option value="sports">Sports & Outdoors</option>
//           <option value="books">Books</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Description</label>
//         <textarea
//           value={formData.description}
//           onChange={(e) => updateFormData({ description: e.target.value })}
//           className="w-full px-4 py-2 border rounded"
//           rows={4}
//           placeholder="Detailed product description..."
//         />
//       </div>
//     </div>
//   );
// }

// function Step2({ formData, updateFormData, handleImageUpload, removeImage }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 2: Product Images</h3>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Product Images (9 max)</label>
//         <div
//           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
//           onClick={() => document.getElementById("uploadImagesInput").click()}
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={(e) => {
//             e.preventDefault();
//             handleImageUpload(e.dataTransfer.files);
//           }}
//         >
//           <Upload className="mx-auto text-gray-400 mb-4" size={48} />
//           <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
//           <p className="text-sm text-gray-500">Recommended: 1000 x 1000 pixels</p>
//           <input
//             type="file"
//             id="uploadImagesInput"
//             accept="image/*"
//             multiple
//             className="hidden"
//             onChange={(e) => handleImageUpload(e.target.files)}
//           />
//         </div>
//       </div>

//       {formData.images?.length > 0 && (
//         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
//           {formData.images.map((img, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={img.preview}
//                 className="w-full h-28 object-cover rounded border"
//                 alt={`Preview ${index + 1}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(index)}
//                 className="absolute top-1 right-1 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//               {index === 0 && (
//                 <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
//                   Main
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function Step3({ formData, updateFormData }) {
//   const calculateFees = () => {
//     const price = parseFloat(formData.price) || 0;
//     const referralFee = price * 0.15;
//     const fbaFee = formData.fulfillment === 'FBA' ? 3.50 : 0;
//     const totalFees = referralFee + fbaFee;
//     const netProceeds = price - totalFees;
    
//     return { referralFee, fbaFee, totalFees, netProceeds };
//   };

//   const fees = calculateFees();

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-bold">Step 3: Pricing & Inventory</h3>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">Regular Price *</label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.price}
//               onChange={(e) => updateFormData({ price: e.target.value })}
//               className="w-full pl-8 pr-4 py-2 border rounded"
//               placeholder="0.00"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2">Quantity *</label>
//           <input
//             type="number"
//             value={formData.quantity}
//             onChange={(e) => updateFormData({ quantity: e.target.value })}
//             className="w-full px-4 py-2 border rounded"
//             placeholder="0"
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold mb-2">Fulfillment Method</label>
//         <div className="flex gap-4">
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBA"
//               checked={formData.fulfillment === 'FBA'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Amazon (FBA)</span>
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               value="FBM"
//               checked={formData.fulfillment === 'FBM'}
//               onChange={(e) => updateFormData({ fulfillment: e.target.value })}
//             />
//             <span>Fulfillment by Merchant (FBM)</span>
//           </label>
//         </div>
//       </div>

//       <div className="bg-green-50 border border-green-200 rounded p-4">
//         <h4 className="font-semibold mb-3">Fee Preview</h4>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Price:</span>
//             <span className="font-semibold">${formData.price || '0.00'}</span>
//           </div>
//           <div className="flex justify-between text-red-600">
//             <span>Referral Fee (15%):</span>
//             <span>-${fees.referralFee.toFixed(2)}</span>
//           </div>
//           {formData.fulfillment === 'FBA' && (
//             <div className="flex justify-between text-red-600">
//               <span>FBA Fee:</span>
//               <span>-${fees.fbaFee.toFixed(2)}</span>
//             </div>
//           )}
//           <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
//             <span>Total Fees:</span>
//             <span>-${fees.totalFees.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600 font-bold text-lg border-t pt-2">
//             <span>Your Net Proceeds:</span>
//             <span>${fees.netProceeds.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Reports Component - UPDATED to handle all products
// function Reports({ products }) {
//   const [reportType, setReportType] = useState('all');

//   const generateReport = () => {
//     let data = products;
    
//     switch(reportType) {
//       case 'active':
//         data = products.filter(p => p.status === 'active');
//         break;
//       case 'inactive':
//         data = products.filter(p => p.status === 'inactive');
//         break;
//       case 'fba':
//         data = products.filter(p => p.fulfillment === 'FBA');
//         break;
//       case 'lowstock':
//         data = products.filter(p => (p.quantity || 0) < 10);
//         break;
//       default:
//         data = products;
//     }
    
//     return data;
//   };

//   const reportData = generateReport();

//   const downloadCSV = () => {
//     const headers = ['SKU', 'Title', 'Brand', 'Vendor', 'Price', 'Quantity', 'Status', 'Fulfillment'];
//     const rows = reportData.map(p => [
//       p.sku, 
//       p.title || 'Untitled Product', 
//       p.brand, 
//       p.vendorId || 'default',
//       p.price || '0.00', 
//       p.quantity || 0, 
//       p.status || 'inactive', 
//       p.fulfillment || 'FBM'
//     ]);
    
//     const csv = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Reports - All Products</h2>
//         <button
//           onClick={downloadCSV}
//           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           <Download size={20} />
//           Download CSV
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <label className="block text-sm font-semibold mb-2">Report Type</label>
//         <select
//           value={reportType}
//           onChange={(e) => setReportType(e.target.value)}
//           className="w-full max-w-md px-4 py-2 border rounded"
//         >
//           <option value="all">All Listings Report</option>
//           <option value="active">Active Listings</option>
//           <option value="inactive">Inactive Listings</option>
//           <option value="fba">FBA Inventory Report</option>
//           <option value="lowstock">Low Stock Alert</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="p-4 bg-gray-50 border-b">
//           <h3 className="font-semibold">
//             {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({reportData.length} products)
//           </h3>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="p-4 text-left">SKU</th>
//                 <th className="p-4 text-left">Title</th>
//                 <th className="p-4 text-left">Brand</th>
//                 <th className="p-4 text-left">Vendor</th>
//                 <th className="p-4 text-left">Price</th>
//                 <th className="p-4 text-left">Quantity</th>
//                 <th className="p-4 text-left">Status</th>
//                 <th className="p-4 text-left">Fulfillment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map(product => (
//                 <tr key={product._id || product.id} className="border-b hover:bg-gray-50">
//                   <td className="p-4 font-mono text-sm">{product.sku}</td>
//                   <td className="p-4">{product.title || 'Untitled Product'}</td>
//                   <td className="p-4">{product.brand}</td>
//                   <td className="p-4">
//                     <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
//                       {product.vendorId || 'default'}
//                     </span>
//                   </td>
//                   <td className="p-4 font-semibold">${product.price || '0.00'}</td>
//                   <td className="p-4">
//                     <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
//                       {product.quantity || 0}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.status === 'active' ? 'bg-green-100 text-green-800' :
//                       product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {(product.status || 'inactive')?.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {product.fulfillment || 'FBM'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {reportData.length === 0 && (
//             <div className="p-12 text-center text-gray-500">
//               <Package size={48} className="mx-auto mb-4 text-gray-300" />
//               <p>No products found for this report</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';

// // API Configuration
// const API_BASE_URL = 'http://localhost:8000/api';

// // Enhanced API Service with proper payload handling
// const API = {
//   STORAGE_KEY: "products-data",
//   VENDOR_KEY: "current-vendor",

//   // Helper method to handle API requests
//   async makeRequest(endpoint, options = {}) {
//     try {
//       const url = `${API_BASE_URL}${endpoint}`;
//       console.log(`Making API request to: ${url}`, options);
      
//       const response = await fetch(url, {
//         headers: {
//           'Content-Type': 'application/json',
//           ...options.headers,
//         },
//         ...options,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log(`API response from ${url}:`, data);
//       return data;
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   },

//   getFromStorage: async () => {
//     try {
//       const data = localStorage.getItem(API.STORAGE_KEY);
//       return data ? JSON.parse(data) : [];
//     } catch (e) {
//       console.error("Storage read error:", e);
//       return [];
//     }
//   },

//   saveToStorage: async (products) => {
//     try {
//       localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
//       return products;
//     } catch (e) {
//       console.error("Storage write error:", e);
//       throw e;
//     }
//   },

//   getCurrentVendor: async () => {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         const vendor = localStorage.getItem(API.VENDOR_KEY);
//         return vendor || "default";
//       }
//       return "default";
//     } catch {
//       return "default";
//     }
//   },

//   setCurrentVendor: async (vendorId) => {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         localStorage.setItem(API.VENDOR_KEY, vendorId);
//       }
//     } catch (e) {
//       console.error("Vendor save error:", e);
//     }
//   },

//   // Get all products - REMOVED vendor filtering to show all products
//   getProducts: async () => {
//     try {
//       console.log(`Fetching all products...`);
      
//       const data = await API.makeRequest(`/products`);
      
//       // Handle different response formats
//       if (data.success && data.products) {
//         console.log(`Received ${data.products.length} products from API`);
//         return data.products;
//       } else if (Array.isArray(data)) {
//         console.log(`Received ${data.length} products from API (array format)`);
//         return data;
//       } else {
//         console.log('Unexpected API response format:', data);
//         return [];
//       }
//     } catch (error) {
//       console.log("Using local storage due to API error:", error);
//       const localProducts = await API.getFromStorage();
//       console.log(`Loaded ${localProducts.length} products from local storage`);
//       return localProducts;
//     }
//   },

//   // Create new product with complete payload - FIXED
//   createProduct: async (product) => {
//     // Auto-generate vendor ID based on user or use default
//     const vendorId = "default"; // You can modify this to get from user context

//     const productData = {
//       ...product,
//       vendorId,
//       // Remove client-generated ID - let MongoDB generate _id
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     // Remove the client-generated ID for API calls
//     delete productData.id;

//     try {
//       console.log('Creating product via API:', productData);
//       const data = await API.makeRequest('/products', {
//         method: 'POST',
//         body: JSON.stringify(productData),
//       });
      
//       if (data.success && data.product) {
//         console.log('Product created successfully via API');
//         return data.product;
//       } else {
//         throw new Error('Invalid API response format');
//       }
//     } catch (error) {
//       console.log("Saving locally due to API error:", error);
//       // For local storage, we still need an ID
//       const localProduct = {
//         ...productData,
//         id: Date.now().toString(),
//       };
//       const products = await API.getFromStorage();
//       products.push(localProduct);
//       await API.saveToStorage(products);
//       console.log('Product saved locally');
//       return localProduct;
//     }
//   },

//   // Update product with complete payload - FIXED
//   updateProduct: async (id, updates) => {
//     const updateData = {
//       ...updates,
//       updatedAt: new Date().toISOString(),
//     };

//     try {
//       console.log(`Updating product ${id} via API:`, updateData);
//       const data = await API.makeRequest(`/products/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(updateData),
//       });
      
//       if (data.success && data.product) {
//         console.log('Product updated successfully via API');
//         return data.product;
//       } else {
//         throw new Error('Invalid API response format');
//       }
//     } catch (error) {
//       console.log("Updating locally due to API error:", error);
//       const products = await API.getFromStorage();
//       const index = products.findIndex((p) => p.id === id);

//       if (index !== -1) {
//         products[index] = {
//           ...products[index],
//           ...updateData,
//         };
//         await API.saveToStorage(products);
//         console.log('Product updated locally');
//         return products[index];
//       }

//       throw new Error("Product not found");
//     }
//   },

//   // Delete product - FIXED
//   deleteProduct: async (id) => {
//     try {
//       console.log(`Deleting product ${id} via API`);
//       const data = await API.makeRequest(`/products/${id}`, {
//         method: 'DELETE',
//       });
      
//       if (data.success) {
//         console.log('Product deleted successfully via API');
//         return true;
//       } else {
//         throw new Error('Invalid API response format');
//       }
//     } catch (error) {
//       console.log("Deleting locally due to API error:", error);
//       const products = await API.getFromStorage();
//       const filtered = products.filter((p) => p.id !== id);
//       await API.saveToStorage(filtered);
//       console.log('Product deleted locally');
//       return true;
//     }
//   },

//   // Bulk delete products - FIXED
//   bulkDelete: async (productIds) => {
//     try {
//       console.log(`Bulk deleting products via API:`, productIds);
//       const data = await API.makeRequest('/products/bulk-delete', {
//         method: 'POST',
//         body: JSON.stringify({ productIds }),
//       });
      
//       if (data.success) {
//         console.log(`Bulk delete successful via API, deleted ${data.deletedCount} products`);
//         return true;
//       } else {
//         throw new Error('Invalid API response format');
//       }
//     } catch (error) {
//       console.log("Bulk deleting locally due to API error:", error);
//       const products = await API.getFromStorage();
//       const filtered = products.filter((p) => !productIds.includes(p.id));
//       await API.saveToStorage(filtered);
//       console.log('Products deleted locally');
//       return true;
//     }
//   },

//   // Get product statistics - FIXED (all vendors)
//   getProductStats: async () => {
//     try {
//       console.log(`Fetching stats for all products...`);
      
//       const data = await API.makeRequest(`/products/stats`);
      
//       if (data.success && data.stats) {
//         console.log('Received stats from API:', data.stats);
//         return data.stats;
//       } else {
//         throw new Error('Invalid API response format for stats');
//       }
//     } catch (error) {
//       console.log("Using local storage for stats due to API error:", error);
//       const products = await API.getFromStorage();
      
//       const stats = {
//         total: products.length,
//         active: products.filter(p => p.status === 'active').length,
//         outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
//         lowStock: products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length,
//         fbaCount: products.filter(p => p.fulfillment === 'FBA').length,
//         fbmCount: products.filter(p => p.fulfillment === 'FBM').length,
//         totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0),
//         avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0,
//       };
      
//       console.log('Calculated stats locally:', stats);
//       return stats;
//     }
//   },

//   // Get all vendors from products
//   getVendors: async () => {
//     try {
//       const products = await API.getProducts();
//       const vendors = [...new Set(products.map(p => p.vendorId).filter(Boolean))];
//       return vendors;
//     } catch (error) {
//       console.error('Error getting vendors:', error);
//       return [];
//     }
//   }
// };
   
// // StatCard Component
// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-500 text-sm">{title}</p>
//           <p className="text-3xl font-bold mt-2">{value}</p>
//         </div>
//         <div className={`${color} text-white p-3 rounded-lg`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Create Product Component
// function CreateProduct({ onSuccess }) {
//   const initialProductState = {
//     title: '',
//     sku: '',
//     brand: '',
//     price: 0.00,
//     quantity: 0,
//     category: '',
//     status: 'active',
//     fulfillment: 'FBM',
//     description: '',
//     productId: '',
//     images: [], // Placeholder for a simple image object
//   };
//   const [product, setProduct] = useState(initialProductState);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     setProduct(prev => ({
//       ...prev,
//       [name]: type === 'number' ? parseFloat(value) || 0 : value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     // Simple placeholder for image handling
//     const file = e.target.files[0];
//     if (file) {
//       setProduct(prev => ({
//         ...prev,
//         images: [{ 
//           url: URL.createObjectURL(file), 
//           preview: URL.createObjectURL(file), 
//           alt: file.name 
//         }],
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     // Simple validation
//     if (!product.title || !product.sku || product.price <= 0) {
//       setError("Title, SKU, and Price are required.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await API.createProduct(product);
//       setProduct(initialProductState); // Reset form
//       onSuccess(); // Navigate to products list and refresh data
//       alert('Product created successfully!');
//     } catch (err) {
//       setError(`Failed to create product: ${err.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Create New Product</h2>
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6">
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//             <strong className="font-bold">Error!</strong>
//             <span className="block sm:inline"> {error}</span>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Title and Brand */}
//           <label className="block">
//             <span className="text-gray-700">Product Title*</span>
//             <input
//               type="text"
//               name="title"
//               value={product.title}
//               onChange={handleChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//               required
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Brand</span>
//             <input
//               type="text"
//               name="brand"
//               value={product.brand}
//               onChange={handleChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//             />
//           </label>

//           {/* SKU and Product ID */}
//           <label className="block">
//             <span className="text-gray-700">SKU*</span>
//             <input
//               type="text"
//               name="sku"
//               value={product.sku}
//               onChange={handleChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//               required
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Amazon Product ID (ASIN/ISBN/etc)</span>
//             <input
//               type="text"
//               name="productId"
//               value={product.productId}
//               onChange={handleChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//             />
//           </label>

//           {/* Price and Quantity */}
//           <label className="block">
//             <span className="text-gray-700">Price ($)*</span>
//             <input
//               type="number"
//               name="price"
//               value={product.price}
//               onChange={handleChange}
//               min="0.01"
//               step="0.01"
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//               required
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Quantity</span>
//             <input
//               type="number"
//               name="quantity"
//               value={product.quantity}
//               onChange={handleChange}
//               min="0"
//               step="1"
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//             />
//           </label>

//           {/* Category and Fulfillment */}
//           <label className="block">
//             <span className="text-gray-700">Category</span>
//             <input
//               type="text"
//               name="category"
//               value={product.category}
//               onChange={handleChange}
//               placeholder="e.g., Electronics, HomeGoods"
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Fulfillment</span>
//             <select
//               name="fulfillment"
//               value={product.fulfillment}
//               onChange={handleChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//             >
//               <option value="FBM">FBM (Fulfilled by Merchant)</option>
//               <option value="FBA">FBA (Fulfilled by Amazon)</option>
//             </select>
//           </label>
//         </div>

//         {/* Status and Description */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <label className="block">
//             <span className="text-gray-700">Status</span>
//             <select
//               name="status"
//               value={product.status}
//               onChange={handleChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Description</span>
//             <textarea
//               name="description"
//               value={product.description}
//               onChange={handleChange}
//               rows="3"
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
//             ></textarea>
//           </label>
//         </div>

//         {/* Image Upload Placeholder */}
//         <div className="border p-4 rounded-md">
//           <h4 className="text-lg font-semibold mb-2">Product Images (Placeholder)</h4>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
//           />
//           {product.images.length > 0 && (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {product.images.map((img, index) => (
//                 <div key={index} className="w-16 h-16 relative border rounded overflow-hidden">
//                   <img src={img.preview} alt={img.alt} className="w-full h-full object-cover" />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
//         >
//           {isSubmitting ? 'Creating...' : (
//             <>
//               <Plus size={20} />
//               Create Product
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }

// // Reports Component
// function Reports({ products }) {
//   const getInventoryReport = () => {
//     return products.map(p => ({
//       'Product Title': p.title,
//       SKU: p.sku,
//       Price: `$${p.price.toFixed(2)}`,
//       Quantity: p.quantity,
//       'Total Value': `$${(p.price * p.quantity).toFixed(2)}`,
//       Status: p.status,
//       Fulfillment: p.fulfillment,
//       Vendor: p.vendorId || 'default',
//     }));
//   };

//   const downloadCSV = (data, filename) => {
//     if (data.length === 0) return;
//     const header = Object.keys(data[0]).join(',') + '\n';
//     const rows = data.map(obj => Object.values(obj).join(',') + '\n');
//     const csv = header + rows.join('');

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const inventoryReport = getInventoryReport();

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Product Reports & Analytics</h2>
      
//       {/* Report Generation */}
//       <div className="bg-white rounded-lg shadow p-6 space-y-4">
//         <h3 className="text-xl font-bold flex items-center gap-2">
//           <BarChart3 className="text-blue-500" />
//           Inventory Data Export
//         </h3>
//         <p className="text-gray-600">Generate and download a CSV file containing all product inventory details.</p>
//         <button
//           onClick={() => downloadCSV(inventoryReport, 'product_inventory_report.csv')}
//           className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
//         >
//           <Download size={20} />
//           Download Full Inventory CSV
//         </button>
//       </div>

//       {/* Low Stock Report Preview */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//           <AlertTriangle className="text-red-500" />
//           Low Stock Report (Quantity &lt; 10)
//         </h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {products
//                 .filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10)
//                 .map((product) => (
//                   <tr key={product._id || product.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{product.quantity}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.vendorId || 'default'}</td>
//                   </tr>
//                 ))}
//               {products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center py-4 text-gray-500">No low stock items currently.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


// // Main App Component - REMOVED vendor dropdown
// export default function AmazonProductManager() {
//   const [view, setView] = useState('dashboard');
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     fulfillment: 'all'
//   });
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     outOfStock: 0,
//     lowStock: 0,
//     fbaCount: 0,
//     fbmCount: 0,
//     totalValue: 0,
//     avgPrice: 0
//   });

//   useEffect(() => {
//     loadProducts();
//     loadStats();
//   }, []);

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       console.log('Loading products...');
//       const data = await API.getProducts();
//       console.log('Products loaded:', data);
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error loading products:', error);
//       alert('Failed to load products. Please try again.');
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadStats = async () => {
//     try {
//       console.log('Loading stats...');
//       const data = await API.getProductStats();
//       console.log('Stats loaded:', data);
//       setStats(data);
//     } catch (error) {
//       console.error('Error loading stats:', error);
//       // Set default stats on error
//       setStats({
//         total: 0,
//         active: 0,
//         outOfStock: 0,
//         lowStock: 0,
//         fbaCount: 0,
//         fbmCount: 0,
//         totalValue: 0,
//         avgPrice: 0
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - REMOVED vendor dropdown */}
//       <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <h1 className="text-2xl font-bold">Amazon Product Manager</h1>
//             <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
//               <User size={18} />
//               <span className="text-sm">All Products</span>
//             </div>
//           </div>
//           <nav className="flex gap-4">
//             <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Dashboard
//             </button>
//             <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Products
//             </button>
//             <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Create Product
//             </button>
//             <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
//               Reports
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-gray-500">Loading products...</div>
//           </div>
//         ) : (
//           <>
//             {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
//             {view === 'products' && (
//               <ProductList
//                 products={products}
//                 filters={filters}
//                 setFilters={setFilters}
//                 selectedProducts={selectedProducts}
//                 setSelectedProducts={setSelectedProducts}
//                 onRefresh={loadProducts}
//                 setView={setView}
//               />
//             )}
//             {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); loadStats(); setView('products'); }} />}
//             {view === 'reports' && <Reports products={products} />}
//           </>
//         )}
//       </main>

//       {/* Floating Action Button */}
//       <button
//         onClick={() => setView('create')}
//         className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
//       >
//         <Plus size={24} />
//       </button>
//     </div>
//   );
// }

// // Dashboard Component - UPDATED to show all products
// function Dashboard({ stats, products }) {
//   const categoryBreakdown = products.reduce((acc, p) => {
//     const category = p.category || 'uncategorized';
//     acc[category] = (acc[category] || 0) + 1;
//     return acc;
//   }, {});

//   const statusBreakdown = products.reduce((acc, p) => {
//     const status = p.status || 'inactive';
//     acc[status] = (acc[status] || 0) + 1;
//     return acc;
//   }, {});

//   const vendorBreakdown = products.reduce((acc, p) => {
//     const vendor = p.vendorId || 'default';
//     acc[vendor] = (acc[vendor] || 0) + 1;
//     return acc;
//   }, {});

//   // Helper function to get product ID (handles both MongoDB _id and local id)
//   const getProductId = (product) => {
//     return product._id || product.id;
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Dashboard - All Products</h2>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
//         <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
//         <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
//         <StatCard title="Low Stock Alert" value={stats.lowStock} icon={<AlertTriangle />} color="bg-orange-500" />
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">Total Inventory Value</p>
//           <p className="text-2xl font-bold text-green-600 mt-1">${stats.totalValue?.toFixed(2) || '0.00'}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">Average Price</p>
//           <p className="text-2xl font-bold text-blue-600 mt-1">${stats.avgPrice?.toFixed(2) || '0.00'}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">FBA Products</p>
//           <p className="text-2xl font-bold text-purple-600 mt-1">{stats.fbaCount || 0}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-gray-500 text-sm">FBM Products</p>
//           <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.fbmCount || 0}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Category Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Category</h3>
//           <div className="space-y-3">
//             {Object.entries(categoryBreakdown).map(([category, count]) => (
//               <div key={category} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-24 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-500 h-2 rounded-full" 
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(categoryBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No categories yet</p>
//             )}
//           </div>
//         </div>

//         {/* Status Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Status</h3>
//           <div className="space-y-3">
//             {Object.entries(statusBreakdown).map(([status, count]) => (
//               <div key={status} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{status}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-24 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         status === 'active' ? 'bg-green-500' : 
//                         status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
//                       }`}
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(statusBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No products yet</p>
//             )}
//           </div>
//         </div>

//         {/* Vendor Breakdown */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4">Products by Vendor</h3>
//           <div className="space-y-3">
//             {Object.entries(vendorBreakdown).map(([vendor, count]) => (
//               <div key={vendor} className="flex items-center justify-between">
//                 <span className="text-gray-700 capitalize">{vendor}</span>
//                 <div className="flex items-center gap-3">
//                   <div className="w-24 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-purple-500 h-2 rounded-full" 
//                       style={{ width: `${(count / products.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
//                 </div>
//               </div>
//             ))}
//             {Object.keys(vendorBreakdown).length === 0 && (
//               <p className="text-gray-500 text-center py-4">No vendors yet</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recent Products */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-bold mb-4">Recent Products</h3>
//         <div className="space-y-2">
//           {products.slice(0, 5).map(product => (
//             <div key={getProductId(product)} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
//                   {product.images && product.images.length > 0 ? (
//                     <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
//                   ) : (
//                     <Package size={20} className="text-gray-400" />
//                   )}
//                 </div>
//                 <div>
//                   <p className="font-semibold">{product.title || 'Untitled Product'}</p>
//                   <p className="text-sm text-gray-500">SKU: {product.sku} | Vendor: {product.vendorId || 'default'}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-green-600">${product.price || '0.00'}</p>
//                 <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
//                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                   product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {product.fulfillment || 'FBM'}
//                 </span>
//               </div>
//             </div>
//           ))}
//           {products.length === 0 && (
//             <div className="text-center py-12">
//               <Package size={64} className="mx-auto text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg mb-2">No products yet</p>
//               <p className="text-gray-400 text-sm">Create your first product to get started!</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Alerts Section */}
//       {(stats.outOfStock > 0 || stats.lowStock > 0) && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <AlertTriangle className="text-orange-500" />
//             Inventory Alerts
//           </h3>
//           <div className="space-y-3">
//             {stats.outOfStock > 0 && (
//               <div className="bg-red-50 border border-red-200 rounded p-4">
//                 <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
//                 <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
//               </div>
//             )}
//             {stats.lowStock > 0 && (
//               <div className="bg-orange-50 border border-orange-200 rounded p-4">
//                 <p className="font-semibold text-orange-800">{stats.lowStock} product(s) running low (less than 10 units)</p>
//                 <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Product List Component - UPDATED to handle all products
// function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
//   // Helper function to get product ID (handles both MongoDB _id and local id)
//   const getProductId = (product) => {
//     return product._id || product.id;
//   };

//   const filteredProducts = products.filter(p => {
//     const matchesSearch = !filters.search || 
//       (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
//       (p.sku && p.sku.toLowerCase().includes(filters.search.toLowerCase())) ||
//       (p.productId && p.productId.toLowerCase().includes(filters.search.toLowerCase())) ||
//       (p.vendorId && p.vendorId.toLowerCase().includes(filters.search.toLowerCase()));
    
//     const matchesStatus = filters.status === 'all' || p.status === filters.status;
//     const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
//     return matchesSearch && matchesStatus && matchesFulfillment;
//   });

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedProducts(filteredProducts.map(p => getProductId(p)));
//     } else {
//       setSelectedProducts([]);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
//       try {
//         await API.bulkDelete(selectedProducts);
//         setSelectedProducts([]);
//         onRefresh();
//       } catch (error) {
//         alert('Error deleting products: ' + error.message);
//       }
//     }
//   };

//   // Inline action handlers
//   const handleDeleteProduct = async (id) => {
//     if (window.confirm('Delete this product?')) {
//       try {
//         await API.deleteProduct(id);
//         onRefresh();
//       } catch (error) {
//         alert('Error deleting product: ' + error.message);
//       }
//     }
//   };

//   const handleEditProduct = (product) => {
//     // In a full application, this would open a modal/edit view
//     alert(`Editing product: ${product.title} (ID: ${getProductId(product)})`);
//     // For a real application, you would pass the product and switch view: setView('edit', product)
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">All Products ({products.length})</h2>
//         <div className="flex gap-2">
//           <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by Name, SKU, Product ID, Vendor..."
//               value={filters.search}
//               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//               className="w-full pl-10 pr-4 py-2 border rounded"
//             />
//           </div>
          
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="outofstock">Out of Stock</option>
//           </select>
          
//           <select
//             value={filters.fulfillment}
//             onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="all">All Fulfillment</option>
//             <option value="FBA">FBA</option>
//             <option value="FBM">FBM</option>
//           </select>
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedProducts.length > 0 && (
//         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
//           <span className="font-semibold">{selectedProducts.length} products selected</span>
//           <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
//             Delete Selected
//           </button>
//         </div>
//       )}

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-4 text-left">
//                 <input
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
//                 />
//               </th>
//               <th className="p-4 text-left">Product</th>
//               <th className="p-4 text-left">SKU</th>
//               <th className="p-4 text-left">Vendor</th>
//               <th className="p-4 text-left">Status</th>
//               <th className="p-4 text-left">Price</th>
//               <th className="p-4 text-left">Quantity</th>
//               <th className="p-4 text-left">Fulfillment</th>
//               <th className="p-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map(product => (
//               <tr key={getProductId(product)} className="border-b hover:bg-gray-50">
//                 <td className="p-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedProducts.includes(getProductId(product))}
//                     onChange={(e) => {
//                       const productId = getProductId(product);
//                       if (e.target.checked) {
//                         setSelectedProducts([...selectedProducts, productId]);
//                       } else {
//                         setSelectedProducts(selectedProducts.filter(id => id !== productId));
//                       }
//                     }}
//                   />
//                 </td>
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
//                       {product.images && product.images.length > 0 ? (
//                         <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
//                       ) : (
//                         <Package size={20} className="text-gray-400" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-semibold">{product.title || 'Untitled Product'}</p>
//                       <p className="text-sm text-gray-500">{product.brand}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-4 font-mono text-sm">{product.sku}</td>
//                 <td className="p-4">
//                   <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
//                     {product.vendorId || 'default'}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.status === 'active' ? 'bg-green-100 text-green-800' :
//                     product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {(product.status || 'inactive')?.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="p-4 font-semibold">${product.price || '0.00'}</td>
//                 <td className="p-4">
//                   <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
//                     {product.quantity || 0}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {product.fulfillment || 'FBM'}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => handleEditProduct(product)}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteProduct(getProductId(product))}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {filteredProducts.length === 0 && (
//           <div className="p-12 text-center text-gray-500">
//             <Filter size={48} className="mx-auto text-gray-300 mb-4" />
//             <p className="text-lg font-semibold">No products match your filters.</p>
//             <p className="text-sm">Try adjusting your search or filter selections.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { Search, Plus, Upload, Download, Filter, Package, AlertTriangle, TrendingUp, Edit, Trash2, BarChart3, User } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Enhanced API Service with proper payload handling
const API = {
  STORAGE_KEY: "products-data",
  VENDOR_KEY: "current-vendor",

  // Helper method to handle API requests
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Making API request to: ${url}`, options);
      
      // const response = await fetch(url, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...options.headers,
      //   },
      //   ...options,
      // });

      const response = await fetch(url, {
  method: options.method || 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  },
  body: options.body,
});


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log(`API response from ${url}:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  getFromStorage: async () => {
    try {
      const data = localStorage.getItem(API.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Storage read error:", e);
      return [];
    }
  },

  saveToStorage: async (products) => {
    try {
      localStorage.setItem(API.STORAGE_KEY, JSON.stringify(products));
      return products;
    } catch (e) {
      console.error("Storage write error:", e);
      throw e;
    }
  },

  getCurrentVendor: async () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const vendor = localStorage.getItem(API.VENDOR_KEY);
        return vendor || "default";
      }
      return "default";
    } catch {
      return "default";
    }
  },

  setCurrentVendor: async (vendorId) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(API.VENDOR_KEY, vendorId);
      }
    } catch (e) {
      console.error("Vendor save error:", e);
    }
  },

  // Get all products
  getProducts: async () => {
    try {
      console.log(`Fetching all products...`);
      
      const data = await API.makeRequest(`/products`);
      
      if (data.success && data.products) {
        console.log(`Received ${data.products.length} products from API`);
        return data.products;
      } else if (Array.isArray(data)) {
        console.log(`Received ${data.length} products from API (array format)`);
        return data;
      } else {
        console.log('Unexpected API response format:', data);
        return [];
      }
    } catch (error) {
      console.log("Using local storage due to API error:", error);
      const localProducts = await API.getFromStorage();
      console.log(`Loaded ${localProducts.length} products from local storage`);
      return localProducts;
    }
  },

  // Create new product
  createProduct: async (product) => {
    const vendorId = "default";

    const productData = {
      ...product,
      vendorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    delete productData.id;

    try {
      console.log('Creating product via API:', productData);
      const data = await API.makeRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      if (data.success && data.product) {
        console.log('Product created successfully via API');
        return data.product;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.log("Saving locally due to API error:", error);
      const localProduct = {
        ...productData,
        id: Date.now().toString(),
      };
      const products = await API.getFromStorage();
      products.push(localProduct);
      await API.saveToStorage(products);
      console.log('Product saved locally');
      return localProduct;
    }
  },

  // Update product
  updateProduct: async (id, updates) => {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      console.log(`Updating product ${id} via API:`, updateData);
      const data = await API.makeRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      if (data.success && data.product) {
        console.log('Product updated successfully via API');
        return data.product;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.log("Updating locally due to API error:", error);
      const products = await API.getFromStorage();
      const index = products.findIndex((p) => p.id === id);

      if (index !== -1) {
        products[index] = {
          ...products[index],
          ...updateData,
        };
        await API.saveToStorage(products);
        console.log('Product updated locally');
        return products[index];
      }

      throw new Error("Product not found");
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      console.log(`Deleting product ${id} via API`);
      const data = await API.makeRequest(`/products/${id}`, {
        method: 'DELETE',
      });
      
      if (data.success) {
        console.log('Product deleted successfully via API');
        return true;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.log("Deleting locally due to API error:", error);
      const products = await API.getFromStorage();
      const filtered = products.filter((p) => p.id !== id);
      await API.saveToStorage(filtered);
      console.log('Product deleted locally');
      return true;
    }
  },

  // Bulk delete products
  bulkDelete: async (productIds) => {
    try {
      console.log(`Bulk deleting products via API:`, productIds);
      const data = await API.makeRequest('/products/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ productIds }),
      });
      
      if (data.success) {
        console.log(`Bulk delete successful via API, deleted ${data.deletedCount} products`);
        return true;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.log("Bulk deleting locally due to API error:", error);
      const products = await API.getFromStorage();
      const filtered = products.filter((p) => !productIds.includes(p.id));
      await API.saveToStorage(filtered);
      console.log('Products deleted locally');
      return true;
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      console.log(`Fetching stats for all products...`);
      
      const data = await API.makeRequest(`/products/stats`);
      
      if (data.success && data.stats) {
        console.log('Received stats from API:', data.stats);
        return data.stats;
      } else {
        throw new Error('Invalid API response format for stats');
      }
    } catch (error) {
      console.log("Using local storage for stats due to API error:", error);
      const products = await API.getFromStorage();
      
      const stats = {
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        outOfStock: products.filter(p => p.quantity === 0 || p.quantity < 1).length,
        lowStock: products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length,
        fbaCount: products.filter(p => p.fulfillment === 'FBA').length,
        fbmCount: products.filter(p => p.fulfillment === 'FBM').length,
        totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0),
        avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0,
      };
      
      console.log('Calculated stats locally:', stats);
      return stats;
    }
  },

  // Get all vendors from products
  getVendors: async () => {
    try {
      const products = await API.getProducts();
      const vendors = [...new Set(products.map(p => p.vendorId).filter(Boolean))];
      return vendors;
    } catch (error) {
      console.error('Error getting vendors:', error);
      return [];
    }
  }
};
   
// StatCard Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{String(value)}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Create Product Component
function CreateProduct({ onSuccess }) {
  const initialProductState = {
    title: '',
    sku: '',
    brand: '',
    price: 0.00,
    quantity: 0,
    category: '',
    status: 'active',
    fulfillment: 'FBM',
    description: '',
    productId: '',
    images: [],
  };
  const [product, setProduct] = useState(initialProductState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({
        ...prev,
        images: [{ 
          url: URL.createObjectURL(file), 
          preview: URL.createObjectURL(file), 
          alt: file.name 
        }],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!product.title || !product.sku || product.price <= 0) {
      setError("Title, SKU, and Price are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      await API.createProduct(product);
      setProduct(initialProductState);
      onSuccess();
      alert('Product created successfully!');
    } catch (err) {
      setError(`Failed to create product: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Create New Product</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-gray-700">Product Title*</span>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Brand</span>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">SKU*</span>
            <input
              type="text"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Amazon Product ID (ASIN/ISBN/etc)</span>
            <input
              type="text"
              name="productId"
              value={product.productId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Price ($)*</span>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Quantity</span>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              min="0"
              step="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Category</span>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="e.g., Electronics, HomeGoods"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Fulfillment</span>
            <select
              name="fulfillment"
              value={product.fulfillment}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="FBM">FBM (Fulfilled by Merchant)</option>
              <option value="FBA">FBA (Fulfilled by Amazon)</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-gray-700">Status</span>
            <select
              name="status"
              value={product.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Description</span>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </label>
        </div>

        <div className="border p-4 rounded-md">
          <h4 className="text-lg font-semibold mb-2">Product Images (Placeholder)</h4>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          {product.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.images?.map((img, index) => (
                <div key={index} className="w-16 h-16 relative border rounded overflow-hidden">
                  <img src={img.preview} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Creating...' : (
            <>
              <Plus size={20} />
              Create Product
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// Reports Component
function Reports({ products }) {
  const getInventoryReport = () => {
    return products.map(p => ({
      'Product Title': p.title || '',
      SKU: p.sku || '',
      Price: `$${(parseFloat(p.price) || 0).toFixed(2)}`,
      Quantity: p.quantity || 0,
      'Total Value': `$${((parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0)).toFixed(2)}`,
      Status: p.status || '',
      Fulfillment: p.fulfillment || '',
      Vendor: p.vendorId || 'default',
    }));
  };

  const downloadCSV = (data, filename) => {
    if (data.length === 0) return;
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(obj => Object.values(obj).join(',') + '\n');
    const csv = header + rows.join('');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const inventoryReport = getInventoryReport();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Product Reports & Analytics</h2>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="text-blue-500" />
          Inventory Data Export
        </h3>
        <p className="text-gray-600">Generate and download a CSV file containing all product inventory details.</p>
        <button
          onClick={() => downloadCSV(inventoryReport, 'product_inventory_report.csv')}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
        >
          <Download size={20} />
          Download Full Inventory CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="text-red-500" />
          Low Stock Report (Quantity &lt; 10)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products
                .filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10)
                .map((product) => (
                  <tr key={product._id || product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{product.quantity || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.vendorId || 'default'}</td>
                  </tr>
                ))}
              {products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">No low stock items currently.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ stats, products }) {
  const categoryBreakdown = products.reduce((acc, p) => {
    const category = p.category || 'uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const statusBreakdown = products.reduce((acc, p) => {
    const status = p.status || 'inactive';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const vendorBreakdown = products.reduce((acc, p) => {
    const vendor = p.vendorId || 'default';
    acc[vendor] = (acc[vendor] || 0) + 1;
    return acc;
  }, {});

  const getProductId = (product) => {
    return product._id || product.id;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard - All Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.total} icon={<Package />} color="bg-blue-500" />
        <StatCard title="Active Products" value={stats.active} icon={<TrendingUp />} color="bg-green-500" />
        <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="bg-red-500" />
        <StatCard title="Low Stock Alert" value={stats.lowStock} icon={<AlertTriangle />} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Inventory Value</p>
          <p className="text-2xl font-bold text-green-600 mt-1">${(stats.totalValue || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Average Price</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">${(stats.avgPrice || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">FBA Products</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.fbaCount || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">FBM Products</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.fbmCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Products by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{category || 'Uncategorized'}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / products.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(categoryBreakdown).length === 0 && (
              <p className="text-gray-500 text-center py-4">No categories yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Products by Status</h3>
          <div className="space-y-3">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{status}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'active' ? 'bg-green-500' : 
                        status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${(count / products.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(statusBreakdown).length === 0 && (
              <p className="text-gray-500 text-center py-4">No products yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Products by Vendor</h3>
          <div className="space-y-3">
            {Object.entries(vendorBreakdown).map(([vendor, count]) => (
              <div key={vendor} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{vendor}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(count / products.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(vendorBreakdown).length === 0 && (
              <p className="text-gray-500 text-center py-4">No vendors yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Recent Products</h3>
        <div className="space-y-2">
          {products.slice(0, 5).map(product => (
            <div key={getProductId(product)} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
                  ) : (
                    <Package size={20} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{product.title || 'Untitled Product'}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku || 'N/A'} | Vendor: {product.vendorId || 'default'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">${(parseFloat(product.price) || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-500">Stock: {product.quantity || 0}</p>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.fulfillment || 'FBM'}
                </span>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No products yet</p>
              <p className="text-gray-400 text-sm">Create your first product to get started!</p>
            </div>
          )}
        </div>
      </div>

      {(stats.outOfStock > 0 || stats.lowStock > 0) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            Inventory Alerts
          </h3>
          <div className="space-y-3">
            {stats.outOfStock > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="font-semibold text-red-800">{stats.outOfStock} product(s) out of stock</p>
                <p className="text-sm text-red-600 mt-1">Review and restock these items immediately</p>
              </div>
            )}
            {stats.lowStock > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded p-4">
                <p className="font-semibold text-orange-800">{stats.lowStock} product(s) running low (less than 10 units)</p>
                <p className="text-sm text-orange-600 mt-1">Consider restocking these items soon</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Product List Component
function ProductList({ products, filters, setFilters, selectedProducts, setSelectedProducts, onRefresh }) {
  const getProductId = (product) => {
    return product._id || product.id;
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !filters.search || 
      (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(filters.search.toLowerCase())) ||
      (p.productId && p.productId.toLowerCase().includes(filters.search.toLowerCase())) ||
      (p.vendorId && p.vendorId.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || p.status === filters.status;
    const matchesFulfillment = filters.fulfillment === 'all' || p.fulfillment === filters.fulfillment;
    
    return matchesSearch && matchesStatus && matchesFulfillment;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => getProductId(p)));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
      try {
        await API.bulkDelete(selectedProducts);
        setSelectedProducts([]);
        onRefresh();
      } catch (error) {
        alert('Error deleting products: ' + error.message);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await API.deleteProduct(id);
        onRefresh();
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const handleEditProduct = (product) => {
    alert(`Editing product: ${product.title} (ID: ${getProductId(product)})`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">All Products ({products.length})</h2>
        <div className="flex gap-2">
          <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Name, SKU, Product ID, Vendor..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="outofstock">Out of Stock</option>
          </select>
          
          <select
            value={filters.fulfillment}
            onChange={(e) => setFilters({ ...filters, fulfillment: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="all">All Fulfillment</option>
            <option value="FBA">FBA</option>
            <option value="FBM">FBM</option>
          </select>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
          <span className="font-semibold">{selectedProducts.length} products selected</span>
          <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete Selected
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                />
              </th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Vendor</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Fulfillment</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={getProductId(product)} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(getProductId(product))}
                    onChange={(e) => {
                      const productId = getProductId(product);
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, productId]);
                      } else {
                        setSelectedProducts(selectedProducts.filter(id => id !== productId));
                      }
                    }}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].preview} alt={product.title} className="w-12 h-12 object-cover" />
                      ) : (
                        <Package size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{product.title || 'Untitled Product'}</p>
                      <p className="text-sm text-gray-500">{product.brand || ''}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-sm">{product.sku || ''}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                    {product.vendorId || 'default'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' :
                    product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(product.status || 'inactive').toUpperCase()}
                  </span>
                </td>
                <td className="p-4 font-semibold">${(parseFloat(product.price) || 0).toFixed(2)}</td>
                <td className="p-4">
                  <span className={(product.quantity || 0) < 10 ? 'text-red-600 font-semibold' : ''}>
                    {product.quantity || 0}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    product.fulfillment === 'FBA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.fulfillment || 'FBM'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(getProductId(product))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Filter size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-semibold">No products match your filters.</p>
            <p className="text-sm">Try adjusting your search or filter selections.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
export default function AmazonProductManager() {
  const [view, setView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    fulfillment: 'all'
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    lowStock: 0,
    fbaCount: 0,
    fbmCount: 0,
    totalValue: 0,
    avgPrice: 0
  });

  useEffect(() => {
    loadProducts();
    loadStats();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      console.log('Loading products...');
      const data = await API.getProducts();
      console.log('Products loaded:', data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('Loading stats...');
      const data = await API.getProductStats();
      console.log('Stats loaded:', data);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        total: 0,
        active: 0,
        outOfStock: 0,
        lowStock: 0,
        fbaCount: 0,
        fbmCount: 0,
        totalValue: 0,
        avgPrice: 0
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Amazon Product Manager</h1>
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
              <User size={18} />
              <span className="text-sm">All Products</span>
            </div>
          </div>
          <nav className="flex gap-4">
            <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
              Dashboard
            </button>
            <button onClick={() => setView('products')} className={`px-4 py-2 rounded ${view === 'products' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
              Products
            </button>
            <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
              Create Product
            </button>
            <button onClick={() => setView('reports')} className={`px-4 py-2 rounded ${view === 'reports' ? 'bg-orange-500' : 'hover:bg-gray-800'}`}>
              Reports
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : (
          <>
            {view === 'dashboard' && <Dashboard stats={stats} products={products} />}
            {view === 'products' && (
              <ProductList
                products={products}
                filters={filters}
                setFilters={setFilters}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                onRefresh={loadProducts}
                setView={setView}
              />
            )}
            {view === 'create' && <CreateProduct onSuccess={() => { loadProducts(); loadStats(); setView('products'); }} />}
            {view === 'reports' && <Reports products={products} />}
          </>
        )}
      </main>

      <button
        onClick={() => setView('create')}
        className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}