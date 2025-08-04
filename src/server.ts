import express from 'express';
import { Me } from './app';
import * as path from 'path';
import { ChatRequest, ApiResponse } from './types';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize the Me class instance
const me = new Me();

/**
 * Serve the main chat interface
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
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

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../public')}`);
});
