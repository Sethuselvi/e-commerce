const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Apply auth middleware to all routes
router.use(auth);

// GET /api/orders - Get customer's order history
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET /api/orders/:id - Get specific order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findOne({ 
      _id: id, 
      userId: req.user.userId 
    }).select('-__v');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details' });
  }
});

module.exports = router; 