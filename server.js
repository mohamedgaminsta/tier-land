const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8765;

// Middleware
app.use(express.text({ type: 'text/plain', limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Save endpoint
app.post('/api/save', (req, res) => {
  try {
    const content = req.body;

    // Validate content
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    if (!content.includes('window.TIERLANDS_PLAYERS')) {
      return res.status(400).json({ error: 'Invalid leaderboard data' });
    }

    // Write to players-data.js
    const filePath = path.join(__dirname, 'players-data.js');
    fs.writeFileSync(filePath, content, 'utf-8');

    console.log('[SAVE] Successfully saved players-data.js');
    res.json({ ok: true, message: 'File saved successfully' });
  } catch (error) {
    console.error('[SAVE ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`TierLands server running at http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/adminsecretplacenoneknow/`);
});
