import React from "react";
import { MdEventAvailable } from "react-icons/md"; // Example icon for an "Ended" status

const EndedLabel = () => {
  return (
    <div className="ended-label">
      <MdEventAvailable className="ended-icon" />
      <span>Ended</span>
    </div>
  );
};

export default EndedLabel;
