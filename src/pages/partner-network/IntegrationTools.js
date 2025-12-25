import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Clock,
  ShoppingCart,
  RefreshCw,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Target,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Info,
  ExternalLink,
  Star,
  Shield,
  Truck,
  MessageSquare,
  Bell,
  MapPin,
  Globe,
  CalendarDays,
  Timer,
  ShieldCheck,
  PackageCheck,
  PackageX,
  Clock4,
  Award,
  Zap,
  Navigation,
  Play,
  Pause,
  Maximize2,
  Search,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Mail,
  Phone,
  Building,
  Wallet,
  CreditCard,
  FileText,
  CheckSquare,
  AlertTriangle,
  FileBarChart,
  Layers,
  Database,
  Server,
  Cloud,
  Wifi,
  BatteryCharging,
  Cpu,
  HardDrive,
  Network,
  Terminal,
  GitBranch,
  GitCommit,
  Share2,
  Link,
  Lock,
  Key,
  Fingerprint,
  Activity,
  BarChart2,
  LineChart,
  Thermometer,
  Wind,
  Sun,
  Moon,
  Umbrella,
  Compass,
  Route,
  Ship,
  Plane,
  Car,
  Bike,
  Train,
  Bus,
  Package2,
  Smartphone,
  Laptop,
  Printer,
  Camera,
  Gamepad2,
  Watch,
  Inbox,
  Send,
  Archive,
  Bookmark,
  File,
  Folder,
  Save,
  Upload,
  Download as DownloadIcon,
  Trash2,
  Edit,
  Copy,
  Layout,
  Grid,
  Columns,
  Rows,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Plus,
  Minus,
  Percent,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

// Import React Query for API state management
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';

// =============================================
// API SERVICE CONFIGURATION
// =============================================

// Base API configuration
const API_CONFIG = {
  baseURL: 'https://api.amazon-spn.com/v1',
  endpoints: {
    auth: {
      login: '/auth/login',
      profile: '/auth/profile',
      refresh: '/auth/refresh',
    },
    dashboard: {
      stats: '/dashboard/stats',
      metrics: '/dashboard/metrics',
      alerts: '/dashboard/alerts',
    },
    shipments: {
      list: '/shipments',
      details: '/shipments/:id',
      create: '/shipments',
      update: '/shipments/:id',
      track: '/shipments/:id/track',
    },
    performance: {
      overview: '/performance',
      trends: '/performance/trends',
      benchmarks: '/performance/benchmarks',
    },
    revenue: {
      overview: '/revenue',
      transactions: '/revenue/transactions',
      payouts: '/revenue/payouts',
    },
    carrier: {
      performance: '/carrier/performance',
      rates: '/carrier/rates',
      capacity: '/carrier/capacity',
    },
    analytics: {
      reports: '/analytics/reports',
      insights: '/analytics/insights',
    },
    notifications: {
      list: '/notifications',
      markRead: '/notifications/:id/read',
      settings: '/notifications/settings',
    },
    integrations: {
      list: '/integrations',
      connect: '/integrations/:id/connect',
      disconnect: '/integrations/:id/disconnect',
      status: '/integrations/:id/status',
    },
    tools: {
      routeOptimizer: '/tools/route-optimizer',
      capacityPlanner: '/tools/capacity-planner',
      rateCalculator: '/tools/rate-calculator',
    },
  },
};

// API Service Class
class AmazonServiceProviderAPI {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.token = localStorage.getItem('amazon_sp_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('amazon_sp_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('amazon_sp_token');
  }

