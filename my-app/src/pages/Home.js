import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { fetchFeaturedCars } from '../services/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getFeaturedCars = async () => {
      try {
        setLoading(true);
        const cars = await fetchFeaturedCars();
        setFeaturedCars(cars);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch featured cars:', err);
        setError('Failed to load featured cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getFeaturedCars();
  }, []);

  const categories = [
    { id: 1, name: 'Luxury Cars', path: '/cars?category=Luxury', image: '/images/luxury.jpg' },
    { id: 2, name: 'SUVs', path: '/cars?category=SUV', image: '/images/suv.jpg' },
    { id: 3, name: 'Electric Vehicles', path: '/cars?category=Electric', image: '/images/electric.jpg' },
    { id: 4, name: 'Family Cars', path: '/cars?category=Family', image: '/images/family.jpg' }
  ];
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <img src="/images/hero-bg.jpg" alt="Hero background" className="hero-bg" />
        <div className="hero-content">
          <h1>Find Your Perfect Car</h1>
          <form className="search-container" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search for a car..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
          <p>Compare prices from thousands of dealers</p>
        </div>
      </section>

      <section className="featured-cars">
        <h2>Featured Cars</h2>
        {loading ? (
          <div className="loading">Loading featured cars...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="car-grid">
            {featuredCars.map(car => (
              <div key={car._id} className="car-card">
                <img src={car.image} alt={car.name} />
                <div className="car-info">
                  <h3>{car.name}</h3>
                  <p className="price">{car.price}</p>
                  <p className="category">{car.category}</p>
                  <Link to={`/car/${car._id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="categories">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          {categories.map(category => (
            <Link key={category.id} to={category.path} className="category-card">
              <div className="category-image-container">
                <img src={category.image} alt={category.name} className="category-image" />
              </div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 