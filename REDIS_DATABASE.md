# Redis Database Documentation

This document describes the Redis database schema for storing Korean Hanja characters and related words.

## Overview

The database contains two main entity types:
1. **Hanja** - Individual Chinese characters used in Korean
2. **Words** - Korean words that contain Hanja characters

The database also maintains bidirectional relationships between hanja and words, allowing queries like:
- "Which words contain this hanja character?"
- "Which hanja characters are used in this word?"

## Data Schema

### Hanja Characters

Each hanja character is stored as a Redis hash with the following structure:

**Key Pattern:** `hanja:{id}`

**Fields:**
- `character` - The hanja character (e.g., "人")
- `meaning` - English meaning (e.g., "Person")
- `reading_korean` - Korean reading in Hangul (e.g., "인")
- `reading_romanized` - Romanized reading (e.g., "in")
- `category` - Category like "people", "nature", "time", etc.

**Frequency Index:**
- **Key:** `hanja:by_frequency`
- **Type:** Sorted Set
- **Score:** Frequency rank (lower = more common)
- **Members:** Hanja IDs

**Example:**
```
hanja:person {
  character: "人",
  meaning: "Person",
  reading_korean: "인",
  reading_romanized: "in",
  category: "people"
}
```

### Words

Each word is stored as a Redis hash:

**Key Pattern:** `word:{id}`

**Fields:**
- `hanja_word` - Word written in hanja (e.g., "人間")
- `hangul` - Word in Hangul (e.g., "인간")
- `romanized` - Romanized pronunciation (e.g., "in-gan")
- `meaning` - English meaning (e.g., "human being")
- `category` - Category of the word

**Frequency Index:**
- **Key:** `words:by_frequency`
- **Type:** Sorted Set
- **Score:** Frequency rank
- **Members:** Word IDs

**Example:**
```
word:human_being {
  hanja_word: "人間",
  hangul: "인간",
  romanized: "in-gan",
  meaning: "human being",
  category: "people"
}
```

### Relationships

Bidirectional relationships are maintained using Redis sets:

**Hanja → Words:**
- **Key Pattern:** `hanja:{hanja_id}:words`
- **Type:** Set
- **Members:** Word IDs that contain this hanja

**Words → Hanja:**
- **Key Pattern:** `word:{word_id}:hanja`
- **Type:** Set
- **Members:** Hanja IDs used in this word

## Setup Instructions

### Prerequisites
- Docker and Docker Compose (recommended)
- OR Redis installed locally
- Node.js 18+

### Option 1: Using Docker Compose (Recommended)

1. Start Redis and the backend service:
```bash
docker-compose up -d
```

2. Populate the database:
```bash
docker-compose exec backend npm run populate
```

3. Verify the setup:
```bash
curl http://localhost:3000/health
```

### Option 2: Local Development

1. Install dependencies:
```bash
npm install
```

2. Start Redis locally:
```bash
redis-server
```

3. Populate the database:
```bash
npm run populate
```

4. Start the API server:
```bash
npm start
```

## API Endpoints

The backend provides the following REST API endpoints:

### Health Check
```
GET /health
```
Returns server and Redis connection status.

### Get All Hanja
```
GET /api/hanja
```
Returns all hanja characters ordered by frequency.

### Get Specific Hanja
```
GET /api/hanja/:id
```
Returns a specific hanja with all associated words.

**Example:**
```bash
curl http://localhost:3000/api/hanja/person
```

### Get All Words
```
GET /api/words
```
Returns all words ordered by frequency.

### Get Specific Word
```
GET /api/words/:id
```
Returns a specific word with all associated hanja characters.

**Example:**
```bash
curl http://localhost:3000/api/words/human_being
```

### Search Words by Hanja Character
```
GET /api/search/words-by-hanja/:hanjaChar
```
Finds all words containing a specific hanja character.

**Example:**
```bash
curl http://localhost:3000/api/search/words-by-hanja/人
```

## Database Statistics

After running the populate script, the database contains:
- **20 commonly used hanja characters**
- **25 commonly used Korean words**
- **40+ relationships** linking hanja to words

## Data Sources

The hanja and word data is based on:
- Most frequently used hanja in modern Korean
- Common vocabulary from Korean language education
- Examples from the original flashcard application

## Query Examples

### Using Redis CLI

Get all hanja ordered by frequency:
```redis
ZRANGE hanja:by_frequency 0 -1
```

Get a specific hanja:
```redis
HGETALL hanja:person
```

Get all words containing the "人" hanja:
```redis
SMEMBERS hanja:person:words
```

Get hanja used in a word:
```redis
SMEMBERS word:human_being:hanja
```

### Using the API

Get all hanja with their associated words:
```bash
curl http://localhost:3000/api/hanja | jq
```

Get the top 5 most common words:
```bash
curl http://localhost:3000/api/words | jq '.[0:5]'
```

## Architecture Notes

- **Data Model:** The schema uses a combination of hashes (for entity data), sorted sets (for frequency rankings), and sets (for relationships).
- **Scalability:** The current design supports efficient lookups and range queries based on frequency.
- **Extensibility:** New hanja characters and words can be added by updating the data files and re-running the populate script.

## Maintenance

### Clearing the Database
```bash
docker-compose exec backend node -e "const {client} = require('./redis-client'); client.connect().then(() => client.flushDb()).then(() => client.quit())"
```

### Repopulating Data
```bash
npm run populate
```

### Backing Up Data
```bash
docker-compose exec redis redis-cli SAVE
docker cp hanja-redis:/data/dump.rdb ./backup-dump.rdb
```

## Future Enhancements

Potential improvements to the database schema:
1. Add stroke count and radical information for hanja
2. Include audio pronunciation files
3. Add difficulty ratings for words
4. Support user learning progress tracking
5. Add more comprehensive word definitions
6. Include example sentences
