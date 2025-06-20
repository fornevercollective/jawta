
import React from "react";

interface JawtaLogoProps {
  className?: string;
  size?: number;
  variant?: "icon" | "full";
}

export function JawtaLogo({ 
  className = "", 
  size = 24,
  variant = "icon"
}: JawtaLogoProps) {
  const width = variant === "icon" ? size : size * 3;
  
  return (
    <div className={`inline-block ${className}`}>
      {/* Icon-only version */}
      {variant === "icon" && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 9.5V14.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 8V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17 9.5V14.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      
      {/* Full logo version with text */}
      {variant === "full" && (
        <svg
          width={width}
          height={size}
          viewBox="0 0 72 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 9.5V14.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 8V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17 9.5V14.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Text part */}
          <path
            d="M30 7H32V17H30V7Z"
            fill="currentColor"
          />
          <path
            d="M36 7L40 12L44 7H46V17H44V10L40 15L36 10V17H34V7H36Z"
            fill="currentColor"
          />
          <path
            d="M50 7H52V15H58V17H50V7Z"
            fill="currentColor"
          />
          <path
            d="M62 7H70V9H64V11H69V13H64V15H70V17H62V7Z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
}
