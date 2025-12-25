import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  Filter,
  Download,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Globe,
  Loader2,
  X,
  Calendar,
  Tag,
  Package,
  Hash,
  Target,
  FileText,
  Share2,
  Copy,
  Printer,
  Mail
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
    'large-desktop': <Globe size={size} />
  };
  
  return icons[deviceType] || <Monitor size={size} />;
};

// Mock API Service
const PpcApiService = {
  // Fetch campaigns with filters
  async fetchCampaigns(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            id: "CMP-1A2B3C",
            name: "Launch - Premium Earbuds",
            type: "Sponsored Products",
            budget: 1500,
            status: "Active",
            spend: 2450,
            sales: 12800,
            clicks: 1250,
            impressions: 25000,
            acos: 19.1,
            roas: 5.22,
            startDate: "2024-12-01",
            endDate: "2024-12-31",
            biddingStrategy: "dynamicDown",
            targetingType: "keywords",
            keywords: 15,
            products: 3
          },
          {
            id: "CMP-4D5E6F",
            name: "Holiday Kitchen Sale",
            type: "Sponsored Products",
            budget: 2500,
            status: "Active",
            spend: 1800,
            sales: 9500,
            clicks: 890,
            impressions: 18000,
            acos: 18.9,
            roas: 5.28,
            startDate: "2024-11-15",
            endDate: "2024-12-15",
            biddingStrategy: "dynamicUpDown",
            targetingType: "products",
            keywords: 0,
            products: 8
          },
          {
            id: "CMP-7G8H9I",
            name: "Back to School - Chargers",
            type: "Sponsored Products",
            budget: 800,
            status: "Paused",
            spend: 420,
            sales: 2800,
            clicks: 520,
            impressions: 12500,
            acos: 15.0,
            roas: 6.67,
            startDate: "2024-09-01",
            endDate: "2024-10-01",
            biddingStrategy: "fixed",
            targetingType: "keywords",
            keywords: 12,
            products: 5
          },
          {
            id: "CMP-0J1K2L",
            name: "Winter Fashion - Apparel",
            type: "Sponsored Products",
            budget: 2000,
            status: "Draft",
            spend: 0,
            sales: 0,
            clicks: 0,
            impressions: 0,
            acos: 0,
            roas: 0,
            startDate: "2024-12-15",
            endDate: "2025-01-15",
            biddingStrategy: "dynamicDown",
            targetingType: "products",
            keywords: 0,
            products: 12
          }
        ];

        // Apply filters
        let filtered = mockData;
        if (filters.status && filters.status !== 'all') {
          filtered = filtered.filter(c => c.status === filters.status);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchLower) ||
            c.id.toLowerCase().includes(searchLower) ||
            c.type.toLowerCase().includes(searchLower)
          );
        }

        resolve(filtered);
      }, 600);
    });
  },

  // Fetch suggested products
  async fetchProducts(search = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = [
          { asin: "B08KL12AB", title: "Ultra Sharp Knife Set - 8 Piece", price: 2999, category: "Kitchen", image: "https://m.media-amazon.com/images/I/71J8+zCLuUL._AC_UL320_.jpg", conversionRate: 3.2, cpc: 8.5, rating: 4.5, reviews: 1245 },
          { asin: "B07MN88PR", title: "Stainless Steel Cutter Pro", price: 1599, category: "Kitchen", image: "https://m.media-amazon.com/images/I/61X8rxqYaAL._AC_UL320_.jpg", conversionRate: 2.8, cpc: 6.2, rating: 4.3, reviews: 892 },
          { asin: "B09PLKJH21", title: "Smart Mixer Grinder 750W", price: 4299, category: "Appliances", image: "https://m.media-amazon.com/images/I/61kRB0kmQOL._AC_UL320_.jpg", conversionRate: 4.1, cpc: 12.5, rating: 4.7, reviews: 2145 },
          { asin: "B08XYZ1234", title: "Non-Stick Cookware Set 10pc", price: 5999, category: "Kitchen", image: "https://m.media-amazon.com/images/I/61rZyL1ZtCL._AC_UL320_.jpg", conversionRate: 2.5, cpc: 9.8, rating: 4.2, reviews: 1789 },
          { asin: "B07QZXFQ12", title: "Electric Kettle 1.5L Fast Boil", price: 1299, category: "Appliances", image: "https://m.media-amazon.com/images/I/61q2hYIQ+PL._AC_UL320_.jpg", conversionRate: 5.2, cpc: 4.5, rating: 4.6, reviews: 3245 },
          { asin: "B08ABC1234", title: "Wireless Bluetooth Earbuds Pro", price: 2499, category: "Electronics", image: "https://m.media-amazon.com/images/I/71R1T8hqXjL._AC_UL320_.jpg", conversionRate: 3.8, cpc: 7.2, rating: 4.4, reviews: 1890 },
          { asin: "B09DEF5678", title: "Portable Power Bank 20000mAh", price: 1499, category: "Electronics", image: "https://m.media-amazon.com/images/I/71qxQr-yK6L._AC_UL320_.jpg", conversionRate: 3.5, cpc: 5.8, rating: 4.3, reviews: 2450 },
          { asin: "B07GHI9012", title: "Yoga Mat Premium 6mm", price: 899, category: "Fitness", image: "https://m.media-amazon.com/images/I/71WtKQ9bhTL._AC_UL320_.jpg", conversionRate: 4.2, cpc: 3.8, rating: 4.5, reviews: 3120 }
        ];

        if (search) {
          const searchLower = search.toLowerCase();
          resolve(products.filter(p => 
            p.title.toLowerCase().includes(searchLower) ||
            p.asin.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
          ));
        } else {
          resolve(products);
        }
      }, 500);
    });
  },

  // Create campaign
  async createCampaign(campaignData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!campaignData.name?.trim()) {
          reject(new Error("Campaign name is required"));
          return;
        }
        if (!campaignData.dailyBudget || campaignData.dailyBudget < 100) {
          reject(new Error("Minimum daily budget is ₹100"));
          return;
        }
        
        const campaignId = `CMP-${Date.now().toString(36).toUpperCase()}`;
        resolve({
          success: true,
          campaignId,
          message: "Campaign created successfully",
          data: {
            id: campaignId,
            name: campaignData.name,
            type: "Sponsored Products",
            budget: campaignData.dailyBudget,
            status: "Active",
            spend: 0,
            sales: 0,
            clicks: 0,
            impressions: 0,
            acos: 0,
            roas: 0,
            startDate: campaignData.startDate,
            endDate: campaignData.endDate,
            biddingStrategy: campaignData.biddingStrategy,
            targetingType: campaignData.targetingType,
            keywords: campaignData.keywords?.length || 0,
            products: campaignData.products?.length || 0,
            createdAt: new Date().toISOString()
          }
        });
      }, 800);
    });
  },

  // Get campaign analytics
  async getCampaignAnalytics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalCampaigns: 12,
          activeCampaigns: 8,
          totalSpend: 15480,
          totalSales: 89250,
          avgAcos: 17.3,
          avgRoas: 5.76,
          topPerforming: {
            name: "Launch - Premium Earbuds",
            roas: 8.2,
            acos: 12.2
          },
          trends: [
            { date: "Dec 1", spend: 450, sales: 2800 },
            { date: "Dec 2", spend: 520, sales: 3200 },
            { date: "Dec 3", spend: 480, sales: 2900 },
            { date: "Dec 4", spend: 560, sales: 3500 },
            { date: "Dec 5", spend: 610, sales: 3800 }
          ]
        });
      }, 400);
    });
  }
};

