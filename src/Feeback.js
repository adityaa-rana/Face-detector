// Feedback.js

import React from 'react';

function Feedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="suggestion-box">
      <h3>Suggestion:</h3>
      <p>{feedback.message}</p>
      <button onClick={() => alert(`Redirecting to: ${feedback.resource}`)}>
        Take Action
      </button>
    </div>
  );
}

export default Feedback;