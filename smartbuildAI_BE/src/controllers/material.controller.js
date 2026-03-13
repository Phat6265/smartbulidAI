const Material = require('../models/Material');
const asyncHandler = require('../middlewares/asyncHandler');

// GET /api/materials
exports.getMaterials = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  const materials = await Material.find(filter).lean();
  res.json(materials);
});

// GET /api/materials/:id
exports.getMaterialById = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id).lean();
  if (!material) {
    return res.status(404).json({ message: 'Material not found' });
  }
  res.json(material);
});

// POST /api/materials
exports.createMaterial = asyncHandler(async (req, res) => {
  const created = await Material.create(req.body);
  res.status(201).json(created);
});

// PUT /api/materials/:id
exports.updateMaterial = asyncHandler(async (req, res) => {
  const updated = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) {
    return res.status(404).json({ message: 'Material not found' });
  }
  res.json(updated);
});

// DELETE /api/materials/:id
exports.deleteMaterial = asyncHandler(async (req, res) => {
  const deleted = await Material.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Material not found' });
  }
  res.status(204).end();
});

