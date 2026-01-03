// module.exports = {
//   // Currency constants
//   CURRENCY: {
//     INR: {
//       symbol: '₹',
//       name: 'Indian Rupee',
//       code: 'INR',
//       locale: 'en-IN',
//       taxPercentage: 18,
//       decimalPlaces: 2
//     },
//     USD: {
//       symbol: '$',
//       name: 'US Dollar',
//       code: 'USD',
//       locale: 'en-US',
//       taxPercentage: 0,
//       decimalPlaces: 2
//     },
//     EUR: {
//       symbol: '€',
//       name: 'Euro',
//       code: 'EUR',
//       locale: 'de-DE',
//       taxPercentage: 19,
//       decimalPlaces: 2
//     }
//   },

//   // Market conditions
//   MARKET_CONDITIONS: {
//     DEMAND_LEVELS: {
//       LOW: { value: 'low', label: 'Low Demand', multiplier: 0.9 },
//       NORMAL: { value: 'normal', label: 'Normal', multiplier: 1.0 },
//       HIGH: { value: 'high', label: 'High Demand', multiplier: 1.1 },
//       VERY_HIGH: { value: 'very_high', label: 'Very High Demand', multiplier: 1.2 }
//     },
//     SEASONS: {
//       REGULAR: { value: 'regular', label: 'Regular Season', multiplier: 1.0 },
//       HOLIDAY: { value: 'holiday', label: 'Holiday Season', multiplier: 1.15 },
//       OFF_PEAK: { value: 'off_peak', label: 'Off-Peak Season', multiplier: 0.85 },
//       FESTIVE: { value: 'festive', label: 'Festive Season', multiplier: 1.25 }
//     }
//   },

//   // Plan categories
//   PLAN_CATEGORIES: {
//     STARTER: 'starter',
//     GROWTH: 'growth',
//     ENTERPRISE: 'enterprise',
//     CUSTOM: 'custom'
//   },

//   // User roles
//   USER_ROLES: {
//     ADMIN: 'admin',
//     MANAGER: 'manager',
//     ANALYST: 'analyst',
//     CUSTOMER: 'customer',
//     GUEST: 'guest'
//   },

//   // Social platforms
//   SOCIAL_PLATFORMS: {
//     WHATSAPP: 'whatsapp',
//     FACEBOOK: 'facebook',
//     TWITTER: 'twitter',
//     INSTAGRAM: 'instagram',
//     LINKEDIN: 'linkedin',
//     TELEGRAM: 'telegram',
//     EMAIL: 'email'
//   },

//   // Share types
//   SHARE_TYPES: {
//     DIRECT: 'direct',
//     QR: 'qr',
//     MESSAGE: 'message',
//     POST: 'post',
//     TWEET: 'tweet',
//     STORY: 'story',
//     REEL: 'reel'
//   },

//   // Pricing automation settings
//   AUTOMATION_SETTINGS: {
//     MIN_DEMAND_FACTOR: 0.5,
//     MAX_DEMAND_FACTOR: 2.0,
//     MIN_PROFIT_MARGIN: 10,
//     MAX_PROFIT_MARGIN: 60,
//     MIN_SEASONAL_ADJ: -30,
//     MAX_SEASONAL_ADJ: 50
//   },

//   // Discount limits
//   DISCOUNT_LIMITS: {
//     MAX_ANNUAL_DISCOUNT: 40,
//     MAX_COUPON_DISCOUNT: 50,
//     MAX_TOTAL_DISCOUNT: 70
//   },

//   // Validation constants
//   VALIDATION: {
//     PASSWORD_MIN_LENGTH: 8,
//     PASSWORD_MAX_LENGTH: 128,
//     NAME_MIN_LENGTH: 2,
//     NAME_MAX_LENGTH: 50,
//     EMAIL_MAX_LENGTH: 100,
//     PHONE_MAX_LENGTH: 20
//   },

//   // Rate limiting
//   RATE_LIMITS: {
//     API: {
//       WINDOW_MS: 15 * 60 * 1000, // 15 minutes
//       MAX_REQUESTS: 100
//     },
//     AUTH: {
//       WINDOW_MS: 60 * 60 * 1000, // 1 hour
//       MAX_REQUESTS: 5
//     },
//     SOCIAL_SHARE: {
//       WINDOW_MS: 24 * 60 * 60 * 1000, // 24 hours
//       MAX_REQUESTS: 50
//     }
//   },

