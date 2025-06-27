import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';

const StatsPage = () => {
  const [todayFocus, setTodayFocus] = useState(120);
  const [weeklyGoal, setWeeklyGoal] = useState(600);
  const [tasksCompleted, setTasksCompleted] = useState(8);
  const [habitsStreak, setHabitsStreak] = useState(5);
  const [weeklyTasks, setWeeklyTasks] = useState([12, 8, 15, 10, 8, 6, 0]);

  const focusProgress = (todayFocus / (weeklyGoal / 7)) * 100;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const updateWeeklyTask = (index, value) => {
    const updated = [...weeklyTasks];
    updated[index] = parseInt(value) || 0;
    setWeeklyTasks(updated);
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

      {/* Main Container */}
      <div className="flex-grow flex justify-center px-4 py-12">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl w-full space-y-10">
          {/* Header */}
          <div className="flex items-center space-x-3 text-cyan-400">
            <BarChart3 size={28} />
            <h1 className="text-3xl font-semibold">Productivity Analytics</h1>
          </div>

          {/* Input Section */}
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block mb-1">Today's Focus (min)</label>
              <input
                type="number"
                value={todayFocus}
                onChange={(e) => setTodayFocus(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Weekly Focus Goal (min)</label>
              <input
                type="number"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Tasks Completed</label>
              <input
                type="number"
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Habit Streak (days)</label>
              <input
                type="number"
                value={habitsStreak}
                onChange={(e) => setHabitsStreak(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard
              icon={<Zap size={24} />}
              title="Focus Time"
              value={`${todayFocus} min`}
              progress={focusProgress}
              color="orange"
              subtitle={`Goal: ${Math.round(weeklyGoal / 7)} min/day`}
            />
            <StatCard
              icon={<Calendar size={24} />}
              title="Tasks Completed"
              value={tasksCompleted}
              progress={Math.min((tasksCompleted / 10) * 100, 100)}
              color="blue"
              subtitle="Keep it up!"
            />
            <StatCard
              icon={<TrendingUp size={24} />}
              title="Habit Streak"
              value={`${habitsStreak} days`}
              progress={Math.min(habitsStreak * 10, 100)}
              color="purple"
              subtitle="Consistency is key!"
            />
          </div>

          {/* Weekly Tasks Bar Chart */}
          <div>
            <h3 className="text-xl font-semibold mb-4">This Week's Tasks</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-end space-x-2 h-32">
                {weeklyTasks.map((tasks, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-1 w-full">
                    <input
                      type="number"
                      className="w-full text-center text-sm bg-gray-800 text-white rounded"
                      value={tasks}
                      onChange={(e) => updateWeeklyTask(idx, e.target.value)}
                    />
                    <div
                      className="bg-cyan-500 w-full rounded-t-md transition-all duration-500"
                      style={{ height: `${Math.max((tasks / 15) * 100, 5)}%` }}
                      title={`${tasks} tasks`}
                    />
                    <span className="text-gray-300 font-semibold">{days[idx]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Insights */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Weekly Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Most Productive Day</h4>
                <p>
                  {days[weeklyTasks.indexOf(Math.max(...weeklyTasks))]} with{' '}
                  {Math.max(...weeklyTasks)} tasks
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Avg Focus</h4>
                <p>{(weeklyGoal / 7 / 60).toFixed(1)} hrs/day</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Tasks Total</h4>
                <p>{weeklyTasks.reduce((a, b) => a + b, 0)} this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card component
const StatCard = ({ icon, title, value, progress, color, subtitle }) => {
  const colorClass = {
    orange: 'bg-orange-500 text-orange-400',
    blue: 'bg-blue-500 text-blue-400',
    purple: 'bg-purple-500 text-purple-400',
  }[color];

  return (
    <div className="bg-gray-700 rounded-lg p-6 flex flex-col space-y-3">
      <div className={`flex items-center space-x-3 ${colorClass.replace('bg-', 'text-')}`}>
        {icon}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-4xl font-bold">{value}</p>
      <div className="w-full h-3 bg-gray-600 rounded-full overflow-hidden">
        <div
          className={`h-3 ${colorClass} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
};

export default StatsPage;
