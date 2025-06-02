const http = require('http');

// Function to make a GET request to the API
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';

      // A chunk of data has been received
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received
      res.on('end', () => {
        console.log(`Response status code: ${res.statusCode}`);
        console.log(`Response headers: ${JSON.stringify(res.headers)}`);
        
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (e) {
          console.log('Raw response data:', data);
          reject(new Error('Error parsing JSON: ' + e.message));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testAdEndpoints() {
  try {
    // Test the /api/ads endpoint to get all ads
    console.log('\n----- Testing GET /api/ads -----');
    const allAds = await makeRequest('http://localhost:5005/api/ads');
    console.log('Response:', JSON.stringify(allAds, null, 2));
    
    // If we have ads, test getting a specific ad by ID
    if (allAds.data && allAds.data.length > 0) {
      const adId = allAds.data[0]._id;
      
      console.log(`\n----- Testing GET /api/ads/ad/${adId} -----`);
      const adDetails = await makeRequest(`http://localhost:5005/api/ads/ad/${adId}`);
      console.log('Response:', JSON.stringify(adDetails, null, 2));
    } else {
      console.log('No ads found to test the detail endpoint');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the tests
testAdEndpoints(); 