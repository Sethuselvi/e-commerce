const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Product = require('../models/Product');

// Apply auth and admin middleware to all routes
router.use(auth);
router.use(isAdmin);

// GET /api/admin/products - Get all products (admin view)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/products - Create new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;
    
    // Validate required fields
    if (!name || !price || !description || !image || !category || stock === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      image,
      category,
      stock: parseInt(stock)
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image, category, stock } = req.body;
    
    // Validate required fields
    if (!name || !price || !description || !image || !category || stock === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price: parseFloat(price),
        description,
        image,
        category,
        stock: parseInt(stock)
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 