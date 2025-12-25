import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, FaUserPlus, FaShoppingCart, FaDollarSign,
  FaArrowUp, FaArrowDown, FaCheckCircle, FaClock, FaCalendarAlt, 
  FaLightbulb, FaRocket, FaBullseye, FaUsers,
  FaSpinner, FaExclamationCircle, FaSync, FaFilter,
  FaAmazon, FaShoppingBag, FaGlobe, FaMobileAlt,
  FaStar, FaTruck, FaShieldAlt, FaCreditCard
} from 'react-icons/fa';
import { SiFlipkart } from 'react-icons/si';

// Enhanced Mock API Service for E-commerce
const ecommerceApiService = {
  // Simulate API delay
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Fetch marketplace comparison metrics
  async fetchMarketplaceComparison() {
    await this.delay(600);
    
    return {
      success: true,
      data: {
        amazon: {
          name: 'Amazon',
          icon: <FaAmazon className="text-orange-500" />,
          metrics: {
            marketShare: 42.3,
            yoyGrowth: 18.5,
            avgOrderValue: 52.89,
            sellerCount: 8500000,
            fulfillmentSpeed: '1.2 days',
            customerRating: 4.7
          },
          strengths: ['Fast Delivery', 'Prime Members', 'Trust Brand', 'Wide Selection']
        },
        flipkart: {
          name: 'Flipkart',
          icon: <SiFlipkart className="text-blue-500" />,
          metrics: {
            marketShare: 31.8,
            yoyGrowth: 22.3,
            avgOrderValue: 45.67,
            sellerCount: 5200000,
            fulfillmentSpeed: '2.1 days',
            customerRating: 4.5
          },
          strengths: ['Indian Focus', 'Big Billion Days', 'Localized Products', 'Mobile First']
        },
        competition: {
          marketShare: 25.9,
          metrics: {
            amazonVsFlipkart: {
              revenueDifference: 28.4, // in percentage
              customerBaseDifference: 32.1,
              growthRateDifference: -3.8
            }
          }
        }
      }
    };
  },

  // Fetch growth metrics by timeframe
  async fetchGrowthMetrics(timeFrame = 'monthly') {
    await this.delay(800);
    
    const metricsByTimeframe = {
      daily: {
        revenueGrowth: 2.1,
        userAcquisition: 1.2,
        conversionRate: 3.2,
        customerRetention: 92.3,
        cartAbandonment: 65.8,
        averageOrderValue: 42.89,
        totalOrders: 12450,
        newCustomers: 852,
        returningCustomers: 3450,
        mobileOrders: 68.5,
        desktopOrders: 31.5
      },
      weekly: {
        revenueGrowth: 8.5,
        userAcquisition: 4.3,
        conversionRate: 3.3,
        customerRetention: 88.7,
        cartAbandonment: 66.5,
        averageOrderValue: 44.12,
        totalOrders: 87250,
        newCustomers: 5964,
        returningCustomers: 24150,
        mobileOrders: 70.2,
        desktopOrders: 29.8
      },
      monthly: {
        revenueGrowth: 15.2,
        userAcquisition: 8.5,
        conversionRate: 3.4,
        customerRetention: 85.6,
        cartAbandonment: 67.3,
        averageOrderValue: 45.67,
        totalOrders: 350000,
        newCustomers: 23850,
        returningCustomers: 96600,
        mobileOrders: 72.5,
        desktopOrders: 27.5
      },
      quarterly: {
        revenueGrowth: 28.7,
        userAcquisition: 15.2,
        conversionRate: 3.6,
        customerRetention: 82.4,
        cartAbandonment: 68.1,
        averageOrderValue: 48.32,
        totalOrders: 1050000,
        newCustomers: 71550,
        returningCustomers: 289800,
        mobileOrders: 74.3,
        desktopOrders: 25.7
      },
      yearly: {
        revenueGrowth: 65.4,
        userAcquisition: 42.8,
        conversionRate: 4.1,
        customerRetention: 78.9,
        cartAbandonment: 69.5,
        averageOrderValue: 52.76,
        totalOrders: 4200000,
        newCustomers: 286200,
        returningCustomers: 1159200,
        mobileOrders: 76.8,
        desktopOrders: 23.2
      }
    };

    return {
      success: true,
      data: metricsByTimeframe[timeFrame] || metricsByTimeframe.monthly,
      timeframe: timeFrame,
      lastUpdated: new Date().toISOString()
    };
  },

  // Fetch growth opportunities with Amazon/Flipkart insights
  async fetchGrowthOpportunities(status = 'all') {
    await this.delay(600);
    
    const allOpportunities = [
      {
        id: 1,
        title: "Personalized Recommendations",
        description: "Implement AI-driven product recommendations like Amazon",
        potentialImpact: "Increase sales by 15-20%",
        effort: "Medium",
        timeline: "1-2 months",
        status: "pending",
        progress: 30,
        priority: "high",
        estimatedROI: 150000,
        inspiredBy: "Amazon",
        category: "AI/ML",
        features: ["Collaborative filtering", "Real-time recommendations", "Personalized emails"]
      },
      {
        id: 2,
        title: "Mobile App Optimization",
        description: "Improve mobile UX like Flipkart's app-first approach",
        potentialImpact: "Boost mobile conversion by 25%",
        effort: "High",
        timeline: "3-4 months",
        status: "in-progress",
        progress: 65,
        priority: "high",
        estimatedROI: 95000,
        inspiredBy: "Flipkart",
        category: "Mobile",
        features: ["One-tap checkout", "AR product preview", "Voice search"]
      },
      {
        id: 3,
        title: "Prime-like Subscription",
        description: "Introduce Amazon Prime-style subscription model",
        potentialImpact: "Increase customer lifetime value by 40%",
        effort: "High",
        timeline: "4-6 months",
        status: "planned",
        progress: 10,
        priority: "medium",
        estimatedROI: 250000,
        inspiredBy: "Amazon",
        category: "Subscription",
        features: ["Free delivery", "Early access to sales", "Exclusive content"]
      },
      {
        id: 4,
        title: "Social Commerce Integration",
        description: "Add social shopping features like Flipkart Video",
        potentialImpact: "Acquire 10K new users monthly",
        effort: "Medium",
        timeline: "2-3 months",
        status: "completed",
        progress: 100,
        priority: "medium",
        estimatedROI: 75000,
        inspiredBy: "Flipkart",
        category: "Social",
        features: ["Live streaming", "Social sharing", "Influencer collaborations"]
      },
      {
        id: 5,
        title: "International Expansion",
        description: "Expand to new markets following Amazon's strategy",
        potentialImpact: "Increase revenue by 50%",
        effort: "Very High",
        timeline: "6-12 months",
        status: "planned",
        progress: 5,
        priority: "low",
        estimatedROI: 500000,
        inspiredBy: "Amazon",
        category: "Expansion",
        features: ["Localized content", "Regional payment", "Local warehouses"]
      },
      {
        id: 6,
        title: "Voice Search Integration",
        description: "Implement voice-enabled search like Amazon Alexa",
        potentialImpact: "Improve mobile engagement by 30%",
        effort: "Medium",
        timeline: "2-3 months",
        status: "pending",
        progress: 15,
        priority: "medium",
        estimatedROI: 60000,
        inspiredBy: "Amazon",
        category: "Voice",
        features: ["Voice search", "Voice ordering", "Voice assistance"]
      },
      {
        id: 7,
        title: "Big Billion Days Clone",
        description: "Create mega sales events like Flipkart's BBD",
        potentialImpact: "Generate $1M+ in sales",
        effort: "Medium",
        timeline: "2 months",
        status: "in-progress",
        progress: 45,
        priority: "high",
        estimatedROI: 350000,
        inspiredBy: "Flipkart",
        category: "Sales",
        features: ["Flash sales", "Early bird deals", "Gamification"]
      },
      {
        id: 8,
        title: "FBA-style Fulfillment",
        description: "Launch Fulfillment By Amazon-like service",
        potentialImpact: "Reduce delivery time by 60%",
        effort: "High",
        timeline: "5-7 months",
        status: "planned",
        progress: 20,
        priority: "medium",
        estimatedROI: 180000,
        inspiredBy: "Amazon",
        category: "Logistics",
        features: ["Warehouse network", "Fast shipping", "Returns management"]
      }
    ];

    const filtered = status === 'all' 
      ? allOpportunities 
      : allOpportunities.filter(opp => opp.status === status);

    return {
      success: true,
      data: filtered,
      total: filtered.length,
      filters: { status }
    };
  },

  // Fetch revenue trend data with marketplace comparison
  async fetchRevenueTrend(timeFrame = 'monthly', marketplace = 'all') {
    await this.delay(400);
    
    const baseTrends = {
      daily: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        revenue: 20 + Math.random() * 15,
        target: 25 + Math.random() * 10,
        amazon: 35 + Math.random() * 20,
        flipkart: 25 + Math.random() * 15
      })),
      weekly: Array.from({ length: 4 }, (_, i) => ({
        week: `Week ${i + 1}`,
        revenue: 80 + Math.random() * 40,
        target: 85 + Math.random() * 30,
        amazon: 120 + Math.random() * 60,
        flipkart: 90 + Math.random() * 50
      })),
      monthly: [
        { month: 'Jan', revenue: 65, target: 60, amazon: 95, flipkart: 70 },
        { month: 'Feb', revenue: 72, target: 65, amazon: 105, flipkart: 80 },
        { month: 'Mar', revenue: 81, target: 70, amazon: 115, flipkart: 85 },
        { month: 'Apr', revenue: 89, target: 75, amazon: 125, flipkart: 90 },
        { month: 'May', revenue: 95, target: 80, amazon: 135, flipkart: 95 },
        { month: 'Jun', revenue: 105, target: 85, amazon: 145, flipkart: 100 },
      ],
      quarterly: [
        { quarter: 'Q1', revenue: 218, target: 195, amazon: 315, flipkart: 235 },
        { quarter: 'Q2', revenue: 289, target: 240, amazon: 380, flipkart: 285 },
        { quarter: 'Q3', revenue: 315, target: 280, amazon: 420, flipkart: 315 },
        { quarter: 'Q4', revenue: 420, target: 350, amazon: 520, flipkart: 400 },
      ],
      yearly: [
        { year: '2020', revenue: 980, target: 900, amazon: 1450, flipkart: 1100 },
        { year: '2021', revenue: 1250, target: 1100, amazon: 1800, flipkart: 1350 },
        { year: '2022', revenue: 1650, target: 1400, amazon: 2200, flipkart: 1650 },
        { year: '2023', revenue: 2150, target: 1800, amazon: 2800, flipkart: 2000 },
      ]
    };

    const trendData = baseTrends[timeFrame] || baseTrends.monthly;
    
    let filteredData = trendData;
    if (marketplace === 'amazon') {
      filteredData = trendData.map(item => ({ ...item, revenue: item.amazon }));
    } else if (marketplace === 'flipkart') {
      filteredData = trendData.map(item => ({ ...item, revenue: item.flipkart }));
    }

    return {
      success: true,
      data: filteredData,
      timeframe: timeFrame,
      marketplace
    };
  },

  // Fetch traffic sources with device breakdown
  async fetchTrafficSources() {
    await this.delay(300);
    
    return {
      success: true,
      data: {
        channels: [
          { name: 'Organic Search', value: 40, color: '#3B82F6' },
          { name: 'Direct', value: 25, color: '#10B981' },
          { name: 'Social Media', value: 15, color: '#8B5CF6' },
          { name: 'Email', value: 10, color: '#F59E0B' },
          { name: 'Referral', value: 10, color: '#EF4444' },
        ],
        devices: [
          { name: 'Mobile', value: 72, color: '#8B5CF6' },
          { name: 'Desktop', value: 24, color: '#3B82F6' },
          { name: 'Tablet', value: 4, color: '#10B981' },
        ],
        comparison: {
          amazon: { mobile: 68, desktop: 30, tablet: 2 },
          flipkart: { mobile: 78, desktop: 20, tablet: 2 }
        }
      },
      lastUpdated: new Date().toISOString()
    };
  },

  // Fetch top products performance
  async fetchTopProducts() {
    await this.delay(500);
    
    return {
      success: true,
      data: [
        {
          id: 1,
          name: "Wireless Earbuds Pro",
          category: "Electronics",
          revenue: 125000,
          unitsSold: 2500,
          growth: 45.2,
          rating: 4.7,
          marketplace: "Both"
        },
        {
          id: 2,
          name: "Smart Fitness Watch",
          category: "Wearables",
          revenue: 98000,
          unitsSold: 1400,
          growth: 32.8,
          rating: 4.5,
          marketplace: "Amazon"
        },
        {
          id: 3,
          name: "Organic Cotton T-Shirts",
          category: "Fashion",
          revenue: 75600,
          unitsSold: 4200,
          growth: 28.4,
          rating: 4.3,
          marketplace: "Flipkart"
        },
        {
          id: 4,
          name: "Coffee Maker Deluxe",
          category: "Home Appliances",
          revenue: 64500,
          unitsSold: 860,
          growth: 52.1,
          rating: 4.8,
          marketplace: "Both"
        },
        {
          id: 5,
          name: "Gaming Laptop",
          category: "Computers",
          revenue: 235000,
          unitsSold: 235,
          growth: 68.7,
          rating: 4.6,
          marketplace: "Amazon"
        }
      ]
    };
  },

  // Update opportunity status
  async updateOpportunityStatus(id, status, progress) {
    await this.delay(500);
    
    return {
      success: true,
      message: `Opportunity ${id} updated successfully`,
      data: { id, status, progress, updatedAt: new Date().toISOString() }
    };
  },

  // Generate comprehensive growth report
  async generateGrowthReport(type = 'full') {
    await this.delay(1500);
    
    const reports = {
      full: {
        title: "Comprehensive Growth Analysis Report",
        size: '3.2 MB',
        pages: 45,
        includes: ['Market Analysis', 'Competitor Benchmark', 'Growth Opportunities', 'Action Plan']
      },
      quick: {
        title: "Executive Summary Report",
        size: '1.1 MB',
        pages: 12,
        includes: ['Key Metrics', 'Top Opportunities', 'Recommendations']
      },
      competitor: {
        title: "Competitor Analysis Report",
        size: '2.4 MB',
        pages: 32,
        includes: ['Amazon Analysis', 'Flipkart Analysis', 'Market Comparison', 'Gap Analysis']
      }
    };

    return {
      success: true,
      data: {
        downloadUrl: `https://api.ecommerce.com/reports/${type}-growth-${Date.now()}.pdf`,
        generatedAt: new Date().toISOString(),
        ...reports[type],
        format: 'PDF'
      }
    };
  }
};

