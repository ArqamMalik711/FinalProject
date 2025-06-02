const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test routes
app.post('/api/users/register', (req, res) => {
  console.log('Register route hit', req.body);
  res.status(201).json({
    success: true,
    data: {
      _id: '123',
      name: req.body.name || 'Test User',
      email: req.body.email || 'test@example.com',
      token: 'test-token-123'
    }
  });
});

app.post('/api/users/login', (req, res) => {
  console.log('Login route hit', req.body);
  res.status(200).json({
    success: true,
    data: {
      _id: '123',
      name: 'Test User',
      email: req.body.email || 'test@example.com',
      token: 'test-token-123'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Test API is running');
});

// List all routes
app.get('/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: middleware.regexp + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json(routes);
});

// Start server on port 5002 to avoid conflicts
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- POST http://localhost:${PORT}/api/users/register`);
  console.log(`- POST http://localhost:${PORT}/api/users/login`);
}); 