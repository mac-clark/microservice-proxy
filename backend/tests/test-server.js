const express = require('express');
const app = express();

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Hello from the test server!');
});

// Example API endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'This is a test endpoint', status: 'success' });
});

// Example POST endpoint
app.post('/api/test', (req, res) => {
    res.json({ message: 'Data received', data: req.body });
});

// Simulate error endpoint
app.get('/api/error', (req, res) => {
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the test server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`);
});
