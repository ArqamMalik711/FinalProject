import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { registerUser, loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      
      if (isLogin) {
        // Handle login
        const response = await loginUser({ email, password });
        
        if (response.success) {
          // Update auth context with token
          updateUser(response.data, response.data.token);
          // Redirect to home page after successful login
          navigate('/');
        }
      } else {
        // Check if passwords match for sign up
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        // Handle sign up
        const response = await registerUser({ name, email, password });
        
        if (response.success) {
          // Update auth context
          updateUser(response.data);
          // Redirect to home page after successful registration
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-box">
          <div className="auth-header">
            <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p>
              {isLogin 
                ? 'Welcome back! Please sign in to your account' 
                : 'Join CarWow to find and compare the best car deals'}
            </p>
          </div>

          <div className="auth-tabs">
            <button 
              className={isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button 
              className={!isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
            )}

            <button 
              type="submit" 
              className="auth-submit" 
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            {isLogin ? (
              <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setIsLogin(true)}>Sign in</button></p>
            )}
          </div>
        </div>

        <div className="auth-benefits">
          <div className="benefits-content">
            <h3>Why join CarWow?</h3>
            <ul>
              <li>Get access to exclusive car deals</li>
              <li>Save your favorite cars</li>
              <li>Compare prices from multiple dealers</li>
              <li>Receive notifications about new deals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 