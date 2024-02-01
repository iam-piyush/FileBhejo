import React from "react";

export default function ProgressBar({ progress = 10 }) {
  const strokeWidth = 8;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className="mt-3"
      height={radius * 2}
      width={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
    >
      <circle
        className="progress-ring__circle"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius - strokeWidth / 2}
        cx={radius}
        cy={radius}
      />
      <circle
        className="progress-ring__progress"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius - strokeWidth / 2}
        cx={radius}
        cy={radius}
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset: offset,
        }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="12px"
        fill="#000"
      >
        {`${progress}%`}
      </text>
    </svg>
  );
}
