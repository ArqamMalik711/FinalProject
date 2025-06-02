const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // MongoDB connection using environment variable or default URI
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://carwow-admin:carwow123@labcluster.bfvm47n.mongodb.net/carwow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 