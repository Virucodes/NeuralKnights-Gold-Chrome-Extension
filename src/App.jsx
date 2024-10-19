import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [articleUrl, setArticleUrl] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Listen for the URL from the background script
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'TAB_URL' && message.url) {
        setArticleUrl(message.url);
        setArticleTitle(message.title);
        handleAnalyze(message.url);
      }
    });
  }, []);

  // Send the article URL to the backend for analysis using a query parameter
  const handleAnalyze = async (url) => {
    if (!url) {
      setError('No valid article URL');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      const res = await axios.get(`http://127.0.0.1:8000/api/chrome-extension?url=${encodeURIComponent(url)}`); // Adjust the URL as per your backend
      setAnalysis(res.data); // Assuming backend returns { sentiment: {...}, summary: "..." }
    } catch (error) {
      console.error('Error analyzing article:', error);
      setError('Failed to fetch article analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Analyze Article</h1>
      </header>

      <main className="main-content">
        {articleUrl && <h2 className="article-title">Analyzing: {articleTitle}</h2>}

        {loading && <div className="loading">Analyzing article...</div>}

        {error && <div className="error">{error}</div>}

        {/* Display analysis result */}
        {analysis && (
          <div className="analysis-result">
            <h3>Sentiment Analysis</h3>
            <p>Positive: {analysis.sentiment.positive}%</p>
            <p>Negative: {analysis.sentiment.negative}%</p>
            <h3>Summary</h3>
            <p>{analysis.summary}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
