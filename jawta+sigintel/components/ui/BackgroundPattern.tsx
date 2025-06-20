
import React from 'react';

interface BackgroundPatternProps {
  children: React.ReactNode;
  opacity?: number;
  className?: string;
}

export function BackgroundPattern({ 
  children, 
  opacity = 0.6,
  className = ""
}: BackgroundPatternProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Dark background that replaced the original waveform pattern */}
      <div 
        className="fixed inset-0 bg-black z-0" 
        style={{ opacity: opacity }}
      />
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
