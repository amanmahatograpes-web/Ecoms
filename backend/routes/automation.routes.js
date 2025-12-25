const express = require('express');
const router = express.Router();

// GET /api/automation - Basic info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Automation API is working'
  });
});

// GET /api/automation/status - Get automation status (REQUIRED FOR YOUR API CLIENT)
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Automation status retrieved',
    data: {
      isRunning: true,
      lastRun: '2024-01-15T10:00:00Z',
      nextRun: '2024-01-15T11:00:00Z',
      totalRuns: 156,
      successRate: 98.5
    }
  });
});

// POST /api/automation/start - Start automation (REQUIRED FOR YOUR API CLIENT)
router.post('/start', (req, res) => {
  res.json({
    success: true,
    message: 'Automation started successfully',
    data: {
      startedAt: new Date().toISOString(),
      status: 'running',
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    }
  });
});

// POST /api/automation/stop - Stop automation (REQUIRED FOR YOUR API CLIENT)
router.post('/stop', (req, res) => {
  res.json({
    success: true,
    message: 'Automation stopped successfully',
    data: {
      stoppedAt: new Date().toISOString(),
      status: 'stopped'
    }
  });
});

module.exports = router;