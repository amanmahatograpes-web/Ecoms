// // // controllers/productController.js
// // const fs = require('fs');
// // const path = require('path');
// // const csv = require('csv-parser');
// // const Product = require('../models/Product');

// // exports.list = async (req, res) => {
// //   try {
// //     const {
// //       page = 1, limit = 50, search = '', status = '', fulfillment = '', category = '', sortBy = 'createdAt', sortOrder = 'desc'
// //     } = req.query;

// //     const query = {};
// //     if (search) {
// //       const s = search.trim();
// //       query.$or = [
// //         { title: { $regex: s, $options: 'i' } },
// //         { sku: { $regex: s, $options: 'i' } },
// //         { brand: { $regex: s, $options: 'i' } }
// //       ];
// //     }
// //     if (status) query.status = status;
// //     if (fulfillment) query.fulfillment = fulfillment;
// //     if (category) query.category = category;

// //     const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
// //     const sortObj = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

// //     const [products, total] = await Promise.all([
// //       Product.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean(),
// //       Product.countDocuments(query)
// //     ]);

// //     res.json({ products, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };

// // exports.getOne = async (req, res) => {
// //   try {
// //     const p = await Product.findById(req.params.id);
// //     if (!p) return res.status(404).json({ error: 'Product not found' });
// //     res.json({ product: p });
// //   } catch (err) {
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };

// // exports.create = async (req, res) => {
// //   try {
// //     const payload = req.body;
// //     // Ensure SKU exists
// //     if (!payload.sku || !payload.title) return res.status(400).json({ error: 'sku and title are required' });

// //     // Default bullets if passed as empty array from frontend
// //     if (!payload.bulletPoints) payload.bulletPoints = [];

// //     const p = new Product(payload);
// //     await p.save();
// //     res.status(201).json({ product: p });
// //   } catch (err) {
// //     if (err.code === 11000) return res.status(400).json({ error: 'SKU already exists' });
// //     console.error(err);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };

// // exports.update = async (req, res) => {
// //   try {
// //     const updates = req.body;
// //     const p = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
// //     if (!p) return res.status(404).json({ error: 'Product not found' });
// //     res.json({ product: p });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };

// // exports.remove = async (req, res) => {
// //   try {
// //     const p = await Product.findByIdAndDelete(req.params.id);
// //     if (!p) return res.status(404).json({ error: 'Product not found' });
// //     res.json({ message: 'Deleted', product: p });
// //   } catch (err) {
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };

// // exports.bulkUpdate = async (req, res) => {
// //   try {
// //     const { productIds, updates } = req.body;
// //     if (!Array.isArray(productIds) || productIds.length === 0) return res.status(400).json({ error: 'productIds required' });

// //     const result = await Product.updateMany({ _id: { $in: productIds } }, { $set: updates });
// //     res.json({ modifiedCount: result.modifiedCount || result.nModified || 0 });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };

// // exports.bulkDelete = async (req, res) => {
// //   try {
// //     const { productIds } = req.body;
// //     if (!Array.isArray(productIds) || productIds.length === 0) return res.status(400).json({ error: 'productIds required' });

// //     const result = await Product.deleteMany({ _id: { $in: productIds } });
// //     res.json({ deletedCount: result.deletedCount || 0 });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };

// // exports.bulkUploadCSV = async (req, res) => {
// //   try {
// //     if (!req.file) return res.status(400).json({ error: 'CSV file required' });
// //     const results = [];
// //     const filePath = path.resolve(req.file.path);

// //     fs.createReadStream(filePath)
// //       .pipe(csv())
// //       .on('data', (data) => results.push(data))
// //       .on('end', async () => {
// //         const created = [];
// //         const errors = [];
// //         for (let i = 0; i < results.length; i++) {
// //           const row = results[i];
// //           try {
// //             const product = new Product({
// //               sku: row.SKU || `SKU-${Date.now()}-${i}`,
// //               title: row.Title || row.name || 'No title',
// //               brand: row.Brand || '',
// //               category: row.Category || '',
// //               price: parseFloat(row.Price) || 0,
// //               quantity: parseInt(row.Quantity) || 0,
// //               fulfillment: row.Fulfillment || 'FBA',
// //               status: row.Status || 'active'
// //             });
// //             await product.save();
// //             created.push(product);
// //           } catch (err) {
// //             errors.push({ row: i + 1, error: err.message });
// //           }
// //         }
// //         // remove file
// //         fs.unlinkSync(filePath);
// //         res.json({ createdCount: created.length, errors });
// //       });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };



// // import Product from "../models/Product.js";