  async request(endpoint, method = 'GET', data = null, params = null) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'Amazon-SPN-Version': '2024-01',
    };

    try {
      const response = await axios({
        method,
        url,
        headers,
        data,
        params,
      });

      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      if (error.response?.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }
      throw error;
    }
  }

  // Auth API
  async login(credentials) {
    const data = await this.request(API_CONFIG.endpoints.auth.login, 'POST', credentials);
    this.setToken(data.access_token);
    return data;
  }

  async getProfile() {
    return await this.request(API_CONFIG.endpoints.auth.profile);
  }

  // Dashboard API
  async getDashboardStats() {
    return await this.request(API_CONFIG.endpoints.dashboard.stats);
  }

  async getDashboardMetrics(timeRange = '7d') {
    return await this.request(API_CONFIG.endpoints.dashboard.metrics, 'GET', null, { range: timeRange });
  }

  async getDashboardAlerts() {
    return await this.request(API_CONFIG.endpoints.dashboard.alerts);
  }

  // Shipments API
  async getShipments(filters = {}) {
    return await this.request(API_CONFIG.endpoints.shipments.list, 'GET', null, filters);
  }

  async getShipmentDetails(id) {
    return await this.request(API_CONFIG.endpoints.shipments.details.replace(':id', id));
  }

  // Performance API
  async getPerformanceOverview() {
    return await this.request(API_CONFIG.endpoints.performance.overview);
  }

  async getPerformanceTrends(period = 'monthly') {
    return await this.request(API_CONFIG.endpoints.performance.trends, 'GET', null, { period });
  }

  // Revenue API
  async getRevenueOverview() {
    return await this.request(API_CONFIG.endpoints.revenue.overview);
  }

  // Integrations API
  async getIntegrations() {
    return await this.request(API_CONFIG.endpoints.integrations.list);
  }

  async connectIntegration(id) {
    return await this.request(API_CONFIG.endpoints.integrations.connect.replace(':id', id), 'POST');
  }

  async getIntegrationStatus(id) {
    return await this.request(API_CONFIG.endpoints.integrations.status.replace(':id', id));
  }

  // Tools API
  async optimizeRoute(data) {
    return await this.request(API_CONFIG.endpoints.tools.routeOptimizer, 'POST', data);
  }

  async calculateCapacity(data) {
    return await this.request(API_CONFIG.endpoints.tools.capacityPlanner, 'POST', data);
  }
}

// =============================================
// MOCK DATA GENERATOR
// =============================================

