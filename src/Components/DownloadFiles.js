import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { DownloadCloud } from "lucide-react";
import File from "../Assets/Upload.svg";

export default function DownloadFiles() {
  const [showScanner, setShowScanner] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleDownload = () => {
    if (fileUrl) {
      window.location.href = fileUrl;
    }
  };

  const handleScanButtonClick = () => {
    setShowScanner((prevShowScanner) => !prevShowScanner);
  };

  const handleScannerDecode = (result) => {
    setShowScanner(false);
    setFileUrl(result);
  };

  const handleScannerError = (error) => {
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
        <div className="download bg-orange-50 rounded-lg border border-dashed border-orange-500 px-6 py-28">
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

      {!showScanner && (
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Paste file URL"
            className="w-full border p-2 rounded mr-2"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
          <button
            className={`bg-orange-500 text-white px-7 py-2 rounded hover:bg-orange-600`}
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      )}

      <div className="mt-4 flex">
        <button
          className={`w-full bg-orange-500 text-white px-7 py-2 rounded hover:bg-orange-600`}
          onClick={() => handleScanButtonClick()}
        >
          {showScanner ? "Close" : "Scan"}
        </button>
      </div>
    </div>
  );
}
