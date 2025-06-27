import React, { useEffect, useState } from 'react';
import LineChart from './LineChart';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [studyStats, setStudyStats] = useState({});
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sessionHistory")) || [];

    if (stored.length > 0) {
      const totalScore = stored.reduce((sum, entry) => sum + parseFloat(entry.score), 0);
      const avgScore = (totalScore / stored.length).toFixed(2);

      const tiredEntries = stored.filter(e => e.state === "Tired" || e.state === "Frustrated").length;
      const confusedEntries = stored.filter(e => e.state === "Confused").length;

      const firstEntryTime = new Date(stored[0].timestamp).getTime();
      const lastEntryTime = new Date(stored[stored.length - 1].timestamp).getTime();
      const totalTimeMinutes = ((lastEntryTime - firstEntryTime) / 60000).toFixed(0);

      setStudyStats({
        avgScore,
        tiredEntries,
        confusedEntries,
        totalTimeMinutes
      });

      const grouped = {};
      stored.forEach(entry => {
        const timestamp = new Date(entry.timestamp).getTime();
        const key = Math.floor(timestamp / (30 * 60 * 1000)) * (30 * 60 * 1000);
        const intervalStart = new Date(key).toLocaleTimeString();

        if (!grouped[key]) {
          grouped[key] = {
            interval: `${intervalStart} – ${new Date(key + 30 * 60 * 1000).toLocaleTimeString()}`,
            entries: []
          };
        }
        grouped[key].entries.push(entry);
      });

      const tableData = Object.values(grouped).map(group => {
        const scores = group.entries.map(e => parseFloat(e.score));
        const emotions = group.entries.map(e => e.emotion);
        const states = group.entries.map(e => e.state);

        return {
          interval: group.interval,
          avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
          mostCommonEmotion: mode(emotions),
          mostCommonState: mode(states)
        };
      });

      setHistory(tableData);
    }

    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mode = (arr) =>
    arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-10 text-center">📊 Your Learning Summary</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h4 className="text-lg font-semibold mb-2">Average Score</h4>
          <p className="text-indigo-400 text-3xl">{studyStats.avgScore || "N/A"} / 10</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h4 className="text-lg font-semibold mb-2">Total Tired/Rest Breaks</h4>
          <p className="text-indigo-400 text-3xl">{studyStats.tiredEntries || 0}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h4 className="text-lg font-semibold mb-2">Time Studied</h4>
          <p className="text-indigo-400 text-3xl">
            {studyStats.totalTimeMinutes ? `${studyStats.totalTimeMinutes} minutes` : "N/A"}
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h4 className="text-lg font-semibold mb-2">Live Study Time</h4>
          <p className="text-indigo-400 text-3xl">{formatTime(currentTime)}</p>
        </div>
      </div>

      {/* Chart */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-6">📈 Attentiveness Over Time</h3>
        {history.length > 0 ? (
          <LineChart data={history} />
        ) : (
          <p className="text-gray-400 text-center">No data recorded yet.</p>
        )}
      </section>

      {/* Table Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-6">📝 Session Log (Every 30 Minutes)</h3>
        {history.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
            <table className="min-w-full divide-y divide-gray-700 text-gray-300">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Time Interval</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Avg Score</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Dominant Emotion</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Dominant State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {history.map((entry, i) => (
                  <tr key={i} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-3">{entry.interval}</td>
                    <td className="px-6 py-3">{entry.avgScore}</td>
                    <td className="px-6 py-3">{entry.mostCommonEmotion || "–"}</td>
                    <td className="px-6 py-3">{entry.mostCommonState || "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center">No session logs yet.</p>
        )}
      </section>
    </div>
  );
}
