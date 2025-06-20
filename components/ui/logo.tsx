
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const LogoIcon: React.FC<LogoProps> = ({ className = "", size = 36 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 256 256" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="256" height="256" rx="48" fill="currentColor" fillOpacity="0.1" />
      <path
        d="M48 80C48 80 70.6667 80 80 80C89.3333 80 92 96 100 96C108 96 110.667 48 120 48C129.333 48 131.5 144 140 144C148.5 144 151.333 32 160 32C168.667 32 170.667 112 180 112C189.333 112 192 64 200 64C208 64 208 80 216 80C224 80 248 80 248 80"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="64" y="176" width="16" height="32" rx="2" fill="currentColor" />
      <rect x="96" y="160" width="16" height="48" rx="2" fill="currentColor" />
      <rect x="128" y="192" width="16" height="16" rx="2" fill="currentColor" />
      <rect x="160" y="144" width="16" height="64" rx="2" fill="currentColor" />
      <rect x="192" y="176" width="16" height="32" rx="2" fill="currentColor" />
    </svg>
  );
};
