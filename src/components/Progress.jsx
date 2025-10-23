import React from 'react';

function Progress({ current, total }) {
  return (
    <div className="progress">
      <span>{current}</span> / <span>{total}</span>
    </div>
  );
}

export default Progress;