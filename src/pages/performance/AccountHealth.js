// AccountHealth.jsx  
import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  BarChart3,
  Bell,
  Clock,
  Package,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// =============================================
// DATA STRUCTURE & CONSTANTS
// =============================================

const STATUS_CONFIG = {
  excellent: {
    color: "text-green-700",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    borderColor: "border-green-200",
    label: "Excellent",
    icon: CheckCircle,
  },
  good: {
    color: "text-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
    borderColor: "border-green-200",
    label: "Good",
    icon: CheckCircle,
  },
  fair: {
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-500",
    borderColor: "border-yellow-200",
    label: "Fair",
    icon: AlertTriangle,
  },
  poor: {
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200",
    label: "Poor",
    icon: AlertTriangle,
  },
  critical: {
    color: "text-red-600",
    bgColor: "bg-red-50",
    iconColor: "text-red-500",
    borderColor: "border-red-200",
    label: "Critical",
    icon: AlertCircle,
  },
};

const AMAZON_THRESHOLDS = {
  orderDefectRate: 1.0,
  cancellationRate: 2.5,
  lateDispatchRate: 4.0,
  validTrackingRate: 95.0,
  returnRate: 10.0,
  customerServiceDissatisfaction: 25.0,
  shipmentLateRate: 4.0,
  invoiceDefectRate: 5.0,
};

const METRICS_DATA = [
  {
    id: "odr",
    title: "Order Defect Rate",
    value: "0.3%",
    numericValue: 0.3,
    status: "excellent",
    description: "Percentage of orders with defects (negative feedback, A-to-z claims, or service chargebacks)",
    icon: <Shield className="w-5 h-5" />,
    target: 0.5,
    current: 0.3,
    threshold: AMAZON_THRESHOLDS.orderDefectRate,
    improvement: 70,
    trend: "up",
    lastUpdated: "2024-01-15",
    impact: "high",
    category: "order",
    amazonRequirement: "Must be below 1%",
    suggestions: [
      "Respond to negative feedback within 24 hours",
      "Monitor A-to-z claims daily",
      "Ensure accurate product descriptions",
    ],
    history: [
      { date: "2024-01", value: 0.4 },
      { date: "2023-12", value: 0.5 },
      { date: "2023-11", value: 0.6 },
    ]
  },
  {
    id: "cancellation",
    title: "Cancellation Rate",
    value: "0.9%",
    numericValue: 0.9,
    status: "good",
    description: "Percentage of orders cancelled by you after confirmation",
    icon: <XCircle className="w-5 h-5" />,
    target: 1.0,
    current: 0.9,
    threshold: AMAZON_THRESHOLDS.cancellationRate,
    improvement: 64,
    trend: "stable",
    lastUpdated: "2024-01-15",
    impact: "high",
    category: "order",
    amazonRequirement: "Must be below 2.5%",
    suggestions: [
      "Maintain accurate inventory levels",
      "Update stock quantities regularly",
      "Use restock alerts",
    ],
    history: [
      { date: "2024-01", value: 0.9 },
      { date: "2023-12", value: 1.2 },
      { date: "2023-11", value: 1.5 },
    ]
  },
  {
    id: "late-dispatch",
    title: "Late Dispatch Rate",
    value: "1.2%",
    numericValue: 1.2,
    status: "good",
    description: "Percentage of orders dispatched after the expected ship date",
    icon: <Clock className="w-5 h-5" />,
    target: 2.0,
    current: 1.2,
    threshold: AMAZON_THRESHOLDS.lateDispatchRate,
    improvement: 30,
    trend: "down",
    lastUpdated: "2024-01-15",
    impact: "medium",
    category: "fulfillment",
    amazonRequirement: "Must be below 4%",
    suggestions: [
      "Set realistic handling times",
      "Use Amazon-approved carriers",
      "Process orders within 24 hours",
    ],
    history: [
      { date: "2024-01", value: 1.2 },
      { date: "2023-12", value: 1.8 },
      { date: "2023-11", value: 2.5 },
    ]
  },
  {
    id: "valid-tracking",
    title: "Valid Tracking Rate",
    value: "98.5%",
    numericValue: 98.5,
    status: "excellent",
    description: "Percentage of shipments with valid tracking uploaded",
    icon: <Package className="w-5 h-5" />,
    target: 99.0,
    current: 98.5,
    threshold: AMAZON_THRESHOLDS.validTrackingRate,
    improvement: 95,
    trend: "up",
    lastUpdated: "2024-01-15",
    impact: "medium",
    category: "fulfillment",
    amazonRequirement: "Must be above 95%",
    suggestions: [
      "Upload tracking within 24 hours",
      "Use integrated shipping carriers",
      "Verify tracking numbers before submission",
    ],
    history: [
      { date: "2024-01", value: 98.5 },
      { date: "2023-12", value: 97.8 },
      { date: "2023-11", value: 96.5 },
    ]
  },
  {
    id: "return-rate",
    title: "Return Rate",
    value: "2.1%",
    numericValue: 2.1,
    status: "excellent",
    description: "Percentage of orders returned by customers",
    icon: <RefreshCw className="w-5 h-5" />,
    target: 5.0,
    current: 2.1,
    threshold: AMAZON_THRESHOLDS.returnRate,
    improvement: 79,
    trend: "stable",
    lastUpdated: "2024-01-15",
    impact: "low",
    category: "customer",
    amazonRequirement: "Varies by category (typically <10%)",
    suggestions: [
      "Improve product descriptions",
      "Add high-quality images",
      "Include accurate sizing charts",
    ],
    history: [
      { date: "2024-01", value: 2.1 },
      { date: "2023-12", value: 2.5 },
      { date: "2023-11", value: 3.0 },
    ]
  },
  {
    id: "cs-dissatisfaction",
    title: "Customer Service Dissatisfaction",
    value: "8.2%",
    numericValue: 8.2,
    status: "good",
    description: "Percentage of customers dissatisfied with your service",
    icon: <BarChart3 className="w-5 h-5" />,
    target: 10.0,
    current: 8.2,
    threshold: AMAZON_THRESHOLDS.customerServiceDissatisfaction,
    improvement: 85,
    trend: "up",
    lastUpdated: "2024-01-15",
    impact: "medium",
    category: "customer",
    amazonRequirement: "Must be below 25%",
    suggestions: [
      "Respond to messages within 24 hours",
      "Use professional templates",
      "Offer proactive solutions",
    ],
    history: [
      { date: "2024-01", value: 8.2 },
      { date: "2023-12", value: 9.5 },
      { date: "2023-11", value: 11.0 },
    ]
  },
];

