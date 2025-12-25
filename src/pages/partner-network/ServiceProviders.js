import React, { useState, useEffect, useCallback } from "react";
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
  Map as MapIcon,
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
  Database as DatabaseIcon,
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

// Import Leaflet for mapping
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// =============================================
// API SERVICE CONFIGURATION
// =============================================

// Base API configuration (simulating Amazon SP-API)
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
  },
};

// API Service Class
class AmazonServiceProviderAPI {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.token = localStorage.getItem('amazon_sp_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('amazon_sp_token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('amazon_sp_token');
  }

  // Generic request method
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

  async createShipment(data) {
    return await this.request(API_CONFIG.endpoints.shipments.create, 'POST', data);
  }

  async trackShipment(id) {
    return await this.request(API_CONFIG.endpoints.shipments.track.replace(':id', id));
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

  async getRevenueTransactions(page = 1, limit = 20) {
    return await this.request(API_CONFIG.endpoints.revenue.transactions, 'GET', null, { page, limit });
  }

  // Carrier API
  async getCarrierPerformance() {
    return await this.request(API_CONFIG.endpoints.carrier.performance);
  }

  // Analytics API
  async getAnalyticsReports(type = 'monthly') {
    return await this.request(API_CONFIG.endpoints.analytics.reports, 'GET', null, { type });
  }

  // Notifications API
  async getNotifications() {
    return await this.request(API_CONFIG.endpoints.notifications.list);
  }

  async markNotificationAsRead(id) {
    return await this.request(API_CONFIG.endpoints.notifications.markRead.replace(':id', id), 'PUT');
  }
}

// Create API instance
const apiService = new AmazonServiceProviderAPI();

// =============================================
// MOCK DATA GENERATOR (For development)
// =============================================

const generateMockData = {
  // User Profile
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

  // Dashboard Stats
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

  // Shipments
  shipments: (filters = {}) => {
    const allShipments = [
      {
        id: "SHP-10001",
        orderId: "ORD-78945",
        amazonOrderId: "171-1234567-8912345",
        customer: {
          name: "Rohan Sharma",
          phone: "+91 9876543210",
          email: "rohan.sharma@example.com",
        },
        carrier: "UPS",
        serviceLevel: "Standard",
        status: "delivered",
        timeline: {
          pickup: "2024-01-13T09:00:00Z",
          shipped: "2024-01-13T14:00:00Z",
          outForDelivery: "2024-01-15T09:45:00Z",
          delivered: "2024-01-15T10:30:00Z",
          estimatedDelivery: "2024-01-15T18:00:00Z",
        },
        details: {
          weight: "2.5 kg",
          dimensions: "30x20x15 cm",
          declaredValue: "₹12,499",
          insurance: "₹12,499",
          codAmount: null,
        },
        origin: {
          name: "Mumbai Warehouse",
          address: "Logistics Park, Mumbai",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
        destination: {
          name: "Rohan Sharma",
          address: "123 Marine Drive",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400020",
        },
        tracking: {
          id: "1Z999AA1234567890",
          url: "https://www.ups.com/track?tracknum=1Z999AA1234567890",
          lastUpdate: "2024-01-15T10:30:00Z",
          status: "Delivered",
          proof: {
            signature: "available",
            image: "https://example.com/signature.jpg",
            timestamp: "2024-01-15T10:30:00Z",
          }
        },
        financials: {
          deliveryFee: "₹85.00",
          codFee: null,
          insuranceFee: "₹12.50",
          totalPayout: "₹97.50",
          status: "paid",
          paymentDate: "2024-01-15",
        },
        notes: "On time delivery, customer satisfied",
      },
      // ... rest of shipments data (kept as provided)
    ];

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

  // Performance Data
  performance: () => ({
    overall: {
      score: 92.5,
      status: "excellent",
      amazonThreshold: 94.0,
      rank: "Top 15%",
      lastUpdated: "2024-01-15T14:30:00Z",
    },
    metrics: {
      deliveryPerformance: {
        onTimeDelivery: { value: 96.8, target: 97.0, trend: "up", change: 0.8 },
        lateDelivery: { value: 3.2, target: 3.0, trend: "down", change: -0.8 },
        firstAttemptSuccess: { value: 94.5, target: 95.0, trend: "up", change: 0.5 },
        damageRate: { value: 0.3, target: 0.5, trend: "down", change: -0.2 },
      },
      customerExperience: {
        deliveryExperience: { value: 4.7, target: 4.5, trend: "up", change: 0.1 },
        complaintRate: { value: 1.2, target: 1.5, trend: "down", change: -0.3 },
        returnRate: { value: 2.5, target: 3.0, trend: "down", change: -0.5 },
      },
      operational: {
        validTracking: { value: 99.2, target: 95.0, trend: "stable", change: 0.3 },
        pickupOnTime: { value: 98.5, target: 98.0, trend: "up", change: 0.5 },
        routeOptimization: { value: 92.0, target: 90.0, trend: "up", change: 2.0 },
      }
    },
    trends: [
      { date: "Jan 9", onTime: 95.2, late: 4.8, complaints: 1.5 },
      { date: "Jan 10", onTime: 96.1, late: 3.9, complaints: 1.4 },
      { date: "Jan 11", onTime: 96.5, late: 3.5, complaints: 1.3 },
      { date: "Jan 12", onTime: 95.8, late: 4.2, complaints: 1.6 },
      { date: "Jan 13", onTime: 96.3, late: 3.7, complaints: 1.2 },
      { date: "Jan 14", onTime: 96.8, late: 3.2, complaints: 1.1 },
      { date: "Jan 15", onTime: 97.0, late: 3.0, complaints: 1.0 },
    ],
    benchmarks: {
      regionalAverage: 89.5,
      topPerformers: 96.8,
      yourPosition: "15th out of 100",
      improvementAreas: ["Delivery Time", "Customer Feedback", "Route Optimization"],
    }
  }),

  // Revenue Data
  revenue: () => ({
    overview: {
      totalRevenue: "₹45,28,500",
      monthlyGrowth: 15.2,
      ytdRevenue: "₹1,85,42,000",
      avgDailyRevenue: "₹1,25,480",
      pendingPayments: "₹2,45,800",
      upcomingPayouts: "₹3,12,500",
    },
    breakdown: {
      byService: [
        { service: "Express Delivery", revenue: "₹18,45,200", percentage: 40.7, growth: 12.5 },
        { service: "Standard Delivery", revenue: "₹12,30,500", percentage: 27.2, growth: 8.3 },
        { service: "Same Day Delivery", revenue: "₹8,45,300", percentage: 18.7, growth: 25.4 },
        { service: "International", revenue: "₹6,07,500", percentage: 13.4, growth: 5.2 },
      ],
      byRegion: [
        { region: "North", revenue: "₹12,45,000", percentage: 27.5 },
        { region: "South", revenue: "₹15,28,500", percentage: 33.8 },
        { region: "East", revenue: "₹8,67,000", percentage: 19.2 },
        { region: "West", revenue: "₹8,88,000", percentage: 19.6 },
      ],
    },
    transactions: Array.from({ length: 20 }, (_, i) => ({
      id: `TRX-${1000 + i}`,
      date: `2024-01-${15 - Math.floor(i/5)}`,
      description: i % 3 === 0 ? "Delivery Fees" : i % 3 === 1 ? "COD Collection" : "Insurance Premium",
      amount: i % 2 === 0 ? `₹${(Math.random() * 5000 + 1000).toFixed(2)}` : `-₹${(Math.random() * 2000 + 500).toFixed(2)}`,
      type: i % 2 === 0 ? "credit" : "debit",
      status: i % 4 === 0 ? "pending" : "completed",
      reference: `SHP-${10000 + i}`,
    })),
    payouts: [
      { date: "2024-01-15", amount: "₹1,25,480", status: "processed", method: "Bank Transfer" },
      { date: "2024-01-08", amount: "₹1,18,750", status: "processed", method: "Bank Transfer" },
      { date: "2024-01-01", amount: "₹1,12,450", status: "processed", method: "Bank Transfer" },
      { date: "2024-01-22", amount: "₹1,35,000", status: "scheduled", method: "Bank Transfer" },
    ],
  }),

  // Carrier Performance
  carrierPerformance: () => ({
    carriers: [
      {
        id: "ups",
        name: "UPS",
        partnership: "Prime Partner",
        volume: 45,
        performance: {
          onTimeRate: 97.2,
          damageRate: 0.2,
          trackingAccuracy: 99.5,
          customerRating: 4.8,
        },
        financials: {
          costPerShipment: 8.42,
          monthlySpend: "₹3,45,820",
          discounts: "12% volume discount",
        },
        capacity: {
          dailyCapacity: 200,
          utilization: 85,
          availableSlots: 30,
        },
        issues: 12,
      },
      {
        id: "fedex",
        name: "FedEx",
        partnership: "Preferred Partner",
        volume: 28,
        performance: {
          onTimeRate: 96.5,
          damageRate: 0.4,
          trackingAccuracy: 98.8,
          customerRating: 4.6,
        },
        financials: {
          costPerShipment: 8.75,
          monthlySpend: "₹2,12,500",
          discounts: "8% loyalty discount",
        },
        capacity: {
          dailyCapacity: 150,
          utilization: 78,
          availableSlots: 33,
        },
        issues: 18,
      },
    ],
    summary: {
      totalCarriers: 4,
      avgOnTimeRate: 96.9,
      avgCostPerShipment: 7.82,
      totalMonthlySpend: "₹7,41,320",
    },
  }),

  // Analytics Reports
  analytics: () => ({
    insights: [
      {
        id: 1,
        title: "Peak Delivery Hours",
        description: "3 PM - 7 PM sees 40% higher delivery success rate",
        impact: "high",
        recommendation: "Schedule more deliveries during this window",
      },
      {
        id: 2,
        title: "Route Optimization",
        description: "Route A to B can be optimized saving 15% fuel cost",
        impact: "medium",
        recommendation: "Use optimized routes from dashboard",
      },
    ],
    reports: [
      {
        id: 1,
        name: "Monthly Performance Report",
        type: "pdf",
        date: "2024-01-15",
        size: "2.4 MB",
        url: "#",
      },
      {
        id: 2,
        name: "Carrier Comparison Q4 2023",
        type: "excel",
        date: "2024-01-10",
        size: "1.8 MB",
        url: "#",
      },
    ],
  }),

  // Notifications
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

// =============================================
// REACT QUERY HOOKS
// =============================================

const useServiceProviderAPI = () => {
  const queryClient = useQueryClient();

  // Profile Query
  const useProfile = () => useQuery({
    queryKey: ['profile'],
    queryFn: () => generateMockData.profile(),
    staleTime: 5 * 60 * 1000,
  });

  // Dashboard Stats Query
  const useDashboardStats = () => useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => generateMockData.dashboardStats(),
    refetchInterval: 60 * 1000,
  });

  // Shipments Query
  const useShipments = (filters) => useQuery({
    queryKey: ['shipments', filters],
    queryFn: () => generateMockData.shipments(filters),
  });

  // Performance Query
  const usePerformance = () => useQuery({
    queryKey: ['performance'],
    queryFn: () => generateMockData.performance(),
  });

  // Revenue Query
  const useRevenue = () => useQuery({
    queryKey: ['revenue'],
    queryFn: () => generateMockData.revenue(),
  });

  // Carrier Performance Query
  const useCarrierPerformance = () => useQuery({
    queryKey: ['carrier', 'performance'],
    queryFn: () => generateMockData.carrierPerformance(),
  });

  // Analytics Query
  const useAnalytics = () => useQuery({
    queryKey: ['analytics'],
    queryFn: () => generateMockData.analytics(),
  });

  // Notifications Query
  const useNotifications = () => useQuery({
    queryKey: ['notifications'],
    queryFn: () => generateMockData.notifications(),
  });

  // Mutations
  const markNotificationAsRead = useMutation({
    mutationFn: (id) => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const createShipment = useMutation({
    mutationFn: (data) => {
      return Promise.resolve({ id: Date.now(), ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shipments']);
    },
  });

  return {
    queries: {
      useProfile,
      useDashboardStats,
      useShipments,
      usePerformance,
      useRevenue,
      useCarrierPerformance,
      useAnalytics,
      useNotifications,
    },
    mutations: {
      markNotificationAsRead,
      createShipment,
    },
  };
};

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

// Performance Score Card
const PerformanceScoreCard = ({ score, target, status, rank }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-700 bg-green-50 border-green-200';
      case 'good': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Amazon Partner Score</h3>
          <p className="text-sm text-gray-500">Performance against Amazon standards</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{score}%</div>
            <div className="text-sm text-gray-500">Current Score</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Your Performance</span>
            <span className="font-medium">{score}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amazon Threshold</span>
            <span className="font-medium">{target}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
              style={{ width: `${target}%` }}
            />
          </div>
        </div>

        {rank && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Partner Ranking</span>
              <span className="font-medium text-gray-900">{rank}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Shipments Table Component
const ShipmentsTable = ({ shipments, onViewDetails, loading }) => {
  const getStatusBadge = (status) => {
    const config = {
      delivered: { color: "bg-green-50 text-green-700 border-green-200", icon: <PackageCheck className="w-3 h-3" /> },
      in_transit: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <Truck className="w-3 h-3" /> },
      late: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Clock4 className="w-3 h-3" /> },
      delayed: { color: "bg-red-50 text-red-700 border-red-200", icon: <AlertCircle className="w-3 h-3" /> },
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
            <p className="text-sm text-gray-500">Track and manage all shipments</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search shipments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              + New Shipment
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Carrier
              </th>
              <th className="py3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Delivery Date
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payout
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{shipment.amazonOrderId}</div>
                  <div className="text-sm text-gray-500">{shipment.id}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{shipment.customer.name}</div>
                  <div className="text-sm text-gray-500">{shipment.destination.city}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{shipment.carrier}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(shipment.status)}
                  <div className="text-xs text-gray-500 mt-1">{shipment.serviceLevel}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium">
                    {formatDate(shipment.timeline.estimatedDelivery)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {shipment.timeline.delivered ? 
                      new Date(shipment.timeline.delivered).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                      'Pending'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">
                    {shipment.financials.totalPayout}
                  </div>
                  <div className={`text-xs font-medium ${shipment.financials.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {shipment.financials.status}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(shipment)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      Track
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Showing {shipments.length} shipments
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Responsive Sidebar Component
const ResponsiveSidebar = ({ activeView, setActiveView, collapsed, toggleSidebar, user }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { id: "shipments", label: "Shipments", icon: <Package className="w-5 h-5" /> },
    { id: "performance", label: "Performance", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "revenue", label: "Revenue", icon: <DollarSign className="w-5 h-5" /> },
    { id: "carriers", label: "Carriers", icon: <Truck className="w-5 h-5" /> },
    { id: "analytics", label: "Analytics", icon: <PieChart className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        w-64 lg:w-20 xl:w-64
        bg-gradient-to-b from-gray-900 to-gray-800 text-white
        flex flex-col
        h-screen
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <Truck className="w-6 h-6" />
              </div>
              {!collapsed && (
                <div className="lg:hidden xl:block">
                  <h1 className="text-lg font-bold tracking-tight">Amazon SPN</h1>
                  <p className="text-xs text-gray-400 mt-0.5">Service Partner</p>
                </div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
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
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
                  ${activeView === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                    : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                  }
                `}
                aria-current={activeView === item.id ? 'page' : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="lg:hidden xl:block text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar}
              alt={`${user?.company} logo`}
              className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-lg"
            />
            {!collapsed && user && (
              <div className="lg:hidden xl:block flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.company}</p>
                <p className="text-xs text-gray-400 truncate">{user.tier}</p>
              </div>
            )}
            <button 
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Main Dashboard Component
const ServiceProviderDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const api = useServiceProviderAPI();

  // Fetch all data
  const { 
    data: profile, 
    isLoading: profileLoading,
    error: profileError 
  } = api.queries.useProfile();
  
  const { 
    data: dashboardStats,
    isLoading: dashboardLoading 
  } = api.queries.useDashboardStats();
  
  const { 
    data: shipmentsData 
  } = api.queries.useShipments({ status: 'all', page: 1, limit: 10 });
  
  const { 
    data: performance 
  } = api.queries.usePerformance();
  
  const { 
    data: revenue 
  } = api.queries.useRevenue();
  
  const { 
    data: notifications 
  } = api.queries.useNotifications();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  // Loading state
  if (profileLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Amazon Service Partner Dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to Amazon SP-API</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-red-200">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">Unable to connect to Amazon SP-API. Please check your connection and try again.</p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Amazon Service Partner Network
                </h1>
                <p className="text-sm text-gray-500">Partner ID: {profile.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications?.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
                )}
              </button>

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                title="Refresh Data"
                aria-label="Refresh dashboard data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <img
                  src={profile.avatar}
                  alt={`${profile.company} logo`}
                  className="w-8 h-8 rounded-full ring-2 ring-blue-500"
                />
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{profile.company}</p>
                  <p className="text-xs text-gray-500">{profile.tier} Partner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <ResponsiveSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          user={profile}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">
                      Welcome back, {profile.company}!
                    </h1>
                    <p className="opacity-90">
                      Your Amazon Partner Dashboard is updated in real-time with the latest metrics.
                    </p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{profile.rating}/5</div>
                      <div className="text-sm opacity-80">Partner Rating</div>
                    </div>
                    <div className="h-12 w-px bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{profile.totalShipments.toLocaleString()}</div>
                      <div className="text-sm opacity-80">Total Shipments</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Today's Revenue"
                  value={dashboardStats.overview.revenueToday}
                  change="+12.5%"
                  trend="up"
                  icon={<DollarSign />}
                  color="bg-green-50"
                  subtitle={`${dashboardStats.overview.deliveredToday} deliveries`}
                />
                <MetricCard
                  title="Active Shipments"
                  value={dashboardStats.overview.activeShipments}
                  change="+8.2%"
                  trend="up"
                  icon={<Package />}
                  color="bg-blue-50"
                  subtitle={`${dashboardStats.overview.inTransit} in transit`}
                />
                <MetricCard
                  title="On-Time Delivery"
                  value={`${dashboardStats.performance.metrics.onTimeDelivery}%`}
                  change={`+${(dashboardStats.performance.metrics.onTimeDelivery - 96).toFixed(1)}%`}
                  trend="up"
                  icon={<Clock />}
                  color="bg-purple-50"
                  subtitle="Target: 97%"
                />
                <MetricCard
                  title="Customer Rating"
                  value={`${dashboardStats.performance.metrics.deliveryExperience}/5`}
                  change="+0.2"
                  trend="up"
                  icon={<Star />}
                  color="bg-yellow-50"
                  subtitle="Delivery Experience"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Score */}
                <div className="lg:col-span-2">
                  <PerformanceScoreCard
                    score={dashboardStats.performance.score}
                    target={dashboardStats.performance.amazonThreshold}
                    status={dashboardStats.performance.status}
                    rank="Top 15%"
                  />
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Delayed Shipments</div>
                        <div className="text-lg font-bold text-yellow-600">
                          {dashboardStats.overview.delayed}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Damage Rate</div>
                        <div className="text-lg font-bold text-green-600">
                          {dashboardStats.performance.metrics.damageRate}%
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Valid Tracking</div>
                        <div className="text-lg font-bold text-blue-600">
                          {dashboardStats.performance.metrics.validTracking}%
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Weekly Growth</div>
                        <div className="text-lg font-bold text-purple-600">
                          +{dashboardStats.overview.weeklyGrowth}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Alerts</h3>
                    <div className="space-y-3">
                      {dashboardStats.alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border ${
                            alert.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {alert.type === 'warning' && (
                                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                )}
                                {alert.type === 'info' && (
                                  <Info className="w-4 h-4 text-blue-600" />
                                )}
                                <div className="font-medium text-sm">{alert.title}</div>
                              </div>
                              <div className="text-sm text-gray-600">{alert.message}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Shipments */}
              {shipmentsData && (
                <ShipmentsTable
                  shipments={shipmentsData.data}
                  onViewDetails={setSelectedShipment}
                />
              )}
            </div>
          )}

          {/* Performance View */}
          {activeView === "performance" && performance && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="text-gray-600">Track your performance against Amazon standards</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Performance Trends</h3>
                    <div className="space-y-4">
                      {performance.trends.map((trend, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-sm text-gray-600 min-w-[80px]">{trend.date}</span>
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex-1 max-w-[200px] sm:max-w-none">
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                                  style={{ width: `${trend.onTime}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right min-w-[80px]">
                              <div className="text-sm font-medium">{trend.onTime}%</div>
                              <div className="text-xs text-gray-500">On Time</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Overall Score</h3>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {performance.overall.score}%
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block mb-3 ${
                        performance.overall.status === 'excellent' ? 'bg-green-100 text-green-700 border border-green-200' :
                        performance.overall.status === 'good' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {performance.overall.status.charAt(0).toUpperCase() + performance.overall.status.slice(1)}
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        Amazon Threshold: {performance.overall.amazonThreshold}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Ranking: {performance.overall.rank}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Key Metrics</h3>
                    <div className="space-y-3">
                      {Object.entries(performance.metrics.deliveryPerformance).map(([key, metric]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <span className="font-medium">
                              {metric.value}{key.includes('Rate') ? '%' : ''}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                metric.value >= 95 ? 'bg-green-500' :
                                metric.value >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(metric.value, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue View */}
          {activeView === "revenue" && revenue && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Revenue & Payments</h1>
                <p className="text-gray-600">Track your earnings and payments from Amazon</p>
              </div>

              {/* Revenue Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">Total Revenue</h3>
                      <p className="text-sm text-gray-500">Current Month</p>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{revenue.overview.totalRevenue}</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Monthly Growth</span>
                      <span className="px-2 py-1 text-sm rounded-full bg-green-50 text-green-700 font-medium border border-green-200">
                        +{revenue.overview.monthlyGrowth}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">YTD Revenue</span>
                      <span className="font-medium">{revenue.overview.ytdRevenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avg Daily Revenue</span>
                      <span className="font-medium">{revenue.overview.avgDailyRevenue}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
                    <div className="space-y-4">
                      {revenue.breakdown.byService.map((service, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                            <span className="text-gray-600">{service.service}</span>
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{service.revenue}</span>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                service.growth > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                                {service.growth > 0 ? '+' : ''}{service.growth}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${service.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payouts */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Recent Payouts</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Method
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {revenue.payouts.map((payout, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">
                              {new Date(payout.date).toLocaleDateString('en-IN')}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-900">{payout.amount}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              payout.status === 'processed' ? 'bg-green-50 text-green-700 border border-green-200' :
                              payout.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}>
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{payout.method}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeView === "settings" && profile && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Partner Settings</h1>
                <p className="text-gray-600">Manage your Amazon Service Partner account</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Settings */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Company Profile</h3>
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <img
                          src={profile.avatar}
                          alt={`${profile.company} logo`}
                          className="w-20 h-20 rounded-full border-4 border-gray-100"
                        />
                        <div>
                          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Change Logo
                          </button>
                          <p className="text-sm text-gray-500 mt-2">JPG, PNG or SVG. Max 5MB</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            defaultValue={profile.company}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Legal Name
                          </label>
                          <input
                            type="text"
                            defaultValue={profile.legalName}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={profile.email}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            defaultValue={profile.phone}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GSTIN
                        </label>
                        <input
                          type="text"
                          defaultValue={profile.taxInfo.gstin}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                          <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Cancel
                          </button>
                          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partner Information */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Partner Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Partner ID</span>
                        <span className="font-medium text-gray-900">{profile.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Partner Tier</span>
                        <span className="font-medium text-gray-900">{profile.tier}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Join Date</span>
                        <span className="font-medium text-gray-900">
                          {new Date(profile.joinDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Shipments</span>
                        <span className="font-medium text-gray-900">
                          {profile.totalShipments.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <span className="font-medium text-gray-900">{profile.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Bank Details</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600">Bank Name</div>
                        <div className="font-medium">{profile.bankDetails.bankName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Account Number</div>
                        <div className="font-medium">•••• {profile.bankDetails.accountNumber.slice(-4)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">IFSC Code</div>
                        <div className="font-medium">{profile.bankDetails.ifsc}</div>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Update Bank Details
                      </button>
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
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceProviderDashboard />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

export default App;