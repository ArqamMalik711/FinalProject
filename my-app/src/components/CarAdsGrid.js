import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CarList.css';

const CarAdsGrid = ({ cars, loading, error }) => {
  if (loading) {
    return <div className="loading">Loading your ads...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="no-results">
        <h3>No car ads found</h3>
        <p>Be the first to post a car ad!</p>
        <Link to="/sell-car" className="view-details">Post Your First Ad</Link>
      </div>
    );
  }

  return (
    <div className="cars-grid">
      {cars.map((car) => (
        <div key={car._id} className="car-card">
          <div className="car-image">
            {car.images && car.images.length > 0 && (
              <img 
                src={car.images[0]} 
                alt={car.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-car.jpg';
                }}
              />
            )}
          </div>
          <div className="car-details">
            <h3>{car.title}</h3>
            <p className="price">£{car.price.toLocaleString()}</p>
            <div className="car-specs">
              <span><i className="fas fa-calendar-alt"></i> {car.year}</span>
              <span><i className="fas fa-gas-pump"></i> {car.fuelType}</span>
              <span><i className="fas fa-road"></i> {car.mileage.toLocaleString()} miles</span>
            </div>
            <div className="car-location">
              <i className="fas fa-map-marker-alt"></i> {car.location}
            </div>
            <div className="car-actions">
              <Link to={`/car-details/${car._id}`} className="details-btn">View Details</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarAdsGrid;