const NOTIFICATION_DATA = [
  {
    id: "1",
    type: "warning",
    title: "Late Dispatch Rate approaching threshold",
    message: "Your Late Dispatch Rate is at 1.2%. Consider improving fulfillment processes to maintain healthy metrics.",
    date: "2024-01-15",
    read: false,
    actionRequired: true,
    metricId: "late-dispatch",
    priority: "medium",
  },
  {
    id: "2",
    type: "info",
    title: "Best Practice: Use Amazon Shipping Services",
    message: "Using Amazon-partnered carriers can improve your Valid Tracking Rate and reduce shipping delays.",
    date: "2024-01-14",
    read: true,
    actionRequired: false,
    priority: "low",
  },
  {
    id: "3",
    type: "success",
    title: "Order Defect Rate below target",
    message: "Great work! Your Order Defect Rate of 0.3% is well within Amazon's requirements.",
    date: "2024-01-13",
    read: true,
    actionRequired: false,
    metricId: "odr",
    priority: "low",
  },
  {
    id: "4",
    type: "critical",
    title: "Account Health Review Required",
    message: "One or more metrics require immediate attention to avoid account deactivation.",
    date: "2024-01-12",
    read: false,
    actionRequired: true,
    priority: "high",
  },
];

const SUMMARY_DATA = {
  overallScore: 87,
  status: "good",
  atRiskMetrics: 1,
  compliantMetrics: 5,
  totalMetrics: 6,
  lastUpdated: "2024-01-15 14:30",
  nextReviewDate: "2024-02-15",
  trend: "improving",
  previousScore: 84,
};

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "order", label: "Order Metrics" },
  { id: "fulfillment", label: "Fulfillment" },
  { id: "customer", label: "Customer Experience" },
];

const IMPACT_LEVELS = [
  { id: "all", label: "All Impact Levels" },
  { id: "high", label: "High Impact" },
  { id: "medium", label: "Medium Impact" },
  { id: "low", label: "Low Impact" },
];

// =============================================
// CUSTOM UI COMPONENTS
// =============================================

// Custom Card Component
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// Custom Progress Bar
const Progress = ({ value, className = "", ...props }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`} {...props}>
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

// Custom Button
const Button = ({ children, variant = "default", size = "md", className = "", ...props }) => {
  const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Badge
const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span className={`${baseClasses} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Custom Skeleton Loader
const Skeleton = ({ className = "", ...props }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} {...props} />
);

