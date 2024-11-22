const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('config');

const app = express();

const PORT = config.get('port');
const TARGET_SERVER = config.get('targetServer');

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});