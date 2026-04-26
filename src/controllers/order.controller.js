const Order = require('../models/order.model');
const { getChannel } = require('../config/rabbitmq');

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    const channel = getChannel();
    
    if (channel && req.body.userEmail) {
      channel.sendToQueue('order_notifications', Buffer.from(JSON.stringify({
        event: 'ORDER_PLACED',
        orderId: order.id,
        userId: order.userId,
        userEmail: req.body.userEmail,
        order
      })));
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.params.userId } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    res.json(await Order.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    const channel = getChannel();
    if (channel) {
      channel.sendToQueue('order_notifications', Buffer.from(JSON.stringify({
        event: req.body.target === 'RETAILER' ? 'NOTIFY_RETAILER' : 'NOTIFY_CUSTOMER',
        order,
        email: req.body.email
      })));
    }
    res.json({ message: 'Notification queued' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    order.status = req.body.status;
    await order.save();

    const channel = getChannel();
    if (channel && req.body.userEmail) {
      channel.sendToQueue('order_notifications', Buffer.from(JSON.stringify({
        event: 'NOTIFY_CUSTOMER',
        order,
        email: req.body.userEmail
      })));
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  notifyOrder,
  updateStatus
};
