import React from "react";
import { MdEventAvailable } from "react-icons/md"; // Example icon for an "Ended" status

const EndedLabel = () => {
  return (
    <div className="ended-label flex flex-row items-center justify-center gap-2 text-sm">
      <MdEventAvailable className="ended-icon" />
      <span>Ended</span>
    </div>
  );
};

export default EndedLabel;
