import React, { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import Alert from "./Alert";
import FilePreview from "./FilePreview";
import { app } from "../firebase";
import File from "../Assets/Upload.svg";
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
    <div className="w-5/12 max-[640px]:w-11/12">
      {!uploaded ? (
        <div className="drop col-span-full bg-sky-50">
          <div className="flex flex-col items-center justify-center bg-transparent rounded-lg border border-dashed border-sky-500 px-6 py-20">
            <img src={File} alt="Upload File" style={{ height: "140px" }} />
            <div className="text-center">
              <UploadCloud
                className="mx-auto h-12 w-12 text-sky-200"
                aria-hidden="true"
              />
              <div className="flex flex-col items-center justify-center leading-6 text-gray-600">
                <p className="text-md mt-4">Drag & Drop</p>
                <p className="text-md">files here to upload or</p>
                <label
                  htmlFor="file-upload"
                  className="px-8 py-2 mt-4 bg-sky-400 relative cursor-pointer rounded-md  text-white hover:bg-sky-500"
                >
                  <span>Add files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={(event) => onFileSelect(event.target.files)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="drop col-span-full bg-sky-50">
          <div className="flex justify-center bg-transparent rounded-lg border border-dashed border-sky-500 py-20">
            <div className="text-center">
              <QRCode value={downloadURL} size={128} className="mx-auto bg-sky-50" style={{ height: "200px" }} />
              <p className="mt-4 text-sky-700 font-semibold">
                <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                  Download URL
                </a>
              </p>
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

      <div className="mt-4 flex">
        <button
          onClick={handleUpload}
          disabled={isUploadButtonDisabled}
          className={`w-full bg-sky-600 text-white px-7 py-2 rounded hover:bg-sky-700 ${
            isUploadButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
