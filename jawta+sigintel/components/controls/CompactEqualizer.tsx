
import React from 'react';
import { Slider } from '../ui/slider';
import { getFrequencyBandLabel } from '../utils/signalUtils';

interface CompactEqualizerProps {
  bands: number;
  values: number[];
  onChange: (index: number, value: number) => void;
  className?: string;
  displayCount?: number;
}

export function CompactEqualizer({
  bands,
  values,
  onChange,
  className,
  displayCount = 8,
}: CompactEqualizerProps) {
  // Select bands at regular intervals to display only a subset
  const displayBands = React.useMemo(() => {
    const selectedBands = [];
    const step = Math.max(1, Math.floor(bands / displayCount));
    
    for (let i = 0; i < bands; i += step) {
      if (selectedBands.length < displayCount) {
        selectedBands.push(i);
      }
    }
    
    return selectedBands;
  }, [bands, displayCount]);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayBands.map((bandIndex) => (
        <div key={bandIndex} className="flex flex-col w-12 px-1">
          <Slider
            orientation="vertical"
            min={0}
            max={1}
            step={0.01}
            value={[values[bandIndex]]}
            onValueChange={(newValues) => onChange(bandIndex, newValues[0])}
            className="h-20"
          />
          <div className="text-[10px] mt-1 text-center truncate">
            {getFrequencyBandLabel(bandIndex, bands)}
          </div>
        </div>
      ))}
    </div>
  );
}
