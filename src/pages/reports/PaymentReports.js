import React, { useState, useMemo, useEffect } from 'react';
import { 
  FiDownload, FiFilter, FiCalendar, FiTrendingUp, FiTrendingDown,
  FiDollarSign, FiCreditCard, FiCheckCircle, FiXCircle, FiClock,
  FiBarChart2, FiPieChart, FiGrid, FiList, FiChevronDown,
  FiChevronUp, FiEye, FiShare2, FiPrinter, FiRefreshCw, FiSettings,
  FiAlertCircle, FiPackage, FiShoppingCart, FiUsers, FiGlobe,
  FiArrowUpRight, FiArrowDownRight, FiMaximize2, FiFileText,
  FiPercent, FiCalendar as FiCal,
  FiArrowRight, FiCopy, FiExternalLink, FiDatabase
} from 'react-icons/fi';
import { FiSearch } from "react-icons/fi";

import { 
  FaAmazon, FaRegChartBar, FaChartLine, FaChartPie,
  FaFilter as FaFilterSolid, FaSortAmountDown, FaSortAmountUp,
  FaRegMoneyBillAlt, FaExchangeAlt, FaRegClock, FaCrown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const PaymentsReports = () => {
  const [timeRange, setTimeRange] = useState('last30days');
  const [reportType, setReportType] = useState('transactions');
  const [viewMode, setViewMode] = useState('dashboard');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [compareMode, setCompareMode] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // API states
  const [paymentsData, setPaymentsData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

  // API Headers with auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Generate mock data for fallback
  const generateMockSummaryData = () => ({
    totalRevenue: 125678.90,
    totalFees: 15678.45,
    netRevenue: 110000.45,
    pendingPayments: 23456.78,
    processedPayments: 102222.12,
    failedPayments: 1234.56,
    averageTransaction: 89.67,
    transactionCount: 1402,
    refunds: 5678.90,
    chargebacks: 1234.56,
    currency: 'USD'
  });

  const generateMockTransactions = () => [
    {
      id: 'TXN001',
      date: '2024-01-15',
      time: '14:30:22',
      orderId: 'ORDER-123456',
      customerId: 'CUST001',
      type: 'sale',
      amount: 249.99,
      fee: 37.50,
      net: 212.49,
      status: 'completed',
      paymentMethod: 'Visa',
      lastFour: '4242',
      gateway: 'Stripe',
      description: 'Apple AirPods Pro',
      currency: 'USD'
    },
    {
      id: 'TXN002',
      date: '2024-01-15',
      time: '11:15:45',
      orderId: 'ORDER-123457',
      customerId: 'CUST002',
      type: 'sale',
      amount: 89.99,
      fee: 13.50,
      net: 76.49,
      status: 'completed',
      paymentMethod: 'MasterCard',
      lastFour: '8888',
      gateway: 'PayPal',
      description: 'Instant Pot Duo',
      currency: 'USD'
    },
    {
      id: 'TXN003',
      date: '2024-01-14',
      time: '09:45:12',
      orderId: 'ORDER-123458',
      customerId: 'CUST003',
      type: 'refund',
      amount: -129.99,
      fee: -19.50,
      net: -110.49,
      status: 'completed',
      paymentMethod: 'Visa',
      lastFour: '4242',
      gateway: 'Stripe',
      description: 'Nike Running Shoes Refund',
      currency: 'USD'
    },
    {
      id: 'TXN004',
      date: '2024-01-14',
      time: '16:20:33',
      orderId: 'ORDER-123459',
      customerId: 'CUST004',
      type: 'sale',
      amount: 449.99,
      fee: 67.50,
      net: 382.49,
      status: 'pending',
      paymentMethod: 'American Express',
      lastFour: '1001',
      gateway: 'Amazon Pay',
      description: 'Samsung 55" 4K TV',
      currency: 'USD'
    },
    {
      id: 'TXN005',
      date: '2024-01-13',
      time: '13:55:19',
      orderId: 'ORDER-123460',
      customerId: 'CUST005',
      type: 'sale',
      amount: 329.99,
      fee: 49.50,
      net: 280.49,
      status: 'failed',
      paymentMethod: 'Visa',
      lastFour: '1234',
      gateway: 'Stripe',
      description: 'KitchenAid Mixer',
      currency: 'USD'
    },
    {
      id: 'TXN006',
      date: '2024-01-13',
      time: '10:30:45',
      orderId: 'ORDER-123461',
      customerId: 'CUST006',
      type: 'sale',
      amount: 549.99,
      fee: 82.50,
      net: 467.49,
      status: 'completed',
      paymentMethod: 'Discover',
      lastFour: '5678',
      gateway: 'Authorize.net',
      description: 'Dyson V11 Vacuum',
      currency: 'USD'
    },
    {
      id: 'TXN007',
      date: '2024-01-12',
      time: '15:12:28',
      orderId: 'ORDER-123462',
      customerId: 'CUST007',
      type: 'chargeback',
      amount: -159.99,
      fee: -24.00,
      net: -135.99,
      status: 'disputed',
      paymentMethod: 'MasterCard',
      lastFour: '8888',
      gateway: 'PayPal',
      description: 'LEGO Set Chargeback',
      currency: 'USD'
    },
    {
      id: 'TXN008',
      date: '2024-01-12',
      time: '11:45:33',
      orderId: 'ORDER-123463',
      customerId: 'CUST008',
      type: 'sale',
      amount: 24.99,
      fee: 3.75,
      net: 21.24,
      status: 'completed',
      paymentMethod: 'Visa',
      lastFour: '4242',
      gateway: 'Stripe',
      description: 'Book Collection',
      currency: 'USD'
    },
    {
      id: 'TXN009',
      date: '2024-01-11',
      time: '14:20:15',
      orderId: 'ORDER-123464',
      customerId: 'CUST009',
      type: 'sale',
      amount: 149.99,
      fee: 22.50,
      net: 127.49,
      status: 'completed',
      paymentMethod: 'PayPal',
      lastFour: null,
      gateway: 'PayPal',
      description: 'Nespresso Machine',
      currency: 'USD'
    },
    {
      id: 'TXN010',
      date: '2024-01-11',
      time: '09:15:42',
      orderId: 'ORDER-123465',
      customerId: 'CUST010',
      type: 'sale',
      amount: 299.99,
      fee: 45.00,
      net: 254.99,
      status: 'completed',
      paymentMethod: 'Visa',
      lastFour: '9999',
      gateway: 'Stripe',
      description: 'Designer Handbag',
      currency: 'USD'
    }
  ];

  const generateMockAccounts = () => [
    {
      id: 'ACC001',
      name: 'Business Checking',
      type: 'checking',
      institution: 'Chase Bank',
      lastFour: '4321',
      balance: 45678.90,
      currency: 'USD',
      status: 'active',
      lastSync: '2024-01-15T14:30:00Z'
    },
    {
      id: 'ACC002',
      name: 'Amazon Pay Balance',
      type: 'digital_wallet',
      institution: 'Amazon',
      lastFour: null,
      balance: 23456.78,
      currency: 'USD',
      status: 'active',
      lastSync: '2024-01-15T14:30:00Z'
    },
    {
      id: 'ACC003',
      name: 'PayPal Business',
      type: 'digital_wallet',
      institution: 'PayPal',
      lastFour: null,
      balance: 12345.67,
      currency: 'USD',
      status: 'active',
      lastSync: '2024-01-15T14:30:00Z'
    },
    {
      id: 'ACC004',
      name: 'Savings Account',
      type: 'savings',
      institution: 'Bank of America',
      lastFour: '8765',
      balance: 78901.23,
      currency: 'USD',
      status: 'active',
      lastSync: '2024-01-14T10:15:00Z'
    }
  ];

  const generateMockFees = () => [
    {
      id: 'FEE001',
      date: '2024-01-15',
      type: 'transaction_fee',
      description: 'Stripe processing fee',
      amount: 156.78,
      percentage: 2.9,
      count: 45,
      gateway: 'Stripe'
    },
    {
      id: 'FEE002',
      date: '2024-01-15',
      type: 'monthly_fee',
      description: 'Amazon Marketplace fee',
      amount: 39.99,
      percentage: null,
      count: 1,
      gateway: 'Amazon'
    },
    {
      id: 'FEE003',
      date: '2024-01-14',
      type: 'transaction_fee',
      description: 'PayPal processing fee',
      amount: 78.45,
      percentage: 2.9,
      count: 23,
      gateway: 'PayPal'
    },
    {
      id: 'FEE004',
      date: '2024-01-14',
      type: 'chargeback_fee',
      description: 'Chargeback processing',
      amount: 25.00,
      percentage: null,
      count: 2,
      gateway: 'Stripe'
    },
    {
      id: 'FEE005',
      date: '2024-01-13',
      type: 'currency_fee',
      description: 'Currency conversion',
      amount: 12.34,
      percentage: 1.0,
      count: 5,
      gateway: 'All'
    }
  ];

  // Fetch payment data from API
  const fetchPaymentsData = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const [paymentsRes, transactionsRes, accountsRes, feesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/payments/summary`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE_URL}/api/payments/transactions`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE_URL}/api/payments/accounts`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE_URL}/api/payments/fees`, { headers: getAuthHeaders() }),
      ]);

      setPaymentsData(paymentsRes.data);
      setTransactions(transactionsRes.data.transactions);
      setAccounts(accountsRes.data.accounts);
      setFees(feesRes.data.fees);
      setLastSync(new Date().toISOString());
    } catch (error) {
      console.error('API Error:', error);
      setApiError(error.response?.data?.message || 'Failed to fetch payment data');
      
      // Fallback mock data if API fails
      setPaymentsData(generateMockSummaryData());
      setTransactions(generateMockTransactions());
      setAccounts(generateMockAccounts());
      setFees(generateMockFees());
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchPaymentsData();
    
    // Set up auto-refresh
    if (autoRefresh) {
      const interval = setInterval(fetchPaymentsData, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Time ranges
  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last7days', label: 'Last 7 Days' },
    { id: 'last30days', label: 'Last 30 Days', default: true },
    { id: 'last90days', label: 'Last 90 Days' },
    { id: 'lastYear', label: 'Last Year' },
    { id: 'monthToDate', label: 'Month to Date' },
    { id: 'yearToDate', label: 'Year to Date' },
    { id: 'custom', label: 'Custom Range' },
  ];

  // Report types
  const reportTypes = [
    { id: 'transactions', label: 'Transaction History', icon: <FiCreditCard />, color: 'from-blue-500 to-blue-600' },
    { id: 'fees', label: 'Fee Analysis', icon: <FiPercent />, color: 'from-red-500 to-red-600' },
    { id: 'reconciliation', label: 'Bank Reconciliation', icon: <FiCheckCircle />, color: 'from-green-500 to-green-600' },
    { id: 'forecast', label: 'Revenue Forecast', icon: <FiTrendingUp />, color: 'from-purple-500 to-purple-600' },
    { id: 'payouts', label: 'Payout Schedule', icon: <FiCalendar />, color: 'from-orange-500 to-orange-600' },
  ];

  // Status filters
  const statusFilters = [
    { id: 'all', label: 'All Status', color: 'gray' },
    { id: 'completed', label: 'Completed', color: 'green' },
    { id: 'pending', label: 'Pending', color: 'yellow' },
    { id: 'failed', label: 'Failed', color: 'red' },
    { id: 'refunded', label: 'Refunded', color: 'blue' },
    { id: 'disputed', label: 'Disputed', color: 'orange' },
  ];

  // Metrics cards
  const metricsCards = useMemo(() => [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: `$${paymentsData.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`,
      change: 12.5,
      isPositive: true,
      icon: <FiDollarSign />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'fees',
      label: 'Total Fees',
      value: `$${paymentsData.totalFees?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`,
      change: -3.2,
      isPositive: false,
      icon: <FiPercent />,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'net',
      label: 'Net Revenue',
      value: `$${paymentsData.netRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`,
      change: 8.7,
      isPositive: true,
      icon: <FiTrendingUp />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'pending',
      label: 'Pending Payments',
      value: `$${paymentsData.pendingPayments?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`,
      change: 15.3,
      isPositive: true,
      icon: <FiClock />,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'transactions',
      label: 'Total Transactions',
      value: paymentsData.transactionCount?.toLocaleString() || '0',
      change: 5.6,
      isPositive: true,
      icon: <FiCreditCard />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'avg',
      label: 'Avg. Transaction',
      value: `$${paymentsData.averageTransaction?.toFixed(2) || '0.00'}`,
      change: 2.1,
      isPositive: true,
      icon: <FiBarChart2 />,
      color: 'from-indigo-500 to-indigo-600'
    }
  ], [paymentsData]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(txn => txn.status === statusFilter);
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(txn =>
        txn.id.toLowerCase().includes(query) ||
        txn.orderId.toLowerCase().includes(query) ||
        txn.description.toLowerCase().includes(query) ||
        txn.customerId.toLowerCase().includes(query)
      );
    }
    
    // Sort transactions
    result.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      
      if (sortBy === 'date') {
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else if (sortBy === 'amount') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      return 0;
    });
    
    return result;
  }, [transactions, statusFilter, searchQuery, sortBy, sortOrder]);

  // Payment method distribution
  const paymentMethodDistribution = useMemo(() => {
    const distribution = {};
    transactions.forEach(txn => {
      if (txn.paymentMethod) {
        distribution[txn.paymentMethod] = (distribution[txn.paymentMethod] || 0) + 1;
      }
    });
    
    return Object.entries(distribution).map(([method, count]) => ({
      method,
      count,
      percentage: (count / transactions.length) * 100
    }));
  }, [transactions]);

  // Fee breakdown
  const feeBreakdown = useMemo(() => {
    return fees.reduce((acc, fee) => {
      if (!acc[fee.gateway]) {
        acc[fee.gateway] = 0;
      }
      acc[fee.gateway] += fee.amount;
      return acc;
    }, {});
  }, [fees]);

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <FiClock /> },
      failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: <FiXCircle /> },
      refunded: { label: 'Refunded', color: 'bg-blue-100 text-blue-800', icon: <FiArrowDownRight /> },
      disputed: { label: 'Disputed', color: 'bg-orange-100 text-orange-800', icon: <FiAlertCircle /> },
    };
    
    const { label, color, icon } = config[status] || config.completed;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        <span className="ml-1">{label}</span>
      </span>
    );
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const config = {
      sale: { label: 'Sale', color: 'bg-green-100 text-green-800' },
      refund: { label: 'Refund', color: 'bg-blue-100 text-blue-800' },
      chargeback: { label: 'Chargeback', color: 'bg-red-100 text-red-800' },
      fee: { label: 'Fee', color: 'bg-gray-100 text-gray-800' },
    };
    
    const { label, color } = config[type] || config.sale;
    
    return <span className={`px-2 py-1 rounded text-xs ${color}`}>{label}</span>;
  };

  // Export report via API
  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/export`,
        {
          format,
          timeRange,
          reportType,
          filters: { statusFilter, account: selectedAccount }
        },
        { headers: getAuthHeaders(), responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments-report-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      console.log(`Exported ${format} report`);
    } catch (error) {
      console.error('Export error:', error);
      // Fallback to client-side export
      exportClientSide(format);
    } finally {
      setIsExporting(false);
    }
  };

  // Client-side export fallback
  const exportClientSide = (format) => {
    const data = {
      summary: paymentsData,
      transactions: filteredTransactions,
      fees: fees,
      accounts: accounts,
      generatedAt: new Date().toISOString()
    };
    
    if (format === 'json') {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payments-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }
    
    console.log(`Client-side ${format} export complete`);
  };

  // Sync data
  const handleSync = async () => {
    setIsLoading(true);
    await fetchPaymentsData();
  };

  // Payment method chart
  const PaymentMethodChart = () => {
    return (
      <div className="space-y-3">
        {paymentMethodDistribution.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-700 truncate">{item.method}</div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</span>
                <span className="text-xs text-gray-500">{item.count} transactions</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Fee breakdown chart
  const FeeBreakdownChart = () => {
    const totalFees = Object.values(feeBreakdown).reduce((sum, val) => sum + val, 0);
    
    return (
      <div className="space-y-3">
        {Object.entries(feeBreakdown).map(([gateway, amount], index) => {
          const percentage = (amount / totalFees) * 100;
          
          return (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm text-gray-700 truncate">{gateway}</div>
              <div className="flex-1 ml-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                  <span className="text-xs text-gray-500">${amount.toFixed(2)}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-red-600"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Revenue trend chart
  const RevenueTrendChart = () => {
    // Generate mock revenue data for chart
    const revenueData = [
      { month: 'Jan', revenue: 85000, fees: 12500, net: 72500 },
      { month: 'Feb', revenue: 92000, fees: 13800, net: 78200 },
      { month: 'Mar', revenue: 105000, fees: 15750, net: 89250 },
      { month: 'Apr', revenue: 98000, fees: 14700, net: 83300 },
      { month: 'May', revenue: 112000, fees: 16800, net: 95200 },
      { month: 'Jun', revenue: 125678, fees: 15678, net: 110000 },
    ];
    
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
    
    return (
      <div className="h-64 mt-4">
        <div className="flex h-full items-end space-x-2">
          {revenueData.map((data, index) => {
            const revenueHeight = (data.revenue / maxRevenue) * 100;
            const netHeight = (data.net / maxRevenue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center" style={{ height: '200px' }}>
                  {/* Net Revenue */}
                  <div 
                    className="absolute w-6 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg group"
                    style={{ height: `${netHeight}%`, bottom: '0', left: '25%' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Net: ${(data.net / 1000).toFixed(0)}K
                    </div>
                  </div>
                  
                  {/* Total Revenue */}
                  <div 
                    className="absolute w-6 bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg group"
                    style={{ height: `${revenueHeight}%`, bottom: '0', left: '50%' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Total: ${(data.revenue / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">{data.month}</div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-t from-green-400 to-green-500 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Net Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-t from-blue-400 to-blue-500 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Total Revenue</span>
          </div>
        </div>
      </div>
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
                <FiCreditCard className="text-2xl mr-3" />
                <h1 className="text-2xl font-bold">Payments Reports</h1>
              </div>
              <p className="text-blue-100">
                Track payments, analyze fees, and reconcile transactions
                {lastSync && (
                  <span className="ml-2 text-blue-200">
                    • Last sync: {new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </p>
            </div>
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button 
                onClick={handleSync}
                disabled={isLoading}
                className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center"
              >
                {isLoading ? (
                  <FiRefreshCw className="animate-spin mr-2" />
                ) : (
                  <FiRefreshCw className="mr-2" />
                )}
                Sync Data
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center">
                <FiSettings className="mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Error Alert */}
      {apiError && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <FiAlertCircle className="mr-3 flex-shrink-0" />
            <span>{apiError}. Using cached data.</span>
            <button 
              onClick={() => setApiError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {metricsCards.map((metric, index) => (
            <motion.div 
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-10`}>
                  <div className={`text-xl bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}>
                    {metric.icon}
                  </div>
                </div>
              </div>
              <div className={`flex items-center ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                <span className="text-sm font-medium">
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </motion.div>
          ))}
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

              {/* Report Type */}
              <div className="relative">
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-8 py-2 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                <FaRegChartBar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-8 py-2 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
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
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-3 py-2 ${viewMode === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                  <p className="text-gray-600">Monthly revenue and net income</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiMaximize2 />
                  </button>
                  <button 
                    onClick={() => handleExport('csv')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiDownload />
                  </button>
                </div>
              </div>
              <RevenueTrendChart />
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                    <p className="text-gray-600">{filteredTransactions.length} transactions found</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="amount">Sort by Amount</option>
                    </select>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium text-gray-700">Date & Time</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-700">Transaction</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.slice(0, 10).map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{txn.date}</div>
                            <div className="text-xs text-gray-500">{txn.time}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{txn.description}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <code className="text-xs text-gray-500">{txn.id}</code>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{txn.paymentMethod} ••••{txn.lastFour}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className={`text-lg font-bold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {txn.amount >= 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Net: ${txn.net.toFixed(2)} • Fee: ${Math.abs(txn.fee).toFixed(2)}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col space-y-1">
                            {getStatusBadge(txn.status)}
                            <div className="mt-1">{getTypeBadge(txn.type)}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-600 hover:text-blue-600">
                              <FiEye />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600">
                              <FiCopy />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-red-600">
                              <FiExternalLink />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Side Panels */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Payment Methods</h3>
                  <p className="text-gray-600">Distribution by payment type</p>
                </div>
                <FiCreditCard className="text-gray-400 text-xl" />
              </div>
              <PaymentMethodChart />
            </div>

            {/* Fee Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Fee Breakdown</h3>
                  <p className="text-gray-600">Fees by payment gateway</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    ${paymentsData.totalFees?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-gray-500">Total fees</div>
                </div>
              </div>
              <FeeBreakdownChart />
            </div>

            {/* Account Balances */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Balances</h3>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{account.name}</p>
                        <p className="text-sm text-gray-500">{account.institution}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{account.type}</span>
                      <span>••••{account.lastFour}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-blue-200">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                    className="bg-white border border-gray-300 hover:bg-gray-50 font-medium py-2 rounded-lg text-sm"
                  >
                    {isExporting ? 'Exporting...' : 'Export Report'}
                  </button>
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                    <FiPrinter className="inline mr-2" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Configuration Panel */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">API Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Endpoints</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono text-gray-700">GET /api/payments/summary</code>
                  <FiDatabase className="text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono text-gray-700">GET /api/payments/transactions</code>
                  <FiDatabase className="text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono text-gray-700">POST /api/payments/export</code>
                  <FiDatabase className="text-purple-500" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Export Options</h4>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="pdf"
                    checked={exportFormat === 'pdf'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">PDF</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">CSV</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="excel"
                    checked={exportFormat === 'excel'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Excel</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">JSON</span>
                </label>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Data Sync Status</h4>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Last Successful Sync</p>
                    <p className="text-sm text-gray-500">
                      {lastSync ? new Date(lastSync).toLocaleString() : 'Never'}
                    </p>
                  </div>
                  <button 
                    onClick={handleSync}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      isLoading 
                        ? 'bg-gray-200 text-gray-500' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isLoading ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsReports;