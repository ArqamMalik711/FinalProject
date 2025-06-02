const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Car name is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  image: {
    type: String,
    required: [true, 'Car image is required']
  },
  gallery: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  mileage: {
    type: String,
    default: '0'
  },
  fuel: {
    type: String,
    required: true
  },
  transmission: {
    type: String,
    required: true
  },
  engine: {
    type: String,
    required: true
  },
  power: {
    type: String,
    required: true
  },
  torque: {
    type: String,
    default: ''
  },
  acceleration: {
    type: String,
    default: ''
  },
  topSpeed: {
    type: String,
    default: ''
  },
  fuelEconomy: {
    type: String,
    default: ''
  },
  co2: {
    type: String,
    default: ''
  },
  weight: {
    type: String,
    default: ''
  },
  length: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  bootSpace: {
    type: String,
    default: ''
  },
  safetyRating: {
    type: String,
    default: ''
  },
  warranty: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Car', CarSchema); 