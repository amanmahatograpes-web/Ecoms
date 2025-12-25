const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  duration: {
    type: Number // in seconds
  },
  mimetype: {
    type: String,
    required: true
  },
  thumbnail: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'ready', 'error'],
    default: 'uploaded'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);