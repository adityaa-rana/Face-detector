// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Session from './pages/Session';
import Dashboard from './pages/Dashboard';
import PomodoroPage from './homepages/PomodoroPage';
import TodoPage from './homepages/TodoPage';
import HabitsPage from './homepages/HabitsPage';
import NotesPage from './homepages/NotesPage';
import StatsPage from './homepages/StatsPage';

function App() {
  return (
    <div className="min-h-screen bg-darkBg text-white font-sans">
      {/* Navbar */}
      <nav className="bg-[#1e293b] px-6 py-4 shadow-md flex items-center justify-between">
        <div className="text-xl font-bold text-accent">LearnX</div>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/session"
            className="text-gray-300 hover:text-white transition duration-200"
          >
            Session
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-white transition duration-200"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session" element={<Session />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/todos" element={<TodoPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
