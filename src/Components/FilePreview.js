import React from "react";
import File from "../Assets/folder.png";
import Progress from "./ProgressBar";

const FilePreview = ({ file, progress }) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center text-sm xs:text-xs md:text-base">
        <img src={File} alt="file" className="mr-1" style={{ width: "30px" }} />
        <h2 className="mr-1">{file.name}</h2>
        <h2>({(file.size / 1024 / 1024).toFixed(2)}MB)</h2>
        <div className="ml-4">
          {progress > 0 && <Progress progress={progress}  />}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
