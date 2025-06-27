import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, Check, X } from 'lucide-react';

const TodoPage = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project proposal', completed: false, priority: 'high', category: 'Work' },
    { id: 2, text: 'Review team feedback', completed: false, priority: 'medium', category: 'Work' },
    { id: 3, text: 'Plan weekend trip', completed: true, priority: 'low', category: 'Personal' }
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newCategory, setNewCategory] = useState('General');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: newPriority,
        category: newCategory
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
      setNewPriority('medium');
      setNewCategory('General');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const priorityColors = {
    high: 'bg-red-600',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <nav className="bg-gray-800 px-6 py-4 shadow-md flex items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
        >
          <Home size={20} />
          <span className="font-medium">Home</span>
        </Link>
      </nav>

      <div className="flex-grow flex justify-center px-4 py-12">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Task Manager</h1>
            <div className="text-sm bg-cyan-600 px-3 py-1 rounded-full font-semibold">
              {todos.filter(t => !t.completed).length} pending
            </div>
          </div>

          {/* Add Todo Section */}
          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              className="w-full px-4 py-2 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <div className="flex space-x-2">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <button
                onClick={addTodo}
                className="bg-cyan-500 hover:bg-cyan-600 px-4 rounded transition flex items-center justify-center"
                aria-label="Add task"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-3 mb-6">
            {['all', 'pending', 'completed'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-1 rounded-full font-semibold text-sm transition
                  ${
                    filter === filterType
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Todo List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center space-x-3 p-3 rounded-md 
                  ${todo.completed ? 'bg-gray-700 line-through text-gray-400' : 'bg-gray-800'}`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex items-center justify-center w-7 h-7 rounded-full border-2 
                    ${todo.completed ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500 hover:border-cyan-500'}
                    transition`}
                  aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
                >
                  {todo.completed && <Check size={16} className="text-white" />}
                </button>

                <div className="flex-grow flex flex-col">
                  <p className="select-none">{todo.text}</p>
                  <div className="flex space-x-2 mt-1 text-xs">
                    <span
                      className={`text-black px-2 rounded-full font-semibold uppercase 
                      ${priorityColors[todo.priority]}`}
                    >
                      {todo.priority}
                    </span>
                    <span className="bg-gray-600 rounded-full px-2 font-medium">
                      {todo.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1 rounded hover:bg-red-700 transition"
                  aria-label={`Delete task ${todo.text}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTodos.length === 0 && (
            <div className="text-center text-gray-400 mt-8 select-none">
              <p>No tasks {filter !== 'all' ? filter : 'yet'}. Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;

