require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');

// Routes
const materialRoutes = require('./routes/material.routes');
const orderRoutes = require('./routes/order.routes');
const quotationRoutes = require('./routes/quotation.routes');
const userRoutes = require('./routes/user.routes');
const projectQuotationRoutes = require('./routes/projectQuotation.routes');
const authRoutes = require('./routes/auth.routes');
// ===== MODIFIED START (SYSTEM SETTINGS FEATURE) =====
const systemSettingRoutes = require('./routes/systemSetting.routes');
// ===== MODIFIED END (SYSTEM SETTINGS FEATURE) =====
const { notFound, errorHandler } = require('./middlewares/errorHandler.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// API routes (v1)
app.use('/api/materials', materialRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projectQuotations', projectQuotationRoutes);
app.use('/api/auth', authRoutes);
// ===== MODIFIED START (SYSTEM SETTINGS FEATURE) =====
app.use('/api/settings', systemSettingRoutes);
// ===== MODIFIED END (SYSTEM SETTINGS FEATURE) =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 404 & error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
  });
});

