import express from 'express';
import applicationsController from '../controller/applicationController.js';

const router = express.Router();

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

export default router;