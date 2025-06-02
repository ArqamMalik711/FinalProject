const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing with fallback in-memory storage...');
  });

// Fallback array for users if MongoDB is not available
const fallbackUsers = [];

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running' });
});

// Register route
app.post('/api/users/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }
    
    try {
      // Try to use MongoDB first
      // Check if user already exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create new user using the User model
      const user = await User.create({
        name,
        email,
        password // Password will be hashed by the pre-save middleware in the User model
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '30d' }
      );
      
      console.log('User registered and saved to MongoDB:', {
        id: user._id,
        name: user.name,
        email: user.email
      });
      
      // Return user data without password
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token
        }
      });
      
    } catch (dbError) {
      console.error('Error using MongoDB, falling back to in-memory storage:', dbError);
      
      // Fallback to in-memory storage
      // Check if user exists in fallback array
      const userExists = fallbackUsers.find(user => user.email === email);
      
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user with fake ID
      const id = Date.now().toString();
      const newUser = {
        _id: id,
        id,
        name,
        email,
        password: hashedPassword
      };
      
      // Add to in-memory array
      fallbackUsers.push(newUser);
      
      console.log('User registered in fallback storage:', {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      });
      
      // Generate token
      const token = jwt.sign(
        { id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '30d' }
      );
      
      // Return success response (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        success: true,
        data: {
          ...userWithoutPassword,
          token
        }
      });
    }
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Login route
app.post('/api/users/login', async (req, res) => {
  try {
    console.log('Received login request:', req.body);
    
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    try {
      // Try using MongoDB first
      // Find user by email with password included
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Check if password matches using the model method
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '30d' }
      );
      
      console.log('User login successful (MongoDB):', user.email);
      
      // Return user without password
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token
        }
      });
      
    } catch (dbError) {
      console.error('Error using MongoDB, falling back to in-memory storage:', dbError);
      
      // Fallback to in-memory array
      // Find user by email
      const user = fallbackUsers.find(user => user.email === email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      console.log('User login successful (fallback):', user.email);
      
      // Generate token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '30d' }
      );
      
      // Return success response (without password)
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        data: {
          ...userWithoutPassword,
          token
        }
      });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Get user profile route
app.get('/api/users/me', async (req, res) => {
  try {
    // Get token from authorization header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
      
      // Try to get user from MongoDB
      try {
        const user = await User.findById(decoded.id);
        
        if (user) {
          return res.status(200).json({
            success: true,
            data: {
              _id: user._id,
              name: user.name,
              email: user.email
            }
          });
        }
      } catch (dbError) {
        console.error('Error fetching from MongoDB, checking fallback:', dbError);
      }
      
      // If MongoDB fails or user not found, check fallback
      const fallbackUser = fallbackUsers.find(user => user.id === decoded.id);
      
      if (!fallbackUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          _id: fallbackUser.id,
          name: fallbackUser.name,
          email: fallbackUser.email
        }
      });
      
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Start server on different port than main app
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 