//   // Cache TTLs (in seconds)
//   CACHE_TTL: {
//     PLANS: 300, // 5 minutes
//     PRICE_HISTORY: 600, // 10 minutes
//     ANALYTICS: 900, // 15 minutes
//     USER_DATA: 1800, // 30 minutes
//     COMPETITOR_PRICES: 3600 // 1 hour
//   },

//   // Job intervals
//   JOB_INTERVALS: {
//     PRICE_UPDATE: '*/5 * * * *', // Every 5 minutes
//     COMPETITOR_SYNC: '0 */6 * * *', // Every 6 hours
//     ANALYTICS_CLEANUP: '0 0 * * 0', // Weekly on Sunday
//     BACKUP: '0 2 * * *' // Daily at 2 AM
//   },

//   // File upload limits
//   UPLOAD_LIMITS: {
//     MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
//     ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
//     ALLOWED_DOC_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
//   },

//   // Response messages
//   MESSAGES: {
//     SUCCESS: 'Operation completed successfully',
//     ERROR: 'An error occurred',
//     NOT_FOUND: 'Resource not found',
//     UNAUTHORIZED: 'Unauthorized access',
//     FORBIDDEN: 'Access forbidden',
//     VALIDATION_ERROR: 'Validation failed',
//     INVALID_CREDENTIALS: 'Invalid credentials',
//     EMAIL_EXISTS: 'Email already exists',
//     USER_NOT_FOUND: 'User not found',
//     INVALID_TOKEN: 'Invalid or expired token',
//     RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later'
//   },

//   // HTTP Status Codes
//   STATUS_CODES: {
//     OK: 200,
//     CREATED: 201,
//     ACCEPTED: 202,
//     NO_CONTENT: 204,
//     BAD_REQUEST: 400,
//     UNAUTHORIZED: 401,
//     FORBIDDEN: 403,
//     NOT_FOUND: 404,
//     METHOD_NOT_ALLOWED: 405,
//     CONFLICT: 409,
//     UNPROCESSABLE_ENTITY: 422,
//     TOO_MANY_REQUESTS: 429,
//     INTERNAL_SERVER_ERROR: 500,
//     SERVICE_UNAVAILABLE: 503
//   }
// };


export default {
  // Pricing constants
  CURRENCY: {
    SYMBOL: '₹',
    NAME: 'Indian Rupee',
    CODE: 'INR',
    LOCALE: 'en-IN'
  },

  TAX_RATES: {
    GST: 18,
    SGST: 9,
    CGST: 9
  },

  // Vendor types
  VENDOR_TYPES: {
    INDIVIDUAL: 'individual',
    COMPANY: 'company',
    STARTUP: 'startup',
    ENTERPRISE: 'enterprise'
  },

  // Plan categories
  PLAN_CATEGORIES: {
    STARTER: 'starter',
    GROWTH: 'growth',
    ENTERPRISE: 'enterprise',
    CUSTOM: 'custom'
  },

  // Automation status
  AUTOMATION_STATUS: {
    ACTIVE: 'active',
    PAUSED: 'paused',
    DISABLED: 'disabled'
  },

  // Market conditions
  MARKET_CONDITIONS: {
    DEMAND_LEVELS: [
      { value: 'low', label: 'Low Demand', multiplier: 0.9 },
      { value: 'normal', label: 'Normal', multiplier: 1.0 },
      { value: 'high', label: 'High Demand', multiplier: 1.1 }
    ],
    SEASONS: [
      { value: 'regular', label: 'Regular Season', multiplier: 1.0 },
      { value: 'holiday', label: 'Holiday Season', multiplier: 1.15 },
      { value: 'off-peak', label: 'Off-Peak Season', multiplier: 0.85 }
    ]
  },

  // Subscription status
  SUBSCRIPTION_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    TRIAL: 'trial',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
  },

  // Coupon types
  COUPON_TYPES: {
    PERCENTAGE: 'percentage',
    FIXED_AMOUNT: 'fixed_amount',
    FREE_TRIAL: 'free_trial'
  },

  // Notification types
  NOTIFICATION_TYPES: {
    PRICE_CHANGE: 'price_change',
    AUTOMATION_UPDATE: 'automation_update',
    COUPON_APPLIED: 'coupon_applied',
    SUBSCRIPTION_RENEWAL: 'subscription_renewal',
    SHARE_ALERT: 'share_alert'
  },

  // Rate limits
  RATE_LIMITS: {
    API: 100,
    AUTH: 10,
    SHARE: 20
  },

  // Cache TTL (in seconds)
  CACHE_TTL: {
    PRICING: 300,
    ANALYTICS: 600,
    VENDOR_DATA: 1800
  }
};