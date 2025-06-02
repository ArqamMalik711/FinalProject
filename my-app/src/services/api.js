// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_PREFIX = process.env.REACT_APP_API_PREFIX || '/api';

// Enable debug logging in development
if (process.env.REACT_APP_ENABLE_DEBUG === 'true') {
  console.log('API Configuration:', {
    API_URL,
    API_PREFIX,
    NODE_ENV: process.env.NODE_ENV
  });
}

// Helper function to safely parse JSON with error handling
const safelyParseJSON = async (response) => {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text);
    throw new Error('Server returned non-JSON response. Check if the server is running correctly.');
  }
  
  try {
    const data = await response.json();
    console.log('Parsed JSON response:', data);
    return data;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Failed to parse server response as JSON.');
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    console.log('Attempting to register user at:', `${API_URL}/api/users/register`);
    console.log('With data:', userData);
    
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    // For debugging: log the raw response
    if (!response.ok) {
      try {
        const text = await response.text();
        console.error('Error response from server:', text);
        
        // Try to parse as JSON if possible
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Registration failed');
        } catch (jsonError) {
          throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
        }
      } catch (textError) {
        throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
      }
    }
    
    const data = await safelyParseJSON(response);
    
    // Store user and token in localStorage
    if (data.success && data.data) {
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    console.log('Attempting to login user at:', `${API_URL}/api/users/login`);
    
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    // For debugging: log the raw response
    if (!response.ok) {
      try {
        const text = await response.text();
        console.error('Error response from server:', text);
        
        // Try to parse as JSON if possible
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Login failed');
        } catch (jsonError) {
          throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }
      } catch (textError) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }
    }
    
    const data = await safelyParseJSON(response);
    
    // Store user and token in localStorage
    if (data.success && data.data) {
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('token', data.data.token);
    }
    
    return {
      success: data.success,
      data: data.data,
      token: data.data.token
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Fetch all cars with optional query params
export const fetchCars = async (queryParams = {}) => {
  try {
    // Build query string from query params
    const queryString = Object.keys(queryParams)
      .filter(key => queryParams[key] !== undefined && queryParams[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const url = `${API_URL}/api/cars${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const data = await safelyParseJSON(response);
      throw new Error(data.message || `Error: ${response.statusText}`);
    }
    
    const data = await safelyParseJSON(response);
    return data.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

// Fetch featured cars
export const fetchFeaturedCars = async () => {
  try {
    const response = await fetch(`${API_URL}${API_PREFIX}/cars/featured`);
    
    if (!response.ok) {
      const data = await safelyParseJSON(response);
      throw new Error(data.message || `Error: ${response.statusText}`);
    }
    
    const data = await safelyParseJSON(response);
    return data.data;
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    throw error;
  }
};

// Fetch featured cars from dedicated collection
export const fetchFeaturedCarsCollection = async () => {
  try {
    const response = await fetch(`${API_URL}/featured-cars`);
    
    if (!response.ok) {
      const data = await safelyParseJSON(response);
      throw new Error(data.message || `Error: ${response.statusText}`);
    }
    
    const data = await safelyParseJSON(response);
    return data.data;
  } catch (error) {
    console.error('Error fetching featured cars collection:', error);
    throw error;
  }
};

// Fetch a single car by ID (for browsing cars)
export const fetchCarById = async (carId) => {
  try {
    const response = await fetch(`${API_URL}/api/cars/${carId}`);
    
    if (!response.ok) {
      const data = await safelyParseJSON(response);
      throw new Error(data.message || `Error: ${response.statusText}`);
    }
    
    const data = await safelyParseJSON(response);
    return data.data;
  } catch (error) {
    console.error(`Error fetching car with ID ${carId}:`, error);
    throw error;
  }
};

// Fetch a single car ad by ID (for user ads)
export const fetchCarAdById = async (adId) => {
  try {
    // Use the correct API endpoint path for fetching a car ad by ID
    const response = await fetch(`${API_URL}/api/ads/${adId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from API:', errorText);
      throw new Error(`Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error fetching car ad with ID ${adId}:`, error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Decode JWT token to extract user ID
export const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Split the token and get the payload part
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload
    const payload = JSON.parse(atob(parts[1]));
    console.log('Decoded token payload:', payload);
    
    // Return the user ID from the payload
    return payload.id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Create a new car ad
export const createAd = async (adData) => {
  try {
    // 1. Grab token
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // 2. Decode payload and determine the correct user-ID claim
    let userId;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded JWT payload:', payload);
      userId = payload._id ?? payload.userId ?? payload.id ?? payload.sub ?? payload.user_id;
      console.log('api.js - Extracted userId:', userId);
    } catch (err) {
      console.error('Error decoding token payload:', err);
      throw new Error('Invalid authentication token. Please log in again.');
    }

    if (!userId) {
      throw new Error('Could not extract user ID from token. Please log in again.');
    }

    // 3. Prepare headers with CORS settings
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    };

    // 4. Attach userId to your payload
    if (adData instanceof FormData) {
      adData.append('userId', userId);
      console.log('api.js - FormData entries:');
      for (const [key, value] of adData.entries()) {
        console.log('api.js -', key, value);
      }
    } else {
      const obj = typeof adData === 'string' ? JSON.parse(adData) : { ...adData };
      obj.userId = userId;
      headers['Content-Type'] = 'application/json';
      adData = JSON.stringify(obj);
    }

    // 5. Fire the request with proper error handling
    console.log('Sending request to:', `${API_URL}/api/ads`);
    const response = await fetch(`${API_URL}/api/ads`, {
      method: 'POST',
      headers,
      body: adData,
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create ad');
    }

    return responseData;
  } catch (error) {
    console.error('Error in createAd:', error);
    // Throw a more specific error message
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Please check your connection and try again.');
    }
    throw error;
  }
};

// Get all car ads
export const getAds = async () => {
  try {
    console.log('Fetching ads from:', `${API_URL}/ads`);
    const response = await fetch(`${API_URL}/ads`);
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Raw response data:', JSON.stringify(data, null, 2));
    console.log('Response data type:', typeof data);
    console.log('Response data.data type:', typeof data.data);
    console.log('Is data.data an array?', Array.isArray(data.data));

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch ads');
    }

    // Ensure we're returning the correct structure
    const result = {
      success: true,
      data: Array.isArray(data.data) ? data.data : []
    };
    
    console.log('Returning result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error fetching ads:', error);
    throw error;
  }
};

// Get user's ads
export const getUserAds = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/ads/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user ads');
    }
    const data = await safelyParseJSON(response);
    return data;
  } catch (error) {
    console.error('Error fetching user ads:', error);
    throw error;
  }
};