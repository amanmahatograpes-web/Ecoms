import React, { useState, useMemo, useEffect } from 'react';
import { 
  FiClock, FiFilter, FiChevronRight, FiChevronDown,
  FiSearch, FiShoppingCart, FiHeart, FiShare2, FiEye,
  FiTag, FiPercent, FiGift, FiCalendar, FiStar, FiTrendingUp,
  FiArrowRight, FiChevronLeft, FiChevronUp, FiCheck,
  FiTruck, FiShield, FiRepeat, FiPackage
} from 'react-icons/fi';
import { 
  FaAmazon, FaRegHeart, FaRegStar, FaStarHalfAlt,
  FaFire, FaBolt, FaCrown, FaRegClock, FaRegBell
} from 'react-icons/fa';
import { FiGrid, FiList } from "react-icons/fi";

const DealsPage = () => {
  const [activeDealType, setActiveDealType] = useState('todaysDeals');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const [viewedDeals, setViewedDeals] = useState(new Set());
  const [showCountdown, setShowCountdown] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);

  // Countdown timer for deals
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 35,
    seconds: 12
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds >= 0) {
          return { ...prev, seconds: newSeconds };
        } else {
          const newMinutes = prev.minutes - 1;
          if (newMinutes >= 0) {
            return { hours: prev.hours, minutes: newMinutes, seconds: 59 };
          } else {
            const newHours = prev.hours - 1;
            if (newHours >= 0) {
              return { hours: newHours, minutes: 59, seconds: 59 };
            } else {
              return { hours: 0, minutes: 0, seconds: 0 };
            }
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Deal types
  const dealTypes = [
    { id: 'todaysDeals', name: "Today's Deals", icon: <FaFire />, count: 456 },
    { id: 'lightning', name: "Lightning Deals", icon: <FaBolt />, count: 23 },
    { id: 'prime', name: "Prime Exclusive", icon: <FaCrown />, count: 189 },
    { id: 'upcoming', name: "Upcoming Deals", icon: <FaRegClock />, count: 67 },
    { id: 'ending', name: "Ending Soon", icon: <FiClock />, count: 45 },
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics', count: 145 },
    { id: 'home', name: 'Home & Kitchen', count: 89 },
    { id: 'fashion', name: 'Fashion', count: 234 },
    { id: 'beauty', name: 'Beauty & Health', count: 67 },
    { id: 'sports', name: 'Sports & Outdoors', count: 45 },
    { id: 'toys', name: 'Toys & Games', count: 78 },
    { id: 'books', name: 'Books', count: 56 },
    { id: 'automotive', name: 'Automotive', count: 34 },
    { id: 'grocery', name: 'Grocery', count: 123 },
  ];

  // Sample deals data
  const deals = useMemo(() => [
    {
      id: 1,
      title: "Apple AirPods Pro (2nd Generation)",
      category: 'electronics',
      originalPrice: 249.99,
      dealPrice: 189.99,
      discount: 24,
      isPrime: true,
      isLightning: true,
      lightningTimeLeft: 45,
      rating: 4.7,
      reviewCount: 23456,
      stockLeft: 12,
      image: "https://images.unsplash.com/photo-1591370264374-9a5aef8df17a?w=400&h=400&fit=crop",
      badge: "Bestseller",
      badgeColor: "bg-orange-500",
      delivery: "Tomorrow",
      shipping: "FREE",
      coupon: "SAVE10",
      claimCount: 234,
      maxClaims: 500
    },
    {
      id: 2,
      title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
      category: 'home',
      originalPrice: 99.95,
      dealPrice: 69.99,
      discount: 30,
      isPrime: true,
      isLightning: false,
      rating: 4.6,
      reviewCount: 45678,
      stockLeft: 45,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
      badge: "Amazon's Choice",
      badgeColor: "bg-blue-500",
      delivery: "Today",
      shipping: "FREE",
      claimCount: 567,
      maxClaims: 1000
    },
    {
      id: 3,
      title: "Nike Men's Running Shoes",
      category: 'fashion',
      originalPrice: 129.99,
      dealPrice: 79.99,
      discount: 38,
      isPrime: true,
      isLightning: true,
      lightningTimeLeft: 28,
      rating: 4.5,
      reviewCount: 12345,
      stockLeft: 8,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      badge: "Limited Stock",
      badgeColor: "bg-red-500",
      delivery: "Tomorrow",
      shipping: "FREE",
      claimCount: 89,
      maxClaims: 100
    },
    {
      id: 4,
      title: "Samsung 55-inch 4K Smart TV",
      category: 'electronics',
      originalPrice: 599.99,
      dealPrice: 449.99,
      discount: 25,
      isPrime: true,
      isLightning: false,
      rating: 4.8,
      reviewCount: 34567,
      stockLeft: 23,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
      badge: "Top Deal",
      badgeColor: "bg-green-500",
      delivery: "2 days",
      shipping: "FREE",
      coupon: "TVDEAL50",
      claimCount: 456,
      maxClaims: 1000
    },
    {
      id: 5,
      title: "KitchenAid Stand Mixer",
      category: 'home',
      originalPrice: 429.99,
      dealPrice: 329.99,
      discount: 23,
      isPrime: true,
      isLightning: true,
      lightningTimeLeft: 15,
      rating: 4.9,
      reviewCount: 23456,
      stockLeft: 5,
      image: "https://images.unsplash.com/photo-1560448204-61dcf4e4f1bf?w=400&h=400&fit=crop",
      badge: "Lightning Deal",
      badgeColor: "bg-yellow-500",
      delivery: "Tomorrow",
      shipping: "FREE",
      claimCount: 45,
      maxClaims: 50
    },
    {
      id: 6,
      title: "Dyson V11 Cordless Vacuum",
      category: 'home',
      originalPrice: 699.99,
      dealPrice: 549.99,
      discount: 21,
      isPrime: true,
      isLightning: false,
      rating: 4.7,
      reviewCount: 18976,
      stockLeft: 34,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      badge: "Prime Exclusive",
      badgeColor: "bg-purple-500",
      delivery: "Today",
      shipping: "FREE",
      claimCount: 234,
      maxClaims: 500
    },
    {
      id: 7,
      title: "PlayStation 5 Console",
      category: 'electronics',
      originalPrice: 499.99,
      dealPrice: 449.99,
      discount: 10,
      isPrime: true,
      isLightning: true,
      lightningTimeLeft: 32,
      rating: 4.8,
      reviewCount: 45678,
      stockLeft: 3,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
      badge: "Limited Stock",
      badgeColor: "bg-red-500",
      delivery: "Tomorrow",
      shipping: "FREE",
      claimCount: 12,
      maxClaims: 15
    },
    {
      id: 8,
      title: "Nespresso Vertuo Coffee Machine",
      category: 'home',
      originalPrice: 199.99,
      dealPrice: 149.99,
      discount: 25,
      isPrime: true,
      isLightning: false,
      rating: 4.6,
      reviewCount: 23456,
      stockLeft: 56,
      image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e7?w=400&h=400&fit=crop",
      badge: "Deal of the Day",
      badgeColor: "bg-orange-600",
      delivery: "Today",
      shipping: "FREE",
      coupon: "COFFEE20",
      claimCount: 345,
      maxClaims: 1000
    },
    {
      id: 9,
      title: "Fitbit Charge 5 Fitness Tracker",
      category: 'electronics',
      originalPrice: 179.95,
      dealPrice: 129.99,
      discount: 28,
      isPrime: true,
      isLightning: true,
      lightningTimeLeft: 19,
      rating: 4.4,
      reviewCount: 34567,
      stockLeft: 23,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      badge: "Bestseller",
      badgeColor: "bg-orange-500",
      delivery: "Tomorrow",
      shipping: "FREE",
      claimCount: 167,
      maxClaims: 200
    },
    {
      id: 10,
      title: "LEGO Star Wars Millennium Falcon",
      category: 'toys',
      originalPrice: 159.99,
      dealPrice: 119.99,
      discount: 25,
      isPrime: true,
      isLightning: false,
      rating: 4.9,
      reviewCount: 5678,
      stockLeft: 45,
      image: "https://images.unsplash.com/photo-1594787318281-7d21df6e1fd2?w=400&h=400&fit=crop",
      badge: "Amazon's Choice",
      badgeColor: "bg-blue-500",
      delivery: "2 days",
      shipping: "FREE",
      claimCount: 234,
      maxClaims: 500
    },
    {
      id: 11,
      title: "Oral-B Electric Toothbrush",
      category: 'beauty',
      originalPrice: 89.99,
      dealPrice: 59.99,
      discount: 33,
      isPrime: true,
      isLightning: true,
      lightningTimeLeft: 52,
      rating: 4.5,
      reviewCount: 23456,
      stockLeft: 67,
      image: "https://images.unsplash.com/photo-162179148a5b0-8ccb0b3d0a5a?w=400&h=400&fit=crop",
      badge: "Top Rated",
      badgeColor: "bg-green-500",
      delivery: "Today",
      shipping: "FREE",
      claimCount: 456,
      maxClaims: 1000
    },
    {
      id: 12,
      title: "YETI Rambler Tumbler",
      category: 'sports',
      originalPrice: 34.99,
      dealPrice: 24.99,
      discount: 29,
      isPrime: true,
      isLightning: false,
      rating: 4.8,
      reviewCount: 12345,
      stockLeft: 89,
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop",
      badge: "Prime Exclusive",
      badgeColor: "bg-purple-500",
      delivery: "Tomorrow",
      shipping: "FREE",
      coupon: "COOL15",
      claimCount: 789,
      maxClaims: 1500
    },
  ], []);

  // Featured deals (carousel)
  const featuredDeals = useMemo(() => [
    {
      id: 'featured1',
      title: "Black Friday Early Access",
      description: "Up to 60% off thousands of items",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
      color: "from-purple-600 to-pink-600"
    },
    {
      id: 'featured2',
      title: "Prime Member Deals",
      description: "Exclusive savings just for Prime members",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=400&fit=crop",
      color: "from-blue-600 to-teal-500"
    },
    {
      id: 'featured3',
      title: "Electronics Sale",
      description: "Save on top tech brands",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=400&fit=crop",
      color: "from-orange-500 to-red-500"
    }
  ], []);

  // Filter deals
  const filteredDeals = useMemo(() => {
    let result = [...deals];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(deal => deal.category === selectedCategory);
    }
    
    // Filter by deal type
    if (activeDealType === 'lightning') {
      result = result.filter(deal => deal.isLightning);
    } else if (activeDealType === 'prime') {
      result = result.filter(deal => deal.isPrime);
    } else if (activeDealType === 'ending') {
      result = result.filter(deal => deal.stockLeft < 20);
    }
    
    // Filter by time
    if (timeFilter === 'endingSoon') {
      result = result.filter(deal => deal.isLightning && deal.lightningTimeLeft < 30);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal => 
        deal.title.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query)
      );
    }
    
    // Sorting
    switch (sortBy) {
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'priceLow':
        result.sort((a, b) => a.dealPrice - b.dealPrice);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.dealPrice - a.dealPrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep as is for featured
        break;
    }
    
    return result;
  }, [deals, selectedCategory, activeDealType, sortBy, timeFilter, searchQuery]);

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={`full-${i}`} className="text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  // Deal card component
  const DealCard = ({ deal }) => {
    const isWishlisted = wishlist.has(deal.id);
    const isViewed = viewedDeals.has(deal.id);
    const claimPercentage = (deal.claimCount / deal.maxClaims) * 100;
    
    return (
      <div className={`bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 ${isViewed ? 'border-blue-200' : 'border-gray-200'}`}>
        {/* Badge */}
        {deal.badge && (
          <div className={`${deal.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg absolute top-0 left-0 z-10`}>
            {deal.badge}
          </div>
        )}
        
        {/* Lightning Deal Timer */}
        {deal.isLightning && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-tl-lg rounded-br-lg flex items-center">
            <FiClock className="mr-1" />
            {deal.lightningTimeLeft}m
          </div>
        )}
        
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={deal.image} 
            alt={deal.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          
          {/* Wishlist Button */}
          <button 
            onClick={() => setWishlist(prev => {
              const newSet = new Set(prev);
              if (newSet.has(deal.id)) {
                newSet.delete(deal.id);
              } else {
                newSet.add(deal.id);
              }
              return newSet;
            })}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50"
          >
            {isWishlisted ? (
              <FaRegHeart className="text-red-500 fill-current" />
            ) : (
              <FiHeart className="text-gray-600" />
            )}
          </button>
          
          {/* Discount Badge */}
          <div className="absolute bottom-2 left-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
            {deal.discount}% OFF
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-medium text-gray-900 line-clamp-2 h-12 mb-2 hover:text-blue-600 cursor-pointer">
            {deal.title}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {renderStars(deal.rating)}
            </div>
            <span className="text-sm text-gray-600">{deal.rating}</span>
            <span className="text-sm text-gray-400 ml-1">({deal.reviewCount.toLocaleString()})</span>
          </div>
          
          {/* Pricing */}
          <div className="mb-3">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">${deal.dealPrice}</span>
              <span className="text-sm text-gray-500 line-through ml-2">${deal.originalPrice}</span>
              <span className="ml-2 text-sm font-bold text-red-600">Save ${(deal.originalPrice - deal.dealPrice).toFixed(2)}</span>
            </div>
          </div>
          
          {/* Coupon */}
          {deal.coupon && (
            <div className="mb-3">
              <div className="inline-flex items-center bg-green-50 border border-green-200 rounded px-2 py-1">
                <FiTag className="text-green-600 mr-1" />
                <span className="text-sm text-green-800 font-medium">Use code: {deal.coupon}</span>
              </div>
            </div>
          )}
          
          {/* Stock Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Claimed: {deal.claimCount}/{deal.maxClaims}</span>
              <span>{deal.stockLeft} left</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500"
                style={{ width: `${claimPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Prime Badge */}
          {deal.isPrime && (
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">Prime</span>
              <span className="text-sm text-gray-600 ml-1">FREE Delivery {deal.delivery}</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setViewedDeals(prev => new Set(prev).add(deal.id));
                // Add to cart logic here
              }}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-medium py-2 rounded-lg flex items-center justify-center"
            >
              <FiShoppingCart className="mr-2" />
              Add to Cart
            </button>
            <button 
              onClick={() => setSelectedDeal(deal)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              <FiEye />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Deal detail modal
  const DealDetailModal = ({ deal, onClose }) => {
    if (!deal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${deal.badgeColor} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                {deal.badge}
              </div>
              {deal.isLightning && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <FaBolt className="mr-1" />
                  Lightning Deal
                </div>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div>
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={deal.image} 
                    alt={deal.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
                
                {/* Thumbnails */}
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((thumb) => (
                    <div key={thumb} className="w-20 h-20 border rounded-lg overflow-hidden cursor-pointer">
                      <img 
                        src={deal.image} 
                        alt={`Thumbnail ${thumb}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Column - Details */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{deal.title}</h1>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-3">
                    {renderStars(deal.rating)}
                  </div>
                  <span className="text-gray-900 font-medium mr-2">{deal.rating}</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {deal.reviewCount.toLocaleString()} ratings
                  </span>
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl font-bold text-gray-900">${deal.dealPrice}</span>
                    <span className="text-lg text-gray-500 line-through ml-3">${deal.originalPrice}</span>
                    <span className="ml-3 bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
                      Save ${(deal.originalPrice - deal.dealPrice).toFixed(2)} ({deal.discount}%)
                    </span>
                  </div>
                  
                  {deal.coupon && (
                    <div className="flex items-center mb-3">
                      <div className="border-2 border-green-500 rounded px-3 py-1">
                        <span className="text-green-800 font-bold">Save ${deal.coupon.replace(/[^0-9]/g, '')} with code {deal.coupon}</span>
                      </div>
                      <span className="text-sm text-gray-600 ml-2">Terms apply</span>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <p>List Price: <span className="line-through">${deal.originalPrice}</span></p>
                    <p>Deal Price: <span className="font-bold text-lg">${deal.dealPrice}</span></p>
                    <p>You Save: <span className="text-red-600 font-bold">${(deal.originalPrice - deal.dealPrice).toFixed(2)} ({deal.discount}%)</span></p>
                  </div>
                </div>
                
                {/* Lightning Deal Info */}
                {deal.isLightning && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FaBolt className="text-yellow-500 mr-2" />
                        <span className="font-bold">Lightning Deal</span>
                      </div>
                      <div className="flex items-center text-red-600">
                        <FiClock className="mr-2" />
                        <span className="font-bold">{deal.lightningTimeLeft} min left</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Claimed: {deal.claimCount}/{deal.maxClaims}</span>
                        <span>{deal.stockLeft} left</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                          style={{ width: `${(deal.claimCount / deal.maxClaims) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Limited quantity at this price. Claim yours before it's gone!
                    </div>
                  </div>
                )}
                
                {/* Stock Status */}
                <div className="mb-6">
                  {deal.stockLeft <= 5 ? (
                    <div className="text-red-600 font-medium flex items-center">
                      <FiClock className="mr-2" />
                      Only {deal.stockLeft} left in stock - order soon
                    </div>
                  ) : (
                    <div className="text-green-600 font-medium">
                      In Stock
                    </div>
                  )}
                </div>
                
                {/* Shipping */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center">
                    <FiTruck className="text-gray-500 mr-3" />
                    <div>
                      <div className="font-medium">FREE delivery {deal.delivery}</div>
                      <div className="text-sm text-gray-600">Or fastest delivery Tomorrow</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiPackage className="text-gray-500 mr-3" />
                    <div>
                      <div className="font-medium">Free Returns</div>
                      <div className="text-sm text-gray-600">30-day return policy</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiShield className="text-gray-500 mr-3" />
                    <div>
                      <div className="font-medium">Amazon's Choice</div>
                      <div className="text-sm text-gray-600">Highly rated and well-priced</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 rounded-lg text-lg">
                    Add to Cart
                  </button>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg text-lg">
                    Buy Now
                  </button>
                  <div className="flex space-x-2">
                    <button className="flex-1 border border-gray-300 rounded-lg py-2 flex items-center justify-center hover:bg-gray-50">
                      <FiHeart className="mr-2" />
                      Add to Wish List
                    </button>
                    <button className="flex-1 border border-gray-300 rounded-lg py-2 flex items-center justify-center hover:bg-gray-50">
                      <FiShare2 className="mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <FaFire className="mr-2" />
              <span className="font-bold text-lg">Today's Deals</span>
            </div>
            
            {/* Countdown Timer */}
            {showCountdown && (
              <div className="flex items-center bg-black bg-opacity-20 rounded-lg px-3 py-1">
                <FiClock className="mr-2" />
                <span className="mr-2">Deals end in:</span>
                <div className="flex items-center space-x-1">
                  <div className="bg-white text-gray-900 rounded px-2 py-1 font-bold min-w-[2rem] text-center">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <span>:</span>
                  <div className="bg-white text-gray-900 rounded px-2 py-1 font-bold min-w-[2rem] text-center">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <span>:</span>
                  <div className="bg-white text-gray-900 rounded px-2 py-1 font-bold min-w-[2rem] text-center">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                </div>
                <button 
                  onClick={() => setShowCountdown(false)}
                  className="ml-3 text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Featured Deals Carousel */}
        <div className="mb-8">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-64 md:h-80">
              {featuredDeals.map((deal, index) => (
                <div 
                  key={deal.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${deal.color} opacity-90`}></div>
                  <img 
                    src={deal.image} 
                    alt={deal.title}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                  <div className="absolute inset-0 flex items-center p-8 md:p-12">
                    <div className="text-white max-w-lg">
                      <h2 className="text-3xl md:text-4xl font-bold mb-2">{deal.title}</h2>
                      <p className="text-xl mb-6 opacity-90">{deal.description}</p>
                      <button className="bg-white text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 flex items-center">
                        Shop Now <FiArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Carousel Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredDeals.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deal Types Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {dealTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveDealType(type.id)}
                className={`flex items-center px-4 py-3 rounded-lg whitespace-nowrap ${activeDealType === type.id 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                <span className="mr-2 text-lg">{type.icon}</span>
                <span className="font-medium">{type.name}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeDealType === type.id 
                  ? 'bg-white text-orange-600' 
                  : 'bg-gray-100 text-gray-600'
                }`}>
                  {type.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <FiFilter className="mr-2" />
                Filters
              </h3>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${selectedCategory === category.id 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      {category.count && (
                        <span className="text-sm text-gray-500">{category.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort By */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                <div className="space-y-2">
                  {[
                    { id: 'featured', label: 'Featured' },
                    { id: 'discount', label: 'Discount %' },
                    { id: 'priceLow', label: 'Price: Low to High' },
                    { id: 'priceHigh', label: 'Price: High to Low' },
                    { id: 'rating', label: 'Customer Rating' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${sortBy === option.id 
                        ? 'bg-orange-50 text-orange-600 font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Time Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Time Remaining</h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Deals' },
                    { id: 'endingSoon', label: 'Ending Soon (< 30 min)' },
                    { id: 'new', label: 'New Today' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTimeFilter(option.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${timeFilter === option.id 
                        ? 'bg-orange-50 text-orange-600 font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under $25', count: 123 },
                    { label: '$25 - $50', count: 234 },
                    { label: '$50 - $100', count: 345 },
                    { label: '$100 - $200', count: 456 },
                    { label: 'Over $200', count: 567 }
                  ].map((range, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      <span>{range.label}</span>
                      <span className="text-sm text-gray-500">{range.count}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Apply Filters Button */}
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-3 rounded-lg hover:opacity-90">
                Apply Filters
              </button>
            </div>
            
            {/* Deal Alert */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <FaRegBell className="text-blue-600 mr-3 text-xl" />
                <h4 className="font-bold text-gray-900">Get Deal Alerts</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Never miss a deal! Get notified when items you want go on sale.
              </p>
              <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700">
                Set Up Alerts
              </button>
            </div>
          </div>
          
          {/* Deals Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeDealType === 'todaysDeals' ? "Today's Best Deals" : 
                     activeDealType === 'lightning' ? "Lightning Deals" :
                     activeDealType === 'prime' ? "Prime Exclusive Deals" :
                     activeDealType === 'upcoming' ? "Upcoming Deals" : "Ending Soon"}
                  </h2>
                  <p className="text-gray-600">
                    Showing {filteredDeals.length} deals
                    {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <FiGrid />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <FiList />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Deals Grid */}
            {filteredDeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <FiSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No deals found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setTimeFilter('all');
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90"
                >
                  Clear All Filters
                </button>
              </div>
            )}
            
            {/* Load More Button */}
            {filteredDeals.length > 0 && (
              <div className="mt-8 text-center">
                <button className="bg-white border border-gray-300 hover:bg-gray-50 font-medium px-8 py-3 rounded-lg inline-flex items-center">
                  Load More Deals
                  <FiChevronDown className="ml-2" />
                </button>
              </div>
            )}
            
            {/* Deal Tips */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiPercent className="mr-2" />
                Deal Shopping Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <FaBolt className="text-blue-600" />
                    </div>
                    <h4 className="font-semibold">Lightning Deals</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Limited-time offers with limited quantities. Act fast before they sell out!
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <FaCrown className="text-purple-600" />
                    </div>
                    <h4 className="font-semibold">Prime Exclusive</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Special deals available only to Amazon Prime members.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <FiClock className="text-red-600" />
                    </div>
                    <h4 className="font-semibold">Ending Soon</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Deals that are about to expire. Last chance to save!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Deal Detail Modal */}
      {selectedDeal && (
        <DealDetailModal 
          deal={selectedDeal} 
          onClose={() => setSelectedDeal(null)} 
        />
      )}
    </div>
  );
};

export default DealsPage;