import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { DownloadCloud } from "lucide-react";
import File from "../Assets/Upload.svg";

export default function DownloadFiles() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleDownload = (result) => {
    // Trigger download when the button is clicked
    if (result) {
      window.location.href = result;
    }
  };

  const handleScanButtonClick = () => {
    // Toggle the scanner when the button is clicked
    setShowScanner((prevShowScanner) => !prevShowScanner);
  };

  const handleScannerDecode = (result) => {
    // Handle the result when the QR code is successfully scanned
    setScanResult(result);
    setShowScanner(false); // Hide the scanner after a successful scan
    handleDownload(result);
  };

  const handleScannerError = (error) => {
    // Handle scanner errors
    console.log(error?.message);
  };

  return (
    <div className="w-5/12 max-[640px]:w-11/12 max-[640px]:mt-4 max-[640px]:mb-8">
    {showScanner ? (
      <QrScanner
        onDecode={(result) => handleScannerDecode(result)}
        onError={(error) => handleScannerError(error)}
        style={{ width: "50px", height: "30px" }}
      />
    ) : (
      <div className="bg-orange-50 rounded-lg border border-dashed border-orange-500 px-6 py-28">
        <div className="flex justify-center flex-col items-center">
          <div className="flex flex-col items-center justify-center">
            <img src={File} alt="Upload File" style={{ height: "150px" }} />
            <DownloadCloud className="text-orange-400 w-12 h-12" />
            <p>Scan the QR</p>
            <p>to download the file.</p>
          </div>
        </div>
      </div>
    )}

    <div className="mt-4 flex">
      <button
        className={`w-full bg-orange-600 text-white px-7 py-2 rounded hover:bg-orange-700`}
        onClick={() => handleScanButtonClick()}
      >
        {showScanner ? "Close" : "Scan"}
      </button>
    </div>
  </div>
);
}
