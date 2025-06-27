const mongoose = require('mongoose');
require('dotenv').config();

async function fixOrderIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

    // Get the orders collection
    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    // List all indexes
    const indexes = await ordersCollection.indexes();

    // Check if the problematic index exists
    const orderNumberIndex = indexes.find(index => 
      index.key && index.key.orderNumber === 1
    );

    if (orderNumberIndex) {
      await ordersCollection.dropIndex('orderNumber_1');
    }

    // List indexes again to confirm
    const updatedIndexes = await ordersCollection.indexes();

  } catch (error) {
    console.error('Error fixing order index:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixOrderIndex(); 