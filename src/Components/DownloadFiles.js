import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { DownloadCloud } from "lucide-react";
import { Form, Button } from "react-bootstrap";
import File from "../Assets/Upload.svg";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function FileDownloader() {
  const [showScanner, setShowScanner] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false); 

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
    
    if (result) {
      window.open(result, '_blank');
    }
  };

  const handleScannerError = (error) => {
    console.log(error?.message);
  };

  const handleSearch = () => {
    setLoading(true); 

    const dbRef = ref(database);

    onValue(dbRef, (snapshot) => {
      let records = [];
      snapshot.forEach((childSnapshot) => {
        let keyName = childSnapshot.key;
        let data = childSnapshot.val();
        records.push({ key: keyName, data: data });
      });

      const selected = records.find((record) => record.key === searchKey);

      if (selected) {
        setFileUrl(selected.data.url);
        setSelectedData(selected);
      } else {
        setFileUrl("");
        setSelectedData(null);
      }

      setLoading(false); 
    });
  };

  return (
    <div className="w-5/12 max-[640px]:w-11/12 max-[640px]:mt-4">
      {showScanner ? (
        <QrScanner
          onDecode={(result) => handleScannerDecode(result)}
          onError={(error) => handleScannerError(error)}
          style={{ width: "50px", height: "30px" }}
        />
      ) : (
        <div className="download bg-orange-50 rounded-lg border border-dashed border-orange-500 px-6 py-20 ">
          <div className="flex justify-center flex-col items-center">
            <div className="flex flex-col items-center justify-center">
              <img src={File} alt="Upload File" style={{ height: "140px" }} />
              <DownloadCloud className="text-orange-400 w-12 h-12" />
              <p className="mt-4 text-center">Scan the QR Code or Enter the File ID</p>
              <p>to download the file.</p>
            </div>
          </div>
          <Form className="mt-4 flex justify-center items-center">
            <Form.Group controlId="searchKey">
              <Form.Control
                className="text-center py-2 bg-orange-200 rounded-l-md focus:outline-orange-500 placeholder-orange-500"
                type="text"
                placeholder="Enter File ID"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </Form.Group>
            <Button
              onClick={fileUrl ? handleDownload : handleSearch}
              className={`bg-orange-500 py-2 px-2 text-white rounded-r-md`}
              disabled={loading} 
            >
              {loading ? "Searching..." : fileUrl ? "Download" : "Search"}
            </Button>
          </Form>
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
