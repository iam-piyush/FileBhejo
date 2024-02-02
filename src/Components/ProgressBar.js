import React from "react";
import { CheckCircle } from "lucide-react";

export default function ProgressBar({ progress = 10 }) {
  const strokeWidth = 10;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: "relative" }}>
      {progress < 100 && (
        <svg
          height={radius * 0.8}
          width={radius * 0.8}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        >
          {/* Background Circle */}
          <circle
            className="progress-ring__circle"
            strokeWidth={strokeWidth}
            fill="transparent"
            stroke="#e0e0e0" 
            r={radius - strokeWidth / 2}
            cx={radius}
            cy={radius}
          />

          <circle
            className="progress-ring__progress"
            strokeWidth={strokeWidth}
            fill="transparent"
            stroke="#0084C7" 
            r={radius - strokeWidth / 2}
            cx={radius}
            cy={radius}
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: offset,
            }}
          />
        </svg>
      )}

      {progress === 100 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-100%, 0%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%", 
          }}
        >
          <CheckCircle size={30} color="#0084C7" />
        </div>
      )}

      {progress < 100 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <text style={{fontSize: '10px'}}
            
          >
            {`${Number(progress).toFixed(0)}%`}
          </text>
        </div>
      )}
    </div>
  );
}
