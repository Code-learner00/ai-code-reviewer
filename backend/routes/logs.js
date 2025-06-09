const express = require('express');
const Log = require('../models/Log'); // Import the Log model

const router = express.Router();

router.get('/logs', async (req, res) => {
  try {
    // Fetch all logs from the database, sorted by timestamp in descending order
    const logs = await Log.find().sort({ timestamp: -1 });
    res.status(200).json(logs); // Send the retrieved logs as a JSON response
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Failed to retrieve logs.', error: error.message });
  }
});

module.exports = router;