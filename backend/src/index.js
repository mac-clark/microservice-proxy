const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('config');
const logs = require('./logs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    console.log('Log Entry Initialized:', logEntry);

    // Hook into res.send
    const originalSend = res.send;
    res.send = function (body) {
        logEntry.status = res.statusCode;
        logEntry.responseHeaders = res.getHeaders();
        logEntry.responseBody = body;

        console.log('Log Entry Ready to Add:', logEntry);

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

            console.log('Log Entry Ready to Add (via end):', logEntry);

            logs.addLog(logEntry);
        }

        originalEnd.apply(res, arguments);
    };

    next();
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
