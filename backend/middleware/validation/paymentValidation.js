const Joi = require('joi');

const initializePaymentSchema = Joi.object({
  planId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'any.required': 'Plan ID is required',
      'string.hex': 'Invalid Plan ID format',
      'string.length': 'Plan ID must be 24 characters'
    }),
    
  paymentMethod: Joi.string()
    .valid('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash')
    .required()
    .messages({
      'any.required': 'Payment method is required',
      'any.only': 'Invalid payment method'
    }),
    
  gateway: Joi.string()
    .valid('razorpay', 'stripe', 'paypal', 'instamojo', 'cashfree')
    .default('razorpay'),
    
  couponCode: Joi.string()
    .max(50)
    .allow('', null),
    
  billingAddress: Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[+]?[\d\s\-()]+$/),
    addressLine1: Joi.string().max(200).required(),
    addressLine2: Joi.string().max(200).allow('', null),
    city: Joi.string().max(50).required(),
    state: Joi.string().max(50).required(),
    country: Joi.string().max(50).default('India'),
    zipCode: Joi.string().max(20).required()
  }),
    
  notes: Joi.string()
    .max(500)
    .allow('', null),
    
  metadata: Joi.object()
});

const verifyOTPSchema = Joi.object({
  paymentId: Joi.string()
    .required()
    .messages({
      'any.required': 'Payment ID is required'
    }),
    
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'any.required': 'OTP is required',
      'string.pattern.base': 'OTP must be 6 digits'
    }),
    
  gatewayPaymentId: Joi.string()
});

const refundPaymentSchema = Joi.object({
  reason: Joi.string()
    .max(200)
    .required()
    .messages({
      'any.required': 'Refund reason is required'
    }),
    
  refundAmount: Joi.number()
    .positive()
    .messages({
      'number.positive': 'Refund amount must be positive'
    }),
    
  notes: Joi.string()
    .max(500)
    .allow('', null)
});

const webhookSchema = Joi.object({
  event: Joi.string().required(),
  payload: Joi.object().required(),
  signature: Joi.string().required()
});

module.exports = {
  initializePaymentSchema,
  verifyOTPSchema,
  refundPaymentSchema,
  webhookSchema
};