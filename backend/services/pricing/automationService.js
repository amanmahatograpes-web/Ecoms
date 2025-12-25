const Plan = require('../models/Plan.model');
const AutomationRule = require('../models/AutomationRule.model');
const MarketCondition = require('../models/MarketCondition.model');
const PriceHistory = require('../models/PriceHistory.model');
const logger = require('../utils/logger');
const cron = require('node-cron');

class AutomationService {
  constructor() {
    this.isRunning = false;
    this.scheduledJobs = new Map();
  }

  /**
   * Start automation engine
   */
  async startAutomationEngine() {
    if (this.isRunning) {
      logger.warn('Automation engine is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting pricing automation engine...');

    // Schedule regular price evaluations
    this.schedulePriceEvaluation();

    // Schedule market condition updates
    this.scheduleMarketUpdates();

    // Schedule competitor price monitoring
    this.scheduleCompetitorMonitoring();

    logger.info('Automation engine started successfully');
  }

  /**
   * Stop automation engine
   */
  async stopAutomationEngine() {
    this.isRunning = false;
    
    // Clear all scheduled jobs
    for (const [name, job] of this.scheduledJobs) {
      job.stop();
      this.scheduledJobs.delete(name);
    }
    
    logger.info('Automation engine stopped');
  }

  /**
   * Schedule regular price evaluations
   */
  schedulePriceEvaluation() {
    // Run every hour at minute 0
    const job = cron.schedule('0 * * * *', async () => {
      try {
        await this.evaluateAllPlans();
      } catch (error) {
        logger.error('Error in scheduled price evaluation:', error);
      }
    });

    this.scheduledJobs.set('price-evaluation', job);
    logger.info('Scheduled price evaluation job');
  }

  /**
   * Schedule market condition updates
   */
  scheduleMarketUpdates() {
    // Run every day at 2 AM
    const job = cron.schedule('0 2 * * *', async () => {
      try {
        await this.updateMarketConditions();
      } catch (error) {
        logger.error('Error updating market conditions:', error);
      }
    });

    this.scheduledJobs.set('market-updates', job);
    logger.info('Scheduled market updates job');
  }

  /**
   * Schedule competitor monitoring
   */
  scheduleCompetitorMonitoring() {
    // Run every 6 hours
    const job = cron.schedule('0 */6 * * *', async () => {
      try {
        await this.monitorCompetitorPrices();
      } catch (error) {
        logger.error('Error monitoring competitor prices:', error);
      }
    });

    this.scheduledJobs.set('competitor-monitoring', job);
    logger.info('Scheduled competitor monitoring job');
  }

  /**
   * Evaluate all plans for price adjustments
   */
  async evaluateAllPlans(context = {}) {
    if (!this.isRunning) {
      logger.warn('Automation engine is not running');
      return;
    }

    try {
      logger.info('Starting evaluation of all plans...');

      const plans = await Plan.find({ 
        active: true,
        'automationSettings.enabled': true 
      });

      const results = {
        totalPlans: plans.length,
        evaluated: 0,
        changed: 0,
        errors: 0,
        details: []
      };

      for (const plan of plans) {
        try {
          const result = await this.evaluatePlan(plan, context);
          results.evaluated++;

          if (result.success && result.priceChanged) {
            results.changed++;
            results.details.push({
              planId: plan._id,
              planName: plan.name,
              oldPrice: result.oldPrice,
              newPrice: result.newPrice,
              changePercentage: result.changePercentage,
              appliedRules: result.appliedRules
            });

            logger.info(`Plan ${plan.name} price updated: ${result.oldPrice} → ${result.newPrice}`);
          }
        } catch (error) {
          results.errors++;
          logger.error(`Error evaluating plan ${plan.name}:`, error);
        }
      }

      logger.info(`Evaluation completed: ${results.evaluated} evaluated, ${results.changed} changed, ${results.errors} errors`);

      return results;

    } catch (error) {
      logger.error('Error in evaluateAllPlans:', error);
      throw error;
    }
  }

  /**
   * Evaluate a single plan for price adjustments
   */
  async evaluatePlan(plan, context = {}) {
    try {
      const currentPrice = plan.currentPrice || plan.basePrice;
      
      // Get current market conditions
      const marketContext = await this.getMarketContext(plan, context);
      
      // Apply market conditions multiplier
      let newPrice = currentPrice * marketContext.marketMultiplier;
      
      // Get applicable automation rules
      const applicableRules = await AutomationRule.find({
        enabled: true,
        $or: [
          { 'conditions.planCategories': { $in: [plan.category] } },
          { 'conditions.planCategories': { $exists: false } }
        ]
      }).sort({ priority: -1 });
      
      const appliedRules = [];
      
      for (const rule of applicableRules) {
        const ruleContext = {
          ...marketContext,
          plan,
          currentPrice: newPrice,
          ...context
        };
        
        const conditionsMet = await rule.evaluateConditions(ruleContext);
        
        if (conditionsMet) {
          const rulePrice = rule.applyAction(newPrice);
          
          if (rulePrice !== newPrice) {
            newPrice = rulePrice;
            appliedRules.push({
              ruleId: rule._id,
              ruleName: rule.name,
              priceImpact: rulePrice - newPrice
            });
            
            // Update rule statistics
            rule.stats.totalExecutions += 1;
            rule.stats.successfulExecutions += 1;
            rule.stats.lastExecution = new Date();
            await rule.save();
            
            // If rule is exclusive, break
            if (rule.metadata.tags?.includes('exclusive')) {
              break;
            }
          }
        }
      }
      
      // Apply plan-specific constraints
      if (plan.automationSettings.minPrice && newPrice < plan.automationSettings.minPrice) {
        newPrice = plan.automationSettings.minPrice;
      }
      
      if (plan.automationSettings.maxPrice && newPrice > plan.automationSettings.maxPrice) {
        newPrice = plan.automationSettings.maxPrice;
      }
      
      // Apply rounding
      newPrice = Math.round(newPrice / 10) * 10;
      
      // Check if price actually changed
      const priceChanged = Math.abs(newPrice - currentPrice) > 0.01; // Tolerance for floating point
      
      if (priceChanged) {
        // Update plan price
        plan.currentPrice = newPrice;
        plan.lastPriceUpdate = new Date();
        plan.priceUpdateCount += 1;
        await plan.save();
        
        // Log price history
        await PriceHistory.create({
          plan: plan._id,
          planName: plan.name,
          oldPrice: currentPrice,
          newPrice,
          changePercentage: ((newPrice - currentPrice) / currentPrice) * 100,
          currency: plan.currency,
          changeType: 'automation',
          factors: {
            marketContext,
            appliedRules: appliedRules.map(r => r.ruleName),
            ...context
          },
          triggeredBy: 'system'
        });
        
        // Send notifications if needed
        await this.sendPriceChangeNotifications(plan, currentPrice, newPrice, appliedRules);
      }
      
      return {
        success: true,
        planId: plan._id,
        planName: plan.name,
        oldPrice: currentPrice,
        newPrice,
        changePercentage: priceChanged ? ((newPrice - currentPrice) / currentPrice) * 100 : 0,
        priceChanged,
        appliedRules,
        marketContext
      };
      
    } catch (error) {
      logger.error(`Error evaluating plan ${plan._id}:`, error);
      return {
        success: false,
        error: error.message,
        planId: plan._id
      };
    }
  }

  /**
   * Get current market context for a plan
   */
  async getMarketContext(plan, context = {}) {
    try {
      // Get current market conditions
      const marketConditions = await MarketCondition.getCurrentConditions(plan, context.location);
      
      // Calculate market multiplier
      let marketMultiplier = 1.0;
      const appliedConditions = [];
      
      for (const condition of marketConditions) {
        marketMultiplier *= condition.multiplier;
        appliedConditions.push({
          name: condition.name,
          type: condition.type,
          multiplier: condition.multiplier
        });
        
        // Update condition statistics
        condition.stats.timesApplied += 1;
        await condition.save();
      }
      
      // Get competitor data (mock - in real app, fetch from external API)
      const competitorData = await this.fetchCompetitorData(plan);
      
      // Get demand data (mock - in real app, fetch from analytics)
      const demandData = await this.analyzeDemand(plan);
      
      // Get seasonal factors
      const seasonalFactor = this.getSeasonalFactor();
      
      return {
        marketMultiplier,
        appliedConditions,
        competitorData,
        demandData,
        seasonalFactor,
        timestamp: new Date(),
        ...context
      };
      
    } catch (error) {
      logger.error('Error getting market context:', error);
      return {
        marketMultiplier: 1.0,
        appliedConditions: [],
        competitorData: {},
        demandData: {},
        seasonalFactor: 1.0,
        timestamp: new Date(),
        error: error.message
      };
    }
  }

  /**
   * Fetch competitor data (mock implementation)
   */
  async fetchCompetitorData(plan) {
    // In a real application, this would fetch from competitor APIs or web scraping
    // For now, return mock data
    
    const competitorPrices = {
      'Basic': [1800, 1900, 2100, 2200],
      'Professional': [4500, 4800, 5200, 5500],
      'Enterprise': [14000, 14500, 15500, 16000]
    };
    
    const planType = plan.name.split(' ')[0];
    const prices = competitorPrices[planType] || [plan.basePrice * 0.9, plan.basePrice * 1.1];
    
    return {
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      count: prices.length,
      lastUpdated: new Date()
    };
  }

  /**
   * Analyze demand for a plan (mock implementation)
   */
  async analyzeDemand(plan) {
    // In a real application, this would analyze sales data, website traffic, etc.
    // For now, return mock data
    
    const demandLevels = ['low', 'normal', 'high'];
    const randomLevel = demandLevels[Math.floor(Math.random() * demandLevels.length)];
    
    return {
      level: randomLevel,
      score: Math.random() * 100,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      last7Days: Math.floor(Math.random() * 100),
      last30Days: Math.floor(Math.random() * 500)
    };
  }

  /**
   * Get seasonal factor
   */
  getSeasonalFactor() {
    const month = new Date().getMonth();
    
    // Holiday season multiplier (Oct-Dec)
    if (month >= 9 && month <= 11) {
      return 1.15;
    }
    
    // Off-peak season (Jun-Aug)
    if (month >= 5 && month <= 7) {
      return 0.85;
    }
    
    // Regular season
    return 1.0;
  }

  /**
   * Update market conditions from external sources
   */
  async updateMarketConditions() {
    try {
      logger.info('Updating market conditions...');
      
      // Fetch external market data
      const externalData = await this.fetchExternalMarketData();
      
      // Update or create market conditions
      for (const data of externalData) {
        await MarketCondition.findOneAndUpdate(
          { name: data.name, type: data.type },
          {
            $set: {
              multiplier: data.multiplier,
              externalData: {
                source: data.source,
                dataPoints: data.dataPoints,
                lastUpdated: new Date()
              },
              metadata: {
                ...data.metadata,
                lastSynced: new Date()
              }
            },
            $setOnInsert: {
              value: data.value,
              startDate: data.startDate,
              endDate: data.endDate,
              active: true
            }
          },
          { upsert: true, new: true }
        );
      }
      
      logger.info(`Updated ${externalData.length} market conditions`);
      
    } catch (error) {
      logger.error('Error updating market conditions:', error);
      throw error;
    }
  }

  /**
   * Monitor competitor prices
   */
  async monitorCompetitorPrices() {
    try {
      logger.info('Monitoring competitor prices...');
      
      const plans = await Plan.find({ active: true });
      const updates = [];
      
      for (const plan of plans) {
        const competitorData = await this.fetchCompetitorData(plan);
        
        // Create market condition for competitor price if significant difference
        const currentPrice = plan.currentPrice || plan.basePrice;
        const competitorAvg = competitorData.avgPrice;
        const diffPercentage = Math.abs((competitorAvg - currentPrice) / currentPrice) * 100;
        
        if (diffPercentage > 10) { // Significant difference
          const condition = await MarketCondition.findOneAndUpdate(
            {
              name: `Competitor Adjustment - ${plan.name}`,
              type: 'competitor'
            },
            {
              $set: {
                value: `Competitor price adjustment for ${plan.name}`,
                multiplier: competitorAvg / currentPrice,
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                'applicableTo.allPlans': false,
                'applicableTo.specificPlans': [plan._id],
                'externalData.source': 'competitor_monitoring',
                'externalData.dataPoints': competitorData,
                'externalData.lastUpdated': new Date(),
                active: true,
                priority: 2
              }
            },
            { upsert: true, new: true }
          );
          
          updates.push({
            plan: plan.name,
            ourPrice: currentPrice,
            competitorAvg,
            diffPercentage,
            conditionCreated: condition ? true : false
          });
        }
      }
      
      logger.info(`Competitor monitoring completed: ${updates.length} potential adjustments found`);
      
      return updates;
      
    } catch (error) {
      logger.error('Error monitoring competitor prices:', error);
      throw error;
    }
  }

  /**
   * Send price change notifications
   */
  async sendPriceChangeNotifications(plan, oldPrice, newPrice, appliedRules) {
    try {
      // Get rules that require notifications
      const rulesWithNotifications = appliedRules
        .map(rule => rule.ruleId)
        .filter(id => id); // Filter out undefined
      
      if (rulesWithNotifications.length === 0) return;
      
      const rules = await AutomationRule.find({
        _id: { $in: rulesWithNotifications },
        'notifications.enabled': true,
        'notifications.onChange': true
      });
      
      for (const rule of rules) {
        // Send notification for each channel
        for (const channel of rule.notifications.channels || []) {
          await this.sendNotification(channel, {
            rule: rule.name,
            plan: plan.name,
            oldPrice,
            newPrice,
            changePercentage: ((newPrice - oldPrice) / oldPrice) * 100,
            timestamp: new Date(),
            recipients: rule.notifications.recipients
          });
        }
      }
      
    } catch (error) {
      logger.error('Error sending price change notifications:', error);
    }
  }

  /**
   * Send notification to a channel
   */
  async sendNotification(channel, data) {
    // Implementation depends on your notification system
    // This is a mock implementation
    
    switch (channel) {
      case 'email':
        // Send email
        console.log(`Sending email notification:`, data);
        break;
        
      case 'slack':
        // Send Slack message
        console.log(`Sending Slack notification:`, data);
        break;
        
      case 'webhook':
        // Send webhook
        console.log(`Sending webhook notification:`, data);
        break;
        
      default:
        console.log(`Notification channel ${channel} not implemented`);
    }
  }

  /**
   * Fetch external market data (mock implementation)
   */
  async fetchExternalMarketData() {
    // In a real application, this would fetch from various APIs:
    // - Economic indicators
    // - Currency exchange rates
    // - Industry reports
    // - Weather data (for seasonal adjustments)
    
    return [
      {
        name: 'Economic Indicator - Inflation',
        type: 'economic',
        value: 'Current inflation rate adjustment',
        multiplier: 1.02, // 2% inflation adjustment
        source: 'government_api',
        dataPoints: { inflationRate: 2.1, lastUpdated: '2024-01-15' },
        metadata: { confidence: 85, tags: ['inflation', 'economic'] }
      },
      {
        name: 'Festive Season Boost',
        type: 'holiday',
        value: 'Diwali festive season',
        multiplier: 1.10, // 10% festive boost
        source: 'calendar',
        dataPoints: { festival: 'Diwali', duration: '5 days' },
        metadata: { confidence: 90, tags: ['festive', 'seasonal'] }
      }
    ];
  }

  /**
   * Create a new automation rule
   */
  async createAutomationRule(ruleData, userId) {
    try {
      const rule = new AutomationRule({
        ...ruleData,
        createdBy: userId,
        updatedBy: userId
      });
      
      await rule.save();
      
      logger.info(`Created automation rule: ${rule.name} (${rule._id})`);
      
      return {
        success: true,
        rule
      };
      
    } catch (error) {
      logger.error('Error creating automation rule:', error);
      throw error;
    }
  }

  /**
   * Update an automation rule
   */
  async updateAutomationRule(ruleId, updates, userId) {
    try {
      const rule = await AutomationRule.findById(ruleId);
      
      if (!rule) {
        throw new Error('Automation rule not found');
      }
      
      Object.assign(rule, updates);
      rule.updatedBy = userId;
      rule.lastModifiedBy = userId;
      
      await rule.save();
      
      logger.info(`Updated automation rule: ${rule.name} (${rule._id})`);
      
      return {
        success: true,
        rule
      };
      
    } catch (error) {
      logger.error('Error updating automation rule:', error);
      throw error;
    }
  }

  /**
   * Test automation rule against a plan
   */
  async testAutomationRule(ruleId, planId, context = {}) {
    try {
      const rule = await AutomationRule.findById(ruleId);
      const plan = await Plan.findById(planId);
      
      if (!rule || !plan) {
        throw new Error('Rule or plan not found');
      }
      
      const currentPrice = plan.currentPrice || plan.basePrice;
      const marketContext = await this.getMarketContext(plan, context);
      
      const conditionsMet = await rule.evaluateConditions({
        ...marketContext,
        plan,
        currentPrice,
        ...context
      });
      
      let newPrice = currentPrice;
      let wouldChange = false;
      
      if (conditionsMet) {
        newPrice = rule.applyAction(currentPrice);
        wouldChange = Math.abs(newPrice - currentPrice) > 0.01;
      }
      
      return {
        success: true,
        conditionsMet,
        wouldChange,
        currentPrice,
        newPrice,
        changePercentage: wouldChange ? ((newPrice - currentPrice) / currentPrice) * 100 : 0,
        marketContext
      };
      
    } catch (error) {
      logger.error('Error testing automation rule:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get automation engine status
   */
  getEngineStatus() {
    return {
      isRunning: this.isRunning,
      scheduledJobs: Array.from(this.scheduledJobs.keys()),
      startedAt: this.startedAt,
      uptime: this.startedAt ? Date.now() - this.startedAt : 0
    };
  }
}

module.exports = new AutomationService();