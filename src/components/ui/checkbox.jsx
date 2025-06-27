// components/ui/checkbox.jsx
import React from "react";

const Checkbox = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";
export default Checkbox;
