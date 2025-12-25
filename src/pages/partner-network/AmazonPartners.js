import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  TrendingUp, 
  DollarSign, 
  Package, 
  BarChart3,
  ChevronDown,
  Bell,
  HelpCircle,
  Settings,
  LogOut
} from 'lucide-react';

// Main App Component
const AmazonPartnerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left Section - Logo & Mobile Menu */}
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="ml-4 flex items-center">
                <div className="text-amber-600 font-bold text-xl">Amazon</div>
                <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                  Partner
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {['Overview', 'Products', 'Orders', 'Analytics', 'Advertising'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      activeTab === item.toLowerCase() 
                        ? 'text-amber-600 border-b-2 border-amber-600' 
                        : 'text-gray-700 hover:text-amber-500'
                    }`}
                    onClick={() => setActiveTab(item.toLowerCase())}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Section - Search & User */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Search products, orders..."
                />
              </div>

              {/* Icons */}
              <button className="p-2 text-gray-700 hover:text-amber-600 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 text-gray-700 hover:text-amber-600">
                <HelpCircle size={20} />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-amber-600" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium">John Doe</span>
                  <ChevronDown size={16} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size={16} className="mr-3" />
                      Profile
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings size={16} className="mr-3" />
                      Settings
                    </a>
                    <hr className="my-2" />
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      <LogOut size={16} className="mr-3" />
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Mobile & Desktop */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
        `}>
          <div className="h-full px-4 py-6 overflow-y-auto">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <StatCard icon={<TrendingUp />} title="Revenue" value="$24,580" change="+12.5%" />
                <StatCard icon={<ShoppingCart />} title="Orders" value="1,248" change="+8.2%" />
                <StatCard icon={<Package />} title="Products" value="342" change="+3.1%" />
                <StatCard icon={<BarChart3 />} title="Conversion" value="4.8%" change="+0.7%" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <nav className="space-y-2">
                <SidebarLink icon={<Package />} label="Inventory" active />
                <SidebarLink icon={<DollarSign />} label="Pricing" />
                <SidebarLink icon={<BarChart3 />} label="Reports" />
                <SidebarLink icon={<ShoppingCart />} label="Fulfillment" />
                <SidebarLink icon={<TrendingUp />} label="Promotions" />
              </nav>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back, Partner!</h1>
                <p className="text-amber-100">Your store performance is up by 12% this week. Keep it up!</p>
              </div>
              <button className="mt-4 md:mt-0 bg-white text-amber-700 font-semibold px-6 py-3 rounded-lg hover:bg-amber-50 transition">
                View Detailed Report
              </button>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Performance Overview</h2>
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last quarter</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Performance chart visualization would appear here</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Recent Orders</h2>
              <div className="space-y-4">
                {[
                  { id: '#ORD-7852', customer: 'Alex Johnson', amount: '$124.99', status: 'Shipped' },
                  { id: '#ORD-7851', customer: 'Maria Garcia', amount: '$89.50', status: 'Processing' },
                  { id: '#ORD-7850', customer: 'David Smith', amount: '$245.00', status: 'Delivered' },
                  { id: '#ORD-7849', customer: 'Lisa Wong', amount: '$67.30', status: 'Pending' },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 text-amber-600 font-medium py-2 border border-amber-600 rounded-lg hover:bg-amber-50">
                View All Orders
              </button>
            </div>

            {/* Top Products */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Top Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">SKU</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Units Sold</th>
                      <th className="pb-3 font-medium">Revenue</th>
                      <th className="pb-3 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Wireless Earbuds', sku: 'SKU-2024', price: '$89.99', sold: '1,245', revenue: '$112,000', rating: '4.8' },
                      { name: 'Smart Watch', sku: 'SKU-2025', price: '$199.99', sold: '892', revenue: '$178,400', rating: '4.6' },
                      { name: 'USB-C Hub', sku: 'SKU-2026', price: '$34.99', sold: '2,134', revenue: '$74,600', rating: '4.9' },
                      { name: 'Laptop Stand', sku: 'SKU-2027', price: '$49.99', sold: '1,567', revenue: '$78,300', rating: '4.7' },
                    ].map((product, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="py-4 font-medium">{product.name}</td>
                        <td className="py-4 text-gray-600">{product.sku}</td>
                        <td className="py-4 font-semibold">{product.price}</td>
                        <td className="py-4">{product.sold}</td>
                        <td className="py-4 text-green-600 font-semibold">{product.revenue}</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="text-amber-500">★</span>
                            <span className="ml-1">{product.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <ActionButton label="Add New Product" color="amber" />
                <ActionButton label="Run Promotion" color="blue" />
                <ActionButton label="Download Reports" color="green" />
                <ActionButton label="Manage Inventory" color="purple" />
                <ActionButton label="Customer Support" color="red" />
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-4">Partner Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-amber-600 hover:text-amber-700">Amazon Seller University</a></li>
                  <li><a href="#" className="text-amber-600 hover:text-amber-700">Advertising Guidelines</a></li>
                  <li><a href="#" className="text-amber-600 hover:text-amber-700">Fulfillment by Amazon</a></li>
                  <li><a href="#" className="text-amber-600 hover:text-amber-700">Partner Community</a></li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ icon, title, value, change }) => (
  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
    <div className="p-2 bg-amber-100 rounded-lg mr-3">
      <div className="text-amber-600">{icon}</div>
    </div>
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <div className="flex items-center">
        <p className="font-semibold">{value}</p>
        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
          {change}
        </span>
      </div>
    </div>
  </div>
);

const SidebarLink = ({ icon, label, active = false }) => (
  <a
    href="#"
    className={`flex items-center px-3 py-3 rounded-lg transition ${
      active 
        ? 'bg-amber-50 text-amber-700 font-medium' 
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </a>
);

const ActionButton = ({ label, color }) => {
  const colorClasses = {
    amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    green: 'bg-green-100 text-green-700 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    red: 'bg-red-100 text-red-700 hover:bg-red-200',
  };

  return (
    <button className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${colorClasses[color]}`}>
      {label}
    </button>
  );
};

export default AmazonPartnerDashboard;