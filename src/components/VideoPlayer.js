// src/pages/Session/components/VideoPlayer.js

import React from 'react';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ videoUrl }) {
  return (
    <div className="video-wrapper">
      <ReactPlayer
        url={videoUrl}
        width="700px"
        height="700px"
        controls
        playing
        className="react-player"
      />
    </div>
  );
}