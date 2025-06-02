const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ad = require('./models/Ad');

// Load environment variables
dotenv.config();

// Function to connect to the database
const connectDB = async () => {
  try {
    // MongoDB connection using environment variable or default URI
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carwow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

// Function to list all ads
const listAllAds = async () => {
  try {
    const ads = await Ad.find().limit(10);
    console.log('Total ads found:', ads.length);
    
    if (ads.length > 0) {
      console.log('First ad ID:', ads[0]._id);
      console.log('First ad title:', ads[0].title);
      return ads[0]._id; // Return the first ad ID for testing getAdById
    } else {
      console.log('No ads found in the database');
      return null;
    }
  } catch (error) {
    console.error('Error listing ads:', error);
  }
};

// Function to get an ad by ID
const getAdById = async (adId) => {
  try {
    const ad = await Ad.findById(adId);
    if (ad) {
      console.log('Found ad by ID:', ad._id.toString());
      console.log('Ad title:', ad.title);
      console.log('Ad details:', JSON.stringify(ad, null, 2));
    } else {
      console.log('No ad found with ID:', adId);
    }
  } catch (error) {
    console.error('Error getting ad by ID:', error);
  }
};

// Main function to run the tests
const runTests = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // List all ads and get the first ad ID
    const firstAdId = await listAllAds();
    
    // If an ad was found, try to get it by ID
    if (firstAdId) {
      await getAdById(firstAdId);
    }
    
    // Close the database connection
    console.log('Tests completed. Closing connection...');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error running tests:', error);
  }
};

// Run the tests
runTests(); 