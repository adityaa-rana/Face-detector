import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-12">
      {/* Hero Section */}
      <section className="max-w-4xl text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4">🧠 AI Learning Coach</h1>
        <p className="text-lg text-gray-300 mb-8">
          Track your emotions via webcam and get personalized suggestions for better learning.
        </p>
        <Link to="/session">
          <button className="bg-indigo-600 hover:bg-indigo-700 transition rounded-lg px-8 py-3 font-semibold shadow-lg">
            Start Learning Session
          </button>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <Link
          to="/pomodoro"
          className="bg-gray-800 hover:bg-indigo-700 transition rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
        >
          <div className="text-5xl mb-4">🍅</div>
          <h3 className="text-xl font-semibold mb-2">Pomodoro Timer</h3>
          <p className="text-gray-300">Stay focused with scientifically proven time blocks.</p>
        </Link>

        <Link
          to="/todos"
          className="bg-gray-800 hover:bg-indigo-700 transition rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
        >
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-semibold mb-2">Todo List</h3>
          <p className="text-gray-300">Organize your tasks and track progress efficiently.</p>
        </Link>

        <Link
          to="/habits"
          className="bg-gray-800 hover:bg-indigo-700 transition rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
        >
          <div className="text-5xl mb-4">📈</div>
          <h3 className="text-xl font-semibold mb-2">Habit Tracker</h3>
          <p className="text-gray-300">Build consistency with daily habit tracking.</p>
        </Link>

        <Link
          to="/notes"
          className="bg-gray-800 hover:bg-indigo-700 transition rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
        >
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Notes</h3>
          <p className="text-gray-300">Take and organize notes as you study.</p>
        </Link>

        <Link
          to="/stats"
          className="bg-gray-800 hover:bg-indigo-700 transition rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
        >
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Stats</h3>
          <p className="text-gray-300">See how your focus and emotions evolve over time.</p>
        </Link>
      </section>
    </div>
  );
}
