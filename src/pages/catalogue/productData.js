// productData.js
export const initialProductState = {
  title: '',
  sku: '',
  asin: '',
  brand: '',
  price: '',
  quantity: '',
  category: '',
  status: 'draft',
  fulfillment: 'FBM',
  description: '',
  bulletPoints: ['', '', '', '', ''],
  keywords: '',
  mainImage: '',
  additionalImages: [],
  weight: '',
  dimensions: { length: '', width: '', height: '' },
  packageDimensions: { length: '', width: '', height: '' },
  packageWeight: '',
  hazardous: false,
  adultProduct: false,
  condition: 'New',
  conditionNote: '',
  taxCode: 'A_GEN_TAX',
  productType: '',
  variationTheme: '',
  parentChild: '',
  parentSku: '',
  relationshipType: '',
  shippingType: 'Standard',
  batteryType: '',
  manufacturer: ''
};

export const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Automotive",
  "Grocery & Gourmet Food",
  "Health & Household",
  "Toys & Games",
  "Baby Products",
  "Pet Supplies",
  "Office Products",
  "Arts, Crafts & Sewing",
  "Industrial & Scientific",
  "Musical Instruments",
  "Books",
  "Movies & TV",
  "Video Games",
  "Software",
  "Cell Phones & Accessories",
  "Computers & Accessories",
  "Camera & Photo",
  "Tools & Home Improvement",
  "Home & Garden",
  "Luggage & Travel Gear",
  "Jewelry",
  "Watches",
  "Shoes",
  "Handbags",
  "Clothing"
];

// export const conditions = [
//   { value: "New", label: "New" },
//   { value: "Refurbished", label: "Refurbished" },
//   { value: "UsedLikeNew", label: "Used - Like New" },
//   { value: "UsedVeryGood", label: "Used - Very Good" },
//   { value: "UsedGood", label: "Used - Good" },

// ];

export const fulfillmentOptions = [
  { value: "FBM", label: "Fulfilled by Merchant" },
  { value: "FBA", label: "Fulfilled by Amazon" }
];

export const shippingTypes = [
  { value: "Standard", label: "Standard Shipping" },
  { value: "Expedited", label: "Expedited Shipping" },
  { value: "International", label: "International Shipping" },
  { value: "TwoDay", label: "Two-Day Shipping" },
  { value: "OneDay", label: "One-Day Shipping" }
];

export const batteryTypes = [
  { value: "", label: "None" },
  { value: "LithiumIon", label: "Lithium Ion" },
  { value: "LithiumPolymer", label: "Lithium Polymer" },
  { value: "Alkaline", label: "Alkaline" },
  { value: "NiMH", label: "Nickel Metal Hydride" },
  { value: "NiCd", label: "Nickel Cadmium" },
  { value: "LeadAcid", label: "Lead Acid" },
  { value: "ButtonCell", label: "Button Cell" }
];

export const taxCodes = [
  { value: "A_GEN_TAX", label: "A_GEN_TAX - General Taxable Products" },
  { value: "A_GEN_NOTAX", label: "A_GEN_NOTAX - General Non-Taxable Products" },
  { value: "A_BABY_TAX", label: "A_BABY_TAX - Baby Products" },
  { value: "A_FOOD_TAX", label: "A_FOOD_TAX - Food Products" },
  { value: "A_CLTH_TAX", label: "A_CLTH_TAX - Clothing" },
  { value: "A_CLTH_NOTAX", label: "A_CLTH_NOTAX - Clothing (Non-Taxable)" },
  { value: "A_DGMT_TAX", label: "A_DGMT_TAX - Digital Media" },
  { value: "A_MEDIA_TAX", label: "A_MEDIA_TAX - Media Products" }
];

export const productTypes = [
  { value: "", label: "Select Product Type" },
  { value: "Physical", label: "Physical Product" },
  { value: "Digital", label: "Digital Product" },
  { value: "Service", label: "Service" }
];

export const variationThemes = [
  { value: "", label: "No Variations" },
  { value: "Size", label: "Size" },
  { value: "Color", label: "Color" },
  { value: "SizeColor", label: "Size-Color" },
  { value: "Style", label: "Style" },
  { value: "Material", label: "Material" }
];

