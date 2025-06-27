// components/ui/slider.jsx
import React from "react";

function Slider({ defaultValue = [0], max = 2000, className = "" }) {
  return (
    <input
      type="range"
      min="0"
      max={max}
      defaultValue={defaultValue[0]}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
    />
  );
}
export default Slider;
