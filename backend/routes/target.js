const express = require('express');
const net = require('net');

const router = express.Router();

let currentTarget = 'http://localhost:5000'; // Default target, can be updated

// API endpoint to update the target
router.post('/update-target', (req, res) => {
  const { port } = req.body;

  // Validate port
  if (!port || isNaN(port) || port === '4000' || port === '8080') {
    return res.status(400).json({ error: 'Invalid or restricted port.' });
  }

  currentTarget = `http://localhost:${port}`;
  console.log(`Target updated to: ${currentTarget}`);
  res.status(200).json({ message: 'Target updated successfully.', target: currentTarget });
});

// Check port availability
router.get('/check-port', (req, res) => {
  const { port } = req.query;

  if (!port || isNaN(port)) {
    return res.status(400).json({ status: 'error', message: 'Invalid port number.' });
  }

  const server = net.createServer();
  server.listen(port, 'localhost', () => {
    server.close(() => {
      res.json({ status: 'open', message: `Port ${port} is available.` });
    });
  });

  server.on('error', () => {
    res.json({
      status: 'closed',
      message: `Port ${port} is already in use or restricted.`,
    });
  });
});

// Endpoint to fetch the current target
router.get('/current-target', (req, res) => {
  const targetPort = currentTarget.split(':').pop(); // Extract the port from the current target
  res.json({ target: targetPort });
});

module.exports = router;