// src/pages/Session/components/QuizModal.js

import React from 'react';

export default function QuizModal({ onTakeQuiz, onSkip }) {
  return (
    <div className="modal">
      <h3>🧪 Feeling Confused?</h3>
      <p>Want to take a quick quiz to reinforce what you learned?</p>
      <div className="modal-buttons">
        <button onClick={onSkip}>No thanks</button>
        <button onClick={onTakeQuiz}>Yes, Take Quiz</button>
      </div>
    </div>
  );
}