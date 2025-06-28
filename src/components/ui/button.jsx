import React from "react";
import { motion } from "framer-motion"; // Optional for advanced animations

function Button({
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  disabled = false,
  ...props
}) {
  // Base styles that apply to all buttons
  const baseClasses = `
    inline-flex items-center justify-center cursor-pointer    font-Rubik text-[1.27rem] leading-normal
    rounded-[0.5rem] px-12 py-4
    transition-all duration-100 ease-[cubic-bezier(0.4,0,0.2,1)]
    focus:outline-none     disabled:opacity-60 disabled:cursor-not-allowed
    motion-reduce:transition-none
    ${className}
  `;

  // Variant-specific styles
  const variants = {
    primary: `
      bg-secondary text-white
      shadow-primary-3 hover:shadow-secondary
      active:shadow-secondary
      dark:shadow-black/30 dark:hover:shadow-dark-strong
    `,
    secondary: `
      bg-primary border-2 border-primary text-white
      hover:bg-primary hover:text-white
      active:bg-primary active:text-white
      dark:bg-primary dark:hover:bg-primary
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600
      focus:ring-red-300
    `,
    outline: `
      border border-secondary text-secondary
      hover:bg-secondary/20
      focus:ring-secondary/30
    `,
    ghost: `
      text-gray-700
      hover:bg-gray-100
      focus:ring-gray-300
    `,
    cardButton: `
       bg-primary text-white text-[16px]
      px-4 py-3 rounded-lg shadow
      hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5
      active:bg-gray-900 active:shadow-sm active:translate-y-0
      focus:ring-primary/50
    `,
    active: `
    bg-primary/4 text-primary
    w-10 h-10          
    flex items-center justify-center
    rounded-full
    !p-4 !hover:bg-primary/10  !hover:focus-none
  `.trim(),
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </motion.button>
  );
}

export default Button;
