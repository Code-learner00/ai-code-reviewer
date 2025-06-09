const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  // Unique identifier for the log entry
  logId: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString() // Generate unique ID by default
  },
  // The code snippet that was analyzed
  code: {
    type: String,
    required: true
  },
  // The programming language of the code
  language: {
    type: String,
    required: true
  },
  // The full prompt sent to the Gemini API
  geminiPrompt: {
    type: String,
    required: true
  },
  // The raw response received from the Gemini API
  geminiRawResponse: {
    type: Object, // Store as a flexible object to accommodate various Gemini outputs
    required: true
  },
  // The parsed and structured analysis result sent back to the frontend
  parsedAnalysisResult: {
    type: Object,
    required: true
  },
  // Timestamp of when the log entry was created
  timestamp: {
    type: Date,
    default: Date.now // Default to the current time
  },
  // Status of the analysis (e.g., 'success', 'error')
  status: {
    type: String,
    enum: ['success', 'error'],
    required: true
  },
  // If there was an error, store the error message
  errorMessage: {
    type: String,
    required: false // Not required for successful logs
  }
});

// Create a Mongoose model from the schema
const Log = mongoose.model('Log', LogSchema);

module.exports = Log;