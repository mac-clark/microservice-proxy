const WebSocket = require('ws');

let wss;

// Initialize WebSocket server
function initializeWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Handle incoming messages from clients (optional)
    ws.on('message', (message) => {
      console.log('Received message from client:', message);
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}

// Broadcast a new log to all connected clients
function broadcastNewLog(log) {
  if (!wss) {
    console.error('WebSocket server is not initialized');
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(log));
    }
  });
}

module.exports = {
  initializeWebSocketServer,
  broadcastNewLog,
};
