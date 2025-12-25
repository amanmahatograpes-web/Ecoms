import React, { useState, useMemo, useEffect } from 'react';
import { 
  FiPackage, FiArrowLeft, FiDollarSign, FiTrendingUp,
  FiTrendingDown, FiFilter, FiSearch, FiDownload, FiPrinter,
  FiRefreshCw, FiEye, FiEdit, FiCheckCircle, FiXCircle,
  FiClock, FiAlertCircle, FiBarChart2, FiPieChart, FiGrid,
  FiList, FiChevronDown, FiChevronUp, FiCalendar, FiSettings,
  FiShare2, FiCreditCard, FiUsers, FiShoppingCart, FiPercent,
  FiTruck, FiArchive, FiMaximize2, FiMessageSquare, FiStar
} from 'react-icons/fi';
import { 
  FaAmazon, FaRegCalendarAlt, FaFilter as FaFilterSolid,
  FaSortAmountDown, FaSortAmountUp, FaExclamationTriangle,
  FaBoxOpen, FaShippingFast, FaRegClock, FaChartLine
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ReturnReports = () => {
  const [timeRange, setTimeRange] = useState('last30days');
  const [viewMode, setViewMode] = useState('overview');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('returnDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReturns, setSelectedReturns] = useState(new Set());
  const [showResolved, setShowResolved] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [showRejected, setShowRejected] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Time ranges
  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last7days', label: 'Last 7 Days' },
    { id: 'last30days', label: 'Last 30 Days', default: true },
    { id: 'last90days', label: 'Last 90 Days' },
    { id: 'lastYear', label: 'Last Year' },
    { id: 'monthToDate', label: 'Month to Date' },
    { id: 'custom', label: 'Custom Range' },
  ];

  // Return statuses
  const returnStatuses = [
    { id: 'all', label: 'All Returns', color: 'gray' },
    { id: 'pending', label: 'Pending Approval', color: 'yellow' },
    { id: 'approved', label: 'Approved', color: 'blue' },
    { id: 'in_transit', label: 'In Transit', color: 'purple' },
    { id: 'received', label: 'Received', color: 'green' },
    { id: 'refunded', label: 'Refunded', color: 'green' },
    { id: 'rejected', label: 'Rejected', color: 'red' },
    { id: 'cancelled', label: 'Cancelled', color: 'gray' },
  ];

  // Return reasons
  const returnReasons = [
    { id: 'defective', label: 'Defective/Damaged', count: 45 },
    { id: 'wrong_item', label: 'Wrong Item Sent', count: 23 },
    { id: 'no_longer_needed', label: 'No Longer Needed', count: 67 },
    { id: 'better_price', label: 'Found Better Price', count: 12 },
    { id: 'not_as_described', label: 'Not As Described', count: 34 },
    { id: 'missing_parts', label: 'Missing Parts', count: 19 },
    { id: 'arrived_late', label: 'Arrived Too Late', count: 28 },
    { id: 'size_issue', label: 'Size/Fit Issue', count: 56 },
  ];

  // Returns data
  const returnsData = useMemo(() => [
    {
      id: 'RET001',
      orderId: '112-4567890-1234567',
      customer: 'John Smith',
      email: 'john.smith@email.com',
      product: 'Apple AirPods Pro (2nd Gen)',
      sku: 'AMZ-ELEC-001',
      returnDate: '2024-01-15',
      reason: 'defective',
      status: 'pending',
      refundAmount: 249.99,
      refundStatus: 'pending',
      returnMethod: 'amazon_dropoff',
      trackingNumber: '1Z9876543210987654',
      returnLabel: 'generated',
      notes: 'Customer reports right earbud not working',
      resolution: null,
      daysOpen: 2,
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1591370264374-9a5aef8df17a?w=400&h=400&fit=crop'
    },
    {
      id: 'RET002',
      orderId: '112-9876543-2109876',
      customer: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      product: 'Instant Pot Duo 7-in-1',
      sku: 'AMZ-HOME-001',
      returnDate: '2024-01-14',
      reason: 'no_longer_needed',
      status: 'approved',
      refundAmount: 89.99,
      refundStatus: 'processing',
      returnMethod: 'carrier_pickup',
      trackingNumber: '1Z1234567890123456',
      returnLabel: 'used',
      notes: 'Received as gift, already have one',
      resolution: 'Full refund upon receipt',
      daysOpen: 1,
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    },
    {
      id: 'RET003',
      orderId: '113-1234567-8901234',
      customer: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      product: 'Samsung 55" 4K Smart TV',
      sku: 'AMZ-ELEC-002',
      returnDate: '2024-01-13',
      reason: 'not_as_described',
      status: 'in_transit',
      refundAmount: 449.99,
      refundStatus: 'pending',
      returnMethod: 'customer_dropoff',
      trackingNumber: '1Z6543210987654321',
      returnLabel: 'printed',
      notes: 'Screen has dead pixels, not as advertised',
      resolution: 'Replacement offered',
      daysOpen: 3,
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'
    },
    {
      id: 'RET004',
      orderId: '114-5678901-2345678',
      customer: 'Emily Davis',
      email: 'emily.davis@email.com',
      product: 'Nike Men\'s Running Shoes',
      sku: 'AMZ-FASH-001',
      returnDate: '2024-01-12',
      reason: 'size_issue',
      status: 'received',
      refundAmount: 129.99,
      refundStatus: 'completed',
      returnMethod: 'amazon_dropoff',
      trackingNumber: '1Z7890123456789012',
      returnLabel: 'used',
      notes: 'Size too small, exchanged for larger size',
      resolution: 'Exchange completed',
      daysOpen: 0,
      priority: 'low',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    },
    {
      id: 'RET005',
      orderId: '115-2345678-9012345',
      customer: 'Robert Brown',
      email: 'robert.b@email.com',
      product: 'KitchenAid Stand Mixer',
      sku: 'AMZ-HOME-002',
      returnDate: '2024-01-11',
      reason: 'defective',
      status: 'refunded',
      refundAmount: 329.99,
      refundStatus: 'completed',
      returnMethod: 'carrier_pickup',
      trackingNumber: '1Z3456789012345678',
      returnLabel: 'used',
      notes: 'Motor makes grinding noise',
      resolution: 'Full refund issued',
      daysOpen: 0,
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1560448204-61dcf4e4f1bf?w=400&h=400&fit=crop'
    },
    {
      id: 'RET006',
      orderId: '116-8901234-5678901',
      customer: 'Lisa Miller',
      email: 'lisa.m@email.com',
      product: 'Dyson V11 Cordless Vacuum',
      sku: 'AMZ-ELEC-003',
      returnDate: '2024-01-10',
      reason: 'missing_parts',
      status: 'rejected',
      refundAmount: 0,
      refundStatus: 'rejected',
      returnMethod: 'customer_dropoff',
      trackingNumber: null,
      returnLabel: 'expired',
      notes: 'Customer opened outside return window',
      resolution: 'Return window expired',
      daysOpen: 5,
      priority: 'low',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    {
      id: 'RET007',
      orderId: '117-4567890-1234567',
      customer: 'David Wilson',
      email: 'david.w@email.com',
      product: 'LEGO Star Wars Millennium Falcon',
      sku: 'AMZ-TOYS-001',
      returnDate: '2024-01-09',
      reason: 'arrived_late',
      status: 'cancelled',
      refundAmount: 0,
      refundStatus: 'cancelled',
      returnMethod: null,
      trackingNumber: null,
      returnLabel: 'cancelled',
      notes: 'Customer cancelled return request',
      resolution: 'Customer kept item',
      daysOpen: 0,
      priority: 'low',
      image: 'https://images.unsplash.com/photo-1594787318281-7d21df6e1fd2?w=400&h=400&fit=crop'
    },
    {
      id: 'RET008',
      orderId: '118-9012345-6789012',
      customer: 'Jennifer Taylor',
      email: 'jennifer.t@email.com',
      product: 'Best-Selling Novel Collection',
      sku: 'AMZ-BOOK-001',
      returnDate: '2024-01-08',
      reason: 'wrong_item',
      status: 'pending',
      refundAmount: 24.99,
      refundStatus: 'pending',
      returnMethod: 'amazon_dropoff',
      trackingNumber: '1Z9012345678901234',
      returnLabel: 'generated',
      notes: 'Received wrong book edition',
      resolution: null,
      daysOpen: 7,
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop'
    },
    {
      id: 'RET009',
      orderId: '119-5678901-2345678',
      customer: 'Michael Anderson',
      email: 'michael.a@email.com',
      product: 'PlayStation 5 Console',
      sku: 'AMZ-ELEC-004',
      returnDate: '2024-01-07',
      reason: 'defective',
      status: 'approved',
      refundAmount: 499.99,
      refundStatus: 'processing',
      returnMethod: 'carrier_pickup',
      trackingNumber: '1Z2345678901234567',
      returnLabel: 'used',
      notes: 'Console overheating issue',
      resolution: 'Replacement being shipped',
      daysOpen: 1,
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop'
    },
    {
      id: 'RET010',
      orderId: '120-1234567-8901234',
      customer: 'Amanda Harris',
      email: 'amanda.h@email.com',
      product: 'Nespresso Vertuo Coffee Machine',
      sku: 'AMZ-HOME-003',
      returnDate: '2024-01-06',
      reason: 'better_price',
      status: 'refunded',
      refundAmount: 149.99,
      refundStatus: 'completed',
      returnMethod: 'customer_dropoff',
      trackingNumber: '1Z4567890123456789',
      returnLabel: 'used',
      notes: 'Found cheaper elsewhere',
      resolution: '15% restocking fee applied',
      daysOpen: 0,
      priority: 'low',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e7?w=400&h=400&fit=crop'
    },
    {
      id: 'RET011',
      orderId: '121-8901234-5678901',
      customer: 'Christopher Lee',
      email: 'chris.lee@email.com',
      product: 'Designer Handbag Collection',
      sku: 'AMZ-FASH-002',
      returnDate: '2024-01-05',
      reason: 'not_as_described',
      status: 'in_transit',
      refundAmount: 299.99,
      refundStatus: 'pending',
      returnMethod: 'amazon_dropoff',
      trackingNumber: '1Z5678901234567890',
      returnLabel: 'printed',
      notes: 'Color different from website',
      resolution: 'Refund upon inspection',
      daysOpen: 2,
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    },
    {
      id: 'RET012',
      orderId: '122-3456789-0123456',
      customer: 'Jessica White',
      email: 'jessica.w@email.com',
      product: 'Fitbit Charge 5 Fitness Tracker',
      sku: 'AMZ-ELEC-005',
      returnDate: '2024-01-04',
      reason: 'size_issue',
      status: 'received',
      refundAmount: 129.99,
      refundStatus: 'completed',
      returnMethod: 'carrier_pickup',
      trackingNumber: '1Z6789012345678901',
      returnLabel: 'used',
      notes: 'Band too tight',
      resolution: 'Refund issued',
      daysOpen: 0,
      priority: 'low',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
  ], []);

  // Calculate metrics
  const returnMetrics = useMemo(() => {
    const totalReturns = returnsData.length;
    const pendingReturns = returnsData.filter(r => r.status === 'pending').length;
    const approvedReturns = returnsData.filter(r => r.status === 'approved').length;
    const refundedReturns = returnsData.filter(r => r.status === 'refunded').length;
    const totalRefundAmount = returnsData.reduce((sum, r) => sum + r.refundAmount, 0);
    const averageRefundAmount = totalRefundAmount / returnsData.length;
    const returnRate = 8.7; // This would be calculated from total orders
    const averageResolutionTime = 2.3; // Average days
    
    return {
      totalReturns,
      pendingReturns,
      approvedReturns,
      refundedReturns,
      totalRefundAmount,
      averageRefundAmount,
      returnRate,
      averageResolutionTime,
    };
  }, [returnsData]);

  // Filter returns data
  const filteredReturns = useMemo(() => {
    let result = [...returnsData];
    
    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(item => item.status === selectedStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.customer.toLowerCase().includes(query) ||
        item.orderId.toLowerCase().includes(query) ||
        item.product.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query)
      );
    }
    
    // Show/hide filters
    if (!showResolved) {
      result = result.filter(item => !['refunded', 'rejected', 'cancelled'].includes(item.status));
    }
    if (!showPending) {
      result = result.filter(item => item.status !== 'pending');
    }
    if (!showRejected) {
      result = result.filter(item => item.status !== 'rejected');
    }
    
    // Sort data
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'returnDate':
          aValue = new Date(a.returnDate);
          bValue = new Date(b.returnDate);
          break;
        case 'customer':
          aValue = a.customer;
          bValue = b.customer;
          break;
        case 'refundAmount':
          aValue = a.refundAmount;
          bValue = b.refundAmount;
          break;
        case 'daysOpen':
          aValue = a.daysOpen;
          bValue = b.daysOpen;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        default:
          aValue = new Date(a.returnDate);
          bValue = new Date(b.returnDate);
      }
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - aValue;
      }
    });
    
    return result;
  }, [returnsData, selectedStatus, searchQuery, sortBy, sortOrder, showResolved, showPending, showRejected]);

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <FiClock /> },
      approved: { label: 'Approved', color: 'bg-blue-100 text-blue-800', icon: <FiCheckCircle /> },
      in_transit: { label: 'In Transit', color: 'bg-purple-100 text-purple-800', icon: <FiTruck /> },
      received: { label: 'Received', color: 'bg-green-100 text-green-800', icon: <FiPackage /> },
      refunded: { label: 'Refunded', color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: <FiXCircle /> },
      cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: <FiXCircle /> },
    };
    
    const { label, color, icon } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        <span className="ml-1">{label}</span>
      </span>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const config = {
      high: { label: 'High', color: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low', color: 'bg-green-100 text-green-800' },
    };
    
    const { label, color } = config[priority] || config.medium;
    
    return <span className={`px-2 py-1 rounded text-xs ${color}`}>{label}</span>;
  };

  // Get reason badge
  const getReasonBadge = (reason) => {
    const reasonMap = {
      defective: { label: 'Defective', color: 'bg-red-50 text-red-700' },
      wrong_item: { label: 'Wrong Item', color: 'bg-yellow-50 text-yellow-700' },
      no_longer_needed: { label: 'Not Needed', color: 'bg-blue-50 text-blue-700' },
      better_price: { label: 'Better Price', color: 'bg-purple-50 text-purple-700' },
      not_as_described: { label: 'Not as Described', color: 'bg-orange-50 text-orange-700' },
      missing_parts: { label: 'Missing Parts', color: 'bg-pink-50 text-pink-700' },
      arrived_late: { label: 'Arrived Late', color: 'bg-indigo-50 text-indigo-700' },
      size_issue: { label: 'Size Issue', color: 'bg-teal-50 text-teal-700' },
    };
    
    const { label, color } = reasonMap[reason] || { label: 'Other', color: 'bg-gray-50 text-gray-700' };
    
    return <span className={`px-2 py-1 rounded text-xs ${color}`}>{label}</span>;
  };

  // Process return
  const processReturn = (returnId, action) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      console.log(`Processed return ${returnId} with action: ${action}`);
    }, 1000);
  };

  // Export report
  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Exported ${format} report`);
    }, 1500);
  };

  // Return trends chart
  const ReturnTrendsChart = () => {
    const trendsData = [
      { month: 'Jul', returns: 45, refunds: 38 },
      { month: 'Aug', returns: 52, refunds: 44 },
      { month: 'Sep', returns: 48, refunds: 41 },
      { month: 'Oct', returns: 56, refunds: 47 },
      { month: 'Nov', returns: 67, refunds: 58 },
      { month: 'Dec', returns: 89, refunds: 76 },
      { month: 'Jan', returns: 42, refunds: 36 },
    ];
    
    const maxReturns = Math.max(...trendsData.map(d => d.returns));
    
    return (
      <div className="h-64 mt-4">
        <div className="flex h-full items-end space-x-1">
          {trendsData.map((data, index) => {
            const returnHeight = (data.returns / maxReturns) * 100;
            const refundHeight = (data.refunds / maxReturns) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center" style={{ height: '180px' }}>
                  {/* Refunds bar */}
                  <div 
                    className="absolute w-6 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg group"
                    style={{ height: `${refundHeight}%`, bottom: '0', right: '50%', marginRight: '4px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.refunds} refunds
                    </div>
                  </div>
                  
                  {/* Returns bar */}
                  <div 
                    className="absolute w-6 bg-gradient-to-t from-red-400 to-red-500 rounded-t-lg group"
                    style={{ height: `${returnHeight}%`, bottom: '0', left: '50%', marginLeft: '4px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.returns} returns
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">{data.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Return reasons chart
  const ReturnReasonsChart = () => {
    return (
      <div className="space-y-3">
        {returnReasons.map((reason, index) => {
          const percentage = (reason.count / returnReasons.reduce((sum, r) => sum + r.count, 0)) * 100;
          
          return (
            <div key={reason.id} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">{reason.label}</span>
                <span className="text-sm font-bold text-gray-900">{reason.count}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{percentage.toFixed(1)}% of returns</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Return card component
  const ReturnCard = ({ returnItem }) => {
    const isSelected = selectedReturns.has(returnItem.id);
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white rounded-xl border ${isSelected ? 'border-blue-500' : 'border-gray-200'} hover:shadow-lg transition-all`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center mb-1 space-x-2">
                {getStatusBadge(returnItem.status)}
                {getPriorityBadge(returnItem.priority)}
              </div>
              <h4 className="font-semibold text-gray-900 line-clamp-1">{returnItem.product}</h4>
              <p className="text-sm text-gray-500">Order: {returnItem.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">${returnItem.refundAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Refund</p>
            </div>
          </div>
          
          {/* Customer Info */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <FiUsers className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{returnItem.customer}</p>
                  <p className="text-xs text-gray-500">{returnItem.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{returnItem.returnDate}</p>
                <p className="text-xs text-gray-500">Return Date</p>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Reason</p>
              <div className="mt-1">{getReasonBadge(returnItem.reason)}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Days Open</p>
              <p className={`text-lg font-bold ${
                returnItem.daysOpen > 5 ? 'text-red-600' :
                returnItem.daysOpen > 2 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {returnItem.daysOpen}d
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">SKU</p>
              <p className="text-sm font-mono text-gray-900 truncate">{returnItem.sku}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Tracking</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {returnItem.trackingNumber || 'Not available'}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            {returnItem.status === 'pending' && (
              <>
                <button 
                  onClick={() => processReturn(returnItem.id, 'approve')}
                  className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 font-medium py-2 rounded-lg"
                >
                  <FiCheckCircle className="inline mr-1" /> Approve
                </button>
                <button 
                  onClick={() => processReturn(returnItem.id, 'reject')}
                  className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 font-medium py-2 rounded-lg"
                >
                  <FiXCircle className="inline mr-1" /> Reject
                </button>
              </>
            )}
            {returnItem.status === 'approved' && (
              <button className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium py-2 rounded-lg">
                <FiTruck className="inline mr-1" /> Track Shipment
              </button>
            )}
            {['received', 'refunded', 'rejected', 'cancelled'].includes(returnItem.status) && (
              <button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 rounded-lg">
                <FiEye className="inline mr-1" /> View Details
              </button>
            )}
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiMessageSquare />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <FiArrowLeft className="text-2xl mr-3" />
                <h1 className="text-2xl font-bold">Returns & Refunds Reports</h1>
              </div>
              <p className="text-blue-100">Track returns, process refunds, and analyze return patterns</p>
            </div>
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center">
                <FiSettings className="mr-2" />
                Settings
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center">
                <FiDownload className="mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold text-gray-900">{returnMetrics.totalReturns}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <FiArrowLeft className="text-xl" />
              </div>
            </div>
            <div className={`flex items-center ${returnMetrics.returnRate > 10 ? 'text-red-600' : 'text-green-600'}`}>
              {returnMetrics.returnRate > 10 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              <span className="text-sm">{returnMetrics.returnRate}% return rate</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Pending Returns</p>
                <p className="text-2xl font-bold text-yellow-600">{returnMetrics.pendingReturns}</p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <FiClock className="text-xl" />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {returnMetrics.approvedReturns} approved, {returnMetrics.refundedReturns} refunded
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Refunds</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(returnMetrics.totalRefundAmount / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <FiDollarSign className="text-xl" />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Avg: ${returnMetrics.averageRefundAmount.toFixed(2)} per return
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Resolution Time</p>
                <p className="text-2xl font-bold text-gray-900">{returnMetrics.averageResolutionTime}d</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <FiCheckCircle className="text-xl" />
              </div>
            </div>
            <div className="text-sm text-green-600">
              <FiTrendingDown className="inline mr-1" />
              <span>Improving from 3.2d last month</span>
            </div>
          </motion.div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            {/* Left Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Time Range */}
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-8 py-2 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timeRanges.map(range => (
                    <option key={range.id} value={range.id}>{range.label}</option>
                  ))}
                </select>
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-8 py-2 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {returnStatuses.map(status => (
                    <option key={status.id} value={status.id}>{status.label}</option>
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
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('overview')}
                  className={`px-3 py-2 ${viewMode === 'overview' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-3 py-2 ${viewMode === 'detailed' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
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
              
              <button className="flex items-center text-gray-600 hover:text-gray-900">
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
                checked={showPending}
                onChange={(e) => setShowPending(e.target.checked)}
                className="rounded text-yellow-500 focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">Show Pending ({returnMetrics.pendingReturns})</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded text-green-500 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Show Resolved</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showRejected}
                onChange={(e) => setShowRejected(e.target.checked)}
                className="rounded text-red-500 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Show Rejected</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-refresh every 5min</span>
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Return Trends Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Return Trends</h3>
                  <p className="text-gray-600">Returns vs Refunds over time</p>
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
              <ReturnTrendsChart />
              <div className="flex justify-center space-x-6 mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Returns</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Refunds</span>
                </div>
              </div>
            </div>

            {/* Return Reasons */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Return Reasons</h3>
                  <p className="text-gray-600">Most common reasons for returns</p>
                </div>
                <FaExclamationTriangle className="text-gray-400 text-xl" />
              </div>
              <ReturnReasonsChart />
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 font-medium py-3 rounded-lg flex items-center justify-center"
                >
                  {isExporting ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" />
                      Export Returns Report
                    </>
                  )}
                </button>
                
                <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 font-medium py-3 rounded-lg flex items-center justify-center">
                  <FiPrinter className="mr-2" />
                  Print Return Labels
                </button>
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="mr-2" />
                  Bulk Approve Returns
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 rounded-lg text-sm">
                    <FiShare2 className="inline mr-2" />
                    Share
                  </button>
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 rounded-lg text-sm">
                    <FiArchive className="inline mr-2" />
                    Archive
                  </button>
                </div>
              </div>
            </div>

            {/* Return Guidelines */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Return Guidelines</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">30-Day Return Window</p>
                    <p className="text-sm text-gray-600">Most items eligible within 30 days</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Free Returns</p>
                    <p className="text-sm text-gray-600">Free return shipping for eligible items</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Instant Refunds</p>
                    <p className="text-sm text-gray-600">Refunds processed within 2 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Return Products */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Returned</h3>
              <div className="space-y-3">
                {returnsData
                  .filter((item, index, self) => 
                    self.findIndex(t => t.sku === item.sku) === index
                  )
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.product}</p>
                          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">High</p>
                        <p className="text-xs text-gray-500">Return Rate</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Returns List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Return Requests</h2>
              <p className="text-gray-600">{filteredReturns.length} returns found</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="returnDate">Sort by Date</option>
                <option value="customer">Sort by Customer</option>
                <option value="refundAmount">Sort by Amount</option>
                <option value="daysOpen">Sort by Days Open</option>
                <option value="priority">Sort by Priority</option>
              </select>
              
              {selectedReturns.size > 0 && (
                <button className="bg-green-100 text-green-700 hover:bg-green-200 font-medium px-4 py-2 rounded-lg flex items-center">
                  <FiCheckCircle className="mr-2" />
                  Approve ({selectedReturns.size})
                </button>
              )}
            </div>
          </div>
          
          {/* Grid/List View */}
          {viewMode === 'overview' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReturns.map((returnItem) => (
                <ReturnCard key={returnItem.id} returnItem={returnItem} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Order ID</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Customer</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Product</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Days Open</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReturns.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedReturns.has(item.id)}
                          onChange={(e) => {
                            const newSet = new Set(selectedReturns);
                            if (e.target.checked) {
                              newSet.add(item.id);
                            } else {
                              newSet.delete(item.id);
                            }
                            setSelectedReturns(newSet);
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">
                        <code className="text-sm font-mono text-gray-600">{item.orderId}</code>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.customer}</p>
                          <p className="text-sm text-gray-500">{item.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{item.product}</p>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col space-y-1">
                          {getStatusBadge(item.status)}
                          {getPriorityBadge(item.priority)}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">${item.refundAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{item.refundStatus}</p>
                      </td>
                      <td className="p-4">
                        <div className={`font-bold ${
                          item.daysOpen > 5 ? 'text-red-600' :
                          item.daysOpen > 2 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {item.daysOpen}d
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <FiEye />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-green-600">
                            <FiEdit />
                          </button>
                          {item.status === 'pending' && (
                            <button 
                              onClick={() => processReturn(item.id, 'approve')}
                              className="p-2 text-green-600 hover:text-green-800"
                            >
                              <FiCheckCircle />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnReports;