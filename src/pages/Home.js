// src/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page home">
      <h1>🧠 AI Learning Coach</h1>
      <p>
        This tool detects your emotional state using the webcam and offers personalized suggestions.
      </p>
      <Link to="/session">
        <button>Start Learning Session</button>
      </Link>
    </div>
  );
}