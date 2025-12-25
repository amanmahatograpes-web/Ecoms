import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Package,
  Printer,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Download,
  RefreshCw,
  AlertCircle,
  ArrowUpDown,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Globe,
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

// Order Card Component for Mobile View
const OrderCard = ({ order, statusColors, onAction }) => {
  const responsive = useResponsive();
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (responsive.isMobile) {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-blue-700 text-sm">{order.id}</div>
          <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            order.fulfillment === 'FBA' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {order.fulfillment}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex gap-3 mb-4">
        <img
          src={order.image}
          className="w-16 h-16 rounded-lg border object-cover"
          alt={order.product}
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
            {order.product}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Qty:</span> {order.quantity}
            </div>
            <div className="text-sm font-bold text-gray-900">
              {formatPrice(order.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Info */}
      <div className="mb-4 p-2 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500 mb-1">Buyer</div>
        <div className="font-medium text-gray-900">{order.buyer}</div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {order.actions.map((action, index) => {
          let Icon, className;
          switch (action) {
            case "Confirm Shipment":
              Icon = Truck;
              className = "bg-blue-50 text-blue-700 hover:bg-blue-100";
              break;
            case "Print Invoice":
              Icon = Printer;
              className = "bg-gray-50 text-gray-700 hover:bg-gray-100";
              break;
            case "Track Order":
              Icon = CheckCircle;
              className = "bg-green-50 text-green-700 hover:bg-green-100";
              break;
            case "View Details":
              Icon = Eye;
              className = "bg-purple-50 text-purple-700 hover:bg-purple-100";
              break;
            default:
              Icon = Eye;
              className = "bg-gray-50 text-gray-700 hover:bg-gray-100";
          }

          return (
            <button
              key={index}
              onClick={() => onAction?.(action, order)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${className}`}
            >
              <Icon size={14} />
              <span>{responsive.isMobile ? action.split(' ')[0] : action}</span>
            </button>
          );
        })}
        
        {/* More actions dropdown trigger for mobile */}
        {responsive.isMobile && (
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
  statusFilter, 
  setStatusFilter, 
  fulfillmentFilter, 
  setFulfillmentFilter, 
  dateFilter, 
  setDateFilter,
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
            placeholder="Search orders..."
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
            {(statusFilter !== 'all' || fulfillmentFilter !== 'all' || dateFilter !== 'all') && (
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
                Order Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? status === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : {
                              'Pending': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
                              'Shipped': 'bg-blue-100 text-blue-700 border border-blue-300',
                              'Delivered': 'bg-green-100 text-green-700 border border-green-300',
                              'Cancelled': 'bg-red-100 text-red-700 border border-red-300'
                            }[status]
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status}
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
                {['all', 'FBA', 'FBM'].map((fulfillment) => (
                  <button
                    key={fulfillment}
                    onClick={() => setFulfillmentFilter(fulfillment)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      fulfillmentFilter === fulfillment
                        ? fulfillment === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : {
                              'FBA': 'bg-purple-100 text-purple-700 border border-purple-300',
                              'FBM': 'bg-orange-100 text-orange-700 border border-orange-300'
                            }[fulfillment]
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {fulfillment === 'all' ? 'All' : fulfillment}
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
                {['all', 'today', '7days', '30days'].map((date) => (
                  <button
                    key={date}
                    onClick={() => setDateFilter(date)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      dateFilter === date
                        ? date === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {date === 'all' ? 'All Dates' : 
                     date === 'today' ? 'Today' : 
                     date === '7days' ? 'Last 7 Days' : 
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
  statusFilter, 
  setStatusFilter, 
  fulfillmentFilter, 
  setFulfillmentFilter, 
  dateFilter, 
  setDateFilter,
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
          placeholder="Search Order ID or Product"
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
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
        <option value="all">All Status</option>
        <option value="Pending">🟡 Pending</option>
        <option value="Shipped">🔵 Shipped</option>
        <option value="Delivered">🟢 Delivered</option>
        <option value="Cancelled">🔴 Cancelled</option>
        <option value="Returned">🟣 Returned</option>
      </select>

      {/* Fulfillment Filter */}
      <select
        value={fulfillmentFilter}
        onChange={(e) => setFulfillmentFilter(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
        <option value="all">All Fulfillment</option>
        <option value="FBA">📦 Amazon FBA</option>
        <option value="FBM">🚚 Merchant FBM</option>
      </select>

      {/* Date Filter */}
      <select
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
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
const OrderTable = ({ 
  orders, 
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
    return sortDirection === 'asc' ? 
      <span className="ml-1">↑</span> : 
      <span className="ml-1">↓</span>;
  };

  // Determine which columns to show based on device
  const getTableHeaders = () => {
    if (isTablet) {
      return [
        { key: 'id', label: 'Order ID' },
        { key: 'product', label: 'Product' },
        { key: 'buyer', label: 'Buyer' },
        { key: 'price', label: 'Price' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ];
    } else if (isLaptop) {
      return [
        { key: 'id', label: 'Order ID' },
        { key: 'product', label: 'Product' },
        { key: 'buyer', label: 'Buyer' },
        { key: 'quantity', label: 'Qty' },
        { key: 'price', label: 'Price' },
        { key: 'fulfillment', label: 'Fulfillment' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ];
    } else {
      return [
        { key: 'id', label: 'Order ID', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'buyer', label: 'Buyer', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'fulfillment', label: 'Fulfillment', sortable: true },
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
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Order ID */}
                <td className="p-3">
                  <div className="font-semibold text-blue-700 text-sm">{order.id}</div>
                  <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
                </td>

                {/* Product */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.image}
                      className="w-10 h-10 rounded border object-cover"
                      alt={order.product}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm line-clamp-2">
                        {order.product}
                      </div>
                      {isTablet && (
                        <div className="text-xs text-gray-500 mt-1">
                          Qty: {order.quantity} • {formatPrice(order.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Buyer - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className="text-sm text-gray-900">{order.buyer}</div>
                  </td>
                )}

                {/* Quantity - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className="text-sm text-gray-900">{order.quantity}</div>
                  </td>
                )}

                {/* Price */}
                <td className="p-3">
                  <div className="font-bold text-gray-900">{formatPrice(order.price)}</div>
                </td>

                {/* Fulfillment - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.fulfillment === 'FBA' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.fulfillment}
                    </span>
                  </td>
                )}

                {/* Status */}
                <td className="p-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    {order.actions.map((action, index) => {
                      let Icon, className;
                      switch (action) {
                        case "Confirm Shipment":
                          Icon = Truck;
                          className = "text-blue-600 hover:text-blue-800";
                          break;
                        case "Print Invoice":
                          Icon = Printer;
                          className = "text-gray-600 hover:text-gray-800";
                          break;
                        case "Track Order":
                          Icon = CheckCircle;
                          className = "text-green-600 hover:text-green-800";
                          break;
                        case "View Details":
                          Icon = Eye;
                          className = "text-purple-600 hover:text-purple-800";
                          break;
                        default:
                          Icon = Eye;
                          className = "text-gray-600 hover:text-gray-800";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => onAction?.(action, order)}
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
                    <div className="text-sm text-gray-600">{formatDate(order.date)}</div>
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

const ManageOrders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const responsive = useResponsive();
  const ordersPerPage = responsive.isMobile ? 5 : 
                       responsive.isTablet ? 8 : 
                       responsive.isLaptop ? 10 : 15;

  // Mock data with more orders for pagination
  const orders = useMemo(() => [
    {
      id: "112-4455677-998877",
      product: "Wireless Bluetooth Earbuds with Noise Cancellation",
      image: "https://m.media-amazon.com/images/I/61kRB0kmQOL._AC_UL320_.jpg",
      buyer: "Aman Kumar",
      price: 1299,
      date: "2025-12-01",
      quantity: 1,
      fulfillment: "FBA",
      status: "Shipped",
      actions: ["Print Invoice", "Track Order"],
    },
    {
      id: "113-7788990-221133",
      product: "USB-C Fast Charger 25W Power Adapter",
      image: "https://m.media-amazon.com/images/I/61rZyL1ZtCL._AC_UL320_.jpg",
      buyer: "Ravi Singh",
      price: 699,
      quantity: 2,
      date: "2025-11-29",
      fulfillment: "FBM",
      status: "Pending",
      actions: ["Confirm Shipment"],
    },
    {
      id: "114-3344556-778899",
      product: "Smart Fitness Band with Heart Rate Monitor",
      image: "https://m.media-amazon.com/images/I/61q2hYIQ+PL._AC_UL320_.jpg",
      buyer: "Mehul Jaiswal",
      price: 1799,
      quantity: 1,
      date: "2025-11-28",
      fulfillment: "FBA",
      status: "Delivered",
      actions: ["Print Invoice", "View Details"],
    },
    {
      id: "115-9900112-334455",
      product: "Wireless Mouse 2.4GHz Ergonomic Design",
      image: "https://m.media-amazon.com/images/I/61LtuGzXeaL._AC_UL320_.jpg",
      buyer: "Sanjay Tiwari",
      price: 499,
      quantity: 1,
      date: "2025-11-27",
      fulfillment: "FBM",
      status: "Cancelled",
      actions: ["View Details"],
    },
    {
      id: "116-5566778-990011",
      product: "Laptop Backpack Waterproof 15.6 inch",
      image: "https://m.media-amazon.com/images/I/71qxQr-yK6L._AC_UL320_.jpg",
      buyer: "Priya Sharma",
      price: 1299,
      quantity: 1,
      date: "2025-11-26",
      fulfillment: "FBA",
      status: "Delivered",
      actions: ["Print Invoice", "View Details"],
    },
    {
      id: "117-1122334-556677",
      product: "Smart Watch with Bluetooth Calling",
      image: "https://m.media-amazon.com/images/I/61X8rxqYaAL._AC_UL320_.jpg",
      buyer: "Vikram Patel",
      price: 2999,
      quantity: 1,
      date: "2025-11-25",
      fulfillment: "FBM",
      status: "Shipped",
      actions: ["Track Order", "Print Invoice"],
    },
    {
      id: "118-8899001-223344",
      product: "Portable Bluetooth Speaker 20W",
      image: "https://m.media-amazon.com/images/I/61W7cHHt3JL._AC_UL320_.jpg",
      buyer: "Anjali Reddy",
      price: 1599,
      quantity: 1,
      date: "2025-11-24",
      fulfillment: "FBA",
      status: "Pending",
      actions: ["Confirm Shipment"],
    },
    {
      id: "119-3344556-667788",
      product: "Wireless Keyboard and Mouse Combo",
      image: "https://m.media-amazon.com/images/I/61N-QN0xqaL._AC_UL320_.jpg",
      buyer: "Rajesh Verma",
      price: 1299,
      quantity: 1,
      date: "2025-11-23",
      fulfillment: "FBM",
      status: "Delivered",
      actions: ["Print Invoice", "View Details"],
    },
    {
      id: "120-7788990-112233",
      product: "Power Bank 20000mAh Fast Charging",
      image: "https://m.media-amazon.com/images/I/61XmnzLQSSL._AC_UL320_.jpg",
      buyer: "Suresh Kumar",
      price: 899,
      quantity: 2,
      date: "2025-11-22",
      fulfillment: "FBA",
      status: "Cancelled",
      actions: ["View Details"],
    },
    {
      id: "121-4455667-778899",
      product: "Webcam HD 1080p with Microphone",
      image: "https://m.media-amazon.com/images/I/61Nfz7+B5SL._AC_UL320_.jpg",
      buyer: "Neha Gupta",
      price: 1499,
      quantity: 1,
      date: "2025-11-21",
      fulfillment: "FBM",
      status: "Shipped",
      actions: ["Track Order", "Print Invoice"],
    },
    {
      id: "122-9900112-334455",
      product: "Gaming Headset with RGB Lights",
      image: "https://m.media-amazon.com/images/I/61C7Z-XcvAL._AC_UL320_.jpg",
      buyer: "Amit Shah",
      price: 1999,
      quantity: 1,
      date: "2025-11-20",
      fulfillment: "FBA",
      status: "Pending",
      actions: ["Confirm Shipment"],
    },
    {
      id: "123-5566778-990011",
      product: "External SSD 1TB USB 3.2",
      image: "https://m.media-amazon.com/images/I/61DQQpPZorL._AC_UL320_.jpg",
      buyer: "Deepak Joshi",
      price: 5999,
      quantity: 1,
      date: "2025-11-19",
      fulfillment: "FBM",
      status: "Delivered",
      actions: ["Print Invoice", "View Details"],
    },
    {
      id: "124-1122334-556677",
      product: "Smartphone Tripod Stand",
      image: "https://m.media-amazon.com/images/I/61vGQY-14aL._AC_UL320_.jpg",
      buyer: "Kavita Singh",
      price: 399,
      quantity: 3,
      date: "2025-11-18",
      fulfillment: "FBA",
      status: "Shipped",
      actions: ["Track Order"],
    },
    {
      id: "125-8899001-223344",
      product: "Wireless Earbuds Sports Edition",
      image: "https://m.media-amazon.com/images/I/61k7W6-yF3L._AC_UL320_.jpg",
      buyer: "Rohit Mehta",
      price: 1799,
      quantity: 2,
      date: "2025-11-17",
      fulfillment: "FBM",
      status: "Delivered",
      actions: ["Print Invoice"],
    },
    {
      id: "126-3344556-667788",
      product: "Laptop Cooling Pad",
      image: "https://m.media-amazon.com/images/I/61bKIp0jbhL._AC_UL320_.jpg",
      buyer: "Sunita Patel",
      price: 699,
      quantity: 1,
      date: "2025-11-16",
      fulfillment: "FBA",
      status: "Cancelled",
      actions: ["View Details"],
    }
  ], []);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Shipped: "bg-blue-100 text-blue-700 border border-blue-200",
    Delivered: "bg-green-100 text-green-700 border border-green-200",
    Cancelled: "bg-red-100 text-red-700 border border-red-200",
    Returned: "bg-purple-100 text-purple-700 border border-purple-200",
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      // Search filter
      const matchesSearch = 
        order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.buyer.toLowerCase().includes(search.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      // Fulfillment filter
      const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillment === fulfillmentFilter;
      
      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = new Date(order.date);
        const today = new Date();
        
        switch (dateFilter) {
          case "today":
            matchesDate = orderDate.toDateString() === today.toDateString();
            break;
          case "7days":
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            matchesDate = orderDate >= sevenDaysAgo;
            break;
          case "30days":
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            matchesDate = orderDate >= thirtyDaysAgo;
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
  }, [orders, search, statusFilter, fulfillmentFilter, dateFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Handle order action
  const handleOrderAction = (action, order) => {
    console.log(`Action: ${action} for order: ${order.id}`);
    // In a real app, this would trigger API calls or state updates
    alert(`${action} clicked for order ${order.id}`);
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) {
      alert("Please select orders first");
      return;
    }
    console.log(`Bulk ${action} for orders:`, selectedOrders);
    alert(`Bulk ${action} for ${selectedOrders.length} orders`);
  };

  // Export orders
  const handleExport = () => {
    alert(`Exporting ${filteredOrders.length} orders`);
  };

  // Refresh orders
  const handleRefresh = () => {
    setSearch("");
    setStatusFilter("all");
    setFulfillmentFilter("all");
    setDateFilter("all");
    setSelectedOrders([]);
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

  return (
    <div className={`${responsive.isMobile ? 'p-3' : 'p-4 lg:p-6'} bg-white rounded-xl shadow-lg`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 ${responsive.isMobile ? 'p-1.5' : ''}`}>
            <Package className={`text-white ${responsive.isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          <div>
            <h2 className={`font-bold ${getHeaderSize()} text-gray-900`}>
              Manage Orders
            </h2>
            <p className={`text-gray-600 ${responsive.isMobile ? 'text-xs' : 'text-sm'}`}>
              {filteredOrders.length} orders • {responsive.isMobile ? 'Amazon-style' : 'Amazon-style dashboard'}
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
              <RefreshCw className={`${responsive.isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>
            
            <button
              onClick={handleExport}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${responsive.isMobile ? 'p-1.5' : ''}`}
              title="Export"
            >
              <Download className={`${responsive.isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>
            
            {responsive.isMobile && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!responsive.isMobile && (
        <div className={`grid ${responsive.isTablet ? 'grid-cols-2' : responsive.isLaptop ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-4'} gap-3 mb-6`}>
          {[
            { label: 'Total Orders', value: filteredOrders.length, color: 'bg-blue-50 text-blue-700', icon: Package },
            { label: 'Pending', value: filteredOrders.filter(o => o.status === 'Pending').length, color: 'bg-yellow-50 text-yellow-700', icon: AlertCircle },
            { label: 'Shipped', value: filteredOrders.filter(o => o.status === 'Shipped').length, color: 'bg-blue-50 text-blue-700', icon: Truck },
            { label: 'Delivered', value: filteredOrders.filter(o => o.status === 'Delivered').length, color: 'bg-green-50 text-green-700', icon: CheckCircle },
          ].map((stat, index) => (
            <div key={index} className={`p-3 rounded-lg border ${stat.color} flex items-center justify-between`}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</div>
                <div className={`font-bold ${responsive.isTablet ? 'text-xl' : 'text-2xl'} mt-1`}>{stat.value}</div>
              </div>
              <stat.icon className={`${responsive.isTablet ? 'w-8 h-8' : 'w-10 h-10'} opacity-20`} />
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {responsive.isMobile ? (
        <MobileFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          fulfillmentFilter={fulfillmentFilter}
          setFulfillmentFilter={setFulfillmentFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          deviceType={responsive.deviceType}
        />
      ) : (
        <DesktopFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          fulfillmentFilter={fulfillmentFilter}
          setFulfillmentFilter={setFulfillmentFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          deviceType={responsive.deviceType}
        />
      )}

      {/* Bulk Actions - Desktop */}
      {!responsive.isMobile && selectedOrders.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedOrders.length} orders selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("Print Invoices")}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print All
            </button>
            <button
              onClick={() => handleBulkAction("Confirm Shipment")}
              className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Ship All
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Orders Display */}
      {responsive.isMobile ? (
        // Mobile: Card View
        <div className="mb-6">
          {paginatedOrders.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No orders found</p>
              <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  statusColors={statusColors}
                  onAction={handleOrderAction}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Tablet & Desktop: Table View
        <OrderTable
          orders={paginatedOrders}
          statusColors={statusColors}
          onAction={handleOrderAction}
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
          Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
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

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Shipped</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Delivered</span>
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

export default ManageOrders;