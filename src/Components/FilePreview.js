import React from 'react';
import File from "../Assets/File.svg";
import ProgressBar from "./ProgressBar";

const FilePreview = ({ file, progress }) => {
  return (
    <div className='mt-3 flex items-center p-2 rounded-md border border-blue-200'>
        <img src={File} alt='file' className='mr-1' style={{width: '30px'}}/>
        <h2>Filename:- {file.name} ({file?.type}, {(file.size/1024/1024).toFixed(2)}MB)</h2>
        {progress && <ProgressBar progress={progress} />}
    </div>
  );
}

export default FilePreview;
