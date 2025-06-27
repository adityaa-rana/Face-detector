// src/components/VideoInput.js

import React, { useState } from 'react';
import ReactPlayer from 'react-player';

export default function VideoInput({ breakTime }) {
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); // Rickroll demo
  const [submittedUrl, setSubmittedUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      setSubmittedUrl(videoUrl);
    }
  };

  return (
    <div className="floating-video">
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button type="submit">▶️ Load</button>
      </form>

      {/* Show video player */}
      <ReactPlayer
        url={submittedUrl || videoUrl}
        width="100%"
        height="500px"
        controls
        playing={!breakTime}
        className="react-player"
      />
    </div>
  );
}