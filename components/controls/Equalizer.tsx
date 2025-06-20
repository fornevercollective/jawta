
import React from 'react';
import { Slider } from '../ui/slider';
import { getFrequencyBandLabel } from '../utils/signalUtils';

interface EqualizerProps {
  bands: number;
  values: number[];
  onChange: (index: number, value: number) => void;
  className?: string;
}

export function Equalizer({
  bands,
  values,
  onChange,
  className,
}: EqualizerProps) {
  return (
    <div className={`flex flex-col space-y-8 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex flex-col w-16">
            <Slider
              orientation="horizontal"
              min={0}
              max={1}
              step={0.01}
              value={[value]}
              onValueChange={(newValues) => onChange(index, newValues[0])}
              className="w-full mb-2"
            />
            <div className="text-xs text-center">
              {getFrequencyBandLabel(index, bands)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
