const ProjectQuotationTemplate = require('../models/ProjectQuotation');
const asyncHandler = require('../middlewares/asyncHandler');

// GET /api/projectQuotations
exports.getProjectQuotations = asyncHandler(async (req, res) => {
  const templates = await ProjectQuotationTemplate.find().lean();
  const result = {};
  templates.forEach(t => {
    result[t.projectType] = {
      baseArea: t.baseArea,
      materials: t.materials
    };
  });
  res.json(result);
});

