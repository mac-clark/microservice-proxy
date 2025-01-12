const express = require('express');
const app = express();
const debugAgent = require('./debug-agent');

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    console.log('Test server: Root route accessed.');
    res.send('Hello from the test server!');
});

// Example API endpoint
app.get('/api/test', (req, res) => {
    console.warn('Test server: Test route accessed.');
    res.json({ message: 'This is a test endpoint', status: 'success' });
});

// Example POST endpoint
app.post('/api/test', (req, res) => {
    res.json({ message: 'Data received', data: req.body });
});

// Simulate error endpoint
app.get('/api/error', (req, res) => {
    console.error('Test server: Error route accessed.');
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the test server
const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`);
});

debugAgent.start(server);