
import React, { useEffect, useRef } from "react";

interface MiniWaveformVisualizerProps {
  isActive?: boolean;
  volume?: number;
  className?: string;
  width?: number;
  height?: number;
}

export function MiniWaveformVisualizer({
  isActive = false,
  volume = 75,
  className = "",
  width = 80,
  height = 30
}: MiniWaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Function to draw the waveform on the canvas
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set fixed dimensions for mini visualizer
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set styles
    ctx.lineWidth = 1.5;
    
    // Draw base line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    if (!isActive) {
      // Draw flat line with tiny noise when inactive
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      const lineY = height / 2;
      ctx.moveTo(0, lineY);
      
      for (let x = 0; x < width; x += 1) {
        const noise = Math.random() * 1 - 0.5; // Tiny noise between -0.5 and 0.5
        ctx.lineTo(x, lineY + noise);
      }
      ctx.stroke();
      return;
    }
    
    // If active, draw animated waveform
    const amplitude = (volume / 100) * (height / 3.5);
    const time = Date.now() / 1000;
    
    // Waveform path
    ctx.beginPath();
    
    // Color based on activity - cyan gradient when active
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#00c6ff');
    gradient.addColorStop(1, '#0072ff');
    ctx.strokeStyle = gradient;
    
    ctx.moveTo(0, height / 2);
    
    for (let x = 0; x < width; x++) {
      // Create a more compact waveform with multiple frequencies
      const y = height / 2 + 
              amplitude * Math.sin((x / width) * 10 + time * 5) * 0.3 +
              amplitude * Math.sin((x / width) * 15 + time * 3) * 0.2 +
              amplitude * Math.sin((x / width) * 5 + time * 2) * 0.5;
      
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Request next animation frame
    animationRef.current = requestAnimationFrame(drawWaveform);
  };
  
  // Set up animation
  useEffect(() => {
    drawWaveform();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, volume, width, height]);
  
  return (
    <div className={`relative midi-pad rounded-md overflow-hidden bg-black border border-border/20 ${className}`}
         style={{ width: `${width}px`, height: `${height}px` }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      {isActive && (
        <div className="absolute top-0 right-0 bg-destructive/90 text-white text-[8px] px-1 py-0.5 rounded-bl">
          LIVE
        </div>
      )}
    </div>
  );
}
