const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('order_notifications');
    console.log('✅ Connected to RabbitMQ');
    return channel;
  } catch (err) {
    console.error('❌ RabbitMQ connection failed, retrying in 5s...', err.message);
    return new Promise((resolve) => {
      setTimeout(() => resolve(connectRabbitMQ()), 5000);
    });
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
