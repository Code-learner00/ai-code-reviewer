
// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import CodeInput from './components/CodeInput';
import AnalysisOutput from './components/AnalysisOutput';
import './App.css'; // App-specific layout and components

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('code-review-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to light if no theme is saved
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  // Effect to apply theme class to body and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('code-review-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleAnalyzeCode = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    try {
      // Replace with your backend URL
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze code');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Error analyzing code:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Code Reviewer</h1>
        <button className="theme-toggle-button" onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>
      <main className="app-main">
        <div className="input-section">
          <CodeInput
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            onAnalyze={handleAnalyzeCode}
            isLoading={isLoading}
          />
        </div>
        <div className="output-section">
          {isLoading && <div className="loading-spinner"></div>}
          {error && <div className="error-message">{error}</div>}
          {analysisResult && <AnalysisOutput result={analysisResult} />}
          {!isLoading && !error && !analysisResult && (
            <div className="placeholder-text">
              Enter your code and click "Analyze" to see the magic happen!
            </div>
          )}
        </div>
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 AI Code Reviewer. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}

export default App;