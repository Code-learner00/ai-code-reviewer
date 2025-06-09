// frontend/src/components/AnalysisOutput.js
import React from 'react';
import './AnalysisOutput.css';

function AnalysisOutput({ result }) {
  // Ensure result structure matches what the backend sends from Gemini API
  const {
    bugsAndLogicIssues = [],
    bestPracticeSuggestions = [],
    plainEnglishExplanation = '',
    suggestedTestCasesOrDocstrings = ''
  } = result;

  return (
    <div className="analysis-output-container">
      <h2>Analysis Results</h2>

      {plainEnglishExplanation && (
        <div className="analysis-section">
          <h3>Code Explanation</h3>
          <p>{plainEnglishExplanation}</p>
        </div>
      )}

      {bugsAndLogicIssues.length > 0 && (
        <div className="analysis-section bugs">
          <h3>Bugs and Logic Issues</h3>
          <ul>
            {bugsAndLogicIssues.map((issue, index) => (
              <li key={`bug-${index}`}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {bestPracticeSuggestions.length > 0 && (
        <div className="analysis-section suggestions">
          <h3>Best Practice Suggestions</h3>
          <ul>
            {bestPracticeSuggestions.map((suggestion, index) => (
              <li key={`suggestion-${index}`}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestedTestCasesOrDocstrings && (
        <div className="analysis-section tests-docs">
          <h3>Suggested Test Cases / Docstrings</h3>
          <pre><code>{suggestedTestCasesOrDocstrings}</code></pre>
        </div>
      )}

      {/* Message if no analysis results were returned or all fields are empty */}
      {!plainEnglishExplanation && bugsAndLogicIssues.length === 0 &&
       bestPracticeSuggestions.length === 0 && !suggestedTestCasesOrDocstrings && (
        <div className="no-results-message">
          No specific analysis results were returned for this code.
        </div>
      )}
    </div>
  );
}

export default AnalysisOutput;