const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Order = require('../models/Order');
const User = require('../models/User');

// Apply auth and admin middleware to all routes
router.use(auth);
router.use(isAdmin);

// GET /api/admin/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/orders/:id - Get specific order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/orders/:id - Update order status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.updateStatus(status);
    
    res.json({ 
      message: 'Order status updated successfully',
      orderId: id,
      status: status
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/dashboard/stats - Get dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [orderStats, totalUsers, totalProducts] = await Promise.all([
      Order.getDashboardStats(),
      User.countDocuments(),
      require('../models/Product').countDocuments()
    ]);
    
    const stats = {
      ...orderStats,
      totalUsers,
      totalProducts
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 