import React, { useState, useEffect } from 'react';
import { hanjaCards } from './data/hanjaCards.js';
import FlashCard from './components/FlashCard.jsx';
import Controls from './components/Controls.jsx';
import Progress from './components/Progress.jsx';
import './style.css';

function App() {
  const [cards, setCards] = useState([...hanjaCards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards];
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        previousCard();
      } else if (e.key === 'ArrowRight') {
        nextCard();
      } else if ((e.key === ' ' || e.key === 'Enter') && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        flipCard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  return (
    <div className="container">
      <h1>🇰🇷 Korean Hanja Flash Cards</h1>
      
      <Progress 
        current={currentIndex + 1} 
        total={cards.length} 
      />

      <FlashCard 
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={flipCard}
      />

      <Controls
        onPrevious={previousCard}
        onNext={nextCard}
        onShuffle={shuffleCards}
        canGoPrevious={currentIndex > 0}
        canGoNext={currentIndex < cards.length - 1}
      />

      <div className="flip-hint">💡 Click the card to flip between front and back</div>
    </div>
  );
}

export default App;