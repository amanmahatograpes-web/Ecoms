import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Settings, 
  Package, 
  Tag, 
  RefreshCw, 
  Filter,
  Download,
  ChevronRight,
  Building2,
  ExternalLink,
  BarChart3,
  TrendingUp,
  Users
} from "lucide-react";

// Mock data
const MOCK_BRANDS = [
  { 
    id: 1, 
    name: "Nike", 
    tools: 12, 
    status: "active",
    lastSynced: "2 hours ago",
    category: "Sportswear",
    revenue: "1.2M",
    growth: "+12%"
  },
  { 
    id: 2, 
    name: "Adidas", 
    tools: 8, 
    status: "active",
    lastSynced: "1 day ago",
    category: "Sportswear",
    revenue: "890K",
    growth: "+8%"
  },
  { 
    id: 3, 
    name: "Puma", 
    tools: 5, 
    status: "pending",
    lastSynced: "3 days ago",
    category: "Sportswear",
    revenue: "450K",
    growth: "+15%"
  },
  { 
    id: 4, 
    name: "Reebok", 
    tools: 9, 
    status: "active",
    lastSynced: "5 hours ago",
    category: "Footwear",
    revenue: "670K",
    growth: "+5%"
  },
];

// Status configuration
const STATUS_CONFIG = {
  active: { 
    color: "bg-green-100 text-green-800 border-green-300", 
    label: "Active",
    icon: "🟢"
  },
  pending: { 
    color: "bg-yellow-100 text-yellow-800 border-yellow-300", 
    label: "Pending",
    icon: "🟡"
  },
  inactive: { 
    color: "bg-gray-100 text-gray-800 border-gray-300", 
    label: "Inactive",
    icon: "⚫"
  },
};

// Custom Card Component
const Card = ({ children, className = "", hover = false, ...props }) => (
  <div 
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-100 ${className}`}>
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

// Custom Button Component
const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8",
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Badge Component
const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    outline: "border border-gray-300 bg-transparent",
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Custom Input Component
const Input = ({ className = "", type = "text", placeholder, value, onChange, ...props }) => (
  <input
    type={type}
    className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    {...props}
  />
);

// Custom Skeleton Component
const Skeleton = ({ className = "", ...props }) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

export default function BrandsAndTools() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState(MOCK_BRANDS);
  
  // Filter brands
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = selectedStatus === "all" || brand.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [brands, search, selectedStatus]);

  // Sync brand
  const handleSync = async (brandId) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBrands(prev => prev.map(brand => 
      brand.id === brandId 
        ? { ...brand, lastSynced: "Just now" }
        : brand
    ));
    
    setIsLoading(false);
  };

  // Add new brand
  const handleAddBrand = () => {
    const newBrand = {
      id: brands.length + 1,
      name: `New Brand ${brands.length + 1}`,
      tools: 0,
      status: "pending",
      lastSynced: "Never",
      category: "New",
      revenue: "0",
      growth: "0%"
    };
    setBrands([...brands, newBrand]);
  };

  // Stats
  const stats = useMemo(() => {
    const activeBrands = brands.filter(b => b.status === "active").length;
    const totalTools = brands.reduce((sum, b) => sum + b.tools, 0);
    return { activeBrands, totalBrands: brands.length, totalTools };
  }, [brands]);

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brands & Tools</h1>
            <p className="text-gray-500 mt-1">Manage your connected brands and their tools</p>
          </div>
          <Button 
            onClick={handleAddBrand}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Brand
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Brands</p>
                  <p className="text-2xl font-bold mt-1">{stats.activeBrands}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Tools</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalTools}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Brands</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalBrands}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Card className="p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search brands by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Brands Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBrands.length === 0 ? (
        // Empty State
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-500 mb-4">
              {search ? `No brands matching "${search}"` : "Get started by adding your first brand"}
            </p>
            <Button onClick={handleAddBrand}>
              <Plus size={16} className="mr-2" />
              Add New Brand
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => {
            const statusConfig = STATUS_CONFIG[brand.status];
            
            return (
              <Card key={brand.id} hover>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle>{brand.name}</CardTitle>
                        <p className="text-sm text-gray-500">{brand.category}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color} border`}>
                      {statusConfig.icon} {statusConfig.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      Synced {brand.lastSynced}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{brand.tools}</p>
                      <p className="text-xs text-gray-500">Tools</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{brand.revenue}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${
                      brand.growth.startsWith('+') 
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <p className="text-lg font-bold">{brand.growth}</p>
                      <p className="text-xs">Growth</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1">
                      <Tag size={16} className="mr-2" />
                      View Details
                      <ChevronRight size={14} className="ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSync(brand.id)}
                      disabled={isLoading}
                      className="px-3"
                    >
                      <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-500">
          <div>
            Showing <span className="font-medium">{filteredBrands.length}</span> of{" "}
            <span className="font-medium">{brands.length}</span> brands
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ExternalLink size={14} className="mr-2" />
              Documentation
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              Need Help?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}