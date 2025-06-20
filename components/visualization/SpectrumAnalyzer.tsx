import React, { useRef, useEffect } from 'react';

interface SpectrumAnalyzerProps {
  data: number[];
  isActive?: boolean;
  className?: string;
  showLabels?: boolean;
  showPeaks?: boolean;
  simplified?: boolean;
  peaks?: { freq: number; power: number }[];
}

export function SpectrumAnalyzer({
  data,
  isActive = true,
  className = '',
  showLabels = true,
  showPeaks = true,
  simplified = false,
  peaks = []
}: SpectrumAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the spectrum analyzer on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions properly to avoid blurring
    const container = canvas.parentElement;
    if (container) {
      // High resolution canvas
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * devicePixelRatio;
      canvas.height = container.clientHeight * devicePixelRatio;
      
      // Set display size
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
      
      // Scale context to match pixel ratio
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Set up dimensions for drawing
    const width = parseInt(canvas.style.width || '0', 10);
    const height = parseInt(canvas.style.height || '0', 10);
    
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines if not simplified
    if (!simplified) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      
      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      
      ctx.stroke();
    }
    
    // Draw the spectrum data
    if (data && data.length > 0) {
      const barWidth = width / data.length;
      
      // Create gradient for the bars
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
      gradient.addColorStop(0.5, 'rgba(0, 190, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 120, 255, 1)');
      
      // Draw the spectrum bars
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      // Start the path at the bottom-left
      for (let i = 0; i < data.length; i++) {
        const x = i * barWidth;
        const barHeight = (data[i] / 100) * height;
        const y = height - barHeight;
        
        if (i === 0) {
          ctx.moveTo(x, height);
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Close the path at the bottom-right
      ctx.lineTo(width, height);
      ctx.closePath();
      
      // Fill the path with gradient
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw the spectrum outline
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = i * barWidth;
        const barHeight = (data[i] / 100) * height;
        const y = height - barHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.strokeStyle = 'rgba(0, 220, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw labels if enabled and not in simplified mode
      if (showLabels && !simplified) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(200, 200, 200, 0.7)';
        ctx.font = '10px monospace';
        
        // Show frequency labels on the x-axis
        const centerFreq = 145.5; // MHz
        const span = 20; // MHz total span (±10)
        
        for (let i = 0; i <= 10; i++) {
          const x = (width / 10) * i;
          const freq = centerFreq - (span / 2) + (span / 10) * i;
          ctx.fillText(`${freq.toFixed(1)}`, x, height - 15);
        }
        
        // Show power labels on the y-axis
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i <= 5; i++) {
          const y = height - (height / 5) * i;
          const power = (i * 20); // 0-100 dB scale
          ctx.fillText(`${power}`, 25, y);
        }
        
        ctx.textAlign = 'left';
        ctx.fillText('dB', 30, height / 2);
        
        ctx.textAlign = 'center';
        ctx.fillText('MHz', width / 2, height - 3);
      }
      
      // Draw peak labels if enabled and we have peaks
      if (showPeaks && !simplified && peaks && peaks.length > 0) {
        ctx.font = '9px monospace';
        
        peaks.forEach(peak => {
          // Calculate the position of this peak
          const centerFreq = 145.5; // MHz
          const span = 20; // MHz total span (±10)
          const freqOffset = peak.freq - (centerFreq - span/2);
          const xPos = (freqOffset / span) * width;
          
          const yPos = height - (peak.power / 100) * height;
          
          // Draw the peak marker
          ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
          ctx.beginPath();
          ctx.arc(xPos, yPos, 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw the peak label
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillText(`${peak.freq.toFixed(2)}MHz`, xPos, yPos - 15);
          ctx.fillText(`${peak.power}dB`, xPos, yPos - 5);
        });
      }
    }
    
    // Draw an inactive overlay if not active
    if (!isActive) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Spectrum Analyzer Inactive', width / 2, height / 2);
    }
  }, [data, isActive, className, showLabels, showPeaks, simplified, peaks]);
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '4px'
        }}
      />
    </div>
  );
}