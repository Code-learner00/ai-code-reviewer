
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors for cross-origin requests
const analysisRoutes = require('./routes/analysis'); // Import analysis routes
const logRoutes = require('./routes/logs'); // Import log routes

const app = express();
const PORT = process.env.PORT || 3001; // Port to run the server on

// Middleware
// Enable CORS for all routes. This is crucial for frontend-backend communication.
// In a production environment, you might want to restrict this to specific origins.
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in the .env file.');
  process.exit(1); // Exit the process if URI is missing
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // It's good practice to exit if the database connection fails on startup
    process.exit(1);
  });

// Routes
// Use the imported routes for handling API requests
app.use('/', analysisRoutes); // Handles POST /analyze
app.use('/', logRoutes);     // Handles GET /logs

// Basic route for checking server status
app.get('/', (req, res) => {
  res.send('AI Code Reviewer Backend is running!');
});

// Error handling middleware (optional, but good for production)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});