
import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface OpticalSpectrumAnalyzerProps {
  isActive?: boolean;
  width?: number;
  height?: number;
  bandType?: 'C-Band' | 'L-Band' | 'S-Band' | 'Full-Spectrum';
  showWDM?: boolean;
  attenuation?: number;
}

export function OpticalSpectrumAnalyzer({
  isActive = false,
  width = 600,
  height = 300,
  bandType = 'C-Band',
  showWDM = true,
  attenuation = 0
}: OpticalSpectrumAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  
  // Parameters for visualization
  const [noiseLevel, setNoiseLevel] = useState(0.05);
  const [peakCount, setPeakCount] = useState(showWDM ? 8 : 1);
  const [displayMode, setDisplayMode] = useState<'linear' | 'logarithmic'>('linear');

  // Color settings based on band type
  const getBandColor = () => {
    switch(bandType) {
      case 'C-Band': return '#00b4d8';
      case 'L-Band': return '#8ac926';
      case 'S-Band': return '#ff7b00';
      case 'Full-Spectrum': return '#9d4edd';
      default: return '#00b4d8';
    }
  };

  // Get frequency range based on band type
  const getFrequencyRange = () => {
    switch(bandType) {
      case 'C-Band': return { min: 1530, max: 1565 }; // nm
      case 'L-Band': return { min: 1565, max: 1625 }; // nm
      case 'S-Band': return { min: 1460, max: 1530 }; // nm
      case 'Full-Spectrum': return { min: 1270, max: 1625 }; // nm
      default: return { min: 1530, max: 1565 }; // C-Band by default
    }
  };

  // Generate WDM channel peaks
  const generateWDMChannels = (ctx: CanvasRenderingContext2D, freqRange: { min: number, max: number }) => {
    const channelSpacing = (freqRange.max - freqRange.min) / (peakCount + 1);
    const channels = [];
    
    for (let i = 1; i <= peakCount; i++) {
      const wavelength = freqRange.min + channelSpacing * i;
      const power = Math.random() * 0.4 + 0.6 - (attenuation / 100) * 0.5; // Normalized power with attenuation effect
      channels.push({ wavelength, power });
    }
    
    return channels;
  };
  
  // Draw noise floor
  const drawNoise = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.beginPath();
    
    for (let x = 0; x < canvasWidth; x++) {
      const noiseLevel = canvasHeight - (Math.random() * 5 + (canvasHeight - 10));
      if (x === 0) {
        ctx.moveTo(x, noiseLevel);
      } else {
        ctx.lineTo(x, noiseLevel);
      }
    }
    
    ctx.stroke();
    
    // Draw "No Signal" message
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No Optical Signal Detected', canvasWidth / 2, canvasHeight / 2);
  };
  
  // Draw spectrum on canvas
  const drawSpectrum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions based on props or container
    canvas.width = width;
    canvas.height = height;
    
    // Draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = i * (canvas.width / 10);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = i * (canvas.height / 5);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    if (!isActive) {
      // Show a flat noise floor when inactive
      drawNoise(ctx, canvas.width, canvas.height);
      return;
    }
    
    // Get frequency range
    const freqRange = getFrequencyRange();
    
    // Generate WDM channels
    const channels = showWDM ? generateWDMChannels(ctx, freqRange) : [{ wavelength: (freqRange.max + freqRange.min) / 2, power: 0.9 - (attenuation / 100) * 0.5 }];
    
    // Draw the spectrum
    ctx.lineWidth = 2;
    ctx.strokeStyle = getBandColor();
    ctx.fillStyle = `${getBandColor()}20`;
    
    // Draw baseline
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    
    // Draw the spectrum with Gaussian peaks
    const points = new Array(canvas.width).fill(0);
    
    // Add peaks for each channel
    channels.forEach(channel => {
      const channelPos = ((channel.wavelength - freqRange.min) / (freqRange.max - freqRange.min)) * canvas.width;
      const sigma = canvas.width / 50; // Adjust for peak width
      const amplitude = channel.power * canvas.height * 0.8;
      
      for (let x = 0; x < canvas.width; x++) {
        const gauss = amplitude * Math.exp(-Math.pow(x - channelPos, 2) / (2 * Math.pow(sigma, 2)));
        points[x] += gauss;
      }
    });
    
    // Add noise
    for (let x = 0; x < canvas.width; x++) {
      const noise = (Math.random() * noiseLevel * canvas.height * 0.2);
      points[x] += noise;
      
      // Apply logarithmic scale if selected
      if (displayMode === 'logarithmic') {
        points[x] = Math.log10(1 + points[x]) * (canvas.height / 2);
      }
      
      const y = canvas.height - points[x];
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Complete the path and stroke/fill
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw wavelength labels (x-axis)
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    
    for (let i = 0; i <= 5; i++) {
      const x = i * (canvas.width / 5);
      const wavelength = freqRange.min + (i / 5) * (freqRange.max - freqRange.min);
      ctx.fillText(`${wavelength.toFixed(0)} nm`, x, canvas.height - 5);
    }
    
    // Draw power level labels (y-axis)
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 4; i++) {
      const y = canvas.height - (i * canvas.height / 4);
      const power = displayMode === 'logarithmic' 
        ? -10 * (4 - i)
        : (-30 + i * 10) - attenuation;
      ctx.fillText(`${power} dBm`, 40, y);
    }
    
    // Draw band type label
    ctx.fillStyle = getBandColor();
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${bandType} ${showWDM ? 'WDM' : 'Single Channel'}`, 10, 20);
    
    // Draw attenuation indicator if any
    if (attenuation > 0) {
      ctx.fillStyle = '#f94144';
      ctx.fillText(`Attenuation: ${attenuation} dB`, 10, 40);
    }
  };

  // Animation loop
  const animate = () => {
    drawSpectrum();
    setAnimationFrame(requestAnimationFrame(animate));
  };

  // Setup animation
  useEffect(() => {
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, showWDM, bandType, peakCount, noiseLevel, attenuation, displayMode, width, height]);

  // Ensure the canvas dimensions match props on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      drawSpectrum();
    }
  }, [width, height]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative bg-black/50 border border-border/30 rounded-md overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height}
          className="w-full h-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Display Mode</Label>
            <Select value={displayMode} onValueChange={(v) => setDisplayMode(v as 'linear' | 'logarithmic')}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Display Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="logarithmic">Logarithmic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-wdm" className="text-xs text-muted-foreground">Show WDM</Label>
            <Switch id="show-wdm" checked={showWDM} onCheckedChange={(v) => {
              setPeakCount(v ? 8 : 1);
            }} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Noise Floor</Label>
            <span className="text-xs">{(noiseLevel * 100).toFixed(0)}%</span>
          </div>
          <Slider 
            value={[noiseLevel * 100]} 
            onValueChange={([value]) => setNoiseLevel(value / 100)}
            min={1}
            max={20}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
