// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
const express = require('express');
const systemSettingController = require('../controllers/systemSetting.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, requireRole('admin'), systemSettingController.getSettings);
router.put('/site', authMiddleware, requireRole('admin'), systemSettingController.updateSiteSettings);
router.put('/shipping', authMiddleware, requireRole('admin'), systemSettingController.updateShippingSettings);
router.put('/company', authMiddleware, requireRole('admin'), systemSettingController.updateCompanySettings);

module.exports = router;
