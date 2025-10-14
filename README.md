# Korean Hanja Flash Cards

A simple, web-based flash card application to help people memorize Korean Hanja characters, with a Redis-backed database for storing and querying hanja and related words.

## Features

- 📚 **20 Essential Hanja Characters** - Learn commonly used Korean Hanja with English meanings, Korean readings, and example words
- 🔄 **Interactive Card Flipping** - Click cards to reveal meanings and readings
- ⌨️ **Keyboard Navigation** - Use arrow keys to navigate and spacebar/enter to flip cards
- 🔀 **Shuffle Mode** - Randomize card order for varied practice
- 📊 **Progress Tracking** - See your position in the deck
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations

## How to Use

### Online
Simply open `index.html` in any modern web browser.

### Local Development
1. Clone the repository
2. Open `index.html` in your browser, or
3. Serve with a local HTTP server:
   ```bash
   python3 -m http.server 8080
   # Then visit http://localhost:8080
   ```

## Controls

- **Click/Tap** - Flip card to see meaning
- **Next/Previous Buttons** - Navigate through cards
- **Shuffle Button** - Randomize card order
- **Arrow Keys** - Navigate (← previous, → next)
- **Spacebar/Enter** - Flip current card

## Hanja Characters Included

The app includes 20 fundamental Hanja characters covering:
- Basic concepts (person, big, small, middle)
- Geography (country, mountain, water)
- Time (day, month, year, time)
- Nature elements (fire, wood, gold, earth)
- Abstract concepts (heart, love, friend)
- Education (learning, life)

Each card includes:
- The Hanja character
- English meaning
- Korean reading (Hangul)
- Example word with translation

## Redis Database Backend

The application now includes a Redis database backend that stores:
- **20 commonly used hanja characters** with meanings, readings, and categories
- **25 commonly used Korean words** containing hanja
- **Bidirectional relationships** linking hanja characters to words

### Quick Start with Docker

1. Start the Redis database and backend API:
   ```bash
   docker-compose up -d
   ```

2. Populate the database:
   ```bash
   docker-compose exec backend npm run populate
   ```

3. Access the API at `http://localhost:3000`

### API Endpoints

- `GET /api/hanja` - Get all hanja characters
- `GET /api/hanja/:id` - Get specific hanja with associated words
- `GET /api/words` - Get all words
- `GET /api/words/:id` - Get specific word with hanja components
- `GET /api/search/words-by-hanja/:char` - Search words by hanja character

### Database Documentation

For detailed information about the Redis database schema, setup, and usage, see [REDIS_DATABASE.md](REDIS_DATABASE.md).