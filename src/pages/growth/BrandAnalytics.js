import React, { useState, useMemo } from 'react';
import { 
  FiSearch, FiFilter, FiDownload, FiTrendingUp, FiTrendingDown,
  FiEye, FiShoppingCart, FiDollarSign, FiUsers, FiShare2,
  FiChevronUp, FiChevronDown, FiChevronRight, FiBarChart2,
  FiPieChart, FiGrid, FiList, FiCalendar, FiClock
} from 'react-icons/fi';
import { 
  FaAmazon, FaStar, FaRegStar, FaStarHalfAlt,
  FaFacebook, FaGoogle, FaInstagram, FaTwitter
} from 'react-icons/fa';

const BrandAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('sales');

  // Mock brand data
  const brands = useMemo(() => [
    {
      id: 1,
      name: 'Amazon Basics',
      logo: <FaAmazon className="text-orange-500 text-2xl" />,
      category: 'Electronics & Accessories',
      totalSales: 2548900,
      salesChange: 12.5,
      orders: 45678,
      conversionRate: 4.3,
      conversionChange: 0.8,
      pageViews: 1200456,
      pageViewsChange: 8.2,
      avgOrderValue: 55.89,
      aovChange: 3.2,
      customerCount: 98765,
      customerChange: 5.6,
      rating: 4.5,
      reviews: 23456,
      marketShare: 32.4,
      shareChange: 2.1,
      competitors: ['Anker', 'Belkin', 'Samsung'],
      topProducts: [
        { name: 'AA Batteries (48-pack)', sales: 123456 },
        { name: 'HDMI Cable 6ft', sales: 98765 },
        { name: 'USB-C Cable', sales: 87654 }
      ]
    },
    {
      id: 2,
      name: 'Samsung',
      logo: <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>,
      category: 'Electronics',
      totalSales: 1890200,
      salesChange: -3.2,
      orders: 34567,
      conversionRate: 3.8,
      conversionChange: -0.4,
      pageViews: 890123,
      pageViewsChange: 2.1,
      avgOrderValue: 154.32,
      aovChange: 1.5,
      customerCount: 65432,
      customerChange: -1.2,
      rating: 4.7,
      reviews: 45678,
      marketShare: 24.8,
      shareChange: -1.3,
      competitors: ['LG', 'Sony', 'Apple'],
      topProducts: [
        { name: 'Galaxy S24', sales: 234567 },
        { name: 'QLED TV 65"', sales: 123456 },
        { name: 'Galaxy Watch', sales: 87654 }
      ]
    },
    {
      id: 3,
      name: 'Apple',
      logo: <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white"><span className="text-xs"></span></div>,
      category: 'Electronics',
      totalSales: 3123456,
      salesChange: 18.9,
      orders: 56789,
      conversionRate: 5.2,
      conversionChange: 1.2,
      pageViews: 1567890,
      pageViewsChange: 12.5,
      avgOrderValue: 289.99,
      aovChange: 4.8,
      customerCount: 123456,
      customerChange: 8.9,
      rating: 4.8,
      reviews: 67890,
      marketShare: 45.2,
      shareChange: 3.7,
      competitors: ['Samsung', 'Google', 'Microsoft'],
      topProducts: [
        { name: 'iPhone 15 Pro', sales: 345678 },
        { name: 'MacBook Air', sales: 234567 },
        { name: 'AirPods Pro', sales: 189012 }
      ]
    },
    {
      id: 4,
      name: 'Nike',
      logo: <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">NIKE</div>,
      category: 'Sports & Fitness',
      totalSales: 1456700,
      salesChange: 7.8,
      orders: 43210,
      conversionRate: 3.5,
      conversionChange: 0.3,
      pageViews: 987654,
      pageViewsChange: 5.6,
      avgOrderValue: 87.65,
      aovChange: 2.1,
      customerCount: 76543,
      customerChange: 4.2,
      rating: 4.6,
      reviews: 34567,
      marketShare: 18.9,
      shareChange: 1.5,
      competitors: ['Adidas', 'Puma', 'Under Armour'],
      topProducts: [
        { name: 'Air Force 1', sales: 98765 },
        { name: 'Dri-FIT T-Shirt', sales: 87654 },
        { name: 'Running Shoes', sales: 76543 }
      ]
    },
    {
      id: 5,
      name: 'Sony',
      logo: <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">S</div>,
      category: 'Electronics',
      totalSales: 987654,
      salesChange: 5.6,
      orders: 23456,
      conversionRate: 2.9,
      conversionChange: 0.2,
      pageViews: 654321,
      pageViewsChange: 3.4,
      avgOrderValue: 187.65,
      aovChange: 1.8,
      customerCount: 45678,
      customerChange: 2.3,
      rating: 4.4,
      reviews: 23456,
      marketShare: 12.3,
      shareChange: 0.8,
      competitors: ['Samsung', 'LG', 'Panasonic'],
      topProducts: [
        { name: 'WH-1000XM5 Headphones', sales: 76543 },
        { name: 'PlayStation 5', sales: 65432 },
        { name: 'Alpha Camera', sales: 34567 }
      ]
    },
    {
      id: 6,
      name: 'LG',
      logo: <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">LG</div>,
      category: 'Home Appliances',
      totalSales: 876543,
      salesChange: -2.1,
      orders: 19876,
      conversionRate: 2.7,
      conversionChange: -0.5,
      pageViews: 543210,
      pageViewsChange: -1.2,
      avgOrderValue: 234.56,
      aovChange: -0.8,
      customerCount: 34567,
      customerChange: -2.4,
      rating: 4.3,
      reviews: 19876,
      marketShare: 10.8,
      shareChange: -0.9,
      competitors: ['Samsung', 'Whirlpool', 'GE'],
      topProducts: [
        { name: 'OLED TV 55"', sales: 65432 },
        { name: 'Refrigerator', sales: 34567 },
        { name: 'Washing Machine', sales: 23456 }
      ]
    }
  ], []);

  // Performance metrics over time (for charts)
  const performanceData = useMemo(() => [
    { month: 'Jan', sales: 1200000, orders: 21000, aov: 57.14 },
    { month: 'Feb', sales: 1350000, orders: 23000, aov: 58.70 },
    { month: 'Mar', sales: 1450000, orders: 24500, aov: 59.18 },
    { month: 'Apr', sales: 1650000, orders: 26500, aov: 62.26 },
    { month: 'May', sales: 1850000, orders: 28500, aov: 64.91 },
    { month: 'Jun', sales: 2100000, orders: 31000, aov: 67.74 },
    { month: 'Jul', sales: 1950000, orders: 29500, aov: 66.10 },
    { month: 'Aug', sales: 2250000, orders: 32500, aov: 69.23 },
    { month: 'Sep', sales: 2400000, orders: 34500, aov: 69.57 },
    { month: 'Oct', sales: 2650000, orders: 37500, aov: 70.67 },
    { month: 'Nov', sales: 3100000, orders: 42500, aov: 72.94 },
    { month: 'Dec', sales: 3800000, orders: 51000, aov: 74.51 }
  ], []);

  // Traffic sources data
  const trafficSources = useMemo(() => [
    { source: 'Amazon Search', percentage: 45, change: 2.1 },
    { source: 'Direct', percentage: 18, change: 0.8 },
    { source: 'Social Media', percentage: 12, change: 1.5 },
    { source: 'Email Marketing', percentage: 10, change: 0.3 },
    { source: 'External Referrals', percentage: 8, change: -0.5 },
    { source: 'Sponsored Products', percentage: 7, change: 1.8 }
  ], []);

  // Filter and sort brands
  const filteredBrands = useMemo(() => {
    let result = [...brands];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(brand => 
        brand.name.toLowerCase().includes(query) ||
        brand.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'sales':
          return b.totalSales - a.totalSales;
        case 'growth':
          return b.salesChange - a.salesChange;
        case 'orders':
          return b.orders - a.orders;
        case 'conversion':
          return b.conversionRate - a.conversionRate;
        default:
          return 0;
      }
    });
    
    return result;
  }, [brands, searchQuery, sortBy]);

  // Overall metrics summary
  const overallMetrics = useMemo(() => {
    return {
      totalSales: brands.reduce((sum, brand) => sum + brand.totalSales, 0),
      totalOrders: brands.reduce((sum, brand) => sum + brand.orders, 0),
      avgConversionRate: brands.reduce((sum, brand) => sum + brand.conversionRate, 0) / brands.length,
      totalCustomers: brands.reduce((sum, brand) => sum + brand.customerCount, 0)
    };
  }, [brands]);

  // Custom bar chart component
  const SalesTrendChart = () => {
    const maxSales = Math.max(...performanceData.map(d => d.sales));
    
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Sales Trend</h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
              <span className="text-gray-600">Sales</span>
            </div>
          </div>
        </div>
        <div className="h-64 flex items-end space-x-2 px-2">
          {performanceData.map((data, index) => {
            const height = (data.sales / maxSales) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center">
                  <div 
                    className="w-10 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                      ${(data.sales / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 font-medium">
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Custom pie chart for traffic sources
  const TrafficSourcesChart = () => {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
        <div className="space-y-4">
          {trafficSources.map((source, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm text-gray-600 truncate">
                {source.source}
              </div>
              <div className="flex-1 ml-4">
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 w-16 text-right">
                <div className="text-sm font-semibold">{source.percentage}%</div>
                <div className={`text-xs ${source.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {source.change >= 0 ? '+' : ''}{source.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300 text-sm" />);
    }
    
    return (
      <div className="flex items-center">
        <div className="flex">
          {stars}
        </div>
        <span className="ml-2 text-sm font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Brand detail modal
  const BrandDetailModal = ({ brand, onClose }) => {
    if (!brand) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {brand.logo}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{brand.name}</h2>
                <p className="text-gray-600">{brand.category}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(brand.totalSales / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <FiDollarSign className="text-3xl text-blue-600" />
                </div>
                <div className={`mt-2 flex items-center ${brand.salesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {brand.salesChange >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  <span className="ml-2 text-sm font-medium">
                    {brand.salesChange >= 0 ? '+' : ''}{brand.salesChange}% from last period
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {brand.conversionRate}%
                    </p>
                  </div>
                  <FiShoppingCart className="text-3xl text-purple-600" />
                </div>
                <div className={`mt-2 flex items-center ${brand.conversionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {brand.conversionChange >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  <span className="ml-2 text-sm font-medium">
                    {brand.conversionChange >= 0 ? '+' : ''}{brand.conversionChange}%
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Market Share</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {brand.marketShare}%
                    </p>
                  </div>
                  <FiUsers className="text-3xl text-green-600" />
                </div>
                <div className={`mt-2 flex items-center ${brand.shareChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {brand.shareChange >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  <span className="ml-2 text-sm font-medium">
                    {brand.shareChange >= 0 ? '+' : ''}{brand.shareChange}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Top Products */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {brand.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-800">{product.name}</span>
                    </div>
                    <div className="text-gray-900 font-semibold">
                      ${(product.sales / 1000).toFixed(0)}K sales
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Competitors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Competitors</h3>
              <div className="flex flex-wrap gap-2">
                {brand.competitors.map((competitor, index) => (
                  <span key={index} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-50 p-4 border-t flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <FiDownload className="mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brand Analytics</h1>
              <p className="text-gray-600 mt-2">Monitor brand performance and market insights</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <FiFilter className="mr-2" />
                Filters
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <FiDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(overallMetrics.totalSales / 1000000).toFixed(1)}M
                  </p>
                </div>
                <FiDollarSign className="text-3xl text-blue-600" />
              </div>
              <div className="mt-2 flex items-center text-green-600">
                <FiTrendingUp />
                <span className="ml-2 text-sm">+8.4% from last period</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallMetrics.totalOrders.toLocaleString()}
                  </p>
                </div>
                <FiShoppingCart className="text-3xl text-purple-600" />
              </div>
              <div className="mt-2 flex items-center text-green-600">
                <FiTrendingUp />
                <span className="ml-2 text-sm">+5.2% from last period</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallMetrics.avgConversionRate.toFixed(1)}%
                  </p>
                </div>
                <FiTrendingUp className="text-3xl text-green-600" />
              </div>
              <div className="mt-2 flex items-center text-green-600">
                <FiTrendingUp />
                <span className="ml-2 text-sm">+1.1% from last period</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallMetrics.totalCustomers.toLocaleString()}
                  </p>
                </div>
                <FiUsers className="text-3xl text-orange-600" />
              </div>
              <div className="mt-2 flex items-center text-green-600">
                <FiTrendingUp />
                <span className="ml-2 text-sm">+3.8% from last period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="last90days">Last 90 days</option>
                <option value="lastYear">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              
              {/* Sort By */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="sales">Sales Volume</option>
                <option value="growth">Growth Rate</option>
                <option value="orders">Number of Orders</option>
                <option value="conversion">Conversion Rate</option>
              </select>
              
              {/* View Toggle */}
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
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2">
            {/* Sales Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <SalesTrendChart />
            </div>
            
            {/* Traffic Sources */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <TrafficSourcesChart />
            </div>
          </div>
          
          {/* Right Column - Brands List */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Brand Performance</h3>
                <p className="text-sm text-gray-600">Top performing brands</p>
              </div>
              
              {/* Brands List */}
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredBrands.map((brand) => (
                  <div 
                    key={brand.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedBrand(brand)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {brand.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 truncate">{brand.name}</h4>
                          <span className="text-sm font-bold text-blue-600">
                            ${(brand.totalSales / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{brand.category}</p>
                        
                        {/* Metrics Row */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Growth</p>
                            <div className={`flex items-center text-sm font-medium ${brand.salesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {brand.salesChange >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                              {brand.salesChange >= 0 ? '+' : ''}{brand.salesChange}%
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Orders</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {brand.orders.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Conversion</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {brand.conversionRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Rating</p>
                            {renderStars(brand.rating)}
                          </div>
                        </div>
                      </div>
                      <FiChevronRight className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mt-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Market Leader</span>
                  <span className="font-semibold">Apple (45.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fastest Growing</span>
                  <span className="font-semibold">Apple (+18.9%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Highest Conversion</span>
                  <span className="font-semibold">Apple (5.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Best Rated</span>
                  <span className="font-semibold">Apple (4.8★)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Brand Detail Modal */}
      {selectedBrand && (
        <BrandDetailModal 
          brand={selectedBrand} 
          onClose={() => setSelectedBrand(null)} 
        />
      )}
    </div>
  );
};

export default BrandAnalytics;