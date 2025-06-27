// src/pages/Session/components/WebcamFeed.js

import React, { useEffect, useRef, useState } from 'react';

export default function WebcamFeed({ emotion, score, confidence, isSleeping }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // For frame capture
  const [lastFrameData, setLastFrameData] = useState(null);

  // Start webcam
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      })
      .catch(err => {
        console.error("Camera access denied:", err);
      });
  }, []);

  // Capture frames every second and send to Flask
  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL('image/jpeg');
      sendFrameToBackend(base64Image);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendFrameToBackend = async (base64Image) => {
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();
      if (data.emotion && data.score !== undefined) {
        setLastFrameData(data);
      }

    } catch (err) {
      console.error("Failed to send frame:", err);
    }
  };

  const current = lastFrameData || { emotion, score, confidence, isSleeping };

  return (
    <div className="webcam-preview">
      <h3>📹 Your Face</h3>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: 'auto' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="overlay">
        <p><strong>Emotion:</strong> {current.emotion}</p>
        <p><strong>Score:</strong> {parseFloat(current.score).toFixed(2)} / 10</p>
        <p><strong>Confidence:</strong> {parseFloat(current.confidence).toFixed(2)}</p>
        {current.is_sleeping && <p style={{ color: 'red' }}><strong>Sleep Detected!</strong></p>}
      </div>
    </div>
  );
}