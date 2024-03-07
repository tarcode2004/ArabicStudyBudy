import React, { useState, ChangeEvent } from "react";

interface LinearDragScaleProps {
  value: number;
  setValue: (value: number) => void;
}

const LinearDragScale: React.FC<LinearDragScaleProps> = ({ value, setValue }) => {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value)); // Ensure number conversion
    console.log(e.target.value);
  };

  return (
    <div>
      <input
        type="range"
        min={0}
        max={15}
        value={value}
        onChange={handleChange}
      />
      <output>{value}</output>
    </div>
  );
};

export default LinearDragScale;
