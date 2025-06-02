const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Car details
  title: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  mileage: {
    type: Number,
    required: true,
    min: 0
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['petrol', 'diesel', 'hybrid', 'electric', 'lpg'],
    trim: true
  },
  transmission: {
    type: String,
    required: true,
    enum: ['automatic', 'manual', 'semi-automatic'],
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  engine: {
    type: String,
    trim: true
  },
  bodyType: {
    type: String,
    enum: ['suv', 'sedan', 'hatchback', 'coupe', 'convertible', 'wagon', 'van', 'pickup'],
    trim: true
  },
  doors: {
    type: Number,
    min: 2,
    max: 5
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    default: 'Used',
    enum: ['New', 'Used', 'Certified Pre-Owned']
  },
  // Image URLs
  images: [{
    type: String
  }],
  // Owner contact info
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  ownerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  ownerPhone: {
    type: String,
    required: true,
    trim: true
  },
  // Removed ownerWhatsApp field as it's not needed
  // Status for admin approval
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
adSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add index for better query performance
adSchema.index({ user: 1, createdAt: -1 });
adSchema.index({ brand: 1, model: 1 });
adSchema.index({ price: 1 });
adSchema.index({ location: 1 });
adSchema.index({ status: 1 });

module.exports = mongoose.model('Ad', adSchema);