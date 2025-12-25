import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  RefreshCcw,
  Undo2,
  Eye,
  CheckCircle,
  XCircle,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  MoreVertical,
  AlertCircle,
  Truck,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Globe,
  X,
  ChevronUp,
  ChevronDown,
  BarChart3,
  MessageSquare,
} from "lucide-react";

// Breakpoints for responsive design
const BREAKPOINTS = {
  xs: 320,   // Extra small mobile
  sm: 480,   // Small mobile
  md: 640,   // Mobile landscape / Small tablet
  lg: 768,   // Tablet
  xl: 1024,  // Laptop
  '2xl': 1280, // Desktop
  '3xl': 1536, // Large desktop
  '4xl': 1920  // Extra large desktop
};

// Custom hook for responsive design
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const [deviceType, setDeviceType] = useState('desktop');
  const [breakpoint, setBreakpoint] = useState('xl');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowSize({ width, height: window.innerHeight });

      // Determine breakpoint
      let currentBreakpoint = 'xs';
      if (width >= BREAKPOINTS['4xl']) currentBreakpoint = '4xl';
      else if (width >= BREAKPOINTS['3xl']) currentBreakpoint = '3xl';
      else if (width >= BREAKPOINTS['2xl']) currentBreakpoint = '2xl';
      else if (width >= BREAKPOINTS.xl) currentBreakpoint = 'xl';
      else if (width >= BREAKPOINTS.lg) currentBreakpoint = 'lg';
      else if (width >= BREAKPOINTS.md) currentBreakpoint = 'md';
      else if (width >= BREAKPOINTS.sm) currentBreakpoint = 'sm';
      
      setBreakpoint(currentBreakpoint);

      // Determine device type
      if (width < BREAKPOINTS.md) setDeviceType('mobile');
      else if (width < BREAKPOINTS.lg) setDeviceType('tablet');
      else if (width < BREAKPOINTS.xl) setDeviceType('laptop');
      else if (width < BREAKPOINTS['3xl']) setDeviceType('desktop');
      else setDeviceType('large-desktop');
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isLaptop = deviceType === 'laptop';
  const isDesktop = deviceType === 'desktop';
  const isLargeDesktop = deviceType === 'large-desktop';

  return {
    windowSize,
    deviceType,
    breakpoint,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isLargeDesktop
  };
};

// Device Icon Component
const DeviceIcon = ({ deviceType, size = 20 }) => {
  const icons = {
    mobile: <Smartphone size={size} />,
    tablet: <Tablet size={size} />,
    laptop: <Laptop size={size} />,
    desktop: <Monitor size={size} />,
    'large-desktop': <Globe size={size} />
  };
  
  return icons[deviceType] || <Monitor size={size} />;
};

