
import React, { useRef, useEffect } from 'react';

interface RadiofaxVisualizerProps {
  imageData?: Uint8ClampedArray;
  width?: number;
  height?: number;
  isLive?: boolean;
  isReceiving?: boolean;
}

export function RadiofaxVisualizer({
  imageData,
  width = 800,
  height = 400,
  isLive = false,
  isReceiving = false
}: RadiofaxVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Handle rendering the image data to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (imageData && width && height) {
      // Create ImageData and put it on the canvas
      const image = new ImageData(imageData, width, height);
      ctx.putImageData(image, 0, 0);
      
      // If receiving, add a scan line indicator
      if (isReceiving) {
        const scanLine = Math.floor(Date.now() / 100) % height;
        
        // Draw scan line
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanLine);
        ctx.lineTo(width, scanLine);
        ctx.stroke();
        
        // Draw vertical position indicator
        ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
        ctx.fillRect(width - 10, 0, 10, height);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.fillRect(width - 10, scanLine - 2, 10, 4);
      }
    } else {
      // Draw empty state
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ccc';
      for (let y = 0; y < canvas.height; y += 20) {
        for (let x = 0; x < canvas.width; x += 20) {
          if ((x + y) % 40 === 0) {
            ctx.fillRect(x, y, 10, 10);
          }
        }
      }
      
      if (isLive) {
        ctx.fillStyle = '#666';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Waiting for radiofax signal...', canvas.width / 2, canvas.height / 2);
      }
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [imageData, width, height, isLive, isReceiving]);
  
  // Redraw active scan line if receiving
  useEffect(() => {
    if (!isReceiving || !canvasRef.current) return;
    
    // Animation loop for scan line
    const animationId = requestAnimationFrame(function animate() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx || !imageData) return;
      
      // Only update the scan line, not the whole image
      const scanLine = Math.floor(Date.now() / 100) % height;
      
      // Clear previous scan line area
      ctx.clearRect(width - 10, 0, 10, height);
      
      // Draw vertical position indicator
      ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
      ctx.fillRect(width - 10, 0, 10, height);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
      ctx.fillRect(width - 10, scanLine - 2, 10, 4);
      
      // Draw scan line
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanLine);
      ctx.lineTo(width, scanLine);
      ctx.stroke();
      
      requestAnimationFrame(animate);
    });
    
    return () => cancelAnimationFrame(animationId);
  }, [isReceiving, imageData, width, height]);
  
  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        className={`w-full h-auto border border-border rounded-md ${isLive ? 'animate-pulse-subtle' : ''}`}
      />
      
      {isReceiving && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          RECEIVING
        </div>
      )}
    </div>
  );
}