// // // @desc    Get all products (filtered by vendor)
// // // @route   GET /api/products?vendorId=xxx
// // // @access  Public
// // export const getProducts = async (req, res) => {
// //   try {
// //     const { vendorId, status, fulfillment, search } = req.query;
    
// //     let filter = {};
    
// //     // Filter by vendor
// //     if (vendorId) {
// //       filter.vendorId = vendorId;
// //     }
    
// //     // Filter by status
// //     if (status && status !== 'all') {
// //       filter.status = status;
// //     }
    
// //     // Filter by fulfillment
// //     if (fulfillment && fulfillment !== 'all') {
// //       filter.fulfillment = fulfillment;
// //     }
    
// //     // Search filter
// //     if (search) {
// //       filter.$or = [
// //         { title: { $regex: search, $options: 'i' } },
// //         { sku: { $regex: search, $options: 'i' } },
// //         { brand: { $regex: search, $options: 'i' } },
// //       ];
// //     }
    
// //     const products = await Product.find(filter).sort({ createdAt: -1 });
    
// //     res.status(200).json({
// //       success: true,
// //       count: products.length,
// //       products,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching products:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching products",
// //       error: error.message,
// //     });
// //   }
// // };

// // // @desc    Get single product by ID
// // // @route   GET /api/products/:id
// // // @access  Public
// // export const getProductById = async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);
    
// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Product not found",
// //       });
// //     }
    
// //     res.status(200).json({
// //       success: true,
// //       product,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching product:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching product",
// //       error: error.message,
// //     });
// //   }
// // };

// // // @desc    Create new product
// // // @route   POST /api/products
// // // @access  Private
// // export const createProduct = async (req, res) => {
// //   try {
// //     const productData = req.body;
    
// //     // Validate required fields
// //     if (!productData.sku || !productData.title || !productData.price) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please provide SKU, title, and price",
// //       });
// //     }
    
// //     // Check if SKU already exists for this vendor
// //     const existingProduct = await Product.findOne({
// //       sku: productData.sku,
// //       vendorId: productData.vendorId || 'default-vendor',
// //     });
    
// //     if (existingProduct) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Product with this SKU already exists",
// //       });
// //     }
    
// //     const product = await Product.create(productData);
    
// //     res.status(201).json({
// //       success: true,
// //       message: "Product created successfully",
// //       product,
// //     });
// //   } catch (error) {
// //     console.error("Error creating product:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error creating product",
// //       error: error.message,
// //     });
// //   }
// // };

// // // @desc    Update product
// // // @route   PUT /api/products/:id
// // // @access  Private
// // export const updateProduct = async (req, res) => {
// //   try {
// //     const product = await Product.findByIdAndUpdate(
// //       req.params.id,
// //       { ...req.body, updatedAt: new Date() },
// //       { new: true, runValidators: true }
// //     );
    
// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Product not found",
// //       });
// //     }
    
// //     res.status(200).json({
// //       success: true,
// //       message: "Product updated successfully",
// //       product,
// //     });
// //   } catch (error) {
// //     console.error("Error updating product:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error updating product",
// //       error: error.message,
// //     });
// //   }
// // };

// // // @desc    Delete product
// // // @route   DELETE /api/products/:id
// // // @access  Private
// // export const deleteProduct = async (req, res) => {
// //   try {
// //     const product = await Product.findByIdAndDelete(req.params.id);
    
// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Product not found",
// //       });
// //     }
    
// //     res.status(200).json({
// //       success: true,
// //       message: "Product deleted successfully",
// //     });
// //   } catch (error) {
// //     console.error("Error deleting product:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error deleting product",
// //       error: error.message,
// //     });
// //   }
// // };

// // // @desc    Bulk delete products
// // // @route   POST /api/products/bulk-delete
// // // @access  Private
// // export const bulkDeleteProducts = async (req, res) => {
// //   try {
// //     const { ids } = req.body;
    
// //     if (!ids || !Array.isArray(ids) || ids.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please provide an array of product IDs",
// //       });
// //     }
    
// //     const result = await Product.deleteMany({ _id: { $in: ids } });
    
// //     res.status(200).json({
// //       success: true,
// //       message: `${result.deletedCount} products deleted successfully`,
// //       deletedCount: result.deletedCount,
// //     });
// //   } catch (error) {
// //     console.error("Error bulk deleting products:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error deleting products",
// //       error: error.message,
// //     });
// //   }
// // };



// import Product from "../models/Product.js";

// // @desc    Get all products (filtered by vendor)
// // @route   GET /api/products?vendorId=xxx
// // @access  Public
// export const getProducts = async (req, res) => {
//   try {
//     const { vendorId, status, fulfillment, search, category } = req.query;
    
//     let filter = {};
    
//     // Filter by vendor
//     if (vendorId) {
//       filter.vendorId = vendorId;
//     }
    
