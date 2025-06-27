import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Target, Plus, Flame } from 'lucide-react';

const HabitsPage = () => {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: 'Read 30 min',
      streak: 5,
      target: 7,
      completed: [true, true, false, true, true, true, false],
      icon: '📚',
    },
    {
      id: 2,
      name: 'Exercise',
      streak: 3,
      target: 5,
      completed: [true, false, true, true, false, true, false],
      icon: '💪',
    },
    {
      id: 3,
      name: 'Meditate',
      streak: 7,
      target: 7,
      completed: [true, true, true, true, true, true, true],
      icon: '🧘',
    },
  ]);

  const [newHabitName, setNewHabitName] = useState('');

  const toggleHabitToday = (id) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const newCompleted = [...habit.completed];
          const today = 6; // Sunday
          newCompleted[today] = !newCompleted[today];

          let newStreak = 0;
          for (let i = newCompleted.length - 1; i >= 0; i--) {
            if (newCompleted[i]) {
              newStreak++;
            } else {
              break;
            }
          }

          return { ...habit, completed: newCompleted, streak: newStreak };
        }
        return habit;
      })
    );
  };

  const getDayLabels = () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit = {
      id: habits.length + 1,
      name: newHabitName,
      streak: 0,
      target: 7,
      completed: [false, false, false, false, false, false, false],
      icon: '✨',
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      {/* Navbar */}
      <nav className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-lg">
            <Target size={24} />
            <h1>Daily Habits</h1>
          </div>
        </div>

        {/* Input to add habit */}
        <div className="flex items-center mb-6 space-x-2">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Enter new habit name..."
            className="flex-grow px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={addHabit}
            className="flex items-center space-x-1 bg-cyan-500 text-black px-3 py-2 rounded hover:bg-cyan-600 transition"
          >
            <Plus size={16} />
            <span>Add Habit</span>
          </button>
        </div>

        {/* Habits List */}
        <div className="space-y-6">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-gray-700 rounded p-4 shadow-md flex flex-col space-y-4"
            >
              {/* Habit info */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-lg">
                  <span className="text-2xl">{habit.icon}</span>
                  <span>{habit.name}</span>
                </div>
                <div className="flex items-center space-x-1 text-cyan-400 font-semibold">
                  <Flame size={16} />
                  <span>{habit.streak}</span>
                </div>
              </div>

              {/* Habit tracker */}
              <div className="grid grid-cols-7 gap-2 text-center">
                {getDayLabels().map((day, index) => (
                  <div key={day} className="flex flex-col items-center space-y-1">
                    <div className="text-xs font-medium">{day}</div>
                    <button
                      onClick={() => index === 6 && toggleHabitToday(habit.id)}
                      className={`w-7 h-7 rounded-full border-2 border-gray-600 transition
                        ${
                          habit.completed[index]
                            ? 'bg-cyan-500 border-cyan-500'
                            : 'bg-transparent'
                        }
                        ${index === 6 ? 'ring-2 ring-cyan-500' : ''}
                      `}
                      aria-label={`${day} ${habit.name} completion`}
                      title={`${day} completion`}
                    ></button>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>Weekly Progress</span>
                  <span>
                    {habit.completed.filter(Boolean).length}/{habit.target}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-600 rounded overflow-hidden">
                  <div
                    className="h-2 bg-cyan-500 rounded"
                    style={{
                      width: `${
                        (habit.completed.filter(Boolean).length / habit.target) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;


