import React from "react";

const ProgressBar = ({ progress = 10 }) => {
  return (
    <div>
      {progress < 100 && (
        <div>
          {`${Number(progress).toFixed(0)}%`}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
