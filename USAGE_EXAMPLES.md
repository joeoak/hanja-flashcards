# Usage Examples

This document provides practical examples of how to use the Redis database and API.

## Starting the Application

### Using Docker Compose

```bash
# Start Redis and backend
docker compose up -d

# Wait a few seconds for services to start
sleep 5

# Populate the database
docker compose exec backend npm run populate

# Check health
curl http://localhost:3000/health
```

### Local Development

```bash
# Start Redis (in a separate terminal)
redis-server

# Install dependencies
npm install

# Populate the database
REDIS_HOST=localhost REDIS_PORT=6379 npm run populate

# Start the API server
REDIS_HOST=localhost REDIS_PORT=6379 npm start
```

## API Usage Examples

### 1. Check Server Health

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "redis": "connected"
}
```

### 2. Get All Hanja Characters

```bash
curl http://localhost:3000/api/hanja | jq '.[0:3]'
```

**Response:**
```json
[
  {
    "id": "person",
    "character": "人",
    "meaning": "Person",
    "reading_korean": "인",
    "reading_romanized": "in",
    "category": "people"
  },
  {
    "id": "big",
    "character": "大",
    "meaning": "Big",
    "reading_korean": "대",
    "reading_romanized": "dae",
    "category": "size"
  },
  {
    "id": "small",
    "character": "小",
    "meaning": "Small",
    "reading_korean": "소",
    "reading_romanized": "so",
    "category": "size"
  }
]
```

### 3. Get Specific Hanja with Associated Words

```bash
curl http://localhost:3000/api/hanja/person | jq
```

**Response:**
```json
{
  "id": "person",
  "character": "人",
  "meaning": "Person",
  "reading_korean": "인",
  "reading_romanized": "in",
  "category": "people",
  "words": [
    {
      "id": "human_being",
      "hanja_word": "人間",
      "hangul": "인간",
      "romanized": "in-gan",
      "meaning": "human being",
      "category": "people"
    },
    {
      "id": "people",
      "hanja_word": "人民",
      "hangul": "인민",
      "romanized": "in-min",
      "meaning": "people",
      "category": "people"
    },
    {
      "id": "adult",
      "hanja_word": "大人",
      "hangul": "대인",
      "romanized": "dae-in",
      "meaning": "adult",
      "category": "people"
    }
  ]
}
```

### 4. Get All Words

```bash
curl http://localhost:3000/api/words | jq '.[0:3]'
```

**Response:**
```json
[
  {
    "id": "human_being",
    "hanja_word": "人間",
    "hangul": "인간",
    "romanized": "in-gan",
    "meaning": "human being",
    "category": "people"
  },
  {
    "id": "university",
    "hanja_word": "大學",
    "hangul": "대학",
    "romanized": "dae-hak",
    "meaning": "university",
    "category": "education"
  },
  {
    "id": "novel",
    "hanja_word": "小說",
    "hangul": "소설",
    "romanized": "so-seol",
    "meaning": "novel",
    "category": "literature"
  }
]
```

### 5. Get Specific Word with Hanja Components

```bash
curl http://localhost:3000/api/words/student | jq
```

**Response:**
```json
{
  "id": "student",
  "hanja_word": "學生",
  "hangul": "학생",
  "romanized": "hak-saeng",
  "meaning": "student",
  "category": "education",
  "hanja": [
    {
      "id": "learning",
      "character": "學",
      "meaning": "Learning",
      "reading_korean": "학",
      "reading_romanized": "hak",
      "category": "education"
    },
    {
      "id": "life",
      "character": "生",
      "meaning": "Life/Birth",
      "reading_korean": "생",
      "reading_romanized": "saeng",
      "category": "life"
    }
  ]
}
```

### 6. Search Words by Hanja Character

```bash
# Search for all words containing the hanja "人" (person)
curl 'http://localhost:3000/api/search/words-by-hanja/人' | jq
```

**Response:**
```json
[
  {
    "id": "human_being",
    "hanja_word": "人間",
    "hangul": "인간",
    "romanized": "in-gan",
    "meaning": "human being",
    "category": "people"
  },
  {
    "id": "people",
    "hanja_word": "人民",
    "hangul": "인민",
    "romanized": "in-min",
    "meaning": "people",
    "category": "people"
  },
  {
    "id": "adult",
    "hanja_word": "大人",
    "hangul": "대인",
    "romanized": "dae-in",
    "meaning": "adult",
    "category": "people"
  }
]
```

## Redis CLI Usage

You can also query the database directly using Redis CLI:

### Connect to Redis

```bash
# If using Docker
docker compose exec redis redis-cli

