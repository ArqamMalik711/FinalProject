const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const path = require('path');
const carAdvisorRoutes = require('./routes/carAdvisor');
const carAdsRoutes = require('./routes/carAds');

// Load environment variables
dotenv.config();

// Connect to database
connectDB().catch((error) => {
  console.error('Database connection error:', error);
  // Don't exit process on connection error in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit process on uncaught exception in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit process on unhandled rejection in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Initialize express app
const app = express();

// Health check route
app.get('/', async (req, res) => {
  try {
    // Test database connection
    await mongoose.connection.db.admin().ping();
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      dbStatus: 'connected',
      env: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Server is running but database connection failed',
      error: error.message,
      env: process.env.NODE_ENV
    });
  }
});

// Configure CORS options
const corsOptions = {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Log server configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('Server Configuration:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    CLIENT_URL: process.env.CLIENT_URL,
    API_PREFIX: process.env.API_PREFIX
  });
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configure multer for file uploads
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // This sets up a basic configuration

// Debug route to test database connection
app.get('/debug/db', async (req, res) => {
  try {
    const Car = require('./models/Car');
    const count = await Car.countDocuments();
    res.json({
      success: true,
      dbConnected: mongoose.connection.readyState === 1,
      totalCars: count,
      env: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI?.substring(0, 20) + '...' // Only show part of the URI for security
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Load routes in order
const routes = [
  { path: '/api/cars', route: './routes/carRoutes' },
  { path: '/api/featured-cars', route: './routes/featuredCarRoutes' },
  { path: '/api/ads', route: './routes/carAds' },
  { path: '/api/users', route: './routes/userRoutes' },
  { path: '/api/car-advisor', route: './routes/carAdvisor' },
  { path: '/api/news', route: './routes/newsRoutes' }
];

// Load routes with error handling
routes.forEach(route => {
  try {
    const routeModule = require(route.route);
    app.use(route.path, routeModule);
    console.log(`Route loaded successfully: ${route.path}`);
  } catch (error) {
    console.error(`Error loading route ${route.path}:`, error);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Debug route - list all registered routes
app.get('/routes', (req, res) => {
  const routes = [];
  
  // Get routes registered directly on the app
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods),
            base: middleware.regexp.toString()
          });
        }
      });
    }
  });
  
  res.json({
    routes,
    registeredMiddleware: app._router.stack.map(m => ({
      name: m.name,
      regexp: m.regexp ? m.regexp.toString() : null
    }))
  });
});

// Debug endpoints for testing database
app.get('/debug/db-status', (req, res) => {
  res.json({
    isConnected: mongoose.connection.readyState === 1,
    connectionState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  });
});

// Debug endpoint to test ad retrieval
app.get('/debug/ads', async (req, res) => {
  try {
    const Ad = require('./models/Ad');
    const ads = await Ad.find().limit(5);
    res.json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug endpoint to test ad retrieval by ID
app.get('/debug/ads/:id', async (req, res) => {
  try {
    const Ad = require('./models/Ad');
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    res.json({
      success: true,
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 Not Found middleware
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5005;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Main API: http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;