
import React from 'react';

function LineChart({ data }) {
  return (
    <div className="flex items-end space-x-3 h-48 bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
      {data.map((point, i) => {
        // Determine bar color based on avgScore
        let barColor = 'bg-red-500';
        if (point.avgScore >= 8) barColor = 'bg-green-500';
        else if (point.avgScore >= 6) barColor = 'bg-yellow-400';
        else if (point.avgScore >= 4) barColor = 'bg-orange-400';

        // Calculate height
        const height = Math.max(10, point.avgScore * 5);

        return (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`${barColor} w-5 rounded-t-md transition-all duration-300 shadow-md hover:scale-105`}
              style={{ height: `${height}px` }}
              title={`${point.interval} — Score: ${point.avgScore}`}
            />
            <span className="mt-2 text-xs text-gray-400 select-none">{point.interval}</span>
          </div>
        );
      })}
    </div>
  );
}

export default LineChart;
