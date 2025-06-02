import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SellCar.css';
import { AuthContext } from '../context/AuthContext';
import { createAd } from '../services/api';
import UnauthorizedAccess from '../components/UnauthorizedAccess';

const SellCar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    color: '',
    engine: '',
    bodyType: '',
    doors: '',
    location: '',
    description: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    condition: 'Used',
  });

  // for image previews & removal
  const [images, setImages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(f => ({
        ...f,
        ownerName: currentUser.name || '',
        ownerEmail: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  if (!currentUser) {
    return <UnauthorizedAccess />;
  }

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleFiles = files => {
    const newImages = [...images];
    Array.from(files).forEach(file => {
      if (newImages.length < 10 && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = ev => {
          newImages.push({ file, url: ev.target.result });
          setImages([...newImages]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInputChange = e => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveImage = index => {
    setImages(imgs => imgs.filter((_, i) => i !== index));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // 1) Validate required fields
    const required = ['title', 'description', 'price', 'year', 'mileage', 'brand', 'model', 'fuelType', 'transmission', 'color', 'location', 'ownerName', 'ownerEmail', 'ownerPhone'];
    const missing = required.filter(f => !formData[f].toString().trim());
    if (missing.length) {
      return alert(`Please fill in required fields: ${missing.join(', ')}`);
    }

    // 2) Token & decode
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to create an ad');
      return navigate('/auth');
    }
    
    let userId;
    try {
      const pl = JSON.parse(atob(token.split('.')[1]));
      userId = pl._id || pl.id || pl.sub || pl.userId;
      console.log('SellCar.js - Extracted userId:', userId);
    } catch {
      alert('Authentication problem. Please log in again.');
      return navigate('/auth');
    }
    
    if (!userId) {
      alert('Authentication problem. Please log in again.');
      return navigate('/auth');
    }

    // 3) Build ad object with all fields properly formatted
    const adObj = {
      user: userId,
      userId,
      title: formData.title.trim(),
      brand: formData.brand,
      model: formData.model.trim(),
      year: parseInt(formData.year, 10),
      price: parseFloat(formData.price),
      mileage: parseInt(formData.mileage, 10),
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      color: formData.color.trim(),
      engine: formData.engine.trim() || null,
      bodyType: formData.bodyType || null,
      doors: formData.doors ? parseInt(formData.doors, 10) : null,
      location: formData.location.trim(),
      description: formData.description.trim(),
      condition: formData.condition,
      ownerName: formData.ownerName.trim(),
      ownerEmail: formData.ownerEmail.trim(),
      ownerPhone: formData.ownerPhone.trim(),
    };

    // 4) Build FormData - append each field individually
    const fd = new FormData();
    
    // Append all the form fields
    Object.entries(adObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        fd.append(key, value.toString());
      }
    });

    // Append images if any
    images.forEach((img, index) => {
      fd.append('images', img.file, img.file.name);
    });

    console.log('SellCar.js - FormData to send:');
    for (let [k, v] of fd.entries()) {
      console.log(k, v);
    }

    // 5) Send the request
    try {
      setIsSubmitted(true); // Show loading state
      const res = await createAd(fd);
      console.log('CreateAd response:', res);
      
      if (res && (res.success || res.data)) {
        // reset form
        setFormData({
          title: '', brand: '', model: '', year: '',
          price: '', mileage: '', fuelType: '',
          transmission: '', color: '', engine: '',
          bodyType: '', doors: '', location: '',
          description: '', ownerName: currentUser?.name || '',
          ownerEmail: currentUser?.email || '', ownerPhone: '',
          condition: 'Used',
        });
        setImages([]);
        alert('Ad created successfully!');
        setTimeout(() => navigate('/car-ads'), 2000);
      } else {
        setIsSubmitted(false);
        console.error('Failed response:', res);
        alert(res.message || 'Failed to create ad. Please try again.');
      }
    } catch (err) {
      setIsSubmitted(false);
      console.error('Error creating ad:', err);
      alert(err.message || 'Failed to create ad. Please try again.');
    }
  };

  return (
    <div className="sell-car-container">
      <div className="page-header">
        <h1>Sell Your Car</h1>
        <p>List your vehicle and reach thousands of potential buyers</p>
      </div>

      <div className="sell-car-content">
        {isSubmitted ? (
          <div className="success-message">
            <h2>Thank you for listing your car!</h2>
            <p>Your car listing has been successfully submitted. We'll review and publish it shortly.</p>
            <Link to="/" className="submit-button">Return to Home</Link>
          </div>
        ) : (
          <>
            <form className="sell-form" onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="form-group">
                <label htmlFor="title">Listing Title*</label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="E.g., 2019 BMW 3 Series in Excellent Condition"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brand">Brand*</label>
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Brand</option>
                    <option value="audi">Audi</option>
                    <option value="bmw">BMW</option>
                    <option value="ford">Ford</option>
                    <option value="honda">Honda</option>
                    <option value="hyundai">Hyundai</option>
                    <option value="kia">Kia</option>
                    <option value="mercedes">Mercedes-Benz</option>
                    <option value="nissan">Nissan</option>
                    <option value="toyota">Toyota</option>
                    <option value="volkswagen">Volkswagen</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="model">Model*</label>
                  <input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="E.g., 3 Series, Civic"
                    required
                  />
                </div>
              </div>

              {/* Year & Price */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year*</label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
                      .map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price (£)*</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter asking price"
                    required
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mileage">Mileage (miles)*</label>
                  <input
                    id="mileage"
                    name="mileage"
                    type="number"
                    min="0"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fuelType">Fuel Type*</label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                    <option value="lpg">LPG</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="transmission">Transmission*</label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Transmission</option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="semi-automatic">Semi-Automatic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="color">Color*</label>
                  <input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="E.g., White, Black"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="engine">Engine Size (L)</label>
                  <input
                    id="engine"
                    name="engine"
                    value={formData.engine}
                    onChange={handleInputChange}
                    placeholder="E.g., 2.0, 1.6"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bodyType">Body Type</label>
                  <select
                    id="bodyType"
                    name="bodyType"
                    value={formData.bodyType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Body Type</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                    <option value="wagon">Estate/Wagon</option>
                    <option value="van">Van</option>
                    <option value="pickup">Pickup</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="doors">Number of Doors</label>
                  <select
                    id="doors"
                    name="doors"
                    value={formData.doors}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Number of Doors</option>
                    {[2,3,4,5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location*</label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="E.g., London, Manchester"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your car's condition, history, features..."
                  required
                />
              </div>

              {/* Photos */}
              <div className="form-group">
                <label>Car Photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                />
                <small>You can upload up to 10 images. Supported formats: JPG, PNG, GIF</small>
              </div>
              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((img, i) => (
                    <div key={i} className="preview-item">
                      <img src={img.url} alt={`Preview ${i+1}`} />
                      <button type="button" onClick={() => handleRemoveImage(i)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Details */}
              <div className="form-section">
                <h3>Contact Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ownerName">Your Name*</label>
                    <input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ownerEmail">Email Address*</label>
                    <input
                      id="ownerEmail"
                      name="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="ownerPhone">Phone Number*</label>
                  <input
                    id="ownerPhone"
                    name="ownerPhone"
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    required
                  />
                </div>
              </div>

              <div className="submit-section">
                <button type="submit" className="submit-button">List My Car</button>
                <p className="form-disclaimer">
                  By submitting this form, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
      
      <div className="sell-benefits">
        <div className="benefits-container">
          <div className="benefits-header">
            <h2>Why Sell Your Car With Us?</h2>
            <p>Thousands of sellers have chosen our platform for these great benefits</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-pound-sign"></i>
              </div>
              <h3>Better Value</h3>
              <p>Most sellers get £1,000 more compared to part exchange or other platforms</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <h3>Safe & Secure</h3>
              <p>Verified buyers and secure payment processing for your peace of mind</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h3>Fast Results</h3>
              <p>Most cars receive multiple inquiries within 24 hours of listing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCar;