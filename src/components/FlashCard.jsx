import React from 'react';

function FlashCard({ card, isFlipped, onFlip }) {
  return (
    <div className="card-container">
      <div 
        className={`card ${isFlipped ? 'flipped' : ''}`}
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Flash card, showing meaning. Press to show hanja." : "Flash card, showing hanja. Press to reveal meaning."}
      >
        <div className="card-face card-front">
          <div className="hanja">{card.hanja}</div>
          <div className="hint">Click to reveal meaning</div>
        </div>
        <div className="card-face card-back">
          <div className="meaning">{card.meaning}</div>
          <div className="reading">{card.reading}</div>
          <div className="example">{card.example}</div>
        </div>
      </div>
    </div>
  );
}

export default FlashCard;