//     // Filter by status
//     if (status && status !== 'all') {
//       filter.status = status;
//     }
    
//     // Filter by fulfillment
//     if (fulfillment && fulfillment !== 'all') {
//       filter.fulfillment = fulfillment;
//     }
    
//     // Filter by category
//     if (category && category !== 'all') {
//       filter.category = category;
//     }
    
//     // Search filter
//     if (search) {
//       filter.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { sku: { $regex: search, $options: 'i' } },
//         { brand: { $regex: search, $options: 'i' } },
//         { productId: { $regex: search, $options: 'i' } },
//       ];
//     }
    
//     const products = await Product.find(filter).sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//       error: error.message,
//     });
//   }
// };

// // @desc    Get product statistics
// // @route   GET /api/products/stats?vendorId=xxx
// // @access  Public
// export const getProductStats = async (req, res) => {
//   try {
//     const { vendorId } = req.query;
    
//     let filter = {};
//     if (vendorId) {
//       filter.vendorId = vendorId;
//     }
    
//     const products = await Product.find(filter);
    
//     // Calculate statistics
//     const total = products.length;
//     const active = products.filter(p => p.status === 'active').length;
//     const outOfStock = products.filter(p => p.quantity === 0 || p.quantity < 1).length;
//     const lowStock = products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length;
//     const fbaCount = products.filter(p => p.fulfillment === 'FBA').length;
//     const fbmCount = products.filter(p => p.fulfillment === 'FBM').length;
    
//     const totalValue = products.reduce((sum, p) => 
//       sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0
//     );
    
//     const avgPrice = total > 0 ? 
//       products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / total : 0;
    
//     // Category breakdown
//     const categoryBreakdown = products.reduce((acc, p) => {
//       const category = p.category || 'uncategorized';
//       acc[category] = (acc[category] || 0) + 1;
//       return acc;
//     }, {});
    
//     // Status breakdown
//     const statusBreakdown = products.reduce((acc, p) => {
//       const status = p.status || 'inactive';
//       acc[status] = (acc[status] || 0) + 1;
//       return acc;
//     }, {});
    
//     res.status(200).json({
//       success: true,
//       stats: {
//         total,
//         active,
//         outOfStock,
//         lowStock,
//         fbaCount,
//         fbmCount,
//         totalValue,
//         avgPrice,
//         categoryBreakdown,
//         statusBreakdown,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching product stats:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching product statistics",
//       error: error.message,
//     });
//   }
// };

// // @desc    Get single product by ID
// // @route   GET /api/products/:id
// // @access  Public
// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching product",
//       error: error.message,
//     });
//   }
// };

// // @desc    Create new product
// // @route   POST /api/products
// // @access  Private
// export const createProduct = async (req, res) => {
//   try {
//     const productData = req.body;
    
//     // Validate required fields
//     if (!productData.sku || !productData.title || !productData.brand || !productData.category || !productData.price || !productData.quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide SKU, title, brand, category, price, and quantity",
//       });
//     }
    
//     // Set default vendor if not provided
//     if (!productData.vendorId) {
//       productData.vendorId = 'default-vendor';
//     }
    
//     // Check if SKU already exists for this vendor
//     const existingProduct = await Product.findOne({
//       sku: productData.sku,
//       vendorId: productData.vendorId,
//     });
    
//     if (existingProduct) {
//       return res.status(400).json({
//         success: false,
//         message: "Product with this SKU already exists for this vendor",
//       });
//     }
    
//     // Process images if provided
//     if (productData.images && Array.isArray(productData.images)) {
//       productData.images = productData.images.map(img => ({
//         preview: img.preview || img.data || '',
//         url: img.url || img.data || '',
//       }));
//     }
    
//     const product = await Product.create(productData);
    
//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Error creating product:", error);
    
//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Product with this SKU already exists for this vendor",
//       });
//     }
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors,
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: "Error creating product",
//       error: error.message,
//     });
//   }
// };

// // @desc    Update product
// // @route   PUT /api/products/:id
// // @access  Private
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;
    
//     // Process images if provided
//     if (updateData.images && Array.isArray(updateData.images)) {
//       updateData.images = updateData.images.map(img => ({
//         preview: img.preview || img.data || '',
//         url: img.url || img.data || '',
//       }));
//     }
    
//     const product = await Product.findByIdAndUpdate(
//       id,
//       { ...updateData, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     );
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
    
//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Product with this SKU already exists for this vendor",
//       });
//     }
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors,
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: "Error updating product",
//       error: error.message,
//     });
//   }
// };

