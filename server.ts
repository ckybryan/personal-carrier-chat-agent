import express from 'express';
import { Me } from './app';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Enable JSON parsing
app.use(express.json());
app.use(express.static('public'));

const me = new Me();

// Serve the chat interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const response = await me.chat(message, history || []);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
