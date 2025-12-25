/**
 * Format Indian Rupees
 */
const formatIndianRupees = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculate tax amount
 */
const calculateTax = (amount, taxPercentage) => {
  return (amount * taxPercentage) / 100;
};

/**
 * Calculate total with tax
 */
const calculateTotalWithTax = (amount, taxPercentage) => {
  return amount + calculateTax(amount, taxPercentage);
};

/**
 * Calculate annual price with discount
 */
const calculateAnnualPrice = (monthlyPrice, annualDiscount = 20) => {
  const discount = annualDiscount / 100;
  return monthlyPrice * 12 * (1 - discount);
};

/**
 * Calculate discounted price
 */
const calculateDiscountedPrice = (price, discountPercentage) => {
  return price * (1 - discountPercentage / 100);
};

/**
 * Round to nearest value
 */
const roundToNearest = (value, nearest = 10) => {
  return Math.round(value / nearest) * nearest;
};

/**
 * Apply price constraints
 */
const applyPriceConstraints = (price, minPrice, maxPrice) => {
  let constrainedPrice = price;
  
  if (minPrice !== undefined && constrainedPrice < minPrice) {
    constrainedPrice = minPrice;
  }
  
  if (maxPrice !== undefined && constrainedPrice > maxPrice) {
    constrainedPrice = maxPrice;
  }
  
  return constrainedPrice;
};

/**
 * Calculate price change percentage
 */
const calculateChangePercentage = (oldPrice, newPrice) => {
  if (oldPrice === 0) return newPrice > 0 ? 100 : 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
};

/**
 * Generate price history summary
 */
const generatePriceSummary = (priceHistory) => {
  if (priceHistory.length === 0) {
    return {
      currentPrice: 0,
      averagePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      volatility: 0,
      trend: 'stable'
    };
  }
  
  const prices = priceHistory.map(h => h.newPrice);
  const currentPrice = prices[prices.length - 1];
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  // Calculate volatility (standard deviation)
  const variance = prices.reduce((a, b) => a + Math.pow(b - averagePrice, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance);
  
  // Determine trend
  const recentPrices = prices.slice(-3);
  let trend = 'stable';
  if (recentPrices.length >= 2) {
    const first = recentPrices[0];
    const last = recentPrices[recentPrices.length - 1];
    const change = ((last - first) / first) * 100;
    
    if (change > 5) trend = 'up';
    else if (change < -5) trend = 'down';
    else trend = 'stable';
  }
  
  return {
    currentPrice,
    averagePrice,
    minPrice,
    maxPrice,
    volatility,
    trend,
    priceRange: maxPrice - minPrice
  };
};

module.exports = {
  formatIndianRupees,
  calculateTax,
  calculateTotalWithTax,
  calculateAnnualPrice,
  calculateDiscountedPrice,
  roundToNearest,
  applyPriceConstraints,
  calculateChangePercentage,
  generatePriceSummary
};