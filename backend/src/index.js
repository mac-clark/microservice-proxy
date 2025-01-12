const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('config');
const cors = require('cors');
const bodyParser = require('body-parser');
const logs = require('./logs');
const { initializeWebSocketServer, broadcastNewLog } = require('../config/ws');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = config.get('port');

// Import routes
const logsRoutes = require('../routes/logs');
const targetRoutes = require('../routes/target');
const replayRoutes = require('../routes/replay');

// Use modularized routes
app.use(logsRoutes);
app.use(targetRoutes);
app.use(replayRoutes);

// Logging middleware
app.use((req, res, next) => {
  console.log(`[LOGGING MIDDLEWARE] Incoming request: ${req.method} ${req.url}`);
  const excludedPaths = ['/current-target', '/check-port', '/update-target'];

  if (excludedPaths.includes(req.path)) {
    return next();
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  };

  const originalSend = res.send;
  res.send = function (body) {
    logEntry.status = res.statusCode;
    logEntry.responseHeaders = res.getHeaders();
    logEntry.responseBody = body;

    logs.addLog(logEntry);
    broadcastNewLog(logEntry); // Broadcast the log to WebSocket clients
    console.log('Logged request:', logEntry);

    return originalSend.apply(res, arguments);
  };

  next();
});

// Start the proxy server
const server = app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});

// Initialize WebSocket server
initializeWebSocketServer(server);

// Proxy middleware with script injection
app.use(
  '/',
  createProxyMiddleware({
    target: config.get('targetServer'),
    changeOrigin: true,
    router: () => config.get('targetServer'),
    onProxyReq: (proxyReq, req) => {
      console.log(`[PROXY] Forwarding ${req.method} request to ${config.get('targetServer')}${req.url}`);
      if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
        let body = '';

        proxyRes.on('data', (chunk) => {
          body += chunk;
        });

        proxyRes.on('end', () => {
          const script = `
            <script>
              const socket = new WebSocket('ws://localhost:${PORT}');
              ['log', 'error', 'warn'].forEach(level => {
                const original = console[level];
                console[level] = function(...args) {
                  socket.send(JSON.stringify({ type: 'console', level, message: args.join(' '), timestamp: new Date().toISOString() }));
                  original.apply(console, args);
                };
              });
            </script>
          `;
          const modifiedBody = body.replace('</body>', `${script}</body>`);
          res.setHeader('Content-Length', Buffer.byteLength(modifiedBody));
          res.end(modifiedBody);
        });
      }
    },
    onError: (err, req, res) => {
      console.error(`[PROXY ERROR] ${err.message}`);
      res.status(502).send('Bad Gateway: Unable to reach target server.');
    },
  })
);