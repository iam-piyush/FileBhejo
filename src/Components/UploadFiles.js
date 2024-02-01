import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import Alert from "./Alert";
import FilePreview from "./FilePreview";

export default function UploadFiles() {
  const [file, setFile] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const onFileSelect = (file) => {
    console.log(file);
    if (file && file.size > 50000000) {
      console.log("Size is greater than 50 MB");
      setErrorMsg("Maximum Allowed File Size is 50 MB");
      return;
    }
    setErrorMsg(null);
    setFile(file);
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
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={(event) => onFileSelect(event.target.files[0])}
                  multiple
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
          </div>
        </div>
      </div>
      {file ? <FilePreview file={file} /> : null}

      {errorMsg ? <Alert msg={errorMsg} /> : null}
    </div>
  );
}
