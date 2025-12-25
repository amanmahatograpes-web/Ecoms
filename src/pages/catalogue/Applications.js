import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter,
  Download,
  Plus,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Package,
  Tag,
  BarChart3,
  Shield,
  Globe,
  HelpCircle,
  ChevronRight,
  X,
  Menu,
  Grid,
  List,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MoreVertical,
  Eye,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';
const PAGE_SIZE = 10;

// Constants and configuration
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' }
];

const CATEGORIES = [
  'Electronics',
  'Books',
  'Home & Kitchen',
  'Clothing',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Automotive',
  'Health & Household',
  'Grocery'
];

const BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Nike',
  'Adidas',
  'Amazon Basics',
  'Philips',
  'LG',
  'HP',
  'Dell'
];

const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    text: 'Approved'
  },
  declined: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    text: 'Declined'
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    text: 'Rejected'
  },
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    text: 'Pending'
  },
  under_review: {
    icon: AlertTriangle,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    text: 'Under Review'
  },
  action_required: {
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    text: 'Action Required'
  },
  appeal: {
    icon: FileText,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    text: 'Appeal Submitted'
  },
  default: {
    icon: Clock,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    text: 'Unknown'
  }
};

const TABS_CONFIG = [
  { id: 'all', label: 'All', icon: null, count: 0 },
  { id: 'action_required', label: 'Action', icon: AlertCircle, count: 0 },
  { id: 'pending', label: 'Pending', icon: Clock, count: 0 },
  { id: 'under_review', label: 'Review', icon: AlertTriangle, count: 0 },
  { id: 'approved', label: 'Approved', icon: CheckCircle, count: 0 },
  { id: 'declined', label: 'Declined', icon: XCircle, count: 0 },
  { id: 'appeal', label: 'Appeal', icon: FileText, count: 0 }
];

// Helper functions
const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.default;
};

const normalizeApplicationsData = (rawData) => {
  let applicationsArray = [];
  
  if (Array.isArray(rawData)) {
    applicationsArray = rawData;
  } else if (Array.isArray(rawData?.data)) {
    applicationsArray = rawData.data;
  } else if (Array.isArray(rawData?.applications)) {
    applicationsArray = rawData.applications;
  } else if (Array.isArray(rawData?.results)) {
    applicationsArray = rawData.results;
  } else if (rawData?.data?.applications && Array.isArray(rawData.data.applications)) {
    applicationsArray = rawData.data.applications;
  }
  
  if (applicationsArray.length === 0) {
    return [];
  }
  
  const normalizedApplications = applicationsArray.map((app, index) => {
    const normalizedApp = {
      id: app.id || app._id || app.applicationId || `app-${index}`,
      productName: app.productName || app.name || app.title || app.product || `Product ${index + 1}`,
      sku: app.sku || app.productCode || app.code || `SKU${index.toString().padStart(6, '0')}`,
      asin: app.asin || app.productId || app.amazonId || `ASIN${index.toString().padStart(8, '0')}`,
      category: app.category || app.productCategory || app.type || 'Electronics',
      subCategory: app.subCategory || app.subcategory || app.productSubCategory || '',
      brand: app.brand || app.manufacturer || app.company || 'Unknown',
      status: (app.status || app.state || 'pending').toLowerCase(),
      submittedAt: app.submittedAt || app.createdAt || app.date || app.submissionDate || new Date().toISOString(),
      reviewedAt: app.reviewedAt || app.updatedAt || app.reviewDate || null,
      registration: app.registration || app.registrationType || app.categoryStatus || 'ungated',
      feedback: app.feedback || app.notes || app.comments || app.reviewComments || '',
      ...(app.urgency && { urgency: app.urgency }),
      ...(app.priority && { priority: app.priority }),
      ...(app.score && { score: app.score }),
      ...(app.assignedTo && { assignedTo: app.assignedTo }),
      ...(app.department && { department: app.department })
    };
    
    const validStatuses = Object.keys(STATUS_CONFIG).filter(key => key !== 'default');
    if (!validStatuses.includes(normalizedApp.status)) {
      normalizedApp.status = 'pending';
    }
    
    return normalizedApp;
  });
  
  return normalizedApplications;
};

const generateMockApplications = (count = 25) => {
  const statuses = Object.keys(STATUS_CONFIG).filter(key => key !== 'default');
  
  return Array.from({ length: count }, (_, index) => ({
    id: `mock-app-${index}`,
    productName: `Test Product ${index + 1}`,
    status: statuses[index % statuses.length],
    category: CATEGORIES[index % CATEGORIES.length],
    brand: BRANDS[index % BRANDS.length],
    asin: `ASIN${index.toString().padStart(8, '0')}`,
    sku: `SKU${index.toString().padStart(6, '0')}`,
    subCategory: `Sub-Category ${(index % 5) + 1}`,
    registration: index % 3 === 0 ? 'brand_registry' : (index % 3 === 1 ? 'ungated' : 'gated'),
    submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: index % 2 === 0 ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString() : null,
    feedback: index % 4 === 0 ? 'Additional documentation required' : '',
    isMock: true
  }));
};

