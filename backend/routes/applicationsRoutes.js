const express = require('express');
const router = express.Router();
const applicationsController = require('../controller/applicationController');

// Health check
router.get('/health', applicationsController.healthCheck);

// Get all applications with filtering
router.get('/', applicationsController.getAllApplications);

// Get application statistics
router.get('/stats', applicationsController.getApplicationStats);

// Get single application by ID
router.get('/:id', applicationsController.getApplicationById);

// Create new application
router.post('/', applicationsController.createApplication);

// Update application status
router.patch('/:id/status', applicationsController.updateApplicationStatus);

// Submit appeal for declined application
router.post('/:id/appeal', applicationsController.submitAppeal);

// Export applications
router.get('/export/export', applicationsController.exportApplications);

module.exports = router;