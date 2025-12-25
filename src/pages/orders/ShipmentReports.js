import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Truck,
  X,
  Menu,
  MoreVertical,
  Eye,
  FileText,
  BarChart3,
  Printer,
  Mail,
  Smartphone,
  Tablet,
  Laptop,
  Monitor
} from "lucide-react";

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
      const breakpoints = [
        { name: 'xs', min: 0, max: 480 },
        { name: 'sm', min: 481, max: 640 },
        { name: 'md', min: 641, max: 768 },
        { name: 'lg', min: 769, max: 1024 },
        { name: 'xl', min: 1025, max: 1280 },
        { name: '2xl', min: 1281, max: 1536 },
        { name: '3xl', min: 1537, max: 1920 },
        { name: '4xl', min: 1921, max: Infinity }
      ];

      const current = breakpoints.find(bp => width >= bp.min && width <= bp.max) || breakpoints[0];
      setBreakpoint(current.name);

      // Determine device type
      if (width < 641) setDeviceType('mobile');
      else if (width < 769) setDeviceType('tablet');
      else if (width < 1025) setDeviceType('laptop');
      else if (width < 1537) setDeviceType('desktop');
      else setDeviceType('large-desktop');
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    deviceType,
    breakpoint,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isLaptop: deviceType === 'laptop',
    isDesktop: deviceType === 'desktop',
    isLargeDesktop: deviceType === 'large-desktop'
  };
};

// Device Icon Component
const DeviceIcon = ({ deviceType, size = 20 }) => {
  const icons = {
    mobile: <Smartphone size={size} />,
    tablet: <Tablet size={size} />,
    laptop: <Laptop size={size} />,
    desktop: <Monitor size={size} />,
    'large-desktop': <Monitor size={size} />
  };
  
  return icons[deviceType] || <Monitor size={size} />;
};

// Shipment Card for Mobile View
const ShipmentCard = ({ shipment, deviceType }) => {
  const isMobile = deviceType === 'mobile';
  
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-3 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-blue-700 text-sm">{shipment.id}</div>
          <div className="text-xs text-gray-500">{shipment.date}</div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          shipment.status === "Completed"
            ? "bg-green-100 text-green-700"
            : shipment.status === "In Transit"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}>
          {isMobile ? shipment.status.split(' ')[0] : shipment.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Received</div>
          <div className="font-bold text-gray-900 text-lg">{shipment.received}</div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Shipped</div>
          <div className="font-bold text-gray-900 text-lg">{shipment.shipped}</div>
        </div>
      </div>

      {/* Carrier */}
      <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs text-gray-500 mb-1">Carrier</div>
        <div className="font-medium text-blue-900 text-sm">{shipment.carrier}</div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
          <div className="flex items-center justify-center gap-1">
            <Eye size={14} />
            <span>View</span>
          </div>
        </button>
        <button className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
          <div className="flex items-center justify-center gap-1">
            <FileText size={14} />
            <span>Report</span>
          </div>
        </button>
        <button className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  );
};

