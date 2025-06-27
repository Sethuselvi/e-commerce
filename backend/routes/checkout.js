const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Initialize Razorpay with test keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_TEST_KEY_SECRET'
});

// Create order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount provided' });
    }

    const options = {
      amount: Math.round(amount), // Ensure amount is an integer
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating order', 
      error: error.message,
      details: error.error
    });
  }
});

// Verify payment and save order to database
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails
    } = req.body;

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_TEST_KEY_SECRET')
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful - save order to database
      try {
        // Validate required fields
        if (!orderDetails.customerName) {
          throw new Error('Customer name is required');
        }
        if (!orderDetails.customerEmail) {
          throw new Error('Customer email is required');
        }
        if (!orderDetails.items || orderDetails.items.length === 0) {
          throw new Error('Order items are required');
        }
        if (!orderDetails.shippingAddress) {
          throw new Error('Shipping address is required');
        }

        // Create order in database
        const newOrder = new Order({
          userId: req.user.userId,
          customerName: orderDetails.customerName,
          customerEmail: orderDetails.customerEmail,
          customerPhone: orderDetails.customerPhone || 'N/A',
          items: orderDetails.items,
          subtotal: orderDetails.subtotal,
          shippingCost: orderDetails.shippingCost,
          tax: orderDetails.tax,
          totalAmount: orderDetails.totalAmount,
          shippingAddress: orderDetails.shippingAddress,
          paymentMethod: 'razorpay',
          paymentStatus: 'completed',
          status: 'pending'
        });

        // Calculate totals
        newOrder.calculateTotals();
        
        const savedOrder = await newOrder.save();

        res.json({ 
          success: true, 
          orderId: savedOrder._id,
          orderNumber: savedOrder.orderNumber,
          message: 'Order placed successfully'
        });
      } catch (dbError) {
        if (dbError.name === 'ValidationError') {
        res.status(500).json({ 
          success: false, 
          message: 'Payment successful but order could not be saved',
          error: dbError.message,
          details: dbError.errors || dbError.stack
        });
        }
      }
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error verifying payment',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router; 