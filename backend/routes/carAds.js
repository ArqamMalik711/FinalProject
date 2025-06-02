const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// GET /api/ads - Get all car ads
// GET /api/ads/:id - Get a single car ad by ID
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ success: true, data: ad });
  } catch (error) {
    console.error('Error fetching car ad:', error);
    res.status(500).json({ error: 'Failed to fetch car ad' });
  }
});

// GET /api/ads - Get all car ads
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json({ success: true, data: ads });
  } catch (error) {
    console.error('Error fetching car ads:', error);
    res.status(500).json({ error: 'Failed to fetch car ads' });
  }
});

// POST /api/ads - Create a new car ad
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const adData = {
      ...req.body,
      images: req.files ? req.files.map(file => file.path) : []
    };

    const newAd = new Ad(adData);
    await newAd.save();
    
    res.status(201).json({ success: true, data: newAd });
  } catch (error) {
    console.error('Error creating car ad:', error);
    res.status(500).json({ error: 'Failed to create car ad' });
  }
});

module.exports = router;
