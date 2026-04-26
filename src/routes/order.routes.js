const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:userId', orderController.getUserOrders);
router.post('/:id/notify', orderController.notifyOrder);
router.put('/:id/status', orderController.updateStatus);

module.exports = router;
