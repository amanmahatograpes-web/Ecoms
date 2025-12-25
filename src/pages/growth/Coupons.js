import React, { useState, useMemo, useEffect } from 'react';
import { 
  FiSearch, FiFilter, FiCopy, FiCheck, FiClipboard,
  FiPercent, FiTag, FiGift, FiShoppingCart, FiHeart,
  FiEye, FiShare2, FiClock, FiCalendar, FiStar,
  FiChevronDown, FiChevronUp, FiChevronRight, FiTruck,
  FiAlertCircle, FiRefreshCw, FiBell, FiGrid, FiList,
  FiDollarSign, FiPackage, FiShield, FiRepeat, FiMenu, FiX
} from 'react-icons/fi';
import { 
  FaAmazon, FaRegHeart, FaRegStar, FaStarHalfAlt,
  FaFire, FaBolt, FaCrown, FaRegCopy, FaCheckCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CouponsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [clippedCoupons, setClippedCoupons] = useState(new Set());
  const [viewedCoupons, setViewedCoupons] = useState(new Set());
  const [showExpired, setShowExpired] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showClipConfirmation, setShowClipConfirmation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulate API loading
  const [isLoading, setIsLoading] = useState(false);
  const [userCoupons, setUserCoupons] = useState([]);

  // Categories
  const categories = [
    { id: 'all', name: 'All Coupons', count: 245, icon: <FiPercent /> },
    { id: 'grocery', name: 'Grocery', count: 45, icon: <FiGift /> },
    { id: 'electronics', name: 'Electronics', count: 38, icon: <FaBolt /> },
    { id: 'home', name: 'Home & Kitchen', count: 67, icon: <FiTag /> },
    { id: 'fashion', name: 'Fashion', count: 52, icon: <FiShoppingCart /> },
    { id: 'beauty', name: 'Beauty & Health', count: 31, icon: <FiHeart /> },
    { id: 'toys', name: 'Toys & Games', count: 23, icon: <FiGift /> },
    { id: 'books', name: 'Books', count: 19, icon: <FiStar /> },
    { id: 'automotive', name: 'Automotive', count: 27, icon: <FiTruck /> },
    { id: 'office', name: 'Office Supplies', count: 15, icon: <FiClipboard /> },
  ];

  // Dynamic coupons data
  const coupons = useMemo(() => [
    {
      id: 'CPN001',
      code: 'SAVE30',
      title: "Save 30% on Grocery Orders",
      description: "Save 30% on select grocery items. Minimum purchase $50.",
      category: 'grocery',
      discountType: 'percentage',
      discountValue: 30,
      minPurchase: 50,
      maxDiscount: 25,
      validUntil: '2024-12-31',
      isPrime: true,
      isLimited: true,
      remainingUses: 45,
      totalUses: 500,
      products: [
        "Amazon Fresh",
        "Whole Foods Market",
        "Prime Pantry"
      ],
      terms: "Valid on grocery items sold by Amazon.com. Excludes alcohol and gift cards.",
      featured: true
    },
    {
      id: 'CPN002',
      code: 'ELECTRONIC50',
      title: "$50 off Electronics over $300",
      description: "Get $50 off on electronics purchases over $300",
      category: 'electronics',
      discountType: 'amount',
      discountValue: 50,
      minPurchase: 300,
      maxDiscount: 50,
      validUntil: '2024-11-30',
      isPrime: false,
      isLimited: false,
      remainingUses: null,
      totalUses: 1000,
      products: [
        "Laptops",
        "Tablets",
        "Headphones",
        "Smartwatches"
      ],
      terms: "Valid on select electronics. One use per customer.",
      featured: true
    },
    {
      id: 'CPN003',
      code: 'FREESHIP',
      title: "Free Shipping No Minimum",
      description: "Free shipping on any order. No minimum purchase required.",
      category: 'all',
      discountType: 'shipping',
      discountValue: 0,
      minPurchase: 0,
      maxDiscount: null,
      validUntil: '2024-10-15',
      isPrime: false,
      isLimited: true,
      remainingUses: 12,
      totalUses: 100,
      products: [
        "All eligible items"
      ],
      terms: "Standard shipping only. Excludes oversized items.",
      featured: false
    },
    {
      id: 'CPN004',
      code: 'HOME25',
      title: "25% off Home & Kitchen",
      description: "Save 25% on select home and kitchen items",
      category: 'home',
      discountType: 'percentage',
      discountValue: 25,
      minPurchase: 35,
      maxDiscount: 50,
      validUntil: '2024-12-15',
      isPrime: true,
      isLimited: false,
      remainingUses: null,
      totalUses: 5000,
      products: [
        "Cookware",
        "Small Appliances",
        "Home Decor",
        "Bedding"
      ],
      terms: "Valid on select home items. Cannot be combined with other offers.",
      featured: false
    },
    {
      id: 'CPN005',
      code: 'FASHION40',
      title: "40% off Fashion Items",
      description: "Save 40% on clothing, shoes, and accessories",
      category: 'fashion',
      discountType: 'percentage',
      discountValue: 40,
      minPurchase: 60,
      maxDiscount: 40,
      validUntil: '2024-11-20',
      isPrime: true,
      isLimited: true,
      remainingUses: 89,
      totalUses: 200,
      products: [
        "Clothing",
        "Shoes",
        "Accessories",
        "Watches"
      ],
      terms: "Valid on select fashion items. Limited quantities available.",
      featured: true
    },
    {
      id: 'CPN006',
      code: 'BEAUTY20',
      title: "$20 off Beauty Products",
      description: "Get $20 off on beauty and health products",
      category: 'beauty',
      discountType: 'amount',
      discountValue: 20,
      minPurchase: 40,
      maxDiscount: 20,
      validUntil: '2024-10-31',
      isPrime: false,
      isLimited: false,
      remainingUses: null,
      totalUses: 3000,
      products: [
        "Skincare",
        "Makeup",
        "Hair Care",
        "Fragrances"
      ],
      terms: "Valid on select beauty products. One per customer.",
      featured: false
    },
    {
      id: 'CPN007',
      code: 'TOYDEAL',
      title: "Buy 1 Get 1 50% off Toys",
      description: "Buy one toy, get second at 50% off",
      category: 'toys',
      discountType: 'bogo',
      discountValue: 50,
      minPurchase: 0,
      maxDiscount: null,
      validUntil: '2024-12-24',
      isPrime: true,
      isLimited: false,
      remainingUses: null,
      totalUses: 10000,
      products: [
        "LEGO Sets",
        "Action Figures",
        "Board Games",
        "Educational Toys"
      ],
      terms: "Valid on select toys. Equal or lesser value.",
      featured: false
    },
    {
      id: 'CPN008',
      code: 'BOOK15',
      title: "15% off Books",
      description: "Save 15% on all books",
      category: 'books',
      discountType: 'percentage',
      discountValue: 15,
      minPurchase: 20,
      maxDiscount: 10,
      validUntil: '2024-11-30',
      isPrime: false,
      isLimited: true,
      remainingUses: 234,
      totalUses: 1000,
      products: [
        "Fiction",
        "Non-Fiction",
        "Textbooks",
        "Children's Books"
      ],
      terms: "Valid on all books. Excludes pre-orders.",
      featured: false
    },
    {
      id: 'CPN009',
      code: 'CAR25',
      title: "$25 off Auto Parts",
      description: "Save $25 on automotive parts and accessories",
      category: 'automotive',
      discountType: 'amount',
      discountValue: 25,
      minPurchase: 75,
      maxDiscount: 25,
      validUntil: '2024-11-15',
      isPrime: true,
      isLimited: false,
      remainingUses: null,
      totalUses: 5000,
      products: [
        "Car Parts",
        "Tools",
        "Accessories",
        "Maintenance"
      ],
      terms: "Valid on select auto items. Free shipping included.",
      featured: true
    },
    {
      id: 'CPN010',
      code: 'OFFICE30',
      title: "30% off Office Supplies",
      description: "Save 30% on office supplies and furniture",
      category: 'office',
      discountType: 'percentage',
      discountValue: 30,
      minPurchase: 50,
      maxDiscount: 30,
      validUntil: '2024-10-30',
      isPrime: false,
      isLimited: true,
      remainingUses: 56,
      totalUses: 200,
      products: [
        "Paper",
        "Pens",
        "Furniture",
        "Printers"
      ],
      terms: "Valid on select office items. While supplies last.",
      featured: false
    },
    {
      id: 'CPN011',
      code: 'PRIME10',
      title: "Prime Members: Extra 10% off",
      description: "Prime members get extra 10% off already discounted items",
      category: 'all',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 0,
      maxDiscount: null,
      validUntil: '2024-12-31',
      isPrime: true,
      isLimited: false,
      remainingUses: null,
      totalUses: null,
      products: [
        "All eligible items"
      ],
      terms: "Prime members only. Stackable with other coupons.",
      featured: true
    },
    {
      id: 'CPN012',
      code: 'FLASHDEAL',
      title: "Flash Sale: 60% off Select Items",
      description: "Limited time flash sale - 60% off select items",
      category: 'all',
      discountType: 'percentage',
      discountValue: 60,
      minPurchase: 0,
      maxDiscount: null,
      validUntil: '2024-10-10',
      isPrime: false,
      isLimited: true,
      remainingUses: 3,
      totalUses: 50,
      products: [
        "Various categories"
      ],
      terms: "Limited quantities. First come, first served.",
      featured: true
    },
  ], []);

  // Mock products for coupon application
  const products = useMemo(() => [
    {
      id: 1,
      name: "Instant Pot Duo 7-in-1",
      price: 89.99,
      discountedPrice: 69.99,
      category: 'home',
      rating: 4.6,
      couponApplicable: true,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w-400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Apple AirPods Pro",
      price: 249.99,
      discountedPrice: 199.99,
      category: 'electronics',
      rating: 4.7,
      couponApplicable: true,
      image: "https://images.unsplash.com/photo-1591370264374-9a5aef8df17a?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Organic Coffee Beans",
      price: 19.99,
      discountedPrice: 14.99,
      category: 'grocery',
      rating: 4.5,
      couponApplicable: true,
      image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e7?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Yoga Mat Premium",
      price: 34.99,
      discountedPrice: 24.99,
      category: 'sports',
      rating: 4.4,
      couponApplicable: true,
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop"
    }
  ], []);

  // Load user's clipped coupons on mount
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockClipped = ['CPN001', 'CPN004', 'CPN005'];
      setClippedCoupons(new Set(mockClipped));
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter coupons
  const filteredCoupons = useMemo(() => {
    let result = [...coupons];
    
    if (activeCategory !== 'all') {
      result = result.filter(coupon => coupon.category === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(coupon =>
        coupon.title.toLowerCase().includes(query) ||
        coupon.description.toLowerCase().includes(query) ||
        coupon.code.toLowerCase().includes(query)
      );
    }
    
    if (!showExpired) {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(coupon => coupon.validUntil >= today);
    }
    
    switch (sortBy) {
      case 'discount':
        result.sort((a, b) => b.discountValue - a.discountValue);
        break;
      case 'expiring':
        result.sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil));
        break;
      case 'popular':
        result.sort((a, b) => (b.totalUses || 0) - (a.totalUses || 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    return result;
  }, [coupons, activeCategory, searchQuery, sortBy, showExpired]);

  const getRemainingDays = (date) => {
    const today = new Date();
    const validUntil = new Date(date);
    const diffTime = validUntil - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const clipCoupon = (couponId) => {
    const newSet = new Set(clippedCoupons);
    if (newSet.has(couponId)) {
      newSet.delete(couponId);
      setClippedCoupons(newSet);
      showNotification('Coupon removed from your clipboard');
    } else {
      newSet.add(couponId);
      setClippedCoupons(newSet);
      showNotification('Coupon clipped successfully!');
      setShowClipConfirmation(couponId);
      setTimeout(() => setShowClipConfirmation(null), 2000);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    showNotification(`Coupon code "${code}" copied to clipboard!`);
  };

  const CouponCard = ({ coupon }) => {
    const isClipped = clippedCoupons.has(coupon.id);
    const isViewed = viewedCoupons.has(coupon.id);
    const remainingDays = getRemainingDays(coupon.validUntil);
    const isExpiringSoon = remainingDays <= 3;
    const isExpired = remainingDays < 0;
    
    const usagePercentage = coupon.remainingUses 
      ? ((coupon.totalUses - coupon.remainingUses) / coupon.totalUses) * 100
      : null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 relative ${
          isViewed ? 'border-blue-200' : 'border-gray-200'
        } ${isExpired ? 'opacity-60' : ''}`}
      >
        {coupon.featured && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full z-10">
            <span className="hidden xs:inline">Featured</span>
            <span className="xs:hidden">⭐</span>
          </div>
        )}
        
        {coupon.isPrime && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full z-10 flex items-center">
            <span className="hidden xs:inline mr-1">Prime</span>
            <span className="xs:hidden">P</span>
            <FaCrown className="text-yellow-300 ml-1" />
          </div>
        )}
        
        {coupon.isLimited && coupon.remainingUses && (
          <div className="absolute top-10 right-2 sm:top-12 sm:right-4 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full z-10">
            <span className="hidden xs:inline">Only {coupon.remainingUses} left</span>
            <span className="xs:hidden">{coupon.remainingUses} left</span>
          </div>
        )}
        
        {isExpiringSoon && !isExpired && (
          <div className="absolute top-18 right-2 sm:top-20 sm:right-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full z-10">
            <span className="hidden xs:inline">Expires in {remainingDays} days</span>
            <span className="xs:hidden">{remainingDays}d</span>
          </div>
        )}
        
        {isExpired && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gray-500 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full z-10">
            Expired
          </div>
        )}
        
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2 truncate">{coupon.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{coupon.description}</p>
            </div>
            <button 
              onClick={() => clipCoupon(coupon.id)}
              className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                isClipped 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isClipped ? <FaCheckCircle className="text-sm sm:text-base" /> : <FiClipboard className="text-sm sm:text-base" />}
            </button>
          </div>
          
          <div className="flex items-center mb-3 sm:mb-4">
            <div className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex-shrink-0 ${
              coupon.discountType === 'percentage' ? 'bg-green-100' :
              coupon.discountType === 'amount' ? 'bg-blue-100' :
              coupon.discountType === 'shipping' ? 'bg-purple-100' : 'bg-yellow-100'
            }`}>
              {coupon.discountType === 'percentage' ? (
                <span className="text-xl sm:text-2xl font-bold text-green-700">
                  {coupon.discountValue}%
                </span>
              ) : coupon.discountType === 'amount' ? (
                <span className="text-xl sm:text-2xl font-bold text-blue-700">
                  ${coupon.discountValue}
                </span>
              ) : coupon.discountType === 'shipping' ? (
                <div className="text-center">
                  <FiTruck className="text-lg sm:text-2xl text-purple-700 mx-auto mb-1" />
                  <span className="text-xs sm:text-sm font-bold text-purple-700">FREE</span>
                </div>
              ) : (
                <span className="text-lg sm:text-xl font-bold text-yellow-700">
                  BOGO {coupon.discountValue}%
                </span>
              )}
            </div>
            
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2">
                <div>
                  <p className="text-xs text-gray-500">Code</p>
                  <div className="flex items-center">
                    <code className="font-mono font-bold text-gray-900 text-sm sm:text-lg truncate">{coupon.code}</code>
                    <button 
                      onClick={() => copyCouponCode(coupon.code)}
                      className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800 flex-shrink-0"
                    >
                      <FiCopy className="text-sm sm:text-base" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Min. Purchase</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {coupon.minPurchase > 0 ? `$${coupon.minPurchase}` : 'No minimum'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valid Until</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {new Date(coupon.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Uses</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {coupon.totalUses?.toLocaleString() || 'Unlimited'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {coupon.remainingUses && (
            <div className="mt-3 sm:mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="truncate mr-2">Claimed: {coupon.totalUses - coupon.remainingUses}/{coupon.totalUses}</span>
                <span className="flex-shrink-0">{Math.round(usagePercentage)}% claimed</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-500"
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Applicable to:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {coupon.products.slice(0, 2).map((product, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
                >
                  {product}
                </span>
              ))}
              {coupon.products.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                  +{coupon.products.length - 2} more
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedCoupon(coupon)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-3 sm:py-2 sm:px-4 rounded-lg flex items-center justify-center text-sm sm:text-base"
            >
              {isClipped ? 'View' : 'Clip'}
            </button>
            <button className="w-10 sm:w-auto sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm sm:text-base">
              <FiEye className="sm:mr-2" />
              <span className="hidden sm:inline">View</span>
            </button>
            <button className="w-10 sm:w-auto sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm sm:text-base">
              <FiShare2 className="sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
        
        {showClipConfirmation === coupon.id && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center rounded-xl"
          >
            <div className="text-white text-center p-4">
              <FaCheckCircle className="text-3xl sm:text-5xl mx-auto mb-2 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-bold">Coupon Clipped!</h4>
              <p className="text-xs sm:text-sm opacity-90">Added to your coupon wallet</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const CouponDetailModal = ({ coupon, onClose }) => {
    if (!coupon) return null;
    
    const remainingDays = getRemainingDays(coupon.validUntil);
    const isClipped = clippedCoupons.has(coupon.id);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl w-full max-h-[95vh] overflow-y-auto"
          style={{ maxWidth: 'min(95vw, 1200px)' }}
        >
          <div className="sticky top-0 bg-white p-4 sm:p-6 border-b flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                coupon.discountType === 'percentage' ? 'bg-green-100 text-green-600' :
                coupon.discountType === 'amount' ? 'bg-blue-100 text-blue-600' :
                coupon.discountType === 'shipping' ? 'bg-purple-100 text-purple-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {coupon.discountType === 'percentage' ? <FiPercent className="text-lg sm:text-2xl" /> :
                 coupon.discountType === 'amount' ? <FiDollarSign className="text-lg sm:text-2xl" /> :
                 coupon.discountType === 'shipping' ? <FiTruck className="text-lg sm:text-2xl" /> : <FiGift className="text-lg sm:text-2xl" />}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{coupon.title}</h2>
                <p className="text-gray-600 text-sm sm:text-base truncate">{coupon.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl ml-2"
            >
              &times;
            </button>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:w-1/2">
                <div className={`rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 ${
                  coupon.discountType === 'percentage' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                  coupon.discountType === 'amount' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  coupon.discountType === 'shipping' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                } text-white`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-xs sm:text-sm opacity-90">SAVE</p>
                      <p className="text-2xl sm:text-4xl font-bold">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` :
                         coupon.discountType === 'amount' ? `$${coupon.discountValue}` :
                         coupon.discountType === 'shipping' ? 'FREE SHIPPING' : `BOGO ${coupon.discountValue}% OFF`}
                      </p>
                      {coupon.minPurchase > 0 && (
                        <p className="text-xs sm:text-sm mt-2">On orders over ${coupon.minPurchase}</p>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">{coupon.code}</div>
                      <button 
                        onClick={() => copyCouponCode(coupon.code)}
                        className="mt-2 px-3 sm:px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center mx-auto text-sm sm:text-base"
                      >
                        <FiCopy className="mr-1 sm:mr-2" />
                        Copy Code
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">Valid Until</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {new Date(coupon.validUntil).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {remainingDays > 0 ? `${remainingDays} days remaining` : 'Expired'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">Minimum Purchase</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {coupon.minPurchase > 0 ? `$${coupon.minPurchase}` : 'No minimum'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">Max Discount</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {coupon.maxDiscount ? `$${coupon.maxDiscount}` : 'No limit'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">Usage</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {coupon.totalUses?.toLocaleString() || 'Unlimited'} uses
                    </p>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Terms & Conditions</h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-700">{coupon.terms}</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Products You Can Save On</h3>
                
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {coupon.products.map((product, index) => (
                      <span 
                        key={index}
                        className="px-2 sm:px-3 py-1 sm:py-2 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Popular Items</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {products
                      .filter(p => p.couponApplicable)
                      .slice(0, 3)
                      .map((product) => (
                        <div key={product.id} className="flex items-center p-2 sm:p-3 border rounded-lg hover:bg-gray-50">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="ml-2 sm:ml-4 flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{product.name}</p>
                            <div className="flex items-center mt-1 flex-wrap">
                              <span className="text-sm sm:text-lg font-bold text-gray-900">
                                ${product.discountedPrice}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2">
                                ${product.price}
                              </span>
                              <span className="text-xs sm:text-sm text-green-600 font-medium ml-1 sm:ml-2">
                                Save ${(product.price - product.discountedPrice).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <button className="ml-2 px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 text-xs sm:text-sm">
                            Apply
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={() => clipCoupon(coupon.id)}
                    className={`w-full py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg ${
                      isClipped
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                    }`}
                  >
                    {isClipped ? '✓ Coupon Clipped' : 'Clip This Coupon'}
                  </button>
                  
                  <button className="w-full py-2 sm:py-3 border-2 border-gray-300 rounded-lg font-bold text-sm sm:text-lg hover:bg-gray-50">
                    Shop Eligible Items
                  </button>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm">
                      <FiShare2 className="mr-1 sm:mr-2" />
                      Share
                    </button>
                    <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm">
                      <FiBell className="mr-1 sm:mr-2" />
                      Remind
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const stats = {
    totalCoupons: coupons.length,
    clippedCoupons: clippedCoupons.size,
    totalSavings: coupons.reduce((sum, coupon) => {
      if (coupon.discountType === 'amount') return sum + coupon.discountValue;
      if (coupon.discountType === 'percentage') return sum + 25;
      return sum;
    }, 0),
    expiringSoon: coupons.filter(c => getRemainingDays(c.validUntil) <= 7).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-50 flex items-center max-w-[90vw]"
          >
            <FaCheckCircle className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base truncate">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 sm:w-72 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <div className="p-4">
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search coupons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <FiFilter className="mr-2" />
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                          activeCategory === category.id
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{category.icon}</span>
                          <span className="truncate">{category.name}</span>
                        </div>
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sort By */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Sort By</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'popular', label: 'Most Popular' },
                      { id: 'discount', label: 'Highest Discount' },
                      { id: 'expiring', label: 'Expiring Soon' },
                      { id: 'newest', label: 'Newest' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          sortBy === option.id
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Filters */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Filters</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showExpired}
                        onChange={(e) => setShowExpired(e.target.checked)}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-gray-700">Show expired coupons</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-gray-700">Prime exclusive only</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-gray-700">Free shipping only</span>
                    </label>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="space-y-2">
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-2 px-4 rounded-lg hover:opacity-90"
                  >
                    Apply All Filters
                  </button>
                  <button 
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                      setShowExpired(false);
                      setSortBy('popular');
                      setIsSidebarOpen(false);
                    }}
                    className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-[1920px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden mr-3 text-white"
                >
                  <FiMenu className="text-2xl" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Amazon Coupons</h1>
                  <p className="opacity-90 text-sm sm:text-base">Clip coupons & save on your favorite products</p>
                </div>
              </div>
            </div>
            <div className="mt-2 lg:mt-0">
              <button className="bg-white text-gray-900 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-100 flex items-center justify-center w-full sm:w-auto text-sm sm:text-base">
                <FiClipboard className="mr-2 flex-shrink-0" />
                <span className="truncate">View Clipped ({clippedCoupons.size})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <FiFilter className="text-xl" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Available</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalCoupons}</p>
              </div>
              <FiPercent className="text-xl sm:text-2xl lg:text-3xl text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Clipped</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.clippedCoupons}</p>
              </div>
              <FiClipboard className="text-xl sm:text-2xl lg:text-3xl text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Savings</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">${stats.totalSavings}+</p>
              </div>
              <FiDollarSign className="text-xl sm:text-2xl lg:text-3xl text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Expiring</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
              </div>
              <FiClock className="text-xl sm:text-2xl lg:text-3xl text-red-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-4 xl:p-6 sticky top-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search coupons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <FiFilter className="mr-2" />
                  Categories
                </h3>
                <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                        activeCategory === category.id
                          ? 'bg-orange-50 text-orange-600 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{category.icon}</span>
                        <span className="truncate">{category.name}</span>
                      </div>
                      <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort By */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { id: 'popular', label: 'Most Popular' },
                    { id: 'discount', label: 'Highest Discount' },
                    { id: 'expiring', label: 'Expiring Soon' },
                    { id: 'newest', label: 'Newest' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        sortBy === option.id
                          ? 'bg-orange-50 text-orange-600 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filters */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Filters</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showExpired}
                      onChange={(e) => setShowExpired(e.target.checked)}
                      className="rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Show expired coupons</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Prime exclusive only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Free shipping only</span>
                  </label>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-2 px-4 rounded-lg hover:opacity-90">
                  Apply All Filters
                </button>
                <button 
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setShowExpired(false);
                    setSortBy('popular');
                  }}
                  className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            {/* Coupon Tips */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                <FiAlertCircle className="mr-2" />
                Coupon Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Coupons auto-apply at checkout</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Clip multiple coupons for more savings</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Prime members get exclusive coupons</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-3 sm:mb-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {activeCategory === 'all' ? 'All Available Coupons' : 
                     `${categories.find(c => c.id === activeCategory)?.name} Coupons`}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {filteredCoupons.length} coupons found
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-2 py-2 sm:px-3 sm:py-2 ${viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'bg-white text-gray-600'}`}
                    >
                      <FiGrid className="text-sm sm:text-base" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-2 py-2 sm:px-3 sm:py-2 ${viewMode === 'list' ? 'bg-orange-50 text-orange-600' : 'bg-white text-gray-600'}`}
                    >
                      <FiList className="text-sm sm:text-base" />
                    </button>
                  </div>
                  <button 
                    onClick={() => setIsLoading(true)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    <FiRefreshCw className={`text-sm sm:text-base ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FiFilter className="text-sm sm:text-base" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center h-48 sm:h-64">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {/* Coupons Grid */}
                {filteredCoupons.length > 0 ? (
                  <div className={`grid ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' 
                      : 'grid-cols-1'
                  } gap-4 sm:gap-6`}>
                    <AnimatePresence>
                      {filteredCoupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border p-8 sm:p-12 text-center">
                    <FiSearch className="text-gray-400 text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No coupons found</h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      {searchQuery 
                        ? `No coupons matching "${searchQuery}"`
                        : 'Try adjusting your filters'}
                    </p>
                    <button 
                      onClick={() => {
                        setActiveCategory('all');
                        setSearchQuery('');
                        setShowExpired(false);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 text-sm sm:text-base"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
                
                {/* How It Works */}
                <div className="mt-6 sm:mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <FiClipboard className="mr-2" />
                    How Amazon Coupons Work
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-white p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-blue-600 font-bold text-sm sm:text-base">1</span>
                        </div>
                        <h4 className="font-semibold text-sm sm:text-base">Clip Coupons</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Click "Clip Coupon" to save it to your account. No need to remember codes!
                      </p>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-green-600 font-bold text-sm sm:text-base">2</span>
                        </div>
                        <h4 className="font-semibold text-sm sm:text-base">Shop as Usual</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Add eligible items to your cart. Coupons automatically apply at checkout.
                      </p>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-purple-600 font-bold text-sm sm:text-base">3</span>
                        </div>
                        <h4 className="font-semibold text-sm sm:text-base">Save Automatically</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Your savings are automatically applied. No codes to enter!
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Coupon Detail Modal */}
      {selectedCoupon && (
        <CouponDetailModal 
          coupon={selectedCoupon} 
          onClose={() => setSelectedCoupon(null)} 
        />
      )}
    </div>
  );
};

export default CouponsPage;