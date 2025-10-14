const express = require('express');
const cors = require('cors');
const { client, connectRedis } = require('./redis-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Redis
connectRedis().catch(console.error);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', redis: client.isOpen ? 'connected' : 'disconnected' });
});

// Get all hanja
app.get('/api/hanja', async (req, res) => {
  try {
    const hanjaIds = await client.zRange('hanja:by_frequency', 0, -1);
    const hanjaList = [];
    
    for (const id of hanjaIds) {
      const hanja = await client.hGetAll(`hanja:${id}`);
      if (hanja && Object.keys(hanja).length > 0) {
        hanjaList.push({ id, ...hanja });
      }
    }
    
    res.json(hanjaList);
  } catch (error) {
    console.error('Error fetching hanja:', error);
    res.status(500).json({ error: 'Failed to fetch hanja' });
  }
});

// Get specific hanja by ID
app.get('/api/hanja/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hanja = await client.hGetAll(`hanja:${id}`);
    
    if (!hanja || Object.keys(hanja).length === 0) {
      return res.status(404).json({ error: 'Hanja not found' });
    }
    
    // Get associated words
    const wordIds = await client.sMembers(`hanja:${id}:words`);
    const words = [];
    
    for (const wordId of wordIds) {
      const word = await client.hGetAll(`word:${wordId}`);
      if (word && Object.keys(word).length > 0) {
        words.push({ id: wordId, ...word });
      }
    }
    
    res.json({ id, ...hanja, words });
  } catch (error) {
    console.error('Error fetching hanja:', error);
    res.status(500).json({ error: 'Failed to fetch hanja' });
  }
});

// Get all words
app.get('/api/words', async (req, res) => {
  try {
    const wordIds = await client.zRange('words:by_frequency', 0, -1);
    const wordList = [];
    
    for (const id of wordIds) {
      const word = await client.hGetAll(`word:${id}`);
      if (word && Object.keys(word).length > 0) {
        wordList.push({ id, ...word });
      }
    }
    
    res.json(wordList);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

// Get specific word by ID
app.get('/api/words/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const word = await client.hGetAll(`word:${id}`);
    
    if (!word || Object.keys(word).length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    }
    
    // Get associated hanja
    const hanjaIds = await client.sMembers(`word:${id}:hanja`);
    const hanjaList = [];
    
    for (const hanjaId of hanjaIds) {
      const hanja = await client.hGetAll(`hanja:${hanjaId}`);
      if (hanja && Object.keys(hanja).length > 0) {
        hanjaList.push({ id: hanjaId, ...hanja });
      }
    }
    
    res.json({ id, ...word, hanja: hanjaList });
  } catch (error) {
    console.error('Error fetching word:', error);
    res.status(500).json({ error: 'Failed to fetch word' });
  }
});

// Search words by hanja
app.get('/api/search/words-by-hanja/:hanjaChar', async (req, res) => {
  try {
    const { hanjaChar } = req.params;
    
    // Find all words containing this hanja character
    const allWordIds = await client.zRange('words:by_frequency', 0, -1);
    const matchingWords = [];
    
    for (const wordId of allWordIds) {
      const word = await client.hGetAll(`word:${wordId}`);
      if (word.hanja_word && word.hanja_word.includes(hanjaChar)) {
        matchingWords.push({ id: wordId, ...word });
      }
    }
    
    res.json(matchingWords);
  } catch (error) {
    console.error('Error searching words:', error);
    res.status(500).json({ error: 'Failed to search words' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await client.quit();
  process.exit(0);
});
