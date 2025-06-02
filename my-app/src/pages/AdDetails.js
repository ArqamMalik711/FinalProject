import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdDetails.css';

const AdDetails = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ads/${id}`);
        setAd(response.data.data || response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ad details:', err);
        setError('Failed to fetch ad details. Please try again later.');
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  const nextImage = () => {
    if (ad?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
    }
  };

  const prevImage = () => {
    if (ad?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ad) return <div className="error">Ad not found</div>;

  return (
    <div className="ad-details-container">
      <div className="ad-details-content">
        <div className="image-gallery">
          {ad.images && ad.images.length > 0 ? (
            <>
              <div className="main-image">
                <button className="nav-button prev" onClick={prevImage}>❮</button>
                <img 
                  src={`http://localhost:5000/${ad.images[currentImageIndex]}`} 
                  alt={`${ad.brand} ${ad.model} - View ${currentImageIndex + 1}`} 
                />
                <button className="nav-button next" onClick={nextImage}>❯</button>
              </div>
              <div className="image-thumbnails">
                {ad.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${image}`}
                    alt={`${ad.brand} ${ad.model} - Thumbnail ${index + 1}`}
                    className={index === currentImageIndex ? 'active' : ''}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-image">No Images Available</div>
          )}
        </div>

        <div className="ad-info">
          <h1>{ad.title}</h1>
          <div className="price-tag">£{ad.price.toLocaleString()}</div>

          <div className="info-section">
            <h2>Vehicle Details</h2>
            <div className="details-grid">
              {ad.brand && (
                <div className="detail-item">
                  <span className="label">Brand:</span>
                  <span className="value">{ad.brand}</span>
                </div>
              )}
              {ad.model && (
                <div className="detail-item">
                  <span className="label">Model:</span>
                  <span className="value">{ad.model}</span>
                </div>
              )}
              {ad.year && (
                <div className="detail-item">
                  <span className="label">Year:</span>
                  <span className="value">{ad.year}</span>
                </div>
              )}
              {ad.mileage && (
                <div className="detail-item">
                  <span className="label">Mileage:</span>
                  <span className="value">{ad.mileage.toLocaleString()} miles</span>
                </div>
              )}
              {ad.fuelType && (
                <div className="detail-item">
                  <span className="label">Fuel Type:</span>
                  <span className="value">{ad.fuelType}</span>
                </div>
              )}
              {ad.transmission && (
                <div className="detail-item">
                  <span className="label">Transmission:</span>
                  <span className="value">{ad.transmission}</span>
                </div>
              )}
              {ad.color && (
                <div className="detail-item">
                  <span className="label">Color:</span>
                  <span className="value">{ad.color}</span>
                </div>
              )}
              {ad.engine && (
                <div className="detail-item">
                  <span className="label">Engine:</span>
                  <span className="value">{ad.engine}</span>
                </div>
              )}
              {ad.bodyType && (
                <div className="detail-item">
                  <span className="label">Body Type:</span>
                  <span className="value">{ad.bodyType}</span>
                </div>
              )}
              {ad.doors && (
                <div className="detail-item">
                  <span className="label">Doors:</span>
                  <span className="value">{ad.doors}</span>
                </div>
              )}
              {ad.location && (
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{ad.location}</span>
                </div>
              )}
              {ad.condition && (
                <div className="detail-item">
                  <span className="label">Condition:</span>
                  <span className="value">{ad.condition}</span>
                </div>
              )}
            </div>
          </div>

          {ad.description && (
            <div className="description-section">
              <h2>Description</h2>
              <p>{ad.description}</p>
            </div>
          )}

          <div className="contact-section">
            <h2>Contact Information</h2>
            <div className="contact-details">
              {ad.ownerName && (
                <div className="contact-item">
                  <span className="label">Name:</span>
                  <span className="value">{ad.ownerName}</span>
                </div>
              )}
              {ad.ownerEmail && (
                <div className="contact-item">
                  <span className="label">Email:</span>
                  <span className="value">{ad.ownerEmail}</span>
                </div>
              )}
              {ad.ownerPhone && (
                <div className="contact-item">
                  <span className="label">Phone:</span>
                  <span className="value">{ad.ownerPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails; 