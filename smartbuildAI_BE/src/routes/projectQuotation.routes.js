const express = require('express');
const projectQuotationController = require('../controllers/projectQuotation.controller');

const router = express.Router();

// GET /api/projectQuotations
router.get('/', projectQuotationController.getProjectQuotations);

module.exports = router;

