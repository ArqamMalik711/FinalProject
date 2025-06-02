import React, { useState } from 'react';
import '../styles/CarAdvisor.css';
import { getCarRecommendations } from '../services/geminiService';
import { FaSearch, FaCheckCircle } from 'react-icons/fa';

const CarAdvisor = () => {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    
    try {
      const result = await getCarRecommendations(prompt);
      if (result.recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
      } else {
        throw new Error('No recommendations received');
      }
    } catch (err) {
      setError(err.message || 'Sorry, we had trouble getting recommendations. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="advisor-container">
      <div className="advisor-hero">
        <div className="advisor-hero-content">
          <h1>AI Car Advisor</h1>
          <p>Tell us what you're looking for and our AI will find your perfect match</p>
        </div>
      </div>

      <div className="advisor-main">
        <form onSubmit={handleSubmit} className="prompt-form">
          <div className="prompt-input-container">
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Describe your ideal car... (e.g., 'I need a family-friendly SUV with good safety features and fuel efficiency, budget around $30,000')"
              className="prompt-input"
              disabled={isLoading}
            />
            <div className="prompt-examples">
              <p>Example prompts:</p>
              <ul>
                <li>"Looking for an electric car under $45,000 with good range for city commuting"</li>
                <li>"Need a reliable pickup truck for construction work, max budget $55,000"</li>
                <li>"Want a luxury sedan with advanced safety features, budget $60-80k"</li>
              </ul>
            </div>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <FaSearch style={{ marginRight: '8px' }} />
                  <span>Get AI Recommendations</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h2>Recommended Cars</h2>
            <div className="recommendations-grid">
              {recommendations.map((car, index) => (
                <div key={index} className="recommendation-card">
                  <div className="car-details">
                    <h3>{car.name}</h3>
                    <p>{car.description}</p>
                    <div className="car-features">
                      {car.key_features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          <FaCheckCircle size={16} style={{ color: 'var(--primary-color, #00d4ff)' }} />
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="car-price">
                      {car.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarAdvisor; 