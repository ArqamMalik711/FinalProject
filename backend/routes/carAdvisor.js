const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file with absolute path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Get the Gemini API key with fallback to hardcoded key (just for testing)
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBrN8QvzP_RJz4VwDtey-l6I2zaAoWmSZY';

// Log environment status
console.log('CarAdvisor Route - Environment variables loaded:', {
    GEMINI_API_KEY_EXISTS: !!API_KEY,
    GEMINI_API_KEY_LENGTH: API_KEY ? API_KEY.length : 0,
    GEMINI_API_KEY_PREFIX: API_KEY ? API_KEY.substring(0, 3) : 'none',
    ENV_PATH: path.resolve(__dirname, '../.env')
});

if (!API_KEY) {
    console.error('CRITICAL: Gemini API key is missing in backend .env file');
} else if (!API_KEY.startsWith('AI')) {
    console.error('CRITICAL: Gemini API key appears to be invalid. Should start with "AI"');
}

const genAI = new GoogleGenerativeAI(API_KEY);

router.post('/recommendations', async (req, res) => {
    console.log('Received car advisor request');
    
    try {
        const { userPrompt } = req.body;
        
        if (!userPrompt) {
            console.error('Missing userPrompt in request body');
            return res.status(400).json({ error: 'User prompt is required' });
        }

        if (!API_KEY) {
            console.error('Gemini API key is not configured');
            return res.status(500).json({ error: 'API key not configured on server' });
        }

        if (!API_KEY.startsWith('AI')) {
            return res.status(500).json({ error: 'Invalid API key format. Please check server configuration.' });
        }

        // Initialize the Gemini model with the correct configuration
        // Using the gemini-2.0-flash model as specified by the user
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", 
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });
        
        const prompt = `
            You are a car expert assistant. Based on the following user requirements, recommend 3 specific cars that best match their needs.
            
            User requirements: "${userPrompt}"
            
            Provide your response in the following JSON format only, no other text:
            {
                "recommendations": [
                    {
                        "name": "Full car name with year (e.g., '2024 Toyota Camry LE')",
                        "description": "2-3 sentences explaining why this car matches their requirements",
                        "price": "Specific price range (e.g., '$25,000 - $30,000')",
                        "key_features": ["3-5 key features that match user requirements"]
                    }
                ]
            }

            Rules:
            1. Always include current or recent year models (2022-2024)
            2. Be specific with model trims when relevant
            3. Provide realistic price ranges
            4. Focus on features that match user requirements
            5. Keep descriptions concise but informative
            6. Always return exactly 3 recommendations
            7. Ensure response is valid JSON
        `;

        console.log('Sending request to Gemini API...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Received response from Gemini API. Raw response:', text);
        
        try {
            // Try to clean up the response if it contains markdown or extra text
            let jsonStr = text;
            
            // If response contains a code block, extract it
            const codeBlockMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
            if (codeBlockMatch) {
                jsonStr = codeBlockMatch[1].trim();
                console.log('Extracted JSON from code block:', jsonStr);
            }
            
            // Remove any non-JSON text before or after the JSON content
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
                console.log('Extracted JSON object:', jsonStr);
            }
            
            const parsedResponse = JSON.parse(jsonStr);
            
            if (!parsedResponse.recommendations || !Array.isArray(parsedResponse.recommendations)) {
                console.error('Invalid response structure from Gemini:', parsedResponse);
                throw new Error('Response missing recommendations array');
            }
            
            // Validate and format each recommendation
            const formattedRecommendations = parsedResponse.recommendations.map(rec => ({
                name: String(rec.name || '').trim(),
                description: String(rec.description || '').trim(),
                price: String(rec.price || '').trim(),
                key_features: Array.isArray(rec.key_features) ? 
                    rec.key_features.map(f => String(f).trim()).filter(f => f) : []
            }));
            
            const finalResponse = {
                recommendations: formattedRecommendations
            };
            
            console.log('Sending successful response to client:', JSON.stringify(finalResponse, null, 2));
            res.json(finalResponse);
        } catch (parseError) {
            console.error('Failed to parse Gemini response. Error:', parseError.message);
            console.error('Raw response text:', text);
            res.status(500).json({ 
                error: 'Failed to parse car recommendations',
                details: parseError.message
            });
        }
    } catch (error) {
        console.error('Error in getCarRecommendations:', error.message);
        
        // Check for specific error messages
        if (error.message.includes('API_KEY_INVALID')) {
            return res.status(500).json({ 
                error: 'Invalid API key. Please check your API key in the Google Cloud Console.',
                details: 'Visit https://console.cloud.google.com/ to verify your API key and enable the Gemini API.'
            });
        }
        
        if (error.message.includes('PERMISSION_DENIED') || error.message.toLowerCase().includes('disabled')) {
            return res.status(500).json({ 
                error: 'AI features are disabled. Please enable the Gemini API in your Google Cloud Console.',
                details: 'Visit https://console.cloud.google.com/ and enable the Gemini API for your project.'
            });
        }

        res.status(500).json({ 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 