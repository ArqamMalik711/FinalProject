import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <ul>
            <li><Link to="/about">About CarWow</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/press">Press</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>For Buyers</h3>
          <ul>
            <li><Link to="/cars">Browse Cars</Link></li>
            <li><Link to="/reviews">Car Reviews</Link></li>
            <li><Link to="/guides">Buying Guides</Link></li>
            <li><Link to="/finance">Car Finance</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>For Sellers</h3>
          <ul>
            <li><Link to="/sell">Sell Your Car</Link></li>
            <li><Link to="/dealers">For Dealers</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/support">Seller Support</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 CarWow. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 