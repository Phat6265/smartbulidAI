// Seed MongoDB from existing FE db.json
// Chạy: node src/utils/seedFromDbJson.js

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const Material = require('../models/Material');
const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const User = require('../models/User');
const ProjectQuotationTemplate = require('../models/ProjectQuotation');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbuildai';

async function main() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { autoIndex: true });

  const dbJsonPath = path.resolve(__dirname, '../../../smart_build_web_FE/db.json');
  console.log('📖 Reading db.json from:', dbJsonPath);
  const raw = fs.readFileSync(dbJsonPath, 'utf-8');
  const json = JSON.parse(raw);

  const { materials = [], users = [], quotations = [], orders = [], projectQuotations = {} } = json;

  console.log('🧹 Clearing existing collections...');
  await Promise.all([
    Material.deleteMany({}),
    User.deleteMany({}),
    Quotation.deleteMany({}),
    Order.deleteMany({}),
    ProjectQuotationTemplate.deleteMany({})
  ]);

  console.log(`⬆️ Inserting ${materials.length} materials...`);
  if (materials.length) {
    const mappedMaterials = materials.map((m) => ({
      name: m.name,
      category: m.category,
      subcategory: m.subcategory,
      technicalSpecs: m.technicalSpecs || {},
      priceReference: m.priceReference,
      images: m.images || (m.imagePath ? [m.imagePath] : []),
      unit: m.unit,
      description: m.description,
      imagePath: m.imagePath || '',
      materialType: m.materialType,
      status: m.status || 'active'
    }));
    await Material.insertMany(mappedMaterials);
  }

  console.log(`⬆️ Inserting ${users.length} users...`);
  if (users.length) {
    const mappedUsers = users.map((u) => ({
      name: u.name,
      email: u.email,
      // passwordHash cần được cập nhật/hard-code nếu muốn login thật;
      // ở đây tạo tạm passwordHash rỗng, bạn có thể sửa tay sau cho admin.
      passwordHash: u.passwordHash || '$2a$10$exampleexampleexampleexampleexa',
      role: u.role || 'customer'
    }));
    await User.insertMany(mappedUsers);
  }

  console.log(`⬆️ Inserting ${quotations.length} quotations...`);
  if (quotations.length) {
    const mappedQuotations = quotations.map((q) => ({
      customerId: q.customerId,
      customerName: q.customerName,
      items: q.items || [],
      location: q.location,
      totalPrice: q.totalPrice,
      status: q.status || 'pending',
      createdAt: q.createdAt,
      updatedAt: q.updatedAt
    }));
    await Quotation.insertMany(mappedQuotations);
  }

  console.log(`⬆️ Inserting ${orders.length} orders...`);
  if (orders.length) {
    const mappedOrders = orders.map((o) => {
      const computedTotal =
        (o.items || []).reduce(
          (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
          0
        );
      return {
        customerId: o.customerId,
        customerName: o.customerName,
        items: o.items || [],
        shippingAddress: o.shippingAddress,
        phone: o.phone,
        note: o.note,
        totalAmount: o.totalAmount != null ? o.totalAmount : computedTotal,
        status: o.status || 'pending_payment',
        createdAt: o.createdAt,
        updatedAt: o.updatedAt
      };
    });
    await Order.insertMany(mappedOrders);
  }

  console.log('⬆️ Inserting project quotation templates...');
  const templateDocs = [];
  Object.keys(projectQuotations || {}).forEach((projectType) => {
    const tpl = projectQuotations[projectType];
    if (!tpl) return;
    templateDocs.push({
      projectType,
      baseArea: tpl.baseArea,
      materials: tpl.materials || []
    });
  });
  if (templateDocs.length) {
    await ProjectQuotationTemplate.insertMany(templateDocs);
  }

  console.log('✅ Seed completed.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

