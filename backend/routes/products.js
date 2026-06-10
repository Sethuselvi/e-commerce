const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const products = require('../scripts/seedProducts');

// Get all products (for customers)
router.get('/', async (req, res) => {
  try {
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
    const categories = [...new Set(products.map(p => p.category))];
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
    const filteredProducts = products.filter(p => p.category === category);
    res.json(filteredProducts);
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
    const product = products[parseInt(id)];
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
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