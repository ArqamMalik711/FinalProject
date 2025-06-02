const express = require('express');
const router = express.Router();
const { 
  getFeaturedCars, 
  getFeaturedCar, 
  createFeaturedCar, 
  updateFeaturedCar, 
  deleteFeaturedCar 
} = require('../controllers/featuredCarController');

router
  .route('/')
  .get(getFeaturedCars)
  .post(createFeaturedCar);

router
  .route('/:id')
  .get(getFeaturedCar)
  .put(updateFeaturedCar)
  .delete(deleteFeaturedCar);

module.exports = router; 