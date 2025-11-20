import React from 'react';

function Controls({ onPrevious, onNext, onShuffle, canGoPrevious, canGoNext }) {
  return (
    <div className="controls">
      <button 
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        ← Previous
      </button>
      <button onClick={onShuffle}>
        🔀 Shuffle
      </button>
      <button 
        onClick={onNext}
        disabled={!canGoNext}
      >
        Next →
      </button>
    </div>
  );
}

export default Controls;