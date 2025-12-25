const express = require('express');
const router = express.Router();
const imageController = require('../controller/imageController');
const uploadMiddleware = require('../middleware/upload');

// Get all images
router.get('/', imageController.getImages);

// Upload single image
router.post('/upload',
  uploadMiddleware.uploadImage.single('image'),
  uploadMiddleware.handleUploadError,
  imageController.uploadImage
);

// Upload multiple images
router.post('/upload-multiple',
  uploadMiddleware.uploadImages,
  uploadMiddleware.handleUploadError,
  imageController.uploadMultipleImages
);

// Delete image
router.delete('/:id', imageController.deleteImage);

module.exports = router;