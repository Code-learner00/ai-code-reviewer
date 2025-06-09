// backend/routes/analysis.js
// Handles the /analyze API route for code analysis.
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Log = require('../models/Log'); // Import the Log model

const router = express.Router();

// Initialize Google Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not defined in the .env file. Please check your .env file.');
  // In a real app, you might throw an error or handle this more gracefully.
  // For now, we'll let the process continue but log an error.
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Use gemini-2.0-flash for text generation as instructed
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper function to construct the prompt for Gemini
function createGeminiPrompt(code, language) {
  return `Review the following ${language} code thoroughly. Provide a detailed analysis covering:
1.  **Bugs and Logic Issues**: Identify any errors, potential crashes, or logical flaws. List them as bullet points.
2.  **Best Practice Suggestions**: Recommend improvements based on common coding standards, readability, performance, and security. List them as bullet points.
3.  **Plain English Explanation**: Provide a clear, concise explanation of what the code does, its purpose, and its main components.
4.  **Suggested Test Cases or Docstrings**: Generate relevant unit test cases (using a common testing framework for the language, e.g., Jest for JS, Pytest for Python) or provide comprehensive docstring examples for key functions/classes. Present this in a code block.

Format your response as a JSON object with the following keys:
\`\`\`json
{
  "bugsAndLogicIssues": ["Issue 1", "Issue 2"],
  "bestPracticeSuggestions": ["Suggestion 1", "Suggestion 2"],
  "plainEnglishExplanation": "Explanation of the code...",
  "suggestedTestCasesOrDocstrings": "Code for test cases or docstrings..."
}
\`\`\`

Ensure all lists are arrays of strings. The test cases/docstrings should be a single string containing code.

Code to review:
\`\`\`${language}
${code}
\`\`\`
`;
}

router.post('/analyze', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ message: 'Code and language are required.' });
  }

  let logEntry;
  let geminiRawResponseText = ''; // To store the raw text response from Gemini
  let parsedAnalysisResult = {}; // To store parsed result

  try {
    const prompt = createGeminiPrompt(code, language);

    // Call Gemini API to generate content
    const geminiResult = await model.generateContent(prompt);

    // --- IMPORTANT DEBUGGING STEP ---
    // Log the entire geminiResult object to see its structure
    console.log('Raw Gemini API Response Object:', JSON.stringify(geminiResult, null, 2));

    // UPDATED: Check if result.response and result.response.candidates (plural) exist before accessing properties
    if (!geminiResult || !geminiResult.response || !geminiResult.response.candidates || geminiResult.response.candidates.length === 0) {
      console.error('Gemini API did not return a valid candidate:', geminiResult);
      throw new Error('Gemini API did not return a valid analysis candidate. Please check API key and input.');
    }

    // Access the text part of the first candidate from the 'candidates' array
    geminiRawResponseText = geminiResult.response.candidates[0].content.parts[0].text;

    // UPDATED: Extract JSON string from Markdown code block if present
    const jsonMatch = geminiRawResponseText.match(/```json\n([\s\S]*?)\n```/);
    let jsonStringToParse = geminiRawResponseText;
    if (jsonMatch && jsonMatch[1]) {
      jsonStringToParse = jsonMatch[1];
    } else {
      console.warn('Gemini response did not contain a JSON code block. Attempting to parse raw text.');
    }


    // Attempt to parse the JSON response from Gemini
    try {
      parsedAnalysisResult = JSON.parse(jsonStringToParse);
      // Ensure the parsed object has all expected keys, even if empty arrays/strings
      parsedAnalysisResult = {
        bugsAndLogicIssues: parsedAnalysisResult.bugsAndLogicIssues || [],
        bestPracticeSuggestions: parsedAnalysisResult.bestPracticeSuggestions || [],
        plainEnglishExplanation: parsedAnalysisResult.plainEnglishExplanation || '',
        suggestedTestCasesOrDocstrings: parsedAnalysisResult.suggestedTestCasesOrDocstrings || ''
      };
    } catch (parseError) {
      console.warn('Gemini response was not valid JSON, attempting fallback parsing or sending raw:', parseError);
      // Fallback: If Gemini doesn't return perfect JSON, provide a basic error message
      parsedAnalysisResult = {
        bugsAndLogicIssues: ['Could not parse specific bugs (Gemini JSON error).'],
        bestPracticeSuggestions: ['Could not parse specific suggestions (Gemini JSON error).'],
        plainEnglishExplanation: 'The AI could not return a structured JSON response. Here is the raw output: ' + geminiRawResponseText,
        suggestedTestCasesOrDocstrings: ''
      };
    }

    // Create a new log entry
    logEntry = new Log({
      code,
      language,
      geminiPrompt: prompt,
      geminiRawResponse: geminiRawResponseText, // Store the raw text response from Gemini
      parsedAnalysisResult: parsedAnalysisResult,
      status: 'success'
    });

    await logEntry.save(); // Save the log to MongoDB

    res.status(200).json(parsedAnalysisResult); // Send the parsed result to the frontend

  } catch (error) {
    console.error('Error during code analysis or logging:', error);

    // Create an error log entry
    logEntry = new Log({
      code,
      language,
      geminiPrompt: createGeminiPrompt(code, language), // Still log the prompt
      geminiRawResponse: geminiRawResponseText, // Log whatever raw response was received, even if incomplete
      parsedAnalysisResult: parsedAnalysisResult, // Log whatever was parsed, even if incomplete or default
      status: 'error',
      errorMessage: error.message
    });
    // Use a try-catch for saving the log entry itself to prevent further crashes
    try {
      await logEntry.save();
    } catch (logSaveError) {
      console.error('Failed to save error log to MongoDB:', logSaveError);
    }

    res.status(500).json({ message: 'Failed to analyze code due to an internal server error or Gemini API issue.', error: error.message });
  }
});

module.exports = router;
