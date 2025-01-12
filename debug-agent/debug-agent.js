const WebSocket = require('ws');

class DebugAgent {
  constructor() {
    this.wss = null;
    this.originalConsole = {};
  }

  // Start the debug agent
  start(server) {
    if (!server) {
      console.error('[DebugAgent] No server instance provided to start WebSocket');
      return;
    }

    // Initialize WebSocket server with the provided server
    this.wss = new WebSocket.Server({ server, path: '/debug' }, () => {
      console.log('[DebugAgent] WebSocket server initialized');
    });

    this.wss.on('connection', (ws) => {
      console.log('[DebugAgent] Client connected to WebSocket');

      ws.on('close', () => {
        console.log('[DebugAgent] Client disconnected from WebSocket');
      });

      ws.on('error', (error) => {
        console.error('[DebugAgent] WebSocket error:', error.message);
      });
    });

    // Intercept console output
    this.interceptConsole();
  }

  // Intercept console output
  interceptConsole() {
    ['log', 'error', 'warn'].forEach((level) => {
      this.originalConsole[level] = console[level];

      console[level] = (...args) => {
        const timestamp = new Date().toISOString();
        const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');

        // Broadcast the log to WebSocket clients
        this.broadcastLog({ timestamp, level, message });

        // Call the original console function
        this.originalConsole[level](...args);
      };
    });
  }

  // Broadcast a log to WebSocket clients
  broadcastLog(log) {
    if (!this.wss) {
      console.error('[DebugAgent] WebSocket server is not initialized');
      return;
    }

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(log));
      }
    });
  }

  // Restore original console functions
  restoreConsole() {
    Object.keys(this.originalConsole).forEach((level) => {
      console[level] = this.originalConsole[level];
    });
  }
}

// Export a single instance
module.exports = new DebugAgent();