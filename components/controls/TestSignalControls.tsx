
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Play, Pause, Activity } from "lucide-react";

interface TestSignalControlsProps {
  isTransmitting?: boolean;
  onTransmissionChange?: (isTransmitting: boolean) => void;
  className?: string;
}

// Define signal-specific gradients
const signalGradients = {
  sine: "midi-pad-active-cyan",
  square: "midi-pad-active-blue",
  saw: "midi-pad-active-green",
  noise: "midi-pad-active-purple",
  pulse: "midi-pad-active-orange"
};

export function TestSignalControls({
  isTransmitting = false,
  onTransmissionChange = () => {},
  className = ""
}: TestSignalControlsProps) {
  const [selectedSignal, setSelectedSignal] = useState<string>("sine");
  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  
  const signals = [
    { id: "sine", name: "Sine Wave" },
    { id: "square", name: "Square Wave" },
    { id: "saw", name: "Sawtooth" },
    { id: "noise", name: "White Noise" },
    { id: "pulse", name: "Pulse" }
  ];
  
  // Handle signal selection with animation effect
  const handleSignalSelect = (signalId: string) => {
    setSelectedSignal(signalId);
    setActiveSignal(signalId);
    
    // Reset active state after animation completes
    setTimeout(() => {
      setActiveSignal(null);
    }, 300);
  };
  
  return (
    <div className={`${className}`}>
      <div className="mb-3">
        <h4 className="text-sm font-medium">Test Signals</h4>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {signals.map((signal) => (
          <Button
            key={signal.id}
            variant="outline"
            size="sm"
            className={`midi-pad rounded-lg transition-all duration-200 ${
              selectedSignal === signal.id && !activeSignal ? "bg-[rgba(45,45,45,0.6)] border-border/50" : ""
            } ${
              activeSignal === signal.id ? `${signalGradients[signal.id as keyof typeof signalGradients]} midi-activate` : ""
            }`}
            onClick={() => handleSignalSelect(signal.id)}
          >
            {signal.name}
          </Button>
        ))}
      </div>
      
      <Button
        variant={isTransmitting ? "destructive" : "default"}
        className="w-full rounded-lg midi-pad transition-all duration-200"
        onClick={() => onTransmissionChange(!isTransmitting)}
      >
        <div className="flex items-center gap-2">
          {isTransmitting ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Stop Transmission</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Start Transmission</span>
            </>
          )}
        </div>
      </Button>
    </div>
  );
}
