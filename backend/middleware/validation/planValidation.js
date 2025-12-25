const Joi = require('joi');

const planSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Plan name is required',
      'string.min': 'Plan name must be at least 2 characters',
      'string.max': 'Plan name cannot exceed 100 characters'
    }),
    
  description: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.empty': 'Plan description is required',
      'string.max': 'Description cannot exceed 500 characters'
    }),
    
  tagline: Joi.string()
    .max(200)
    .allow('', null),
    
  basePrice: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Base price must be a number',
      'number.positive': 'Base price must be positive'
    }),
    
  currentPrice: Joi.number()
    .positive()
    .min(Joi.ref('basePrice'))
    .messages({
      'number.min': 'Current price cannot be less than base price'
    }),
    
  period: Joi.string()
    .valid('month', 'year', 'quarter', 'week')
    .default('month'),
    
  category: Joi.string()
    .valid('starter', 'growth', 'enterprise', 'custom', 'legacy')
    .default('starter'),
    
  features: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one feature is required'
    }),
    
  isPopular: Joi.boolean()
    .default(false),
    
  isFeatured: Joi.boolean()
    .default(false),
    
  isActive: Joi.boolean()
    .default(true),
    
  trialDays: Joi.number()
    .integer()
    .min(0)
    .max(365)
    .default(0),
    
  maxUsers: Joi.number()
    .integer()
    .min(1),
    
  storage: Joi.string()
    .default('100GB'),
    
  supportType: Joi.string()
    .valid('email', 'priority', '24/7', 'dedicated')
    .default('email'),
    
  billingCycles: Joi.array()
    .items(Joi.string().valid('month', 'year', 'quarter', 'week'))
    .default(['month']),
    
  defaultBillingCycle: Joi.string()
    .valid('month', 'year', 'quarter', 'week')
    .default('month'),
    
  billingCycleDiscounts: Joi.object({
    year: Joi.number().min(0).max(100),
    quarter: Joi.number().min(0).max(100),
    week: Joi.number().min(0).max(100)
  }),
    
  taxPercentage: Joi.number()
    .min(0)
    .max(100)
    .default(18),
    
  automationSettings: Joi.object({
    demandFactor: Joi.number().min(0.5).max(2.0).default(1.0),
    seasonalAdjustment: Joi.number().min(0).max(50).default(0),
    dynamicPricing: Joi.boolean().default(false),
    priceUpdateFrequency: Joi.string()
      .valid('manual', 'weekly', 'monthly', 'quarterly')
      .default('manual')
  }),
    
  availableAddons: Joi.array()
    .items(Joi.object({
      addonId: Joi.string().hex().length(24).required(),
      name: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().positive().required(),
      isRequired: Joi.boolean().default(false),
      isRecommended: Joi.boolean().default(false)
    })),
    
  customizableFeatures: Joi.array()
    .items(Joi.object({
      featureId: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string(),
      tiers: Joi.array()
        .items(Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          description: Joi.string(),
          price: Joi.number().positive().default(0),
          isDefault: Joi.boolean().default(false)
        }))
        .min(1)
    })),
    
  limitations: Joi.array()
    .items(Joi.string()),
    
  slaGuarantee: Joi.number()
    .min(90)
    .max(100),
    
  setupFee: Joi.number()
    .min(0)
    .default(0),
    
  cancellationPolicy: Joi.string()
    .valid('flexible', 'moderate', 'strict')
    .default('flexible'),
    
  contractTerm: Joi.string()
    .valid('month-to-month', 'annual', 'custom')
    .default('month-to-month'),
    
  updateReason: Joi.string()
    .max(200)
    .allow('', null)
});

const updatePlanSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100),
    
  description: Joi.string()
    .max(500),
    
  tagline: Joi.string()
    .max(200)
    .allow('', null),
    
  currentPrice: Joi.number()
    .positive(),
    
  isPopular: Joi.boolean(),
    
  isFeatured: Joi.boolean(),
    
  isActive: Joi.boolean(),
    
  trialDays: Joi.number()
    .integer()
    .min(0)
    .max(365),
    
  maxUsers: Joi.number()
    .integer()
    .min(1),
    
  storage: Joi.string(),
    
  supportType: Joi.string()
    .valid('email', 'priority', '24/7', 'dedicated'),
    
  billingCycles: Joi.array()
    .items(Joi.string().valid('month', 'year', 'quarter', 'week')),
    
  defaultBillingCycle: Joi.string()
    .valid('month', 'year', 'quarter', 'week'),
    
  billingCycleDiscounts: Joi.object({
    year: Joi.number().min(0).max(100),
    quarter: Joi.number().min(0).max(100),
    week: Joi.number().min(0).max(100)
  }),
    
  taxPercentage: Joi.number()
    .min(0)
    .max(100),
    
  automationSettings: Joi.object({
    demandFactor: Joi.number().min(0.5).max(2.0),
    seasonalAdjustment: Joi.number().min(0).max(50),
    dynamicPricing: Joi.boolean(),
    priceUpdateFrequency: Joi.string()
      .valid('manual', 'weekly', 'monthly', 'quarterly')
  }),
    
  availableAddons: Joi.array()
    .items(Joi.object({
      addonId: Joi.string().hex().length(24).required(),
      name: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().positive().required(),
      isRequired: Joi.boolean(),
      isRecommended: Joi.boolean()
    })),
    
  customizableFeatures: Joi.array()
    .items(Joi.object({
      featureId: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string(),
      tiers: Joi.array()
        .items(Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          description: Joi.string(),
          price: Joi.number().positive(),
          isDefault: Joi.boolean()
        }))
    })),
    
  limitations: Joi.array()
    .items(Joi.string()),
    
  slaGuarantee: Joi.number()
    .min(90)
    .max(100),
    
  setupFee: Joi.number()
    .min(0),
    
  cancellationPolicy: Joi.string()
    .valid('flexible', 'moderate', 'strict'),
    
  contractTerm: Joi.string()
    .valid('month-to-month', 'annual', 'custom'),
    
  faqs: Joi.array()
    .items(Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      category: Joi.string()
    })),
    
  updateReason: Joi.string()
    .max(200)
    .allow('', null)
}).min(1);

const priceUpdateSchema = Joi.object({
  newPrice: Joi.number()
    .positive()
    .required()
    .messages({
      'any.required': 'New price is required',
      'number.positive': 'Price must be positive'
    }),
    
  reason: Joi.string()
    .max(200)
    .required()
    .messages({
      'any.required': 'Reason for price change is required'
    }),
    
  effectiveFrom: Joi.date()
    .iso(),
    
  notifyExistingUsers: Joi.boolean()
    .default(false)
});

const featureUpdateSchema = Joi.object({
  features: Joi.array()
    .items(Joi.string()),
    
  newFeatures: Joi.array()
    .items(Joi.string()),
    
  operation: Joi.string()
    .valid('add', 'remove', 'replace', 'update')
    .default('update')
}).custom((value, helpers) => {
  if (value.operation === 'add' && (!value.newFeatures || value.newFeatures.length === 0)) {
    return helpers.error('any.required', { message: 'newFeatures is required for add operation' });
  }
  
  if ((value.operation === 'remove' || value.operation === 'replace' || value.operation === 'update') 
      && (!value.features || value.features.length === 0)) {
    return helpers.error('any.required', { message: 'features is required for this operation' });
  }
  
  return value;
});

module.exports = {
  planSchema,
  updatePlanSchema,
  priceUpdateSchema,
  featureUpdateSchema
};