import express from 'express';
import { Me } from './app';
import * as path from 'path';
import { ChatRequest, ApiResponse } from './types';

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize the Me class instance
const me = new Me();

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Serve the main chat interface
 */
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Server error');
  }
});

/**
 * Handle chat messages
 */
app.post('/chat', async (req, res) => {
  try {
    const { message, history }: ChatRequest = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await me.chat(message, history || []);
    const apiResponse: ApiResponse = { response };
    
    res.json(apiResponse);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../../public')}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Health check available at: http://0.0.0.0:${port}/health`);
});