const GrowthOpportunities = () => {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState({
    metrics: false,
    opportunities: false,
    revenue: false,
    traffic: false,
    marketplace: false,
    products: false
  });
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    metrics: null,
    growthAreas: [],
    revenueTrend: [],
    trafficSources: null,
    marketplace: null,
    topProducts: []
  });

  // Fetch all data on component mount and timeframe change
  useEffect(() => {
    fetchAllData();
  }, [timeFrame, activeFilter]);

  // Function to fetch all data
  const fetchAllData = async () => {
    setError(null);
    
    try {
      // Fetch marketplace comparison
      setLoading(prev => ({ ...prev, marketplace: true }));
      const marketplaceResponse = await ecommerceApiService.fetchMarketplaceComparison();
      if (marketplaceResponse.success) {
        setData(prev => ({ ...prev, marketplace: marketplaceResponse.data }));
      }

      // Fetch metrics
      setLoading(prev => ({ ...prev, metrics: true }));
      const metricsResponse = await ecommerceApiService.fetchGrowthMetrics(timeFrame);
      if (metricsResponse.success) {
        setData(prev => ({ ...prev, metrics: metricsResponse.data }));
      }

      // Fetch opportunities
      setLoading(prev => ({ ...prev, opportunities: true }));
      const opportunitiesResponse = await ecommerceApiService.fetchGrowthOpportunities(activeFilter);
      if (opportunitiesResponse.success) {
        setData(prev => ({ ...prev, growthAreas: opportunitiesResponse.data }));
      }

      // Fetch revenue trend
      setLoading(prev => ({ ...prev, revenue: true }));
      const revenueResponse = await ecommerceApiService.fetchRevenueTrend(timeFrame, selectedMarketplace);
      if (revenueResponse.success) {
        setData(prev => ({ ...prev, revenueTrend: revenueResponse.data }));
      }

      // Fetch traffic sources
      setLoading(prev => ({ ...prev, traffic: true }));
      const trafficResponse = await ecommerceApiService.fetchTrafficSources();
      if (trafficResponse.success) {
        setData(prev => ({ ...prev, trafficSources: trafficResponse.data }));
      }

      // Fetch top products
      setLoading(prev => ({ ...prev, products: true }));
      const productsResponse = await ecommerceApiService.fetchTopProducts();
      if (productsResponse.success) {
        setData(prev => ({ ...prev, topProducts: productsResponse.data }));
      }

    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading({
        metrics: false,
        opportunities: false,
        revenue: false,
        traffic: false,
        marketplace: false,
        products: false
      });
    }
  };

  // Handle timeframe change
  const handleTimeFrameChange = (period) => {
    setTimeFrame(period);
  };

  // Handle marketplace filter
  const handleMarketplaceFilter = (marketplace) => {
    setSelectedMarketplace(marketplace);
    // Re-fetch revenue trend with new filter
    ecommerceApiService.fetchRevenueTrend(timeFrame, marketplace)
      .then(response => {
        if (response.success) {
          setData(prev => ({ ...prev, revenueTrend: response.data }));
        }
      });
  };

  // Handle opportunity filter
  const handleOpportunityFilter = (filter) => {
    setActiveFilter(filter);
  };

  // Handle refresh data
  const handleRefresh = () => {
    fetchAllData();
  };

  // Handle opportunity status update
  const handleUpdateOpportunity = async (id, status, progress) => {
    try {
      const response = await ecommerceApiService.updateOpportunityStatus(id, status, progress);
      if (response.success) {
        // Update local state
        setData(prev => ({
          ...prev,
          growthAreas: prev.growthAreas.map(opp => 
            opp.id === id ? { ...opp, status, progress } : opp
          )
        }));
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  // Handle download report
  const handleDownloadReport = async (type = 'full') => {
    try {
      const response = await ecommerceApiService.generateGrowthReport(type);
      if (response.success) {
        alert(`Report generated successfully!\nTitle: ${response.data.title}\nSize: ${response.data.size}`);
      }
    } catch (err) {
      console.error('Report generation failed:', err);
    }
  };

  // Enhanced metrics cards with marketplace context
  const metricsCards = data.metrics ? [
    {
      title: "Revenue Growth",
      value: `${data.metrics.revenueGrowth.toFixed(1)}%`,
      icon: <FaChartLine />,
      trend: data.metrics.revenueGrowth > 10 ? "up" : "down",
      change: data.metrics.revenueGrowth > 10 ? "+2.3%" : "-1.2%",
      color: "from-blue-500 to-blue-600",
      comparison: data.marketplace ? {
        amazon: `${data.marketplace.amazon.metrics.yoyGrowth}%`,
        flipkart: `${data.marketplace.flipkart.metrics.yoyGrowth}%`
      } : null
    },
    {
      title: "User Acquisition",
      value: `${data.metrics.userAcquisition}K`,
      icon: <FaUserPlus />,
      trend: "up",
      change: "+5.1%",
      color: "from-green-500 to-green-600",
      comparison: data.marketplace ? {
        amazon: "15.8K",
        flipkart: "12.4K"
      } : null
    },
    {
      title: "Conversion Rate",
      value: `${data.metrics.conversionRate.toFixed(1)}%`,
      icon: <FaShoppingCart />,
      trend: data.metrics.conversionRate > 3.5 ? "up" : "down",
      change: data.metrics.conversionRate > 3.5 ? "+0.4%" : "-0.4%",
      color: "from-purple-500 to-purple-600",
      comparison: data.marketplace ? {
        amazon: "4.1%",
        flipkart: "3.6%"
      } : null
    },
    {
      title: "Avg Order Value",
      value: `$${data.metrics.averageOrderValue.toFixed(2)}`,
      icon: <FaDollarSign />,
      trend: "up",
      change: "+$3.21",
      color: "from-orange-500 to-orange-600",
      comparison: data.marketplace ? {
        amazon: `$${data.marketplace.amazon.metrics.avgOrderValue}`,
        flipkart: `$${data.marketplace.flipkart.metrics.avgOrderValue}`
      } : null
    }
  ] : [];

  // Custom Chart Component with marketplace comparison
  const RevenueChart = ({ data: chartData }) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          <FaSpinner className="animate-spin text-gray-400 text-2xl" />
        </div>
      );
    }

    const maxRevenue = Math.max(
      ...chartData.map(r => r.revenue),
      ...chartData.map(r => r.target),
      ...(selectedMarketplace === 'all' ? chartData.map(r => r.amazon || 0) : []),
      ...(selectedMarketplace === 'all' ? chartData.map(r => r.flipkart || 0) : [])
    );
    
    const xAxisKey = chartData[0].month ? 'month' : 
                    chartData[0].week ? 'week' : 
                    chartData[0].quarter ? 'quarter' : 'year';
    
    return (
      <div className="relative h-64 w-full">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="border-t border-gray-200"></div>
          ))}
        </div>
        
        {/* Chart content */}
        <div className="relative h-full flex items-end space-x-2 px-4">
          {chartData.map((item, index) => {
            const revenueHeight = (item.revenue / maxRevenue) * 100;
            const targetHeight = (item.target / maxRevenue) * 100;
            const amazonHeight = selectedMarketplace === 'all' ? (item.amazon / maxRevenue) * 100 : 0;
            const flipkartHeight = selectedMarketplace === 'all' ? (item.flipkart / maxRevenue) * 100 : 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center h-48">
                  {/* Target line */}
                  <div 
                    className="absolute w-8 border-2 border-green-400 border-dashed rounded-t"
                    style={{ height: `${targetHeight}%`, bottom: '0' }}
                  ></div>
                  
                  {/* Amazon bar (if comparing all) */}
                  {selectedMarketplace === 'all' && (
                    <div 
                      className="absolute w-6 bg-gradient-to-t from-orange-500 to-orange-600 rounded-t"
                      style={{ 
                        height: `${amazonHeight}%`, 
                        bottom: '0',
                        left: '25%'
                      }}
                    ></div>
                  )}
                  
                  {/* Your Revenue bar */}
                  <div 
                    className="absolute w-8 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t"
                    style={{ height: `${revenueHeight}%`, bottom: '0' }}
                  ></div>
                  
                  {/* Flipkart bar (if comparing all) */}
                  {selectedMarketplace === 'all' && (
                    <div 
                      className="absolute w-6 bg-gradient-to-t from-blue-400 to-blue-500 rounded-t"
                      style={{ 
                        height: `${flipkartHeight}%`, 
                        bottom: '0',
                        right: '25%'
                      }}
                    ></div>
                  )}
                </div>
                
                <div className="mt-2 text-xs text-gray-600 font-medium">
                  {item[xAxisKey]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Custom Pie Chart Component for traffic sources
  const TrafficPieChart = ({ data: pieData }) => {
    if (!pieData || !pieData.channels) {
      return (
        <div className="w-64 h-64 mx-auto flex items-center justify-center">
          <FaSpinner className="animate-spin text-gray-400 text-2xl" />
        </div>
      );
    }

    const total = pieData.channels.reduce((sum, source) => sum + source.value, 0);
    let cumulativeAngle = 0;
    
    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {pieData.channels.map((source, index) => {
            const percentage = (source.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = cumulativeAngle;
            cumulativeAngle += angle;
            
            const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={source.color}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
          <circle cx="50" cy="50" r="15" fill="white" />
        </svg>
      </div>
    );
  };

  // Loading skeleton for metrics cards
  const MetricsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-gray-200"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">E-commerce Growth Dashboard</h1>
              <p className="text-gray-600 mt-2">Benchmarked against Amazon & Flipkart</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button 
                onClick={handleRefresh}
                disabled={Object.values(loading).some(l => l)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSync className={`text-sm ${Object.values(loading).some(l => l) ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <button 
                onClick={() => handleDownloadReport('full')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <FaRocket className="text-sm" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Timeframe Selector */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
              {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => handleTimeFrameChange(period)}
                  disabled={loading.metrics}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    timeFrame === period 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Marketplace Filter for Charts */}
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
              <span className="px-3 py-2 text-sm text-gray-500">Compare:</span>
              {['all', 'amazon', 'flipkart'].map((marketplace) => (
                <button
                  key={marketplace}
                  onClick={() => handleMarketplaceFilter(marketplace)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${
                    selectedMarketplace === marketplace 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {marketplace === 'all' ? 'All' : marketplace}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {data.metrics && `Data as of ${new Date().toLocaleDateString()}`}
          </div>
        </div>

        {/* Marketplace Comparison Card */}
        {data.marketplace && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaGlobe className="text-blue-500" />
                Marketplace Benchmark
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Amazon Card */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FaAmazon className="text-3xl text-orange-500" />
                      <div>
                        <h4 className="font-bold text-gray-900">Amazon</h4>
                        <p className="text-sm text-gray-500">Global Leader</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {data.marketplace.amazon.metrics.marketShare}% Market Share
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">YoY Growth</span>
                      <span className="font-bold text-green-600">+{data.marketplace.amazon.metrics.yoyGrowth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Order Value</span>
                      <span className="font-bold">${data.marketplace.amazon.metrics.avgOrderValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fulfillment Speed</span>
                      <span className="font-bold">{data.marketplace.amazon.metrics.fulfillmentSpeed}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Key Strengths:</div>
                    <div className="flex flex-wrap gap-2">
                      {data.marketplace.amazon.strengths.map((strength, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Your Business Card */}
                <div className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <FaShoppingBag className="text-white text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Your Business</h4>
                        <p className="text-sm text-gray-500">vs Competition</p>
                      </div>
                    </div>
                    {data.metrics && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {((data.metrics.revenueGrowth / data.marketplace.amazon.metrics.yoyGrowth) * 100).toFixed(1)}% of Amazon
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">YoY Growth</span>
                      {data.metrics && (
                        <span className={`font-bold ${data.metrics.revenueGrowth > 15 ? 'text-green-600' : 'text-yellow-600'}`}>
                          +{data.metrics.revenueGrowth.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Order Value</span>
                      {data.metrics && (
                        <span className="font-bold">${data.metrics.averageOrderValue.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile Orders</span>
                      {data.metrics && (
                        <span className="font-bold">{data.metrics.mobileOrders}%</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <div className="text-sm text-gray-600 mb-2">Opportunity Gap:</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>vs Amazon</span>
                        <span className="text-red-600">-${(data.marketplace.amazon.metrics.avgOrderValue - (data.metrics?.averageOrderValue || 0)).toFixed(2)} AOV</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>vs Flipkart</span>
                        <span className="text-green-600">+{((data.metrics?.revenueGrowth || 0) - data.marketplace.flipkart.metrics.yoyGrowth).toFixed(1)}% growth</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flipkart Card */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <SiFlipkart className="text-3xl text-blue-500" />
                      <div>
                        <h4 className="font-bold text-gray-900">Flipkart</h4>
                        <p className="text-sm text-gray-500">India Leader</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {data.marketplace.flipkart.metrics.marketShare}% Market Share
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">YoY Growth</span>
                      <span className="font-bold text-green-600">+{data.marketplace.flipkart.metrics.yoyGrowth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Order Value</span>
                      <span className="font-bold">${data.marketplace.flipkart.metrics.avgOrderValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fulfillment Speed</span>
                      <span className="font-bold">{data.marketplace.flipkart.metrics.fulfillmentSpeed}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Key Strengths:</div>
                    <div className="flex flex-wrap gap-2">
                      {data.marketplace.flipkart.strengths.map((strength, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        {loading.metrics ? (
          <MetricsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsCards.map((metric, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-10`}>
                      <div className={`text-2xl bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                        {metric.icon}
                      </div>
                    </div>
                    <div className={`flex items-center text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                      {metric.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  
                  {/* Marketplace Comparison */}
                  {metric.comparison && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs">
                        <div className="flex items-center">
                          <FaAmazon className="text-orange-500 mr-1" />
                          <span className="text-gray-500">{metric.comparison.amazon}</span>
                        </div>
                        <div className="flex items-center">
                          <SiFlipkart className="text-blue-500 mr-1" />
                          <span className="text-gray-500">{metric.comparison.flipkart}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <FaCalendarAlt className="mr-2" />
                      {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} performance
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Growth Trend</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2 sm:mt-0">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-t from-blue-500 to-blue-600 rounded mr-2"></div>
                    Your Revenue
                  </span>
                  {selectedMarketplace === 'all' && (
                    <>
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-t from-orange-500 to-orange-600 rounded mr-2"></div>
                        Amazon
                      </span>
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-t from-blue-400 to-blue-500 rounded mr-2"></div>
                        Flipkart
                      </span>
                    </>
                  )}
                  <span className="flex items-center">
                    <div className="w-3 h-3 border-2 border-green-400 border-dashed mr-2"></div>
                    Target
                  </span>
                </div>
              </div>
              <RevenueChart data={data.revenueTrend} />
              {loading.revenue && (
                <div className="flex justify-center mt-4">
                  <FaSpinner className="animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Traffic & Device Analysis</h3>
                {loading.traffic && (
                  <FaSpinner className="animate-spin text-gray-400" />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Traffic Sources</h4>
                  <TrafficPieChart data={data.trafficSources} />
                  {data.trafficSources && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {data.trafficSources.channels.map((source, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: source.color }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              {source.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {source.value}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Device Distribution</h4>
                  {data.trafficSources && data.trafficSources.devices && (
                    <>
                      <div className="space-y-4">
                        {data.trafficSources.devices.map((device, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">{device.name}</span>
                              <span className="font-medium">{device.value}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${device.value}%`,
                                  backgroundColor: device.color
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">vs Market Leaders</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <FaAmazon className="text-orange-500" />
                              <span className="text-xs text-gray-600">Amazon</span>
                            </div>
                            <div className="text-lg font-bold">
                              {data.trafficSources?.comparison?.amazon?.mobile || 0}%
                            </div>
                            <div className="text-xs text-gray-500">Mobile</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <SiFlipkart className="text-blue-500" />
                              <span className="text-xs text-gray-600">Flipkart</span>
                            </div>
                            <div className="text-lg font-bold">
                              {data.trafficSources?.comparison?.flipkart?.mobile || 0}%
                            </div>
                            <div className="text-xs text-gray-500">Mobile</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Opportunities List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Growth Opportunities</h2>
                <p className="text-gray-600 mt-1">Inspired by Amazon & Flipkart strategies</p>
              </div>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
                  {['all', 'pending', 'in-progress', 'planned', 'completed'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleOpportunityFilter(filter)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all capitalize ${
                        activeFilter === filter 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {filter.replace('-', ' ')}
                    </button>
                  ))}
                </div>
                {loading.opportunities && (
                  <FaSpinner className="animate-spin text-gray-400" />
                )}
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {data.growthAreas.length} Opportunities
                </span>
              </div>
            </div>
          </div>
          
          {loading.opportunities ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.growthAreas.map((opportunity) => (
                <div key={opportunity.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          opportunity.status === 'completed' ? 'bg-green-100 text-green-600' :
                          opportunity.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {opportunity.status === 'completed' ? <FaCheckCircle /> : 
                           opportunity.status === 'in-progress' ? <FaClock /> : <FaCalendarAlt />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">{opportunity.title}</h4>
                              <p className="text-gray-600 mt-1">{opportunity.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                opportunity.inspiredBy === 'Amazon' 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {opportunity.inspiredBy === 'Amazon' ? (
                                  <FaAmazon className="text-orange-600" />
                                ) : (
                                  <SiFlipkart className="text-blue-600" />
                                )}
                                {opportunity.inspiredBy}
                              </span>
                            </div>
                          </div>
                          
                          {/* Features */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {opportunity.features?.map((feature, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {feature}
                              </span>
                            ))}
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{opportunity.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  opportunity.status === 'completed' ? 'bg-green-500' :
                                  opportunity.status === 'in-progress' ? 'bg-blue-500' :
                                  'bg-purple-500'
                                }`}
                                style={{ width: `${opportunity.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        <div className="text-center lg:text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            opportunity.effort === 'Very High' ? 'bg-red-100 text-red-800' :
                            opportunity.effort === 'High' ? 'bg-orange-100 text-orange-800' :
                            opportunity.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {opportunity.effort} Effort
                          </span>
                        </div>
                        <div className="text-center lg:text-right">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {opportunity.potentialImpact}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-center lg:justify-end space-x-2">
                        <button 
                          onClick={() => handleUpdateOpportunity(
                            opportunity.id, 
                            'in-progress', 
                            Math.min(opportunity.progress + 25, 100)
                          )}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium"
                        >
                          Start
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-4">
              <FaLightbulb className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">💡 Growth Recommendations</h3>
              <p className="text-gray-600 mt-1">Actionable insights inspired by market leaders</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <FaBullseye className="text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Amazon Strategies</h4>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Implement Prime-like subscription model</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Adopt FBA-style fulfillment network</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Enhance voice search capabilities</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <FaClock className="text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Flipkart Strategies</h4>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Create mega sale events (BBD-style)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Focus on mobile-first shopping experience</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Implement social commerce features</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FaUsers className="text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Hybrid Strategies</h4>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Combine Prime benefits with local offerings</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Mix Amazon's tech with Flipkart's localization</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">Create omnichannel shopping experience</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Download Detailed Reports</h4>
                <p className="text-sm text-gray-600">Get comprehensive analysis and action plans</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDownloadReport('quick')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium"
                >
                  Quick Summary
                </button>
                <button 
                  onClick={() => handleDownloadReport('competitor')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium"
                >
                  Competitor Analysis
                </button>
                <button 
                  onClick={() => handleDownloadReport('full')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
                >
                  Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthOpportunities;