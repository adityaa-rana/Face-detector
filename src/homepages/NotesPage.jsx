import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, StickyNote, Plus, X } from 'lucide-react';

const NotesPage = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: 'Remember to call mom this weekend', createdAt: new Date(), color: 'yellow' },
    { id: 2, content: 'Book ideas:\n- Productivity system\n- Morning routines', createdAt: new Date(), color: 'blue' }
  ]);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const colors = ['yellow', 'blue', 'green', 'pink', 'purple'];

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        createdAt: new Date(),
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setNotes([note, ...notes]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Map color names to Tailwind bg colors (dark theme-friendly)
  const colorClasses = {
    yellow: 'bg-yellow-600 text-yellow-100',
    blue: 'bg-blue-700 text-blue-100',
    green: 'bg-green-700 text-green-100',
    pink: 'bg-pink-700 text-pink-100',
    purple: 'bg-purple-700 text-purple-100',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center gap-3 p-4 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-500 transition">
          <Home size={20} />
          <span className="font-semibold text-lg">Home</span>
        </Link>
      </nav>

      {/* Main Container */}
      <main className="flex-grow container mx-auto p-6">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-indigo-400">
              <StickyNote size={28} />
              <h1 className="text-2xl font-bold">Quick Notes</h1>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-md shadow-md"
            >
              <Plus size={16} />
              Add Note
            </button>
          </div>

          {/* Add Note Form */}
          {isAdding && (
            <div className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your note..."
                autoFocus
                rows={4}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-white placeholder-gray-400"
              />
              <div className="mt-2 flex justify-end gap-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {notes.map(note => (
              <div
                key={note.id}
                className={`relative p-4 rounded-lg shadow-md whitespace-pre-wrap ${colorClasses[note.color]}`}
              >
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-2 right-2 text-indigo-300 hover:text-indigo-100 transition"
                  aria-label="Delete note"
                >
                  <X size={18} />
                </button>
                <p className="mb-4">{note.content}</p>
                <div className="text-xs text-indigo-200 text-right font-mono">
                  {note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {notes.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-400">
              <StickyNote size={48} />
              <p className="mt-4 text-lg">No notes yet. Add one above!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotesPage;
