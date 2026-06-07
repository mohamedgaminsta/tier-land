const express = require('express');
const fs = require('fs');
const path = require('path');
const { savePlayersData, getPlayersData } = require('./supabase');

const app = express();
const PORT = process.env.PORT || 8765;

// Middleware
app.use(express.text({ type: 'text/plain', limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Save endpoint - saves to Supabase
app.post('/api/save', async (req, res) => {
  try {
    const content = req.body;

    // Validate content
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    if (!content.includes('window.TIERLANDS_PLAYERS')) {
      return res.status(400).json({ error: 'Invalid leaderboard data' });
    }

    // Save to Supabase
    await savePlayersData(content);

    // Also save to local file as backup
    const filePath = path.join(__dirname, 'players-data.js');
    fs.writeFileSync(filePath, content, 'utf-8');

    console.log('[SAVE] Successfully saved to Supabase and players-data.js');
    res.json({ ok: true, message: 'Data saved to Supabase and local backup' });
  } catch (error) {
    console.error('[SAVE ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

// Load endpoint - loads from Supabase
app.get('/api/load', async (req, res) => {
  try {
    const data = await getPlayersData();
    if (data) {
      res.json({ ok: true, data: data });
    } else {
      res.status(404).json({ error: 'No data found in database' });
    }
  } catch (error) {
    console.error('[LOAD ERROR]', error);
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