// Custom Separator
const Separator = ({ className = "", ...props }) => (
  <hr className={`border-t border-gray-200 ${className}`} {...props} />
);

// Custom Tabs
const Tabs = ({ children, value, onValueChange, className = "", ...props }) => (
  <div className={className} {...props}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeValue: value, onValueChange })
    )}
  </div>
);

const TabsList = ({ children, className = "", ...props }) => (
  <div className={`inline-flex rounded-lg border border-gray-200 p-1 ${className}`} {...props}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, activeValue, onValueChange, className = "", ...props }) => {
  const isActive = activeValue === value;
  
  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      } ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeValue, className = "", ...props }) => {
  if (value !== activeValue) return null;
  
  return (
    <div className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Custom Tooltip
const TooltipProvider = ({ children }) => <>{children}</>;

const Tooltip = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return React.Children.map(children, child => {
    if (child.type === TooltipTrigger) {
      return React.cloneElement(child, { onMouseEnter: () => setIsOpen(true), onMouseLeave: () => setIsOpen(false) });
    }
    if (child.type === TooltipContent && isOpen) {
      return child;
    }
    return child;
  });
};

const TooltipTrigger = ({ children, ...props }) => (
  <span className="inline-block" {...props}>
    {children}
  </span>
);

const TooltipContent = ({ children, className = "", ...props }) => (
  <div
    className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg max-w-xs ${className}`}
    {...props}
  >
    {children}
    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
  </div>
);

// Custom Dropdown Menu
const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return React.Children.map(children, child => {
    if (child.type === DropdownMenuTrigger) {
      return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
    }
    if (child.type === DropdownMenuContent && isOpen) {
      return React.cloneElement(child, { onClose: () => setIsOpen(false) });
    }
    return child;
  });
};

const DropdownMenuTrigger = ({ children, className = "", ...props }) => (
  <button className={className} {...props}>
    {children}
  </button>
);

const DropdownMenuContent = ({ children, onClose, className = "", ...props }) => (
  <div
    className={`absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg border border-gray-200 ${className}`}
    onMouseLeave={onClose}
    {...props}
  >
    <div className="py-1">
      {children}
    </div>
  </div>
);

const DropdownMenuItem = ({ children, className = "", ...props }) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Custom Select
const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { isOpen, onClick: () => setIsOpen(!isOpen), value });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, { onClose: () => setIsOpen(false), value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, isOpen, value, onClick, className = "", ...props }) => (
  <button
    className={`w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 ${className}`}
    onClick={onClick}
    {...props}
  >
    <span>{value || children}</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
  </button>
);

const SelectContent = ({ children, onClose, value, onValueChange, className = "", ...props }) => (
  <div
    className={`absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 ${className}`}
    onMouseLeave={onClose}
    {...props}
  >
    <div className="py-1 max-h-60 overflow-auto">
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          isSelected: child.props.value === value,
          onClick: () => {
            onValueChange(child.props.value);
            onClose();
          }
        })
      )}
    </div>
  </div>
);

const SelectItem = ({ children, isSelected, onClick, className = "", ...props }) => (
  <button
    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;

// Custom Input
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
);

// =============================================
// MAIN COMPONENT (Same as before, but with custom components)
// =============================================

export default function AccountHealth() {
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [filteredMetrics, setFilteredMetrics] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState({});
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterImpact, setFilterImpact] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("impact");

  // Initialize data
  useEffect(() => {
    setTimeout(() => {
      setHealthMetrics(METRICS_DATA);
      setFilteredMetrics(METRICS_DATA);
      setNotifications(NOTIFICATION_DATA);
      setSummary(SUMMARY_DATA);
      setLoading(false);
    }, 300);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    if (!healthMetrics.length) return;

    let filtered = [...healthMetrics];

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(metric => metric.category === filterCategory);
    }

    // Apply impact filter
    if (filterImpact !== "all") {
      filtered = filtered.filter(metric => metric.impact === filterImpact);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(metric =>
        metric.title.toLowerCase().includes(query) ||
        metric.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "impact":
          const impactOrder = { high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact] - impactOrder[a.impact];
        case "status":
          const statusOrder = { critical: 1, poor: 2, fair: 3, good: 4, excellent: 5 };
          return statusOrder[a.status] - statusOrder[b.status];
        case "value":
          return b.numericValue - a.numericValue;
        case "improvement":
          return b.improvement - a.improvement;
        default:
          return 0;
      }
    });

    setFilteredMetrics(filtered);
  }, [healthMetrics, filterCategory, filterImpact, searchQuery, sortBy]);

  const getTrendIcon = (trend) => {
    if (trend === "up")
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down")
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <TrendingUp className="w-4 h-4 text-gray-400" />;
  };

  const overallHealth = useMemo(() => {
    if (!healthMetrics.length) return 0;

    const totalWeight = healthMetrics.reduce((sum, m) => {
      const w = m.impact === "high" ? 3 : m.impact === "medium" ? 2 : 1;
      return sum + w;
    }, 0);

    const weighted = healthMetrics.reduce((sum, m) => {
      const w = m.impact === "high" ? 3 : m.impact === "medium" ? 2 : 1;
      return sum + m.improvement * w;
    }, 0);

    return Math.round(weighted / totalWeight);
  }, [healthMetrics]);

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const criticalMetrics = healthMetrics.filter((m) => m.status === "critical" || m.status === "poor");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleMetricExpand = (metricId) => {
    setExpandedMetrics(prev => ({
      ...prev,
      [metricId]: !prev[metricId]
    }));
  };

  const getStatusColor = (status) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.good;
    return {
      background: `linear-gradient(135deg, ${cfg.bgColor} 0%, white 100%)`,
      border: `1px solid ${cfg.borderColor}`,
    };
  };

  const exportData = () => {
    console.log("Exporting metrics data...");
    alert("Data export functionality would be implemented here.");
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <Skeleton className="h-8 w-56 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-1/2 mb-3" />
              <Skeleton className="h-10 w-1/3 mb-3" />
              <Skeleton className="h-2 w-full mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-1/2 mb-3" />
              <Skeleton className="h-10 w-1/3 mb-3" />
              <Skeleton className="h-2 w-full mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto"
    >
      {/* HEADER - Responsive stacking */}
      <div className="flex flex-col lg:flex-row justify-between mb-6 lg:mb-8 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold">Account Health</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Monitor your performance and stay compliant with Amazon policies
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Overall Health Card - Responsive sizing */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border shadow-sm w-full sm:w-auto">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600">
              {overallHealth}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Overall Health</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                className={`${STATUS_CONFIG[summary.status].bgColor} ${STATUS_CONFIG[summary.status].color}`}
              >
                {STATUS_CONFIG[summary.status].label}
              </Badge>
              <span className="text-xs text-gray-500">
                {summary.trend === "improving" ? "↑ Improving" : "↓ Declining"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="gap-2 flex-1 sm:flex-none"
              size="sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* QUICK STATS - Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <Card className="p-3 sm:p-4 flex items-center gap-3">
          <div className="p-2 rounded bg-green-50">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl">{summary.compliantMetrics}</h2>
            <p className="text-xs sm:text-sm text-gray-600">Compliant</p>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 flex items-center gap-3">
          <div className="p-2 rounded bg-red-50">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl">{summary.atRiskMetrics}</h2>
            <p className="text-xs sm:text-sm text-gray-600">At Risk</p>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 flex items-center gap-3">
          <div className="p-2 rounded bg-blue-50">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl">{unreadNotifications}</h2>
            <p className="text-xs sm:text-sm text-gray-600">Unread Alerts</p>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 flex items-center gap-3">
          <div className="p-2 rounded bg-purple-50">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl">{summary.totalMetrics}</h2>
            <p className="text-xs sm:text-sm text-gray-600">Total Metrics</p>
          </div>
        </Card>
      </div>

      {/* CRITICAL ALERT BANNER */}
      <AnimatePresence>
        {criticalMetrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-red-50 border border-red-200 mb-6">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold">Attention Required</h3>
                  <p className="text-gray-700 mt-1 sm:mt-2 text-sm sm:text-base">
                    {criticalMetrics.length} metric(s) require immediate action to avoid account restrictions.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {criticalMetrics.map(metric => (
                      <Badge key={metric.id} variant="destructive" className="text-xs">
                        {metric.title}: {metric.value}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="destructive" size="sm" className="mt-3">
                    View Required Actions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABS & FILTERS */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">
                <span className="hidden sm:inline">Metrics</span>
                <span className="sm:hidden">Details</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="relative">
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
                {unreadNotifications > 0 && (
                  <Badge className="ml-2 absolute -top-2 -right-2" variant="destructive">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters - Show only on Metrics tab */}
          {activeTab === "metrics" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Search metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48"
                />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impact">Impact</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterImpact} onValueChange={setFilterImpact}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Impact" />
                  </SelectTrigger>
                  <SelectContent>
                    {IMPACT_LEVELS.map(level => (
                      <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* OVERVIEW TAB - Responsive card grid */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredMetrics.map((metric, i) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="h-full"
              >
                <Card
                  className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
                  style={getStatusColor(metric.status)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-sm sm:text-base font-semibold">
                            {metric.title}
                          </CardTitle>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-sm">{metric.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {metric.description}
                        </p>
                      </div>
                      <div
                        className={`p-2 rounded-full ${STATUS_CONFIG[metric.status].bgColor} ml-2 flex-shrink-0`}
                      >
                        <span className={STATUS_CONFIG[metric.status].iconColor}>
                          {metric.icon}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xl sm:text-2xl font-bold">
                        {metric.value}
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className="text-xs sm:text-sm font-medium">
                          {metric.improvement}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Current: {metric.current}%</span>
                        <span>Limit: {metric.threshold}%</span>
                      </div>
                      <Progress
                        value={(metric.current / metric.threshold) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge
                        className={`${STATUS_CONFIG[metric.status].bgColor} ${STATUS_CONFIG[metric.status].color} text-xs`}
                      >
                        {STATUS_CONFIG[metric.status].label}
                      </Badge>
                      <button
                        onClick={() => toggleMetricExpand(metric.id)}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                      >
                        {expandedMetrics[metric.id] ? "Less" : "More"}
                        {expandedMetrics[metric.id] ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence>
                      {expandedMetrics[metric.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <h4 className="font-semibold text-xs mb-2">Amazon Requirement:</h4>
                          <p className="text-xs text-gray-600 mb-3">{metric.amazonRequirement}</p>
                          <h4 className="font-semibold text-xs mb-2">Quick Actions:</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {metric.suggestions.slice(0, 2).map((s, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* METRICS DETAIL TAB */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredMetrics.length} of {healthMetrics.length} metrics
          </div>
          
          <div className="space-y-4">
            {filteredMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
                    <div className="flex gap-3 sm:gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${STATUS_CONFIG[metric.status].bgColor} flex-shrink-0`}
                      >
                        <span className={STATUS_CONFIG[metric.status].iconColor}>
                          {metric.icon}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base sm:text-lg">
                            {metric.title}
                          </h3>
                          <Badge
                            className={STATUS_CONFIG[metric.status].bgColor}
                          >
                            {STATUS_CONFIG[metric.status].label}
                          </Badge>
                          <span className="flex items-center text-sm text-gray-600 gap-1">
                            {getTrendIcon(metric.trend)}
                            <span className="hidden sm:inline">{metric.trend}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {metric.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                          <div className="text-2xl font-bold">
                            {metric.value}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Improvement: </span>
                            <span className="font-semibold">{metric.improvement}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:text-right">
                      <p className="text-sm text-gray-600">
                        Amazon Requirement
                      </p>
                      <p className="font-semibold text-sm sm:text-base">
                        {metric.amazonRequirement}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated: {new Date(metric.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Suggestions</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {metric.suggestions.map((s, i) => (
                          <li key={i} className="flex gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Progress</h4>
                      <div className="space-y-2">
                        <div className="text-sm flex justify-between">
                          <span>Current</span>
                          <span>{metric.current}%</span>
                        </div>
                        <Progress
                          value={(metric.current / metric.threshold) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>Target: {metric.target}%</span>
                          <span>Limit: {metric.threshold}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Impact:</span>
                          <Badge
                            className={`${
                              metric.impact === "high"
                                ? "bg-red-100 text-red-700"
                                : metric.impact === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {metric.impact.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Category:</span>
                          <Badge variant="outline" className="text-xs">
                            {metric.category}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Trend:</span>
                          <span className="text-sm font-medium">{metric.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
            <div className="text-sm text-gray-600">
              {unreadNotifications} unread of {notifications.length} total notifications
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={markAllRead} className="flex-1 sm:flex-none">
                Mark all as read
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`p-3 sm:p-4 border-l-4 ${
                  n.type === "warning"
                    ? "border-yellow-500 bg-yellow-50"
                    : n.type === "critical"
                    ? "border-red-600 bg-red-50"
                    : n.type === "success"
                    ? "border-green-600 bg-green-50"
                    : "border-blue-600 bg-blue-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      {n.type === "critical" && <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />}
                      {n.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />}
                      {n.type === "success" && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
                      {n.type === "info" && <Info className="w-4 h-4 text-blue-600 mt-0.5" />}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base">{n.title}</h3>
                          {!n.read && (
                            <Badge variant="destructive" className="text-xs">
                              NEW
                            </Badge>
                          )}
                          {n.actionRequired && (
                            <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mt-1 text-sm sm:text-base">{n.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(n.date).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </div>
    </motion.div>
  );
}