// src/pages/Session/components/BreakModal.js

import React from 'react';

export default function BreakModal({ message, onContinue, onTakeBreak }) {
  return (
    <div className="modal">
      <h3>🧠 Suggestion</h3>
      <p>{message}</p>
      <div className="modal-buttons">
        <button onClick={onContinue}>Continue Watching</button>
        <button onClick={onTakeBreak}>Take Action</button>
      </div>
    </div>
  );
}