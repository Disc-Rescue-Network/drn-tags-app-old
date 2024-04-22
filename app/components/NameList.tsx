// NameList.tsx
import React from "react";

interface NameListProps {
  names: string[];
}

const NameList: React.FC<NameListProps> = ({ names }) => {
  // Ensure names is always treated as an array
  if (!Array.isArray(names)) {
    console.error("NameList expected an array, but received:", names);
    names = []; // Fallback to empty array if error in data type
  }

  return (
    <div>
      {names.map((name, index) => (
        <p key={index}>{name}</p>
      ))}
    </div>
  );
};

export default NameList;
