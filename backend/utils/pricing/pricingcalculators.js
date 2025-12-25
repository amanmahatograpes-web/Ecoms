const constants = require('../config/constants');

class PricingCalculator {
  constructor(currency = constants.CURRENCY) {
    this.currency = currency;
  }

  // Format Indian Rupees
  formatIndianRupees(amount) {
    return new Intl.NumberFormat(this.currency.LOCALE, {
      style: 'currency',
      currency: this.currency.CODE,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Calculate tax amount
  calculateTax(amount, taxPercentage) {
    return (amount * taxPercentage) / 100;
  }

  // Calculate price with tax
  calculatePriceWithTax(amount, taxPercentage, taxInclusive = true) {
    if (taxInclusive) {
      return amount;
    }
    const taxAmount = this.calculateTax(amount, taxPercentage);
    return amount + taxAmount;
  }

  // Calculate discounted price
  calculateDiscountedPrice(price, discountPercentage) {
    return price * (1 - discountPercentage / 100);
  }

  // Calculate annual price
  calculateAnnualPrice(monthlyPrice, annualDiscountPercentage) {
    const annualPrice = monthlyPrice * 12;
    const discount = annualPrice * (annualDiscountPercentage / 100);
    return annualPrice - discount;
  }

  // Apply multiple discounts
  applyMultipleDiscounts(price, discounts = []) {
    let finalPrice = price;
    for (const discount of discounts) {
      if (discount.type === 'percentage') {
        finalPrice = this.calculateDiscountedPrice(finalPrice, discount.value);
      } else if (discount.type === 'fixed') {
        finalPrice -= discount.value;
      }
    }
    return Math.max(finalPrice, 0); // Ensure price doesn't go below 0
  }

  // Calculate price based on market conditions
  calculateMarketBasedPrice(basePrice, marketConditions = {}) {
    let price = basePrice;

    // Apply demand multiplier
    if (marketConditions.demandMultiplier) {
      price *= marketConditions.demandMultiplier;
    }

    // Apply seasonal multiplier
    if (marketConditions.seasonalMultiplier) {
      price *= marketConditions.seasonalMultiplier;
    }

    // Apply competitor adjustment
    if (marketConditions.competitorAdjustment) {
      price += marketConditions.competitorAdjustment;
    }

    // Round to nearest 10
    price = Math.round(price / 10) * 10;

    return price;
  }

  // Calculate profit margin
  calculatePriceWithMargin(cost, profitMarginPercentage) {
    return cost * (1 + profitMarginPercentage / 100);
  }

  // Generate price breakdown
  generatePriceBreakdown(basePrice, options = {}) {
    const {
      taxPercentage = 18,
      taxInclusive = true,
      annualDiscount = 0,
      coupons = []
    } = options;

    const priceBeforeTax = taxInclusive 
      ? basePrice / (1 + taxPercentage / 100)
      : basePrice;

    const taxAmount = this.calculateTax(priceBeforeTax, taxPercentage);
    const priceWithTax = priceBeforeTax + taxAmount;

    const discountedPrice = this.applyMultipleDiscounts(priceWithTax, coupons);
    
    const annualPrice = this.calculateAnnualPrice(
      discountedPrice,
      annualDiscount
    );

    return {
      basePrice,
      priceBeforeTax: Math.round(priceBeforeTax),
      taxAmount: Math.round(taxAmount),
      priceWithTax: Math.round(priceWithTax),
      discountedPrice: Math.round(discountedPrice),
      annualPrice: Math.round(annualPrice),
      currency: this.currency.CODE,
      formatted: {
        basePrice: this.formatIndianRupees(basePrice),
        priceWithTax: this.formatIndianRupees(Math.round(priceWithTax)),
        discountedPrice: this.formatIndianRupees(Math.round(discountedPrice)),
        annualPrice: this.formatIndianRupees(Math.round(annualPrice))
      }
    };
  }

  // Compare prices
  comparePrices(currentPrice, newPrice) {
    const difference = newPrice - currentPrice;
    const percentageChange = (difference / currentPrice) * 100;

    return {
      currentPrice,
      newPrice,
      difference,
      percentageChange,
      isIncrease: difference > 0,
      isDecrease: difference < 0,
      formatted: {
        currentPrice: this.formatIndianRupees(currentPrice),
        newPrice: this.formatIndianRupees(newPrice),
        difference: this.formatIndianRupees(Math.abs(difference)),
        percentageChange: `${percentageChange.toFixed(2)}%`
      }
    };
  }

  // Validate price constraints
  validatePriceConstraints(price, constraints = {}) {
    const errors = [];

    if (constraints.minPrice && price < constraints.minPrice) {
      errors.push(`Price cannot be less than ${this.formatIndianRupees(constraints.minPrice)}`);
    }

    if (constraints.maxPrice && price > constraints.maxPrice) {
      errors.push(`Price cannot exceed ${this.formatIndianRupees(constraints.maxPrice)}`);
    }

    if (constraints.minMargin && constraints.cost) {
      const margin = ((price - constraints.cost) / constraints.cost) * 100;
      if (margin < constraints.minMargin) {
        errors.push(`Margin cannot be less than ${constraints.minMargin}%`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = PricingCalculator;