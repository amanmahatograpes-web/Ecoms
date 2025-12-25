import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Search,
  Plus,
  Tag,
  SlidersHorizontal,
  Hash,
  Package,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  BarChart3,
  Target,
  Calendar,
  FileText,
  Globe,
  TrendingUp,
  Filter,
  Download,
  Share2,
  Copy
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

// API Service for PPC Campaign
const PpcApiService = {
  // Fetch available products
  async fetchProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { asin: "B08KL12AB", title: "Ultra Sharp Knife Set - 8 Piece", price: 2999, category: "Kitchen", image: "https://m.media-amazon.com/images/I/71J8+zCLuUL._AC_UL320_.jpg", conversionRate: 3.2, cpc: 8.5 },
          { asin: "B07MN88PR", title: "Stainless Steel Cutter Pro", price: 1599, category: "Kitchen", image: "https://m.media-amazon.com/images/I/61X8rxqYaAL._AC_UL320_.jpg", conversionRate: 2.8, cpc: 6.2 },
          { asin: "B09PLKJH21", title: "Smart Mixer Grinder 750W", price: 4299, category: "Appliances", image: "https://m.media-amazon.com/images/I/61kRB0kmQOL._AC_UL320_.jpg", conversionRate: 4.1, cpc: 12.5 },
          { asin: "B08XYZ1234", title: "Non-Stick Cookware Set", price: 5999, category: "Kitchen", image: "https://m.media-amazon.com/images/I/61rZyL1ZtCL._AC_UL320_.jpg", conversionRate: 2.5, cpc: 9.8 },
          { asin: "B07QZXFQ12", title: "Electric Kettle 1.5L", price: 1299, category: "Appliances", image: "https://m.media-amazon.com/images/I/61q2hYIQ+PL._AC_UL320_.jpg", conversionRate: 5.2, cpc: 4.5 }
        ]);
      }, 600);
    });
  },

  // Fetch suggested keywords
  async fetchSuggestedKeywords(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const keywords = {
          Kitchen: [
            { keyword: "kitchen knife set", suggestedBid: 8, competition: "High", volume: 12500 },
            { keyword: "premium cookware", suggestedBid: 12, competition: "Medium", volume: 8500 },
            { keyword: "non-stick pans", suggestedBid: 6, competition: "High", volume: 21000 },
            { keyword: "kitchen accessories", suggestedBid: 5, competition: "Medium", volume: 18000 },
            { keyword: "chef knives", suggestedBid: 15, competition: "Low", volume: 3200 }
          ],
          Appliances: [
            { keyword: "mixer grinder", suggestedBid: 9, competition: "High", volume: 15800 },
            { keyword: "electric kettle", suggestedBid: 4, competition: "Medium", volume: 9200 },
            { keyword: "kitchen appliances", suggestedBid: 7, competition: "High", volume: 24500 },
            { keyword: "blender machine", suggestedBid: 8, competition: "Medium", volume: 11200 },
            { keyword: "food processor", suggestedBid: 11, competition: "Low", volume: 4800 }
          ]
        };
        resolve(keywords[category] || keywords.Kitchen);
      }, 400);
    });
  },

  // Fetch campaign performance data
  async fetchCampaignPerformance() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalSpent: 24500,
          totalClicks: 3250,
          totalConversions: 156,
          avgCpc: 7.54,
          conversionRate: 4.8,
          acos: 32.5,
          roas: 3.08
        });
      }, 500);
    });
  },

  // Save campaign
  async saveCampaign(campaignData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!campaignData.campaignName) {
          reject(new Error("Campaign name is required"));
          return;
        }
        
        const campaignId = `PPC-${Date.now()}`;
        resolve({
          success: true,
          campaignId,
          message: "Campaign created successfully",
          data: { ...campaignData, id: campaignId, status: "Draft", createdAt: new Date().toISOString() }
        });
      }, 800);
    });
  },

  // Launch campaign
  async launchCampaign(campaignId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Campaign launched successfully",
          campaignId,
          status: "Active",
          estimatedReviewTime: "1-2 hours"
        });
      }, 1200);
    });
  }
};

