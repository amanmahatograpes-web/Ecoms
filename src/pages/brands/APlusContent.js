// src/pages/aplus-content/APlusContentManager.js
import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  BarChart3,
  FileText,
  Image,
  Video,
  Copy,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Globe,
  Calendar,
  Users
} from "lucide-react";

// Mock data for A+ Content
const MOCK_A_PLUS_CONTENT = [
  {
    id: 1,
    title: "Premium Headphones - Ultimate Experience",
    asin: "B08XYZ1234",
    brand: "Sony",
    status: "published",
    lastUpdated: "2024-03-15",
    views: "12.5K",
    conversion: "8.2%",
    modules: 5,
    grade: "A+",
    languages: ["en", "es", "fr"],
    marketplace: "US",
    images: 8,
    videos: 2,
    liveDate: "2024-03-10",
    creator: "John Doe",
    performance: "excellent"
  },
  {
    id: 2,
    title: "Gaming Laptop - Pro Edition",
    asin: "B08ABC5678",
    brand: "Dell",
    status: "draft",
    lastUpdated: "2024-03-14",
    views: "0",
    conversion: "0%",
    modules: 3,
    grade: "B",
    languages: ["en"],
    marketplace: "US",
    images: 6,
    videos: 1,
    liveDate: null,
    creator: "Jane Smith",
    performance: "pending"
  },
  {
    id: 3,
    title: "Smart Watch Series 8",
    asin: "B09XYZ9876",
    brand: "Apple",
    status: "pending",
    lastUpdated: "2024-03-13",
    views: "8.7K",
    conversion: "6.5%",
    modules: 4,
    grade: "A",
    languages: ["en", "de", "jp"],
    marketplace: "EU",
    images: 10,
    videos: 3,
    liveDate: "2024-03-05",
    creator: "Mike Johnson",
    performance: "good"
  },
  {
    id: 4,
    title: "Professional Camera Kit",
    asin: "B07DEF4321",
    brand: "Canon",
    status: "rejected",
    lastUpdated: "2024-03-12",
    views: "15.2K",
    conversion: "9.8%",
    modules: 6,
    grade: "A+",
    languages: ["en", "es", "fr", "de"],
    marketplace: "US",
    images: 12,
    videos: 2,
    liveDate: "2024-02-28",
    creator: "Sarah Wilson",
    performance: "excellent",
    rejectionReason: "Image quality below standards"
  },
  {
    id: 5,
    title: "Wireless Earbuds Pro",
    asin: "B08MNO6543",
    brand: "Samsung",
    status: "published",
    lastUpdated: "2024-03-11",
    views: "21.3K",
    conversion: "12.4%",
    modules: 7,
    grade: "A+",
    languages: ["en", "es", "fr", "de", "it"],
    marketplace: "Global",
    images: 15,
    videos: 4,
    liveDate: "2024-03-01",
    creator: "Robert Brown",
    performance: "outstanding"
  }
];

// Status configuration
const STATUS_CONFIG = {
  published: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: <CheckCircle className="h-4 w-4" />,
    label: "Published",
    badgeColor: "text-green-800 bg-green-100"
  },
  draft: {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: <FileText className="h-4 w-4" />,
    label: "Draft",
    badgeColor: "text-blue-800 bg-blue-100"
  },
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: <Clock className="h-4 w-4" />,
    label: "Pending Review",
    badgeColor: "text-yellow-800 bg-yellow-100"
  },
  rejected: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: <XCircle className="h-4 w-4" />,
    label: "Rejected",
    badgeColor: "text-red-800 bg-red-100"
  }
};

// Performance configuration
const PERFORMANCE_CONFIG = {
  outstanding: {
    color: "bg-purple-100 text-purple-800",
    label: "Outstanding"
  },
  excellent: {
    color: "bg-green-100 text-green-800",
    label: "Excellent"
  },
  good: {
    color: "bg-blue-100 text-blue-800",
    label: "Good"
  },
  average: {
    color: "bg-yellow-100 text-yellow-800",
    label: "Average"
  },
  poor: {
    color: "bg-red-100 text-red-800",
    label: "Poor"
  },
  pending: {
    color: "bg-gray-100 text-gray-800",
    label: "Pending"
  }
};

