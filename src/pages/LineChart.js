// components/LineChart.js

import React from 'react';

function LineChart({ data }) {
  return (
    <div className="line-chart">
      {data.map((point, i) => (
        <div
          key={i}
          className="bar"
          style={{
            height: `${Math.max(10, point.avgScore * 5)}px`,
            backgroundColor:
              point.avgScore >= 8 ? '#28a745' :
              point.avgScore >= 6 ? '#ffc107' :
              point.avgScore >= 4 ? '#fd7e14' : '#dc3545',
          }}
          title={`${point.interval} — Score: ${point.avgScore}`}
        ></div>
      ))}
    </div>
  );
}

export default LineChart;