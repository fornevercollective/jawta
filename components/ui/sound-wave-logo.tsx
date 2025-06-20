import React from 'react';

interface SoundWaveLogoProps {
  size?: number;
  className?: string;
}

export function SoundWaveLogo({ size = 24, className = '' }: SoundWaveLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M4.5 10V14M7.5 6V18M10.5 8V16M13.5 3V21M16.5 8V16M19.5 6V18" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}