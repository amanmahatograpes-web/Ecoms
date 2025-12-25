import React, { useState, useMemo, useEffect } from 'react';
import { 
  FiPackage, FiAlertCircle, FiTrendingUp, FiTrendingDown,
  FiFilter, FiSearch, FiDownload, FiPrinter, FiRefreshCw,
  FiEye, FiEdit, FiTrash2, FiPlus, FiMinus, FiCheckCircle,
  FiXCircle, FiClock, FiDollarSign, FiShoppingCart, FiTruck,
  FiBarChart2, FiPieChart, FiGrid, FiList, FiChevronDown,
  FiChevronUp, FiCalendar, FiSettings, FiShare2, FiArchive,
  FiPercent, FiUsers, FiGlobe, FiCreditCard, FiStar,
  FiArrowUpRight, FiArrowDownRight, FiMaximize2, FiMenu, FiX
} from 'react-icons/fi';
import { 
  FaAmazon, FaRegCalendarAlt, FaFilter as FaFilterSolid,
  FaSortAmountDown, FaSortAmountUp, FaExclamationTriangle,
  FaBoxOpen, FaWarehouse, FaShippingFast, FaRegClock
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryReports = () => {
  const [viewMode, setViewMode] = useState('overview');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('quantity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [alertThreshold, setAlertThreshold] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showLowStock, setShowLowStock] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [showDiscontinued, setShowDiscontinued] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Warehouses
  const warehouses = [
    { id: 'all', name: 'All Warehouses', location: 'Global', capacity: 100000, used: 75600 },
    { id: 'us-east', name: 'US East', location: 'New Jersey, USA', capacity: 25000, used: 18900 },
    { id: 'us-west', name: 'US West', location: 'Nevada, USA', capacity: 30000, used: 23400 },
    { id: 'eu-central', name: 'EU Central', location: 'Frankfurt, Germany', capacity: 20000, used: 15600 },
    { id: 'asia-pacific', name: 'Asia Pacific', location: 'Tokyo, Japan', capacity: 15000, used: 11700 },
    { id: 'uk-south', name: 'UK South', location: 'London, UK', capacity: 10000, used: 6000 },
  ];

  // Status filters
  const statusFilters = [
    { id: 'all', label: 'All Items', color: 'gray' },
    { id: 'in_stock', label: 'In Stock', color: 'green' },
    { id: 'low_stock', label: 'Low Stock', color: 'yellow' },
    { id: 'out_of_stock', label: 'Out of Stock', color: 'red' },
    { id: 'discontinued', label: 'Discontinued', color: 'gray' },
    { id: 'pre_order', label: 'Pre-Order', color: 'blue' },
  ];

  // Inventory data
  const inventoryData = useMemo(() => [
    {
      id: 'INV001',
      sku: 'AMZ-ELEC-001',
      name: 'Apple AirPods Pro (2nd Gen)',
      category: 'Electronics',
      currentStock: 45,
      minStock: 10,
      maxStock: 200,
      incoming: 150,
      outgoing: 25,
      daysOfSupply: 18,
      status: 'in_stock',
      warehouses: ['us-east', 'us-west'],
      lastUpdated: '2024-01-15',
      price: 249.99,
      salesRank: 1,
      velocity: 'high',
      image: 'https://images.unsplash.com/photo-1591370264374-9a5aef8df17a?w=400&h=400&fit=crop'
    },
    {
      id: 'INV002',
      sku: 'AMZ-HOME-001',
      name: 'Instant Pot Duo 7-in-1',
      category: 'Home & Kitchen',
      currentStock: 8,
      minStock: 15,
      maxStock: 100,
      incoming: 50,
      outgoing: 12,
      daysOfSupply: 6,
      status: 'low_stock',
      warehouses: ['us-east', 'uk-south'],
      lastUpdated: '2024-01-14',
      price: 89.99,
      salesRank: 3,
      velocity: 'high',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    },
    {
      id: 'INV003',
      sku: 'AMZ-ELEC-002',
      name: 'Samsung 55" 4K Smart TV',
      category: 'Electronics',
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
      incoming: 25,
      outgoing: 8,
      daysOfSupply: 0,
      status: 'out_of_stock',
      warehouses: ['us-west', 'asia-pacific'],
      lastUpdated: '2024-01-13',
      price: 449.99,
      salesRank: 2,
      velocity: 'medium',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'
    },
    {
      id: 'INV004',
      sku: 'AMZ-FASH-001',
      name: 'Nike Men\'s Running Shoes',
      category: 'Fashion',
      currentStock: 120,
      minStock: 20,
      maxStock: 300,
      incoming: 80,
      outgoing: 15,
      daysOfSupply: 48,
      status: 'in_stock',
      warehouses: ['all'],
      lastUpdated: '2024-01-15',
      price: 129.99,
      salesRank: 5,
      velocity: 'medium',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    },
    {
      id: 'INV005',
      sku: 'AMZ-HOME-002',
      name: 'KitchenAid Stand Mixer',
      category: 'Home & Kitchen',
      currentStock: 3,
      minStock: 10,
      maxStock: 75,
      incoming: 30,
      outgoing: 5,
      daysOfSupply: 4,
      status: 'low_stock',
      warehouses: ['us-east', 'eu-central'],
      lastUpdated: '2024-01-12',
      price: 329.99,
      salesRank: 4,
      velocity: 'low',
      image: 'https://images.unsplash.com/photo-1560448204-61dcf4e4f1bf?w=400&h=400&fit=crop'
    },
    {
      id: 'INV006',
      sku: 'AMZ-ELEC-003',
      name: 'Dyson V11 Cordless Vacuum',
      category: 'Electronics',
      currentStock: 65,
      minStock: 15,
      maxStock: 150,
      incoming: 100,
      outgoing: 20,
      daysOfSupply: 26,
      status: 'in_stock',
      warehouses: ['us-west', 'uk-south'],
      lastUpdated: '2024-01-15',
      price: 549.99,
      salesRank: 6,
      velocity: 'medium',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    {
      id: 'INV007',
      sku: 'AMZ-TOYS-001',
      name: 'LEGO Star Wars Millennium Falcon',
      category: 'Toys & Games',
      currentStock: 0,
      minStock: 5,
      maxStock: 40,
      incoming: 0,
      outgoing: 0,
      daysOfSupply: 0,
      status: 'discontinued',
      warehouses: ['us-east'],
      lastUpdated: '2024-01-10',
      price: 159.99,
      salesRank: 15,
      velocity: 'low',
      image: 'https://images.unsplash.com/photo-1594787318281-7d21df6e1fd2?w=400&h=400&fit=crop'
    },
    {
      id: 'INV008',
      sku: 'AMZ-BOOK-001',
      name: 'Best-Selling Novel Collection',
      category: 'Books',
      currentStock: 250,
      minStock: 50,
      maxStock: 500,
      incoming: 200,
      outgoing: 45,
      daysOfSupply: 42,
      status: 'in_stock',
      warehouses: ['all'],
      lastUpdated: '2024-01-14',
      price: 24.99,
      salesRank: 8,
      velocity: 'high',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop'
    },
    {
      id: 'INV009',
      sku: 'AMZ-ELEC-004',
      name: 'PlayStation 5 Console',
      category: 'Electronics',
      currentStock: 5,
      minStock: 10,
      maxStock: 100,
      incoming: 50,
      outgoing: 8,
      daysOfSupply: 5,
      status: 'low_stock',
      warehouses: ['us-west', 'asia-pacific'],
      lastUpdated: '2024-01-13',
      price: 499.99,
      salesRank: 7,
      velocity: 'high',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop'
    },
    {
      id: 'INV010',
      sku: 'AMZ-HOME-003',
      name: 'Nespresso Vertuo Coffee Machine',
      category: 'Home & Kitchen',
      currentStock: 45,
      minStock: 15,
      maxStock: 120,
      incoming: 75,
      outgoing: 18,
      daysOfSupply: 20,
      status: 'in_stock',
      warehouses: ['us-east', 'eu-central'],
      lastUpdated: '2024-01-15',
      price: 149.99,
      salesRank: 9,
      velocity: 'medium',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e7?w=400&h=400&fit=crop'
    },
    {
      id: 'INV011',
      sku: 'AMZ-FASH-002',
      name: 'Designer Handbag Collection',
      category: 'Fashion',
      currentStock: 12,
      minStock: 5,
      maxStock: 60,
      incoming: 30,
      outgoing: 6,
      daysOfSupply: 16,
      status: 'in_stock',
      warehouses: ['eu-central', 'uk-south'],
      lastUpdated: '2024-01-14',
      price: 299.99,
      salesRank: 12,
      velocity: 'low',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    },
    {
      id: 'INV012',
      sku: 'AMZ-ELEC-005',
      name: 'Fitbit Charge 5 Fitness Tracker',
      category: 'Electronics',
      currentStock: 0,
      minStock: 10,
      maxStock: 80,
      incoming: 40,
      outgoing: 15,
      daysOfSupply: 0,
      status: 'pre_order',
      warehouses: ['us-east', 'us-west'],
      lastUpdated: '2024-01-12',
      price: 129.99,
      salesRank: 10,
      velocity: 'high',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
  ], []);

  // Inventory metrics
  const inventoryMetrics = useMemo(() => {
    const totalProducts = inventoryData.length;
    const inStock = inventoryData.filter(p => p.status === 'in_stock').length;
    const lowStock = inventoryData.filter(p => p.status === 'low_stock').length;
    const outOfStock = inventoryData.filter(p => p.status === 'out_of_stock').length;
    const totalValue = inventoryData.reduce((sum, p) => sum + (p.currentStock * p.price), 0);
    const totalUnits = inventoryData.reduce((sum, p) => sum + p.currentStock, 0);
    
    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
      totalUnits,
      inStockPercentage: (inStock / totalProducts * 100).toFixed(1),
      stockTurnover: 4.2, // This would be calculated from sales data
      averageDaysSupply: inventoryData.reduce((sum, p) => sum + p.daysOfSupply, 0) / totalProducts,
    };
  }, [inventoryData]);

  // Filter inventory data
  const filteredInventory = useMemo(() => {
    let result = [...inventoryData];
    
    // Filter by warehouse
    if (selectedWarehouse !== 'all') {
      result = result.filter(item => 
        item.warehouses.includes('all') || item.warehouses.includes(selectedWarehouse)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    // Show/hide filters
    if (!showLowStock) {
      result = result.filter(item => item.status !== 'low_stock');
    }
    if (!showOutOfStock) {
      result = result.filter(item => item.status !== 'out_of_stock');
    }
    if (!showDiscontinued) {
      result = result.filter(item => item.status !== 'discontinued');
    }
    
    // Sort data
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'sku':
          aValue = a.sku;
          bValue = b.sku;
          break;
        case 'quantity':
          aValue = a.currentStock;
          bValue = b.currentStock;
          break;
        case 'daysOfSupply':
          aValue = a.daysOfSupply;
          bValue = b.daysOfSupply;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'salesRank':
          aValue = a.salesRank;
          bValue = b.salesRank;
          break;
        default:
          aValue = a.currentStock;
          bValue = b.currentStock;
      }
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });
    
    return result;
  }, [inventoryData, selectedWarehouse, statusFilter, searchQuery, sortBy, sortOrder, showLowStock, showOutOfStock, showDiscontinued]);

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
      low_stock: { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: <FiAlertCircle /> },
      out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: <FiXCircle /> },
      discontinued: { label: 'Discontinued', color: 'bg-gray-100 text-gray-800', icon: <FiMinus /> },
      pre_order: { label: 'Pre-Order', color: 'bg-blue-100 text-blue-800', icon: <FiClock /> },
    };
    
    const { label, color, icon } = config[status] || config.in_stock;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <span className="sm:hidden">{icon}</span>
        <span className="hidden sm:inline-block mr-1">{icon}</span>
        <span className="hidden xs:inline">{label}</span>
        <span className="xs:hidden">{label.split(' ')[0]}</span>
      </span>
    );
  };

  // Get velocity badge
  const getVelocityBadge = (velocity) => {
    const config = {
      high: { label: 'High', color: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low', color: 'bg-red-100 text-red-800' },
    };
    
    const { label, color } = config[velocity] || config.medium;
    
    return <span className={`px-2 py-1 rounded text-xs ${color} hidden md:inline`}>{label}</span>;
  };

  // Calculate stock percentage
  const calculateStockPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  // Export report
  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Exported ${format} report`);
    }, 1500);
  };

  // Update inventory
  const updateInventory = (productId, quantity) => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      console.log(`Updated product ${productId} by ${quantity}`);
    }, 1000);
  };

  // Stock level chart
  const StockLevelChart = ({ current, min, max }) => {
    const percentage = calculateStockPercentage(current, max);
    const minPercentage = (min / max) * 100;
    
    return (
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-green-400 to-green-500"
          style={{ width: `${percentage}%` }}
        ></div>
        <div 
          className="absolute h-full border-r-2 border-red-500"
          style={{ left: `${minPercentage}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-900 hidden xs:block">{current}/{max}</span>
          <span className="text-xs font-bold text-gray-900 xs:hidden">{current}</span>
        </div>
      </div>
    );
  };

  // Inventory summary chart
  const InventorySummaryChart = () => {
    const categories = [...new Set(inventoryData.map(item => item.category))];
    
    return (
      <div className="h-48 sm:h-56 md:h-64">
        <div className="flex h-full items-end space-x-1 sm:space-x-2">
          {categories.slice(0, 5).map((category, index) => {
            const categoryItems = inventoryData.filter(item => item.category === category);
            const totalStock = categoryItems.reduce((sum, item) => sum + item.currentStock, 0);
            const maxStock = Math.max(...inventoryData.map(item => item.currentStock));
            const height = (totalStock / maxStock) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center" style={{ height: '140px' }}>
                  <div 
                    className="w-6 sm:w-8 md:w-10 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg group"
                    style={{ height: `${height}%`, bottom: '0' }}
                  >
                    <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {totalStock} units
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600 truncate w-full text-center">
                  {category.length > 12 ? category.substring(0, 10) + '...' : category}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Warehouse capacity chart
  const WarehouseCapacityChart = () => {
    return (
      <div className="space-y-3 sm:space-y-4">
        {warehouses.slice(1).map((warehouse) => {
          const percentage = (warehouse.used / warehouse.capacity) * 100;
          
          return (
            <div key={warehouse.id} className="space-y-1 sm:space-y-2">
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">
                  {warehouse.name.length > 15 ? warehouse.name.substring(0, 13) + '...' : warehouse.name}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                  {(warehouse.used / 1000).toFixed(0)}K/{(warehouse.capacity / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    percentage > 90 ? 'bg-red-500' :
                    percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="truncate mr-2">{warehouse.location.split(',')[0]}</span>
                <span className="whitespace-nowrap">{percentage.toFixed(1)}% used</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Inventory item card
  const InventoryCard = ({ item }) => {
    const isSelected = selectedProducts.has(item.id);
    const stockPercentage = calculateStockPercentage(item.currentStock, item.maxStock);
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white rounded-xl border ${isSelected ? 'border-blue-500' : 'border-gray-200'} hover:shadow-lg transition-all`}
      >
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-1">
                <span className="text-xs sm:text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.sku}
                </span>
                <div>
                  {getStatusBadge(item.status)}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{item.name}</h4>
              <p className="text-xs sm:text-sm text-gray-500">{item.category}</p>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <button 
                onClick={() => {
                  const newSet = new Set(selectedProducts);
                  if (newSet.has(item.id)) {
                    newSet.delete(item.id);
                  } else {
                    newSet.add(item.id);
                  }
                  setSelectedProducts(newSet);
                }}
                className={`p-1.5 sm:p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <FiEye className="text-sm sm:text-base" />
              </button>
              <button className="p-1.5 sm:p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                <FiEdit className="text-sm sm:text-base" />
              </button>
            </div>
          </div>
          
          {/* Stock Info */}
          <div className="mb-3 sm:mb-4">
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Stock Level</span>
              <span className={`text-xs sm:text-sm font-bold ${
                item.currentStock <= item.minStock ? 'text-red-600' :
                stockPercentage < 30 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {item.currentStock} units
              </span>
            </div>
            <StockLevelChart 
              current={item.currentStock}
              min={item.minStock}
              max={item.maxStock}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Min: {item.minStock}</span>
              <span>Max: {item.maxStock}</span>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <p className="text-xs text-gray-500">Days Supply</p>
              <p className={`text-base sm:text-lg font-bold ${
                item.daysOfSupply < 7 ? 'text-red-600' :
                item.daysOfSupply < 14 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {item.daysOfSupply}d
              </p>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <p className="text-xs text-gray-500">Velocity</p>
              <div className="mt-1">
                {getVelocityBadge(item.velocity)}
                <span className="md:hidden text-xs">
                  {item.velocity.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <p className="text-xs text-gray-500">Incoming</p>
              <p className="text-base sm:text-lg font-bold text-blue-600">{item.incoming}</p>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">${item.price}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-1 sm:space-x-2">
            <button 
              onClick={() => updateInventory(item.id, 10)}
              className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 font-medium py-2 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm"
            >
              <FiPlus className="inline mr-1" /> Reorder
            </button>
            <button className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiBarChart2 className="text-sm sm:text-base" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Mobile Navigation Tabs
  const MobileTabs = () => (
    <div className="lg:hidden bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === 'alerts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Alerts
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${activeTab === 'actions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Actions
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Quick Filters</h3>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <div className="p-4">
                {/* Warehouse Selector */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Warehouse</h4>
                  <div className="space-y-2">
                    {warehouses.map(warehouse => (
                      <button
                        key={warehouse.id}
                        onClick={() => {
                          setSelectedWarehouse(warehouse.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          selectedWarehouse === warehouse.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">{warehouse.name}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {warehouse.used}/{warehouse.capacity}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filters */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
                  <div className="space-y-2">
                    {statusFilters.map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => {
                          setStatusFilter(filter.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          statusFilter === filter.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Filters</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showLowStock}
                        onChange={(e) => setShowLowStock(e.target.checked)}
                        className="rounded text-yellow-500 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700">Low Stock</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showOutOfStock}
                        onChange={(e) => setShowOutOfStock(e.target.checked)}
                        className="rounded text-red-500 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Out of Stock</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showDiscontinued}
                        onChange={(e) => setShowDiscontinued(e.target.checked)}
                        className="rounded text-gray-500 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">Discontinued</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:opacity-90"
                  >
                    Apply Filters
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedWarehouse('all');
                      setStatusFilter('all');
                      setShowLowStock(true);
                      setShowOutOfStock(true);
                      setShowDiscontinued(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-[1920px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-3 lg:mb-0">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden mr-3 text-white"
                >
                  <FiMenu className="text-2xl" />
                </button>
                <div>
                  <div className="flex items-center mb-1 sm:mb-2">
                    <FiPackage className="text-xl sm:text-2xl mr-2 sm:mr-3" />
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Inventory Reports</h1>
                  </div>
                  <p className="text-blue-100 text-sm sm:text-base">Manage stock levels, track inventory, and optimize fulfillment</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3 mt-2 lg:mt-0">
              <button className="bg-white text-blue-600 font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center text-sm sm:text-base">
                <FiPlus className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 sm:px-4 py-2 rounded-lg flex items-center text-sm sm:text-base">
                <FiSettings className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <MobileTabs />

      <div className="max-w-[1920px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search SKU or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <FiFilter className="text-xl" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`grid ${activeTab !== 'overview' ? 'hidden lg:grid' : 'grid'} grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8`}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-5"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Products</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{inventoryMetrics.totalProducts}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 text-blue-600 rounded-lg">
                <FiPackage className="text-lg sm:text-xl" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-green-600">
              <FiTrendingUp className="inline mr-1" />
              <span>{inventoryMetrics.inStockPercentage}% in stock</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-5"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Inventory Value</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  ${(inventoryMetrics.totalValue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 text-green-600 rounded-lg">
                <FiDollarSign className="text-lg sm:text-xl" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {inventoryMetrics.totalUnits.toLocaleString()} units
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className={`${activeTab === 'alerts' ? 'lg:hidden' : ''} bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-5`}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Stock Issues</p>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{inventoryMetrics.outOfStock}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">/{inventoryMetrics.lowStock}</p>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 text-red-600 rounded-lg">
                <FiAlertCircle className="text-lg sm:text-xl" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {inventoryMetrics.outOfStock} out, {inventoryMetrics.lowStock} low
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-5"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Stock Turnover</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{inventoryMetrics.stockTurnover}x</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FiRefreshCw className="text-lg sm:text-xl" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Avg. {inventoryMetrics.averageDaysSupply.toFixed(0)} days
            </div>
          </motion.div>
        </div>

        {/* Desktop Controls Bar */}
        <div className={`hidden lg:block bg-white rounded-xl shadow-sm border p-4 mb-6`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            {/* Left Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Warehouse Selector */}
              <div className="relative">
                <select 
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-8 py-2 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </select>
                <FaWarehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-8 py-2 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {statusFilters.map(filter => (
                    <option key={filter.id} value={filter.id}>{filter.label}</option>
                  ))}
                </select>
                <FaFilterSolid className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search SKU or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <FiList />
                </button>
              </div>
              
              <button 
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
              </button>
              
              <button 
                onClick={() => setIsLoading(true)}
                className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
              >
                <FiRefreshCw className={`mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="rounded text-yellow-500 focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">Show Low Stock ({inventoryMetrics.lowStock})</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOutOfStock}
                onChange={(e) => setShowOutOfStock(e.target.checked)}
                className="rounded text-red-500 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Show Out of Stock ({inventoryMetrics.outOfStock})</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showDiscontinued}
                onChange={(e) => setShowDiscontinued(e.target.checked)}
                className="rounded text-gray-500 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">Show Discontinued</span>
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Charts Section - Hidden on mobile except on overview tab */}
          <div className={`${activeTab === 'overview' || activeTab === 'reports' ? 'block' : 'hidden lg:block'} lg:col-span-2 space-y-4 sm:space-y-6`}>
            {/* Inventory Summary Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Inventory by Category</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Stock distribution across categories</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiMaximize2 />
                  </button>
                  <button 
                    onClick={() => handleExport('pdf')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiDownload />
                  </button>
                </div>
              </div>
              <InventorySummaryChart />
            </div>

            {/* Warehouse Capacity */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Warehouse Capacity</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Storage utilization by location</p>
                </div>
                <FaWarehouse className="text-gray-400 text-lg sm:text-xl" />
              </div>
              <WarehouseCapacityChart />
            </div>
          </div>

          {/* Right Column - Alerts & Actions */}
          <div className={`${activeTab === 'alerts' || activeTab === 'actions' ? 'block' : 'hidden lg:block'} space-y-4 sm:space-y-6`}>
            {/* Stock Alerts */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Stock Alerts</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Items needing attention</p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm text-gray-600 mr-1 sm:mr-2">Alert at:</span>
                  <input
                    type="number"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(Number(e.target.value))}
                    className="w-12 sm:w-16 border border-gray-300 rounded px-1 sm:px-2 py-1 text-center text-sm"
                    min="1"
                    max="100"
                  />
                  <span className="text-xs sm:text-sm text-gray-600 ml-1">units</span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {inventoryData
                  .filter(item => item.currentStock <= item.minStock)
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-600">Only {item.currentStock} units left</p>
                      </div>
                      <button 
                        onClick={() => updateInventory(item.id, item.maxStock - item.currentStock)}
                        className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs sm:text-sm font-medium whitespace-nowrap"
                      >
                        Reorder
                      </button>
                    </div>
                  ))}
              </div>
              
              <button className="w-full mt-3 sm:mt-4 border border-gray-300 hover:bg-gray-50 font-medium py-2 rounded-lg text-sm sm:text-base">
                View All Alerts
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                <button 
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 sm:py-3 rounded-lg flex items-center justify-center text-sm sm:text-base"
                >
                  {isExporting ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" />
                      <span className="hidden sm:inline">Export Inventory Report</span>
                      <span className="sm:hidden">Export Report</span>
                    </>
                  )}
                </button>
                
                <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 sm:py-3 rounded-lg flex items-center justify-center text-sm sm:text-base">
                  <FiPrinter className="mr-2" />
                  <span className="hidden sm:inline">Print Stock Labels</span>
                  <span className="sm:hidden">Print Labels</span>
                </button>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 rounded-lg text-xs sm:text-sm">
                    <FiShare2 className="inline mr-1 sm:mr-2" />
                    Share
                  </button>
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 rounded-lg text-xs sm:text-sm">
                    <FiArchive className="inline mr-1 sm:mr-2" />
                    Archive
                  </button>
                </div>
              </div>
            </div>

            {/* Reorder Suggestions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Reorder Suggestions</h3>
              <div className="space-y-2 sm:space-y-3">
                {inventoryData
                  .filter(item => item.currentStock < item.maxStock * 0.3 && item.status !== 'discontinued')
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg mr-2 sm:mr-3"></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">Reorder {item.maxStock - item.currentStock} units</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => updateInventory(item.id, item.maxStock - item.currentStock)}
                        className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs sm:text-sm whitespace-nowrap ml-2"
                      >
                        Order
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Inventory Items</h2>
              <p className="text-gray-600 text-sm sm:text-base">{filteredInventory.length} items found</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="quantity">Sort by Quantity</option>
                <option value="name">Sort by Name</option>
                <option value="sku">Sort by SKU</option>
                <option value="daysOfSupply">Sort by Days Supply</option>
                <option value="price">Sort by Price</option>
                <option value="salesRank">Sort by Sales Rank</option>
              </select>
              
              {selectedProducts.size > 0 && (
                <button className="bg-red-100 text-red-700 hover:bg-red-200 font-medium px-3 sm:px-4 py-2 rounded-lg flex items-center text-sm">
                  <FiTrash2 className="mr-2" />
                  <span className="hidden sm:inline">Delete ({selectedProducts.size})</span>
                  <span className="sm:hidden">({selectedProducts.size})</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile View Toggle */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <span className="text-sm text-gray-600">{viewMode === 'grid' ? 'Grid View' : 'List View'}</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              >
                <FiList />
              </button>
            </div>
          </div>
          
          {/* Grid/List View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredInventory.map((item) => (
                <InventoryCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 sm:p-4 text-left">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">SKU</th>
                      <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">Product</th>
                      <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">Stock</th>
                      <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">Status</th>
                      <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">Days</th>
                      <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3 sm:p-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(item.id)}
                            onChange={(e) => {
                              const newSet = new Set(selectedProducts);
                              if (e.target.checked) {
                                newSet.add(item.id);
                              } else {
                                newSet.delete(item.id);
                              }
                              setSelectedProducts(newSet);
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3 sm:p-4">
                          <code className="text-xs sm:text-sm font-mono text-gray-600">{item.sku}</code>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="min-w-[200px]">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{item.category}</p>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.currentStock} units</p>
                            <div className="w-24 sm:w-32">
                              <StockLevelChart 
                                current={item.currentStock}
                                min={item.minStock}
                                max={item.maxStock}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className={`font-bold text-sm sm:text-base ${
                            item.daysOfSupply < 7 ? 'text-red-600' :
                            item.daysOfSupply < 14 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {item.daysOfSupply}d
                          </div>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600">
                              <FiEye className="text-sm sm:text-base" />
                            </button>
                            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-green-600">
                              <FiEdit className="text-sm sm:text-base" />
                            </button>
                            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600">
                              <FiTrash2 className="text-sm sm:text-base" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* No Results */}
        {filteredInventory.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center mt-6">
            <FiSearch className="text-gray-400 text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {searchQuery 
                ? `No items matching "${searchQuery}"`
                : 'Try adjusting your filters'}
            </p>
            <button 
              onClick={() => {
                setSelectedWarehouse('all');
                setStatusFilter('all');
                setSearchQuery('');
                setShowLowStock(true);
                setShowOutOfStock(true);
                setShowDiscontinued(false);
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 text-sm sm:text-base"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryReports;