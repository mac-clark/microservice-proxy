const express = require('express');
const logs = require('../src/logs'); // Import the log management module

const router = express.Router();

// Route to get all logs
router.get('/logs', (req, res) => {
  res.json(logs.getLogs());
});

// Route to clear all logs
router.delete('/logs', (req, res) => {
  logs.clearLogs();
  res.status(200).json({ message: 'All logs have been cleared.' });
});

module.exports = router;