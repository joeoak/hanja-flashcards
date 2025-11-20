import React from 'react';

function FlashCard({ card, isFlipped, onFlip }) {
  return (
    <div className="card-container">
      <div 
        className={`card ${isFlipped ? 'flipped' : ''}`}
        onClick={onFlip}
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