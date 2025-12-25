const Image = require('../models/Image');
const Product = require('../models/Product');
const fs = require('fs').promises;
const path = require('path');

// Upload single image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const image = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: `/uploads/images/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await image.save();

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
};

// Upload multiple images
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files uploaded'
      });
    }

    const images = await Promise.all(
      req.files.map(async (file) => {
        const image = new Image({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          url: `/uploads/images/${file.filename}`,
          size: file.size,
          mimetype: file.mimetype
        });
        return await image.save();
      })
    );

    res.json({
      success: true,
      message: `${images.length} images uploaded successfully`,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
};

// Get all images
exports.getImages = async (req, res) => {
  try {
    const { page = 1, limit = 20, productId } = req.query;
    
    const filter = {};
    if (productId) filter.productId = productId;

    const images = await Image.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Image.countDocuments(filter);

    res.json({
      success: true,
      data: images,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching images',
      error: error.message
    });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(image.path);
    } catch (fsError) {
      console.warn('Could not delete image file:', fsError.message);
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
};