// Validation utility
const validateStep = (step, form) => {
  const errors = {};
  
  switch(step) {
    case 1:
      if (!form.campaignName?.trim()) errors.campaignName = "Campaign name is required";
      if (!form.dailyBudget || form.dailyBudget < 100) errors.dailyBudget = "Minimum daily budget is ₹100";
      if (!form.startDate) errors.startDate = "Start date is required";
      if (!form.biddingStrategy) errors.biddingStrategy = "Please select a bidding strategy";
      break;
      
    case 2:
      if (!form.adGroupName?.trim()) errors.adGroupName = "Ad group name is required";
      break;
      
    case 3:
      if (form.targetingType === "keywords" && (!form.keywords || form.keywords.length === 0)) {
        errors.keywords = "Please add at least one keyword";
      }
      if (form.targetingType === "products" && (!form.selectedProducts || form.selectedProducts.length === 0)) {
        errors.products = "Please select at least one product";
      }
      break;
      
    case 4:
      if (!form.selectedProducts || form.selectedProducts.length === 0) {
        errors.adProducts = "Please select at least one product for ads";
      }
      break;
  }
  
  return errors;
};

// Mobile Step Indicator
const MobileStepIndicator = ({ step, setStep, deviceType }) => {
  const steps = [
    { number: 1, title: "Campaign", icon: FileText },
    { number: 2, title: "Ad Group", icon: Target },
    { number: 3, title: "Targeting", icon: Hash },
    { number: 4, title: "Ads", icon: Tag },
    { number: 5, title: "Review", icon: CheckCircle }
  ];

  return (
    <div className="flex justify-between mb-6 bg-white p-2 rounded-lg border">
      {steps.map(({ number, title, icon: Icon }) => (
        <button
          key={number}
          onClick={() => setStep(number)}
          className={`flex flex-col items-center px-2 py-2 rounded-lg transition-colors ${
            step === number
              ? "bg-blue-50 text-blue-600"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
            step === number
              ? "bg-blue-600 text-white"
              : step > number
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}>
            {step > number ? <CheckCircle size={16} /> : <Icon size={16} />}
          </div>
          <span className="text-xs font-medium">{deviceType === 'mobile' ? number : title}</span>
        </button>
      ))}
    </div>
  );
};

// Desktop Step Indicator
const DesktopStepIndicator = ({ step, setStep }) => {
  const steps = [
    { number: 1, title: "Campaign Settings", icon: FileText },
    { number: 2, title: "Ad Group", icon: Target },
    { number: 3, title: "Targeting", icon: Hash },
    { number: 4, title: "Ads", icon: Tag },
    { number: 5, title: "Review", icon: CheckCircle }
  ];

  return (
    <div className="flex gap-2 mb-8">
      {steps.map(({ number, title, icon: Icon }) => (
        <button
          key={number}
          onClick={() => setStep(number)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
            step === number
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : step > number
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === number
              ? "bg-blue-600 text-white"
              : step > number
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-500"
          }`}>
            {step > number ? <CheckCircle size={18} /> : <Icon size={18} />}
          </div>
          <div className="text-left">
            <div className="text-xs text-gray-500">Step {number}</div>
            <div className="font-medium">{title}</div>
          </div>
          {number < 5 && (
            <ChevronRight size={16} className="ml-4 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
};

// Keyword Input Component
const KeywordInput = ({ keywords, setKeywords, deviceType }) => {
  const [newKeyword, setNewKeyword] = useState("");
  const [newBid, setNewBid] = useState("");

  const handleAdd = () => {
    if (newKeyword.trim() && newBid) {
      setKeywords([...keywords, { keyword: newKeyword.trim(), bid: parseFloat(newBid) }]);
      setNewKeyword("");
      setNewBid("");
    }
  };

  const handleRemove = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleBidChange = (index, value) => {
    const updated = [...keywords];
    updated[index].bid = parseFloat(value) || 0;
    setKeywords(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Hash size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-900">Keyword Targeting</h3>
      </div>

      {/* Add Keyword Form */}
      <div className={`${deviceType === 'mobile' ? 'grid grid-cols-1 gap-3' : 'flex gap-3'}`}>
        <input
          type="text"
          placeholder="Enter keyword"
          className="flex-1 border border-gray-300 p-2 rounded-lg"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Bid (₹)"
          className="w-28 border border-gray-300 p-2 rounded-lg"
          value={newBid}
          onChange={(e) => setNewBid(e.target.value)}
          min="1"
          step="0.1"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>

      {/* Keywords List */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div className="col-span-7 md:col-span-8">Keyword</div>
            <div className="col-span-3 md:col-span-2">Bid (₹)</div>
            <div className="col-span-2 md:col-span-2">Actions</div>
          </div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {keywords.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No keywords added yet
            </div>
          ) : (
            keywords.map((kw, index) => (
              <div key={index} className="px-4 py-3 border-b hover:bg-gray-50 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-7 md:col-span-8 font-medium text-gray-900 truncate">
                  {kw.keyword}
                </div>
                <div className="col-span-3 md:col-span-2">
                  <input
                    type="number"
                    className="w-full border border-gray-300 p-1 rounded text-center"
                    value={kw.bid}
                    onChange={(e) => handleBidChange(index, e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="col-span-2 md:col-span-2">
                  <button
                    onClick={() => handleRemove(index)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="text-sm text-gray-600">
          Total keywords: {keywords.length} • Total daily cost estimate: ₹{keywords.reduce((sum, kw) => sum + kw.bid * 10, 0).toFixed(2)}
        </div>
      )}
    </div>
  );
};

// Product Selection Component
const ProductSelection = ({ products, selectedProducts, setSelectedProducts, deviceType }) => {
  const toggleProduct = (asin) => {
    if (selectedProducts.includes(asin)) {
      setSelectedProducts(selectedProducts.filter(id => id !== asin));
    } else {
      setSelectedProducts([...selectedProducts, asin]);
    }
  };

  const toggleAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.asin));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900">Product Selection</h3>
        </div>
        <button
          onClick={toggleAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {selectedProducts.length === products.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Product Grid/List */}
      <div className={`${
        deviceType === 'mobile' ? 'grid grid-cols-1 gap-3' :
        deviceType === 'tablet' ? 'grid grid-cols-2 gap-4' :
        'grid grid-cols-3 gap-4'
      }`}>
        {products.map((product) => (
          <div
            key={product.asin}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedProducts.includes(product.asin)
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onClick={() => toggleProduct(product.asin)}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 rounded-lg border object-cover"
                />
                <div className={`absolute top-1 right-1 w-4 h-4 rounded-full border-2 ${
                  selectedProducts.includes(product.asin)
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-gray-300'
                }`}>
                  {selectedProducts.includes(product.asin) && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.title}
                </div>
                <div className="text-xs text-gray-500 mb-2">ASIN: {product.asin}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">₹{product.price}</span>
                  <div className="text-xs text-gray-600">
                    <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded">
                      {product.conversionRate}% CR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProducts.length > 0 && (
        <div className="text-sm text-gray-600">
          Selected: {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default function CreatePpcCampaign() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [campaignCreated, setCampaignCreated] = useState(false);
  const [products, setProducts] = useState([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);

  const responsive = useResponsive();
  const { isMobile, isTablet, isLaptop, isDesktop, isLargeDesktop, deviceType } = responsive;

  const [form, setForm] = useState({
    campaignName: "",
    dailyBudget: "",
    startDate: "",
    endDate: "",
    biddingStrategy: "dynamicDown",
    adGroupName: "",
    targetingType: "keywords",
    keywords: [
      { keyword: "best kitchen accessories", bid: 5 },
      { keyword: "premium knife set", bid: 12 },
    ],
    selectedProducts: [],
    adProducts: [],
    campaignType: "sponsoredProducts",
    matchType: "broad",
    negativeKeywords: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [productsData, performanceData] = await Promise.all([
        PpcApiService.fetchProducts(),
        PpcApiService.fetchCampaignPerformance()
      ]);
      setProducts(productsData);
      setPerformanceData(performanceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKeywords = async (category) => {
    try {
      const keywords = await PpcApiService.fetchSuggestedKeywords(category);
      setSuggestedKeywords(keywords);
    } catch (error) {
      console.error("Error fetching keywords:", error);
    }
  };

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: undefined });
    }
  };

  const nextStep = () => {
    const errors = validateStep(step, form);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setValidationErrors({});
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const errors = validateStep(5, form);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const result = await PpcApiService.saveCampaign(form);
      if (result.success) {
        setCampaignCreated(true);
        // Auto-launch after successful creation
        const launchResult = await PpcApiService.launchCampaign(result.campaignId);
        alert(`Campaign ${result.campaignId} launched successfully!`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
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
    if (isDesktop) return 'max-w-6xl';
    if (isLaptop) return 'max-w-5xl';
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
              Create PPC Campaign
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'} mt-2`}>
              Step {step} of 5 • Create and launch your Amazon advertising campaign
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isMobile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium">
                <DeviceIcon deviceType={deviceType} size={14} />
                <span className="text-gray-700">{deviceType.toUpperCase()}</span>
              </div>
            )}
            
            {performanceData && (
              <div className="hidden lg:flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Avg. CPC:</span> ₹{performanceData.avgCpc}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">ROAS:</span> {performanceData.roas}x
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Stats - Desktop */}
        {!isMobile && performanceData && (
          <div className={`grid ${isTablet ? 'grid-cols-2' : isLaptop ? 'grid-cols-4' : 'grid-cols-6'} gap-3 mb-8`}>
            {[
              { label: 'Total Spent', value: `₹${performanceData.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'bg-blue-50 text-blue-700' },
              { label: 'Total Clicks', value: performanceData.totalClicks.toLocaleString(), icon: TrendingUp, color: 'bg-green-50 text-green-700' },
              { label: 'Conversions', value: performanceData.totalConversions, icon: CheckCircle, color: 'bg-purple-50 text-purple-700' },
              { label: 'Avg. CPC', value: `₹${performanceData.avgCpc}`, icon: BarChart3, color: 'bg-yellow-50 text-yellow-700' },
              { label: 'Conv. Rate', value: `${performanceData.conversionRate}%`, icon: Target, color: 'bg-indigo-50 text-indigo-700' },
              { label: 'ROAS', value: `${performanceData.roas}x`, icon: TrendingUp, color: 'bg-teal-50 text-teal-700' },
            ].map((stat, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${stat.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {stat.label}
                    </div>
                    <div className="text-xl font-bold mt-1">{stat.value}</div>
                  </div>
                  <stat.icon size={20} className="opacity-50" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step Indicator */}
        {isMobile || isTablet ? (
          <MobileStepIndicator step={step} setStep={setStep} deviceType={deviceType} />
        ) : (
          <DesktopStepIndicator step={step} setStep={setStep} />
        )}

        {/* Main Form Area */}
        <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6">
          {loading && step === 1 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading campaign data...</p>
            </div>
          ) : campaignCreated ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Created!</h2>
              <p className="text-gray-600 mb-6">Your PPC campaign has been launched successfully.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Another Campaign
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: Campaign Settings */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={24} className="text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Campaign Settings</h2>
                  </div>

                  <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'} gap-4 md:gap-6`}>
                    {/* Campaign Name */}
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700">Campaign Name *</label>
                      <input
                        type="text"
                        className={`w-full border ${validationErrors.campaignName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg`}
                        placeholder="e.g., Kitchen Products Q1 2024"
                        value={form.campaignName}
                        onChange={(e) => updateForm("campaignName", e.target.value)}
                      />
                      {validationErrors.campaignName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle size={14} /> {validationErrors.campaignName}
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
                      <label className="font-medium text-gray-700">Bidding Strategy *</label>
                      <select
                        className={`w-full border ${validationErrors.biddingStrategy ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg bg-white`}
                        value={form.biddingStrategy}
                        onChange={(e) => updateForm("biddingStrategy", e.target.value)}
                      >
                        <option value="dynamicDown">Dynamic Bids - Down Only</option>
                        <option value="dynamicUpDown">Dynamic Bids - Up & Down</option>
                        <option value="fixed">Fixed Bids</option>
                      </select>
                      {validationErrors.biddingStrategy && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle size={14} /> {validationErrors.biddingStrategy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Ad Group */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={24} className="text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Ad Group Settings</h2>
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

                    {/* Match Type - Only on larger screens */}
                    {!isMobile && (
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Default Match Type</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: "broad", label: "Broad", description: "Maximum reach" },
                            { value: "phrase", label: "Phrase", description: "Balanced reach & relevance" },
                            { value: "exact", label: "Exact", label: "Most relevant" }
                          ].map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => updateForm("matchType", type.value)}
                              className={`p-4 border rounded-lg text-center transition-all ${
                                form.matchType === type.value
                                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <div className="font-medium mb-1">{type.label}</div>
                              <div className="text-xs text-gray-600">{type.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Targeting */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Hash size={24} className="text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Targeting Options</h2>
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
                          <div className="text-xs text-gray-600 mt-1">Target specific products/categories</div>
                        </button>
                      </div>
                    </div>

                    {form.targetingType === "keywords" ? (
                      <KeywordInput
                        keywords={form.keywords}
                        setKeywords={(keywords) => updateForm("keywords", keywords)}
                        deviceType={deviceType}
                      />
                    ) : (
                      <ProductSelection
                        products={products}
                        selectedProducts={form.selectedProducts}
                        setSelectedProducts={(products) => updateForm("selectedProducts", products)}
                        deviceType={deviceType}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Ads */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={24} className="text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Ad Selection</h2>
                  </div>

                  <ProductSelection
                    products={products}
                    selectedProducts={form.adProducts}
                    setSelectedProducts={(products) => updateForm("adProducts", products)}
                    deviceType={deviceType}
                  />

                  {validationErrors.adProducts && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} /> {validationErrors.adProducts}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Review */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={24} className="text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Review Campaign</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campaign Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Campaign Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Campaign Name:</span>
                          <span className="font-medium">{form.campaignName}</span>
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
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Targeting Details</h3>
                      <div className="space-y-3">
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
                              : form.selectedProducts.length} selected
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ads Selected:</span>
                          <span className="font-medium">{form.adProducts.length} products</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Estimate */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Estimated Performance</h3>
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
                        <div className="text-lg font-bold">{Math.round(form.dailyBudget / 7)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Est. Sales/Day</div>
                        <div className="text-lg font-bold text-green-600">₹{Math.round(form.dailyBudget * 3)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} gap-3 mt-8 pt-6 border-t`}>
                <div className={`flex ${isMobile ? 'flex-col' : 'gap-3'}`}>
                  {step > 1 && (
                    <button
                      onClick={prevStep}
                      className={`px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium ${isMobile ? 'w-full mb-2' : ''}`}
                    >
                      <ChevronLeft size={18} />
                      Back
                    </button>
                  )}
                  {step < 5 && (
                    <button
                      onClick={() => {
                        if (step === 3 && form.targetingType === "keywords" && form.keywords.length === 0) {
                          alert("Please add at least one keyword before proceeding");
                          return;
                        }
                        nextStep();
                      }}
                      className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium ${isMobile ? 'w-full' : ''}`}
                    >
                      Continue
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>

                {step === 5 && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium ${isMobile ? 'w-full' : ''} ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Launching Campaign...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Launch Campaign
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        {step < 5 && !campaignCreated && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Step {step} of 5 • All fields marked with * are required
          </div>
        )}
      </div>
    </div>
  );
}