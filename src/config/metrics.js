const promClient = require('prom-client');

const register = new promClient.Registry();

register.setDefaultLabels({
  app: process.env.SERVICE_NAME || 'vkpaints-order-service'
});

promClient.collectDefaultMetrics({ register });

// HTTP Metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Database Metrics
const dbConnectionGauge = new promClient.Gauge({
  name: 'db_connection_pool_size',
  help: 'Number of database connections in the pool',
  labelNames: ['state']
});
register.registerMetric(dbConnectionGauge);

// RabbitMQ Metrics (if applicable)
const mqMessageCounter = new promClient.Counter({
  name: 'mq_messages_total',
  help: 'Total number of messages processed via RabbitMQ',
  labelNames: ['action', 'status']
});
register.registerMetric(mqMessageCounter);

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    httpRequestDurationMicroseconds.labels(req.method, route, res.statusCode).observe(duration);
  });
  next();
};

const recordDbMetrics = (sequelize) => {
  if (sequelize && sequelize.connectionManager && sequelize.connectionManager.pool) {
    const pool = sequelize.connectionManager.pool;
    dbConnectionGauge.labels('total').set(pool.size || 0);
    dbConnectionGauge.labels('active').set((pool.size - pool.available) || 0);
    dbConnectionGauge.labels('idle').set(pool.available || 0);
  }
};

module.exports = {
  register,
  metricsMiddleware,
  dbConnectionGauge,
  mqMessageCounter,
  recordDbMetrics
};
