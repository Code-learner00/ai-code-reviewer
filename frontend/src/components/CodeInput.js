// frontend/src/components/CodeInput.js
import React from 'react';
import './CodeInput.css';

function CodeInput({ code, setCode, language, setLanguage, onAnalyze, isLoading }) {
  const languages = ['javascript', 'python', 'java', 'c++', 'go', 'ruby', 'php', 'typescript', 'csharp', 'kotlin', 'swift'];

  return (
    <div className="code-input-container">
      <div className="controls-row">
        <select
          className="language-selector"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Select programming language"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
        <button
          className="analyze-button"
          onClick={onAnalyze}
          disabled={isLoading || !code.trim()} // Disable if loading or code is empty
        >
          {isLoading ? 'Analyzing...' : 'Analyze Code'}
        </button>
      </div>
      <textarea
        className="code-textarea"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`Paste your ${language} code here...`}
        rows="20" // Adjust rows for better visibility
        spellCheck="false" // Disable spell check for code
      ></textarea>
    </div>
  );
}

export default CodeInput;