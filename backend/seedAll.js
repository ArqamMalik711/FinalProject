const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Function to connect to DB and seed everything
const seedAll = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Run the original seeder
    console.log('Seeding cars...');
    await new Promise((resolve, reject) => {
      exec('node seeder.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error seeding cars: ${error.message}`);
          return reject(error);
        }
        console.log(stdout);
        resolve();
      });
    });
    
    // Run the featured cars seeder
    console.log('Seeding featured cars...');
    await new Promise((resolve, reject) => {
      exec('node seedFeaturedCars.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error seeding featured cars: ${error.message}`);
          return reject(error);
        }
        console.log(stdout);
        resolve();
      });
    });
    
    console.log('All data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAll(); 