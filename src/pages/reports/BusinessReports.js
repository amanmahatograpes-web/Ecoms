import React, { useState, useMemo } from 'react';
import { 
  FiDownload, FiFilter, FiCalendar, FiTrendingUp, 
  FiTrendingDown, FiDollarSign, FiShoppingCart, FiUsers,
  FiPackage, FiGlobe, FiCreditCard, FiBarChart2,
  FiPieChart, FiGrid, FiList, FiChevronDown, FiChevronUp,
  FiEye, FiShare2, FiPrinter, FiRefreshCw, FiSettings,
  FiAlertCircle, FiCheckCircle, FiClock, FiStar,
  FiArrowUpRight, FiArrowDownRight, FiMaximize2,
  FiMenu, FiX
} from 'react-icons/fi';
import { 
  FaRegChartBar, FaChartLine, FaChartPie,
  FaMapMarkerAlt, FaRegCalendarAlt, FaFilter,
  FaSortAmountDown, FaSortAmountUp, FaCrown
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const BusinessReports = () => {
  const [timeRange, setTimeRange] = useState('last30days');
  const [reportType, setReportType] = useState('sales');
  const [viewMode, setViewMode] = useState('dashboard');
  const [selectedMetrics, setSelectedMetrics] = useState(['sales', 'orders', 'customers', 'conversion']);
  const [compareMode, setCompareMode] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [reportSchedule, setReportSchedule] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Responsive breakpoints
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last7days', label: 'Last 7 Days' },
    { id: 'last30days', label: 'Last 30 Days' },
    { id: 'last90days', label: 'Last 90 Days' },
    { id: 'lastYear', label: 'Last Year' },
    { id: 'monthToDate', label: 'Month to Date' },
    { id: 'yearToDate', label: 'Year to Date' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const reportTypes = [
    { id: 'sales', label: 'Sales', icon: <FiDollarSign /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingCart /> },
    { id: 'customers', label: 'Customers', icon: <FiUsers /> },
    { id: 'inventory', label: 'Inventory', icon: <FiPackage /> },
    { id: 'traffic', label: 'Traffic', icon: <FiGlobe /> },
    { id: 'advertising', label: 'Ads', icon: <FiBarChart2 /> },
    { id: 'financial', label: 'Financial', icon: <FiCreditCard /> },
  ];

  const metrics = [
    { id: 'sales', label: 'Total Sales', value: '$124,567.89', change: 12.5, isPositive: true, icon: <FiDollarSign /> },
    { id: 'orders', label: 'Total Orders', value: '1,234', change: 8.2, isPositive: true, icon: <FiShoppingCart /> },
    { id: 'customers', label: 'New Customers', value: '456', change: 15.3, isPositive: true, icon: <FiUsers /> },
    { id: 'conversion', label: 'Conversion Rate', value: '4.3%', change: 0.8, isPositive: true, icon: <FiTrendingUp /> },
    { id: 'aov', label: 'Avg Order Value', value: '$102.45', change: -2.1, isPositive: false, icon: <FiCreditCard /> },
    { id: 'refunds', label: 'Refund Rate', value: '1.2%', change: -0.3, isPositive: true, icon: <FiArrowDownRight /> },
    { id: 'traffic', label: 'Total Traffic', value: '45,678', change: 5.6, isPositive: true, icon: <FiGlobe /> },
    { id: 'reviews', label: 'Avg. Rating', value: '4.7', change: 0.1, isPositive: true, icon: <FiStar /> },
  ];

  const salesData = useMemo(() => [
    { date: 'Jan', sales: 85000, orders: 1500, aov: 56.67 },
    { date: 'Feb', sales: 92000, orders: 1650, aov: 55.76 },
    { date: 'Mar', sales: 105000, orders: 1850, aov: 56.76 },
    { date: 'Apr', sales: 98000, orders: 1720, aov: 56.98 },
    { date: 'May', sales: 112000, orders: 1950, aov: 57.44 },
    { date: 'Jun', sales: 124567, orders: 2120, aov: 58.76 },
    { date: 'Jul', sales: 135000, orders: 2300, aov: 58.70 },
    { date: 'Aug', sales: 128000, orders: 2200, aov: 58.18 },
    { date: 'Sep', sales: 142000, orders: 2400, aov: 59.17 },
    { date: 'Oct', sales: 156000, orders: 2650, aov: 58.87 },
    { date: 'Nov', sales: 189000, orders: 3100, aov: 60.97 },
    { date: 'Dec', sales: 235000, orders: 3800, aov: 61.84 },
  ], []);

  const geographicData = useMemo(() => [
    { region: 'North America', sales: 85600, percentage: 68.5, growth: 12.3 },
    { region: 'Europe', sales: 24500, percentage: 19.6, growth: 8.7 },
    { region: 'Asia Pacific', sales: 12300, percentage: 9.8, growth: 15.4 },
    { region: 'Other', sales: 2600, percentage: 2.1, growth: 5.2 },
  ], []);

  const topProducts = useMemo(() => [
    { id: 1, name: 'Wireless Earbuds Pro', sales: 12560, orders: 890, growth: 25.4 },
    { id: 2, name: 'Smartwatch Series X', sales: 9870, orders: 650, growth: 18.7 },
    { id: 3, name: 'Laptop Backpack', sales: 7650, orders: 1230, growth: 32.1 },
    { id: 4, name: 'USB-C Charging Cable', sales: 6540, orders: 2450, growth: 15.6 },
    { id: 5, name: 'Mechanical Keyboard', sales: 5430, orders: 320, growth: 22.3 },
  ], []);

  const trafficSources = useMemo(() => [
    { source: 'Amazon Search', percentage: 45, sessions: 20550, conversion: 4.8 },
    { source: 'Direct', percentage: 18, sessions: 8220, conversion: 5.2 },
    { source: 'Social Media', percentage: 12, sessions: 5480, conversion: 3.4 },
    { source: 'Email', percentage: 10, sessions: 4560, conversion: 6.1 },
    { source: 'Referral', percentage: 8, sessions: 3650, conversion: 2.8 },
    { source: 'Display Ads', percentage: 7, sessions: 3190, conversion: 2.1 },
  ], []);

  const reportTemplates = [
    { id: 'daily_sales', name: 'Daily Sales', frequency: 'Daily', lastRun: 'Today 8:00 AM' },
    { id: 'weekly_performance', name: 'Weekly Performance', frequency: 'Weekly', lastRun: 'Last Monday' },
    { id: 'monthly_financial', name: 'Monthly Financial', frequency: 'Monthly', lastRun: 'Last Month' },
    { id: 'quarterly_review', name: 'Quarterly Review', frequency: 'Quarterly', lastRun: 'Last Quarter' },
    { id: 'inventory_alert', name: 'Inventory Alert', frequency: 'Daily', lastRun: 'Today 6:00 AM' },
    { id: 'customer_acquisition', name: 'Customer Report', frequency: 'Weekly', lastRun: 'Last Week' },
  ];

  const filteredMetrics = useMemo(() => {
    return metrics.filter(metric => selectedMetrics.includes(metric.id));
  }, [selectedMetrics, metrics]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  const handleSchedule = () => {
    const schedule = {
      type: reportType,
      frequency: 'weekly',
      format: exportFormat,
      recipients: ['business@example.com'],
      nextRun: 'Next Monday 8:00 AM'
    };
    setReportSchedule(schedule);
  };

  const SalesTrendChart = () => {
    const maxSales = Math.max(...salesData.map(d => d.sales));
    const chartData = isMobile ? salesData.slice(-6) : salesData;
    
    return (
      <div className="h-48 md:h-56 lg:h-64 mt-4">
        <div className="flex h-full items-end space-x-1">
          {chartData.map((data, index) => {
            const height = (data.sales / maxSales) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center" style={{ height: '150px' }}>
                  <div 
                    className="w-4 md:w-6 lg:w-8 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg group"
                    style={{ height: `${height}%`, bottom: '0' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${(data.sales / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">{data.date}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const GeographicChart = () => {
    return (
      <div className="h-48 md:h-56 lg:h-64">
        <div className="flex flex-col h-full justify-center space-y-3 md:space-y-4">
          {geographicData.map((region, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs md:text-sm font-medium text-gray-700 truncate mr-2">
                  {region.region}
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-900 whitespace-nowrap">
                  ${(region.sales / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${region.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{region.percentage}% of total</span>
                <span className={`text-xs font-medium ${region.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {region.growth >= 0 ? '+' : ''}{region.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TrafficSourcesChart = () => {
    return (
      <div className="space-y-3 md:space-y-4">
        {trafficSources.map((source, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 md:w-24 lg:w-32 text-xs md:text-sm text-gray-700 truncate">
              {source.source}
            </div>
            <div className="flex-1 ml-2 md:ml-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">{source.percentage}%</span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {source.sessions.toLocaleString()} sessions
                </span>
              </div>
              <div className="h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-2 md:ml-4 w-12 md:w-16 text-right">
              <div className="text-sm font-bold text-gray-900">{source.conversion}%</div>
              <div className="text-xs text-gray-500">Conv.</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ReportCard = ({ report }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{report.name}</h4>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500 mr-3">{report.frequency}</span>
              <span className="text-xs text-gray-400 truncate">Last: {report.lastRun}</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
            <FiEye size={18} />
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium py-2 rounded-lg">
            Run Now
          </button>
          <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-sm font-medium py-2 rounded-lg">
            Schedule
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile First Approach */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="px-4 py-4 md:px-6 md:py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden mr-3"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <div className="flex items-center">
                <FaRegChartBar className="text-xl md:text-2xl mr-2 md:mr-3" />
                <div>
                  <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Business Reports</h1>
                  <p className="text-blue-100 text-xs md:text-sm hidden sm:block">
                    Monitor performance and make data-driven decisions
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mobile Header Actions */}
            <div className="flex items-center space-x-2 md:hidden">
              <button className="p-2 bg-blue-500 rounded-lg">
                <FiSettings size={18} />
              </button>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="p-2 bg-white text-blue-600 rounded-lg"
              >
                {isExporting ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
              </button>
            </div>

            {/* Desktop Header Actions */}
            <div className="hidden md:flex space-x-3">
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center"
              >
                {isExporting ? (
                  <FiRefreshCw className="animate-spin mr-2" />
                ) : (
                  <FiDownload className="mr-2" />
                )}
                <span className="hidden lg:inline">Export Report</span>
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center">
                <FiSettings className="mr-2" />
                <span className="hidden lg:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b">
          <div className="px-4 py-3 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {timeRanges.slice(0, 5).map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={(e) => setCompareMode(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Compare</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-7xl mx-auto">
        {/* Controls Bar - Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-8 py-2 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {timeRanges.map(range => (
                    <option key={range.id} value={range.id}>{range.label}</option>
                  ))}
                </select>
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>

              <div className="relative">
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-8 py-2 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                <FaRegChartBar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={(e) => setCompareMode(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Compare</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-refresh</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                <FiFilter className="mr-2" size={16} />
                <span>Filters</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                <FiRefreshCw className="mr-2" size={16} />
                <span>Refresh</span>
              </button>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-3 py-2 ${viewMode === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-3 py-2 ${viewMode === 'detailed' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid - Responsive columns */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          {filteredMetrics.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{metric.label}</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${
                  metric.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {React.cloneElement(metric.icon, { size: 20 })}
                </div>
              </div>
              <div className="flex items-center">
                <div className={`flex items-center ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.isPositive ? <FiTrendingUp className="mr-1" size={14} /> : <FiTrendingDown className="mr-1" size={14} />}
                  <span className="text-xs sm:text-sm font-medium">
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
                <span className="text-xs text-gray-500 ml-2 truncate">vs previous</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Sales Trend Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Sales Trend</h3>
                  <p className="text-gray-600 text-sm truncate">Revenue over time</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiMaximize2 size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiDownload size={18} />
                  </button>
                </div>
              </div>
              <SalesTrendChart />
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600">Total Sales</p>
                  <p className="text-base sm:text-xl font-bold text-gray-900">$124.5K</p>
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                  <p className="text-base sm:text-xl font-bold text-gray-900">2,120</p>
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-base sm:text-xl font-bold text-gray-900">$58.76</p>
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Geographic Distribution</h3>
                  <p className="text-gray-600 text-sm truncate">Sales by region</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap">
                  View Details
                </button>
              </div>
              <GeographicChart />
            </div>
          </div>

          {/* Right Column - Side Panels */}
          <div className="space-y-4 sm:space-y-6">
            {/* Traffic Sources */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Traffic Sources</h3>
                  <p className="text-gray-600 text-sm truncate">Where your traffic comes from</p>
                </div>
                <FiGlobe className="text-gray-400 text-xl flex-shrink-0" />
              </div>
              <TrafficSourcesChart />
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Top Products</h3>
                  <p className="text-gray-600 text-sm truncate">By sales volume</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap">
                  View All
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="min-w-0 mr-2">
                      <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{product.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">${product.sales.toLocaleString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`flex items-center ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth >= 0 ? <FiTrendingUp className="mr-1" size={14} /> : <FiTrendingDown className="mr-1" size={14} />}
                        <span className="font-medium text-sm">{product.growth}%</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">{product.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 font-medium py-3 rounded-lg flex items-center justify-center text-sm sm:text-base"
                >
                  {isExporting ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" />
                      Export View
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleSchedule}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center text-sm sm:text-base"
                >
                  <FiCalendar className="mr-2" />
                  Schedule Report
                </button>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 rounded-lg text-xs sm:text-sm">
                    <FiPrinter className="inline mr-1 sm:mr-2" />
                    Print
                  </button>
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 rounded-lg text-xs sm:text-sm">
                    <FiShare2 className="inline mr-1 sm:mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Report Templates</h2>
              <p className="text-gray-600 text-sm">Pre-configured reports for common needs</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base">
              Create New Template
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {reportTemplates.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>

        {/* Advanced Analytics Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Advanced Analytics</h2>
              <p className="text-gray-600 text-sm">Deep insights and predictions</p>
            </div>
            <FaCrown className="text-yellow-500 text-xl flex-shrink-0" />
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { icon: <FiTrendingUp />, title: 'Sales Forecast', subtitle: 'Next 30 days', value: '+12.4%', label: 'Expected growth', color: 'blue' },
              { icon: <FiUsers />, title: 'Customer Insights', subtitle: 'Segmentation', value: '4.2%', label: 'Repeat rate', color: 'green' },
              { icon: <FiPackage />, title: 'Inventory Forecast', subtitle: 'Stock predictions', value: '23 days', label: 'Avg. stock time', color: 'purple' },
              { icon: <FiAlertCircle />, title: 'Risk Assessment', subtitle: 'Potential issues', value: 'Low', label: 'Risk level', color: 'red' },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${getBgColor(item.color)} rounded-lg flex items-center justify-center mr-2 sm:mr-3`}>
                    {React.cloneElement(item.icon, { className: `text-${item.color}-600`, size: 20 })}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.title}</p>
                    <p className="text-xs text-gray-600 truncate">{item.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className={`text-xs sm:text-sm ${getTextColor(item.color)}`}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 sm:mb-4">Export Options</h3>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {['pdf', 'excel', 'csv', 'image'].map((format) => (
              <label key={format} className="flex items-center space-x-1 sm:space-x-2">
                <input
                  type="radio"
                  name="exportFormat"
                  value={format}
                  checked={exportFormat === format}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{format}</span>
              </label>
            ))}
          </div>
          
          {reportSchedule && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1 min-w-0">
                  <FiCheckCircle className="text-green-500 mr-2 sm:mr-3 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Report scheduled</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {reportSchedule.type} report will be sent {reportSchedule.frequency}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setReportSchedule(null)}
                  className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for colors
const getBgColor = (color) => {
  switch(color) {
    case 'blue': return 'bg-blue-100';
    case 'green': return 'bg-green-100';
    case 'purple': return 'bg-purple-100';
    case 'red': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
};

const getTextColor = (color) => {
  switch(color) {
    case 'blue': return 'text-blue-600';
    case 'green': return 'text-green-600';
    case 'purple': return 'text-purple-600';
    case 'red': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export default BusinessReports;