// Grade configuration
const GRADE_CONFIG = {
  "A+": "text-green-600 bg-green-50 border border-green-200",
  "A": "text-blue-600 bg-blue-50 border border-blue-200",
  "B": "text-yellow-600 bg-yellow-50 border border-yellow-200",
  "C": "text-orange-600 bg-orange-50 border border-orange-200",
  "D": "text-red-600 bg-red-50 border border-red-200"
};

// Marketplace configuration
const MARKETPLACE_CONFIG = {
  US: { flag: "🇺🇸", name: "United States" },
  EU: { flag: "🇪🇺", name: "European Union" },
  UK: { flag: "🇬🇧", name: "United Kingdom" },
  CA: { flag: "🇨🇦", name: "Canada" },
  AU: { flag: "🇦🇺", name: "Australia" },
  JP: { flag: "🇯🇵", name: "Japan" },
  Global: { flag: "🌍", name: "Global" }
};

// Reusable Components
const Card = ({ children, className = "", hover = false, onClick }) => (
  <div 
    className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-blue-300' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  disabled = false,
  onClick,
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${icon ? 'gap-2' : ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && React.cloneElement(icon, { className: "h-4 w-4" })}
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

const Input = ({ className = "", type = "text", placeholder, value, onChange, icon, ...props }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      type={type}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${icon ? 'pl-10' : ''} ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  </div>
);

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {title && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
            )}
            {children}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function APlusContentManager() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMarketplace, setSelectedMarketplace] = useState("all");
  const [content, setContent] = useState(MOCK_A_PLUS_CONTENT);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sortBy, setSortBy] = useState("lastUpdated");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Filter and sort content
  const filteredContent = useMemo(() => {
    let filtered = content.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.asin.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
      const matchesMarketplace = selectedMarketplace === "all" || item.marketplace === selectedMarketplace;
      
      return matchesSearch && matchesStatus && matchesMarketplace;
    });
    
    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "views":
          aValue = parseFloat(a.views.replace('K', '')) * 1000;
          bValue = parseFloat(b.views.replace('K', '')) * 1000;
          break;
        case "conversion":
          aValue = parseFloat(a.conversion.replace('%', ''));
          bValue = parseFloat(b.conversion.replace('%', ''));
          break;
        case "lastUpdated":
        default:
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [content, search, selectedStatus, selectedMarketplace, sortBy, sortOrder]);
  
  // Statistics
  const stats = useMemo(() => {
    const published = content.filter(c => c.status === "published").length;
    const draft = content.filter(c => c.status === "draft").length;
    const pending = content.filter(c => c.status === "pending").length;
    const totalViews = content.reduce((sum, c) => {
      const views = c.views.endsWith('K') ? parseFloat(c.views) * 1000 : parseInt(c.views);
      return sum + views;
    }, 0);
    const avgConversion = content.reduce((sum, c) => {
      return sum + parseFloat(c.conversion.replace('%', ''));
    }, 0) / content.length;
    
    return { published, draft, pending, totalViews, avgConversion };
  }, [content]);
  
  // Handle content actions
  const handleViewContent = (item) => {
    setSelectedContent(item);
    setShowPreview(true);
  };
  
  const handleEditContent = (item) => {
    console.log("Editing content:", item);
    // In real app, navigate to editor
  };
  
  const handleDeleteContent = (id) => {
    if (window.confirm("Are you sure you want to delete this A+ Content?")) {
      setContent(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const handleDuplicateContent = (item) => {
    const newItem = {
      ...item,
      id: Math.max(...content.map(c => c.id)) + 1,
      title: `${item.title} (Copy)`,
      status: "draft",
      views: "0",
      conversion: "0%",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setContent([...content, newItem]);
  };
  
  const handleCreateNew = () => {
    // In real app, navigate to content creator
    console.log("Create new A+ Content");
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };
  
  const SortableHeader = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900"
    >
      {children}
      {sortBy === field && (
        sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">A+ Content Manager</h1>
            <p className="text-gray-500 mt-1">Manage and optimize your Amazon A+ Content</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              icon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
            <Button 
              onClick={handleCreateNew}
              icon={<Plus className="h-4 w-4" />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create A+ Content
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Published Content</p>
                  <p className="text-2xl font-bold mt-1">{stats.published}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Draft Content</p>
                  <p className="text-2xl font-bold mt-1">{stats.draft}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold mt-1">
                    {(stats.totalViews / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg Conversion</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.avgConversion.toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <Input
                type="text"
                placeholder="Search by title, ASIN, or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select 
                value={selectedMarketplace}
                onChange={(e) => setSelectedMarketplace(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Marketplaces</option>
                <option value="US">United States</option>
                <option value="EU">European Union</option>
                <option value="UK">United Kingdom</option>
                <option value="Global">Global</option>
              </select>
              
              <Button variant="outline" icon={<Filter className="h-4 w-4" />}>
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Content Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>A+ Content ({filteredContent.length})</CardTitle>
            <div className="text-sm text-gray-500">
              Sorted by: {sortBy} ({sortOrder})
            </div>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortableHeader field="title">
                    Content Title
                  </SortableHeader>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortableHeader field="views">
                    Views
                  </SortableHeader>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortableHeader field="conversion">
                    Conversion
                  </SortableHeader>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketplace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => {
                const statusConfig = STATUS_CONFIG[item.status];
                const performanceConfig = PERFORMANCE_CONFIG[item.performance];
                const marketplaceConfig = MARKETPLACE_CONFIG[item.marketplace];
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </p>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${GRADE_CONFIG[item.grade]}`}>
                              {item.grade}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {item.asin}
                            </span>
                            <span>•</span>
                            <span>{item.brand}</span>
                            <span>•</span>
                            <span>{item.modules} modules</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Image className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{item.images} images</span>
                            <Video className="h-3 w-3 text-gray-400 ml-2" />
                            <span className="text-xs text-gray-500">{item.videos} videos</span>
                            <Globe className="h-3 w-3 text-gray-400 ml-2" />
                            <span className="text-xs text-gray-500">{item.languages.length} langs</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {statusConfig.icon}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.badgeColor}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      {item.status === "rejected" && item.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1 truncate max-w-xs">
                          {item.rejectionReason}
                        </p>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${performanceConfig.color}`}>
                          {performanceConfig.label}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.views}</div>
                      <div className="text-xs text-gray-500">views</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.conversion}</div>
                      <div className="text-xs text-gray-500">conversion rate</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{marketplaceConfig.flag}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.marketplace}</div>
                          <div className="text-xs text-gray-500">{marketplaceConfig.name}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {item.liveDate ? `Live: ${new Date(item.liveDate).toLocaleDateString()}` : 'Not live'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContent(item)}
                          icon={<Eye className="h-4 w-4" />}
                          title="Preview"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditContent(item)}
                          icon={<Edit className="h-4 w-4" />}
                          title="Edit"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateContent(item)}
                          icon={<Copy className="h-4 w-4" />}
                          title="Duplicate"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContent(item.id)}
                          icon={<Trash2 className="h-4 w-4" />}
                          title="Delete"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredContent.length === 0 && (
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No A+ Content found</h3>
            <p className="text-gray-500 mb-4">
              {search ? `No content matching "${search}"` : "Get started by creating your first A+ Content"}
            </p>
            <Button onClick={handleCreateNew} icon={<Plus className="h-4 w-4" />}>
              Create A+ Content
            </Button>
          </CardContent>
        )}
        
        {/* Pagination */}
        {filteredContent.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredContent.length}</span> of{" "}
                <span className="font-medium">{filteredContent.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">A+ Content</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Brand Story</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Video Content</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const count = content.filter(c => c.status === key).length;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <span className="text-sm text-gray-700">{config.label}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" icon={<Upload className="h-4 w-4" />}>
                Bulk Upload Content
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={<Download className="h-4 w-4" />}>
                Download Templates
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={<ExternalLink className="h-4 w-4" />}>
                View Guidelines
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={<BarChart3 className="h-4 w-4" />}>
                Performance Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={selectedContent ? `Preview: ${selectedContent.title}` : "Preview"}
      >
        {selectedContent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">ASIN</h4>
                <p className="mt-1">{selectedContent.asin}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Brand</h4>
                <p className="mt-1">{selectedContent.brand}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Status</h4>
                <div className="mt-1">
                  <Badge variant={
                    selectedContent.status === "published" ? "success" :
                    selectedContent.status === "draft" ? "info" :
                    selectedContent.status === "pending" ? "warning" : "danger"
                  }>
                    {STATUS_CONFIG[selectedContent.status].label}
                  </Badge>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Grade</h4>
                <p className="mt-1 font-medium">{selectedContent.grade}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Content Modules</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: selectedContent.modules }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                    Module {i + 1}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  handleEditContent(selectedContent);
                  setShowPreview(false);
                }}>
                  Edit Content
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}