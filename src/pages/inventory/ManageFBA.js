// import React, { useState, useEffect } from 'react';
// import {
//   Search,
//   Filter,
//   Edit,
//   Trash2,
//   Package,
//   AlertTriangle,
//   CheckCircle,
//   TrendingUp,
//   DollarSign,
//   Box,
//   Truck,
//   AlertCircle
// } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8000/api';
// const PAGE_SIZE = 10;

// const FBAInventory = ({ refreshTrigger }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [filterFulfillment, setFilterFulfillment] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [editProduct, setEditProduct] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, [refreshTrigger]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(`${API_BASE_URL}/products`);
//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//       const data = await response.json();
//       const productArray = Array.isArray(data) ? data : data?.products || data?.data || [];
//       setProducts(productArray);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       setError('Failed to fetch products. Please check backend connection.');
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this FBA listing?')) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
//       fetchProducts();
//     } catch (err) {
//       console.error('Error deleting product:', err);
//       alert('Failed to delete product.');
//     }
//   };

//   const getInventoryHealthIcon = (inboundQty, availableQty, reservedQty) => {
//     const total = (inboundQty || 0) + (availableQty || 0);
//     if (total === 0) return <AlertCircle className="h-4 w-4 text-red-500" />;
//     if (availableQty < 10) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
//     return <CheckCircle className="h-4 w-4 text-green-500" />;
//   };

//   const getFulfillmentBadge = (type) => {
//     if (type === 'FBA') return 'bg-blue-100 text-blue-800';
//     if (type === 'FBM') return 'bg-purple-100 text-purple-800';
//     return 'bg-gray-100 text-gray-800';
//   };

//   const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

//   const filteredProducts = products.filter(p => {
//     const matchesSearch =
//       p?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p?.asin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p?.fnsku?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = filterStatus === 'all' || p?.status === filterStatus;
//     const matchesCategory = filterCategory === 'all' || p?.category === filterCategory;
//     const matchesFulfillment = filterFulfillment === 'all' || p?.fulfillmentChannel === filterFulfillment;

//     return matchesSearch && matchesStatus && matchesCategory && matchesFulfillment;
//   });

//   const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
//   const currentProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

//   if (loading) return <div className="p-6">Loading FBA inventory...</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Amazon FBA Inventory</h1>
//         <p className="text-gray-600 mt-1">Manage your FBA listings, stock levels, and fulfillment</p>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by ASIN, SKU, FNSKU, Title..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
          
//           <select
//             value={filterStatus}
//             onChange={e => setFilterStatus(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="stranded">Stranded</option>
//           </select>

//           <select
//             value={filterFulfillment}
//             onChange={e => setFilterFulfillment(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="all">All Fulfillment</option>
//             <option value="FBA">FBA (Amazon)</option>
//             <option value="FBM">FBM (Merchant)</option>
//           </select>

