import React, { useEffect, useState, useRef } from 'react';

// Components
import VideoInput from '../components/VideoInput';
import WebcamFeed from '../components/WebcamFeed';
import BreakModal from '../components/BreakModal';
import QuizModal from '../components/QuizModal';
import SleepModal from '../components/SleepModal';

export default function Session() {
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("...");
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState({
    message: "",
    resource: "",
  });
  const [breakTime, setBreakTime] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);

  useEffect(() => {
    const interval = setInterval(captureAndSendFrame, 1000);
    return () => clearInterval(interval);
  }, []);

  const captureAndSendFrame = async () => {
    if (!canvasRef.current || !document.querySelector('video')) return;

    const video = document.querySelector('video');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg');

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await res.json();

      if (data.emotion && data.score !== undefined) {
        setEmotion(data.emotion);
        setScore(data.score.toFixed(2));
        setConfidence(data.confidence || 0.6);
        setIsSleeping(data.is_sleeping || false);

        if (data.feedback?.action === "break") {
          setFeedback(data.feedback);
          setShowBreakModal(true);
        } else if (data.learning_state === "Confused") {
          setShowQuizModal(true);
        } else if (data.is_sleeping) {
          setShowSleepModal(true);
        }
      }

    } catch (err) {
      console.error("Failed to send frame:", err);
    }
  };

  const handleContinue = () => setShowBreakModal(false);
  const handleTakeAction = () => {
    setShowBreakModal(false);
    setBreakTime(true);
  };

  const handleTakeQuiz = () => {
    alert("Redirecting to quiz");
    setShowQuizModal(false);
  };

  const handleRest = () => {
    alert("Taking a break...");
    setShowSleepModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-gray-800 px-6 py-4 shadow-md">
        <h1 className="text-3xl font-extrabold">🧠 AI Learning Coach</h1>
        <form className="flex" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search topic or video..."
            className="rounded-l-md px-4 py-2 w-60 text-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-md transition"
          >
            🔍
          </button>
        </form>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden px-6 py-8 gap-8">
        {/* Left Panel - Video Input */}
        <section className="flex-1 rounded-lg overflow-hidden shadow-lg bg-gray-800">
          <VideoInput breakTime={breakTime} />
        </section>

        {/* Right Panel - Webcam and Stats */}
        <aside className="w-96 flex flex-col gap-6">
          <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800">
            <WebcamFeed
              emotion={emotion}
              score={score}
              confidence={confidence}
              isSleeping={isSleeping}
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">🎯 Focus Score</h3>
            <p className="text-indigo-400 text-4xl">{((10 / 6) * score).toFixed(2)}/10</p>
            {isSleeping && (
              <p className="mt-3 text-red-500 font-bold animate-pulse">Sleep Detected!</p>
            )}
          </div>
        </aside>
      </main>

      {/* Modals */}
      {showBreakModal && feedback.message && (
        <BreakModal
          message={feedback.message}
          onContinue={handleContinue}
          onTakeBreak={handleTakeAction}
        />
      )}
      {showQuizModal && <QuizModal onTakeQuiz={handleTakeQuiz} onSkip={() => setShowQuizModal(false)} />}
      {showSleepModal && <SleepModal onConfirm={handleRest} />}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
