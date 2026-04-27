const { sequelize } = require('./config/db');
const { register, metricsMiddleware } = require('./config/metrics');
const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// Routes
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/metrics', async (req, res) => {
  const { recordDbMetrics } = require('./config/metrics');
  recordDbMetrics(sequelize);
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = app;


