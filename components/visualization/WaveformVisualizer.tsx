
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Cpu, HardDrive, Radio, Smartphone, Waves } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface WaveformVisualizerProps {
  data?: number[];
  height?: number;
  width?: number;
  barWidth?: number;
  barGap?: number;
  isActive?: boolean;
  volume?: number;
  className?: string;
}

type Device = {
  id: string;
  name: string;
  icon: React.ReactNode;
  waveformType: "sine" | "square" | "sawtooth" | "complex" | "noise";
};

export function WaveformVisualizer({
  data,
  height: heightProp,
  width: widthProp,
  barWidth,
  barGap,
  isActive = false,
  volume = 75,
  className = ""
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [deviceMenuOpen, setDeviceMenuOpen] = useState(false);
  
  // Available devices
  const devices: Device[] = [
    { 
      id: "default", 
      name: "System Default", 
      icon: <Waves className="h-4 w-4" />,
      waveformType: "complex" 
    },
    { 
      id: "radio", 
      name: "Radio Receiver", 
      icon: <Radio className="h-4 w-4" />,
      waveformType: "sine" 
    },
    { 
      id: "mobile", 
      name: "Mobile Transceiver", 
      icon: <Smartphone className="h-4 w-4" />,
      waveformType: "sawtooth" 
    },
    { 
      id: "sdr", 
      name: "Software Defined Radio", 
      icon: <Cpu className="h-4 w-4" />,
      waveformType: "square" 
    },
    { 
      id: "recorder", 
      name: "Signal Recorder", 
      icon: <HardDrive className="h-4 w-4" />,
      waveformType: "noise" 
    }
  ];
  
  // Default to the first device
  const [selectedDevice, setSelectedDevice] = useState<Device>(devices[0]);
  
  // Function to draw the waveform on the canvas based on selected device
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Update canvas dimensions to match display size
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set styles
    ctx.lineWidth = 2;
    
    // Draw base line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    if (!isActive) {
      // Draw flat line with tiny noise when inactive
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      const lineY = height / 2;
      ctx.moveTo(0, lineY);
      
      for (let x = 0; x < width; x += 2) {
        const noise = Math.random() * 2 - 1; // Tiny noise between -1 and 1
        ctx.lineTo(x, lineY + noise);
      }
      ctx.stroke();
      return;
    }
    
    // If active, draw animated waveform
    const amplitude = (volume / 100) * (height / 3);
    const time = Date.now() / 1000;
    
    // Waveform path
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.moveTo(0, height / 2);
    
    // Draw different waveform patterns based on the selected device
    for (let x = 0; x < width; x++) {
      let y = height / 2;
      const xNorm = x / width;
      
      switch (selectedDevice.waveformType) {
        case "sine":
          // Pure sine wave for radio receiver
          y = height / 2 + amplitude * Math.sin((xNorm * 10) + time * 3);
          break;
          
        case "square":
          // Square wave for SDR
          {
            const period = width / 8;
            const phase = (time * 2) % 1;
            const value = ((x + phase * width) % period) < period / 2 ? 1 : -1;
            y = height / 2 + amplitude * value * 0.8;
          }
          break;
          
        case "sawtooth":
          // Sawtooth wave for mobile transceiver
          {
            const period = width / 6;
            const phase = (time * 2) % 1;
            const value = (((x + phase * width) % period) / period) * 2 - 1;
            y = height / 2 + amplitude * value * 0.7;
          }
          break;
          
        case "noise":
          // Noisy but structured wave for signal recorder
          y = height / 2 + 
              amplitude * Math.sin((xNorm * 8) + time * 2) * 0.5 +
              (Math.random() * amplitude * 0.4 - amplitude * 0.2);
          break;
          
        case "complex":
        default:
          // Complex multi-frequency wave (default)
          y = height / 2 + 
              amplitude * Math.sin((xNorm * 10) + time * 5) * 0.3 +
              amplitude * Math.sin((xNorm * 20) + time * 3) * 0.2 +
              amplitude * Math.sin((xNorm * 5) + time * 2) * 0.5;
          break;
      }
      
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw subtle glow effect
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Request next animation frame
    animationRef.current = requestAnimationFrame(drawWaveform);
  };
  
  // Handle device selection
  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setDeviceMenuOpen(false);
  };
  
  // Set up animation
  useEffect(() => {
    drawWaveform();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, volume, selectedDevice]); // Added selectedDevice dependency
  
  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Device selector */}
      <div className="flex justify-between items-center mb-1.5">
        <Popover open={deviceMenuOpen} onOpenChange={setDeviceMenuOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs flex items-center justify-between gap-1 px-2 bg-black border border-border/30 hover:bg-[rgba(45,45,45,0.6)]"
            >
              <div className="flex items-center gap-1.5">
                {selectedDevice.icon}
                <span className="text-xs">{selectedDevice.name}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1 bg-black/90 border border-border/30">
            <div className="space-y-1">
              {devices.map((device) => (
                <Button
                  key={device.id}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start h-10 text-sm rounded-md ${
                    selectedDevice.id === device.id ? 'bg-[rgba(45,45,45,0.6)]' : ''
                  }`}
                  onClick={() => handleDeviceSelect(device)}
                >
                  <div className="flex items-center gap-2">
                    {device.icon}
                    <span className="text-[rgba(255,255,255,1)]">{device.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {isActive && (
          <div className="bg-destructive/90 text-white text-xs px-2 py-0.5 rounded-md animate-pulse-subtle">
            LIVE
          </div>
        )}
      </div>
      
      {/* Canvas container */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
