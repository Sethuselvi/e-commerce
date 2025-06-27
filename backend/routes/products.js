const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products (for customers)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching products',
      details: error.message
    });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching categories',
      details: error.message
    });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category: category, 
      isActive: true 
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching products by category',
      details: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive) {
      return res.status(404).json({ message: 'Product not available' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching product',
      details: error.message
    });
  }
});

module.exports = router; 