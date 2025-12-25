const Joi = require('joi');

const couponSchema = Joi.object({
  code: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .uppercase()
    .pattern(/^[A-Z0-9]+$/)
    .messages({
      'string.pattern.base': 'Coupon code can only contain letters and numbers'
    }),
    
  discountType: Joi.string()
    .valid('percentage', 'fixed', 'free_shipping')
    .required()
    .messages({
      'any.only': 'Discount type must be percentage, fixed, or free_shipping'
    }),
    
  discountValue: Joi.number()
    .positive()
    .required()
    .when('discountType', {
      is: 'percentage',
      then: Joi.number().max(100),
      otherwise: Joi.number()
    })
    .messages({
      'number.max': 'Percentage discount cannot exceed 100%'
    }),
    
  minimumPurchase: Joi.number()
    .min(0)
    .default(0),
    
  maximumDiscount: Joi.number()
    .min(0)
    .when('discountType', {
      is: 'percentage',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    
  usageLimit: Joi.number()
    .integer()
    .min(1)
    .allow(null),
    
  validFrom: Joi.date()
    .iso()
    .default(() => new Date()),
    
  validUntil: Joi.date()
    .iso()
    .min(Joi.ref('validFrom'))
    .allow(null),
    
  isActive: Joi.boolean()
    .default(true),
    
  description: Joi.string()
    .max(500)
    .allow('', null),
    
  applicableCategories: Joi.array()
    .items(Joi.string().hex().length(24))
    .default([]),
    
  excludedProducts: Joi.array()
    .items(Joi.string().hex().length(24))
    .default([]),
    
  singleUsePerUser: Joi.boolean()
    .default(false),
    
  firstOrderOnly: Joi.boolean()
    .default(false),
    
  campaign: Joi.string()
    .max(100)
    .allow('', null),
    
  updateReason: Joi.string()
    .max(200)
    .allow('', null)
});

const updateCouponSchema = Joi.object({
  minimumPurchase: Joi.number()
    .min(0),
    
  maximumDiscount: Joi.number()
    .min(0),
    
  usageLimit: Joi.number()
    .integer()
    .min(1)
    .allow(null),
    
  validFrom: Joi.date()
    .iso(),
    
  validUntil: Joi.date()
    .iso()
    .min(Joi.ref('validFrom'))
    .allow(null),
    
  isActive: Joi.boolean(),
    
  description: Joi.string()
    .max(500)
    .allow('', null),
    
  applicableCategories: Joi.array()
    .items(Joi.string().hex().length(24)),
    
  excludedProducts: Joi.array()
    .items(Joi.string().hex().length(24)),
    
  singleUsePerUser: Joi.boolean(),
    
  firstOrderOnly: Joi.boolean(),
    
  updateReason: Joi.string()
    .max(200)
    .allow('', null)
}).min(1);

const validateCouponSchema = Joi.object({
  code: Joi.string()
    .required()
    .trim()
    .uppercase()
    .messages({
      'any.required': 'Coupon code is required'
    }),
    
  amount: Joi.number()
    .min(0)
    .default(0),
    
  userId: Joi.string()
    .hex()
    .length(24)
    .allow(null),
    
  cartItems: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        categoryId: Joi.string().hex().length(24).required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().integer().min(1).required()
      })
    )
    .default([]),
    
  shippingAddress: Joi.object({
    country: Joi.string(),
    state: Joi.string(),
    city: Joi.string()
  })
    .default({})
});

module.exports = {
  couponSchema,
  updateCouponSchema,
  validateCouponSchema
};