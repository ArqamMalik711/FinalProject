const Ad = require('../models/Ad');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private
exports.createAd = asyncHandler(async (req, res) => {
  try {
    console.log('Received ad creation request');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    // Extract user ID from request
    let userId;
    
    // First check for the 'user' field which is what our model expects
    if (req.body && req.body.user) {
      userId = req.body.user;
      console.log('Found user field in request body:', userId);
    }
    
    // If not found, check for userId field (backward compatibility)
    if (!userId && req.body && req.body.userId) {
      userId = req.body.userId;
      console.log('Found userId field in request body:', userId);
    }
    
    // If still not found, try to extract from token
    if (!userId && req.headers.authorization) {
      console.log('Attempting to extract userId from token');
      try {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log('Decoded token:', decoded);
          userId = decoded.id || decoded._id || decoded.userId;
          console.log('Extracted userId from token:', userId);
        }
      } catch (error) {
        console.error('Error extracting userId from token:', error);
      }
    }

    if (!userId) {
      console.log('Missing user ID in request');
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Validate user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Handle uploaded image files
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/images/userAds/${file.filename}`);
      console.log('Processed image URLs:', imageUrls);
    }

    // Validate required fields
    const requiredFields = [
      'title', 'brand', 'model', 'description', 'price', 
      'year', 'mileage', 'fuelType', 'transmission', 
      'color', 'location', 'ownerName', 'ownerEmail', 'ownerPhone'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Convert and validate numeric fields
    const price = parseFloat(req.body.price);
    const year = parseInt(req.body.year, 10);
    const mileage = parseInt(req.body.mileage, 10);
    const doors = req.body.doors ? parseInt(req.body.doors, 10) : undefined;

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price value'
      });
    }

    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year value'
      });
    }

    if (isNaN(mileage) || mileage < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mileage value'
      });
    }

    // Create ad data object
    const adData = {
      user: userId,
      title: req.body.title.trim(),
      brand: req.body.brand.trim(),
      model: req.body.model.trim(),
      description: req.body.description.trim(),
      price: price,
      year: year,
      mileage: mileage,
      fuelType: req.body.fuelType.trim(),
      transmission: req.body.transmission.trim(),
      color: req.body.color.trim(),
      location: req.body.location.trim(),
      condition: req.body.condition || 'Used',
      ownerName: req.body.ownerName.trim(),
      ownerEmail: req.body.ownerEmail.trim().toLowerCase(),
      ownerPhone: req.body.ownerPhone.trim(),
      images: imageUrls,
      status: 'pending' // Set default status
    };

    // Add optional fields if present
    if (req.body.engine && req.body.engine.trim()) {
      adData.engine = req.body.engine.trim();
    }
    
    if (req.body.bodyType && req.body.bodyType.trim()) {
      adData.bodyType = req.body.bodyType.trim();
    }
    
    if (doors && !isNaN(doors)) {
      adData.doors = doors;
    }

    console.log('Creating ad with data:', JSON.stringify(adData, null, 2));

    // Create the ad
    const ad = await Ad.create(adData);
    console.log('Ad created successfully:', ad._id);

    // Populate user data before sending response
    const populatedAd = await Ad.findById(ad._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedAd,
      message: 'Ad created successfully'
    });

  } catch (error) {
    console.error('Error creating ad:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
});

// @desc    Get all ads
// @route   GET /api/ads
// @access  Public
exports.getAds = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching all ads...');
    const ads = await Ad.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    console.log(`Found ${ads.length} ads:`, JSON.stringify(ads, null, 2));

    res.status(200).json({
      success: true,
      data: ads,
      pagination: {
        current: 1,
        pages: 1,
        total: ads.length
      }
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
});

// @desc    Get user's ads
// @route   GET /api/ads/user/:userId
// @access  Private
exports.getUserAds = asyncHandler(async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.params.userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ads
    });
  } catch (error) {
    console.error('Error fetching user ads:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
});

// @desc    Get ad by ID
// @route   GET /api/ads/ad/:id
// @access  Public
exports.getAdById = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching ad with ID:', req.params.id);
    
    const ad = await Ad.findById(req.params.id).populate('user', 'name email');
    
    if (!ad) {
      console.log('Ad not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    console.log('Ad found:', ad.title);
    res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('Error fetching ad by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
});

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private
exports.updateAd = asyncHandler(async (req, res) => {
  try {
    let ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Check if user owns the ad
    if (ad.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this ad'
      });
    }

    ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
});

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private
exports.deleteAd = asyncHandler(async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Check if user owns the ad
    if (ad.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this ad'
      });
    }

    await ad.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
});