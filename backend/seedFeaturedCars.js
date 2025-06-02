const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/Car');
const FeaturedCar = require('./models/FeaturedCar');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
const seedFeaturedCars = async () => {
  try {
    await connectDB();
    
    // Find featured cars from Car collection
    const featuredCars = await Car.find({ isFeatured: true });
    
    if (featuredCars.length === 0) {
      console.log('No featured cars found in the Car collection');
      process.exit(1);
    }
    
    console.log(`Found ${featuredCars.length} featured cars`);
    
    // Clear existing data in FeaturedCar collection
    await FeaturedCar.deleteMany();
    
    // Transform and insert cars into FeaturedCar collection
    const featuredCarsToInsert = featuredCars.map(car => ({
      name: car.name,
      price: car.price,
      image: car.image,
      gallery: car.gallery,
      category: car.category,
      year: car.year,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      engine: car.engine,
      power: car.power,
      description: car.description,
      features: car.features
    }));
    
    await FeaturedCar.insertMany(featuredCarsToInsert);
    
    console.log(`Successfully inserted ${featuredCarsToInsert.length} featured cars`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedFeaturedCars(); 