//           <select
//             value={filterCategory}
//             onChange={e => setFilterCategory(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="all">All Categories</option>
//             {categories.map(c => (
//               <option key={c} value={c}>{c}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       {currentProducts.length === 0 ? (
//         <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//           <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//           <p className="text-gray-500">Try adjusting your filters or add new FBA listings</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASIN / SKU</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FNSKU</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FBA Inventory</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fulfillment</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {currentProducts.map(p => (
//                   <tr key={p.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         {p.mainImage && (
//                           <img
//                             src={p.mainImage}
//                             alt={p.title || ''}
//                             className="h-12 w-12 object-cover rounded-lg mr-3 cursor-pointer border border-gray-200"
//                             onClick={() => setPreviewImage(p.mainImage)}
//                           />
//                         )}
//                         <div className="max-w-xs">
//                           <div className="text-sm font-medium text-gray-900 truncate">{p.title || '-'}</div>
//                           <div className="text-xs text-gray-500">{p.category || '-'}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-mono text-gray-900">{p.asin || '-'}</div>
//                       <div className="text-xs text-gray-500 font-mono">{p.sku || '-'}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-mono text-gray-700">{p.fnsku || '-'}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-semibold text-gray-900">${parseFloat(p.price || 0).toFixed(2)}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="space-y-1">
//                         <div className="flex items-center text-xs">
//                           <Box className="h-3 w-3 mr-1 text-green-600" />
//                           <span className="text-gray-600">Available:</span>
//                           <span className="ml-1 font-semibold text-gray-900">{p.availableQuantity || 0}</span>
//                         </div>
//                         <div className="flex items-center text-xs">
//                           <Truck className="h-3 w-3 mr-1 text-blue-600" />
//                           <span className="text-gray-600">Inbound:</span>
//                           <span className="ml-1 font-semibold text-gray-900">{p.inboundQuantity || 0}</span>
//                         </div>
//                         <div className="flex items-center text-xs">
//                           <Package className="h-3 w-3 mr-1 text-orange-600" />
//                           <span className="text-gray-600">Reserved:</span>
//                           <span className="ml-1 font-semibold text-gray-900">{p.reservedQuantity || 0}</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFulfillmentBadge(p.fulfillmentChannel)}`}>
//                         {p.fulfillmentChannel || 'FBA'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         {getInventoryHealthIcon(p.inboundQuantity, p.availableQuantity, p.reservedQuantity)}
//                         <span className="ml-2 text-xs text-gray-700 capitalize">{(p.status || 'active').replace('_', ' ')}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => setEditProduct(p)} 
//                           className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                           title="Edit Product"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button 
//                           onClick={() => deleteProduct(p.id)} 
//                           className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
//                           title="Delete Product"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6 space-x-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(prev => prev - 1)}
//             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Previous
//           </button>
//           <span className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-medium">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Image Preview Modal */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//           onClick={() => setPreviewImage(null)}
//         >
//           <div className="relative">
//             <img src={previewImage} alt="Preview" className="max-h-[85vh] max-w-[85vw] rounded-lg shadow-2xl" />
//             <button
//               onClick={() => setPreviewImage(null)}
//               className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Edit Product Modal */}
//       {editProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
//           <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit FBA Product</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Title */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
//                 <input
//                   type="text"
//                   value={editProduct.title || ''}
//                   onChange={e => setEditProduct({ ...editProduct, title: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* ASIN */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ASIN</label>
//                 <input
//                   type="text"
//                   value={editProduct.asin || ''}
//                   onChange={e => setEditProduct({ ...editProduct, asin: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="B08XXXXXXX"
//                 />
//               </div>

//               {/* SKU */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Seller SKU</label>
//                 <input
//                   type="text"
//                   value={editProduct.sku || ''}
//                   onChange={e => setEditProduct({ ...editProduct, sku: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* FNSKU */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">FNSKU</label>
//                 <input
//                   type="text"
//                   value={editProduct.fnsku || ''}
//                   onChange={e => setEditProduct({ ...editProduct, fnsku: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="X00XXXXXXX"
//                 />
//               </div>

//               {/* Price */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={editProduct.price || ''}
//                   onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* Available Quantity */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity</label>
//                 <input
//                   type="number"
//                   value={editProduct.availableQuantity || 0}
//                   onChange={e => setEditProduct({ ...editProduct, availableQuantity: parseInt(e.target.value) || 0 })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* Inbound Quantity */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Inbound Quantity</label>
//                 <input
//                   type="number"
//                   value={editProduct.inboundQuantity || 0}
//                   onChange={e => setEditProduct({ ...editProduct, inboundQuantity: parseInt(e.target.value) || 0 })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* Reserved Quantity */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Reserved Quantity</label>
//                 <input
//                   type="number"
//                   value={editProduct.reservedQuantity || 0}
//                   onChange={e => setEditProduct({ ...editProduct, reservedQuantity: parseInt(e.target.value) || 0 })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <input
//                   type="text"
//                   value={editProduct.category || ''}
//                   onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* Fulfillment Channel */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Fulfillment Channel</label>
//                 <select
//                   value={editProduct.fulfillmentChannel || 'FBA'}
//                   onChange={e => setEditProduct({ ...editProduct, fulfillmentChannel: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="FBA">FBA (Fulfilled by Amazon)</option>
//                   <option value="FBM">FBM (Fulfilled by Merchant)</option>
//                 </select>
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   value={editProduct.status || 'active'}
//                   onChange={e => setEditProduct({ ...editProduct, status: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="stranded">Stranded</option>
//                 </select>
//               </div>

