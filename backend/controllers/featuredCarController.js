const FeaturedCar = require('../models/FeaturedCar');

// @desc    Get all featured cars
// @route   GET /api/featured-cars
// @access  Public
exports.getFeaturedCars = async (req, res) => {
  try {
    const featuredCars = await FeaturedCar.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: featuredCars.length,
      data: featuredCars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single featured car
// @route   GET /api/featured-cars/:id
// @access  Public
exports.getFeaturedCar = async (req, res) => {
  try {
    const featuredCar = await FeaturedCar.findById(req.params.id);

    if (!featuredCar) {
      return res.status(404).json({
        success: false,
        error: 'Featured car not found'
      });
    }

    res.status(200).json({
      success: true,
      data: featuredCar
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new featured car
// @route   POST /api/featured-cars
// @access  Private (will be protected)
exports.createFeaturedCar = async (req, res) => {
  try {
    const featuredCar = await FeaturedCar.create(req.body);

    res.status(201).json({
      success: true,
      data: featuredCar
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update featured car
// @route   PUT /api/featured-cars/:id
// @access  Private (will be protected)
exports.updateFeaturedCar = async (req, res) => {
  try {
    let featuredCar = await FeaturedCar.findById(req.params.id);

    if (!featuredCar) {
      return res.status(404).json({
        success: false,
        error: 'Featured car not found'
      });
    }

    featuredCar = await FeaturedCar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: featuredCar
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete featured car
// @route   DELETE /api/featured-cars/:id
// @access  Private (will be protected)
exports.deleteFeaturedCar = async (req, res) => {
  try {
    const featuredCar = await FeaturedCar.findById(req.params.id);

    if (!featuredCar) {
      return res.status(404).json({
        success: false,
        error: 'Featured car not found'
      });
    }

    await featuredCar.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 