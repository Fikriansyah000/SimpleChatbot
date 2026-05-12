import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// Enable CORS for your React app's origin
app.use(cors({
  origin: 'http://localhost:5173' // Vite's default dev server port
}));
app.use(express.json());

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyArmatY0QO5BpJpTf2zozlh_NwXeHz3ES8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    // Extract the response text from Gemini's response format
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
    res.json({ text: responseText });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});