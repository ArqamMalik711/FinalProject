import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/UnauthorizedAccess.css';

const UnauthorizedAccess = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h1>Sign in Required</h1>
        <p>Please sign in to create and manage your car advertisements</p>
        <div className="unauthorized-benefits">
          <h2>Benefits of signing in:</h2>
          <ul>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Post unlimited car advertisements</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Manage your listings easily</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Reach thousands of potential buyers</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Get notified when buyers show interest</span>
            </li>
          </ul>
        </div>
        <div className="unauthorized-actions">
          <Link to="/auth" className="sign-in-button">
            Sign In
          </Link>
          <p className="create-account-text">
            Don't have an account?{' '}
            <Link to="/auth" className="create-account-link">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess; 