// Main component
const Applications = () => {
  // State management
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    subCategory: '',
    asin: '',
    registration: '',
    appeal: '',
    catalogue: '',
    authentication: '',
    gtinException: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [viewMode, setViewMode] = useState('list');
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [tabs, setTabs] = useState(TABS_CONFIG);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Update tab counts when applications change
  useEffect(() => {
    if (applications.length === 0) return;

    const updatedTabs = TABS_CONFIG.map(tab => {
      if (tab.id === 'all') {
        return { ...tab, count: applications.length };
      } else {
        const count = applications.filter(app => app.status === tab.id).length;
        return { ...tab, count };
      }
    });
    
    setTabs(updatedTabs);
  }, [applications]);

  // API call function
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/applications`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData = await response.json();
      const normalizedData = normalizeApplicationsData(rawData);
      
      if (normalizedData.length === 0) {
        const mockData = generateMockApplications();
        setApplications(mockData);
      } else {
        setApplications(normalizedData);
      }
      
    } catch (error) {
      setError('Failed to load applications. Please try again later.');
      
      const mockData = generateMockApplications();
      setApplications(mockData);
      
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => {
        const searchableFields = [
          app.productName,
          app.category,
          app.brand,
          app.asin,
          app.sku,
          app.subCategory
        ].filter(Boolean).map(field => field.toLowerCase());
        
        return searchableFields.some(field => field.includes(term));
      });
    }

    // Apply tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(app => app.status === selectedTab);
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(app => {
          const appValue = app[key];
          if (!appValue) return false;
          return appValue.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      if (sortConfig.key.includes('At') || sortConfig.key.includes('Date')) {
        try {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } catch {
          aValue = '';
          bValue = '';
        }
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [applications, searchTerm, selectedTab, filters, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      subCategory: '',
      asin: '',
      registration: '',
      appeal: '',
      catalogue: '',
      authentication: '',
      gtinException: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleExport = () => {
    try {
      const exportData = filteredApplications.map(app => ({
        'Product Name': app.productName,
        'Status': getStatusConfig(app.status).text,
        'Category': app.category,
        'Brand': app.brand,
        'ASIN': app.asin,
        'SKU': app.sku,
        'Submitted Date': new Date(app.submittedAt).toLocaleDateString(),
        'Registration Type': app.registration
      }));
      
      const csvContent = [
        Object.keys(exportData[0] || {}).join(','),
        ...exportData.map(row => Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
    } catch (error) {
      const dataStr = JSON.stringify(filteredApplications, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `applications_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleAddProduct = () => {
    alert('Navigate to add product page');
  };

  const handleCheckEligibility = () => {
    alert('Open eligibility checker');
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6">
        {/* Header skeleton */}
        <div className="animate-pulse mb-4 sm:mb-6 lg:mb-8">
          <div className="h-8 sm:h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full sm:w-2/3"></div>
        </div>
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        
        {/* Search bar skeleton */}
        <div className="animate-pulse mb-6">
          <div className="h-12 sm:h-14 bg-gray-200 rounded-lg"></div>
        </div>
        
        {/* Table skeleton */}
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 sm:h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      {/* Mobile menu button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg w-full"
        >
          <Menu className="w-5 h-5" />
          <span className="font-medium">Menu</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Selling Applications
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Track and manage your product applications
            </p>
          </div>
          
          {/* Desktop action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {LANGUAGES.slice(0, 3).map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.code.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Eligibility Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4 md:p-5 mt-4 sm:mt-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1">
                Check Your Eligibility
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                Use our eligibility checker before applying
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCheckEligibility}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Check Eligibility
                </button>
                <button 
                  onClick={() => alert('Learn more about eligibility')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-blue-600 text-xs sm:text-sm hover:text-blue-700 flex items-center"
                >
                  Learn More
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>
              </div>
            </div>
            <HelpCircle className="w-5 h-5 text-blue-400 ml-2 sm:ml-4" />
          </div>
        </div>
      </div>

      {/* Statistics Cards - Mobile scrollable */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:gap-3 lg:overflow-visible lg:pb-0">
          {tabs.slice(1).map(tab => {
            const StatusIcon = tab.icon;
            const statusConfig = getStatusConfig(tab.id);
            return (
              <div
                key={tab.id}
                className={`flex-shrink-0 w-48 sm:w-56 lg:w-auto bg-white rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTab === tab.id ? 'border-orange-300 shadow-sm' : 'border-gray-200'
                }`}
                onClick={() => setSelectedTab(tab.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{tab.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 sm:px-2 sm:py-1 text-xs rounded-full ${statusConfig.color}`}>
                    {tab.count}
                  </span>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{tab.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs - Mobile scrollable */}
      <div className="border-b border-gray-200 mb-4 sm:mb-6">
        <div className="flex overflow-x-auto pb-1">
          <div className="flex space-x-1 sm:space-x-2">
            {tabs.map(tab => {
              const StatusIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    selectedTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    {tab.icon && <span className="mr-1 sm:mr-2"><StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" /></span>}
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-1 sm:ml-2 px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-full ${
                        selectedTab === tab.id ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Desktop Filter and Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Filters
              {Object.values(filters).some(f => f) && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full">
                  Active
                </span>
              )}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Export
            </button>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Filter and Actions */}
          <div className="lg:hidden flex items-center justify-between gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex-1 justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex-1 justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters - Desktop */}
        {showFilters && (
          <div className="hidden lg:block mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="">All Brands</option>
                  {BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ASIN
                </label>
                <input
                  type="text"
                  value={filters.asin}
                  onChange={(e) => handleFilterChange('asin', e.target.value)}
                  placeholder="Enter ASIN"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration
                </label>
                <select
                  value={filters.registration}
                  onChange={(e) => handleFilterChange('registration', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="">All</option>
                  <option value="brand_registry">Brand Registry</option>
                  <option value="ungated">Ungated</option>
                  <option value="gated">Gated</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.slice(0, 5).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Brands</option>
                  {BRANDS.slice(0, 5).map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration
                </label>
                <select
                  value={filters.registration}
                  onChange={(e) => handleFilterChange('registration', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  <option value="brand_registry">Brand Registry</option>
                  <option value="ungated">Ungated</option>
                  <option value="gated">Gated</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count and Page Size */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="text-xs sm:text-sm text-gray-600">
          Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, filteredApplications.length)}
          </span>{' '}
          of <span className="font-medium">{filteredApplications.length}</span> applications
        </div>
        <div className="text-sm text-gray-600">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Applications List/Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('productName')}
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Product Name
                      {sortConfig.key === 'productName' && (
                        sortConfig.direction === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedApplications.map((application) => {
                  const statusConfig = getStatusConfig(application.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center">
                          <StatusIcon className="w-5 h-5" />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900 text-sm">
                              {application.productName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ASIN: {application.asin || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${statusConfig.color}`}>
                          {statusConfig.text}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-gray-400 mr-1" />
                          {application.category || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        {application.brand || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => alert(`View details for ${application.productName}`)}
                            className="text-orange-600 hover:text-orange-900 text-sm"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden divide-y divide-gray-200">
            {paginatedApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;
              const isSelected = selectedApplication === application.id;
              
              return (
                <div key={application.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className="w-5 h-5" />
                        <h3 className="font-medium text-gray-900 text-sm">
                          {application.productName}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full border ${statusConfig.color}`}>
                          {statusConfig.text}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{application.category}</span>
                        </div>
                        <div>
                          <span className="font-medium">Brand:</span> {application.brand}
                        </div>
                        <div>
                          <span className="font-medium">ASIN:</span> {application.asin}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => alert(`View details for ${application.productName}`)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {application.status === 'declined' && (
                              <button 
                                onClick={() => alert(`Appeal for ${application.productName}`)}
                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Appeal
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedApplication(isSelected ? null : application.id)}
                      className="ml-2 p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedApplications.map((application) => {
            const statusConfig = getStatusConfig(application.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div key={application.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <StatusIcon className="w-5 h-5" />
                      <span className={`ml-2 px-3 py-1 text-xs rounded-full border ${statusConfig.color}`}>
                        {statusConfig.text}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                    {application.productName}
                  </h3>
                  
                  <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{application.category || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Brand: {application.brand || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">ASIN: {application.asin || 'N/A'}</span>
                    </div>
                    {application.registration && (
                      <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded inline-block">
                        {application.registration}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => alert(`View details for ${application.productName}`)}
                      className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 flex items-center"
                    >
                      View Details
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                    {application.status === 'action_required' && (
                      <button 
                        onClick={() => alert(`Take action for ${application.productName}`)}
                        className="px-3 sm:px-4 py-1.5 bg-orange-600 text-white text-xs sm:text-sm rounded-lg hover:bg-orange-700"
                      >
                        Take Action
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-300 mb-4">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || Object.values(filters).some(f => f) 
              ? 'No applications match your search'
              : 'No applications found'
            }
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto px-4 text-sm">
            {searchTerm || Object.values(filters).some(f => f) 
              ? 'Try adjusting your search or filters'
              : 'Get started by submitting your first product application'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {(searchTerm || Object.values(filters).some(f => f)) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
            >
              Add Product
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredApplications.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage === 1) {
                    pageNum = i + 1;
                  } else if (currentPage === totalPages) {
                    pageNum = totalPages - 2 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center border text-sm font-medium rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      {applications.length > 0 && (
        <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{applications.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {applications.filter(app => 
                  ['under_review', 'pending', 'action_required'].includes(app.status)
                ).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {applications.filter(app => app.status === 'declined').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Declined</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;