const generateMockData = {
  profile: () => ({
    id: "SP-789012",
    company: "Swift Logistics Pvt Ltd",
    legalName: "Swift Logistics Private Limited",
    email: "admin@swiftlogistics.in",
    phone: "+91 98765 43210",
    role: "Service Partner",
    tier: "Prime Partner",
    joinDate: "2022-06-15",
    rating: 4.8,
    totalShipments: 12500,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SL",
    address: {
      street: "123 Logistics Park",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400001"
    },
    taxInfo: {
      gstin: "27AABCS1429L1Z",
      pan: "AABCS1429L"
    },
    bankDetails: {
      accountNumber: "123456789012",
      ifsc: "HDFC0001234",
      bankName: "HDFC Bank",
      branch: "Mumbai Main"
    }
  }),

  dashboardStats: () => ({
    overview: {
      activeShipments: 342,
      deliveredToday: 289,
      inTransit: 48,
      delayed: 5,
      revenueToday: "₹1,25,480",
      weeklyGrowth: 12.5,
    },
    performance: {
      score: 92.5,
      status: "excellent",
      amazonThreshold: 94.0,
      metrics: {
        onTimeDelivery: 96.8,
        lateDelivery: 3.2,
        validTracking: 99.2,
        deliveryExperience: 4.7,
        firstAttemptDelivery: 94.5,
        damageRate: 0.3,
        customerComplaints: 1.2,
      }
    },
    alerts: [
      {
        id: 1,
        type: "warning",
        title: "Performance Drop Alert",
        message: "On-time delivery rate below 96% for last 24 hours",
        priority: "high",
        timestamp: "2024-01-15T14:30:00Z",
        read: false,
      },
      {
        id: 2,
        type: "info",
        title: "New Policy Update",
        message: "Amazon has updated delivery guidelines for tier-2 cities",
        priority: "medium",
        timestamp: "2024-01-15T10:15:00Z",
        read: true,
      }
    ]
  }),

  shipments: (filters = {}) => {
    const allShipments = Array.from({ length: 50 }, (_, i) => ({
      id: `SHP-${10000 + i}`,
      orderId: `ORD-${78945 + i}`,
      amazonOrderId: `171-${1234567 + i}-${8912345 + i}`,
      customer: {
        name: `Customer ${i + 1}`,
        phone: `+91 98765${43210 + i}`,
        email: `customer${i + 1}@example.com`,
      },
      carrier: i % 3 === 0 ? "UPS" : i % 3 === 1 ? "FedEx" : "DHL",
      serviceLevel: i % 2 === 0 ? "Standard" : "Express",
      status: i % 5 === 0 ? "delayed" : i % 5 === 1 ? "in_transit" : "delivered",
      timeline: {
        pickup: new Date(Date.now() - (i * 86400000)).toISOString(),
        shipped: new Date(Date.now() - (i * 86400000) + 3600000).toISOString(),
        outForDelivery: i % 5 !== 0 ? new Date(Date.now() - (i * 86400000) + 43200000).toISOString() : null,
        delivered: i % 5 === 0 ? null : new Date(Date.now() - (i * 86400000) + 50400000).toISOString(),
        estimatedDelivery: new Date(Date.now() + (i % 3) * 86400000).toISOString(),
      },
      details: {
        weight: `${(Math.random() * 10 + 1).toFixed(1)} kg`,
        dimensions: "30x20x15 cm",
        declaredValue: `₹${Math.floor(Math.random() * 20000) + 1000}`,
        insurance: `₹${Math.floor(Math.random() * 20000) + 1000}`,
        codAmount: i % 4 === 0 ? `₹${Math.floor(Math.random() * 5000) + 1000}` : null,
      },
      financials: {
        deliveryFee: `₹${Math.floor(Math.random() * 200) + 50}.00`,
        codFee: i % 4 === 0 ? `₹${Math.floor(Math.random() * 50) + 10}.00` : null,
        insuranceFee: `₹${Math.floor(Math.random() * 20) + 5}.00`,
        totalPayout: `₹${Math.floor(Math.random() * 250) + 75}.00`,
        status: i % 3 === 0 ? "pending" : "paid",
        paymentDate: i % 3 === 0 ? null : new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0],
      },
    }));

    // Apply filters
    let filtered = allShipments;
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    if (filters.carrier) {
      filtered = filtered.filter(s => s.carrier === filters.carrier);
    }
    if (filters.dateFrom && filters.dateTo) {
      filtered = filtered.filter(s => {
        const shipDate = new Date(s.timeline.pickup);
        return shipDate >= new Date(filters.dateFrom) && shipDate <= new Date(filters.dateTo);
      });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    
    return {
      data: filtered.slice(startIndex, startIndex + limit),
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit),
      }
    };
  },

  integrations: () => ({
    connected: [
      {
        id: "amazon-marketplace",
        name: "Amazon Marketplace",
        description: "Direct integration with Amazon Seller Central",
        icon: "🛒",
        status: "connected",
        lastSync: "2024-01-15T10:30:00Z",
        features: ["Order Import", "Inventory Sync", "Shipment Tracking"],
      },
      {
        id: "ups-api",
        name: "UPS API",
        description: "Real-time shipping rates and tracking",
        icon: "📦",
        status: "connected",
        lastSync: "2024-01-15T09:45:00Z",
        features: ["Rate Calculation", "Label Generation", "Tracking"],
      },
      {
        id: "quickbooks",
        name: "QuickBooks Online",
        description: "Automated accounting and invoicing",
        icon: "💰",
        status: "connected",
        lastSync: "2024-01-14T23:59:00Z",
        features: ["Invoice Sync", "Payment Reconciliation", "Expense Tracking"],
      },
    ],
    available: [
      {
        id: "fedex-api",
        name: "FedEx API",
        description: "FedEx shipping and tracking integration",
        icon: "✈️",
        status: "available",
        category: "Shipping",
      },
      {
        id: "shopify",
        name: "Shopify",
        description: "Connect with Shopify stores",
        icon: "🏪",
        status: "available",
        category: "E-commerce",
      },
      {
        id: "zoho-books",
        name: "Zoho Books",
        description: "Accounting software integration",
        icon: "📊",
        status: "available",
        category: "Accounting",
      },
      {
        id: "google-maps",
        name: "Google Maps API",
        description: "Route optimization and geocoding",
        icon: "🗺️",
        status: "available",
        category: "Routing",
      },
      {
        id: "twilio",
        name: "Twilio",
        description: "SMS notifications for customers",
        icon: "💬",
        status: "available",
        category: "Communication",
      },
      {
        id: "stripe",
        name: "Stripe",
        description: "Payment processing integration",
        icon: "💳",
        status: "available",
        category: "Payments",
      },
    ],
  }),

  tools: () => ({
    routeOptimizer: {
      name: "Route Optimizer",
      description: "Optimize delivery routes for maximum efficiency",
      icon: <Route className="w-6 h-6" />,
      stats: {
        routesOptimized: 1245,
        fuelSaved: "2,450L",
        timeSaved: "1,248 hours",
        efficiencyGain: "18.5%",
      },
      features: ["Real-time traffic", "Multi-stop optimization", "Fuel cost calculation"],
    },
    capacityPlanner: {
      name: "Capacity Planner",
      description: "Plan and allocate resources efficiently",
      icon: <Layers className="w-6 h-6" />,
      stats: {
        capacityUtilization: "87%",
        idleTimeReduction: "32%",
        loadOptimization: "24%",
        costReduction: "15%",
      },
      features: ["Load balancing", "Resource allocation", "Peak forecasting"],
    },
    rateCalculator: {
      name: "Rate Calculator",
      description: "Calculate shipping rates across carriers",
      icon: <Calculator className="w-6 h-6" />,
      stats: {
        carriersCompared: 8,
        averageSavings: "12.5%",
        accuracyRate: "99.8%",
        timeSaved: "45 minutes/day",
      },
      features: ["Multi-carrier comparison", "Real-time rates", "Historical analysis"],
    },
    performanceAnalytics: {
      name: "Performance Analytics",
      description: "Deep dive into delivery performance metrics",
      icon: <Activity className="w-6 h-6" />,
      stats: {
        metricsTracked: 42,
        insightsGenerated: 156,
        improvementAreas: 8,
        accuracy: "98.7%",
      },
      features: ["Real-time monitoring", "Predictive analytics", "Custom reports"],
    },
  }),

  notifications: () => [
    {
      id: 1,
      type: "alert",
      title: "Performance Alert",
      message: "Your on-time delivery rate dropped below 96%",
      priority: "high",
      timestamp: "2024-01-15T14:30:00Z",
      read: false,
      action: { label: "View Details", url: "#performance" },
    },
    {
      id: 2,
      type: "success",
      title: "Payment Received",
      message: "₹1,25,480 credited to your account",
      priority: "medium",
      timestamp: "2024-01-15T11:45:00Z",
      read: true,
      action: { label: "View Transaction", url: "#revenue" },
    },
    {
      id: 3,
      type: "info",
      title: "New Shipment Batch",
      message: "150 new shipments assigned for tomorrow",
      priority: "medium",
      timestamp: "2024-01-15T09:30:00Z",
      read: true,
      action: { label: "View Shipments", url: "#shipments" },
    },
    {
      id: 4,
      type: "warning",
      title: "Weather Alert",
      message: "Heavy rain expected in Mumbai region tomorrow",
      priority: "high",
      timestamp: "2024-01-15T16:20:00Z",
      read: false,
      action: { label: "View Forecast", url: "#" },
    },
  ],
};

