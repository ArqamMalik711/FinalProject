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
  process.exit(1);
});

// Initialize express app
const app = express();

// Configure CORS options
const corsOptions = {
  origin: [process.env.CLIENT_URL || 'http://localhost:3000'],
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

// Load routes in order
const routes = [
  { path: '/api/cars', route: './routes/carRoutes' },
  { path: '/api/featured-cars', route: './routes/featuredCarRoutes' },
  { path: '/api/ads', route: './routes/carAds' },
  { path: '/api/users', route: './routes/userRoutes' },
  { path: '/api/car-advisor', route: './routes/carAdvisor' }
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

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Main API: http://localhost:${PORT}`);
  console.log(`Check routes at: http://localhost:${PORT}/routes`);
  console.log(`Debug database status: http://localhost:${PORT}/debug/db-status`);
  console.log(`Debug ads endpoint: http://localhost:${PORT}/debug/ads`);
}); 