//               {/* Main Image */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
//                 {editProduct.mainImage && (
//                   <img
//                     src={editProduct.mainImage}
//                     alt="preview"
//                     className="h-24 w-24 object-cover rounded-lg mb-2 border border-gray-200"
//                   />
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={e => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       const previewURL = URL.createObjectURL(file);
//                       setEditProduct({
//                         ...editProduct,
//                         mainImageFile: file,
//                         mainImage: previewURL
//                       });
//                     }
//                   }}
//                   className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex space-x-3 mt-6">
//               <button
//                 onClick={async () => {
//                   const formData = new FormData();
//                   formData.append("title", editProduct.title || '');
//                   formData.append("asin", editProduct.asin || '');
//                   formData.append("sku", editProduct.sku || '');
//                   formData.append("fnsku", editProduct.fnsku || '');
//                   formData.append("price", editProduct.price || 0);
//                   formData.append("availableQuantity", editProduct.availableQuantity || 0);
//                   formData.append("inboundQuantity", editProduct.inboundQuantity || 0);
//                   formData.append("reservedQuantity", editProduct.reservedQuantity || 0);
//                   formData.append("category", editProduct.category || '');
//                   formData.append("fulfillmentChannel", editProduct.fulfillmentChannel || 'FBA');
//                   formData.append("status", editProduct.status || 'active');

//                   if (editProduct.mainImageFile) {
//                     formData.append("mainImage", editProduct.mainImageFile);
//                   }

//                   try {
//                     const res = await fetch(`${API_BASE_URL}/products/${editProduct.id}`, {
//                       method: "PUT",
//                       body: formData
//                     });

//                     if (!res.ok) throw new Error("Update failed");

//                     alert("FBA product updated successfully!");
//                     setEditProduct(null);
//                     fetchProducts();
//                   } catch (error) {
//                     console.error("Error updating:", error);
//                     alert("Failed to update product");
//                   }
//                 }}
//                 className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//               >
//                 Save Changes
//               </button>
//               <button
//                 onClick={() => setEditProduct(null)}
//                 className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FBAInventory;


import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Box,
  Truck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  Download,
  RefreshCw,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Hash,
  Tag,
  Info,
  Upload,
  Plus,
  Layers,
  Battery,
  ExternalLink,
  Eye
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const FBAInventory = ({ refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFulfillment, setFilterFulfillment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [previewImage, setPreviewImage] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [stats, setStats] = useState({
    total: 0,
    fba: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  useEffect(() => {
    calculateStats();
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const productArray = Array.isArray(data) ? data : data?.products || data?.data || [];
      
      const normalizedProducts = productArray.map(p => ({
        id: p.id || p._id,
        title: p.title || 'Untitled Product',
        asin: p.asin || 'N/A',
        sku: p.sku || 'N/A',
        fnsku: p.fnsku || 'N/A',
        brand: p.brand || 'Unknown',
        category: p.category || 'Uncategorized',
        price: parseFloat(p.price || 0),
        availableQuantity: parseInt(p.availableQuantity || 0),
        inboundQuantity: parseInt(p.inboundQuantity || 0),
        reservedQuantity: parseInt(p.reservedQuantity || 0),
        status: p.status || 'active',
        fulfillmentChannel: p.fulfillmentChannel || 'FBA',
        mainImage: p.mainImage || p.image || '/images/default-product.jpg',
        description: p.description || '',
        createdAt: p.createdAt || new Date().toISOString()
      }));
      
      setProducts(normalizedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please check your connection.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = products.length;
    const fba = products.filter(p => p.fulfillmentChannel === 'FBA').length;
    const lowStock = products.filter(p => p.availableQuantity > 0 && p.availableQuantity < 10).length;
    const outOfStock = products.filter(p => p.availableQuantity === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.availableQuantity), 0);

    setStats({
      total,
      fba,
      lowStock,
      outOfStock,
      totalValue: parseFloat(totalValue.toFixed(2))
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FBA listing?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    }
  };

  const getInventoryHealthIcon = (inboundQty, availableQty, reservedQty) => {
    const total = (inboundQty || 0) + (availableQty || 0);
    if (total === 0) return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
    if (availableQty < 10) return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
  };

  const getFulfillmentBadge = (type) => {
    if (type === 'FBA') return 'bg-blue-100 text-blue-800 border border-blue-200';
    if (type === 'FBM') return 'bg-purple-100 text-purple-800 border border-purple-200';
    return 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stranded': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockColor = (quantity) => {
    if (quantity === 0) return 'bg-red-100 text-red-800';
    if (quantity < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p?.asin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p?.fnsku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || p?.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || p?.category === filterCategory;
    const matchesFulfillment = filterFulfillment === 'all' || p?.fulfillmentChannel === filterFulfillment;

    return matchesSearch && matchesStatus && matchesCategory && matchesFulfillment;
  }).sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'price' || sortConfig.key.includes('Quantity')) {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const currentProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleEditSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editProduct.title || '');
      formData.append("asin", editProduct.asin || '');
      formData.append("sku", editProduct.sku || '');
      formData.append("fnsku", editProduct.fnsku || '');
      formData.append("price", editProduct.price || 0);
      formData.append("availableQuantity", editProduct.availableQuantity || 0);
      formData.append("inboundQuantity", editProduct.inboundQuantity || 0);
      formData.append("reservedQuantity", editProduct.reservedQuantity || 0);
      formData.append("category", editProduct.category || '');
      formData.append("fulfillmentChannel", editProduct.fulfillmentChannel || 'FBA');
      formData.append("status", editProduct.status || 'active');
      formData.append("description", editProduct.description || '');

      if (editProduct.mainImageFile) {
        formData.append("mainImage", editProduct.mainImageFile);
      }

      const res = await fetch(`${API_BASE_URL}/products/${editProduct.id}`, {
        method: "PUT",
        body: formData
      });

      if (!res.ok) throw new Error("Update failed");

      alert("FBA product updated successfully!");
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update product");
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ASIN', 'SKU', 'FNSKU', 'Title', 'Price', 'Available', 'Inbound', 'Reserved', 'Status', 'Fulfillment'],
      ...filteredProducts.map(p => [
        `"${p.asin}"`,
        `"${p.sku}"`,
        `"${p.fnsku}"`,
        `"${p.title}"`,
        p.price,
        p.availableQuantity,
        p.inboundQuantity,
        p.reservedQuantity,
        p.status,
        p.fulfillmentChannel
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fba_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="animate-pulse mb-6">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full sm:w-2/3"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        
        <div className="animate-pulse mb-6">
          <div className="h-12 sm:h-14 bg-gray-200 rounded-lg"></div>
        </div>
        
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 sm:h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading FBA Inventory</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Amazon FBA Inventory
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Manage your FBA listings, stock levels, and fulfillment
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            
            <button
              onClick={() => alert('Add FBA product functionality')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add FBA Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Total Products</span>
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">FBA Listings</span>
            <Box className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{stats.fba}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Low Stock</span>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600">{stats.lowStock}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Out of Stock</span>
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">{stats.outOfStock}</div>
        </div>
        
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Inventory Value</span>
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">${stats.totalValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by ASIN, SKU, FNSKU, Title..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="stranded">Stranded</option>
              </select>
            </div>

            <select
              value={filterFulfillment}
              onChange={e => setFilterFulfillment(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Fulfillment</option>
              <option value="FBA">FBA (Amazon)</option>
              <option value="FBM">FBM (Merchant)</option>
            </select>

            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex-1 justify-center"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="stranded">Stranded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fulfillment
                </label>
                <select
                  value={filterFulfillment}
                  onChange={e => setFilterFulfillment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  <option value="FBA">FBA</option>
                  <option value="FBM">FBM</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(0, 5).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterCategory('all');
                    setFilterFulfillment('all');
                    setSearchTerm('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count and Page Size */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="text-xs sm:text-sm text-gray-600">
          Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, filteredProducts.length)}
          </span>{' '}
          of <span className="font-medium">{filteredProducts.length}</span> FBA products
        </div>
        <div className="text-sm text-gray-600">
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table/Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ASIN / SKU
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FNSKU
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FBA Inventory
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={p.mainImage}
                          alt={p.title}
                          className="w-10 h-10 object-cover rounded-lg mr-3 cursor-pointer border border-gray-200"
                          onClick={() => setPreviewImage(p.mainImage)}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {p.title}
                          </div>
                          <div className="text-xs text-gray-500">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-mono text-gray-900">{p.asin}</div>
                      <div className="text-xs text-gray-500 font-mono">{p.sku}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <code className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {p.fnsku}
                      </code>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Box className="w-3 h-3 mr-1 text-green-600" />
                          <span className="text-gray-600">Available:</span>
                          <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${getStockColor(p.availableQuantity)}`}>
                            {p.availableQuantity}
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Truck className="w-3 h-3 mr-1 text-blue-600" />
                          <span className="text-gray-600">Inbound:</span>
                          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                            {p.inboundQuantity}
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Package className="w-3 h-3 mr-1 text-orange-600" />
                          <span className="text-gray-600">Reserved:</span>
                          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
                            {p.reservedQuantity}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        {getInventoryHealthIcon(p.inboundQuantity, p.availableQuantity, p.reservedQuantity)}
                        <span className={`ml-2 px-3 py-1 text-xs rounded-full border ${getStatusColor(p.status)}`}>
                          {(p.status || 'active').replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditProduct(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPreviewImage(p.mainImage)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Image"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden divide-y divide-gray-200">
            {currentProducts.map(p => {
              const isSelected = selectedProduct === p.id;
              return (
                <div key={p.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src={p.mainImage}
                        alt={p.title}
                        className="w-12 h-12 object-cover rounded-lg cursor-pointer border border-gray-200"
                        onClick={() => setPreviewImage(p.mainImage)}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                          {p.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                            {p.asin}
                          </code>
                          <span className={`px-2 py-0.5 text-xs rounded-full border ${getFulfillmentBadge(p.fulfillmentChannel)}`}>
                            {p.fulfillmentChannel}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            <span>{p.availableQuantity} avail</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            <span>{p.inboundQuantity} inbound</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>${p.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedProduct(isSelected ? null : p.id)}
                      className="ml-2 p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  {/* Mobile action menu */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditProduct(p)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {currentProducts.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={p.mainImage}
                  alt={p.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setPreviewImage(p.mainImage)}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getFulfillmentBadge(p.fulfillmentChannel)}`}>
                    {p.fulfillmentChannel}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                  {p.title}
                </h3>
                
                <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{p.category}</span>
                    </div>
                    <span className="font-medium">${p.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">ASIN</div>
                      <div className="font-mono text-xs truncate">{p.asin}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">SKU</div>
                      <div className="font-mono text-xs truncate">{p.sku}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">FNSKU</div>
                      <div className="font-mono text-xs truncate">{p.fnsku}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="text-center">
                      <Box className="w-4 h-4 mx-auto text-green-600" />
                      <div className={`mt-1 text-xs rounded-full py-1 ${getStockColor(p.availableQuantity)}`}>
                        {p.availableQuantity}
                      </div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>
                    <div className="text-center">
                      <Truck className="w-4 h-4 mx-auto text-blue-600" />
                      <div className="mt-1 text-xs rounded-full py-1 bg-blue-100 text-blue-800">
                        {p.inboundQuantity}
                      </div>
                      <div className="text-xs text-gray-500">Inbound</div>
                    </div>
                    <div className="text-center">
                      <Package className="w-4 h-4 mx-auto text-orange-600" />
                      <div className="mt-1 text-xs rounded-full py-1 bg-orange-100 text-orange-800">
                        {p.reservedQuantity}
                      </div>
                      <div className="text-xs text-gray-500">Reserved</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button 
                    onClick={() => setEditProduct(p)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-300 mb-4">
            <Package className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' || filterFulfillment !== 'all'
              ? 'No FBA products match your search'
              : 'No FBA products in inventory'
            }
          </h3>
          <p className="text-gray-500 max-w-md mx-auto px-4 text-sm sm:text-base mb-6">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' || filterFulfillment !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first FBA product'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {(searchTerm || filterStatus !== 'all' || filterCategory !== 'all' || filterFulfillment !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterCategory('all');
                  setFilterFulfillment('all');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => alert('Navigate to add FBA product')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Add FBA Product
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage === 1) {
                    pageNum = i + 1;
                  } else if (currentPage === totalPages) {
                    pageNum = totalPages - 2 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center border text-sm font-medium rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Image Preview</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex justify-center items-center h-[70vh]">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit FBA Product</h2>
              <button
                onClick={() => setEditProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={editProduct.title || ''}
                    onChange={e => setEditProduct({ ...editProduct, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ASIN
                  </label>
                  <input
                    type="text"
                    value={editProduct.asin || ''}
                    onChange={e => setEditProduct({ ...editProduct, asin: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="B08XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seller SKU
                  </label>
                  <input
                    type="text"
                    value={editProduct.sku || ''}
                    onChange={e => setEditProduct({ ...editProduct, sku: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FNSKU
                  </label>
                  <input
                    type="text"
                    value={editProduct.fnsku || ''}
                    onChange={e => setEditProduct({ ...editProduct, fnsku: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="X00XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.price || ''}
                    onChange={e => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    value={editProduct.availableQuantity || 0}
                    onChange={e => setEditProduct({ ...editProduct, availableQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inbound Quantity
                  </label>
                  <input
                    type="number"
                    value={editProduct.inboundQuantity || 0}
                    onChange={e => setEditProduct({ ...editProduct, inboundQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reserved Quantity
                  </label>
                  <input
                    type="number"
                    value={editProduct.reservedQuantity || 0}
                    onChange={e => setEditProduct({ ...editProduct, reservedQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editProduct.category || ''}
                    onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fulfillment Channel
                  </label>
                  <select
                    value={editProduct.fulfillmentChannel || 'FBA'}
                    onChange={e => setEditProduct({ ...editProduct, fulfillmentChannel: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="FBA">FBA (Fulfilled by Amazon)</option>
                    <option value="FBM">FBM (Fulfilled by Merchant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editProduct.status || 'active'}
                    onChange={e => setEditProduct({ ...editProduct, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="stranded">Stranded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  {editProduct.mainImage && (
                    <img
                      src={editProduct.mainImage}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const previewURL = URL.createObjectURL(file);
                        setEditProduct({
                          ...editProduct,
                          mainImageFile: file,
                          mainImage: previewURL
                        });
                      }
                    }}
                    className="flex-1 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleEditSave}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditProduct(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FBAInventory;