// Mobile Filters Component
const MobileFilters = ({ 
  filter, 
  setFilter, 
  status, 
  setStatus, 
  dateRange, 
  setDateRange,
  showFilters,
  setShowFilters,
  deviceType 
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search Shipment ID"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {filter && (
          <button
            onClick={() => setFilter("")}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
          {(status !== 'all' || dateRange !== 'last7') && (
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
        <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'Created', 'In Transit', 'Completed'].map((stat) => (
                <button
                  key={stat}
                  onClick={() => setStatus(stat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    status === stat
                      ? stat === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : {
                            'Created': 'bg-blue-100 text-blue-700 border border-blue-300',
                            'In Transit': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
                            'Completed': 'bg-green-100 text-green-700 border border-green-300'
                          }[stat]
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {stat === 'all' ? 'All' : stat}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm"
            >
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ShipmentsReports() {
  const [shipments, setShipments] = useState([]);
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("last7");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inTransit: 0,
    created: 0,
    totalReceived: 0,
    totalShipped: 0
  });

  const responsive = useResponsive();
  const { isMobile, isTablet, isLaptop, isDesktop, isLargeDesktop, deviceType } = responsive;

  // Get padding based on device
  const getPadding = () => {
    if (isMobile) return 'p-3';
    if (isTablet) return 'p-4';
    if (isLaptop) return 'p-5';
    if (isDesktop) return 'p-6';
    return 'p-8';
  };

  // Get container max width
  const getContainerMaxWidth = () => {
    if (isLargeDesktop) return 'max-w-screen-2xl';
    if (isDesktop) return 'max-w-7xl';
    if (isLaptop) return 'max-w-6xl';
    if (isTablet) return 'max-w-4xl';
    return 'max-w-full';
  };

  // Get header font size
  const getHeaderSize = () => {
    if (isMobile) return 'text-xl';
    if (isTablet) return 'text-2xl';
    return 'text-3xl';
  };

  const fetchShipments = async () => {
    setLoading(true);
    // Replace with API call
    setTimeout(() => {
      const data = [
        {
          id: "FBA15DF89",
          date: "2025-12-02",
          received: "120",
          shipped: "118",
          status: "Completed",
          carrier: "Amazon Logistics",
          destination: "Amazon Fulfillment Center, Delhi",
          items: 45,
          weight: "450 kg",
          tracking: "TRK789012345",
          notes: "On time delivery"
        },
        {
          id: "FBA78KLD2",
          date: "2025-12-03",
          received: "80",
          shipped: "78",
          status: "In Transit",
          carrier: "Delhivery",
          destination: "Amazon Fulfillment Center, Mumbai",
          items: 32,
          weight: "320 kg",
          tracking: "TRK789012346",
          notes: "Delayed due to weather"
        },
        {
          id: "FBA12LLK9",
          date: "2025-12-04",
          received: "0",
          shipped: "60",
          status: "Created",
          carrier: "BlueDart",
          destination: "Amazon Fulfillment Center, Bangalore",
          items: 25,
          weight: "250 kg",
          tracking: "TRK789012347",
          notes: "Awaiting pickup"
        },
        {
          id: "FBA45MNP3",
          date: "2025-12-01",
          received: "95",
          shipped: "92",
          status: "Completed",
          carrier: "Amazon Logistics",
          destination: "Amazon Fulfillment Center, Chennai",
          items: 38,
          weight: "380 kg",
          tracking: "TRK789012348",
          notes: "Successfully delivered"
        },
        {
          id: "FBA67QRS8",
          date: "2025-11-30",
          received: "70",
          shipped: "68",
          status: "In Transit",
          carrier: "DTDC",
          destination: "Amazon Fulfillment Center, Hyderabad",
          items: 28,
          weight: "280 kg",
          tracking: "TRK789012349",
          notes: "Expected delivery today"
        }
      ];
      setShipments(data);
      
      // Calculate stats
      const stats = {
        total: data.length,
        completed: data.filter(s => s.status === "Completed").length,
        inTransit: data.filter(s => s.status === "In Transit").length,
        created: data.filter(s => s.status === "Created").length,
        totalReceived: data.reduce((sum, s) => sum + parseInt(s.received), 0),
        totalShipped: data.reduce((sum, s) => sum + parseInt(s.shipped), 0)
      };
      setStats(stats);
      
      setLoading(false);
    }, 700);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const filteredShipments = shipments.filter((s) => {
    return (
      s.id.toLowerCase().includes(filter.toLowerCase()) ||
      s.carrier.toLowerCase().includes(filter.toLowerCase()) ||
      s.destination.toLowerCase().includes(filter.toLowerCase())
    ) && (status === "all" || s.status === status);
  });

  // Desktop Filters Component
  const DesktopFilters = () => {
    return (
      <div className={`grid gap-3 mb-6 ${
        isTablet ? 'grid-cols-3' : 
        isLaptop ? 'grid-cols-4' : 
        isDesktop ? 'grid-cols-5' : 
        'grid-cols-6'
      }`}>
        {/* Search */}
        <div className={isTablet ? 'col-span-2' : ''}>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search shipments..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          className="border border-gray-300 rounded-lg p-2 bg-white text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">📊 All Status</option>
          <option value="Created">🔵 Created</option>
          <option value="In Transit">🟡 In Transit</option>
          <option value="Completed">🟢 Completed</option>
        </select>

        {/* Date Range - Hide on tablet */}
        {!isTablet && (
          <select
            className="border border-gray-300 rounded-lg p-2 bg-white text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last7">📅 Last 7 Days</option>
            <option value="last30">📅 Last 30 Days</option>
            <option value="thisMonth">📅 This Month</option>
            <option value="custom">📅 Custom Range</option>
          </select>
        )}

        {/* Carrier Filter - Only on desktop+ */}
        {(isDesktop || isLargeDesktop) && (
          <select className="border border-gray-300 rounded-lg p-2 bg-white text-sm">
            <option value="all">🚚 All Carriers</option>
            <option value="Amazon Logistics">Amazon Logistics</option>
            <option value="Delhivery">Delhivery</option>
            <option value="BlueDart">BlueDart</option>
            <option value="DTDC">DTDC</option>
          </select>
        )}

        {/* Export Button */}
        <button className={`${isMobile ? 'w-full' : ''} px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2 text-sm`}>
          <Download size={16} />
          <span>{isMobile ? 'Export' : 'Export CSV'}</span>
        </button>
      </div>
    );
  };

  // Responsive Table Component
  const ShipmentsTable = ({ shipments }) => {
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

    // Determine columns to show based on device
    const getTableHeaders = () => {
      if (isTablet) {
        return [
          { key: 'id', label: 'Shipment ID', sortable: true },
          { key: 'date', label: 'Date', sortable: true },
          { key: 'received', label: 'Received', sortable: true },
          { key: 'shipped', label: 'Shipped', sortable: true },
          { key: 'status', label: 'Status', sortable: false },
          { key: 'actions', label: 'Actions', sortable: false }
        ];
      } else if (isLaptop) {
        return [
          { key: 'id', label: 'Shipment ID', sortable: true },
          { key: 'date', label: 'Date', sortable: true },
          { key: 'received', label: 'Received', sortable: true },
          { key: 'shipped', label: 'Shipped', sortable: true },
          { key: 'carrier', label: 'Carrier', sortable: true },
          { key: 'status', label: 'Status', sortable: true },
          { key: 'actions', label: 'Actions', sortable: false }
        ];
      } else if (isDesktop) {
        return [
          { key: 'id', label: 'Shipment ID', sortable: true },
          { key: 'date', label: 'Date', sortable: true },
          { key: 'received', label: 'Received', sortable: true },
          { key: 'shipped', label: 'Shipped', sortable: true },
          { key: 'carrier', label: 'Carrier', sortable: true },
          { key: 'items', label: 'Items', sortable: true },
          { key: 'status', label: 'Status', sortable: true },
          { key: 'actions', label: 'Actions', sortable: false }
        ];
      } else {
        // Large Desktop
        return [
          { key: 'id', label: 'Shipment ID', sortable: true },
          { key: 'date', label: 'Date', sortable: true },
          { key: 'received', label: 'Received', sortable: true },
          { key: 'shipped', label: 'Shipped', sortable: true },
          { key: 'carrier', label: 'Carrier', sortable: true },
          { key: 'items', label: 'Items', sortable: true },
          { key: 'weight', label: 'Weight', sortable: true },
          { key: 'destination', label: 'Destination', sortable: true },
          { key: 'status', label: 'Status', sortable: true },
          { key: 'actions', label: 'Actions', sortable: false }
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
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr 
                  key={shipment.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Shipment ID */}
                  <td className="p-3">
                    <div className="font-semibold text-blue-700 text-sm">{shipment.id}</div>
                    {isTablet && shipment.tracking && (
                      <div className="text-xs text-gray-500 mt-1">{shipment.tracking.substring(0, 8)}...</div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="p-3">
                    <div className="text-sm text-gray-900">{formatDate(shipment.date)}</div>
                  </td>

                  {/* Received */}
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{shipment.received}</div>
                    {(isDesktop || isLargeDesktop) && shipment.items && (
                      <div className="text-xs text-gray-500 mt-1">{shipment.items} items</div>
                    )}
                  </td>

                  {/* Shipped */}
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{shipment.shipped}</div>
                  </td>

                  {/* Carrier - Hidden on tablet */}
                  {(!isTablet) && (
                    <td className="p-3">
                      <div className="text-sm text-gray-900">{shipment.carrier}</div>
                      {deviceType === 'large-desktop' && shipment.tracking && (
                        <div className="text-xs text-gray-500">{shipment.tracking}</div>
                      )}
                    </td>
                  )}

                  {/* Items - Only on desktop+ */}
                  {(isDesktop || isLargeDesktop) && (
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {shipment.items}
                      </span>
                    </td>
                  )}

                  {/* Weight - Only on large desktop */}
                  {deviceType === 'large-desktop' && (
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{shipment.weight}</div>
                    </td>
                  )}

                  {/* Destination - Only on large desktop */}
                  {deviceType === 'large-desktop' && (
                    <td className="p-3">
                      <div className="text-sm text-gray-900 line-clamp-2">{shipment.destination}</div>
                    </td>
                  )}

                  {/* Status */}
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      shipment.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : shipment.status === "In Transit"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {isTablet ? shipment.status.split(' ')[0] : shipment.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex gap-1 justify-end">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Generate Report"
                      >
                        <FileText size={14} />
                      </button>
                      {(isDesktop || deviceType === 'large-desktop') && (
                        <button
                          className="p-1 text-purple-600 hover:text-purple-800"
                          title="Track Shipment"
                        >
                          <Truck size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${getContainerMaxWidth()} mx-auto ${getPadding()}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 ${isMobile ? 'p-1.5' : ''}`}>
            <Truck className={`text-white ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          <div>
            <h2 className={`font-bold ${getHeaderSize()} text-gray-900`}>
              Shipments Reports
            </h2>
            <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {stats.total} shipments • {stats.totalReceived} received • {stats.totalShipped} shipped
              {isDesktop && ` • Last updated: ${new Date().toLocaleTimeString()}`}
            </p>
          </div>
        </div>

        {/* Device Indicator & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {!isMobile && (
            <div className={`flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium`}>
              <DeviceIcon deviceType={deviceType} size={12} />
              <span className="text-gray-700">{deviceType.toUpperCase()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={fetchShipments}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${isMobile ? 'p-1.5' : ''}`}
              title="Refresh"
              disabled={loading}
            >
              <RefreshCw className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => window.print()}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${isMobile ? 'p-1.5' : ''}`}
              title="Print"
            >
              <Printer className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>

            {isDesktop && (
              <button
                onClick={() => alert('Email report')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
              >
                <Mail size={16} />
                <span>Email Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!isMobile && (
        <div className={`grid ${isTablet ? 'grid-cols-2' : isLaptop ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-4'} gap-3 mb-6`}>
          {[
            { 
              label: 'Total Shipments', 
              value: stats.total, 
              color: 'bg-gray-50 text-gray-700 border-gray-200',
              icon: Truck,
              trend: '▲ 12%'
            },
            { 
              label: 'Completed', 
              value: stats.completed, 
              color: 'bg-green-50 text-green-700 border-green-200',
              icon: CheckCircle,
              trend: '▲ 8%'
            },
            { 
              label: 'In Transit', 
              value: stats.inTransit, 
              color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
              icon: Clock,
              trend: '▼ 5%'
            },
            { 
              label: 'Total Shipped', 
              value: stats.totalShipped, 
              color: 'bg-blue-50 text-blue-700 border-blue-200',
              icon: Package,
              trend: '▲ 15%'
            },
          ].map((stat, index) => (
            <div key={index} className={`p-3 rounded-lg border ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</div>
                  <div className={`font-bold ${isTablet ? 'text-xl' : 'text-2xl'} mt-1`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.trend}</div>
                </div>
                <stat.icon className={`${isTablet ? 'w-8 h-8' : 'w-10 h-10'} opacity-20`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats Bar - Mobile */}
      {isMobile && (
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
              { label: 'Completed', value: stats.completed, color: 'bg-green-100 text-green-700' },
              { label: 'Transit', value: stats.inTransit, color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Shipped', value: stats.totalShipped, color: 'bg-blue-100 text-blue-700' },
            ].map((stat, index) => (
              <div key={index} className={`p-2 rounded-lg text-center ${stat.color}`}>
                <div className="font-bold text-lg">{stat.value}</div>
                <div className="text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {isMobile ? (
        <MobileFilters
          filter={filter}
          setFilter={setFilter}
          status={status}
          setStatus={setStatus}
          dateRange={dateRange}
          setDateRange={setDateRange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          deviceType={deviceType}
        />
      ) : (
        <DesktopFilters />
      )}

      {/* Shipments Display */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading shipments...</p>
        </div>
      ) : isMobile ? (
        // Mobile: Card View
        <div className="mb-6">
          {filteredShipments.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No shipments found</p>
              <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredShipments.map((shipment) => (
                <ShipmentCard
                  key={shipment.id}
                  shipment={shipment}
                  deviceType={deviceType}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Tablet & Desktop: Table View
        <ShipmentsTable shipments={filteredShipments} />
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {filteredShipments.length} of {shipments.length} shipments
          {!isMobile && (
            <span className="ml-2">• Received: {stats.totalReceived} • Shipped: {stats.totalShipped}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 bg-gray-100 hover:bg-gray-200`}
          >
            <ChevronLeft size={16} />
            {isMobile ? 'Prev' : 'Previous'}
          </button>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg text-sm font-medium bg-blue-600 text-white">
              1
            </button>
            <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              2
            </button>
            <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              3
            </button>
          </div>

          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 bg-gray-100 hover:bg-gray-200`}
          >
            {isMobile ? 'Next' : 'Next'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-blue-900">Shipments Summary</h3>
          <BarChart3 size={18} className="text-blue-600" />
        </div>
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">Avg. Items/Shipment</div>
            <div className="font-bold text-gray-900">
              {shipments.length > 0 ? Math.round(shipments.reduce((sum, s) => sum + (s.items || 0), 0) / shipments.length) : 0}
            </div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">On-time Rate</div>
            <div className="font-bold text-green-600">92%</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">Carrier Count</div>
            <div className="font-bold text-gray-900">
              {[...new Set(shipments.map(s => s.carrier))].length}
            </div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">Total Weight</div>
            <div className="font-bold text-blue-600">
              {shipments.reduce((sum, s) => sum + parseInt(s.weight?.replace(' kg', '') || 0), 0)} kg
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>In Transit</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Created</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DeviceIcon deviceType={deviceType} size={12} />
            <span>{deviceType} • {responsive.windowSize.width}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing icons from imports
const CheckCircle = ({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Clock = ({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Package = ({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);