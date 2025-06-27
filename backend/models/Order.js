const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'paypal', 'stripe', 'razorpay']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1 });

// Virtual for formatted total
orderSchema.virtual('formattedTotal').get(function() {
  return `$${this.totalAmount.toFixed(2)}`;
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'shipped' && !this.trackingNumber) {
    // Generate a simple tracking number if not provided
    this.trackingNumber = `TRK${Date.now().toString().slice(-8)}`;
  }
  return this.save();
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.tax = this.subtotal * 0.08; // 8% tax rate
  this.totalAmount = this.subtotal + this.shippingCost + this.tax;
  return this;
};

// Static method to get orders by user
orderSchema.statics.getByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get recent orders
orderSchema.statics.getRecent = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Static method to get dashboard stats
orderSchema.statics.getDashboardStats = async function() {
  const totalOrders = await this.countDocuments();
  const totalRevenue = await this.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  
  const recentOrders = await this.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('totalAmount status createdAt');
  
  return {
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    recentOrders
  };
};

// Pre-save middleware to auto-generate unique orderNumber
orderSchema.pre('validate', async function(next) {
  if (!this.orderNumber) {
    // Generate a unique order number in the format ORDYYYYMMDDXXXX
    const datePart = new Date().toISOString().slice(0,10).replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    this.orderNumber = `ORD${datePart}${randomPart}`;
    // Ensure uniqueness by checking the database
    const existing = await mongoose.models.Order.findOne({ orderNumber: this.orderNumber });
    if (existing) {
      // If exists, try again
      return this.constructor.schema.methods.generateUniqueOrderNumber.call(this, next);
    }
  }
  next();
});

// Helper method for retrying orderNumber generation
orderSchema.methods.generateUniqueOrderNumber = async function(next) {
  const datePart = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  this.orderNumber = `ORD${datePart}${randomPart}`;
  const existing = await mongoose.models.Order.findOne({ orderNumber: this.orderNumber });
  if (existing) {
    return this.generateUniqueOrderNumber(next);
  }
  next();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 