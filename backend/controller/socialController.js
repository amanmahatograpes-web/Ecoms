const socialSharingService = require('../services/socialSharingService');
const ShareAnalytics = require('../models/ShareAnalytics');
const PricingPlan = require('../models/PricingPlan');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class SocialController {
  /**
   * Generate share data
   */
  async generateShare(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { planId, platform, options = {} } = req.body;
      const userId = req.user?.userId;

      const shareData = await socialSharingService.generateShareData(
        planId,
        platform,
        userId,
        options
      );

      res.json({
        success: true,
        data: shareData
      });

    } catch (error) {
      logger.error('Generate share error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate share data',
        message: error.message
      });
    }
  }

  /**
   * Share to a platform
   */
  async share(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { planId, platform, recipientData = {}, options = {} } = req.body;
      const userId = req.user?.userId;

      // Validate plan exists
      const plan = await PricingPlan.findById(planId);
      if (!plan) {
        return res.status(404).json({
          success: false,
          error: 'Pricing plan not found'
        });
      }

      // Validate platform
      const validPlatforms = ['whatsapp', 'facebook', 'twitter', 'instagram', 'linkedin', 'telegram', 'email'];
      if (!validPlatforms.includes(platform)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid platform'
        });
      }

      // Share to platform
      const result = await socialSharingService.shareToPlatform(
        platform,
        planId,
        userId,
        recipientData,
        options
      );

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Share error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to share',
        message: error.message
      });
    }
  }

  /**
   * Bulk share to multiple platforms/recipients
   */
  async bulkShare(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { planId, platforms, recipients, options = {} } = req.body;
      const userId = req.user?.userId;

      if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Platforms array is required'
        });
      }

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Recipients array is required'
        });
      }

      // Validate plan exists
      const plan = await PricingPlan.findById(planId);
      if (!plan) {
        return res.status(404).json({
          success: false,
          error: 'Pricing plan not found'
        });
      }

      // Validate platforms
      const validPlatforms = ['whatsapp', 'facebook', 'twitter', 'instagram', 'linkedin', 'telegram', 'email'];
      const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
      
      if (invalidPlatforms.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid platforms: ${invalidPlatforms.join(', ')}`
        });
      }

      // Validate recipients
      const validRecipients = recipients.filter(r => 
        (r.email && typeof r.email === 'string') || 
        (r.phoneNumber && typeof r.phoneNumber === 'string')
      );

      if (validRecipients.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid recipients found'
        });
      }

      const result = await socialSharingService.bulkShare(
        platforms,
        planId,
        validRecipients,
        userId,
        options
      );

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Bulk share error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to bulk share',
        message: error.message
      });
    }
  }

  /**
   * Track share click
   */
  async trackClick(req, res) {
    try {
      const { shareId } = req.params;
      const clickData = req.body;

      const result = await socialSharingService.trackClick(shareId, clickData);

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Track click error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track click',
        message: error.message
      });
    }
  }

  /**
   * Track conversion
   */
  async trackConversion(req, res) {
    try {
      const { shareId } = req.params;
      const conversionData = req.body;

      const result = await socialSharingService.trackConversion(shareId, conversionData);

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Track conversion error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track conversion',
        message: error.message
      });
    }
  }

  /**
   * Get share analytics
   */
  async getAnalytics(req, res) {
    try {
      const options = {
        planId: req.query.planId,
        platform: req.query.platform,
        userId: req.query.userId || req.user?.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        limit: parseInt(req.query.limit) || 50,
        page: parseInt(req.query.page) || 1
      };

      const result = await socialSharingService.getShareAnalytics(options);

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch analytics',
        message: error.message
      });
    }
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(req, res) {
    try {
      const options = {
        planId: req.query.planId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const result = await socialSharingService.getPlatformStats(options);

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Get platform stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch platform statistics',
        message: error.message
      });
    }
  }

  /**
   * Generate QR code
   */
  async generateQRCode(req, res) {
    try {
      const { url, size = 300, margin = 2 } = req.body;

      if (!url) {
        return res.status(400).json({
          success: false,
          error: 'URL is required'
        });
      }

      const qrCode = await socialSharingService.generateQRCode(url);

      res.json({
        success: true,
        qrCode,
        url,
        size,
        margin
      });

    } catch (error) {
      logger.error('Generate QR code error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate QR code',
        message: error.message
      });
    }
  }

  /**
   * Generate share report
   */
  async generateReport(req, res) {
    try {
      const options = {
        planId: req.query.planId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        format: req.query.format || 'json'
      };

      const result = await socialSharingService.generateShareReport(options);

      if (options.format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        return res.send(result.content);
      }

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Generate report error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate report',
        message: error.message
      });
    }
  }

  /**
   * Get user share statistics
   */
  async getUserStats(req, res) {
    try {
      const userId = req.user.userId;

      const stats = await ShareAnalytics.getUserShareStats(userId);

      res.json({
        success: true,
        data: stats,
        user: {
          id: userId,
          totalShares: stats.totalShares,
          conversionRate: stats.conversionRate
        }
      });

    } catch (error) {
      logger.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics',
        message: error.message
      });
    }
  }

  /**
   * Get top performing shares
   */
  async getTopShares(req, res) {
    try {
      const { limit = 10, timeframe = '7d' } = req.query;

      const topShares = await ShareAnalytics.getTopPerformers(parseInt(limit), timeframe);

      res.json({
        success: true,
        data: topShares,
        timeframe,
        limit: parseInt(limit)
      });

    } catch (error) {
      logger.error('Get top shares error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch top shares',
        message: error.message
      });
    }
  }

  /**
   * Platform-specific endpoints
   */

  async shareToWhatsApp(req, res) {
    try {
      const { planId, phoneNumber, message, options = {} } = req.body;
      const userId = req.user?.userId;

      const result = await socialSharingService.shareToPlatform(
        'whatsapp',
        planId,
        userId,
        { phoneNumber },
        { ...options, customMessage: message }
      );

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('WhatsApp share error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to share to WhatsApp',
        message: error.message
      });
    }
  }

  async shareToFacebook(req, res) {
    try {
      const { planId, message, options = {} } = req.body;
      const userId = req.user?.userId;

      const result = await socialSharingService.shareToPlatform(
        'facebook',
        planId,
        userId,
        {},
        { ...options, customMessage: message }
      );

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Facebook share error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to share to Facebook',
        message: error.message
      });
    }
  }

  async shareToTwitter(req, res) {
    try {
      const { planId, message, options = {} } = req.body;
      const userId = req.user?.userId;

      const result = await socialSharingService.shareToPlatform(
        'twitter',
        planId,
        userId,
        {},
        { ...options, customMessage: message }
      );

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Twitter share error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to share to Twitter',
        message: error.message
      });
    }
  }

  async shareToEmail(req, res) {
    try {
      const { planId, emails, subject, personalMessage, options = {} } = req.body;
      const userId = req.user?.userId;

      const recipients = Array.isArray(emails) 
        ? emails.map(email => ({ email }))
        : [{ email: emails }];

      const result = await socialSharingService.shareToPlatform(
        'email',
        planId,
        userId,
        { email: emails },
        { 
          ...options, 
          customMessage: personalMessage,
          subject: subject || `Check out this pricing plan`
        }
      );

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Email share error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to share via email',
        message: error.message
      });
    }
  }
}

module.exports = new SocialController();