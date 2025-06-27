// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import LineChart from './LineChart';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [studyStats, setStudyStats] = useState({});
  const [currentTime, setCurrentTime] = useState(0);

  // Load history from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sessionHistory")) || [];

    if (stored.length > 0) {
      // Calculate stats
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

      // Group by 30-minute intervals
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

    // Update live timer
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper: Get most common value
  const mode = (arr) =>
    arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();

  // Format seconds into hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="page dashboard">
      <h2>📊 Your Learning Summary</h2>

      {/* Summary Cards */}
      <div className="summary">
        <div className="card">
          <h4>Average Score</h4>
          <p>{studyStats.avgScore || "N/A"} / 10</p>
        </div>

        <div className="card">
          <h4>Total Tired/Rest Breaks</h4>
          <p>{studyStats.tiredEntries || 0}</p>
        </div>

        <div className="card">
          <h4>Time Studied</h4>
          <p>{studyStats.totalTimeMinutes ? `${studyStats.totalTimeMinutes} minutes` : "N/A"}</p>
        </div>

        <div className="card">
          <h4>Live Study Time</h4>
          <p>{formatTime(currentTime)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart">
        <h3>📈 Attentiveness Over Time</h3>
        {history.length > 0 ? (
          <LineChart data={history} />
        ) : (
          <p>No data recorded yet.</p>
        )}
      </div>

      {/* Table */}
      <div className="table-section">
        <h3>📝 Session Log (Every 30 Minutes)</h3>
        {history.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Time Interval</th>
                <th>Avg Score</th>
                <th>Dominant Emotion</th>
                <th>Dominant State</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => (
                <tr key={i}>
                  <td>{entry.interval}</td>
                  <td>{entry.avgScore}</td>
                  <td>{entry.mostCommonEmotion || "–"}</td>
                  <td>{entry.mostCommonState || "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No session logs yet.</p>
        )}
      </div>
    </div>
  );
}