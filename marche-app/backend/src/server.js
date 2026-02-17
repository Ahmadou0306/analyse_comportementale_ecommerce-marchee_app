require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Servir les images statiquement
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// Swagger (conditionnel)
if (process.env.ENABLE_SWAGGER === 'true') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./swagger');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MARCHÉ API Docs',
  }));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log(`MARCHÉ API running on port ${PORT}`);
  if (process.env.ENABLE_SWAGGER === 'true') {
    console.log(`Swagger UI: http://localhost:${PORT}/docs`);
  }
});
