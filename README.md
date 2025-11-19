# Korean Hanja Flash Cards

A simple, web-based flash card application to help people memorize Korean Hanja characters.

## Features

- 📚 **20 Essential Hanja Characters** - Learn commonly used Korean Hanja with English meanings, Korean readings, and example words
- 🔄 **Interactive Card Flipping** - Click cards to reveal meanings and readings
- ⌨️ **Keyboard Navigation** - Use arrow keys to navigate and spacebar/enter to flip cards
- 🔀 **Shuffle Mode** - Randomize card order for varied practice
- 📊 **Progress Tracking** - See your position in the deck
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations

# Korean Hanja Flash Cards

A modern, web-based flash card application built with Vite to help people memorize Korean Hanja characters.

## Features

- 📚 **20 Essential Hanja Characters** - Learn commonly used Korean Hanja with English meanings, Korean readings, and example words
- 🔄 **Interactive Card Flipping** - Click cards to reveal meanings and readings
- ⌨️ **Keyboard Navigation** - Use arrow keys to navigate and spacebar/enter to flip cards
- 🔀 **Shuffle Mode** - Randomize card order for varied practice
- 📊 **Progress Tracking** - See your position in the deck
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- ⚡ **Built with Vite** - Fast development and optimized production builds

## Development

This project is built with [Vite](https://vitejs.dev/) for modern web development.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd hanja-flashcards
   ```

2. Install dependencies
   ```bash
   npm install
   ```

### Development Server

Start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically on `http://localhost:3000`.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
hanja-flashcards/
├── public/           # Static assets
├── src/
│   ├── data/         # Hanja cards data
│   ├── main.jsx      # Application entry point
│   └── style.css     # Styles
├── index.html        # HTML entry point
├── package.json      # Dependencies and scripts
└── vite.config.js    # Vite configuration
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