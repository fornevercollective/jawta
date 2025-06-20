
import React from "react";
import { Slider } from "../ui/slider";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "../ui/button";

interface VolumeControlProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function VolumeControl({
  value,
  onChange,
  className = ""
}: VolumeControlProps) {
  // Handle volume icon based on level
  const renderVolumeIcon = () => {
    if (value === 0) return <VolumeX className="h-4 w-4" />;
    if (value < 33) return <Volume className="h-4 w-4" />;
    if (value < 67) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };
  
  // Quick volume presets
  const setVolume = (level: number) => {
    onChange(level);
  };
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Volume</label>
        <span className="px-2 py-0.5 rounded-md bg-black/40 border border-border/20 text-xs">{value}%</span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onChange(0)} 
          className={`midi-pad p-1 h-7 w-7 rounded-md ${value === 0 ? 'midi-pad-active-red' : ''}`}
        >
          <VolumeX className="h-3.5 w-3.5" />
        </Button>
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={(vals) => onChange(vals[0])}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onChange(100)} 
          className={`midi-pad p-1 h-7 w-7 rounded-md ${value === 100 ? 'midi-pad-active-green' : ''}`}
        >
          <Volume2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="flex justify-between gap-1">
        <Button 
          variant="outline" 
          size="sm"
          className="midi-pad rounded-md h-7 text-xs flex-1"
          onClick={() => setVolume(25)} 
        >
          25%
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="midi-pad rounded-md h-7 text-xs flex-1"
          onClick={() => setVolume(50)} 
        >
          50%
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="midi-pad rounded-md h-7 text-xs flex-1"
          onClick={() => setVolume(75)} 
        >
          75%
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="midi-pad rounded-md h-7 text-xs flex-1"
          onClick={() => setVolume(100)} 
        >
          100%
        </Button>
      </div>
    </div>
  );
}
