import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/CarList.css';
import { fetchCars } from '../services/api';

const CarList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search');
  const categoryParam = queryParams.get('category');

  const [filters, setFilters] = useState({
    priceRange: 'Any Price',
    category: categoryParam || 'All Categories',
    year: 'Any Year',
    fuel: 'Any Fuel',
    brand: 'Any Brand',
    model: 'Any Model'
  });
  
  const [pendingFilters, setPendingFilters] = useState({
    priceRange: 'Any Price',
    category: categoryParam || 'All Categories',
    year: 'Any Year',
    fuel: 'Any Fuel',
    brand: 'Any Brand',
    model: 'Any Model'
  });
  
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch cars from the API
  // Initialize pendingFilters with current filters
  useEffect(() => {
    setPendingFilters(filters);
  }, [filters, setPendingFilters]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        // If we have a category filter or search term from the URL, pass to the API
        const apiQueryParams = {};
        if (categoryParam) {
          apiQueryParams.category = categoryParam;
        }
        if (searchQuery) {
          apiQueryParams.search = searchQuery;
        }
        
        const carsData = await fetchCars(apiQueryParams);
        setCars(carsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [categoryParam, searchQuery]);

  // Apply client-side filters
  useEffect(() => {
    // Filter cars based on search and filters
    let result = [...cars];
    
    // Apply search filter if it wasn't already applied in the API call
    if (searchTerm && !searchQuery) {
      result = result.filter(car => 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter if it wasn't already applied in the API call
    if (filters.category !== 'All Categories' && filters.category !== categoryParam) {
      result = result.filter(car => 
        car.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply brand filter
    if (filters.brand !== 'Any Brand') {
      result = result.filter(car => {
        const { brand } = getBrandAndModel(car.name);
        return brand.toLowerCase() === filters.brand.toLowerCase();
      });
    }

    // Apply model filter
    if (filters.model !== 'Any Model') {
      result = result.filter(car => {
        const { model } = getBrandAndModel(car.name);
        return model.toLowerCase() === filters.model.toLowerCase();
      });
    }
    
    // Apply price range filter
    if (filters.priceRange !== 'Any Price') {
      switch (filters.priceRange) {
        case 'Under £20,000':
          result = result.filter(car => 
            parseFloat(car.price.replace('£', '').replace(',', '')) < 20000
          );
          break;
        case '£20,000 - £30,000':
          result = result.filter(car => {
            const price = parseFloat(car.price.replace('£', '').replace(',', ''));
            return price >= 20000 && price <= 30000;
          });
          break;
        case '£30,000 - £40,000':
          result = result.filter(car => {
            const price = parseFloat(car.price.replace('£', '').replace(',', ''));
            return price > 30000 && price <= 40000;
          });
          break;
        case 'Over £40,000':
          result = result.filter(car => 
            parseFloat(car.price.replace('£', '').replace(',', '')) > 40000
          );
          break;
        default:
          break;
      }
    }
    
    // Apply fuel filter
    if (filters.fuel !== 'Any Fuel') {
      result = result.filter(car => car.fuel === filters.fuel);
    }
    
    // Apply year filter
    if (filters.year !== 'Any Year') {
      result = result.filter(car => car.year.toString() === filters.year);
    }
    
    setFilteredCars(result);
  }, [searchTerm, filters, cars, searchQuery, categoryParam]);

  // Extract brand and model from car name (e.g., "Audi A4" -> brand: "Audi", model: "A4")
  const getBrandAndModel = (name) => {
    const parts = name.split(' ');
    return {
      brand: parts[0],
      model: parts.slice(1).join(' ')
    };
  };

  // Get unique brands from cars array
  const uniqueBrands = [...new Set(cars.map(car => getBrandAndModel(car.name).brand))].sort();
  
  // Get unique models for selected brand
  const uniqueModels = [...new Set(cars
    .filter(car => {
      if (pendingFilters.brand === 'Any Brand') return true;
      const { brand } = getBrandAndModel(car.name);
      return brand === pendingFilters.brand;
    })
    .map(car => getBrandAndModel(car.name).model))].sort();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'brand') {
      // Reset model when brand changes
      setPendingFilters({
        ...pendingFilters,
        [name]: value,
        model: 'Any Model'
      });
    } else {
      setPendingFilters({
        ...pendingFilters,
        [name]: value
      });
    }
  };

  const handleApplyFilters = () => {
    setFilters(pendingFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update search term state
    setSearchTerm(e.target.search.value);
  };

  return (
    <div className="car-list">
      <section className="page-header">
        <h1>Browse Cars</h1>
        <p>Explore our extensive collection of quality vehicles for sale</p>
      </section>

      <div className="content-section">
        {/* Search bar area */}
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <div className="search-input-container">
              <input 
                type="text" 
                name="search"
                placeholder="Search cars..." 
                defaultValue={searchTerm}
              />
              <button type="submit" className="search-button-list">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
        
        {/* Content grid with filters and cars */}
        <div className="content-grid">
          <div className="filters">
            <h2>Filters</h2>
            <div className="filter-group">
              <label>Price Range</label>
              <select 
                name="priceRange" 
                value={pendingFilters.priceRange} 
                onChange={handleFilterChange}
              >
                <option>Any Price</option>
                <option>Under £20,000</option>
                <option>£20,000 - £30,000</option>
                <option>£30,000 - £40,000</option>
                <option>Over £40,000</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Category</label>
              <select 
                name="category" 
                value={pendingFilters.category} 
                onChange={handleFilterChange}
              >
                <option>All Categories</option>
                <option>Luxury</option>
                <option>SUV</option>
                <option>Electric</option>
                <option>Family</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Brand</label>
              <select 
                name="brand" 
                value={pendingFilters.brand} 
                onChange={handleFilterChange}
              >
                {['Any Brand', ...uniqueBrands].map(brand => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Model</label>
              <select 
                name="model" 
                value={pendingFilters.model} 
                onChange={handleFilterChange}
              >
                {['Any Model', ...uniqueModels].map(model => (
                  <option key={model}>{model}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Fuel Type</label>
              <select 
                name="fuel" 
                value={pendingFilters.fuel} 
                onChange={handleFilterChange}
              >
                <option>Any Fuel</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Year</label>
              <select 
                name="year" 
                value={pendingFilters.year} 
                onChange={handleFilterChange}
              >
                <option>Any Year</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
              </select>
            </div>
            <button 
              type="button" 
              className="apply-filters-button" 
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>

          <div className="cars-container">
            <h2>Available Cars {filteredCars.length > 0 ? `(${filteredCars.length})` : ''}</h2>
            
            {loading ? (
              <div className="loading">Loading cars...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : filteredCars.length === 0 ? (
              <div className="no-results">
                <h3>No cars found matching your criteria</h3>
                <p>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="cars-grid">
                {filteredCars.map((car) => (
                  <div key={car._id} className="car-card">
                    <div className="car-image">
                      <img src={car.image} alt={car.name} />
                    </div>
                    <div className="car-details">
                      <h3>{car.name}</h3>
                      <p className="price">{car.price}</p>
                      <div className="car-specs">
                        <span><i className="fas fa-calendar-alt"></i> {car.year}</span>
                        <span><i className="fas fa-gas-pump"></i> {car.fuel}</span>
                        <span><i className="fas fa-road"></i> {car.mileage}</span>
                      </div>
                      <div className="car-actions">
                        <Link to={`/car/${car._id}`} className="details-btn">View Details</Link>
                        <Link to={`/compare?car1=${car._id}`} className="compare-btn">Compare</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarList; 