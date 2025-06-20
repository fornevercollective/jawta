import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SpectrumAnalyzer } from './SpectrumAnalyzer';

interface SpectrumAnalyzerContainerProps {
  isActive?: boolean;
  className?: string;
  simplified?: boolean; // New prop for simplified view in multi-grid layout
  frequency?: number;
}

export function SpectrumAnalyzerContainer({ 
  isActive = false, 
  className = '',
  simplified = false,
  frequency = 145.5
}: SpectrumAnalyzerContainerProps) {
  const [data, setData] = useState<number[]>([]);
  const [peaks, setPeaks] = useState<{ freq: number, power: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate spectrum analysis data
  const generateData = () => {
    // Generate data points for the spectrum analyzer display
    const numPoints = simplified ? 128 : 256;
    const newData: number[] = [];
    
    // Create a baseline with some noise
    for (let i = 0; i < numPoints; i++) {
      // Base noise level
      let value = Math.random() * 10 + 5;
      
      // Add some randomness
      if (Math.random() > 0.7) {
        value += Math.random() * 15;
      }
      
      newData.push(value);
    }
    
    // Add signal peaks
    const peakCount = Math.floor(Math.random() * 3) + 1; // 1-3 peaks
    const newPeaks: { freq: number; power: number }[] = [];
    
    for (let i = 0; i < peakCount; i++) {
      // Generate a peak position
      const peakIndex = Math.floor(Math.random() * (numPoints - 30)) + 15;
      const peakMagnitude = 70 + Math.random() * 30; // Peak height
      const peakWidth = Math.floor(Math.random() * 5) + 3; // Peak width
      
      // Calculate the frequency this represents
      const freqStart = frequency - 10;
      const freqEnd = frequency + 10;
      const peakFreq = freqStart + (peakIndex / numPoints) * (freqEnd - freqStart);
      
      // Add to peaks list
      newPeaks.push({
        freq: parseFloat(peakFreq.toFixed(3)),
        power: Math.floor(peakMagnitude)
      });
      
      // Create the peak in the data
      for (let j = -peakWidth; j <= peakWidth; j++) {
        const idx = peakIndex + j;
        if (idx >= 0 && idx < numPoints) {
          const distance = Math.abs(j);
          const dropoff = 1 - (distance / peakWidth);
          newData[idx] += peakMagnitude * dropoff * dropoff;
        }
      }
    }
    
    // Add a specific peak around the tuned frequency if we're not in simplified mode
    if (!simplified) {
      const centerIndex = Math.floor(numPoints / 2);
      const tunedPeakMagnitude = 85 + Math.random() * 15; // Stronger peak
      
      // Add to peaks list
      newPeaks.push({
        freq: frequency,
        power: Math.floor(tunedPeakMagnitude)
      });
      
      // Create the peak in the data
      for (let j = -5; j <= 5; j++) {
        const idx = centerIndex + j;
        if (idx >= 0 && idx < numPoints) {
          const distance = Math.abs(j);
          const dropoff = 1 - (distance / 5);
          newData[idx] += tunedPeakMagnitude * dropoff * dropoff;
        }
      }
    }
    
    setData(newData);
    setPeaks(newPeaks);
  };
  
  // Setup the animation interval
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Only set up the interval if the component is active
    if (isActive) {
      // Initial data generation
      generateData();
      
      // Set up the interval for updating the data
      intervalRef.current = setInterval(() => {
        generateData();
      }, simplified ? 2000 : 1000); // Update less frequently in simplified mode
    } else {
      // If not active, generate a static display
      generateData();
    }
    
    // Clean up the interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, simplified]);
  
  // Memoize the SpectrumAnalyzer component to reduce unnecessary re-renders
  const memoizedSpectrumAnalyzer = useMemo(() => {
    return (
      <SpectrumAnalyzer 
        data={data} 
        isActive={isActive} 
        className={className}
        showLabels={!simplified}
        showPeaks={!simplified}
        peaks={peaks}
        simplified={simplified}
      />
    );
  }, [data, isActive, className, simplified, peaks]);
  
  return memoizedSpectrumAnalyzer;
}