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