// Validation rules
export const validationRules = {
  title: {
    required: true,
    maxLength: 500,
    minLength: 1
  },
  sku: {
    required: true,
    maxLength: 40,
    pattern: /^[A-Za-z0-9-_]+$/
  },
  asin: {
    required: false,
    pattern: /^[A-Z0-9]{10}$/,
    message: "ASIN must be exactly 10 uppercase letters and numbers"
  },
  brand: {
    required: true,
    maxLength: 50
  },
  price: {
    required: true,
    min: 0.01,
    max: 100000
  },
  quantity: {
    required: true,
    min: 0,
    max: 999999
  },
  category: {
    required: true
  },
  bulletPoints: {
    minRequired: 1,
    maxLength: 500
  }
};

// Helper functions
export const validateProduct = (product) => {
  const errors = [];

  // Title validation
  if (!product.title?.trim()) {
    errors.push("Product title is required");
  } else if (product.title.length > validationRules.title.maxLength) {
    errors.push(`Product title must be less than ${validationRules.title.maxLength} characters`);
  }

  // SKU validation
  if (!product.sku?.trim()) {
    errors.push("SKU is required");
  } else if (product.sku.length > validationRules.sku.maxLength) {
    errors.push(`SKU must be less than ${validationRules.sku.maxLength} characters`);
  } else if (!validationRules.sku.pattern.test(product.sku)) {
    errors.push("SKU can only contain letters, numbers, hyphens, and underscores");
  }

  // Brand validation
  if (!product.brand?.trim()) {
    errors.push("Brand is required");
  }

  // Price validation
  if (!product.price) {
    errors.push("Price is required");
  } else {
    const price = parseFloat(product.price);
    if (price < validationRules.price.min || price > validationRules.price.max) {
      errors.push(`Price must be between $${validationRules.price.min} and $${validationRules.price.max}`);
    }
  }

  // Quantity validation
  if (product.quantity === "" || product.quantity === null) {
    errors.push("Quantity is required");
  } else {
    const quantity = parseInt(product.quantity);
    if (quantity < validationRules.quantity.min || quantity > validationRules.quantity.max) {
      errors.push(`Quantity must be between ${validationRules.quantity.min} and ${validationRules.quantity.max}`);
    }
  }

  // Category validation
  if (!product.category?.trim()) {
    errors.push("Category is required");
  }

  // ASIN validation
  if (product.asin && !validationRules.asin.pattern.test(product.asin)) {
    errors.push(validationRules.asin.message);
  }

  // Bullet points validation
  const meaningfulBulletPoints = product.bulletPoints?.filter(
    (p) => p && p.trim().length > 0
  );
  if (!meaningfulBulletPoints || meaningfulBulletPoints.length < validationRules.bulletPoints.minRequired) {
    errors.push(`At least ${validationRules.bulletPoints.minRequired} key product feature is required`);
  }

  // Main image validation
  if (!product.mainImage?.trim()) {
    errors.push("Main image is required");
  }

  return errors;
};

// Format product for API submission
export const formatProductForAPI = (product) => {
  const meaningfulBulletPoints = product.bulletPoints?.filter(
    (p) => p && p.trim().length > 0
  );

  return {
    ...product,
    title: product.title?.trim() || '',
    sku: product.sku?.trim() || '',
    brand: product.brand?.trim() || '',
    price: parseFloat(product.price) || 0,
    quantity: parseInt(product.quantity) || 0,
    bulletPoints: meaningfulBulletPoints || [],
    asin: product.asin?.trim() || undefined,
    description: product.description?.trim() || '',
    weight: product.weight ? parseFloat(product.weight) : undefined,
    packageWeight: product.packageWeight ? parseFloat(product.packageWeight) : undefined,
    dimensions: {
      length: product.dimensions?.length ? parseFloat(product.dimensions.length) : undefined,
      width: product.dimensions?.width ? parseFloat(product.dimensions.width) : undefined,
      height: product.dimensions?.height ? parseFloat(product.dimensions.height) : undefined,
    },
    packageDimensions: {
      length: product.packageDimensions?.length ? parseFloat(product.packageDimensions.length) : undefined,
      width: product.packageDimensions?.width ? parseFloat(product.packageDimensions.width) : undefined,
      height: product.packageDimensions?.height ? parseFloat(product.packageDimensions.height) : undefined,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};