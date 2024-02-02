import React, { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import Alert from "./Alert";
import FilePreview from "./FilePreview";
import { app } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import QRCode from "react-qr-code";

export default function UploadFiles() {
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState();
  const [progressArray, setProgressArray] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const [timeRemaining, setTimeRemaining] = useState({
    minutes: 3,
    seconds: 0,
  });

  useEffect(() => {
    let timer;

    if (uploaded) {
      // Set a timer to update the countdown and delete the file after 3 minutes
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime.seconds > 0) {
            return { ...prevTime, seconds: prevTime.seconds - 1 };
          } else if (prevTime.minutes > 0) {
            return { minutes: prevTime.minutes - 1, seconds: 59 };
          } else {
            deleteFileFromStorage();
            return prevTime;
          }
        });
      }, 1000);

      setTimeout(() => {
        deleteFileFromStorage();
        setUploaded(false); // Set uploaded to false to trigger the cleanup in useEffect
      }, 180000); // 3 minutes (180,000 milliseconds)
    }

    return () => {
      // Clear the timers when the component unmounts or when a new file is uploaded
      clearInterval(timer);
    };
  }, [uploaded]);

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
      setProgressArray((prev) => [...prev, 0]); // Initialize progress to 0 for each file
    }

    setErrorMsg(null);
    setFiles(newFiles);
  };

  const isUploadButtonDisabled = files.length === 0;

  const handleUpload = () => {
    const storage = getStorage(app);

    files.forEach((file, index) => {
      const metadata = {
        contentType: file.type,
      };
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask
        .then((snapshot) => {
          // Upload is complete, retrieve download URL
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          console.log(`File ${file.name} available at ${url}`);
          setDownloadURL(url);
          setUploaded(true);
        })
        .catch((error) => {
          console.error("Error during file upload:", error);
          setErrorMsg("Error during file upload");
        });

      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload for ${file.name} is ${progress}% done`);
        setProgressArray((prev) => {
          const newArray = [...prev];
          newArray[index] = progress;
          return newArray;
        });
      });
    });
  };

  useEffect(() => {
    let timer;

    if (uploaded) {
      timer = setTimeout(() => {
        deleteFileFromStorage();
      }, 180000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [uploaded]);

  const deleteFileFromStorage = () => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `files/${files[0].name}`);

    deleteObject(storageRef)
      .then(() => {
        console.log("File deleted successfully");
        setDownloadURL("");
        setUploaded(false);
        setFiles([]);
        setProgressArray([]);
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  return (
    <div>
      {!uploaded ? (
        <div className="drop col-span-full">
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
      ) : (
        <div className="drop col-span-full">
          <div className="mt-2 flex justify-center bg-transparent rounded-lg border border-dashed border-gray-900/25 py-12">
            <div className="text-center">
              <QRCode value={downloadURL} size={128} className="mx-auto" />
              <p className="mt-4 text-blue-600 font-semibold">
                <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                  Download URL
                </a>
              </p>
              {/* Render the countdown timer */}
              <p className="mt-2 text-gray-500">
                QR Code valid for:- {timeRemaining.minutes}:
                {timeRemaining.seconds < 10
                  ? `0${timeRemaining.seconds}`
                  : timeRemaining.seconds}{" "}
              </p>
            </div>
          </div>
        </div>
      )}

      {files.map((file, index) => (
        <FilePreview key={index} file={file} progress={progressArray[index]} />
      ))}

      {errorMsg ? <Alert msg={errorMsg} /> : null}

      <div className="mt-4"></div>

      {!uploaded ? (
        <button
          onClick={handleUpload}
          disabled={isUploadButtonDisabled}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            isUploadButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Upload
        </button>
      ) : null}
    </div>
  );
}
