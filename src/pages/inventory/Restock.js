// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Package,
//   AlertTriangle,
//   Truck,
//   CheckCircle,
//   Clock,
//   TrendingUp,
//   TrendingDown,
//   BarChart3,
//   Download,
//   Filter,
//   Search,
//   ShoppingCart,
//   Warehouse,
//   Users,
//   DollarSign,
//   ArrowUpRight,
//   ArrowDownRight,
//   ChevronRight,
//   Eye,
//   Edit,
//   FileText,
//   Calendar,
//   RefreshCw,
//   Layers,
//   Target,
//   Zap,
//   Shield,
//   PackageCheck,
//   PackageX,
//   PackageSearch
// } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8000/api';

// const GrapesKartRestockDashboard = () => {
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [filters, setFilters] = useState({
//     view: 'all',
//     urgency: 'all',
//     warehouse: 'all',
//     category: 'all'
//   });
//   const [summary, setSummary] = useState(null);
//   const [analytics, setAnalytics] = useState(null);

//   // Fetch restock recommendations
//   useEffect(() => {
//     fetchRecommendations();
//     fetchAnalytics();
//   }, [filters]);

//   const fetchRecommendations = async () => {
//     try {
//       setLoading(true);
//       const queryParams = new URLSearchParams(filters).toString();
//       const response = await fetch(`${API_BASE_URL}/restock/recommendations?${queryParams}`);
//       const data = await response.json();
      
//       if (data.success) {
//         setRecommendations(data.data || []);
//         setSummary(data.summary);
//       }
//     } catch (error) {
//       console.error('Error fetching recommendations:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAnalytics = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/restock/analytics?period=month`);
//       const data = await response.json();
//       if (data.success) {
//         setAnalytics(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//     }
//   };

//   // Handle item selection
//   const handleSelectItem = (item, checked) => {
//     if (checked) {
//       setSelectedItems(prev => [...prev, item]);
//     } else {
//       setSelectedItems(prev => prev.filter(i => i.id !== item.id));
//     }
//   };

//   // Select all items of specific urgency
//   const selectAllUrgency = (urgency) => {
//     const urgencyItems = recommendations.filter(item => item.urgency === urgency);
//     setSelectedItems(prev => {
//       const newItems = urgencyItems.filter(item => 
//         !prev.some(selected => selected.id === item.id)
//       );
//       return [...prev, ...newItems];
//     });
//   };

//   // Create restock plan
//   const handleCreateRestockPlan = async () => {
//     if (selectedItems.length === 0) {
//       alert('Please select items to restock');
//       return;
//     }

//     try {
//       const restockData = {
//         items: selectedItems.map(item => ({
//           inventoryId: item.id,
//           quantity: item.suggestedQuantity
//         })),
//         supplierId: 'default-supplier-id', // In real app, get from form
//         warehouseId: 'default-warehouse-id',
//         estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//         notes: 'Restock plan created from dashboard'
//       };

//       const response = await fetch(`${API_BASE_URL}/restock/plan`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(restockData)
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         alert(`Restock plan created: ${data.data.restockId}`);
//         setSelectedItems([]);
//         fetchRecommendations();
//       }
//     } catch (error) {
//       console.error('Error creating restock plan:', error);
//       alert('Failed to create restock plan');
//     }
//   };

//   // Get urgency color
//   const getUrgencyColor = (urgency) => {
//     switch (urgency) {
//       case 'critical': return 'bg-red-500';
//       case 'high': return 'bg-orange-500';
//       case 'medium': return 'bg-yellow-500';
//       case 'low': return 'bg-green-500';
//       case 'excess': return 'bg-purple-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   // Get urgency text color
//   const getUrgencyTextColor = (urgency) => {
//     switch (urgency) {
//       case 'critical': return 'text-red-700';
//       case 'high': return 'text-orange-700';
//       case 'medium': return 'text-yellow-700';
//       case 'low': return 'text-green-700';
//       case 'excess': return 'text-purple-700';
//       default: return 'text-gray-700';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="h-32 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//           <div className="space-y-2">
//             {[1, 2, 3, 4, 5].map(i => (
//               <div key={i} className="h-16 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Amazon-Style Restock Management</h1>
//             <p className="text-gray-600 mt-1">
//               Intelligent restocking recommendations like Amazon FBA
//             </p>
//           </div>
          
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={fetchRecommendations}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-red-50 rounded-lg">
//                 <AlertTriangle className="h-6 w-6 text-red-600" />
//               </div>
//               <span className="text-sm font-medium text-red-600 flex items-center">
//                 <ArrowUpRight className="h-4 w-4 mr-1" />
//                 {summary?.critical || 0}
//               </span>
//             </div>
//             <div className="text-3xl font-bold text-gray-900">{summary?.critical || 0}</div>
//             <div className="text-sm text-gray-600">Critical Restocks</div>
//             <button 
//               onClick={() => selectAllUrgency('critical')}
//               className="mt-3 text-sm text-blue-600 hover:text-blue-800"
//             >
//               Select all critical
//             </button>
//           </div>

//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-orange-50 rounded-lg">
//                 <Clock className="h-6 w-6 text-orange-600" />
//               </div>
//               <span className="text-sm font-medium text-orange-600 flex items-center">
//                 <ArrowUpRight className="h-4 w-4 mr-1" />
//                 {summary?.high || 0}
//               </span>
//             </div>
//             <div className="text-3xl font-bold text-gray-900">{summary?.high || 0}</div>
//             <div className="text-sm text-gray-600">High Priority</div>
//             <button 
//               onClick={() => selectAllUrgency('high')}
//               className="mt-3 text-sm text-blue-600 hover:text-blue-800"
//             >
//               Select all high
//             </button>
//           </div>

//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-blue-50 rounded-lg">
//                 <Package className="h-6 w-6 text-blue-600" />
//               </div>
//               <span className="text-sm font-medium text-blue-600 flex items-center">
//                 <ArrowUpRight className="h-4 w-4 mr-1" />
//                 {summary?.totalItems || 0}
//               </span>
//             </div>
//             <div className="text-3xl font-bold text-gray-900">{summary?.totalItems || 0}</div>
//             <div className="text-sm text-gray-600">Total Recommendations</div>
//             <div className="mt-3 text-sm text-gray-500">
//               ${summary?.totalEstimatedCost?.toLocaleString() || 0}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-green-50 rounded-lg">
//                 <ShoppingCart className="h-6 w-6 text-green-600" />
//               </div>
//               <span className="text-sm font-medium text-green-600 flex items-center">
//                 <ArrowUpRight className="h-4 w-4 mr-1" />
//                 {selectedItems.length}
//               </span>
//             </div>
//             <div className="text-3xl font-bold text-gray-900">{selectedItems.length}</div>
//             <div className="text-sm text-gray-600">Selected Items</div>
//             <button 
//               onClick={handleCreateRestockPlan}
//               disabled={selectedItems.length === 0}
//               className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 selectedItems.length === 0
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-green-600 text-white hover:bg-green-700'
//               }`}
//             >
//               Create Restock Plan
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
//           <div className="flex flex-wrap gap-4 items-center">
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">View</label>
//               <select
//                 value={filters.view}
//                 onChange={(e) => setFilters({...filters, view: e.target.value})}
//                 className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">All Inventory</option>
//                 <option value="fba">FBA Eligible</option>
//                 <option value="fbm">FBM Only</option>
//                 <option value="slow">Slow Moving</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">Urgency</label>
//               <select
//                 value={filters.urgency}
//                 onChange={(e) => setFilters({...filters, urgency: e.target.value})}
//                 className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">All Urgency</option>
//                 <option value="critical">Critical</option>
//                 <option value="high">High</option>
//                 <option value="medium">Medium</option>
//                 <option value="low">Low</option>
//                 <option value="excess">Excess</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">Warehouse</label>
//               <select
//                 value={filters.warehouse}
//                 onChange={(e) => setFilters({...filters, warehouse: e.target.value})}
//                 className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">All Warehouses</option>
//                 <option value="fba">Amazon FBA</option>
//                 <option value="main">Main Warehouse</option>
//                 <option value="east">East Coast</option>
//                 <option value="west">West Coast</option>
//               </select>
//             </div>

//             <div className="ml-auto flex items-center space-x-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search SKU or product..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   onChange={(e) => {
//                     // Add search functionality
//                   }}
//                 />
//               </div>
              
//               <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                 <Filter className="h-4 w-4 mr-2" />
//                 More Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Restock Recommendations */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">Restock Recommendations</h2>
//                   <p className="text-gray-600 text-sm mt-1">
//                     Amazon-style intelligent restocking suggestions
//                   </p>
//                 </div>
                
//                 <div className="flex items-center space-x-3">
//                   <span className="text-sm text-gray-600">
//                     Selected: {selectedItems.length} items
//                   </span>
//                   <button 
//                     onClick={() => setSelectedItems([])}
//                     className="text-sm text-red-600 hover:text-red-800"
//                   >
//                     Clear All
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Recommendations Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
//                       <input
//                         type="checkbox"
//                         checked={selectedItems.length === recommendations.length}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setSelectedItems(recommendations);
//                           } else {
//                             setSelectedItems([]);
//                           }
//                         }}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Product
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Stock Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Sales Velocity
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Recommended Qty
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Urgency
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {recommendations.map((item) => (
//                     <tr 
//                       key={item.id}
//                       className={`hover:bg-gray-50 transition-colors ${
//                         selectedItems.some(selected => selected.id === item.id) ? 'bg-blue-50' : ''
//                       }`}
//                     >
//                       <td className="px-6 py-4">
//                         <input
//                           type="checkbox"
//                           checked={selectedItems.some(selected => selected.id === item.id)}
//                           onChange={(e) => handleSelectItem(item, e.target.checked)}
//                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         />
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           {item.image && (
//                             <img
//                               src={item.image}
//                               alt={item.productName}
//                               className="h-10 w-10 rounded-lg object-cover border border-gray-200 mr-3"
//                             />
//                           )}
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {item.productName}
//                             </div>
//                             <div className="text-xs text-gray-500 flex items-center">
//                               <span className="mr-2">{item.sku}</span>
//                               <span className={`px-2 py-0.5 rounded text-xs ${
//                                 item.fbaStatus === 'enrolled' 
//                                   ? 'bg-green-100 text-green-800'
//                                   : 'bg-gray-100 text-gray-800'
//                               }`}>
//                                 {item.fbaStatus === 'enrolled' ? 'FBA' : 'FBM'}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <div className="flex items-center">
//                             <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
//                               <div 
//                                 className={`h-full rounded-full ${getUrgencyColor(item.urgency)}`}
//                                 style={{
//                                   width: `${Math.min(100, (item.currentStock / item.maxStockLevel) * 100)}%`
//                                 }}
//                               ></div>
//                             </div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {item.currentStock}
//                             </div>
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Available: {item.availableStock} • Min: {item.reorderPoint} • Max: {item.maxStockLevel}
//                           </div>
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {item.dailySales}/day
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {item.daysOfSupply} days of supply
//                         </div>
//                         {item.sellThroughRate > 0 && (
//                           <div className="text-xs text-green-600 mt-1">
//                             Sell-through: {item.sellThroughRate}%
//                           </div>
//                         )}
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <div className="text-sm font-medium text-gray-900">
//                             {item.suggestedQuantity} units
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             ${item.estimatedCost?.toLocaleString()}
//                           </div>
//                           <div className="text-xs text-blue-600">
//                             → {item.coverageDays} days coverage
//                           </div>
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="space-y-2">
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getUrgencyTextColor(item.urgency)} ${
//                             item.urgency === 'critical' ? 'bg-red-100' :
//                             item.urgency === 'high' ? 'bg-orange-100' :
//                             item.urgency === 'medium' ? 'bg-yellow-100' :
//                             item.urgency === 'low' ? 'bg-green-100' :
//                             'bg-purple-100'
//                           }`}>
//                             {item.urgency === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
//                             {item.urgency === 'high' && <Clock className="h-3 w-3 mr-1" />}
//                             {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
//                           </span>
                          
//                           {item.inboundQuantity > 0 && (
//                             <div className="text-xs text-blue-600">
//                               Inbound: {item.inboundQuantity}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
              
//               {recommendations.length === 0 && (
//                 <div className="text-center py-12">
//                   <PackageCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     No restock recommendations
//                   </h3>
//                   <p className="text-gray-500">
//                     All inventory levels are optimal
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Side Panel */}
//         <div className="space-y-6">
//           {/* Selected Items Summary */}
//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Items Summary</h3>
            
//             {selectedItems.length > 0 ? (
//               <div className="space-y-4">
//                 <div className="space-y-3">
//                   {selectedItems.slice(0, 3).map(item => (
//                     <div key={item.id} className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center mr-2">
//                           <Package className="h-4 w-4 text-gray-600" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
//                             {item.productName}
//                           </div>
//                           <div className="text-xs text-gray-500">{item.sku}</div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {item.suggestedQuantity}
//                       </div>
//                     </div>
//                   ))}
                  
//                   {selectedItems.length > 3 && (
//                     <div className="text-center text-sm text-gray-500">
//                       + {selectedItems.length - 3} more items
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="pt-4 border-t border-gray-200">
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Total Quantity</span>
//                       <span className="font-medium text-gray-900">
//                         {selectedItems.reduce((sum, item) => sum + item.suggestedQuantity, 0)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Estimated Cost</span>
//                       <span className="font-medium text-green-600">
//                         ${selectedItems.reduce((sum, item) => sum + item.estimatedCost, 0).toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Avg. Coverage</span>
//                       <span className="font-medium text-blue-600">
//                         {Math.round(
//                           selectedItems.reduce((sum, item) => sum + item.coverageDays, 0) / selectedItems.length
//                         )} days
//                       </span>
//                     </div>
//                   </div>
                  
//                   <button
//                     onClick={handleCreateRestockPlan}
//                     className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
//                   >
//                     <Truck className="h-5 w-5 mr-2" />
//                     Create Restock Plan
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No items selected</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Select items from the recommendations
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Restock Analytics */}
//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-gray-900">Restock Analytics</h3>
//               <BarChart3 className="h-5 w-5 text-gray-400" />
//             </div>
            
//             {analytics && (
//               <div className="space-y-4">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Total Inventory Value</span>
//                     <span className="text-sm font-medium text-gray-900">
//                       ${analytics.inventoryMetrics?.totalValue?.toLocaleString() || 0}
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Out of Stock SKUs</span>
//                     <span className="text-sm font-medium text-red-600">
//                       {analytics.inventoryMetrics?.outOfStock || 0}
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Low Stock SKUs</span>
//                     <span className="text-sm font-medium text-orange-600">
//                       {analytics.inventoryMetrics?.lowStock || 0}
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Avg. Turnover Rate</span>
//                     <span className="text-sm font-medium text-blue-600">
//                       {analytics.inventoryMetrics?.avgTurnover?.toFixed(1) || 0}x
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="pt-4 border-t border-gray-200">
//                   <h4 className="text-sm font-medium text-gray-900 mb-3">Warehouse Utilization</h4>
//                   <div className="space-y-3">
//                     {analytics.warehouseUtilization?.slice(0, 3).map(warehouse => (
//                       <div key={warehouse._id} className="space-y-1">
//                         <div className="flex justify-between text-sm">
//                           <span className="font-medium text-gray-900">{warehouse.name}</span>
//                           <span className="text-gray-600">{warehouse.utilization?.toFixed(1)}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div 
//                             className={`h-full rounded-full ${
//                               warehouse.utilization > 90 ? 'bg-red-500' :
//                               warehouse.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
//                             }`}
//                             style={{ width: `${warehouse.utilization}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
            
//             <div className="space-y-3">
//               <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-blue-50 rounded-lg mr-3">
//                     <FileText className="h-4 w-4 text-blue-600" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium text-gray-900">Generate PO</div>
//                     <div className="text-xs text-gray-500">Purchase order template</div>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-gray-400" />
//               </button>
              
//               <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-green-50 rounded-lg mr-3">
//                     <Download className="h-4 w-4 text-green-600" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium text-gray-900">Export Report</div>
//                     <div className="text-xs text-gray-500">CSV, Excel, PDF</div>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-gray-400" />
//               </button>
              
//               <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-purple-50 rounded-lg mr-3">
//                     <Calendar className="h-4 w-4 text-purple-600" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium text-gray-900">Schedule Restock</div>
//                     <div className="text-xs text-gray-500">Auto-replenishment</div>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-gray-400" />
//               </button>
              
//               <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-red-50 rounded-lg mr-3">
//                     <AlertTriangle className="h-4 w-4 text-red-600" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium text-gray-900">View Alerts</div>
//                     <div className="text-xs text-gray-500">Urgent notifications</div>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-gray-400" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer Stats */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl border border-gray-200 p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-blue-50 rounded-lg mr-4">
//               <TrendingUp className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {analytics?.restockStats?.find(s => s._id === 'received')?.count || 0}
//               </div>
//               <div className="text-sm text-gray-600">Restocks This Month</div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-green-50 rounded-lg mr-4">
//               <DollarSign className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <div className="text-2xl font-bold text-gray-900">
//                 ${analytics?.restockStats?.reduce((sum, s) => sum + (s.totalCost || 0), 0).toLocaleString() || 0}
//               </div>
//               <div className="text-sm text-gray-600">Monthly Restock Cost</div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-orange-50 rounded-lg mr-4">
//               <Users className="h-6 w-6 text-orange-600" />
//             </div>
//             <div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {analytics?.supplierPerformance?.length || 0}
//               </div>
//               <div className="text-sm text-gray-600">Active Suppliers</div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-purple-50 rounded-lg mr-4">
//               <Shield className="h-6 w-6 text-purple-600" />
//             </div>
//             <div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {analytics?.inventoryMetrics?.totalSKUs || 0}
//               </div>
//               <div className="text-sm text-gray-600">Total SKUs Managed</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-8 text-center text-sm text-gray-500">
//         <p>GrapesKart Restock Management • Amazon-style intelligent inventory • Last updated: {new Date().toLocaleString()}</p>
//         <p className="mt-1">
//           Data updates every 5 minutes • 
//           <button className="ml-2 text-blue-600 hover:text-blue-800">
//             Configure auto-restock settings
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default GrapesKartRestockDashboard;



import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  Truck,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Filter,
  Search,
  ShoppingCart,
  Warehouse,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Eye,
  Edit,
  FileText,
  Calendar,
  RefreshCw,
  Layers,
  Target,
  Zap,
  Shield,
  PackageCheck,
  PackageX,
  PackageSearch,
  Menu,
  X
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const GrapesKartRestockDashboard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    view: 'all',
    urgency: 'all',
    warehouse: 'all',
    category: 'all'
  });
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch restock recommendations
  useEffect(() => {
    fetchRecommendations();
    fetchAnalytics();
  }, [filters]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/restock/recommendations?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data || []);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restock/analytics?period=month`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Handle item selection
  const handleSelectItem = (item, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  // Select all items of specific urgency
  const selectAllUrgency = (urgency) => {
    const urgencyItems = recommendations.filter(item => item.urgency === urgency);
    setSelectedItems(prev => {
      const newItems = urgencyItems.filter(item => 
        !prev.some(selected => selected.id === item.id)
      );
      return [...prev, ...newItems];
    });
  };

  // Create restock plan
  const handleCreateRestockPlan = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to restock');
      return;
    }

    try {
      const restockData = {
        items: selectedItems.map(item => ({
          inventoryId: item.id,
          quantity: item.suggestedQuantity
        })),
        supplierId: 'default-supplier-id',
        warehouseId: 'default-warehouse-id',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Restock plan created from dashboard'
      };

      const response = await fetch(`${API_BASE_URL}/restock/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restockData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Restock plan created: ${data.data.restockId}`);
        setSelectedItems([]);
        fetchRecommendations();
      }
    } catch (error) {
      console.error('Error creating restock plan:', error);
      alert('Failed to create restock plan');
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      case 'excess': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Get urgency text color
  const getUrgencyTextColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-green-700';
      case 'excess': return 'text-purple-700';
      default: return 'text-gray-700';
    }
  };

  // Responsive table columns
  const tableColumns = {
    sm: ['select', 'product', 'urgency'], // Small screens
    md: ['select', 'product', 'stock', 'urgency'], // Medium screens
    lg: ['select', 'product', 'stock', 'sales', 'quantity', 'urgency'] // Large screens
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 sm:w-1/4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 sm:h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white rounded-lg shadow-lg"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
              Amazon-Style Restock Management
            </h1>
            <p className="text-gray-600 text-sm mt-1 truncate">
              Intelligent restocking recommendations like Amazon FBA
            </p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={fetchRecommendations}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick Stats - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Critical Restocks */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-red-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {summary?.critical || 0}
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {summary?.critical || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Critical Restocks</div>
            <button 
              onClick={() => selectAllUrgency('critical')}
              className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 truncate"
            >
              Select all critical
            </button>
          </div>

          {/* High Priority */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
                <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-orange-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {summary?.high || 0}
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {summary?.high || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">High Priority</div>
            <button 
              onClick={() => selectAllUrgency('high')}
              className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 truncate"
            >
              Select all high
            </button>
          </div>

          {/* Total Recommendations */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-blue-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {summary?.totalItems || 0}
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {summary?.totalItems || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Recommendations</div>
            <div className="mt-2 text-xs sm:text-sm text-gray-500 truncate">
              ${summary?.totalEstimatedCost?.toLocaleString() || 0}
            </div>
          </div>

          {/* Selected Items */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                <ShoppingCart className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {selectedItems.length}
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {selectedItems.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Selected Items</div>
            <button 
              onClick={handleCreateRestockPlan}
              disabled={selectedItems.length === 0}
              className={`mt-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full ${
                selectedItems.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              Create Plan
            </button>
          </div>
        </div>

        {/* Filters - Responsive Layout */}
        <div className={`bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 mb-4 md:mb-6 ${
          mobileMenuOpen ? 'block' : 'hidden sm:block'
        }`}>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
            <div className="w-full sm:w-auto min-w-[140px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">View</label>
              <select
                value={filters.view}
                onChange={(e) => setFilters({...filters, view: e.target.value})}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Inventory</option>
                <option value="fba">FBA Eligible</option>
                <option value="fbm">FBM Only</option>
                <option value="slow">Slow Moving</option>
              </select>
            </div>

            <div className="w-full sm:w-auto min-w-[140px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Urgency</label>
              <select
                value={filters.urgency}
                onChange={(e) => setFilters({...filters, urgency: e.target.value})}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Urgency</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="excess">Excess</option>
              </select>
            </div>

            <div className="w-full sm:w-auto min-w-[140px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                value={filters.warehouse}
                onChange={(e) => setFilters({...filters, warehouse: e.target.value})}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Warehouses</option>
                <option value="fba">Amazon FBA</option>
                <option value="main">Main Warehouse</option>
                <option value="east">East Coast</option>
                <option value="west">West Coast</option>
              </select>
            </div>

            <div className="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row gap-3 mt-2 sm:mt-0">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search SKU or product..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Restock Recommendations - Main Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="max-w-full">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    Restock Recommendations
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">
                    Amazon-style intelligent restocking suggestions
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-start space-x-3">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Selected: {selectedItems.length}
                  </span>
                  <button 
                    onClick={() => setSelectedItems([])}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-800 whitespace-nowrap"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="sm:hidden">
                {recommendations.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 border-b border-gray-200 ${
                      selectedItems.some(selected => selected.id === item.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.some(selected => selected.id === item.id)}
                          onChange={(e) => handleSelectItem(item, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                            {item.productName}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <span className="mr-2">{item.sku}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              item.fbaStatus === 'enrolled' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.fbaStatus === 'enrolled' ? 'FBA' : 'FBM'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                        item.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                        item.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        item.urgency === 'low' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 pl-9">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span className="font-medium">{item.currentStock}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sales:</span>
                        <span className="font-medium">{item.dailySales}/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Recommend:</span>
                        <span className="font-medium text-blue-600">{item.suggestedQuantity} units</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-medium text-green-600">${item.estimatedCost?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet+ Table View */}
              <table className="hidden sm:table w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === recommendations.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(recommendations);
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Status
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales Velocity
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommended Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Urgency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recommendations.map((item) => (
                    <tr 
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedItems.some(selected => selected.id === item.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.some(selected => selected.id === item.id)}
                          onChange={(e) => handleSelectItem(item, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="flex items-center min-w-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover border border-gray-200 mr-2 sm:mr-3"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[180px] md:max-w-[200px]">
                              {item.productName}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <span className="truncate max-w-[80px] sm:max-w-[120px]">{item.sku}</span>
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs whitespace-nowrap ${
                                item.fbaStatus === 'enrolled' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {item.fbaStatus === 'enrolled' ? 'FBA' : 'FBM'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="hidden md:table-cell px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-full rounded-full ${getUrgencyColor(item.urgency)}`}
                                style={{
                                  width: `${Math.min(100, (item.currentStock / item.maxStockLevel) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.currentStock}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Min: {item.reorderPoint} • Max: {item.maxStockLevel}
                          </div>
                        </div>
                      </td>
                      
                      <td className="hidden lg:table-cell px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {item.dailySales}/day
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.daysOfSupply} days
                          </div>
                        </div>
                      </td>
                      
                      <td className="hidden lg:table-cell px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {item.suggestedQuantity} units
                          </div>
                          <div className="text-xs text-gray-500">
                            ${item.estimatedCost?.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            item.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                            item.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                            item.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            item.urgency === 'low' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
                          </span>
                          
                          {item.inboundQuantity > 0 && (
                            <div className="text-xs text-blue-600">
                              Inbound: {item.inboundQuantity}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {recommendations.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <PackageCheck className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                    No restock recommendations
                  </h3>
                  <p className="text-sm text-gray-500">
                    All inventory levels are optimal
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4 md:space-y-6">
          {/* Selected Items Summary */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Selected Items Summary
            </h3>
            
            {selectedItems.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  {selectedItems.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-gray-100 flex items-center justify-center mr-2">
                          <Package className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[150px]">
                            {item.productName}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[100px]">
                            {item.sku}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        {item.suggestedQuantity}
                      </div>
                    </div>
                  ))}
                  
                  {selectedItems.length > 3 && (
                    <div className="text-center text-xs sm:text-sm text-gray-500">
                      + {selectedItems.length - 3} more items
                    </div>
                  )}
                </div>
                
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Total Quantity</span>
                      <span className="font-medium text-gray-900">
                        {selectedItems.reduce((sum, item) => sum + item.suggestedQuantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Estimated Cost</span>
                      <span className="font-medium text-green-600">
                        ${selectedItems.reduce((sum, item) => sum + item.estimatedCost, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Avg. Coverage</span>
                      <span className="font-medium text-blue-600">
                        {Math.round(
                          selectedItems.reduce((sum, item) => sum + item.coverageDays, 0) / selectedItems.length
                        )} days
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCreateRestockPlan}
                    className="w-full mt-3 sm:mt-4 px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    Create Restock Plan
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 sm:py-8">
                <ShoppingCart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-4" />
                <p className="text-sm text-gray-500">No items selected</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Select items from recommendations
                </p>
              </div>
            )}
          </div>

          {/* Restock Analytics */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Restock Analytics</h3>
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            
            {analytics && (
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Total Inventory Value</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      ${analytics.inventoryMetrics?.totalValue?.toLocaleString() || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Out of Stock SKUs</span>
                    <span className="text-xs sm:text-sm font-medium text-red-600">
                      {analytics.inventoryMetrics?.outOfStock || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Low Stock SKUs</span>
                    <span className="text-xs sm:text-sm font-medium text-orange-600">
                      {analytics.inventoryMetrics?.lowStock || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Avg. Turnover Rate</span>
                    <span className="text-xs sm:text-sm font-medium text-blue-600">
                      {analytics.inventoryMetrics?.avgTurnover?.toFixed(1) || 0}x
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Warehouse Utilization</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {analytics.warehouseUtilization?.slice(0, 2).map(warehouse => (
                      <div key={warehouse._id} className="space-y-1">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-medium text-gray-900 truncate max-w-[80px] sm:max-w-full">
                            {warehouse.name}
                          </span>
                          <span className="text-gray-600">{warehouse.utilization?.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className={`h-full rounded-full ${
                              warehouse.utilization > 90 ? 'bg-red-500' :
                              warehouse.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${warehouse.utilization}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              <button className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg mr-2 sm:mr-3">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">Generate PO</div>
                    <div className="text-xs text-gray-500 hidden sm:block">Purchase order template</div>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg mr-2 sm:mr-3">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">Export Report</div>
                    <div className="text-xs text-gray-500 hidden sm:block">CSV, Excel, PDF</div>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg mr-2 sm:mr-3">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">Schedule Restock</div>
                    <div className="text-xs text-gray-500 hidden sm:block">Auto-replenishment</div>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-red-50 rounded-lg mr-2 sm:mr-3">
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">View Alerts</div>
                    <div className="text-xs text-gray-500 hidden sm:block">Urgent notifications</div>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats - Responsive Grid */}
      <div className="mt-6 md:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg mr-3 sm:mr-4">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {analytics?.restockStats?.find(s => s._id === 'received')?.count || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Restocks This Month</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-50 rounded-lg mr-3 sm:mr-4">
              <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                ${analytics?.restockStats?.reduce((sum, s) => sum + (s.totalCost || 0), 0).toLocaleString() || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Monthly Restock Cost</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-orange-50 rounded-lg mr-3 sm:mr-4">
              <Users className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {analytics?.supplierPerformance?.length || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Active Suppliers</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-50 rounded-lg mr-3 sm:mr-4">
              <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {analytics?.inventoryMetrics?.totalSKUs || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total SKUs Managed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 md:mt-8 text-center text-xs sm:text-sm text-gray-500 px-2">
        <p className="truncate">GrapesKart Restock Management • Amazon-style intelligent inventory • Last updated: {new Date().toLocaleString()}</p>
        <p className="mt-1">
          Data updates every 5 minutes • 
          <button className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
            Configure auto-restock settings
          </button>
        </p>
      </div>
    </div>
  );
};

export default GrapesKartRestockDashboard;