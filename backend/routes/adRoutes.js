const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createAd, getAds, getUserAds, getAdById } = require('../controllers/adController');

// Get the absolute path to the workspace root (E:\New folder)
const workspaceRoot = path.resolve(__dirname, '../../');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create absolute path to userAds directory
    const uploadPath = path.join(workspaceRoot, 'my-app', 'public', 'images', 'userAds');
    console.log('Upload path:', uploadPath); // Debug log
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Create new ad with file upload support
router.post('/', upload.any(), createAd);

// Get all ads
router.get('/', getAds);

// Get user's ads
router.get('/user/:userId', getUserAds);

// Get ad by ID
router.get('/ad/:id', getAdById);

module.exports = router;
