const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('config');
const logs = require('./logs');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = config.get('port');
const TARGET_SERVER = config.get('targetServer');

// Expose logs via an API endpoint
app.get('/logs', (req, res) => {
    res.json(logs.getLogs());
});

// Logging middleware
app.use((req, res, next) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body, // If body is parsed
    };

    // Hook into res.send
    const originalSend = res.send;
    res.send = function (body) {
        logEntry.status = res.statusCode;
        logEntry.responseHeaders = res.getHeaders();
        logEntry.responseBody = body;

        logs.addLog(logEntry);

        return originalSend.apply(res, arguments);
    };

    // Hook into res.end
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        if (!logEntry.status) {
            logEntry.status = res.statusCode;
            logEntry.responseHeaders = res.getHeaders();
            logEntry.responseBody = chunk ? chunk.toString() : null;

            logs.addLog(logEntry);
        }

        originalEnd.apply(res, arguments);
    };

    next();
});

// Replay endpoint
app.post('/replay', async (req, res) => {
  const { method, url, headers, body } = req.body;

  if (!method || !url) {
    return res.status(400).json({ error: 'Missing required fields: method and url' });
  }

  try {
    // Replay the request
    const response = await axios({
      method,
      url,
      headers,
      data: body, // Use `data` for POST/PUT request bodies
    });

    // Send the replayed response back
    res.status(200).json({
      status: response.status,
      headers: response.headers,
      body: response.data,
    });
  } catch (error) {
    console.error('Replay error:', error.message);

    // Handle replay errors
    res.status(error.response?.status || 500).json({
      error: error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      body: error.response?.data,
    });
  }
});

// Proxy middleware
app.use(
    '/',
    createProxyMiddleware({
        target: TARGET_SERVER,
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error('Proxy error:', err.message);
            res.status(502).send('Bad Gateway: Unable to reach target server.');
        },
    })
);

// Start the proxy server
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
