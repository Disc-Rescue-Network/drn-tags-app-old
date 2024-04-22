import React from "react";
import { MdFiberManualRecord } from "react-icons/md"; // Example icon for an "Ended" status

const LiveLabel = () => {
  return (
    <div className="live-label">
      <MdFiberManualRecord className="live-icon" />
      <span>Live</span>
    </div>
  );
};

export default LiveLabel;
