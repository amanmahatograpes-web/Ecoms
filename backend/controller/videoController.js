const Video = require('../models/Video');
const fs = require('fs').promises;

// Upload video
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }

    const video = new Video({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: `/uploads/videos/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await video.save();

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message
    });
  }
};

// Get all videos
exports.getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 20, productId } = req.query;
    
    const filter = {};
    if (productId) filter.productId = productId;

    const videos = await Video.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Video.countDocuments(filter);

    res.json({
      success: true,
      data: videos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message
    });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(video.path);
    } catch (fsError) {
      console.warn('Could not delete video file:', fsError.message);
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting video',
      error: error.message
    });
  }
};