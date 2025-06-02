import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { AuthContext } from '../context/AuthContext';
import { logoutUser } from '../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { currentUser, updateUser } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logoutUser();
    updateUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="CarWow Logo" className='logo-img'/>
          </Link>
        </div>
        
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cars">Browse Cars</Link></li>
            <li><Link to="/compare">Compare Cars</Link></li>
            <li><Link to="/car-advisor">Car Advisor</Link></li>
            <li><Link to="/sell">Sell Your Car</Link></li>
            <li><Link to="/car-ads">Car Ads</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/news">News</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            <div className="user-dropdown">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <i className="fas fa-user-circle"></i>
                <span>{currentUser.name}</span>
              </button>
              {showUserMenu && (
                <div className="user-menu">
                  <ul>
                    <li>
                      <button onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="auth-button">
              <i className="fas fa-user"></i>
              <span>Sign In</span>
            </Link>
          )}
          <button 
            className="search-btn" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <i className="fas fa-search"></i>
          </button>
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      {isSearchOpen && (
        <div className="header-search">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search for cars..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-submit-btn">
              <i className="fas fa-search"></i>
            </button>
            <button 
              type="button" 
              className="close-search"
              onClick={() => setIsSearchOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header; 