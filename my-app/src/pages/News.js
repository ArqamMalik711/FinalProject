import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/news');
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to fetch news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="loading">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error">{error}</div>
    </div>
  );

  return (
    <>
      <section className="page-header">
        <h1>Automotive News</h1>
        <p>Stay up to date with the latest automotive news, industry updates, and car releases</p>
      </section>
      
      <div className="news-container">
        <div className="news-grid">
          {news.map((article) => (
            <div key={article._id} className="news-card">
              <div className="news-img-container">
                <img src={article.image} alt={article.title} />
                <span className="news-category">News</span>
              </div>
              <div className="news-content">
                <h3>{article.title}</h3>
                <div className="news-meta">
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <p className="news-excerpt">{article.excerpt}</p>
                <Link to={`/news/${article._id}`} className="read-more">
                  Read More <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default News; 