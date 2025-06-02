import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import './News.css';
import { Loader } from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const url = "https://newsapi.org/v2/everything?q=mercedes&language=en&sortBy=publishedAt&pageSize=100&apiKey=4d300bd273cd46b686732a3c9fdce869";
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        
        // Filter out articles without required data
        const validArticles = data.articles.filter(article => 
          article.title && 
          article.description && 
          article.urlToImage &&
          !article.title.includes('[Removed]') // Filter out removed articles
        );
        
        setArticles(validArticles.slice(0,30)); // Show top 30 articles
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return (
      <div className="news-page">
        <section className="page-header">
          <h1>Automotive News</h1>
          <p>Stay up to date with the latest automotive news, industry updates, and car releases</p>
        </section>
        <div className="news-container">
          <div className="error-container">
            <div className="error">Error: {error}</div>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <section className="page-header">
        <h1>Automotive News</h1>
        <p>Stay up to date with the latest automotive news, industry updates, and car releases</p>
      </section>

      <div className="news-container">
        {loading ? (
          <div className="loading-container">
            <Loader size={30} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            <p>Loading latest news...</p>
          </div>
        ) : (
          <div className="news-grid">
            {articles.map((article, index) => (
              <NewsItem
                key={`${article.title?.substring(0, 20)}-${index}`}
                title={article.title}
                description={article.description}
                imageUrl={article.urlToImage}
                newsUrl={article.url}
                publishedAt={article.publishedAt}
                source={article.source.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News; 