// Return Card Component for Mobile View
const ReturnCard = ({ returnReq, statusColors, onAction, deviceType }) => {
  const isMobile = deviceType === 'mobile';
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isMobile) {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getConditionColor = (condition) => {
    const colors = {
      'New': 'bg-green-50 text-green-700 border-green-200',
      'Used': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Opened': 'bg-blue-50 text-blue-700 border-blue-200',
      'Damaged': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[condition] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-shadow">
      {/* Return Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-blue-700 text-sm">{returnReq.id}</div>
          <div className="text-xs text-gray-500">{formatDate(returnReq.date)}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[returnReq.status]}`}>
            {returnReq.status}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            returnReq.fulfillment === 'FBA' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {returnReq.fulfillment}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex gap-3 mb-4">
        <img
          src={returnReq.image}
          className="w-16 h-16 rounded-lg border object-cover"
          alt={returnReq.product}
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
            {returnReq.product}
          </h3>
          <div className="mt-2">
            <div className="font-bold text-gray-900">{formatPrice(returnReq.price)}</div>
          </div>
        </div>
      </div>

      {/* Buyer Info */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Buyer</div>
          <div className="font-medium text-gray-900 text-sm">{returnReq.buyer}</div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Condition</div>
          <div className={`font-medium text-xs px-2 py-1 rounded-full inline-block ${getConditionColor(returnReq.condition)}`}>
            {returnReq.condition}
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4 p-2 bg-red-50 rounded-lg">
        <div className="text-xs text-red-700 mb-1">Return Reason</div>
        <div className="font-medium text-red-900 text-sm">{returnReq.reason}</div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {returnReq.actions.map((action, index) => {
          let Icon, className;
          switch (action) {
            case "Approve Return":
              Icon = CheckCircle;
              className = "bg-green-50 text-green-700 hover:bg-green-100";
              break;
            case "Reject Return":
              Icon = XCircle;
              className = "bg-red-50 text-red-700 hover:bg-red-100";
              break;
            case "Issue Refund":
              Icon = RefreshCcw;
              className = "bg-blue-50 text-blue-700 hover:bg-blue-100";
              break;
            case "View Details":
              Icon = Eye;
              className = "bg-gray-50 text-gray-700 hover:bg-gray-100";
              break;
            default:
              Icon = Eye;
              className = "bg-gray-50 text-gray-700 hover:bg-gray-100";
          }

          return (
            <button
              key={index}
              onClick={() => onAction?.(action, returnReq)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${className}`}
            >
              <Icon size={14} />
              <span>{isMobile ? action.split(' ')[0] : action}</span>
            </button>
          );
        })}
        
        {/* More actions dropdown trigger for mobile */}
        {isMobile && (
          <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
            <MoreVertical size={16} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

// Mobile Filters Component
const MobileFilters = ({ 
  search, 
  setSearch, 
  status, 
  setStatus, 
  fulfillment, 
  setFulfillment, 
  date, 
  setDate,
  showFilters,
  setShowFilters,
  deviceType
}) => {
  const isMobile = deviceType === 'mobile';
  
  return (
    <>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
          <Search size={18} className="text-gray-500 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search returns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
            {(status !== 'all' || fulfillment !== 'all' || date !== 'all') && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
          {showFilters ? (
            <ChevronLeft size={18} className="text-gray-600" />
          ) : (
            <ChevronRight size={18} className="text-gray-600" />
          )}
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-2 p-4 bg-gray-50 border border-gray-300 rounded-lg space-y-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'Return Initiated', 'Return Received', 'Refund Completed', 'Rejected'].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => setStatus(statusOption)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      status === statusOption
                        ? statusOption === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : {
                              'Return Initiated': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
                              'Return Received': 'bg-blue-100 text-blue-700 border border-blue-300',
                              'Refund Completed': 'bg-green-100 text-green-700 border border-green-300',
                              'Rejected': 'bg-red-100 text-red-700 border border-red-300'
                            }[statusOption]
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {statusOption === 'all' ? 'All Status' : 
                     statusOption === 'Return Initiated' ? 'Initiated' :
                     statusOption === 'Return Received' ? 'Received' :
                     statusOption === 'Refund Completed' ? 'Completed' :
                     statusOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Fulfillment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fulfillment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'FBA', 'FBM'].map((fulfillmentOption) => (
                  <button
                    key={fulfillmentOption}
                    onClick={() => setFulfillment(fulfillmentOption)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      fulfillment === fulfillmentOption
                        ? fulfillmentOption === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : {
                              'FBA': 'bg-purple-100 text-purple-700 border border-purple-300',
                              'FBM': 'bg-orange-100 text-orange-700 border border-orange-300'
                            }[fulfillmentOption]
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {fulfillmentOption === 'all' ? 'All' : fulfillmentOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'today', '7days', '30days'].map((dateOption) => (
                  <button
                    key={dateOption}
                    onClick={() => setDate(dateOption)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      date === dateOption
                        ? dateOption === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {dateOption === 'all' ? 'All Dates' : 
                     dateOption === 'today' ? 'Today' : 
                     dateOption === '7days' ? 'Last 7 Days' : 
                     'Last 30 Days'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Desktop Filters Component
const DesktopFilters = ({ 
  search, 
  setSearch, 
  status, 
  setStatus, 
  fulfillment, 
  setFulfillment, 
  date, 
  setDate,
  deviceType
}) => {
  const isTablet = deviceType === 'tablet';
  const isLaptop = deviceType === 'laptop';
  
  const filterGridCols = isTablet ? 'grid-cols-2' : 
                       isLaptop ? 'grid-cols-3 lg:grid-cols-4' : 
                       'grid-cols-4';

  return (
    <div className={`grid ${filterGridCols} gap-3 mb-6`}>
      {/* Search */}
      <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
        <Search size={18} className="text-gray-500 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by product or order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
        <option value="all">All Status</option>
        <option value="Return Initiated">🟡 Return Initiated</option>
        <option value="Return Received">🔵 Return Received</option>
        <option value="Refund Completed">🟢 Refund Completed</option>
        <option value="Rejected">🔴 Rejected</option>
      </select>

      {/* Fulfillment Filter */}
      <select
        value={fulfillment}
        onChange={(e) => setFulfillment(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
        <option value="all">All Fulfillment</option>
        <option value="FBA">📦 Amazon FBA</option>
        <option value="FBM">🚚 Merchant FBM</option>
      </select>

      {/* Date Filter */}
      <select
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
        <option value="all">📅 Any Date</option>
        <option value="today">Today</option>
        <option value="7days">Last 7 days</option>
        <option value="30days">Last 30 days</option>
        <option value="custom">Custom Range</option>
      </select>
    </div>
  );
};

// Enhanced Table Component
const ReturnTable = ({ 
  returns, 
  statusColors, 
  onAction,
  deviceType,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}) => {
  const isTablet = deviceType === 'tablet';
  const isLaptop = deviceType === 'laptop';
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isTablet) {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getConditionColor = (condition) => {
    const colors = {
      'New': 'bg-green-100 text-green-700',
      'Used': 'bg-yellow-100 text-yellow-700',
      'Opened': 'bg-blue-100 text-blue-700',
      'Damaged': 'bg-red-100 text-red-700'
    };
    return colors[condition] || 'bg-gray-100 text-gray-700';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="ml-1 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp size={12} className="ml-1" /> : 
      <ChevronDown size={12} className="ml-1" />;
  };

  // Determine which columns to show based on device
  const getTableHeaders = () => {
    if (isTablet) {
      return [
        { key: 'id', label: 'Order ID' },
        { key: 'product', label: 'Product' },
        { key: 'reason', label: 'Reason' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ];
    } else if (isLaptop) {
      return [
        { key: 'id', label: 'Order ID' },
        { key: 'product', label: 'Product' },
        { key: 'buyer', label: 'Buyer' },
        { key: 'reason', label: 'Reason' },
        { key: 'condition', label: 'Condition' },
        { key: 'price', label: 'Price' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ];
    } else {
      return [
        { key: 'id', label: 'Order ID', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'buyer', label: 'Buyer', sortable: true },
        { key: 'reason', label: 'Reason', sortable: true },
        { key: 'condition', label: 'Condition', sortable: true },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions' },
        { key: 'date', label: 'Date', sortable: true }
      ];
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              {getTableHeaders().map((header) => (
                <th 
                  key={header.key} 
                  className={`p-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    header.key === 'actions' ? 'text-right' : ''
                  }`}
                >
                  <button
                    onClick={() => header.sortable && handleSort(header.key)}
                    className={`flex items-center ${header.sortable ? 'cursor-pointer hover:text-blue-600' : ''}`}
                  >
                    {header.label}
                    {header.sortable && <SortIcon field={header.key} />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {returns.map((returnReq) => (
              <tr 
                key={returnReq.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Order ID */}
                <td className="p-3">
                  <div className="font-semibold text-blue-700 text-sm">{returnReq.id}</div>
                  <div className="text-xs text-gray-500">{formatDate(returnReq.date)}</div>
                  {isTablet && (
                    <div className="text-xs text-gray-500 mt-1">{returnReq.buyer}</div>
                  )}
                </td>

                {/* Product */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={returnReq.image}
                      className="w-10 h-10 rounded border object-cover"
                      alt={returnReq.product}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm line-clamp-2">
                        {returnReq.product}
                      </div>
                      {isTablet && (
                        <div className="text-xs text-gray-500 mt-1">
                          {formatPrice(returnReq.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Buyer - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className="text-sm text-gray-900">{returnReq.buyer}</div>
                  </td>
                )}

                {/* Reason */}
                <td className="p-3">
                  <div className="text-sm text-gray-900">{returnReq.reason}</div>
                  {isTablet && (
                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getConditionColor(returnReq.condition)}`}>
                      {returnReq.condition}
                    </div>
                  )}
                </td>

                {/* Condition - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(returnReq.condition)}`}>
                      {returnReq.condition}
                    </span>
                  </td>
                )}

                {/* Price - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{formatPrice(returnReq.price)}</div>
                  </td>
                )}

                {/* Status */}
                <td className="p-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[returnReq.status]}`}>
                    {returnReq.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    {returnReq.actions.map((action, index) => {
                      let Icon, className;
                      switch (action) {
                        case "Approve Return":
                          Icon = CheckCircle;
                          className = "text-green-600 hover:text-green-800";
                          break;
                        case "Reject Return":
                          Icon = XCircle;
                          className = "text-red-600 hover:text-red-800";
                          break;
                        case "Issue Refund":
                          Icon = RefreshCcw;
                          className = "text-blue-600 hover:text-blue-800";
                          break;
                        case "View Details":
                          Icon = Eye;
                          className = "text-gray-600 hover:text-gray-800";
                          break;
                        default:
                          Icon = Eye;
                          className = "text-gray-600 hover:text-gray-800";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => onAction?.(action, returnReq)}
                          className={`flex items-center gap-1 text-xs font-medium hover:underline ${className}`}
                        >
                          <Icon size={12} />
                          <span>{isTablet ? action.split(' ')[0] : action}</span>
                        </button>
                      );
                    })}
                  </div>
                </td>

                {/* Date - Only on desktop */}
                {!isTablet && !isLaptop && (
                  <td className="p-3">
                    <div className="text-sm text-gray-600">{formatDate(returnReq.date)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReturnRequests = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("all");
  const [fulfillment, setFulfillment] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReturns, setSelectedReturns] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const responsive = useResponsive();
  const returnsPerPage = responsive.isMobile ? 5 : 
                       responsive.isTablet ? 8 : 
                       responsive.isLaptop ? 10 : 12;

  // Mock data with more returns for pagination
  const returnRequests = useMemo(() => [
    {
      id: "555-3344556-778899",
      product: "Wireless Bluetooth Earbuds with Noise Cancellation",
      image: "https://m.media-amazon.com/images/I/61kRB0kmQOL._AC_UL320_.jpg",
      buyer: "Aman Kumar",
      price: 1299,
      date: "2025-12-01",
      reason: "Item Defective",
      condition: "Used",
      status: "Return Initiated",
      fulfillment: "FBA",
      actions: ["Approve Return", "Reject Return", "View Details"],
    },
    {
      id: "444-7788990-221133",
      product: "USB-C Fast Charger 25W Power Adapter",
      image: "https://m.media-amazon.com/images/I/61rZyL1ZtCL._AC_UL320_.jpg",
      buyer: "Ravi Singh",
      price: 699,
      date: "2025-11-28",
      reason: "Wrong Item Received",
      condition: "Opened",
      status: "Return Received",
      fulfillment: "FBM",
      actions: ["Issue Refund", "View Details"],
    },
    {
      id: "333-1122334-445566",
      product: "Smart Fitness Band with Heart Rate Monitor",
      image: "https://m.media-amazon.com/images/I/61q2hYIQ+PL._AC_UL320_.jpg",
      buyer: "Suraj Verma",
      price: 1799,
      date: "2025-11-27",
      reason: "Item not needed",
      condition: "New",
      status: "Refund Completed",
      fulfillment: "FBA",
      actions: ["View Details"],
    },
    {
      id: "222-5566778-990011",
      product: "Wireless Mouse 2.4GHz Ergonomic Design",
      image: "https://m.media-amazon.com/images/I/61LtuGzXeaL._AC_UL320_.jpg",
      buyer: "Priya Sharma",
      price: 499,
      date: "2025-11-26",
      reason: "Product damaged during shipping",
      condition: "Damaged",
      status: "Return Initiated",
      fulfillment: "FBM",
      actions: ["Approve Return", "Reject Return"],
    },
    {
      id: "111-8899001-223344",
      product: "Laptop Backpack Waterproof 15.6 inch",
      image: "https://m.media-amazon.com/images/I/71qxQr-yK6L._AC_UL320_.jpg",
      buyer: "Vikram Patel",
      price: 1299,
      date: "2025-11-25",
      reason: "Size not as described",
      condition: "Opened",
      status: "Return Received",
      fulfillment: "FBA",
      actions: ["Issue Refund", "View Details"],
    },
    {
      id: "666-3344556-667788",
      product: "Smart Watch with Bluetooth Calling",
      image: "https://m.media-amazon.com/images/I/61X8rxqYaAL._AC_UL320_.jpg",
      buyer: "Anjali Reddy",
      price: 2999,
      date: "2025-11-24",
      reason: "Battery draining fast",
      condition: "Used",
      status: "Rejected",
      fulfillment: "FBM",
      actions: ["View Details"],
    },
    {
      id: "777-9900112-334455",
      product: "Portable Bluetooth Speaker 20W",
      image: "https://m.media-amazon.com/images/I/61W7cHHt3JL._AC_UL320_.jpg",
      buyer: "Rajesh Verma",
      price: 1599,
      date: "2025-11-23",
      reason: "Sound quality not good",
      condition: "Opened",
      status: "Return Initiated",
      fulfillment: "FBA",
      actions: ["Approve Return", "Reject Return"],
    },
    {
      id: "888-5566778-990011",
      product: "Wireless Keyboard and Mouse Combo",
      image: "https://m.media-amazon.com/images/I/61N-QN0xqaL._AC_UL320_.jpg",
      buyer: "Suresh Kumar",
      price: 1299,
      date: "2025-11-22",
      reason: "Missing accessories",
      condition: "New",
      status: "Return Received",
      fulfillment: "FBM",
      actions: ["Issue Refund", "View Details"],
    },
    {
      id: "999-1122334-556677",
      product: "Power Bank 20000mAh Fast Charging",
      image: "https://m.media-amazon.com/images/I/61XmnzLQSSL._AC_UL320_.jpg",
      buyer: "Neha Gupta",
      price: 899,
      date: "2025-11-21",
      reason: "Not charging properly",
      condition: "Used",
      status: "Refund Completed",
      fulfillment: "FBA",
      actions: ["View Details"],
    },
    {
      id: "101-4455667-778899",
      product: "Webcam HD 1080p with Microphone",
      image: "https://m.media-amazon.com/images/I/61Nfz7+B5SL._AC_UL320_.jpg",
      buyer: "Amit Shah",
      price: 1499,
      date: "2025-11-20",
      reason: "Video quality poor",
      condition: "Opened",
      status: "Rejected",
      fulfillment: "FBM",
      actions: ["View Details"],
    },
    {
      id: "102-7788990-112233",
      product: "Gaming Headset with RGB Lights",
      image: "https://m.media-amazon.com/images/I/61C7Z-XcvAL._AC_UL320_.jpg",
      buyer: "Deepak Joshi",
      price: 1999,
      date: "2025-11-19",
      reason: "Comfort issues",
      condition: "Used",
      status: "Return Initiated",
      fulfillment: "FBA",
      actions: ["Approve Return", "Reject Return"],
    },
    {
      id: "103-3344556-778899",
      product: "External SSD 1TB USB 3.2",
      image: "https://m.media-amazon.com/images/I/61DQQpPZorL._AC_UL320_.jpg",
      buyer: "Kavita Singh",
      price: 5999,
      date: "2025-11-18",
      reason: "Read/write speed slow",
      condition: "New",
      status: "Return Received",
      fulfillment: "FBM",
      actions: ["Issue Refund", "View Details"],
    }
  ], []);

  const statusColors = {
    "Return Initiated": "bg-yellow-100 text-yellow-700 border border-yellow-200",
    "Return Received": "bg-blue-100 text-blue-700 border border-blue-200",
    "Refund Completed": "bg-green-100 text-green-700 border border-green-200",
    "Rejected": "bg-red-100 text-red-700 border border-red-200",
  };

  // Filter and sort returns
  const filteredReturns = useMemo(() => {
    let filtered = returnRequests.filter((returnReq) => {
      // Search filter
      const matchesSearch = 
        returnReq.product.toLowerCase().includes(search.toLowerCase()) ||
        returnReq.id.toLowerCase().includes(search.toLowerCase()) ||
        returnReq.buyer.toLowerCase().includes(search.toLowerCase()) ||
        returnReq.reason.toLowerCase().includes(search.toLowerCase());
      
      // Status filter
      const matchesStatus = status === "all" || returnReq.status === status;
      
      // Fulfillment filter
      const matchesFulfillment = fulfillment === "all" || returnReq.fulfillment === fulfillment;
      
      // Date filter
      let matchesDate = true;
      if (date !== "all") {
        const returnDate = new Date(returnReq.date);
        const today = new Date();
        
        switch (date) {
          case "today":
            matchesDate = returnDate.toDateString() === today.toDateString();
            break;
          case "7days":
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            matchesDate = returnDate >= sevenDaysAgo;
            break;
          case "30days":
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            matchesDate = returnDate >= thirtyDaysAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesFulfillment && matchesDate;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle special cases
      if (sortField === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [returnRequests, search, status, fulfillment, date, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredReturns.length / returnsPerPage);
  const startIndex = (currentPage - 1) * returnsPerPage;
  const endIndex = startIndex + returnsPerPage;
  const paginatedReturns = filteredReturns.slice(startIndex, endIndex);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: filteredReturns.length,
    initiated: filteredReturns.filter(r => r.status === "Return Initiated").length,
    received: filteredReturns.filter(r => r.status === "Return Received").length,
    completed: filteredReturns.filter(r => r.status === "Refund Completed").length,
    rejected: filteredReturns.filter(r => r.status === "Rejected").length,
    fba: filteredReturns.filter(r => r.fulfillment === "FBA").length,
    fbm: filteredReturns.filter(r => r.fulfillment === "FBM").length,
    totalValue: filteredReturns.reduce((sum, r) => sum + r.price, 0)
  }), [filteredReturns]);

  // Handle return action
  const handleReturnAction = (action, returnReq) => {
    console.log(`Action: ${action} for return: ${returnReq.id}`);
    // In a real app, this would trigger API calls or state updates
    const actions = {
      "Approve Return": `Return approved for order ${returnReq.id}. Refund of ₹${returnReq.price} initiated.`,
      "Reject Return": `Return rejected for order ${returnReq.id}. Customer notified with reason.`,
      "Issue Refund": `Refund of ₹${returnReq.price} issued for order ${returnReq.id}.`,
      "View Details": `Viewing details for return ${returnReq.id}`
    };
    alert(actions[action] || `Action ${action} for return ${returnReq.id}`);
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedReturns.length === 0) {
      alert("Please select returns first");
      return;
    }
    console.log(`Bulk ${action} for returns:`, selectedReturns);
    alert(`Bulk ${action} for ${selectedReturns.length} returns`);
  };

  // Export returns
  const handleExport = () => {
    alert(`Exporting ${filteredReturns.length} returns`);
  };

  // Refresh returns
  const handleRefresh = () => {
    setSearch("");
    setStatus("all");
    setFulfillment("all");
    setDate("all");
    setSelectedReturns([]);
  };

  // Get container max width
  const getContainerMaxWidth = () => {
    if (responsive.isLargeDesktop) return 'max-w-screen-2xl';
    if (responsive.isDesktop) return 'max-w-7xl';
    if (responsive.isLaptop) return 'max-w-6xl';
    if (responsive.isTablet) return 'max-w-4xl';
    return 'max-w-full';
  };

  // Get header font size
  const getHeaderSize = () => {
    if (responsive.isMobile) return 'text-xl';
    if (responsive.isTablet) return 'text-2xl';
    return 'text-3xl';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={`${responsive.isMobile ? 'p-3' : 'p-4 lg:p-6'} bg-white rounded-xl shadow-lg`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 ${responsive.isMobile ? 'p-1.5' : ''}`}>
            <Undo2 className={`text-white ${responsive.isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          <div>
            <h2 className={`font-bold ${getHeaderSize()} text-gray-900`}>
              Return Requests
            </h2>
            <p className={`text-gray-600 ${responsive.isMobile ? 'text-xs' : 'text-sm'}`}>
              {stats.total} returns • {formatCurrency(stats.totalValue)} total value
            </p>
          </div>
        </div>

        {/* Device Indicator & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {!responsive.isMobile && (
            <div className={`flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium ${responsive.isMobile ? 'hidden' : ''}`}>
              <DeviceIcon deviceType={responsive.deviceType} size={12} />
              <span className="text-gray-700">{responsive.deviceType.toUpperCase()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${responsive.isMobile ? 'p-1.5' : ''}`}
              title="Refresh"
            >
              <RefreshCcw className={`${responsive.isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>
            
            <button
              onClick={handleExport}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${responsive.isMobile ? 'p-1.5' : ''}`}
              title="Export"
            >
              <Download className={`${responsive.isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!responsive.isMobile && (
        <div className={`grid ${responsive.isTablet ? 'grid-cols-2' : responsive.isLaptop ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-4'} gap-3 mb-6`}>
          {[
            { 
              label: 'Total Returns', 
              value: stats.total, 
              color: 'bg-gray-50 text-gray-700 border-gray-200',
              icon: Undo2,
              trend: '▲ 12%'
            },
            { 
              label: 'Initiated', 
              value: stats.initiated, 
              color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
              icon: AlertCircle,
              trend: '▲ 5%'
            },
            { 
              label: 'Received', 
              value: stats.received, 
              color: 'bg-blue-50 text-blue-700 border-blue-200',
              icon: Package,
              trend: '▼ 2%'
            },
            { 
              label: 'Completed', 
              value: stats.completed, 
              color: 'bg-green-50 text-green-700 border-green-200',
              icon: CheckCircle,
              trend: '▲ 8%'
            },
          ].map((stat, index) => (
            <div key={index} className={`p-3 rounded-lg border ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</div>
                  <div className={`font-bold ${responsive.isTablet ? 'text-xl' : 'text-2xl'} mt-1`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.trend}</div>
                </div>
                <stat.icon className={`${responsive.isTablet ? 'w-8 h-8' : 'w-10 h-10'} opacity-20`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {responsive.isMobile ? (
        <MobileFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          fulfillment={fulfillment}
          setFulfillment={setFulfillment}
          date={date}
          setDate={setDate}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          deviceType={responsive.deviceType}
        />
      ) : (
        <DesktopFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          fulfillment={fulfillment}
          setFulfillment={setFulfillment}
          date={date}
          setDate={setDate}
          deviceType={responsive.deviceType}
        />
      )}

      {/* Quick Stats Bar - Mobile */}
      {responsive.isMobile && (
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
              { label: 'Init', value: stats.initiated, color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Recv', value: stats.received, color: 'bg-blue-100 text-blue-700' },
              { label: 'Comp', value: stats.completed, color: 'bg-green-100 text-green-700' },
            ].map((stat, index) => (
              <div key={index} className={`p-2 rounded-lg text-center ${stat.color}`}>
                <div className="font-bold text-lg">{stat.value}</div>
                <div className="text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Actions - Desktop */}
      {!responsive.isMobile && selectedReturns.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedReturns.length} returns selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("Approve Returns")}
              className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve All
            </button>
            <button
              onClick={() => handleBulkAction("Reject Returns")}
              className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={() => setSelectedReturns([])}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Returns Display */}
      {responsive.isMobile ? (
        // Mobile: Card View
        <div className="mb-6">
          {paginatedReturns.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Undo2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No return requests found</p>
              <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedReturns.map((returnReq) => (
                <ReturnCard
                  key={returnReq.id}
                  returnReq={returnReq}
                  statusColors={statusColors}
                  onAction={handleReturnAction}
                  deviceType={responsive.deviceType}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Tablet & Desktop: Table View
        <ReturnTable
          returns={paginatedReturns}
          statusColors={statusColors}
          onAction={handleReturnAction}
          deviceType={responsive.deviceType}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredReturns.length)} of {filteredReturns.length} returns
          {!responsive.isMobile && (
            <span className="ml-2">• Total value: {formatCurrency(stats.totalValue)}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft size={16} />
            {responsive.isMobile ? 'Prev' : 'Previous'}
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {responsive.isMobile ? 'Next' : 'Next'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Return Summary</h3>
          <BarChart3 size={18} className="text-gray-500" />
        </div>
        <div className={`grid ${responsive.isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">FBA Returns</div>
            <div className="font-bold text-gray-900">{stats.fba}</div>
            <div className="text-xs text-gray-500">{stats.fba > 0 ? `${Math.round((stats.fba / stats.total) * 100)}%` : '0%'}</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">FBM Returns</div>
            <div className="font-bold text-gray-900">{stats.fbm}</div>
            <div className="text-xs text-gray-500">{stats.fbm > 0 ? `${Math.round((stats.fbm / stats.total) * 100)}%` : '0%'}</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">Rejected</div>
            <div className="font-bold text-gray-900">{stats.rejected}</div>
            <div className="text-xs text-gray-500">{stats.rejected > 0 ? `${Math.round((stats.rejected / stats.total) * 100)}%` : '0%'}</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">Avg. Value</div>
            <div className="font-bold text-gray-900">{formatCurrency(stats.total > 0 ? stats.totalValue / stats.total : 0)}</div>
            <div className="text-xs text-gray-500">per return</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Initiated</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Received</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Completed</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DeviceIcon deviceType={responsive.deviceType} size={12} />
            <span>{responsive.deviceType} • {responsive.windowSize.width}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequests;