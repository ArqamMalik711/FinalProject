import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/CarAds.css';

const CarAds = () => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ads');
        if (response.data && Array.isArray(response.data)) {
          setAds(response.data);
          setFilteredAds(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setAds(response.data.data);
          setFilteredAds(response.data.data);
        } else {
          throw new Error('Invalid data format received from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError('Failed to fetch ads. Please try again later.');
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = ads.filter(ad => 
      ad.title?.toLowerCase().includes(query) ||
      ad.brand?.toLowerCase().includes(query) ||
      ad.model?.toLowerCase().includes(query) ||
      ad.description?.toLowerCase().includes(query)
    );
    
    setFilteredAds(filtered);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="car-ads-header">
        <h1>Car Advertisements</h1>
        <p>Browse through our extensive collection of car listings from trusted sellers</p>
      </div>
      
      <div className="car-ads-container">
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a car..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="search-icon">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="car-ads-grid">
          {filteredAds.length === 0 ? (
            <div className="no-results">
              <h3>No cars found</h3>
              <p>Try adjusting your search terms</p>
            </div>
          ) : (
            filteredAds.map((ad) => (
              <div key={ad._id} className="car-ad-card">
                <div className="car-image">
                  {ad.images && ad.images.length > 0 ? (
                    <img src={`http://localhost:5000/${ad.images[0]}`} alt={`${ad.brand} ${ad.model}`} />
                  ) : (
                    <div className="no-image">No Image Available</div>
                  )}
                </div>
                <div className="car-info">
                  <h2>{ad.title}</h2>
                  <p className="price">£{ad.price.toLocaleString()}</p>
                  <p className="location"><i className="fas fa-map-marker-alt"></i> {ad.location}</p>
                  <Link to={`/ad-details/${ad._id}`} className="view-details-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CarAds;
