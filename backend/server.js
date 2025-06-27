const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin/products', require('./routes/adminProducts'));
app.use('/api/admin/orders', require('./routes/adminOrders'));
app.use('/api/upload', require('./routes/upload'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => {})
  .catch(err => {});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {}); 