// Helper functions
const uid = () => Math.random().toString(36).slice(2, 9);

const exportCsv = (rows = [], filename = "sponsored-campaigns.csv") => {
  const csv =
    rows.length === 0
      ? ""
      : [
          Object.keys(rows[0]).join(","),
          ...rows.map((r) =>
            Object.values(r)
              .map((v) => `"${String(v).replace(/"/g, '""')}"`)
              .join(",")
          ),
        ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Validation utility
const validateCampaign = (step, form) => {
  const errors = {};
  
  switch(step) {
    case 1:
      if (!form.name?.trim()) errors.name = "Campaign name is required";
      if (!form.dailyBudget || form.dailyBudget < 100) errors.dailyBudget = "Minimum daily budget is ₹100";
      if (!form.startDate) errors.startDate = "Start date is required";
      break;
      
    case 2:
      if (!form.adGroupName?.trim()) errors.adGroupName = "Ad group name is required";
      if (!form.defaultBid || form.defaultBid < 0.5) errors.defaultBid = "Minimum bid is ₹0.50";
      break;
      
    case 3:
      if (form.targetingType === "keywords" && (!form.keywords || form.keywords.length === 0)) {
        errors.keywords = "Please add at least one keyword";
      }
      if (form.targetingType === "products" && (!form.products || form.products.length === 0)) {
        errors.products = "Please select at least one product";
      }
      break;
  }
  
  return errors;
};

// Mobile Campaign Card Component
const MobileCampaignCard = ({ campaign, deviceType }) => {
  const isMobile = deviceType === 'mobile';
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-3 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-blue-700 text-sm">{campaign.id}</div>
          <div className="font-semibold text-gray-900 text-base">{campaign.name}</div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(campaign.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
          {isMobile ? campaign.status.charAt(0) : campaign.status}
        </span>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Spend</div>
          <div className="font-bold text-gray-900">₹{campaign.spend.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Sales</div>
          <div className="font-bold text-green-600">₹{campaign.sales.toLocaleString()}</div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <div className="text-xs text-gray-500">ROAS</div>
          <div className="font-bold text-green-600">{campaign.roas.toFixed(2)}x</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">ACOS</div>
          <div className="font-bold text-orange-600">{campaign.acos.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Clicks</div>
          <div className="font-bold text-blue-600">{campaign.clicks}</div>
        </div>
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
            <TrendingUp size={14} />
            <span>Analytics</span>
          </div>
        </button>
        <button className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  );
};

// Responsive Table Component
const CampaignsTable = ({ campaigns, deviceType }) => {
  const isTablet = deviceType === 'tablet';
  const isLaptop = deviceType === 'laptop';
  const isDesktop = deviceType === 'desktop';
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Paused': return 'bg-yellow-100 text-yellow-700';
      case 'Draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Determine columns to show based on device
  const getTableHeaders = () => {
    if (isTablet) {
      return [
        { key: 'name', label: 'Campaign', sortable: true },
        { key: 'budget', label: 'Budget', sortable: true },
        { key: 'spend', label: 'Spend', sortable: true },
        { key: 'status', label: 'Status', sortable: false },
        { key: 'actions', label: 'Actions', sortable: false }
      ];
    } else if (isLaptop) {
      return [
        { key: 'name', label: 'Campaign', sortable: true },
        { key: 'budget', label: 'Budget', sortable: true },
        { key: 'spend', label: 'Spend', sortable: true },
        { key: 'sales', label: 'Sales', sortable: true },
        { key: 'acos', label: 'ACOS', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
      ];
    } else if (isDesktop) {
      return [
        { key: 'name', label: 'Campaign', sortable: true },
        { key: 'budget', label: 'Budget', sortable: true },
        { key: 'spend', label: 'Spend', sortable: true },
        { key: 'sales', label: 'Sales', sortable: true },
        { key: 'acos', label: 'ACOS', sortable: true },
        { key: 'roas', label: 'ROAS', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
      ];
    } else {
      // Large Desktop
      return [
        { key: 'name', label: 'Campaign', sortable: true },
        { key: 'budget', label: 'Budget', sortable: true },
        { key: 'spend', label: 'Spend', sortable: true },
        { key: 'sales', label: 'Sales', sortable: true },
        { key: 'clicks', label: 'Clicks', sortable: true },
        { key: 'impressions', label: 'Impressions', sortable: true },
        { key: 'acos', label: 'ACOS', sortable: true },
        { key: 'roas', label: 'ROAS', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
      ];
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
            {campaigns.map((campaign) => (
              <tr 
                key={campaign.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Campaign Name */}
                <td className="p-3">
                  <div className="font-semibold text-blue-700 text-sm">{campaign.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{campaign.id}</div>
                </td>

                {/* Budget */}
                <td className="p-3">
                  <div className="font-bold text-gray-900">{formatCurrency(campaign.budget)}</div>
                </td>

                {/* Spend */}
                <td className="p-3">
                  <div className="font-medium text-gray-900">{formatCurrency(campaign.spend)}</div>
                </td>

                {/* Sales - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className="font-medium text-green-600">{formatCurrency(campaign.sales)}</div>
                  </td>
                )}

                {/* Clicks - Only on large desktop */}
                {deviceType === 'large-desktop' && (
                  <td className="p-3">
                    <div className="font-medium text-blue-600">{campaign.clicks.toLocaleString()}</div>
                  </td>
                )}

                {/* Impressions - Only on large desktop */}
                {deviceType === 'large-desktop' && (
                  <td className="p-3">
                    <div className="font-medium text-gray-900">{campaign.impressions.toLocaleString()}</div>
                  </td>
                )}

                {/* ACOS - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className={`font-medium ${campaign.acos < 20 ? 'text-green-600' : campaign.acos < 30 ? 'text-orange-600' : 'text-red-600'}`}>
                      {campaign.acos.toFixed(1)}%
                    </div>
                  </td>
                )}

                {/* ROAS - Only on desktop+ */}
                {(isDesktop || deviceType === 'large-desktop') && (
                  <td className="p-3">
                    <div className="font-medium text-green-600">{campaign.roas.toFixed(2)}x</div>
                  </td>
                )}

                {/* Status */}
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                    {isTablet ? campaign.status.charAt(0) : campaign.status}
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
                      title="Analytics"
                    >
                      <TrendingUp size={14} />
                    </button>
                    {(isDesktop || deviceType === 'large-desktop') && (
                      <button
                        className="p-1 text-purple-600 hover:text-purple-800"
                        title="Edit Campaign"
                      >
                        <FileText size={14} />
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

// Main Component
export default function SponsoredProductsManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all"
  });

  const responsive = useResponsive();
  const { isMobile, isTablet, isLaptop, isDesktop, isLargeDesktop, deviceType } = responsive;

  const [form, setForm] = useState({
    name: "",
    dailyBudget: "",
    startDate: "",
    endDate: "",
    biddingStrategy: "dynamicDown",
    adGroupName: "",
    defaultBid: 5,
    targetingType: "keywords",
    keywords: [{ id: uid(), keyword: "best earbuds", bid: 6, matchType: "broad" }],
    products: [],
    campaignType: "sponsoredProducts"
  });

  // Load data
  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoadingCampaigns(true);
    try {
      const [campaignsData, analyticsData] = await Promise.all([
        PpcApiService.fetchCampaigns(filters),
        PpcApiService.getCampaignAnalytics()
      ]);
      setCampaigns(campaignsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: "error", text: "Failed to load campaigns" });
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Product search
  useEffect(() => {
    const searchProducts = async () => {
      if (productSearch.trim().length > 0 || productSearch === "") {
        const results = await PpcApiService.fetchProducts(productSearch);
        setProductResults(results);
      }
    };
    
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [productSearch]);

  // Form helpers
  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: undefined });
    }
  };

  const updateKeyword = (id, key, val) =>
    setForm((f) => ({
      ...f,
      keywords: f.keywords.map((k) => (k.id === id ? { ...k, [key]: val } : k)),
    }));

  const removeKeyword = (id) =>
    setForm((f) => ({ ...f, keywords: f.keywords.filter((k) => k.id !== id) }));

  const addKeyword = () =>
    setForm((f) => ({ 
      ...f, 
      keywords: [...f.keywords, { 
        id: uid(), 
        keyword: "new keyword", 
        bid: form.defaultBid,
        matchType: "broad" 
      }] 
    }));

  const toggleProduct = (product) =>
    setForm((f) => {
      const exists = f.products.find((p) => p.asin === product.asin);
      return {
        ...f,
        products: exists 
          ? f.products.filter((p) => p.asin !== product.asin)
          : [...f.products, product],
      };
    });

  // Wizard navigation
  const nextStep = () => {
    const errors = validateCampaign(step, form);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setMessage({ type: "error", text: "Please fix the errors before proceeding" });
      return;
    }
    
    setValidationErrors({});
    setMessage(null);
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setValidationErrors({});
    setMessage(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Submit campaign
  const handleCreateCampaign = async () => {
    const errors = validateCampaign(4, form);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setMessage({ type: "error", text: "Please fix all errors before submitting" });
      return;
    }

    setSaving(true);
    setMessage(null);
    
    try {
      const result = await PpcApiService.createCampaign(form);
      if (result.success) {
        setMessage({ type: "success", text: `Campaign ${result.campaignId} created successfully!` });
        setWizardOpen(false);
        setStep(1);
        setCampaigns([result.data, ...campaigns]);
        
        // Reset form
        setForm({
          name: "",
          dailyBudget: "",
          startDate: "",
          endDate: "",
          biddingStrategy: "dynamicDown",
          adGroupName: "",
          defaultBid: 5,
          targetingType: "keywords",
          keywords: [{ id: uid(), keyword: "best earbuds", bid: 6, matchType: "broad" }],
          products: [],
          campaignType: "sponsoredProducts"
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to create campaign" });
    } finally {
      setSaving(false);
    }
  };

  // Responsive padding
  const getPadding = () => {
    if (isMobile) return 'p-4';
    if (isTablet) return 'p-5';
    if (isLaptop) return 'p-6';
    if (isDesktop) return 'p-7';
    return 'p-8';
  };

  // Responsive max width
  const getMaxWidth = () => {
    if (isLargeDesktop) return 'max-w-screen-2xl';
    if (isDesktop) return 'max-w-7xl';
    if (isLaptop) return 'max-w-6xl';
    if (isTablet) return 'max-w-4xl';
    return 'max-w-full';
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${getPadding()}`}>
      <div className={`mx-auto ${getMaxWidth()}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className={`font-bold text-gray-900 ${
              isMobile ? 'text-2xl' : 
              isTablet ? 'text-3xl' : 
              'text-4xl'
            }`}>
              Sponsored Products Manager
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'} mt-2`}>
              Create and manage Amazon Sponsored Products campaigns
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isMobile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium">
                <DeviceIcon deviceType={deviceType} size={14} />
                <span className="text-gray-700">{deviceType.toUpperCase()}</span>
              </div>
            )}
            
            <button
              onClick={() => fetchData()}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${isMobile ? 'p-1.5' : ''}`}
              title="Refresh"
              disabled={loadingCampaigns}
            >
              <Loader2 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 ${loadingCampaigns ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => exportCsv(campaigns, "sponsored-campaigns.csv")}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${isMobile ? 'p-1.5' : ''}`}
              title="Export"
            >
              <Download className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>

            <button
              onClick={() => setWizardOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
            >
              <Plus size={16} />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {/* Analytics Stats */}
        {!isMobile && analytics && (
          <div className={`grid ${isTablet ? 'grid-cols-2' : isLaptop ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-4'} gap-3 mb-8`}>
            {[
              { 
                label: 'Active Campaigns', 
                value: analytics.activeCampaigns, 
                color: 'bg-green-50 text-green-700 border-green-200',
                icon: CheckCircle,
                trend: '▲ 3'
              },
              { 
                label: 'Total Spend', 
                value: `₹${analytics.totalSpend.toLocaleString()}`, 
                color: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: DollarSign,
                trend: '▲ 12%'
              },
              { 
                label: 'Total Sales', 
                value: `₹${analytics.totalSales.toLocaleString()}`, 
                color: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: TrendingUp,
                trend: '▲ 15%'
              },
              { 
                label: 'Avg. ROAS', 
                value: `${analytics.avgRoas}x`, 
                color: 'bg-teal-50 text-teal-700 border-teal-200',
                icon: BarChart3,
                trend: '▲ 8%'
              },
            ].map((stat, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${stat.color}`}>
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

        {/* Quick Stats - Mobile */}
        {isMobile && analytics && (
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Active', value: analytics.activeCampaigns, color: 'bg-green-100 text-green-700' },
                { label: 'Spend', value: `₹${(analytics.totalSpend/1000).toFixed(0)}K`, color: 'bg-blue-100 text-blue-700' },
                { label: 'Sales', value: `₹${(analytics.totalSales/1000).toFixed(0)}K`, color: 'bg-purple-100 text-purple-700' },
                { label: 'ROAS', value: `${analytics.avgRoas}x`, color: 'bg-teal-100 text-teal-700' },
              ].map((stat, idx) => (
                <div key={idx} className={`p-2 rounded-lg text-center ${stat.color}`}>
                  <div className="font-bold text-lg">{stat.value}</div>
                  <div className="text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-3' : 'grid-cols-4'} gap-3 mb-6`}>
          {/* Search */}
          <div className={isMobile ? '' : isTablet ? 'col-span-2' : ''}>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: "" })}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <select
            className="border border-gray-300 rounded-lg p-2 bg-white text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Draft">Draft</option>
          </select>

          {/* Date Filter - Hide on mobile/tablet */}
          {!isMobile && !isTablet && (
            <select className="border border-gray-300 rounded-lg p-2 bg-white text-sm">
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`p-3 rounded-md mb-4 ${
              message.type === "error" 
                ? "bg-red-50 text-red-700 border border-red-100" 
                : "bg-green-50 text-green-700 border border-green-100"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Campaigns Display */}
        {loadingCampaigns ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-gray-600 mb-4">Create your first Sponsored Products campaign to get started.</p>
            <button
              onClick={() => setWizardOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} className="inline mr-2" />
              Create Campaign
            </button>
          </div>
        ) : isMobile ? (
          // Mobile: Card View
          <div className="mb-6">
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <MobileCampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  deviceType={deviceType}
                />
              ))}
            </div>
          </div>
        ) : (
          // Tablet & Desktop: Table View
          <CampaignsTable campaigns={campaigns} deviceType={deviceType} />
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {campaigns.length} campaigns
            {!isMobile && analytics && (
              <span className="ml-2">• Total spend: ₹{analytics.totalSpend.toLocaleString()}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-1 text-sm font-medium"
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
              className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-1 text-sm font-medium"
            >
              {isMobile ? 'Next' : 'Next'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Wizard Modal */}
        {wizardOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create Sponsored Products Campaign</h2>
                  <p className="text-sm text-gray-600">Step {step} of 4</p>
                </div>
                <button
                  onClick={() => {
                    setWizardOpen(false);
                    setStep(1);
                    setValidationErrors({});
                    setMessage(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step Content */}
              <div className="p-6 space-y-6">
                {/* STEP 1: Campaign Settings */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <FileText size={24} className="text-blue-600" />
                      <h3 className="text-lg font-semibold">Campaign Settings</h3>
                    </div>

                    <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
                      {/* Campaign Name */}
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Campaign Name *</label>
                        <input
                          type="text"
                          className={`w-full border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg`}
                          placeholder="e.g., Holiday Sale - Kitchen"
                          value={form.name}
                          onChange={(e) => updateForm("name", e.target.value)}
                        />
                        {validationErrors.name && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {validationErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Daily Budget */}
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Daily Budget (₹) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">₹</span>
                          <input
                            type="number"
                            className={`w-full border ${validationErrors.dailyBudget ? 'border-red-500' : 'border-gray-300'} pl-8 p-3 rounded-lg`}
                            placeholder="500"
                            min="100"
                            value={form.dailyBudget}
                            onChange={(e) => updateForm("dailyBudget", e.target.value)}
                          />
                        </div>
                        {validationErrors.dailyBudget && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {validationErrors.dailyBudget}
                          </p>
                        )}
                      </div>

                      {/* Campaign Type */}
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Campaign Type</label>
                        <select
                          className="w-full border border-gray-300 p-3 rounded-lg bg-white"
                          value={form.campaignType}
                          onChange={(e) => updateForm("campaignType", e.target.value)}
                        >
                          <option value="sponsoredProducts">Sponsored Products</option>
                          <option value="sponsoredBrands">Sponsored Brands</option>
                          <option value="sponsoredDisplay">Sponsored Display</option>
                        </select>
                      </div>

                      {/* Start Date */}
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Start Date *</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                          <input
                            type="date"
                            className={`w-full border ${validationErrors.startDate ? 'border-red-500' : 'border-gray-300'} pl-10 p-3 rounded-lg`}
                            value={form.startDate}
                            onChange={(e) => updateForm("startDate", e.target.value)}
                          />
                        </div>
                        {validationErrors.startDate && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {validationErrors.startDate}
                          </p>
                        )}
                      </div>

                      {/* End Date */}
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">End Date (Optional)</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                          <input
                            type="date"
                            className="w-full border border-gray-300 pl-10 p-3 rounded-lg"
                            value={form.endDate}
                            onChange={(e) => updateForm("endDate", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Bidding Strategy */}
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Bidding Strategy</label>
                        <select
                          className="w-full border border-gray-300 p-3 rounded-lg bg-white"
                          value={form.biddingStrategy}
                          onChange={(e) => updateForm("biddingStrategy", e.target.value)}
                        >
                          <option value="dynamicDown">Dynamic Bids - Down Only</option>
                          <option value="dynamicUpDown">Dynamic Bids - Up & Down</option>
                          <option value="fixed">Fixed Bids</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Ad Group */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Target size={24} className="text-blue-600" />
                      <h3 className="text-lg font-semibold">Ad Group Settings</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Ad Group Name *</label>
                        <input
                          type="text"
                          className={`w-full border ${validationErrors.adGroupName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg`}
                          placeholder="e.g., Kitchen Products - Broad Match"
                          value={form.adGroupName}
                          onChange={(e) => updateForm("adGroupName", e.target.value)}
                        />
                        {validationErrors.adGroupName && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {validationErrors.adGroupName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Default Bid (₹) *</label>
                        <input
                          type="number"
                          className={`w-full border ${validationErrors.defaultBid ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg`}
                          placeholder="5"
                          min="0.5"
                          step="0.1"
                          value={form.defaultBid}
                          onChange={(e) => updateForm("defaultBid", e.target.value)}
                        />
                        {validationErrors.defaultBid && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {validationErrors.defaultBid}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Targeting */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Hash size={24} className="text-blue-600" />
                      <h3 className="text-lg font-semibold">Targeting Options</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Targeting Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => updateForm("targetingType", "keywords")}
                            className={`p-4 border rounded-lg text-center ${
                              form.targetingType === "keywords"
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <Hash className="mx-auto mb-2" size={24} />
                            <div className="font-medium">Keyword Targeting</div>
                            <div className="text-xs text-gray-600 mt-1">Target specific search terms</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateForm("targetingType", "products")}
                            className={`p-4 border rounded-lg text-center ${
                              form.targetingType === "products"
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <Package className="mx-auto mb-2" size={24} />
                            <div className="font-medium">Product Targeting</div>
                            <div className="text-xs text-gray-600 mt-1">Target specific products</div>
                          </button>
                        </div>
                      </div>

                      {form.targetingType === "keywords" ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Keywords</h4>
                            <button
                              onClick={addKeyword}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
                            >
                              <Plus size={14} /> Add Keyword
                            </button>
                          </div>

                          <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b">
                              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                                <div className="col-span-5">Keyword</div>
                                <div className="col-span-3">Match Type</div>
                                <div className="col-span-2">Bid (₹)</div>
                                <div className="col-span-2">Actions</div>
                              </div>
                            </div>
                            
                            <div className="max-h-64 overflow-y-auto">
                              {form.keywords.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                  No keywords added yet
                                </div>
                              ) : (
                                form.keywords.map((kw) => (
                                  <div key={kw.id} className="px-4 py-3 border-b hover:bg-gray-50 grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-5">
                                      <input
                                        className="w-full border border-gray-300 p-1.5 rounded"
                                        value={kw.keyword}
                                        onChange={(e) => updateKeyword(kw.id, "keyword", e.target.value)}
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <select
                                        className="w-full border border-gray-300 p-1.5 rounded"
                                        value={kw.matchType}
                                        onChange={(e) => updateKeyword(kw.id, "matchType", e.target.value)}
                                      >
                                        <option value="broad">Broad</option>
                                        <option value="phrase">Phrase</option>
                                        <option value="exact">Exact</option>
                                      </select>
                                    </div>
                                    <div className="col-span-2">
                                      <input
                                        type="number"
                                        className="w-full border border-gray-300 p-1.5 rounded"
                                        value={kw.bid}
                                        onChange={(e) => updateKeyword(kw.id, "bid", e.target.value)}
                                        min="0.5"
                                        step="0.1"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <button
                                        onClick={() => removeKeyword(kw.id)}
                                        className="p-1.5 text-red-600 hover:text-red-800"
                                        title="Remove"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                          {validationErrors.keywords && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle size={14} /> {validationErrors.keywords}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex gap-2 items-center">
                            <div className="relative flex-1">
                              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                              <input
                                placeholder="Search products by name, ASIN, or category"
                                className="pl-10 w-full border p-2.5 rounded-lg"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'} gap-3 max-h-64 overflow-y-auto`}>
                            {productResults.map((product) => {
                              const selected = form.products.some((p) => p.asin === product.asin);
                              return (
                                <div
                                  key={product.asin}
                                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                    selected
                                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                  }`}
                                  onClick={() => toggleProduct(product)}
                                >
                                  <div className="flex items-start gap-3">
                                    <img
                                      src={product.image}
                                      alt={product.title}
                                      className="w-12 h-12 rounded-lg border object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 text-sm line-clamp-2">
                                        {product.title}
                                      </div>
                                      <div className="text-xs text-gray-500 mb-1">ASIN: {product.asin}</div>
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold">₹{product.price}</span>
                                        <div className="text-xs">
                                          <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded">
                                            {product.conversionRate}% CR
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {validationErrors.products && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle size={14} /> {validationErrors.products}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: Review & Launch */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={24} className="text-green-600" />
                      <h3 className="text-lg font-semibold">Review & Launch</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Campaign Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Campaign Details</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Campaign Name:</span>
                            <span className="font-medium">{form.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Daily Budget:</span>
                            <span className="font-medium">₹{form.dailyBudget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="font-medium">{form.startDate || "Not set"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bidding Strategy:</span>
                            <span className="font-medium">
                              {form.biddingStrategy === "dynamicDown" && "Dynamic - Down Only"}
                              {form.biddingStrategy === "dynamicUpDown" && "Dynamic - Up & Down"}
                              {form.biddingStrategy === "fixed" && "Fixed Bids"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Targeting Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Targeting Details</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ad Group:</span>
                            <span className="font-medium">{form.adGroupName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Targeting Type:</span>
                            <span className="font-medium capitalize">{form.targetingType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {form.targetingType === "keywords" ? "Keywords:" : "Products:"}
                            </span>
                            <span className="font-medium">
                              {form.targetingType === "keywords" 
                                ? form.keywords.length 
                                : form.products.length} selected
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Default Bid:</span>
                            <span className="font-medium">₹{form.defaultBid}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Estimate */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Estimated Performance</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-gray-600">Daily Cost</div>
                          <div className="text-lg font-bold">₹{form.dailyBudget}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Monthly Cost</div>
                          <div className="text-lg font-bold">₹{(form.dailyBudget * 30).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Est. Clicks/Day</div>
                          <div className="text-lg font-bold">{Math.round(form.dailyBudget / 8)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Est. ROAS</div>
                          <div className="text-lg font-bold text-green-600">4.5x - 6.5x</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Navigation */}
              <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
                <div>
                  {step > 1 && (
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <ChevronLeft size={16} />
                      Back
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {step < 4 && (
                    <button
                      onClick={nextStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight size={16} />
                    </button>
                  )}
                  
                  {step === 4 && (
                    <button
                      onClick={handleCreateCampaign}
                      disabled={saving}
                      className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 ${
                        saving ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Launching...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Launch Campaign
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Paused</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                <span>Draft</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DeviceIcon deviceType={deviceType} size={12} />
              <span>{deviceType} • {responsive.windowSize.width}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}