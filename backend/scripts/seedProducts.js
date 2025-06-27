const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Classic T-Shirt',
    price: 29.99,
    description: 'Comfortable cotton t-shirt perfect for everyday wear. Available in multiple colors and sizes.',
    image: '/src/assets/images/shirt.jpg',
    category: 'Clothing',
    stock: 50,
    rating: {
      rate: 4.5,
      count: 120
    }
  },
  {
    name: 'Denim Jeans',
    price: 79.99,
    description: 'High-quality denim jeans with perfect fit and durability. Classic blue wash.',
    image: '/src/assets/images/jeans.jpg',
    category: 'Clothing',
    stock: 30,
    rating: {
      rate: 4.3,
      count: 85
    }
  },
  {
    name: 'Running Shoes',
    price: 89.99,
    description: 'Professional running shoes with excellent cushioning and support for long-distance runs.',
    image: '/src/assets/images/shoe.jpeg',
    category: 'Footwear',
    stock: 25,
    rating: {
      rate: 4.7,
      count: 200
    }
  },
  {
    name: 'Wireless Headphones',
    price: 149.99,
    description: 'Premium wireless headphones with noise cancellation and long battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    stock: 15,
    rating: {
      rate: 4.6,
      count: 95
    }
  },
  {
    name: 'Smart Watch',
    price: 299.99,
    description: 'Feature-rich smartwatch with health tracking, GPS, and smartphone connectivity.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics',
    stock: 20,
    rating: {
      rate: 4.4,
      count: 67
    }
  },
  {
    name: 'Coffee Maker',
    price: 89.99,
    description: 'Automatic coffee maker with programmable settings and thermal carafe.',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
    category: 'Home & Kitchen',
    stock: 12,
    rating: {
      rate: 4.2,
      count: 45
    }
  },
  {
    name: 'Yoga Mat',
    price: 39.99,
    description: 'Non-slip yoga mat made from eco-friendly materials, perfect for home workouts.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    category: 'Sports & Fitness',
    stock: 35,
    rating: {
      rate: 4.1,
      count: 78
    }
  },
  {
    name: 'Backpack',
    price: 59.99,
    description: 'Durable backpack with multiple compartments, perfect for work or travel.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: 'Accessories',
    stock: 40,
    rating: {
      rate: 4.0,
      count: 112
    }
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

    // Clear existing products
    await Product.deleteMany({});

    // Insert new products
    const insertedProducts = await Product.insertMany(products);

    // Display seeded products
    insertedProducts.forEach(product => {
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seeding function
seedProducts(); 