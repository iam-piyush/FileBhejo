import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import Alert from "./Alert";
import FilePreview from "./FilePreview";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import ProgressBar from "./ProgressBar";

export default function UploadFiles() {
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState();
  const [progress, setProgress] = useState();

  const onFileSelect = (selectedFiles) => {
    if (selectedFiles.length === 0) {
      return;
    }

    const newFiles = [...files];
    let totalSize = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (file.size > 50000000) {
        setErrorMsg("Maximum Allowed File Size is 50 MB");
        return;
      }

      totalSize += file.size;

      if (totalSize > 50000000) {
        setErrorMsg("Total File Size exceeds 50 MB");
        return;
      }

      newFiles.push(file);
    }

    setErrorMsg(null);
    setFiles(newFiles);
  };

  const isUploadButtonDisabled = files.length === 0;

  const handleUpload = () => {
    const storage = getStorage(app);

    files.forEach((file) => {
      const metadata = {
        contentType: file.type,
      };
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload for ${file.name} is ${progress}% done`);
        setProgress(progress);
        progress == 100 &&
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
      });
    });
  };

  return (
    <div>
      <div className="col-span-full">
        <div className="mt-2 flex justify-center bg-transparent rounded-lg border border-dashed border-gray-900/25 px-6 py-24">
          <div className="text-center">
            <UploadCloud
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md  font-semibold text-blue-600 hover:text-blue-500"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={(event) => onFileSelect(event.target.files)}
                  multiple
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
          </div>
        </div>
      </div>

      {files.map((file, index) => (
        <FilePreview key={index} file={file} />
      ))}

      {errorMsg ? <Alert msg={errorMsg} /> : null}

      <div className="mt-4"></div>
      {progress > 0 ? (
        <ProgressBar progress={progress} />
      ) : (
        <button
          onClick={handleUpload}
          disabled={isUploadButtonDisabled}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            isUploadButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Upload
        </button>
      )}
    </div>
  );
}
