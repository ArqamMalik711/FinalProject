const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'mercedes',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 100,
        apiKey: process.env.NEWS_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('News API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news'
    });
  }
});

module.exports = router;