// // @desc    Delete product
// // @route   DELETE /api/products/:id
// // @access  Private
// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: "Product deleted successfully",
//       product: {
//         id: product._id,
//         sku: product.sku,
//         title: product.title,
//       },
//     });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting product",
//       error: error.message,
//     });
//   }
// };

// // @desc    Bulk delete products
// // @route   POST /api/products/bulk-delete
// // @access  Private
// export const bulkDeleteProducts = async (req, res) => {
//   try {
//     const { productIds } = req.body;
    
//     if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of product IDs",
//       });
//     }
    
//     const result = await Product.deleteMany({ _id: { $in: productIds } });
    
//     res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} products deleted successfully`,
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("Error bulk deleting products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting products",
//       error: error.message,
//     });
//   }
// };



// const Product = require('../models/Product');
// const { validationResult } = require('express-validator');

// // Get all products with filtering and pagination
// exports.getProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search,
//       category,
//       status,
//       brand,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;

//     // Build filter object
//     const filter = {};
    
//     if (search) {
//       filter.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { sku: { $regex: search, $options: 'i' } },
//         { brand: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (category) filter.category = category;
//     if (status) filter.status = status;
//     if (brand) filter.brand = brand;

//     // Sort configuration
//     const sort = {};
//     sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

//     const products = await Product.find(filter)
//       .sort(sort)
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Product.countDocuments(filter);

//     res.json({
//       success: true,
//       data: products,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / limit),
//         total
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching products',
//       error: error.message
//     });
//   }
// };

// // Get product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching product',
//       error: error.message
//     });
//   }
// };

// // Create new product
// exports.createProduct = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     // Check if SKU already exists
//     const existingProduct = await Product.findOne({ sku: req.body.sku });
//     if (existingProduct) {
//       return res.status(400).json({
//         success: false,
//         message: 'Product with this SKU already exists'
//       });
//     }

//     const product = new Product(req.body);
//     await product.save();

//     res.status(201).json({
//       success: true,
//       message: 'Product created successfully',
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating product',
//       error: error.message
//     });
//   }
// };

// // Update product
// exports.updateProduct = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Product updated successfully',
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating product',
//       error: error.message
//     });
//   }
// };

// // Delete product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Product deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting product',
//       error: error.message
//     });
//   }
// };

// // Bulk upload products
// exports.bulkUploadProducts = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'No file uploaded'
//       });
//     }

//     // This is a simplified version - you would need to implement CSV/Excel parsing
//     const productsData = []; // Parse your file here
//     const results = {
//       processed: 0,
//       successful: 0,
//       failed: 0,
//       errors: []
//     };

//     for (const productData of productsData) {
//       try {
//         const product = new Product(productData);
//         await product.save();
//         results.successful++;
//       } catch (error) {
//         results.failed++;
//         results.errors.push(`Row ${results.processed + 1}: ${error.message}`);
//       }
//       results.processed++;
//     }

//     res.json({
//       success: true,
//       message: 'Bulk upload completed',
//       data: results
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error processing bulk upload',
//       error: error.message
//     });
//   }
// };

// // Get product statistics
// exports.getProductStats = async (req, res) => {
//   try {
//     const totalProducts = await Product.countDocuments();
//     const activeProducts = await Product.countDocuments({ status: 'active' });
//     const outOfStockProducts = await Product.countDocuments({ status: 'out_of_stock' });
//     const lowStockProducts = await Product.countDocuments({
//       quantity: { $gt: 0, $lte: 10 },
//       status: 'active'
//     });

//     const categoryStats = await Product.aggregate([
//       {
//         $group: {
//           _id: '$category',
//           count: { $sum: 1 },
//           totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         total: totalProducts,
//         active: activeProducts,
//         outOfStock: outOfStockProducts,
//         lowStock: lowStockProducts,
//         categories: categoryStats
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching product statistics',
//       error: error.message
//     });
//   }
// };


import Product from "../models/Product.js";
import { validationResult } from "express-validator";

// Get all products with filtering and pagination
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      brand,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (brand) filter.brand = brand;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const existingProduct = await Product.findOne({ sku: req.body.sku });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU already exists",
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// Bulk delete products
export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    await Product.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: "Bulk delete successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error bulk deleting products",
      error: error.message,
    });
  }
};

// Product statistics
export const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: "active" });
    const outOfStockProducts = await Product.countDocuments({
      status: "out_of_stock",
    });
    const lowStockProducts = await Product.countDocuments({
      quantity: { $gt: 0, $lte: 10 },
      status: "active",
    });

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        total: totalProducts,
        active: activeProducts,
        outOfStock: outOfStockProducts,
        lowStock: lowStockProducts,
        categories: categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product statistics",
      error: error.message,
    });
  }
};
