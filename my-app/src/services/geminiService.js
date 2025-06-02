import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if we're in the correct environment
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
console.log('API Key status:', API_KEY ? 'Present' : 'Missing');
console.log('API Key length:', API_KEY ? API_KEY.length : 0);

// Ensure API key exists and is not the placeholder
if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
  console.error('Please set up your Gemini API key in the .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getCarRecommendations = async (userPrompt) => {
  try {
    console.log('Sending request to backend:', userPrompt);
    
    const response = await fetch(`${API_BASE_URL}/api/car-advisor/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ userPrompt }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Failed to get car recommendations');
      } catch (e) {
        throw new Error('Server error: ' + errorText);
      }
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response: ' + contentType);
    }

    const data = await response.json();
    console.log('Received response:', data);
    return data;
  } catch (error) {
    console.error('Error in getCarRecommendations:', error);
    throw new Error(error.message || 'Failed to get car recommendations');
  }
}; 