import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Palette, 
  Upload, 
  Camera, 
  Layers, 
  Globe, 
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Grid,
  List,
  XCircle,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  MoreVertical,
  Plus,
  Tag,
  Building,
  Target,
  Sparkles,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Default export - make sure this is the main export
const BrandDashboard = () => {
  // State Management
  const [logos, setLogos] = useState([]);
  const [brandAssets, setBrandAssets] = useState([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [selectedAssetFile, setSelectedAssetFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [assetPreview, setAssetPreview] = useState(null);
  
  // UI States
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('logos');
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data
  const [analytics] = useState({
    totalBrands: 24,
    activeBrands: 18,
    assetsUsed: 342,
    logoDownloads: 1284,
    usageTrend: '+24%',
    recentActivity: [
      { id: 1, action: 'Logo Updated', brand: 'Nike', time: '2 hours ago', user: 'John Doe' },
      { id: 2, action: 'Asset Uploaded', brand: 'Apple', time: '5 hours ago', user: 'Jane Smith' },
      { id: 3, action: 'Brand Created', brand: 'Tesla', time: '1 day ago', user: 'Mike Johnson' },
      { id: 4, action: 'Asset Downloaded', brand: 'Google', time: '2 days ago', user: 'Sarah Wilson' },
    ]
  });

  const categories = [
    { id: 'all', name: 'All Assets', count: 156 },
    { id: 'logos', name: 'Logos', count: 24 },
    { id: 'images', name: 'Images', count: 78 },
    { id: 'documents', name: 'Documents', count: 32 },
    { id: 'brand-guides', name: 'Brand Guides', count: 12 },
    { id: 'templates', name: 'Templates', count: 10 },
  ];

  useEffect(() => {
    fetchBrandData();
  }, []);

  const fetchBrandData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockLogos = [
        { id: 1, name: 'Nike Logo', brand: 'Nike', url: '/logo1.png', format: 'PNG', size: '45KB' },
        { id: 2, name: 'Apple Logo', brand: 'Apple', url: '/logo2.png', format: 'SVG', size: '12KB' },
        { id: 3, name: 'Google Logo', brand: 'Google', url: '/logo3.png', format: 'PNG', size: '32KB' },
      ];
      
      const mockAssets = [
        { id: 1, name: 'Brand Guidelines', brand: 'Nike', type: 'document', format: 'PDF', size: '2.4MB', updated: '2 days ago' },
        { id: 2, name: 'Product Photos', brand: 'Apple', type: 'image', format: 'JPG', size: '5.6MB', updated: '1 week ago' },
        { id: 3, name: 'Social Media Kit', brand: 'Google', type: 'guide', format: 'ZIP', size: '15.2MB', updated: '3 days ago' },
      ];

      setLogos(mockLogos);
      setBrandAssets(mockAssets);
      
      // Uncomment for actual API calls:
      // const logosRes = await axios.get("/api/brand/logos");
      // const assetsRes = await axios.get("/api/brand/assets");
      // setLogos(logosRes.data);
      // setBrandAssets(assetsRes.data);
    } catch (err) {
      console.error("Failed loading brand data", err);
    }
  };

  const handleLogoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleAssetFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAssetFile(file);
      setAssetPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async () => {
    if (!selectedLogoFile) return;
    setUploadingLogo(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploadingLogo(false);
      setSelectedLogoFile(null);
      setLogoPreview(null);
      alert('Logo uploaded successfully!');
    }, 1500);
  };

  const uploadAsset = async () => {
    if (!selectedAssetFile) return;
    setUploadingAsset(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploadingAsset(false);
      setSelectedAssetFile(null);
      setAssetPreview(null);
      alert('Asset uploaded successfully!');
    }, 1500);
  };

  const deleteLogo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this logo?")) return;
    setLogos(logos.filter(logo => logo.id !== id));
  };

  const deleteAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    setBrandAssets(brandAssets.filter(asset => asset.id !== id));
  };

  const filteredAssets = brandAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItemSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Render Image component for assets
  const ImageIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Palette className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              Brand Management Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage all your brand assets in one place</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export Assets
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              New Brand
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Brands</p>
              <h3 className="text-2xl font-bold mt-1">{analytics.totalBrands}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+3 this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Brands</p>
              <h3 className="text-2xl font-bold mt-1">{analytics.activeBrands}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <Sparkles className="w-4 h-4" />
            <span>92% active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Assets</p>
              <h3 className="text-2xl font-bold mt-1">{analytics.assetsUsed}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Layers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">+{analytics.usageTrend} from last month</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Logo Downloads</p>
              <h3 className="text-2xl font-bold mt-1">{analytics.logoDownloads}</h3>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Download className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Upload */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              Quick Upload
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleLogoFile} 
                    disabled={uploadingLogo}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Upload Logo</p>
                    <p className="text-xs text-gray-500">PNG, SVG, JPG</p>
                  </div>
                </label>
                {logoPreview && (
                  <div className="mt-3">
                    <img src={logoPreview} alt="Preview" className="w-full h-32 object-contain rounded" />
                  </div>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-500 transition-colors">
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf,.ai,.eps,.psd" 
                    onChange={handleAssetFile} 
                    disabled={uploadingAsset}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Upload Asset</p>
                    <p className="text-xs text-gray-500">PDF, AI, EPS, PSD</p>
                  </div>
                </label>
                {assetPreview && assetPreview.includes("image") && (
                  <div className="mt-3">
                    <img src={assetPreview} alt="Preview" className="w-full h-32 object-contain rounded" />
                  </div>
                )}
              </div>

              <button
                onClick={selectedLogoFile ? uploadLogo : uploadAsset}
                disabled={(uploadingLogo || uploadingAsset) || (!selectedLogoFile && !selectedAssetFile)}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                {uploadingLogo || uploadingAsset ? 'Uploading...' : 'Upload Selected Files'}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Categories
            </h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedCategory === category.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.brand} • {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Toolbar */}
          <div className="bg-white rounded-xl p-4 shadow border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search brands, logos, assets..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mt-4">
              {['logos', 'assets', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium text-sm capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-green-600 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            {activeTab === 'logos' && (
              <div className="p-6">
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'space-y-3'
                }`}>
                  {logos.map((logo) => (
                    <div
                      key={logo.id}
                      className={`group relative ${
                        viewMode === 'grid'
                          ? 'rounded-lg border overflow-hidden hover:shadow-lg transition-shadow'
                          : 'flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50'
                      }`}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="h-40 bg-gray-50 flex items-center justify-center p-4">
                            <div className="text-center">
                              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm font-medium">{logo.name}</p>
                              <p className="text-xs text-gray-500">{logo.brand}</p>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="font-medium truncate">{logo.name}</p>
                            <p className="text-xs text-gray-500">{logo.brand}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center flex-shrink-0">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{logo.name}</p>
                            <p className="text-sm text-gray-500">{logo.brand} • {logo.format}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {logo.size}
                          </div>
                        </>
                      )}
                      
                      {/* Actions */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-white rounded shadow hover:bg-gray-50">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 bg-white rounded shadow hover:bg-gray-50">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deleteLogo(logo.id)}
                          className="p-1.5 bg-white rounded shadow hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="p-6">
                <div className="space-y-4">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 group"
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        asset.type === 'image' ? 'bg-blue-50' :
                        asset.type === 'document' ? 'bg-green-50' :
                        asset.type === 'guide' ? 'bg-purple-50' : 'bg-gray-50'
                      }`}>
                        {asset.type === 'image' ? (
                          <ImageIcon className="w-6 h-6 text-blue-600" />
                        ) : asset.type === 'document' ? (
                          <FileText className="w-6 h-6 text-green-600" />
                        ) : (
                          <Globe className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{asset.name}</p>
                          <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                            {asset.format}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {asset.brand} • {asset.size} • Updated {asset.updated}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deleteAsset(asset.id)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-lg mb-4">Brand Usage</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Nike</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Apple</span>
                          <span>38%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '38%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Google</span>
                          <span>20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-lg mb-4">Asset Types</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'Logos', count: 24, color: 'bg-green-500' },
                        { type: 'Images', count: 78, color: 'bg-blue-500' },
                        { type: 'Documents', count: 32, color: 'bg-purple-500' },
                        { type: 'Brand Guides', count: 12, color: 'bg-yellow-500' },
                      ].map((item) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <span>{item.type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className={`${item.color} h-2 rounded-full`} style={{ 
                                width: `${(item.count / 146) * 100}%` 
                              }}></div>
                            </div>
                            <span className="text-sm font-medium">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Make sure to export as default
export default BrandDashboard;