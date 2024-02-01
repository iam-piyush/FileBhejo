import React from 'react'
import File from "../Assets/File.svg";

const FilePreview = ({file}) => {
  return (
    <div className='my-3 flex items-center p-2 rounded-md border border-blue-200'>
        <img src={File} alt='file' className='mr-1' style={{width: '30px'}}/>
        <h2>Filename:- {file.name} ({file?.type}, {(file.size/1024/1024).toFixed(2)}MB)</h2>
    </div>
  )
}

export default FilePreview