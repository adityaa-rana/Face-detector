import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const PomodoroPage = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  const [focusDuration, setFocusDuration] = useState(25); // Custom focus time
  const [breakDuration, setBreakDuration] = useState(5);  // Custom break time

  const totalSeconds = isBreak ? breakDuration * 60 : focusDuration * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  useEffect(() => {
    let interval = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      setIsActive(false);
      if (!isBreak) {
        setSessions((s) => s + 1);
        setIsBreak(true);
        setMinutes(breakDuration);
      } else {
        setIsBreak(false);
        setMinutes(focusDuration);
      }
      setSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak, breakDuration, focusDuration]);

  const toggleTimer = () => {
    if (!isActive && minutes === 0 && seconds === 0) {
      setMinutes(isBreak ? breakDuration : focusDuration);
      setSeconds(0);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isBreak ? breakDuration : focusDuration);
    setSeconds(0);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 px-6 py-4 shadow-md flex items-center space-x-2">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
        >
          <Home size={20} />
          <span className="font-medium">Home</span>
        </Link>
      </nav>

      {/* Pomodoro container */}
      <div className="flex-grow flex justify-center items-center px-4 py-12">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 text-cyan-400">
            {isBreak ? <Coffee size={28} /> : <Brain size={28} />}
            <h1 className="text-2xl font-semibold">
              {isBreak ? 'Break Time' : 'Focus Session'}
            </h1>
          </div>

          {/* Custom Time Settings */}
          <div className="flex space-x-4">
            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">Focus (min)</label>
              <input
                type="number"
                min="1"
                value={focusDuration}
                onChange={(e) => setFocusDuration(parseInt(e.target.value) || 1)}
                disabled={isActive}
                className="bg-gray-700 text-white p-2 rounded focus:outline-none"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">Break (min)</label>
              <input
                type="number"
                min="1"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 1)}
                disabled={isActive}
                className="bg-gray-700 text-white p-2 rounded focus:outline-none"
              />
            </div>
          </div>

          {/* Timer display */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-6xl font-mono tracking-widest">
              {formatTime(minutes, seconds)}
            </div>

            {/* Progress bar */}
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-4 bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-6">
            <button
              onClick={toggleTimer}
              className={`flex items-center space-x-2 px-5 py-3 rounded-md font-semibold transition
                ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center space-x-2 px-5 py-3 rounded-md bg-gray-700 hover:bg-gray-600 transition font-semibold"
            >
              <RotateCcw size={20} />
              <span>Reset</span>
            </button>
          </div>

          {/* Session count */}
          <div className="text-center text-gray-400">
            Sessions completed today:{' '}
            <span className="text-cyan-400 font-semibold">{sessions}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;

