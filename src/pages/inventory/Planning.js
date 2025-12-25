import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  Truck,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Warehouse,
  ChevronRight,
  Info,
  Settings,
  Eye,
  EyeOff,
  Layers,
  Target,
  Zap,
  Shield,
  Users
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const InventoryPlanning = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedView, setSelectedView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showForecast, setShowForecast] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');

  // Fetch inventory data
  useEffect(() => {
    fetchInventoryData();
  }, [timeRange]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/inventory/planning?range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setInventoryData(data);
      } else if (data.data && Array.isArray(data.data)) {
        setInventoryData(data.data);
      } else if (data.inventory && Array.isArray(data.inventory)) {
        setInventoryData(data.inventory);
      } else {
        setInventoryData([]);
        console.warn('Inventory data is not in expected format:', data);
      }
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError('Failed to load inventory data. Please try again later.');
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate key metrics
  const metrics = useMemo(() => {
    if (!inventoryData.length || !Array.isArray(inventoryData)) {
      return {
        totalSKUs: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        excessStockItems: 0,
        averageCoverageDays: 0,
        turnoverRate: 0,
        forecastAccuracy: 87.5
      };
    }

    // Filter out any invalid items
    const validItems = inventoryData.filter(item => 
      item && typeof item === 'object'
    );
    
    if (validItems.length === 0) {
      return {
        totalSKUs: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        excessStockItems: 0,
        averageCoverageDays: 0,
        turnoverRate: 0,
        forecastAccuracy: 87.5
      };
    }

    const totalSKUs = validItems.length;
    const totalValue = validItems.reduce((sum, item) => {
      const currentStock = item.currentStock || 0;
      const unitCost = item.unitCost || 0;
      return sum + (currentStock * unitCost);
    }, 0);
    
    const lowStockItems = validItems.filter(item => {
      const currentStock = item.currentStock || 0;
      const reorderPoint = item.reorderPoint || 0;
      return currentStock <= reorderPoint && currentStock > 0;
    }).length;
    
    const outOfStockItems = validItems.filter(item => {
      const currentStock = item.currentStock || 0;
      return currentStock === 0;
    }).length;
    
    const excessStockItems = validItems.filter(item => {
      const currentStock = item.currentStock || 0;
      const maxStockLevel = item.maxStockLevel || Infinity;
      return currentStock > maxStockLevel;
    }).length;
    
    const averageCoverageDays = Math.round(
      validItems.reduce((sum, item) => {
        const currentStock = item.currentStock || 0;
        const dailySales = item.dailySales || item.avgDailySales || 0;
        return sum + (dailySales > 0 ? currentStock / dailySales : 0);
      }, 0) / totalSKUs
    ) || 0;
    
    const totalSales = validItems.reduce((sum, item) => {
      return sum + (item.dailySales || 0);
    }, 0);
    
    const averageInventory = validItems.reduce((sum, item) => {
      return sum + (item.currentStock || 0);
    }, 0) / totalSKUs;
    
    const turnoverRate = averageInventory > 0 ? (totalSales / averageInventory).toFixed(2) : 0;

    return {
      totalSKUs,
      totalValue: Math.round(totalValue),
      lowStockItems,
      outOfStockItems,
      excessStockItems,
      averageCoverageDays: Math.max(0, averageCoverageDays),
      turnoverRate: parseFloat(turnoverRate) || 0,
      forecastAccuracy: 87.5 // This would come from backend
    };
  }, [inventoryData]);

  // Calculate reorder recommendations
  const reorderRecommendations = useMemo(() => {
    if (!inventoryData.length || !Array.isArray(inventoryData)) {
      return [];
    }

    // Filter out invalid items first
    const validItems = inventoryData.filter(item => 
      item && typeof item === 'object'
    );

    return validItems
      .filter(item => {
        const currentStock = item.currentStock || 0;
        const reorderPoint = item.reorderPoint || 0;
        const productName = item.productName || '';
        const category = item.category || '';
        const warehouse = item.warehouse || '';
        const supplier = item.supplier || '';
        
        if (showLowStockOnly && currentStock > reorderPoint) return false;
        if (searchTerm && !productName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (selectedCategory !== 'all' && category !== selectedCategory) return false;
        if (selectedWarehouse !== 'all' && warehouse !== selectedWarehouse) return false;
        if (selectedSupplier !== 'all' && supplier !== selectedSupplier) return false;
        return true;
      })
      .map(item => {
        const currentStock = item.currentStock || 0;
        const unitCost = item.unitCost || 0;
        const productName = item.productName || 'Unnamed Product';
        const category = item.category || 'Uncategorized';
        const sku = item.sku || 'N/A';
        const image = item.image || null;
        const leadTime = item.leadTime || 7;
        const safetyStock = item.safetyStock || 0;
        const maxStockLevel = item.maxStockLevel || 0;
        const reorderPoint = item.reorderPoint || 0;
        
        const dailySales = item.dailySales || item.avgDailySales || 0;
        const leadTimeDays = leadTime;
        const safetyStockCalc = safetyStock || Math.ceil(dailySales * leadTimeDays * 0.5);
        const reorderPointCalc = reorderPoint || Math.ceil(dailySales * leadTimeDays + safetyStockCalc);
        const maxStock = maxStockLevel || Math.ceil(dailySales * 30);
        
        // Calculate suggested order quantity
        let suggestedOrder = 0;
        let urgency = 'low';
        let coverageDays = dailySales > 0 ? Math.floor(currentStock / dailySales) : 999;
        
        if (currentStock === 0) {
          suggestedOrder = maxStock;
          urgency = 'critical';
          coverageDays = 0;
        } else if (currentStock <= reorderPointCalc) {
          suggestedOrder = Math.max(0, maxStock - currentStock);
          urgency = currentStock <= safetyStockCalc ? 'high' : 'medium';
        } else if (currentStock > maxStock) {
          suggestedOrder = 0;
          urgency = 'excess';
          coverageDays = dailySales > 0 ? Math.floor((currentStock - maxStock) / dailySales) : 999;
        }
        
        // Calculate forecast
        const forecastSales = dailySales * 30;
        const projectedStock = currentStock + suggestedOrder - forecastSales;
        const projectedCoverage = dailySales > 0 ? Math.max(0, Math.floor(projectedStock / dailySales)) : 999;
        
        return {
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9), // Generate unique ID if not present
          currentStock,
          unitCost,
          productName,
          category,
          sku,
          image,
          dailySales,
          leadTimeDays,
          safetyStock: safetyStockCalc,
          reorderPoint: reorderPointCalc,
          maxStock,
          suggestedOrder,
          urgency,
          coverageDays,
          forecastSales,
          projectedStock,
          projectedCoverage
        };
      })
      .sort((a, b) => {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3, excess: 4 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
  }, [inventoryData, searchTerm, showLowStockOnly, selectedCategory, selectedWarehouse, selectedSupplier]);

  // Calculate category distribution
  const categoryDistribution = useMemo(() => {
    if (!inventoryData.length || !Array.isArray(inventoryData)) {
      return [];
    }

    const distribution = {};
    inventoryData.forEach(item => {
      if (item && typeof item === 'object') {
        const category = item.category || 'Uncategorized';
        distribution[category] = (distribution[category] || 0) + 1;
      }
    });
    return Object.entries(distribution)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [inventoryData]);

  // Calculate warehouse utilization
  const warehouseUtilization = useMemo(() => {
    if (!inventoryData.length || !Array.isArray(inventoryData)) {
      return [];
    }

    const warehouses = {};
    inventoryData.forEach(item => {
      if (item && typeof item === 'object') {
        const warehouse = item.warehouse || 'Unknown';
        const currentStock = item.currentStock || 0;
        const unitCost = item.unitCost || 10;
        
        if (!warehouses[warehouse]) {
          warehouses[warehouse] = { items: 0, value: 0, capacity: 1000 }; // Mock capacity
        }
        warehouses[warehouse].items += 1;
        warehouses[warehouse].value += currentStock * unitCost;
      }
    });
    
    return Object.entries(warehouses).map(([name, data]) => ({
      name,
      items: data.items,
      value: Math.round(data.value),
      utilization: Math.min(100, Math.round((data.items / data.capacity) * 100))
    }));
  }, [inventoryData]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Handle export
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(reorderRecommendations || [], null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `inventory_planning_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Failed to export data. Please try again.');
    }
  };

  // Handle bulk reorder
  const handleBulkReorder = () => {
    try {
      const urgentItems = (reorderRecommendations || []).filter(item => 
        item && ['critical', 'high'].includes(item.urgency) && (item.suggestedOrder || 0) > 0
      );
      
      if (urgentItems.length === 0) {
        alert('No urgent items need reordering.');
        return;
      }
      
      const totalItems = urgentItems.reduce((sum, item) => sum + (item.suggestedOrder || 0), 0);
      const totalCost = urgentItems.reduce((sum, item) => 
        sum + ((item.suggestedOrder || 0) * (item.unitCost || 10)), 0
      );
      
      const confirmReorder = window.confirm(
        `Create reorder for ${urgentItems.length} items?\n\n` +
        `Total Quantity: ${totalItems} units\n` +
        `Estimated Cost: $${totalCost.toLocaleString()}\n\n` +
        `Click OK to proceed.`
      );
      
      if (confirmReorder) {
        // In real app, this would call API
        alert(`Reorder request submitted for ${urgentItems.length} items.`);
      }
    } catch (err) {
      console.error('Error processing bulk reorder:', err);
      alert('Failed to process bulk reorder. Please try again.');
    }
  };

  // Handle individual reorder
  const handleReorderItem = (item) => {
    try {
      const suggestedOrder = item.suggestedOrder || 0;
      const unitCost = item.unitCost || 10;
      const productName = item.productName || 'Unknown Product';
      const leadTimeDays = item.leadTimeDays || 7;
      
      if (suggestedOrder <= 0) {
        alert('No order quantity suggested for this item.');
        return;
      }
      
      const confirm = window.confirm(
        `Reorder ${suggestedOrder} units of ${productName}?\n\n` +
        `Estimated Cost: $${(suggestedOrder * unitCost).toLocaleString()}\n` +
        `Lead Time: ${leadTimeDays} days`
      );
      
      if (confirm) {
        // Call API to create reorder
        alert(`Reorder created for ${productName}`);
      }
    } catch (err) {
      console.error('Error processing reorder:', err);
      alert('Failed to create reorder. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchInventoryData}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Planning</h1>
            <p className="text-gray-600 mt-1">
              Optimize stock levels, forecast demand, and plan replenishment
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowForecast(!showForecast)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showForecast ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showForecast ? 'Hide Forecast' : 'Show Forecast'}
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            
            <button
              onClick={fetchInventoryData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
            { id: '1y', label: 'Last Year' },
            { id: 'custom', label: 'Custom Range' }
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => handleTimeRangeChange(range.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === range.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* View Selector */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'replenishment', label: 'Replenishment', icon: <Truck className="h-4 w-4" /> },
              { id: 'forecasting', label: 'Forecasting', icon: <TrendingUp className="h-4 w-4" /> },
              { id: 'warehouse', label: 'Warehouse', icon: <Warehouse className="h-4 w-4" /> },
              { id: 'reports', label: 'Reports', icon: <Download className="h-4 w-4" /> }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  selectedView === view.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{view.icon}</span>
                {view.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Inventory Value */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.3%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${(metrics.totalValue / 1000).toFixed(1)}K
          </div>
          <div className="text-sm text-gray-600">Total Inventory Value</div>
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            {metrics.totalSKUs} SKUs across all warehouses
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +{metrics.lowStockItems}
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.lowStockItems}</div>
          <div className="text-sm text-gray-600">Low Stock Items</div>
          <div className="mt-4 text-xs text-gray-500">
            {metrics.outOfStockItems} items out of stock
          </div>
        </div>

        {/* Turnover Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +0.3x
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.turnoverRate}x</div>
          <div className="text-sm text-gray-600">Inventory Turnover</div>
          <div className="mt-4 text-xs text-gray-500">
            {metrics.averageCoverageDays} days average coverage
          </div>
        </div>

        {/* Forecast Accuracy */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +1.2%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.forecastAccuracy}%</div>
          <div className="text-sm text-gray-600">Forecast Accuracy</div>
          <div className="mt-4 text-xs text-gray-500">
            Based on last 30 days sales data
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Replenishment Planning */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Replenishment Planning</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Recommended reorders based on current stock levels and forecast
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showLowStockOnly
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    Low Stock Only
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categoryDistribution && categoryDistribution.length > 0 ? (
                      categoryDistribution.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))
                    ) : (
                      <option value="uncategorized">Uncategorized</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Warehouse</label>
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Warehouses</option>
                    {warehouseUtilization && warehouseUtilization.length > 0 ? (
                      warehouseUtilization.map(wh => (
                        <option key={wh.name} value={wh.name}>{wh.name}</option>
                      ))
                    ) : (
                      <option value="unknown">Unknown</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Suppliers</option>
                    <option value="Supplier A">Supplier A</option>
                    <option value="Supplier B">Supplier B</option>
                    <option value="Supplier C">Supplier C</option>
                  </select>
                </div>
                
                <div className="ml-auto flex items-end">
                  <button
                    onClick={handleBulkReorder}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Bulk Reorder ({reorderRecommendations.filter(item => 
                      item && ['critical', 'high'].includes(item.urgency) && (item.suggestedOrder || 0) > 0
                    ).length || 0})
                  </button>
                </div>
              </div>
            </div>

            {/* Replenishment Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Daily Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coverage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suggested Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Urgency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reorderRecommendations && reorderRecommendations.length > 0 ? (
                    reorderRecommendations.slice(0, 10).map((item) => {
                      if (!item) return null;
                      
                      const currentStock = item.currentStock || 0;
                      const maxStock = item.maxStock || 1; // Avoid division by zero
                      const dailySales = item.dailySales || 0;
                      const coverageDays = item.coverageDays || 0;
                      const projectedCoverage = item.projectedCoverage || 0;
                      const suggestedOrder = item.suggestedOrder || 0;
                      const unitCost = item.unitCost || 10;
                      const productName = item.productName || 'Unnamed Product';
                      const category = item.category || 'Uncategorized';
                      const sku = item.sku || 'N/A';
                      const leadTimeDays = item.leadTimeDays || 7;
                      const reorderPoint = item.reorderPoint || 0;
                      const maxStockDisplay = item.maxStock || 0;
                      const urgency = item.urgency || 'low';
                      const image = item.image || null;
                      
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {image && (
                                <div className="h-10 w-10 rounded-lg border border-gray-200 mr-3 overflow-hidden">
                                  <img
                                    src={image}
                                    alt={productName}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {productName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {category} • {sku}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className={`h-full rounded-full ${
                                    urgency === 'critical' ? 'bg-red-500' :
                                    urgency === 'high' ? 'bg-orange-500' :
                                    urgency === 'medium' ? 'bg-yellow-500' :
                                    urgency === 'excess' ? 'bg-purple-500' : 'bg-green-500'
                                  }`}
                                  style={{
                                    width: `${Math.min(100, (currentStock / maxStock) * 100)}%`
                                  }}
                                ></div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {currentStock}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Min: {reorderPoint} • Max: {maxStockDisplay}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {dailySales.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Last 30 days avg
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {coverageDays} days
                              </div>
                              {showForecast && projectedCoverage !== undefined && (
                                <div className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                                  → {projectedCoverage}d
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Lead time: {leadTimeDays}d
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {suggestedOrder > 0 ? suggestedOrder : '—'}
                            </div>
                            {suggestedOrder > 0 && (
                              <div className="text-xs text-gray-500">
                                ${(suggestedOrder * unitCost).toLocaleString()}
                              </div>
                            )}
                          </td>
                          
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              urgency === 'critical' ? 'bg-red-100 text-red-800' :
                              urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                              urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              urgency === 'excess' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {urgency === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {urgency === 'high' && <Clock className="h-3 w-3 mr-1" />}
                              {urgency === 'excess' && <Package className="h-3 w-3 mr-1" />}
                              {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleReorderItem(item)}
                                className={`text-sm font-medium ${
                                  suggestedOrder === 0 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-blue-600 hover:text-blue-800'
                                }`}
                                disabled={suggestedOrder === 0}
                              >
                                Reorder
                              </button>
                              <button
                                onClick={() => {
                                  console.log('View details for:', item.id);
                                }}
                                className="text-sm text-gray-600 hover:text-gray-800"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No products found
                        </h3>
                        <p className="text-gray-500">
                          Try adjusting your search or filters
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {Math.min(10, reorderRecommendations?.length || 0)} of {reorderRecommendations?.length || 0} products
                </div>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  onClick={() => {
                    // Logic to view all recommendations
                    console.log('View all recommendations');
                  }}
                >
                  View all recommendations
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Analytics & Insights */}
        <div className="space-y-8">
          {/* Warehouse Utilization */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Warehouse Utilization</h3>
              <Warehouse className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {warehouseUtilization && warehouseUtilization.length > 0 ? (
                warehouseUtilization.map(warehouse => (
                  <div key={warehouse.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">{warehouse.name}</span>
                      <span className="text-gray-600">{warehouse.utilization}% utilized</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full rounded-full ${
                          warehouse.utilization >= 90 ? 'bg-red-500' :
                          warehouse.utilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${warehouse.utilization}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{warehouse.items} items</span>
                      <span>${warehouse.value.toLocaleString()} value</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No warehouse data available
                </div>
              )}
            </div>
            
            {warehouseUtilization && warehouseUtilization.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>Total Capacity Used</span>
                    <span className="font-medium text-gray-900">
                      {Math.round(warehouseUtilization.reduce((sum, w) => sum + w.utilization, 0) / warehouseUtilization.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Space</span>
                    <span className="font-medium text-green-600">
                      {100 - Math.round(warehouseUtilization.reduce((sum, w) => sum + w.utilization, 0) / warehouseUtilization.length)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Category Distribution</h3>
              <Layers className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {categoryDistribution && categoryDistribution.length > 0 ? (
                categoryDistribution.slice(0, 5).map(category => {
                  const percentage = Math.round((category.count / inventoryData.length) * 100);
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <span className="text-gray-600">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.count} SKUs
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No category data available
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{metrics.lowStockItems}</div>
                  <div className="text-gray-600">Low Stock</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{metrics.outOfStockItems}</div>
                  <div className="text-gray-600">Out of Stock</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{metrics.excessStockItems}</div>
                  <div className="text-gray-600">Excess Stock</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{metrics.totalSKUs}</div>
                  <div className="text-gray-600">Total SKUs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  console.log('Generate forecast report');
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Generate Forecast Report</div>
                    <div className="text-xs text-gray-500">Next 30-60-90 days</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              
              <button 
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  console.log('Create reorder plan');
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg mr-3">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Create Reorder Plan</div>
                    <div className="text-xs text-gray-500">Automated suggestions</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              
              <button 
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  console.log('View performance metrics');
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg mr-3">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">View Performance Metrics</div>
                    <div className="text-xs text-gray-500">Turnover & GMROI</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              
              <button 
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  console.log('Configure alerts');
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-red-50 rounded-lg mr-3">
                    <Settings className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Configure Alerts</div>
                    <div className="text-xs text-gray-500">Low stock notifications</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Performance Metrics */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forecast Accuracy */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Forecast Accuracy</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last 7 Days</span>
              <span className="text-sm font-medium text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last 30 Days</span>
              <span className="text-sm font-medium text-green-600">87.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last 90 Days</span>
              <span className="text-sm font-medium text-yellow-600">82.1%</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span>Mean Absolute Error</span>
                <span className="font-medium text-gray-900">5.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Confidence Interval</span>
                <span className="font-medium text-gray-900">± 8.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Turnover Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Turnover Analysis</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Turnover</span>
              <span className="text-sm font-medium text-green-600">{metrics.turnoverRate}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Industry Average</span>
              <span className="text-sm font-medium text-gray-600">4.2x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Target Turnover</span>
              <span className="text-sm font-medium text-blue-600">6.0x</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span>Days of Inventory</span>
                <span className="font-medium text-gray-900">{metrics.averageCoverageDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GMROI</span>
                <span className="font-medium text-green-600">3.2x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Trends */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Seasonal Trends</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Peak Season</span>
              <span className="text-sm font-medium text-blue-600">Nov - Jan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Increase</span>
              <span className="text-sm font-medium text-green-600">+45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Preparation Timeline</span>
              <span className="text-sm font-medium text-orange-600">60 days</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <div className="mb-2">Top Seasonal Categories:</div>
              <div className="flex flex-wrap gap-2">
                {['Electronics', 'Clothing', 'Toys', 'Home'].map(cat => (
                  <span key={cat} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Inventory Planning Dashboard • Last updated: {new Date().toLocaleString()}</p>
        <p className="mt-1">
          Data refreshes every 15 minutes • 
          <button 
            className="ml-2 text-blue-600 hover:text-blue-800"
            onClick={() => {
              console.log('Configure refresh settings');
            }}
          >
            Configure refresh settings
          </button>
        </p>
      </div>
    </div>
  );
};

export default InventoryPlanning;