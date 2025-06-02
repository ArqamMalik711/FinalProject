import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import CarList from './pages/CarList';
import CarDetails from './pages/CarDetails';
import CarAds from './pages/CarAds';
import AdDetails from './pages/AdDetails';
import SellCar from './pages/SellCar';
import Reviews from './pages/Reviews';
import News from './components/News';
import CarComparison from './pages/CarComparison';
import CarAdvisor from './pages/CarAdvisor';
import Auth from './pages/Auth';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<CarList />} />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/car-details/:id" element={<CarDetails />} />
              <Route path="/sell" element={<SellCar />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/news" element={<News />} />
              <Route path="/car-ads" element={<CarAds />} />
              <Route path="/ad-details/:id" element={<AdDetails />} />
              <Route path="/compare" element={<CarComparison />} />
              <Route path="/car-advisor" element={<CarAdvisor />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
