const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const uploadMiddleware = require('../middleware/upload');

// Get all videos
router.get('/', videoController.getVideos);

// Upload video
router.post('/upload',
  uploadMiddleware.uploadVideo.single('video'),
  uploadMiddleware.handleUploadError,
  videoController.uploadVideo
);

// Upload multiple videos
router.post('/upload-multiple',
  uploadMiddleware.uploadVideos,
  uploadMiddleware.handleUploadError,
  videoController.uploadVideo // You might want to create a separate method for multiple videos
);

// Delete video
router.delete('/:id', videoController.deleteVideo);

module.exports = router;