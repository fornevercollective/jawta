
import React from "react";
import { Button } from "../ui/button";
import { Radio, Satellite, Smartphone, Wifi, RefreshCw, BarChart2 } from "lucide-react";

interface FrequencyControlsProps {
  frequency?: number;
  onFrequencyChange?: (newFreq: number) => void;
  min?: number;
  max?: number;
  activeBand?: string;
  onBandChange?: (band: string) => void;
  className?: string;
}

// Define band-specific neon gradients
const bandGradients = {
  VLF: "midi-pad-active-purple",
  LF: "midi-pad-active-blue",
  MF: "midi-pad-active-cyan",
  HF: "midi-pad-active-green",
  VHF: "midi-pad-active-orange",
  UHF: "midi-pad-active-pink",
  Satellite: "midi-pad-active-cyan",
  Optical: "midi-pad-active-blue"
};

export function FrequencyControls({
  frequency,
  onFrequencyChange,
  min,
  max,
  activeBand = "HF",
  onBandChange = () => {},
  className = ""
}: FrequencyControlsProps) {
  const bands = [
    { id: "VLF", name: "VLF", freq: "3-30 kHz" },
    { id: "LF", name: "LF", freq: "30-300 kHz" },
    { id: "MF", name: "MF", freq: "300-3000 kHz" },
    { id: "HF", name: "HF", freq: "3-30 MHz" },
    { id: "VHF", name: "VHF", freq: "30-300 MHz" },
    { id: "UHF", name: "UHF", freq: "300-3000 MHz" }
  ];
  
  return (
    <div className={className}>
      <div className="mb-3">
        <h4 className="text-sm font-medium">Frequency Band</h4>
      </div>
      
      {/* Grid layout with 3 columns for band buttons */}
      <div className="grid grid-cols-3 gap-2">
        {bands.map((band) => (
          <Button
            key={band.id}
            variant="outline"
            size="sm"
            className={`h-auto py-1.5 px-2 midi-pad transition-all duration-200 rounded-lg ${
              activeBand === band.id ? `${bandGradients[band.id as keyof typeof bandGradients]} shadow-lg` : ""
            }`}
            onClick={() => onBandChange(band.id)}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">{band.name}</span>
              <span className="text-[10px] text-muted-foreground">{band.freq}</span>
            </div>
          </Button>
        ))}
      </div>
      
      {/* Large buttons that span across multiple columns */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Button
          variant="outline"
          className={`h-auto py-2.5 midi-pad transition-all duration-200 rounded-lg ${
            activeBand === "Satellite" ? `${bandGradients["Satellite"]} shadow-lg` : ""
          }`}
          onClick={() => onBandChange("Satellite")}
        >
          <div className="flex flex-col items-center w-full">
            <Satellite className="h-4 w-4 mb-1" />
            <span className="font-medium">Satellite</span>
            <span className="text-[10px] text-muted-foreground">LEO/MEO/GEO</span>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className={`h-auto py-2.5 midi-pad transition-all duration-200 rounded-lg ${
            activeBand === "Optical" ? `${bandGradients["Optical"]} shadow-lg` : ""
          }`}
          onClick={() => onBandChange("Optical")}
        >
          <div className="flex flex-col items-center w-full">
            <Wifi className="h-4 w-4 mb-1" />
            <span className="font-medium">Optical</span>
            <span className="text-[10px] text-muted-foreground">Li-Fi/IR/Laser</span>
          </div>
        </Button>
      </div>
      
      {/* Full-width button that spans all columns */}
      <div className="mt-2">
        <Button
          variant="outline"
          className="w-full py-2 midi-pad transition-all duration-200 rounded-lg"
          onClick={() => onBandChange("Scan")}
        >
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Frequency Scan</span>
          </div>
        </Button>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground flex items-center">
        <span>Current:</span>
        <span className="font-medium ml-1 px-2 py-0.5 rounded-md bg-black/40 border border-border/20">{activeBand}</span>
        <span className="ml-1">Band</span>
      </div>
    </div>
  );
}
