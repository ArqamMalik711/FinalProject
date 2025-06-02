import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/CarComparison.css';
import { fetchCars, fetchCarById } from '../services/api';

const CarComparison = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedCar1Id = queryParams.get('car1');
  const preselectedCar2Id = queryParams.get('car2');

  const [cars, setCars] = useState([]);
  const [selectedCar1, setSelectedCar1] = useState(null);
  const [selectedCar2, setSelectedCar2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparisonActive, setComparisonActive] = useState(false);
  const [error, setError] = useState(null);
  
  // Load all cars from API
  useEffect(() => {
    const getAllCars = async () => {
      try {
        setLoading(true);
        const carsData = await fetchCars();
        setCars(carsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        setError('Failed to load cars for comparison. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getAllCars();
  }, []);

  // Load preselected cars from URL params
  useEffect(() => {
    const loadPreselectedCars = async () => {
      if (!preselectedCar1Id && !preselectedCar2Id) return;
      
      try {
        if (preselectedCar1Id) {
          const car1 = await fetchCarById(preselectedCar1Id);
          setSelectedCar1(car1);
        }
        
        if (preselectedCar2Id) {
          const car2 = await fetchCarById(preselectedCar2Id);
          setSelectedCar2(car2);
        }
        
        if (preselectedCar1Id && preselectedCar2Id) {
          setComparisonActive(true);
        }
      } catch (err) {
        console.error('Failed to fetch preselected cars:', err);
        setError('Failed to load preselected cars. Please try selecting manually.');
      }
    };

    loadPreselectedCars();
  }, [preselectedCar1Id, preselectedCar2Id]);

  const handleSelectCar1 = async (carId) => {
    if (!carId) {
      setSelectedCar1(null);
      return;
    }
    
    try {
      // Check if the car is already in the cars list
      const carFromList = cars.find(car => car._id === carId);
      
      if (carFromList) {
        setSelectedCar1(carFromList);
      } else {
        // Fetch from API if not found in the list
        const car = await fetchCarById(carId);
        setSelectedCar1(car);
      }
      
      if (selectedCar2) {
        setComparisonActive(true);
      }
    } catch (err) {
      console.error('Failed to fetch car details:', err);
      setError('Failed to load car details. Please try selecting a different car.');
    }
  };

  const handleSelectCar2 = async (carId) => {
    if (!carId) {
      setSelectedCar2(null);
      return;
    }
    
    try {
      // Check if the car is already in the cars list
      const carFromList = cars.find(car => car._id === carId);
      
      if (carFromList) {
        setSelectedCar2(carFromList);
      } else {
        // Fetch from API if not found in the list
        const car = await fetchCarById(carId);
        setSelectedCar2(car);
      }
      
      if (selectedCar1) {
        setComparisonActive(true);
      }
    } catch (err) {
      console.error('Failed to fetch car details:', err);
      setError('Failed to load car details. Please try selecting a different car.');
    }
  };

  const resetComparison = () => {
    setSelectedCar1(null);
    setSelectedCar2(null);
    setComparisonActive(false);
  };

  // Helper function to determine if one car's feature is better than the other
  const compareValue = (value1, value2, higherIsBetter = true) => {
    if (!value1 || !value2) return '';

    // For numeric comparisons, extract numbers
    const num1 = parseFloat(value1.replace(/[^0-9.]/g, ''));
    const num2 = parseFloat(value2.replace(/[^0-9.]/g, ''));

    if (isNaN(num1) || isNaN(num2)) return '';

    if (num1 === num2) return 'equal';
    if (higherIsBetter) {
      return num1 > num2 ? 'better' : 'worse';
    } else {
      return num1 < num2 ? 'better' : 'worse';
    }
  };

  if (loading) {
    return <div className="loading">Loading cars...</div>;
  }

  if (error && !comparisonActive) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="car-comparison-page">
      <section className="comparison-hero">
        <div className="comparison-hero-content">
          <h1>Compare Cars</h1>
          <p>Compare specifications, features, and prices of different vehicles side by side</p>
        </div>
      </section>

      <section className="comparison-container">
        <div className="car-selectors">
          <div className="car-selector">
            <h3>Select First Car</h3>
            <select 
              value={selectedCar1 ? selectedCar1._id : ''} 
              onChange={(e) => handleSelectCar1(e.target.value)}
            >
              <option value="">Select a car</option>
              {cars.map(car => (
                <option key={car._id} value={car._id}>{car.name} ({car.year})</option>
              ))}
            </select>
          </div>
          
          <div className="car-selector">
            <h3>Select Second Car</h3>
            <select 
              value={selectedCar2 ? selectedCar2._id : ''} 
              onChange={(e) => handleSelectCar2(e.target.value)}
            >
              <option value="">Select a car</option>
              {cars.map(car => (
                <option key={car._id} value={car._id}>{car.name} ({car.year})</option>
              ))}
            </select>
          </div>
        </div>

        {comparisonActive && selectedCar1 && selectedCar2 && (
          <div className="comparison-results">
            <button className="reset-comparison" onClick={resetComparison}>Reset Comparison</button>
            
            <div className="comparison-header">
              <div className="header-item"></div>
              <div className="header-item">
                <img src={selectedCar1.image} alt={selectedCar1.name} />
                <h3>{selectedCar1.name}</h3>
              </div>
              <div className="header-item">
                <img src={selectedCar2.image} alt={selectedCar2.name} />
                <h3>{selectedCar2.name}</h3>
              </div>
            </div>
            
            <div className="comparison-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="comparison-row">
                <div className="row-title">Price</div>
                <div className="row-value">{selectedCar1.price}</div>
                <div className="row-value">{selectedCar2.price}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Year</div>
                <div className="row-value">{selectedCar1.year}</div>
                <div className="row-value">{selectedCar2.year}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Category</div>
                <div className="row-value">{selectedCar1.category}</div>
                <div className="row-value">{selectedCar2.category}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Warranty</div>
                <div className="row-value">{selectedCar1.warranty}</div>
                <div className="row-value">{selectedCar2.warranty}</div>
              </div>
            </div>
            
            <div className="comparison-section">
              <h3 className="section-title">Engine & Performance</h3>
              
              <div className="comparison-row">
                <div className="row-title">Engine</div>
                <div className="row-value">{selectedCar1.engine}</div>
                <div className="row-value">{selectedCar2.engine}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Fuel Type</div>
                <div className="row-value">{selectedCar1.fuel}</div>
                <div className="row-value">{selectedCar2.fuel}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Transmission</div>
                <div className="row-value">{selectedCar1.transmission}</div>
                <div className="row-value">{selectedCar2.transmission}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Power</div>
                <div className={`row-value ${compareValue(selectedCar1.power, selectedCar2.power)}`}>
                  {selectedCar1.power}
                </div>
                <div className={`row-value ${compareValue(selectedCar2.power, selectedCar1.power)}`}>
                  {selectedCar2.power}
                </div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Torque</div>
                <div className={`row-value ${compareValue(selectedCar1.torque, selectedCar2.torque)}`}>
                  {selectedCar1.torque}
                </div>
                <div className={`row-value ${compareValue(selectedCar2.torque, selectedCar1.torque)}`}>
                  {selectedCar2.torque}
                </div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Acceleration (0-60)</div>
                <div className={`row-value ${compareValue(selectedCar1.acceleration, selectedCar2.acceleration, false)}`}>
                  {selectedCar1.acceleration}
                </div>
                <div className={`row-value ${compareValue(selectedCar2.acceleration, selectedCar1.acceleration, false)}`}>
                  {selectedCar2.acceleration}
                </div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Top Speed</div>
                <div className={`row-value ${compareValue(selectedCar1.topSpeed, selectedCar2.topSpeed)}`}>
                  {selectedCar1.topSpeed}
                </div>
                <div className={`row-value ${compareValue(selectedCar2.topSpeed, selectedCar1.topSpeed)}`}>
                  {selectedCar2.topSpeed}
                </div>
              </div>
            </div>
            
            <div className="comparison-section">
              <h3 className="section-title">Efficiency & Environment</h3>
              
              <div className="comparison-row">
                <div className="row-title">Fuel Economy</div>
                <div className={`row-value ${compareValue(selectedCar1.fuelEconomy, selectedCar2.fuelEconomy)}`}>
                  {selectedCar1.fuelEconomy}
                </div>
                <div className={`row-value ${compareValue(selectedCar2.fuelEconomy, selectedCar1.fuelEconomy)}`}>
                  {selectedCar2.fuelEconomy}
                </div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">CO2 Emissions</div>
                <div className={`row-value ${compareValue(selectedCar1.co2, selectedCar2.co2, false)}`}>
                  {selectedCar1.co2}
                </div>
                <div className={`row-value ${compareValue(selectedCar2.co2, selectedCar1.co2, false)}`}>
                  {selectedCar2.co2}
                </div>
              </div>
            </div>
            
            <div className="comparison-section">
              <h3 className="section-title">Dimensions</h3>
              
              <div className="comparison-row">
                <div className="row-title">Length</div>
                <div className="row-value">{selectedCar1.length}</div>
                <div className="row-value">{selectedCar2.length}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Width</div>
                <div className="row-value">{selectedCar1.width}</div>
                <div className="row-value">{selectedCar2.width}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Height</div>
                <div className="row-value">{selectedCar1.height}</div>
                <div className="row-value">{selectedCar2.height}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Weight</div>
                <div className="row-value">{selectedCar1.weight}</div>
                <div className="row-value">{selectedCar2.weight}</div>
              </div>
              
              <div className="comparison-row">
                <div className="row-title">Boot Space</div>
                <div className={`row-value ${compareValue(selectedCar1.bootSpace, selectedCar2.bootSpace)}`}>
                  {selectedCar1.bootSpace}
                </div>
                <div className={`row-value ${compareValue(selectedCar2.bootSpace, selectedCar1.bootSpace)}`}>
                  {selectedCar2.bootSpace}
                </div>
              </div>
            </div>
            
            <div className="comparison-section">
              <h3 className="section-title">Features</h3>
              
              <div className="features-comparison">
                <div className="features-col">
                  <h4>{selectedCar1.name} Features</h4>
                  <ul>
                    {selectedCar1.features && selectedCar1.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="features-col">
                  <h4>{selectedCar2.name} Features</h4>
                  <ul>
                    {selectedCar2.features && selectedCar2.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="comparison-actions">
              <Link to={`/car/${selectedCar1._id}`} className="btn btn-primary">
                View {selectedCar1.name} Details
              </Link>
              <Link to={`/car/${selectedCar2._id}`} className="btn btn-primary">
                View {selectedCar2.name} Details
              </Link>
            </div>
          </div>
        )}
        
        {!comparisonActive && (
          <div className="comparison-placeholder">
            <div className="placeholder-image">
              <i className="fas fa-car"></i>
              <i className="fas fa-exchange-alt"></i>
              <i className="fas fa-car"></i>
            </div>
            <h3>Select two cars to compare</h3>
            <p>Choose from the dropdown menus above to see a detailed comparison</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CarComparison; 