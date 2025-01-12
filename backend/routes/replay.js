const express = require('express');
const axios = require('axios');

const router = express.Router();

// Replay endpoint
router.post('/replay', async (req, res) => {
  const { method, url, headers, body, targetHost, targetPort } = req.body;

  if (!method || !url || !targetHost || !targetPort) {
    return res.status(400).json({ error: 'Missing required fields: method, url, targetHost, or targetPort' });
  }

  const fullUrl = `${targetHost}:${targetPort}${url}`;
  console.log(`Replaying request to: ${fullUrl}`);

  try {
    const response = await axios({
      method,
      url: fullUrl,
      headers,
      data: body,
    });

    res.status(200).json({
      status: response.status,
      headers: response.headers,
      body: response.data,
    });
  } catch (error) {
    console.error('Replay error:', error.message);

    res.status(error.response?.status || 500).json({
      error: error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      body: error.response?.data,
    });
  }
});

module.exports = router;