import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageCircle, Filter, ChevronDown, ChevronUp, Award, CheckCircle, AlertCircle, HelpCircle, TrendingUp, Calendar, User } from "lucide-react";

// =============================================
// DATA STRUCTURE & CONSTANTS
// =============================================

const REVIEWS_DATA = [
  {
    id: "r1",
    customerName: "John D.",
    rating: 5,
    date: "2024-01-15",
    verifiedPurchase: true,
    helpfulCount: 42,
    commentCount: 3,
    title: "Excellent product! Exceeded expectations",
    content: "I've been using this product for a month now and I'm extremely satisfied. The quality is outstanding and it works exactly as described. The shipping was fast and packaging was secure. Highly recommend!",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w-400&h=400&fit=crop",
    ],
    productVariant: "Blue, Large",
    location: "New York, USA",
    customerRank: "Top Reviewer",
    response: {
      sellerName: "TechStore Support",
      date: "2024-01-16",
      content: "Thank you for your wonderful feedback, John! We're thrilled you're enjoying our product. Your satisfaction is our top priority.",
    },
    tags: ["Great Quality", "Fast Shipping", "Accurate Description"],
  },
  {
    id: "r2",
    customerName: "Sarah M.",
    rating: 4,
    date: "2024-01-10",
    verifiedPurchase: true,
    helpfulCount: 18,
    commentCount: 1,
    title: "Good value for money",
    content: "Works well for the price. The setup was straightforward and it does what it's supposed to do. Minor issue: the color is slightly different than shown in pictures, but not a deal breaker.",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
    productVariant: "Red, Medium",
    location: "London, UK",
    customerRank: "Verified Buyer",
    response: null,
    tags: ["Value for Money", "Easy Setup"],
  },
  {
    id: "r3",
    customerName: "Robert Chen",
    rating: 2,
    date: "2024-01-05",
    verifiedPurchase: true,
    helpfulCount: 56,
    commentCount: 7,
    title: "Disappointed with quality",
    content: "Received the product with a scratch on the surface. Customer service was responsive but the replacement process took longer than expected. The product itself works but doesn't feel premium.",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w-400&h=400&fit=crop",
    ],
    productVariant: "Black, Small",
    location: "Toronto, Canada",
    customerRank: "Critical Reviewer",
    response: {
      sellerName: "TechStore Support",
      date: "2024-01-06",
      content: "We apologize for the inconvenience, Robert. We've improved our quality control process based on your feedback. Please contact us for any further assistance.",
    },
    tags: ["Quality Issues", "Slow Replacement"],
  },
  {
    id: "r4",
    customerName: "Maria Garcia",
    rating: 5,
    date: "2023-12-28",
    verifiedPurchase: true,
    helpfulCount: 89,
    commentCount: 12,
    title: "Perfect! Will buy again",
    content: "Absolutely love this product! It arrived earlier than expected and works flawlessly. The attention to detail is impressive. I've already recommended it to my friends.",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    productVariant: "White, Large",
    location: "Madrid, Spain",
    customerRank: "Top 1000 Reviewer",
    response: {
      sellerName: "TechStore Support",
      date: "2023-12-29",
      content: "Thank you for your glowing review, Maria! We're delighted to hear about your positive experience.",
    },
    tags: ["Perfect Condition", "Early Delivery", "Highly Recommend"],
  },
  {
    id: "r5",
    customerName: "Alex Johnson",
    rating: 3,
    date: "2023-12-20",
    verifiedPurchase: true,
    helpfulCount: 7,
    commentCount: 0,
    title: "Average experience",
    content: "The product works but I expected better based on the reviews. The instructions could be clearer. It gets the job done, but I'm not blown away.",
    images: [],
    productVariant: "Green, Medium",
    location: "Sydney, Australia",
    customerRank: "Verified Buyer",
    response: null,
    tags: ["Average", "Instructions Unclear"],
  },
];

const SUMMARY_STATS = {
  averageRating: 4.2,
  totalReviews: 1254,
  ratingDistribution: {
    5: 65,
    4: 20,
    3: 8,
    2: 4,
    1: 3,
  },
  verifiedPurchases: 89,
  answeredQuestions: 42,
  lastMonthReviews: 156,
  trend: "up",
};

