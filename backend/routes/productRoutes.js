// // // routes/productRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const multer = require('multer');
// // const path = require('path');
// // const productController = require('../controller/productController');

// // // simple disk storage for csv/uploads
// // const uploadDir = path.join(__dirname, '..', 'uploads');
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, uploadDir);
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, Date.now() + '-' + file.originalname);
// //   }
// // });
// // const upload = multer({ storage });

// // router.get('/', productController.list);
// // router.get('/:id', productController.getOne);
// // router.post('/', productController.create);
// // router.put('/:id', productController.update);
// // router.delete('/:id', productController.remove);

// // router.patch('/bulk-update', productController.bulkUpdate);
// // router.post('/bulk-delete', productController.bulkDelete);

// // // CSV bulk upload endpoint: form-data key 'file'
// // router.post('/bulk-upload', upload.single('file'), productController.bulkUploadCSV);

// // module.exports = router;



// import express from "express";
// import {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   bulkDeleteProducts,
// } from "../controller/productController.js";

// const router = express.Router();

// // Get all products (with vendor filter)
// router.get("/", getProducts);

// // Get single product by ID
// router.get("/:id", getProductById);

// // Create new product
// router.post("/", createProduct);

// // Update product
// router.put("/:id", updateProduct);

// // Delete product
// router.delete("/:id", deleteProduct);

// // Bulk delete products
// router.post("/bulk-delete", bulkDeleteProducts);

// export default router;


import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  getProductStats,
} from "../controller/productController.js";

const router = express.Router();

// Get all products (with vendor filter)
router.get("/", getProducts);

// Get product statistics
router.get("/stats", getProductStats);

// Get single product by ID
router.get("/:id", getProductById);

// Create new product
router.post("/", createProduct);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

// Bulk delete products
router.post("/bulk-delete", bulkDeleteProducts);

export default router;