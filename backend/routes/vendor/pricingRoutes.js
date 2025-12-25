const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const automationController = require('../controllers/automation.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');

// Public routes
router.get('/status', automationController.getEngineStatus);
router.get('/rules', automationController.getRules);
router.get('/rules/:id', automationController.getRuleById);

// Admin routes (protected)
router.post(
  '/engine/start',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  automationController.startEngine
);

router.post(
  '/engine/stop',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  automationController.stopEngine
);

router.post(
  '/rules',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  [
    body('name').isString().notEmpty(),
    body('conditions').optional().isObject(),
    body('actions').isObject(),
    body('enabled').optional().isBoolean(),
    body('priority').optional().isInt({ min: 1, max: 10 })
  ],
  validationMiddleware,
  automationController.createRule
);

router.put(
  '/rules/:id',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  [
    param('id').isMongoId(),
    body().isObject()
  ],
  validationMiddleware,
  automationController.updateRule
);

router.post(
  '/rules/test',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  [
    body('ruleId').isMongoId(),
    body('planId').isMongoId(),
    body('context').optional().isObject()
  ],
  validationMiddleware,
  automationController.testRule
);

router.post(
  '/market/update',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  automationController.updateMarketConditions
);

router.post(
  '/competitors/monitor',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  automationController.monitorCompetitors
);

router.post(
  '/plans/:planId/evaluate',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  [
    param('planId').isMongoId(),
    body('context').optional().isObject()
  ],
  validationMiddleware,
  automationController.evaluatePlan
);

router.get(
  '/stats',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  automationController.getAutomationStats
);

module.exports = router;