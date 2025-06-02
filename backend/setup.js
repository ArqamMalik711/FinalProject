// MongoDB Setup Helper
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=== MongoDB Database Configuration ===\n');
console.log('This script will help you configure MongoDB for CarWow application.\n');

// Default values
const defaultMongoURI = 'mongodb://localhost:27017/carwow';
const defaultJWTSecret = 'secret_jwt_key_for_carwow_app';
const defaultPort = '5000';

console.log('Default values:');
console.log(`MongoDB URI: ${defaultMongoURI}`);
console.log(`JWT Secret: ${defaultJWTSecret}`);
console.log(`Server Port: ${defaultPort}\n`);

const envFilePath = path.join(__dirname, '.env');

const createEnvFile = () => {
  const envContent = `MONGODB_URI=${defaultMongoURI}
PORT=${defaultPort}
JWT_SECRET=${defaultJWTSecret}`;

  try {
    fs.writeFileSync(envFilePath, envContent);
    console.log('\nEnvironment file (.env) created successfully with default values.');
    console.log(`File location: ${envFilePath}`);
    console.log('\nYou can manually edit this file later if needed.');
  } catch (err) {
    console.error('Error creating .env file:', err);
  }
};

// Check if MongoDB is installed
const checkMongoDB = () => {
  console.log('\nChecking if MongoDB is installed or running...');
  
  const { exec } = require('child_process');
  
  exec('mongod --version', (error) => {
    if (error) {
      console.log('MongoDB is not installed or not in your PATH.');
      console.log('Please install MongoDB first:');
      console.log('1. Download from https://www.mongodb.com/try/download/community');
      console.log('2. Install and start the MongoDB service');
      console.log('\nAfter installing MongoDB, restart this script.');
    } else {
      console.log('MongoDB is installed!');
      
      // Create .env file
      createEnvFile();
      
      console.log('\nImportant steps to complete setup:');
      console.log('1. Make sure MongoDB is running');
      console.log('   For Windows: Ensure the MongoDB service is started');
      console.log('   For Mac/Linux: Run "mongod" in a separate terminal');
      console.log('2. Start the server with "node server.js" or "node testServer.js"');
      console.log('\nThe Users collection will be automatically created in the');
      console.log('carwow database when the first user registers.');
    }
    
    rl.close();
  });
};

checkMongoDB(); 