// Calculator icon component (missing from lucide-react imports)
const Calculator = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="8" y1="6" x2="16" y2="6"></line>
    <line x1="8" y1="10" x2="16" y2="10"></line>
    <line x1="8" y1="14" x2="16" y2="14"></line>
    <line x1="8" y1="18" x2="16" y2="18"></line>
  </svg>
);

// =============================================
// REACT QUERY HOOKS
// =============================================

const useDashboardStats = () => useQuery({
  queryKey: ['dashboard', 'stats'],
  queryFn: () => generateMockData.dashboardStats(),
  refetchInterval: 60000,
});

const useShipments = (filters) => useQuery({
  queryKey: ['shipments', filters],
  queryFn: () => generateMockData.shipments(filters),
});

const useIntegrations = () => useQuery({
  queryKey: ['integrations'],
  queryFn: () => generateMockData.integrations(),
});

const useTools = () => useQuery({
  queryKey: ['tools'],
  queryFn: () => generateMockData.tools(),
});

const useNotifications = () => useQuery({
  queryKey: ['notifications'],
  queryFn: () => generateMockData.notifications(),
});

// =============================================
// COMPONENTS
// =============================================

// Metric Card Component
const MetricCard = ({ title, value, change, trend, icon, color, subtitle }) => {
  const isPositive = trend === "up";
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`p-2 rounded-lg ${color}`}>
              {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <span className="text-sm text-gray-500 font-medium">{title}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {subtitle && (
            <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
          )}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Integration Card Component
const IntegrationCard = ({ integration, onConnect, onDisconnect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'connecting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'available': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-2xl">
            {integration.icon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{integration.name}</h4>
            <p className="text-sm text-gray-500">{integration.description}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
          {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
        </span>
      </div>

      {integration.features && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {integration.features.map((feature, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {integration.lastSync && (
        <div className="text-xs text-gray-500 mb-4">
          Last sync: {formatDate(integration.lastSync)}
        </div>
      )}

      <div className="flex gap-3">
        {integration.status === 'connected' ? (
          <>
            <button className="flex-1 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors">
              Configure
            </button>
            <button
              onClick={() => onDisconnect(integration.id)}
              className="flex-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
            >
              Disconnect
            </button>
          </>
        ) : integration.status === 'available' ? (
          <button
            onClick={() => onConnect(integration.id)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            Connect
          </button>
        ) : (
          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium cursor-not-allowed">
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
};

// Tool Card Component
const ToolCard = ({ tool }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            {tool.icon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{tool.name}</h4>
            <p className="text-sm text-gray-500">{tool.description}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Maximize2 className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(tool.stats).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Features</h5>
        <ul className="space-y-2">
          {tool.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]">
        Launch Tool
      </button>
    </div>
  );
};

// Shipments Table Component
const ShipmentsTable = ({ shipments, loading }) => {
  const getStatusBadge = (status) => {
    const config = {
      delivered: { color: "bg-green-50 text-green-700 border-green-200", icon: <PackageCheck className="w-3 h-3" /> },
      in_transit: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <Truck className="w-3 h-3" /> },
      delayed: { color: "bg-red-50 text-red-700 border-red-200", icon: <Clock4 className="w-3 h-3" /> },
      pending: { color: "bg-gray-50 text-gray-700 border-gray-200", icon: <Clock className="w-3 h-3" /> },
    };
    const cfg = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
        {cfg.icon}
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
            <p className="text-sm text-gray-500">Track and manage all shipments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search shipments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
              + New Shipment
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase">Carrier</th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase">Delivery</th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase">Payout</th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shipments?.data?.slice(0, 5).map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{shipment.amazonOrderId}</div>
                  <div className="text-sm text-gray-500">{shipment.id}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{shipment.customer.name}</div>
                  <div className="text-sm text-gray-500">{shipment.customer.email}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{shipment.carrier}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(shipment.status)}
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium">
                    {new Date(shipment.timeline.estimatedDelivery).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{shipment.financials.totalPayout}</div>
                  <div className={`text-xs ${shipment.financials.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {shipment.financials.status}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activeView, setActiveView, collapsed, toggleSidebar }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { id: "shipments", label: "Shipments", icon: <Package className="w-5 h-5" /> },
    { id: "integrations", label: "Integrations", icon: <Link className="w-5 h-5" /> },
    { id: "tools", label: "Tools", icon: <Terminal className="w-5 h-5" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "revenue", label: "Revenue", icon: <DollarSign className="w-5 h-5" /> },
    { id: "performance", label: "Performance", icon: <Activity className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300
        ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        w-64 lg:w-20 xl:w-64
        bg-gradient-to-b from-gray-900 to-gray-800 text-white
        flex flex-col h-screen
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Truck className="w-6 h-6" />
              </div>
              {!collapsed && (
                <div className="lg:hidden xl:block">
                  <h1 className="text-lg font-bold">Amazon SPN</h1>
                  <p className="text-xs text-gray-400">Service Partner</p>
                </div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200
                  ${activeView === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                    : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                  }
                `}
              >
                <span>{item.icon}</span>
                {!collapsed && (
                  <span className="lg:hidden xl:block text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="lg:hidden xl:block flex-1">
                <p className="text-sm font-medium">Swift Logistics</p>
                <p className="text-xs text-gray-400">Prime Partner</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// Main Dashboard Component
const AmazonSPNDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // React Query hooks
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: shipments, isLoading: shipmentsLoading } = useShipments({ page: 1, limit: 10 });
  const { data: integrations, isLoading: integrationsLoading } = useIntegrations();
  const { data: tools, isLoading: toolsLoading } = useTools();
  const { data: notifications } = useNotifications();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleConnectIntegration = async (id) => {
    // In a real app, this would call the API
    console.log('Connecting integration:', id);
  };

  const handleDisconnectIntegration = async (id) => {
    // In a real app, this would call the API
    console.log('Disconnecting integration:', id);
  };

  // Loading state
  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Amazon SPN Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Amazon Service Partner Network
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications?.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* User */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
                    <p className="text-blue-100">
                      Your Amazon Partner Dashboard is updated in real-time
                    </p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">4.8/5</div>
                      <div className="text-sm text-blue-200">Partner Rating</div>
                    </div>
                    <div className="h-12 w-px bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">12,500</div>
                      <div className="text-sm text-blue-200">Total Shipments</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Today's Revenue"
                  value="₹1,25,480"
                  change="+12.5%"
                  trend="up"
                  icon={<DollarSign />}
                  color="bg-green-50"
                  subtitle="289 deliveries"
                />
                <MetricCard
                  title="Active Shipments"
                  value="342"
                  change="+8.2%"
                  trend="up"
                  icon={<Package />}
                  color="bg-blue-50"
                  subtitle="48 in transit"
                />
                <MetricCard
                  title="On-Time Delivery"
                  value="96.8%"
                  change="+0.8%"
                  trend="up"
                  icon={<Clock />}
                  color="bg-purple-50"
                  subtitle="Target: 97%"
                />
                <MetricCard
                  title="Customer Rating"
                  value="4.7/5"
                  change="+0.2"
                  trend="up"
                  icon={<Star />}
                  color="bg-yellow-50"
                  subtitle="Delivery Experience"
                />
              </div>

              {/* Tools & Integrations Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tools Preview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Tools</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {tools && Object.values(tools).slice(0, 2).map((tool, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {React.cloneElement(tool.icon, { className: "w-5 h-5 text-blue-600" })}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{tool.name}</h4>
                          </div>
                        </div>
                        <button className="w-full px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                          Launch
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integrations Preview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {integrations?.connected?.slice(0, 2).map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{integration.icon}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{integration.name}</h4>
                            <p className="text-sm text-gray-500">Connected</p>
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Shipments */}
              <ShipmentsTable shipments={shipments} loading={shipmentsLoading} />
            </div>
          )}

          {/* Integrations View */}
          {activeView === "integrations" && integrations && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
                <p className="text-gray-600">Connect your Amazon SPN account with other services</p>
              </div>

              {/* Connected Integrations */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrations.connected.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={handleConnectIntegration}
                      onDisconnect={handleDisconnectIntegration}
                    />
                  ))}
                </div>
              </div>

              {/* Available Integrations */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Integrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrations.available.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={handleConnectIntegration}
                      onDisconnect={handleDisconnectIntegration}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tools View */}
          {activeView === "tools" && tools && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tools</h1>
                <p className="text-gray-600">Powerful tools to optimize your delivery operations</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.values(tools).map((tool, idx) => (
                  <ToolCard key={idx} tool={tool} />
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-3">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">Export Report</div>
                  </button>
                  <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-3">
                      <RefreshCw className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">Refresh Data</div>
                  </button>
                  <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mb-3">
                      <Share2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">Share Dashboard</div>
                  </button>
                  <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mb-3">
                      <HelpCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">Get Help</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeView === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Account Settings */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Account Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Swift Logistics Pvt Ltd"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue="admin@swiftlogistics.in"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications Settings */}
                <div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Email Notifications</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">SMS Alerts</span>
                        <input type="checkbox" className="toggle" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Performance Alerts</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeView === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Deep insights into your delivery operations</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Performance Trends</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-600">On-time Delivery Rate</div>
                        <div className="text-2xl font-bold">96.8%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Customer Satisfaction</div>
                        <div className="text-2xl font-bold">4.7/5</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AmazonSPNDashboard />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

export default App;