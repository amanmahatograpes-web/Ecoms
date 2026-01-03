import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  ArrowUpRight as TrendingUp,
  ArrowDownRight as TrendingDown,
  BarChart3,
  Filter,
  Search,
  Download,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Percent,
  Package,
  ShoppingCart,
  Target,
  Zap,
  Eye,
  Edit,
  Copy,
  MoreVertical,
  ChevronRight,
  Calendar,
  Users,
  Star,
  Award,
  LineChart,
  PieChart,
  Brain,
  Clock,
  Tag,
  Shield,
  Rocket,
  ChevronUp,
  ChevronDown,
  Activity,
  DollarSign as DollarIcon,
  Percent as PercentIcon,
  Package as PackageIcon,
  ShoppingBag,
  Layers,
  Grid,
  List,
  BarChart,
  PieChart as PieChartIcon,
  DownloadCloud,
  Upload,
  Check,
  X,
  AlertCircle,
  Info,
  HelpCircle,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Menu
} from "lucide-react";

// Import the ApiService
import apiService from '../../services/api.service';

// Also import the specific product API functions if needed
const API_BASE_URL = 'http://localhost:8000/api';

const GrapesKartPricingDashboard = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    margin: 'all',
    category: 'all',
    sort: 'profitMargin',
    autoPricing: 'all',
    view: 'grid',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  });
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkPriceChange, setBulkPriceChange] = useState({
    type: 'percentage',
    value: 0,
    operation: 'increase'
  });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setShowMobileFilters(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch pricing data
  useEffect(() => {
    fetchPricingData();
    fetchAnalytics();
  }, [filters, pagination.page]);

  // Fetch pricing data using ApiService
  const fetchPricingData = async () => {
    try {
      setLoading(true);
      
      // Prepare query parameters
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      // Remove empty search
      if (!filters.search) {
        delete params.search;
      }
      
      // Use ApiService to make the request
      const response = await apiService.client.post('/pricing/dashboard', params);
      
      if (response.success) {
        setPricingData(response.data || []);
        setSummary(response.summary);
        setPagination(response.pagination || pagination);
      } else {
        console.error('Error fetching pricing data:', response.message);
        // Fallback to mock data or show error
        loadMockData();
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      // Fallback to mock data
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data function
  const loadMockData = () => {
    const mockProducts = Array.from({ length: 20 }, (_, i) => ({
      _id: `product_${i + 1}`,
      sku: `SKU-${1000 + i}`,
      productName: `Product ${i + 1}`,
      listPrice: Math.random() * 100 + 20,
      salePrice: Math.random() > 0.5 ? Math.random() * 80 + 10 : null,
      costPrice: Math.random() * 50 + 10,
      profitMargin: Math.random() * 50 - 10, // Some negative margins
      profitAmount: Math.random() * 40 - 5,
      roi: Math.random() * 100,
      pricingStatus: ['competitive', 'high', 'low', 'no_competition'][Math.floor(Math.random() * 4)],
      competitorCount: Math.floor(Math.random() * 10),
      lowestCompetitorPrice: Math.random() * 90 + 15,
      priceDifference: Math.random() * 30 - 15,
      autoPricingEnabled: Math.random() > 0.5,
      productId: {
        name: `Product ${i + 1}`,
        images: [`https://via.placeholder.com/150?text=Product+${i + 1}`],
        category: ['Electronics', 'Clothing', 'Home', 'Books'][Math.floor(Math.random() * 4)]
      },
      fbaFees: {
        totalFees: Math.random() * 10 + 2
      },
      isBuyBoxWinner: Math.random() > 0.7,
      recommendedPrice: Math.random() * 100 + 20
    }));

    setPricingData(mockProducts);
    setSummary({
      avgPrice: 75.50,
      avgMargin: 25.3,
      totalProducts: 100,
      competitiveProducts: 68,
      autoPricingCount: 45,
      marginDistribution: [
        { _id: -100, count: 5 },
        { _id: 0, count: 15 },
        { _id: 10, count: 25 },
        { _id: 20, count: 35 },
        { _id: 30, count: 15 },
        { _id: 40, count: 5 }
      ]
    });
    setPagination({
      page: 1,
      limit: 50,
      total: 100,
      pages: 2
    });
  };

  // Fetch analytics using ApiService
  const fetchAnalytics = async () => {
    try {
      const response = await apiService.client.get('/pricing/analytics?period=month');
      if (response.success) {
        setAnalytics(response.data);
      } else {
        // Load mock analytics
        loadMockAnalytics();
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      loadMockAnalytics();
    }
  };

  // Mock analytics data
  const loadMockAnalytics = () => {
    setAnalytics({
      marginByCategory: [
        { _id: 'Electronics', avgMargin: 28.5, totalRevenue: 125000 },
        { _id: 'Clothing', avgMargin: 42.3, totalRevenue: 89000 },
        { _id: 'Home', avgMargin: 35.7, totalRevenue: 75000 },
        { _id: 'Books', avgMargin: 15.2, totalRevenue: 32000 }
      ],
      priceChanges: [
        { date: '2024-01-01', avgPrice: 72.5 },
        { date: '2024-01-02', avgPrice: 73.2 },
        { date: '2024-01-03', avgPrice: 74.8 },
        { date: '2024-01-04', avgPrice: 75.5 }
      ],
      competitorAnalysis: [
        { _id: 'Amazon', count: 245, avgPriceDiff: -2.5 },
        { _id: 'Walmart', count: 189, avgPriceDiff: 3.2 },
        { _id: 'Target', count: 156, avgPriceDiff: 5.1 },
        { _id: 'BestBuy', count: 98, avgPriceDiff: -1.8 }
      ]
    });
  };

  // Handle product selection
  const handleSelectProduct = (product, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, product]);
    } else {
      setSelectedProducts(prev => prev.filter(p => p._id !== product._id));
    }
  };

  // Select all products
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(pricingData);
    } else {
      setSelectedProducts([]);
    }
  };

  // Apply bulk price change using ApiService
  const applyBulkPriceChange = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to update');
      return;
    }

    try {
      const updates = selectedProducts.map(product => {
        let newPrice = product.listPrice;
        
        if (bulkPriceChange.type === 'percentage') {
          const change = product.listPrice * (bulkPriceChange.value / 100);
          newPrice = bulkPriceChange.operation === 'increase' 
            ? product.listPrice + change 
            : product.listPrice - change;
        } else {
          newPrice = bulkPriceChange.operation === 'increase'
            ? product.listPrice + bulkPriceChange.value
            : product.listPrice - bulkPriceChange.value;
        }
        
        // Round to 2 decimal places
        newPrice = Math.round(newPrice * 100) / 100;
        
        return {
          id: product._id,
          price: newPrice
        };
      });

      const response = await apiService.client.put('/pricing/bulk', {
        updates,
        priceType: 'list',
        reason: `Bulk ${bulkPriceChange.operation} by ${bulkPriceChange.value}${bulkPriceChange.type === 'percentage' ? '%' : '$'}`
      });

      if (response.success) {
        alert(`Updated ${response.data.updated.length} prices`);
        setBulkEditMode(false);
        setSelectedProducts([]);
        fetchPricingData();
      } else {
        alert(response.message || 'Failed to update prices');
      }
    } catch (error) {
      console.error('Error applying bulk change:', error);
      alert('Failed to update prices. Please try again.');
    }
  };

  // Update single price using ApiService
  const updateProductPrice = async (productId, newPrice) => {
    try {
      const response = await apiService.client.put(`/pricing/${productId}/price`, {
        price: newPrice,
        priceType: 'list',
        reason: 'Manual price update'
      });

      if (response.success) {
        fetchPricingData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating price:', error);
      return false;
    }
  };

  // Export data using ApiService
  const exportData = async (format = 'csv') => {
    try {
      const response = await apiService.client.post('/pricing/export', {
        format,
        filters
      });

      if (response.success && response.data?.url) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = `pricing_export_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Export failed: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'competitive': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'no_competition': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get margin color
  const getMarginColor = (margin) => {
    if (margin < 0) return 'text-red-600';
    if (margin < 10) return 'text-orange-600';
    if (margin < 25) return 'text-yellow-600';
    if (margin < 50) return 'text-green-600';
    return 'text-emerald-600';
  };

  // Get margin badge color
  const getMarginBadgeColor = (margin) => {
    if (margin < 0) return 'bg-red-100 text-red-800';
    if (margin < 10) return 'bg-orange-100 text-orange-800';
    if (margin < 25) return 'bg-yellow-100 text-yellow-800';
    if (margin < 50) return 'bg-green-100 text-green-800';
    return 'bg-emerald-100 text-emerald-800';
  };

  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${parseFloat(value).toFixed(1)}%`;
  };

  // Loading skeleton
  if (loading && !pricingData.length) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 sm:w-1/4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 sm:h-28 md:h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-14 sm:h-16 bg-gray-200 rounded"></div>
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
        <div className="fixed top-4 right-4 z-50 flex space-x-2">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="p-2 bg-white rounded-lg shadow-lg"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white rounded-lg shadow-lg"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-3">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
              Amazon-Style Pricing
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">
              Dynamic pricing & competitor tracking for GrapesKart
            </p>
          </div>
          
          <div className={`flex items-center space-x-2 sm:space-x-3 ${mobileMenuOpen ? 'flex' : 'hidden sm:flex'}`}>
            <button
              onClick={() => setFilters({...filters, view: filters.view === 'grid' ? 'list' : 'grid'})}
              className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
            >
              {filters.view === 'grid' ? <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> : <Grid className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
              <span className="hidden xs:inline">{filters.view === 'grid' ? 'List' : 'Grid'}</span>
            </button>
            
            <button
              onClick={fetchPricingData}
              className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Summary Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Average Price */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="p-1.5 sm:p-2 md:p-3 bg-blue-50 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                +2.4%
              </span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {formatPrice(summary?.avgPrice)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Avg Price</div>
            <div className="mt-2 text-xs text-gray-500 truncate">
              {summary?.totalProducts || 0} products
            </div>
          </div>

          {/* Average Margin */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="p-1.5 sm:p-2 md:p-3 bg-green-50 rounded-lg">
                <Percent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <span className={`text-xs sm:text-sm font-medium flex items-center ${
                (summary?.avgMargin || 0) >= 20 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {(summary?.avgMargin || 0) >= 20 ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                )}
                {formatPercentage(summary?.avgMargin)}
              </span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              {formatPercentage(summary?.avgMargin)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Avg Margin</div>
            <div className="mt-2 w-full">
              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
                <div 
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, summary?.avgMargin || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Competitive Products */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="p-1.5 sm:p-2 md:p-3 bg-purple-50 rounded-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                +12.5%
              </span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              {summary?.competitiveProducts || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Competitive</div>
            <div className="mt-2 text-xs text-gray-500">
              {summary?.totalProducts ? Math.round((summary.competitiveProducts / summary.totalProducts) * 100) : 0}% of total
            </div>
          </div>

          {/* Auto-Pricing */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="p-1.5 sm:p-2 md:p-3 bg-orange-50 rounded-lg">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-blue-600 flex items-center">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {summary?.autoPricingCount || 0}
              </span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              {summary?.autoPricingCount || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Auto-Pricing</div>
            <div className="mt-2 text-xs text-gray-500">
              {summary?.totalProducts ? Math.round((summary.autoPricingCount / summary.totalProducts) * 100) : 0}% automated
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions - Responsive */}
        <div className={`bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6 ${
          (showMobileFilters || !isMobile) ? 'block' : 'hidden'
        }`}>
          {/* Mobile Filter Toggle */}
          {isMobile && !showMobileFilters && (
            <button
              onClick={() => setShowMobileFilters(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 mb-3"
            >
              <Filter className="h-4 w-4 mr-2" />
              Show Filters
            </button>
          )}

          <div className={`${isMobile && !showMobileFilters ? 'hidden' : 'block'}`}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
              {/* Status Filter */}
              <div className="w-full sm:w-auto min-w-[140px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="competitive">Competitive</option>
                  <option value="high">High Priced</option>
                  <option value="low">Low Priced</option>
                  <option value="no_competition">No Competition</option>
                </select>
              </div>

              {/* Margin Filter */}
              <div className="w-full sm:w-auto min-w-[140px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">Margin</label>
                <select
                  value={filters.margin}
                  onChange={(e) => setFilters({...filters, margin: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Margins</option>
                  <option value="negative">Negative</option>
                  <option value="low">Low (0-10%)</option>
                  <option value="medium">Medium (10-25%)</option>
                  <option value="high">High (25-50%)</option>
                  <option value="very_high">Very High (50%+)</option>
                </select>
              </div>

              {/* Auto-Pricing Filter */}
              <div className="w-full sm:w-auto min-w-[140px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">Auto-Pricing</label>
                <select
                  value={filters.autoPricing}
                  onChange={(e) => setFilters({...filters, autoPricing: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="w-full sm:w-auto min-w-[140px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({...filters, sort: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="profitMargin">Profit Margin</option>
                  <option value="price">Price</option>
                  <option value="competitiveness">Competitiveness</option>
                  <option value="sales">Sales Volume</option>
                  <option value="margin">Absolute Margin</option>
                </select>
              </div>

              {/* Search and Bulk Actions */}
              <div className="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row gap-3 mt-2 sm:mt-0">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search SKU..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="pl-8 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button
                  onClick={() => setBulkEditMode(!bulkEditMode)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    bulkEditMode
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Bulk Edit
                </button>
              </div>

              {/* Close Mobile Filters Button */}
              {isMobile && showMobileFilters && (
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 mt-2"
                >
                  Close Filters
                </button>
              )}
            </div>

            {/* Bulk Edit Panel */}
            {bulkEditMode && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900 text-sm sm:text-base">Bulk Price Edit</h3>
                    <span className="ml-2 text-xs sm:text-sm text-blue-700">
                      ({selectedProducts.length} selected)
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear Selection
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
                  {/* Change Type */}
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Change Type</label>
                    <select
                      value={bulkPriceChange.type}
                      onChange={(e) => setBulkPriceChange({...bulkPriceChange, type: e.target.value})}
                      className="w-full sm:w-auto text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  
                  {/* Operation */}
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Operation</label>
                    <select
                      value={bulkPriceChange.operation}
                      onChange={(e) => setBulkPriceChange({...bulkPriceChange, operation: e.target.value})}
                      className="w-full sm:w-auto text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="increase">Increase</option>
                      <option value="decrease">Decrease</option>
                    </select>
                  </div>
                  
                  {/* Value Input */}
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Value ({bulkPriceChange.type === 'percentage' ? '%' : '$'})
                    </label>
                    <input
                      type="number"
                      value={bulkPriceChange.value}
                      onChange={(e) => setBulkPriceChange({...bulkPriceChange, value: parseFloat(e.target.value) || 0})}
                      className="w-full sm:w-24 text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step={bulkPriceChange.type === 'percentage' ? 0.1 : 0.01}
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                      onClick={applyBulkPriceChange}
                      disabled={selectedProducts.length === 0}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        selectedProducts.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Apply
                    </button>
                    
                    <button
                      onClick={() => setBulkEditMode(false)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Pricing Table - Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="max-w-full overflow-hidden">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                    Product Pricing
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">
                    Manage prices, margins, and competitors
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                  <button 
                    onClick={() => exportData('csv')}
                    className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="sm:hidden">
                {pricingData.map((product) => (
                  <div 
                    key={product._id}
                    className={`p-3 border-b border-gray-200 ${
                      selectedProducts.some(p => p._id === product._id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedProducts.some(p => p._id === product._id)}
                          onChange={(e) => handleSelectProduct(product, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        
                        {product.productId?.images?.[0] && (
                          <img
                            src={product.productId.images[0]}
                            alt={product.productName}
                            className="h-8 w-8 rounded-lg object-cover border border-gray-200 mr-2"
                          />
                        )}
                        
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-gray-900 truncate">
                            {product.productName || product.productId?.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                        product.pricingStatus === 'competitive' ? 'bg-green-100 text-green-800' :
                        product.pricingStatus === 'high' ? 'bg-red-100 text-red-800' :
                        product.pricingStatus === 'low' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.pricingStatus.charAt(0).toUpperCase() + product.pricingStatus.slice(1)}
                      </span>
                    </div>
                    
                    {/* Product Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pl-9">
                      <div>
                        <div className="text-gray-600">Price:</div>
                        <div className="font-bold text-gray-900">{formatPrice(product.listPrice)}</div>
                      </div>
                      
                      <div>
                        <div className="text-gray-600">Cost:</div>
                        <div className="font-medium text-gray-900">{formatPrice(product.costPrice)}</div>
                      </div>
                      
                      <div>
                        <div className="text-gray-600">Margin:</div>
                        <div className={`font-bold ${getMarginColor(product.profitMargin)}`}>
                          {formatPercentage(product.profitMargin)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-600">Competitors:</div>
                        <div className="font-medium text-gray-900">{product.competitorCount || 0}</div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mt-3 pl-9">
                      <button
                        onClick={() => {
                          setSelectedProductId(product._id);
                          setShowRecommendations(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Recommendations"
                      >
                        <Brain className="h-3 w-3" />
                      </button>
                      
                      <button
                        onClick={async () => {
                          const newPrice = prompt('New price:', product.listPrice);
                          if (newPrice && !isNaN(newPrice)) {
                            const success = await updateProductPrice(product._id, parseFloat(newPrice));
                            if (success) {
                              alert('Price updated');
                            }
                          }
                        }}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Edit price"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      
                      <button className="p-1 text-gray-600 hover:text-gray-800">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet+ Table View */}
              <table className="hidden sm:table w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === pricingData.length && pricingData.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3 sm:h-4 sm:w-4"
                      />
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Product
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Current Price
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Cost
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Margin
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Competitors
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pricingData.map((product) => (
                    <tr 
                      key={product._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedProducts.some(p => p._id === product._id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.some(p => p._id === product._id)}
                          onChange={(e) => handleSelectProduct(product, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3 sm:h-4 sm:w-4"
                        />
                      </td>
                      
                      <td className="px-3 sm:px-4 md:px-6 py-3">
                        <div className="flex items-center min-w-0">
                          {product.productId?.images?.[0] && (
                            <img
                              src={product.productId.images[0]}
                              alt={product.productName}
                              className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg object-cover border border-gray-200 mr-2 sm:mr-3"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                              {product.productName || product.productId?.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[80px] sm:max-w-[100px]">
                              {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3">
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-bold text-gray-900">
                            {formatPrice(product.listPrice)}
                          </div>
                          {product.salePrice && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.salePrice)}
                            </div>
                          )}
                          {product.recommendedPrice && product.recommendedPrice !== product.listPrice && (
                            <div className="text-xs text-blue-600">
                              → {formatPrice(product.recommendedPrice)}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3">
                        <div className="text-xs sm:text-sm text-gray-900">
                          {formatPrice(product.costPrice)}
                        </div>
                        {product.fbaFees?.totalFees && (
                          <div className="text-xs text-gray-500">
                            Fees: {formatPrice(product.fbaFees.totalFees)}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-3 sm:px-4 md:px-6 py-3">
                        <div className="space-y-1">
                          <div className={`text-xs sm:text-sm font-bold ${getMarginColor(product.profitMargin)}`}>
                            {formatPercentage(product.profitMargin)}
                          </div>
                          <div className="text-xs text-gray-900">
                            {formatPrice(product.profitAmount)}
                          </div>
                          {product.roi && (
                            <div className="text-xs text-gray-500">
                              ROI: {formatPercentage(product.roi)}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center text-xs sm:text-sm">
                            <span className="text-gray-900 mr-2">
                              {formatPrice(product.lowestCompetitorPrice)}
                            </span>
                            {product.priceDifference !== undefined && (
                              <span className={`text-xs ${
                                product.priceDifference > 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {product.priceDifference > 0 ? '+' : ''}{product.priceDifference.toFixed(1)}%
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.competitorCount || 0} competitors
                          </div>
                          {product.isBuyBoxWinner && (
                            <div className="text-xs text-green-600 flex items-center">
                              <Award className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              Buy Box
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-3 sm:px-4 md:px-6 py-3">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            product.pricingStatus === 'competitive' ? 'bg-green-100 text-green-800' :
                            product.pricingStatus === 'high' ? 'bg-red-100 text-red-800' :
                            product.pricingStatus === 'low' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.pricingStatus === 'competitive' && <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />}
                            {product.pricingStatus === 'high' && <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />}
                            {product.pricingStatus === 'low' && <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />}
                            {product.pricingStatus.charAt(0).toUpperCase() + product.pricingStatus.slice(1)}
                          </span>
                          
                          {product.autoPricingEnabled && (
                            <div className="text-xs text-blue-600 flex items-center">
                              <Zap className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              Auto
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-3 sm:px-4 md:px-6 py-3">
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProductId(product._id);
                              setShowRecommendations(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Get recommendations"
                          >
                            <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          
                          <button
                            onClick={async () => {
                              const newPrice = prompt('Enter new price:', product.listPrice);
                              if (newPrice && !isNaN(newPrice)) {
                                const success = await updateProductPrice(product._id, parseFloat(newPrice));
                                if (success) {
                                  alert('Price updated');
                                }
                              }
                            }}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Edit price"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          
                          <button className="text-gray-600 hover:text-gray-800 p-1">
                            <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {pricingData.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                    No products found
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-3 sm:px-4 md:px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                      disabled={pagination.page === 1}
                      className={`px-2 sm:px-3 py-1 rounded text-xs ${
                        pagination.page === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Prev
                    </button>
                    
                    {Array.from({ length: Math.min(3, pagination.pages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination({...pagination, page: pageNum})}
                          className={`px-2 sm:px-3 py-1 rounded text-xs ${
                            pagination.page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {pagination.pages > 3 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    
                    <button
                      onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                      disabled={pagination.page === pagination.pages}
                      className={`px-2 sm:px-3 py-1 rounded text-xs ${
                        pagination.page === pagination.pages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel - Analytics & Actions */}
        <div className="space-y-4 sm:space-y-6">
          {/* Pricing Analytics */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Pricing Analytics</h3>
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            
            {analytics && (
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Total Revenue</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      ${analytics.marginByCategory?.reduce((sum, cat) => sum + (cat.totalRevenue || 0), 0).toLocaleString() || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Avg. Price</span>
                    <span className="text-xs sm:text-sm font-medium text-blue-600">
                      {formatPrice(analytics.priceChanges?.[analytics.priceChanges.length - 1]?.avgPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Top Competitor</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px]">
                      {analytics.competitorAnalysis?.[0]?._id || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Margin by Category</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {analytics.marginByCategory?.slice(0, 3).map(category => (
                      <div key={category._id} className="space-y-1">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-medium text-gray-900 truncate max-w-[80px] sm:max-w-full">{category._id}</span>
                          <span className="text-gray-600">{category.avgMargin?.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${Math.min(100, category.avgMargin || 0)}%` }}
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
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">Auto-Repricing</div>
                    <div className="text-xs text-gray-500 hidden sm:block">Apply rules to all</div>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => exportData('pdf')}
                className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
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
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">Configure Rules</div>
                    <div className="text-xs text-gray-500 hidden sm:block">Manage rules</div>
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
                    <div className="text-xs text-gray-500 hidden sm:block">Monitoring alerts</div>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Margin Distribution */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Margin Distribution</h3>
            
            {summary?.marginDistribution && (
              <div className="space-y-3 sm:space-y-4">
                {summary.marginDistribution.slice(0, 4).map((range, index) => {
                  const percentage = (range.count / summary.totalProducts) * 100;
                  let label = '';
                  
                  if (range._id === -100) label = 'Negative';
                  else if (range._id === 0) label = '0-10%';
                  else if (range._id === 10) label = '10-20%';
                  else if (range._id === 20) label = '20%+';
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-medium text-gray-900 truncate max-w-[60px] sm:max-w-full">{label}</span>
                        <span className="text-gray-600">{range.count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className={`h-full rounded-full ${
                            range._id === -100 ? 'bg-red-500' :
                            range._id === 0 ? 'bg-orange-500' :
                            range._id === 10 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Recommendations Modal */}
      {showRecommendations && selectedProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Price Recommendations</h3>
                <button
                  onClick={() => {
                    setShowRecommendations(false);
                    setSelectedProductId(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 mt-0.5" />
                    <p className="text-xs sm:text-sm text-blue-700">
                      AI-powered price recommendations based on competitor analysis and profit optimization.
                    </p>
                  </div>
                </div>
                
                {/* Add actual recommendations here */}
                <div className="space-y-3">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900">Recommendations for SKU-1001</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Optimized Price</div>
                      <div className="text-lg font-bold text-gray-900">$79.99</div>
                      <div className="text-xs text-gray-600">Expected margin: 32.5%</div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Competitor Avg</div>
                      <div className="text-lg font-bold text-gray-900">$75.50</div>
                      <div className="text-xs text-gray-600">5 competitors found</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-2">
        <p className="truncate">GrapesKart Pricing • Dynamic pricing • Last updated: {new Date().toLocaleTimeString()}</p>
        <p className="mt-1">
          Real-time tracking • 
          <button className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
            Configure repricing
          </button>
        </p>
      </div>
    </div>
  );
};

export default GrapesKartPricingDashboard;