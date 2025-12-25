export class ForecastCalculator {
  static calculateForecast(salesHistory, days = 30) {
    if (!salesHistory || salesHistory.length === 0) {
      return { forecast: 0, accuracy: 0, trend: 'stable' };
    }

    const recentSales = salesHistory.slice(-7).map(h => h.quantity);
    const avgSales = recentSales.reduce((a, b) => a + b, 0) / recentSales.length;
    
    const trend = this.calculateTrend(salesHistory);
    
    let forecast = avgSales * days;
    
    switch (trend) {
      case 'increasing':
        forecast *= 1.2;
        break;
      case 'decreasing':
        forecast *= 0.8;
        break;
      default:
        forecast *= 1.0;
    }

    const accuracy = this.calculateAccuracy(salesHistory);

    return {
      forecast: Math.round(forecast),
      accuracy: Math.round(accuracy),
      trend,
      dailyAverage: Math.round(avgSales)
    };
  }

  static calculateTrend(salesHistory) {
    if (salesHistory.length < 2) return 'stable';
    
    const recent = salesHistory.slice(-14);
    const firstHalf = recent.slice(0, 7);
    const secondHalf = recent.slice(7);
    
    const avgFirst = firstHalf.reduce((sum, h) => sum + h.quantity, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, h) => sum + h.quantity, 0) / secondHalf.length;
    
    const change = ((avgSecond - avgFirst) / avgFirst) * 100;
    
    if (change > 15) return 'increasing';
    if (change < -15) return 'decreasing';
    return 'stable';
  }

  static calculateAccuracy(salesHistory) {
    if (salesHistory.length < 2) return 100;
    
    const actual = salesHistory.slice(-30).map(h => h.quantity);
    const forecasts = this.generateHistoricalForecasts(salesHistory);
    
    let totalError = 0;
    for (let i = 0; i < forecasts.length; i++) {
      const error = Math.abs(actual[i] - forecasts[i]);
      totalError += error;
    }
    
    const avgError = totalError / forecasts.length;
    const avgActual = actual.reduce((a, b) => a + b, 0) / actual.length;
    
    const accuracy = 100 - ((avgError / avgActual) * 100);
    return Math.max(0, Math.min(100, accuracy));
  }

  static generateHistoricalForecasts(salesHistory) {
    const forecasts = [];
    
    for (let i = 7; i < salesHistory.length; i++) {
      const history = salesHistory.slice(Math.max(0, i - 7), i);
      const avg = history.reduce((sum, h) => sum + h.quantity, 0) / history.length;
      forecasts.push(avg);
    }
    
    return forecasts;
  }

  static calculateReorderPoint(dailySales, leadTime, safetyStockMultiplier = 1.5) {
    const leadTimeDemand = dailySales * leadTime;
    const safetyStock = leadTimeDemand * safetyStockMultiplier;
    return Math.ceil(leadTimeDemand + safetyStock);
  }

  static calculateMaxStock(dailySales, coverageDays = 30) {
    return Math.ceil(dailySales * coverageDays);
  }
}