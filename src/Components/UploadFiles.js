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
    minutes: 5,
    seconds: 0,
  });

  useEffect(() => {
    let timer;

    const handleBeforeUnload = () => {
      deleteFileFromStorage();
    };

    const handleTimer = () => {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime.seconds > 0) {
            return { ...prevTime, seconds: prevTime.seconds - 1 };
          } else if (prevTime.minutes > 0) {
            return { minutes: prevTime.minutes - 1, seconds: 59 };
          } else {
            deleteFileFromStorage();
            clearInterval(timer);
            return prevTime;
          }
        });
      }, 1000);
    };

    if (uploaded) {
      handleTimer();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploaded]);

  useEffect(() => {
    const handlePageRefresh = (event) => {
      if (uploaded || files.length > 0) {
        const message = "Leaving this page will result in file deletion.";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handlePageRefresh);

    return () => {
      window.removeEventListener("beforeunload", handlePageRefresh);
    };
  }, [uploaded, files]);

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
      setProgressArray((prev) => [...prev, 0]);
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
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          console.log(`File ${file.name} available at ${url}`);
          setDownloadURL(url);
          setUploaded(true);
          setTimeRemaining({
            minutes: 5,
            seconds: 0,
          }); 
        })
        .catch((error) => {
          console.error("Error during file upload:", error);
          setErrorMsg("Error during file upload");
        });

      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressArray((prev) => {
          const newArray = [...prev];
          newArray[index] = progress;
          return newArray;
        });
      });
    });
  };

  const deleteFileFromStorage = () => {
    if (files.length > 0) {
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
    }
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
              <QRCode
                value={downloadURL}
                size={256}
                className="mx-auto bg-sky-50"
                style={{ height: "200px" }}
              />
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
        {!uploaded ? (
          <button
            onClick={handleUpload}
            disabled={isUploadButtonDisabled}
            className={`w-full bg-sky-600 text-white px-7 py-2 rounded hover:bg-sky-700 ${
              isUploadButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Upload
          </button>
        ) : (
          <button
            onClick={() =>
              alert(
                "Please do not refresh the page; otherwise, the file will be deleted instantly."
              )
            }
            className="w-full text-white px-7 py-2 rounded"
            style={{ backgroundColor: "rgb(239 68 68)" }}
          >
            Please do not refresh the page
          </button>
        )}
      </div>
    </div>
  );
}
