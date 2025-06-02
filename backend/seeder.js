const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/Car');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initial car data
const cars = [
  {
    name: 'BMW 3 Series',
    price: '£32,000',
    image: '/images/bmw.jpg',
    gallery: ['/images/bmw.jpg', '/images/bmw.jpg', '/images/bmw.jpg'],
    category: 'Luxury',
    year: 2023,
    mileage: '15,000',
    fuel: 'Petrol',
    transmission: 'Automatic',
    engine: '2.0L 4-cylinder',
    power: '255 bhp',
    torque: '400 Nm',
    acceleration: '5.8s',
    topSpeed: '155 mph',
    fuelEconomy: '42 mpg',
    co2: '152 g/km',
    weight: '1,545 kg',
    length: '4,713 mm',
    width: '1,827 mm',
    height: '1,440 mm',
    bootSpace: '480 liters',
    safetyRating: '5 stars',
    warranty: '3 years / 60,000 miles',
    description: 'The BMW 3 Series is a compact executive car that has been produced by the German automaker BMW since 1975. It is the successor to the 02 Series and has been produced in seven different generations.',
    features: [
      'LED Headlights',
      'Leather seats',
      'Satellite Navigation',
      'Climate Control',
      'Parking Sensors',
      'Alloy Wheels',
      'Bluetooth Connectivity',
      'Apple CarPlay & Android Auto'
    ],
    isFeatured: true
  },
  {
    name: 'Audi A4',
    price: '£29,500',
    image: '/images/audi.jpg',
    gallery: ['/images/audi.jpg', '/images/audi.jpg', '/images/audi.jpg'],
    category: 'Luxury',
    year: 2023,
    mileage: '12,000',
    fuel: 'Diesel',
    transmission: 'Automatic',
    engine: '2.0L TDI',
    power: '201 bhp',
    torque: '400 Nm',
    acceleration: '6.5s',
    topSpeed: '145 mph',
    fuelEconomy: '51 mpg',
    co2: '139 g/km',
    weight: '1,585 kg',
    length: '4,762 mm',
    width: '1,847 mm',
    height: '1,431 mm',
    bootSpace: '460 liters',
    safetyRating: '5 stars',
    warranty: '3 years / unlimited miles',
    description: 'The Audi A4 is a line of compact executive cars produced since 1994 by the German car manufacturer Audi, a subsidiary of the Volkswagen Group. The A4 has been built in five generations and is based on the Volkswagen Group B platform.',
    features: [
      'LED Headlights',
      'Leather seats',
      'MMI Navigation',
      'Dual-zone Climate Control',
      'Parking Sensors',
      'Alloy Wheels',
      'Bluetooth Connectivity',
      'Audi Smartphone Interface'
    ],
    isFeatured: true
  },
  {
    name: 'Mercedes C-Class',
    price: '£34,000',
    image: '/images/class.jpg',
    gallery: ['/images/class.jpg', '/images/class.jpg', '/images/class.jpg'],
    category: 'Luxury',
    year: 2023,
    mileage: '10,000',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    engine: '1.5L Hybrid',
    power: '260 bhp',
    torque: '420 Nm',
    acceleration: '5.7s',
    topSpeed: '150 mph',
    fuelEconomy: '53 mpg',
    co2: '135 g/km',
    weight: '1,650 kg',
    length: '4,751 mm',
    width: '1,820 mm',
    height: '1,438 mm',
    bootSpace: '455 liters',
    safetyRating: '5 stars',
    warranty: '3 years / unlimited miles',
    description: 'The Mercedes-Benz C-Class is a line of compact executive cars produced by Daimler AG. Introduced in 1993 as a replacement for the 190 (W201) range, the C-Class was the smallest model in the marque\'s line-up until the W168 A-Class arrived in 1997.',
    features: [
      'LED High Performance Headlights',
      'Leather Upholstery',
      'MBUX Multimedia System',
      'Heated Front Seats',
      'Reversing Camera',
      'Active Park Assist',
      '18-inch Alloy Wheels',
      'Ambient Lighting'
    ],
    isFeatured: true
  },
  {
    name: 'Tesla Model 3',
    price: '£42,500',
    image: '/images/tesla.jpg',
    gallery: ['/images/tesla.jpg', '/images/tesla.jpg', '/images/tesla.jpg'],
    category: 'Electric',
    year: 2023,
    mileage: '5,000',
    fuel: 'Electric',
    transmission: 'Automatic',
    engine: 'Dual Electric Motor',
    power: '346 bhp',
    torque: '510 Nm',
    acceleration: '4.2s',
    topSpeed: '145 mph',
    fuelEconomy: '260 miles (range)',
    co2: '0 g/km',
    weight: '1,830 kg',
    length: '4,694 mm',
    width: '1,849 mm',
    height: '1,443 mm',
    bootSpace: '425 liters',
    safetyRating: '5 stars',
    warranty: '4 years / 50,000 miles',
    description: 'The Tesla Model 3 is an electric four-door fastback mid-size sedan developed by Tesla. The Model 3 Standard Range Plus version delivers an EPA-rated all-electric range of 263 miles (423 km) and the Long Range versions deliver 353 miles (568 km).',
    features: [
      'Full Self-Driving Capability',
      'Premium Interior',
      '15-inch Touchscreen Display',
      'Glass Roof',
      'Power-adjustable Front Seats',
      'Autopilot',
      'Over-the-air Updates',
      'Wireless Charging'
    ],
    isFeatured: false
  },
  {
    name: 'Toyota RAV4',
    price: '£32,500',
    image: '/images/toyota.jpg',
    gallery: ['/images/toyota.jpg', '/images/toyota.jpg', '/images/toyota.jpg'],
    category: 'SUV',
    year: 2023,
    mileage: '8,000',
    fuel: 'Hybrid',
    transmission: 'CVT',
    engine: '2.5L Hybrid',
    power: '219 bhp',
    torque: '221 Nm',
    acceleration: '8.1s',
    topSpeed: '112 mph',
    fuelEconomy: '49 mpg',
    co2: '129 g/km',
    weight: '1,705 kg',
    length: '4,600 mm',
    width: '1,855 mm',
    height: '1,685 mm',
    bootSpace: '580 liters',
    safetyRating: '5 stars',
    warranty: '5 years / 100,000 miles',
    description: 'The Toyota RAV4 is a compact crossover SUV produced by the Japanese automobile manufacturer Toyota. The vehicle was designed for consumers wanting a vehicle that had most of the benefits of SUVs, such as increased cargo room, higher visibility, and the option of full-time four-wheel drive.',
    features: [
      'Toyota Safety Sense',
      'Smart Entry & Start',
      'Dual-zone Automatic Climate Control',
      'Apple CarPlay & Android Auto',
      'Reversing Camera',
      'LED Headlights',
      'Heated Front Seats',
      'Power Tailgate'
    ],
    isFeatured: false
  }
];

// Function to import data
const importData = async () => {
  try {
    // Clear existing data
    await Car.deleteMany();
    
    // Insert new data
    await Car.insertMany(cars);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    // Clear existing data
    await Car.deleteMany();
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Determine which function to run based on command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 