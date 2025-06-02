const express = require('express');
const router = express.Router();
const {
  getCars,
  getFeaturedCars,
  getCar,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

// Get all cars and create new car
router
  .route('/')
  .get(getCars)
  .post(createCar);

// Get featured cars  
router
  .route('/featured')
  .get(getFeaturedCars);

// Get, update and delete car by ID
router
  .route('/:id')
  .get(getCar)
  .put(updateCar)
  .delete(deleteCar);

module.exports = router; 