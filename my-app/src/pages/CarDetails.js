import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/CarDetails.css';
import { fetchCarById, fetchCarAdById } from '../services/api';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  // Determine if we're viewing a car ad or a browsing car
  const isCarAd = location.pathname.startsWith('/car-details');

  useEffect(() => {
    const getCarDetails = async () => {
      try {
        setLoading(true);
        let carData;

        if (isCarAd) {
          carData = await fetchCarAdById(id);
        } else {
          carData = await fetchCarById(id);
        }

        setCar(carData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch car details:', err);
        setError('Failed to load car details. Please try again later.');
        // If car not found, redirect to appropriate page after a delay
        setTimeout(() => navigate(isCarAd ? '/car-ads' : '/cars'), 3000);
      } finally {
        setLoading(false);
      }
    };

    getCarDetails();
  }, [id, navigate, isCarAd]);

  const handleContactSeller = () => {
    if (car.ownerPhone) {
      window.location.href = `tel:${car.ownerPhone}`;
    } else if (car.ownerWhatsApp) {
      window.open(`https://wa.me/${car.ownerWhatsApp}`, '_blank');
    } else if (car.ownerEmail) {
      window.location.href = `mailto:${car.ownerEmail}`;
    } else {
      alert('No contact information available');
    }
  };

  const handleWhatsApp = () => {
    if (car.ownerWhatsApp) {
      window.open(`https://wa.me/${car.ownerWhatsApp}`, '_blank');
    } else {
      alert('WhatsApp number not available');
    }
  };

  if (loading) {
    return <div className="loading">Loading car details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!car) {
    return <div className="not-found">Car not found</div>;
  }

  return (
    <div className="car-details">
      <div className="car-gallery">
        {isCarAd ? (
          // For car ads
          <div>
            <div className="no-image">No Images Available</div>
          </div>
        ) : (
          // For browsing cars
          <div>
            <img src={car.image} alt={car.name} className="main-image" />
            <div className="thumbnail-grid">
              {car.gallery && car.gallery.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`${car.name} - View ${index + 1}`} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="car-info">
        <h1>{car.title || car.name}</h1>
        <p className="price">{car.price?.toLocaleString?.() || car.price}</p>
        
        <div className="key-specs">
          <div className="spec-item">
            <span className="label">Year</span>
            <span className="value">{car.year}</span>
          </div>
          <div className="spec-item">
            <span className="label">Mileage</span>
            <span className="value">{(typeof car.mileage === 'number' ? car.mileage.toLocaleString() : car.mileage)} miles</span>
          </div>
          <div className="spec-item">
            <span className="label">Condition</span>
            <span className="value">{car.condition || 'Used'}</span>
          </div>
          {isCarAd ? (
            <>
              <div className="spec-item">
                <span className="label">Posted By</span>
                <span className="value">{car.ownerName}</span>
              </div>
              <div className="spec-item">
                <span className="label">Contact</span>
                <span className="value">{car.ownerPhone || 'Call button below'}</span>
              </div>
              <div className="spec-item">
                <span className="label">WhatsApp</span>
                <span className="value">{car.ownerWhatsApp || 'WhatsApp button below'}</span>
              </div>
              <div className="spec-item">
                <span className="label">Email</span>
                <span className="value">{car.ownerEmail}</span>
              </div>
            </>
          ) : (
            <>
              <div className="spec-item">
                <span className="label">Fuel</span>
                <span className="value">{car.fuel}</span>
              </div>
              <div className="spec-item">
                <span className="label">Engine</span>
                <span className="value">{car.engine}</span>
              </div>
              <div className="spec-item">
                <span className="label">Transmission</span>
                <span className="value">{car.transmission}</span>
              </div>
            </>
          )}
        </div>

        {!isCarAd && (
          <div className="detailed-info">
            <div className="tab-navigation">
              <button 
                className={activeTab === 'description' ? 'active' : ''}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={activeTab === 'specifications' ? 'active' : ''}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={activeTab === 'features' ? 'active' : ''}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description">
                  <p>{car.description}</p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="technical-specs">
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="label">Power</span>
                      <span className="value">{car.power}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Torque</span>
                      <span className="value">{car.torque}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">0-60 mph</span>
                      <span className="value">{car.acceleration}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Top Speed</span>
                      <span className="value">{car.topSpeed}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Fuel Economy</span>
                      <span className="value">{car.fuelEconomy}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">CO2 Emissions</span>
                      <span className="value">{car.co2}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Weight</span>
                      <span className="value">{car.weight}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Dimensions</span>
                      <span className="value">{car.length} x {car.width} x {car.height}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Boot Space</span>
                      <span className="value">{car.bootSpace}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Safety Rating</span>
                      <span className="value">{car.safetyRating}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Warranty</span>
                      <span className="value">{car.warranty}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div className="features">
                  <ul className="features-list">
                    {car.features && car.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {isCarAd && <p className="description">{car.description}</p>}

        {isCarAd && (
          <div className="car-actions">
            <button 
              className="action-btn contact"
              onClick={handleContactSeller}
            >
              <i className="fas fa-phone"></i> Call Seller
            </button>
            <button 
              className="action-btn whatsapp"
              onClick={handleWhatsApp}
            >
              <i className="fab fa-whatsapp"></i> WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetails; 