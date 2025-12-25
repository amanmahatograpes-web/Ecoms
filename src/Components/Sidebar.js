import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Package,
  Layers,
  DollarSign,
  ShoppingCart,
  Megaphone,
  TrendingUp,
  FileText,
  CreditCard,
  ShieldCheck,
  Users,
  Wrench,
  BadgeCheck,
  BookOpen,
  CircleDot,
  X
} from "lucide-react";

export default function Sidebar({ currentView, setCurrentView }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleItemClick = (key) => {
    setCurrentView(key);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // DYNAMIC SIDEBAR MENU DATA
  const menu = [
    {
      name: "Catalogue",
      icon: Package,
      items: [
        { key: "add-product", label: "Add Product" },
        { key: "upload-products", label: "Add Products via Upload" },
        { key: "drafts", label: "Complete Your Drafts" },
        { key: "applications", label: "View Selling Applications" },
        { key: "upload-images", label: "Upload Images" },
        { key: "upload-videos", label: "Upload & Manage Videos" },
        { key: "inventory", label: "Inventory" },
      ],
    },
    {
      name: "Inventory",
      icon: Layers,
      items: [
        { key: "manage-inventory", label: "Manage Inventory" },
        { key: "manage-fba", label: "Manage FBA Inventory" },
        { key: "planning", label: "Inventory Planning" },
        { key: "restock", label: "Restock Inventory" },
      ],
    },
    {
      name: "Pricing",
      icon: DollarSign,
      items: [
        { key: "manage-pricing", label: "Manage Pricing" },
        { key: "auto-pricing", label: "Automate Pricing" },
        { key: "fee-discounts", label: "Fee Discounts" },
      ],
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      items: [
        { key: "manage-orders", label: "Manage Orders" },
        { key: "return-requests", label: "Return Requests" },
        { key: "cancelled-orders", label: "Cancelled Orders" },
        { key: "shipment-reports", label: "Shipment Reports" },
      ],
    },
    {
      name: "Advertising",
      icon: Megaphone,
      items: [
        { key: "campaign-manager", label: "Campaign Manager" },
        { key: "create-campaign", label: "Create PPC Campaign" },
        { key: "sponsored-products", label: "Sponsored Products" },
        { key: "sponsored-brands", label: "Sponsored Brands" },
        { key: "sponsored-display", label: "Sponsored Display" },
      ],
    },
    {
      name: "Growth",
      icon: TrendingUp,
      items: [
        { key: "growth-opportunities", label: "Growth Opportunities" },
        { key: "brand-analytics", label: "Brand Analytics" },
        { key: "deals", label: "Deals" },
        { key: "coupons", label: "Coupons" },
      ],
    },
    {
      name: "Reports",
      icon: FileText,
      items: [
        { key: "business-reports", label: "Business Reports" },
        { key: "inventory-reports", label: "Inventory Reports" },
        { key: "return-reports", label: "Return Reports" },
        { key: "payment-reports", label: "Payment Reports" },
      ],
    },
    {
      name: "Payments",
      icon: CreditCard,
      items: [
        { key: "payment-summary", label: "Payment Summary" },
        { key: "transaction-view", label: "Transaction View" },
        { key: "invoice-reports", label: "Invoice Reports" },
      ],
    },
    {
      name: "Performance",
      icon: ShieldCheck,
      items: [
        { key: "account-health", label: "Account Health" },
        { key: "customer-feedback", label: "Customer Feedback" },
        { key: "delivery-performance", label: "Delivery Performance" },
      ],
    },
    {
      name: "Partner Network",
      icon: Users,
      items: [
        { key: "service-providers", label: "Service Providers" },
        { key: "amazon-partners", label: "Amazon Partners" },
        { key: "integration-tools", label: "Tools & Integrations" },
      ],
    },
    {
      name: "Services",
      icon: Wrench,
      items: [
        { key: "fba-services", label: "FBA Services" },
        { key: "logistics", label: "Logistics" },
        { key: "product-photos", label: "Product Photography" },
        { key: "brand-services", label: "Brand Services" },
      ],
    },
    {
      name: "Brands",
      icon: BadgeCheck,
      items: [
        { key: "brand-dashboard", label: "Brand Dashboard" },
        { key: "brand-tools", label: "Brand Tools" },
        { key: "a-plus-content", label: "A+ Content" },
      ],
    },
    {
      name: "Learn",
      icon: BookOpen,
      items: [
        { key: "seller-university", label: "Seller University" },
        { key: "training-videos", label: "Training Videos" },
        { key: "how-to-guides", label: "How-To Guides" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-3 bg-[#199675] text-white rounded-lg shadow-lg hover:bg-[#158765] transition-colors"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Backdrop for mobile */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r h-screen p-4 transition-all duration-300
          ${isMobile ? "fixed left-0 top-0 z-40" : "relative"}
          ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
          ${!isMobile && collapsed ? "w-16" : "w-64"}
          ${isMobile ? "w-72" : ""}
        `}
      >
        {/* Desktop Collapse Button */}
        {!isMobile && (
          <button
            className="mb-4 p-2 rounded hover:bg-gray-100 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={22} color="#199675" />
          </button>
        )}

        {/* Close button for mobile */}
        {isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Menu List - No scrollbars */}
        <div className="space-y-1">
          {menu.map((section) => {
            const Icon = section.icon;
            const isDropdownOpen = openDropdown === section.name;
            const showContent = !isMobile ? !collapsed : true;

            return (
              <div key={section.name} className="mb-1">
                {/* Section Header */}
                <button
                  className="flex items-center justify-between w-full px-2 py-2 hover:bg-gray-100 rounded transition"
                  onClick={() => toggleDropdown(section.name)}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} color="#199675" />
                    {showContent && (
                      <span className="text-gray-800 font-medium">
                        {section.name}
                      </span>
                    )}
                  </div>

                  {showContent && (
                    isDropdownOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )
                  )}
                </button>

                {/* Dropdown Items */}
                {showContent && isDropdownOpen && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
                    {section.items.map((item) => (
                      <button
                        key={item.key}
                        className={`flex items-center gap-2 w-full text-left text-sm py-1 transition 
                          ${
                            currentView === item.key
                              ? "text-[#199675] font-semibold"
                              : "text-gray-600 hover:text-[#199675]"
                          }
                        `}
                        onClick={() => handleItemClick(item.key)}
                      >
                        <CircleDot size={10} color="#199675" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}