# If using local Redis
redis-cli
```

### Query Examples

```redis
# Get all hanja IDs (sorted by frequency)
ZRANGE hanja:by_frequency 0 -1

# Get a specific hanja
HGETALL hanja:person

# Get words associated with a hanja
SMEMBERS hanja:person:words

# Get a specific word
HGETALL word:human_being

# Get hanja used in a word
SMEMBERS word:human_being:hanja

# Count total hanja
ZCARD hanja:by_frequency

# Count total words
ZCARD words:by_frequency

# Get top 5 most common hanja
ZRANGE hanja:by_frequency 0 4

# Get all keys (for debugging)
KEYS *
```

## Integration Example (JavaScript)

Here's how to integrate the API into a frontend application:

```javascript
// Fetch all hanja
async function getAllHanja() {
  const response = await fetch('http://localhost:3000/api/hanja');
  const hanja = await response.json();
  return hanja;
}

// Get specific hanja with associated words
async function getHanjaDetails(id) {
  const response = await fetch(`http://localhost:3000/api/hanja/${id}`);
  const details = await response.json();
  return details;
}

// Search for words containing a specific hanja character
async function searchWordsByHanja(character) {
  const encodedChar = encodeURIComponent(character);
  const response = await fetch(`http://localhost:3000/api/search/words-by-hanja/${encodedChar}`);
  const words = await response.json();
  return words;
}

// Example usage
getAllHanja().then(hanja => {
  console.log(`Found ${hanja.length} hanja characters`);
  console.log('First hanja:', hanja[0]);
});

getHanjaDetails('person').then(details => {
  console.log(`Character: ${details.character}`);
  console.log(`Associated words: ${details.words.length}`);
  details.words.forEach(word => {
    console.log(`  - ${word.hanja_word} (${word.meaning})`);
  });
});

searchWordsByHanja('人').then(words => {
  console.log(`Words containing 人: ${words.length}`);
});
```

## Testing the API

Run the automated test script:

```bash
# Set the API host and port if different from defaults
export API_HOST=localhost
export API_PORT=3000

# Run tests
node scripts/test-api.js
```

Expected output:
```
=== Redis Database API Tests ===

1. Testing health endpoint...
   Status: ok
   Redis: connected
   ✓ Health check passed

2. Testing get all hanja...
   Retrieved 20 hanja characters
   First hanja: 人 (Person)
   ✓ Get all hanja passed

3. Testing get specific hanja...
   Character: 人
   Meaning: Person
   Associated words: 3
   Example word: 人間 (human being)
   ✓ Get specific hanja passed

4. Testing get all words...
   Retrieved 25 words
   First word: 人間 (human being)
   ✓ Get all words passed

5. Testing get specific word...
   Hanja: 人間
   Hangul: 인간
   Meaning: human being
   Uses 1 hanja characters
   ✓ Get specific word passed

6. Testing search by hanja character...
   Found 3 words containing '人'
   Examples:
     - 人間 (인간) - human being
     - 人民 (인민) - people
     - 大人 (대인) - adult
   ✓ Search passed

=== All tests passed! ===
```

## Common Issues and Solutions

### Issue: Cannot connect to Redis

**Solution 1: Check Redis is running**
```bash
# For Docker
docker compose ps

# For local Redis
redis-cli ping
```

**Solution 2: Check environment variables**
```bash
# Make sure REDIS_HOST and REDIS_PORT are set correctly
echo $REDIS_HOST
echo $REDIS_PORT
```

### Issue: Empty database

**Solution: Run the populate script**
```bash
npm run populate
```

### Issue: Port 3000 already in use

**Solution: Use a different port**
```bash
PORT=3001 npm start
```

## Next Steps

- Integrate the API with the frontend flashcard application
- Add more hanja and words to the database
- Implement user progress tracking
- Add difficulty ratings
- Create study recommendations based on frequency