const FILTER_OPTIONS = {
  sortBy: [
    { id: "top", label: "Top reviews" },
    { id: "recent", label: "Most recent" },
    { id: "helpful", label: "Most helpful" },
    { id: "critical", label: "Critical" },
  ],
  starRating: [
    { id: "5", label: "5 star", count: 815 },
    { id: "4", label: "4 star", count: 251 },
    { id: "3", label: "3 star", count: 100 },
    { id: "2", label: "2 star", label: "2 star", count: 50 },
    { id: "1", label: "1 star", label: "1 star", count: 38 },
  ],
  withMedia: [
    { id: "all", label: "All reviews" },
    { id: "with-images", label: "With images" },
    { id: "with-videos", label: "With videos" },
  ],
  verifiedOnly: [
    { id: "all", label: "All reviewers" },
    { id: "verified", label: "Verified purchases only" },
  ],
};

// =============================================
// UI COMPONENTS
// =============================================

// Star Rating Component
const StarRating = ({ rating, size = "md", showNumber = false }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

// Rating Distribution Bar
const RatingBar = ({ percentage, count, rating }) => (
  <div className="flex items-center gap-3">
    <button className="text-sm text-blue-600 hover:text-blue-800 w-16 text-left">
      {rating} star
    </button>
    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-yellow-400"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-sm text-gray-600 w-12">{count}</span>
  </div>
);

// Review Card Component
const ReviewCard = ({ review, expanded, onToggle }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);

  const contentPreview = review.content.length > 300 ? review.content.substring(0, 300) + "..." : review.content;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleHelpfulClick = () => {
    if (!helpfulClicked) {
      setHelpfulCount(prev => prev + 1);
      setHelpfulClicked(true);
    }
  };

  return (
    <div className="border-b border-gray-200 py-6">
      {/* Review Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {review.customerRank === "Top Reviewer" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-xs">
                      <Award className="w-3 h-3" /> Top Reviewer
                    </span>
                  )}
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs">
                      <CheckCircle className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden sm:block flex-1" />
            
            <div className="text-sm text-gray-500">
              {formatDate(review.date)}
              {review.location && (
                <span className="ml-2">• {review.location}</span>
              )}
            </div>
          </div>

          {/* Star Rating & Title - Mobile optimized */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <StarRating rating={review.rating} size="md" />
            <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
          </div>

          {/* Variant Info */}
          {review.productVariant && (
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Variant:</span> {review.productVariant}
            </p>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700">
          {showFullContent ? review.content : contentPreview}
          {review.content.length > 300 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              {showFullContent ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      </div>

      {/* Tags */}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Images Grid - Responsive */}
      {review.images.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${review.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
            {review.images.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={img}
                  alt={`Review ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={handleHelpfulClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              helpfulClicked
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Helpful ({helpfulCount})
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">
            <MessageCircle className="w-4 h-4" />
            Comment ({review.commentCount})
          </button>
        </div>

        <button
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide seller response
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {review.response ? "Show seller response" : "Report"}
            </>
          )}
        </button>
      </div>

      {/* Seller Response - Expandable */}
      {expanded && review.response && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-medium text-blue-900">{review.response.sellerName}</span>
                <span className="text-sm text-blue-700">• {formatDate(review.response.date)}</span>
              </div>
              <p className="text-blue-800">{review.response.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

export default function CustomerFeedback() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [filters, setFilters] = useState({
    sortBy: "top",
    starRating: "all",
    withMedia: "all",
    verifiedOnly: "all",
    searchQuery: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Initialize data
  useEffect(() => {
    setTimeout(() => {
      setReviews(REVIEWS_DATA);
      setFilteredReviews(REVIEWS_DATA);
      setLoading(false);
    }, 300);
  }, []);

  // Apply filters
  useEffect(() => {
    if (!reviews.length) return;

    let filtered = [...reviews];

    // Apply star rating filter
    if (filters.starRating !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(filters.starRating));
    }

    // Apply media filter
    if (filters.withMedia === "with-images") {
      filtered = filtered.filter(review => review.images.length > 0);
    }

    // Apply verified purchase filter
    if (filters.verifiedOnly === "verified") {
      filtered = filtered.filter(review => review.verifiedPurchase);
    }

    // Apply search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(query) ||
        review.content.toLowerCase().includes(query) ||
        review.customerName.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "recent":
          return new Date(b.date) - new Date(a.date);
        case "helpful":
          return b.helpfulCount - a.helpfulCount;
        case "critical":
          return a.rating - b.rating;
        default: // top
          return (b.helpfulCount + b.commentCount) - (a.helpfulCount + a.commentCount);
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, filters]);

  const toggleReviewExpand = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Calculate rating percentages
  const calculatePercentage = (count) => {
    const total = Object.values(SUMMARY_STATS.ratingDistribution).reduce((a, b) => a + b, 0);
    return (count / total) * 100;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="lg:col-span-3 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <StarRating rating={SUMMARY_STATS.averageRating} size="lg" showNumber />
              <span className="font-medium">
                {SUMMARY_STATS.averageRating.toFixed(1)} out of 5
              </span>
            </div>
            <span>•</span>
            <span>{SUMMARY_STATS.totalReviews.toLocaleString()} global ratings</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{SUMMARY_STATS.verifiedPurchases}% verified purchases</span>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters & Sorting</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar - Filters & Stats (Hidden on mobile unless toggled) */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{SUMMARY_STATS.averageRating.toFixed(1)}</div>
                    <StarRating rating={Math.round(SUMMARY_STATS.averageRating)} size="sm" />
                    <div className="text-sm text-gray-600 mt-1">{SUMMARY_STATS.totalReviews} ratings</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-1">
                      {Object.entries(SUMMARY_STATS.ratingDistribution).map(([rating, count]) => (
                        <RatingBar
                          key={rating}
                          rating={rating}
                          count={count}
                          percentage={calculatePercentage(count)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Sort by</h3>
                <div className="space-y-2">
                  {FILTER_OPTIONS.sortBy.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleFilterChange("sortBy", option.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filters.sortBy === option.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter by Star Rating */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Filter by rating</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFilterChange("starRating", "all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      filters.starRating === "all"
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All stars
                  </button>
                  {FILTER_OPTIONS.starRating.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleFilterChange("starRating", option.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filters.starRating === option.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StarRating rating={parseInt(option.id)} size="sm" />
                          <span>& above</span>
                        </div>
                        <span className="text-gray-500">{option.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Filters */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Media</h3>
                  {FILTER_OPTIONS.withMedia.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleFilterChange("withMedia", option.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filters.withMedia === option.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Reviewer type</h3>
                  {FILTER_OPTIONS.verifiedOnly.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleFilterChange("verifiedOnly", option.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filters.verifiedOnly === option.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-3">Review Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">Verified purchases</span>
                    <span className="font-medium text-blue-900">{SUMMARY_STATS.verifiedPurchases}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">Answered questions</span>
                    <span className="font-medium text-blue-900">{SUMMARY_STATS.answeredQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">Last month reviews</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-900">{SUMMARY_STATS.lastMonthReviews}</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews List */}
          <div className="flex-1">
            {/* Search & Stats Bar */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="relative flex-1 max-w-lg">
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">
                    Showing {filteredReviews.length} of {reviews.length} reviews
                  </span>
                  <button
                    onClick={() => setFilters({
                      sortBy: "top",
                      starRating: "all",
                      withMedia: "all",
                      verifiedOnly: "all",
                      searchQuery: "",
                    })}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.starRating !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {filters.starRating} stars
                    <button
                      onClick={() => handleFilterChange("starRating", "all")}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.withMedia !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {filters.withMedia === "with-images" ? "With images" : "With videos"}
                    <button
                      onClick={() => handleFilterChange("withMedia", "all")}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.verifiedOnly === "verified" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                    Verified purchases only
                    <button
                      onClick={() => handleFilterChange("verifiedOnly", "all")}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-2">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    expanded={expandedReviews[review.id]}
                    onToggle={() => toggleReviewExpand(review.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search term</p>
                  <button
                    onClick={() => setFilters({
                      sortBy: "top",
                      starRating: "all",
                      withMedia: "all",
                      verifiedOnly: "all",
                      searchQuery: "",
                    })}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {filteredReviews.length > 0 && (
              <div className="mt-8 text-center">
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
                  Load more reviews
                </button>
              </div>
            )}

            {/* Write Review CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Share your experience</h3>
                  <p className="text-gray-600">Help other customers make informed decisions</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                    Ask a question
                  </button>
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Write a review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
              {/* Filter content will scroll here from the sidebar */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}