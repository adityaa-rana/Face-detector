// src/pages/Session/components/SleepModal.js

import React from 'react';

export default function SleepModal({ onConfirm }) {
  return (
    <div className="modal">
      <h3>😴 Are You Sleeping?</h3>
      <p>You've had your eyes closed for too long. Want to pause the video and rest?</p>
      <button onClick={onConfirm}>Pause & Rest</button>
    </div>
  );
}