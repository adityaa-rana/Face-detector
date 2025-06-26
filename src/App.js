// App.js

import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Feedback from './Feeback';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("...");
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState("Connecting...");

  // Start webcam stream
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        setStatus("Streaming...");
        startFrameCapture();
      })
      .catch(err => {
        console.error("Camera access denied:", err);
        setStatus("Error: Camera access denied");
      });
  }, []);

  // Capture and send frame every second
  const startFrameCapture = () => {
    setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL('image/jpeg');
      sendFrameToBackend(base64Image);
    }, 1000); // Send frame every 1 second
  };

  // Send image to Flask backend
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

      if (data.emotion && data.score) {
        setEmotion(data.emotion);
        setScore(data.score.toFixed(2));
        setFeedback(data.feedback);
      }
    } catch (err) {
      console.error("Failed to send frame:", err);
    }
  };

  return (
    <div className="container">
      <h1>🧠 Real-Time Emotion Detection</h1>
      <video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="results">
        <div className="emotion">Detected Emotion: <span>{emotion}</span></div>
        <div className="score">Attentiveness Score: <span>{score}</span></div>
        <div className="status">{status}</div>
      </div>

      {feedback && <Feedback feedback={feedback} />}
    </div>
  );
}

export default App;