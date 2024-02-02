import React from "react";
import UploadFiles from "./UploadFiles";
import DownloadFiles from "./DownloadFiles";

export default function Hero() {
  return (
    <div className="bg-white flex justify-around items-center max-[640px]:flex-col max-[640px]:justify-center max-[640px]:items-center">
      <UploadFiles />
      <DownloadFiles />
    </div>
  );
}
