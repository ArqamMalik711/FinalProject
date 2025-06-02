const mongoose = require('mongoose');

const FeaturedCarSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FeaturedCar', FeaturedCarSchema); 