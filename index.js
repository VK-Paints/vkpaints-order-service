const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { connectRabbitMQ } = require('./src/config/rabbitmq');

const PORT = process.env.PORT || 3004;

const startServer = async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Connect to RabbitMQ
    await connectRabbitMQ();

    // 3. Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Order Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Order Service startup failed:', err.message);
    setTimeout(startServer, 5000);
  }
};

startServer();
