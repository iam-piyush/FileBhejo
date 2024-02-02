import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { DownloadCloud } from "lucide-react";
import File from "../Assets/Upload.svg";

export default function DownloadFiles() {
  const [scanResult, setScanResult] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  useEffect(() => {
    // Clear local storage for the HTML5 Qrcode library
    const cameras = JSON.parse(localStorage.getItem("html5-qrcode-cameras"));
    if (cameras) {
      cameras.forEach((camera) => {
        localStorage.removeItem(`html5-qrcode-camera-${camera.deviceId}`);
      });
    }

    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);
      setDownloadLink(result);
    }

    function error(err) {
      console.warn(err);
    }

    // Cleanup the scanner when the component unmounts
    return () => {
      scanner.clear();
    };
  }, []);

  const handleDownload = () => {
    // Trigger download when the button is clicked
    if (downloadLink) {
      window.location.href = downloadLink;
    }
  };

  return (
    <div className="w-5/12 max-[640px]:w-11/12 max-[640px]:mt-4 max-[640px]:mb-8">
      <div className="bg-orange-50 rounded-lg border border-dashed border-orange-500 px-6 py-20">
        <div className="flex justify-center flex-col items-center">
          {scanResult ? (
            downloadLink ? (
              <a href={downloadLink}><div className="flex flex-col items-center justify-center">
                <img src={File} alt="Upload File" style={{ height: "150px" }} />
                <DownloadCloud className="text-orange-400 w-12 h-12" />
                <p>Success</p>
                <p>You can download now.</p>
              </div></a>
            ) : null
          ) : (
            <div id="reader" style={{ width: "230px", height: "200px" }}></div>
          )}
          {!downloadLink? (
          <div className="mt-4 flex flex-col items-center justify-center">
            <DownloadCloud className="text-orange-400 w-12 h-12" />
            <p>Download the file</p>
            <p>by scanning the QR code.</p>
          </div> ) : null }
        </div>
      </div>
      <div className="mt-4 flex">
        <button
          onClick={handleDownload}
          className={`w-full bg-orange-600 text-white px-7 py-2 rounded hover:bg-orange-700 ${
            !downloadLink && "cursor-not-allowed opacity-50"
          }`}
          disabled={!downloadLink}
        >
          Download
        </button>
      </div>
    </div>
  );
}
