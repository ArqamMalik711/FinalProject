const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // MongoDB connection using environment variable or default URI
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://carwow-admin:carwow123@labcluster.bfvm47n.mongodb.net/carwow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      retryWrites: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // In production, we want to keep trying to connect
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;