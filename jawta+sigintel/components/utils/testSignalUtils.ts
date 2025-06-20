
/**
 * Test Signal Generator Utility
 * Provides functions to generate various test signals for spectrum analyzers and waveform displays
 */

// Generate a sine sweep from low to high frequency
export function generateSineSweep(duration: number = 2, minFreq: number = 20, maxFreq: number = 20000, sampleRate: number = 44100): Float32Array {
  const numSamples = Math.floor(sampleRate * duration);
  const data = new Float32Array(numSamples);
  
  // Calculate sweep parameters (exponential sweep)
  const k = Math.pow(maxFreq / minFreq, 1 / duration);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Exponential frequency sweep formula
    const instantFreq = minFreq * Math.pow(k, t);
    // Phase integral to get sine argument
    const phase = 2 * Math.PI * minFreq * (Math.pow(k, t) - 1) / Math.log(k);
    
    data[i] = 0.8 * Math.sin(phase);
  }
  
  return data;
}

// Generate a 1kHz test tone
export function generateTestTone(frequency: number = 1000, duration: number = 2, sampleRate: number = 44100): Float32Array {
  const numSamples = Math.floor(sampleRate * duration);
  const data = new Float32Array(numSamples);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    data[i] = 0.8 * Math.sin(2 * Math.PI * frequency * t);
  }
  
  return data;
}

// Generate a white noise signal
export function generateWhiteNoise(duration: number = 2, sampleRate: number = 44100): Float32Array {
  const numSamples = Math.floor(sampleRate * duration);
  const data = new Float32Array(numSamples);
  
  for (let i = 0; i < numSamples; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5; // Range: -0.5 to 0.5
  }
  
  return data;
}

// Generate a pulse train (square wave)
export function generatePulseTrain(frequency: number = 1, duration: number = 2, sampleRate: number = 44100): Float32Array {
  const numSamples = Math.floor(sampleRate * duration);
  const data = new Float32Array(numSamples);
  
  const samplesPerCycle = Math.floor(sampleRate / frequency);
  
  for (let i = 0; i < numSamples; i++) {
    const cyclePosition = i % samplesPerCycle;
    data[i] = cyclePosition < samplesPerCycle / 2 ? 0.8 : -0.8;
  }
  
  return data;
}

// Generate an impulse (single spike) for impulse response testing
export function generateImpulse(duration: number = 2, sampleRate: number = 44100): Float32Array {
  const numSamples = Math.floor(sampleRate * duration);
  const data = new Float32Array(numSamples);
  
  // Place impulse near the beginning
  const impulsePosition = Math.floor(sampleRate * 0.1);
  if (impulsePosition < numSamples) {
    data[impulsePosition] = 1.0;
  }
  
  return data;
}

// Generate test patterns for different frequency modes
export function generateTestPattern(mode: "audible" | "ultrasonic" | "optical", type: string = "tone"): Float32Array {
  let data: Float32Array;
  
  switch (mode) {
    case "ultrasonic":
      // Generate high frequency patterns
      if (type === "sweep") {
        return generateSineSweep(2, 15000, 22000);
      } else {
        return generateTestTone(20000);
      }
    
    case "optical":
      // For optical mode, generate patterns that represent optical frequencies
      // (Note: these are simulations, not actual optical frequencies)
      if (type === "sweep") {
        // Create a pulsed pattern
        const baseSweep = generateSineSweep(2, 1000, 20000);
        
        // Add modulation to simulate optical pulses
        return baseSweep.map(val => val * Math.sin(val * 100) * 0.8);
      } else {
        // Generate a complex waveform with multiple harmonics to simulate optical carrier
        const baseData = generateTestTone(10000);
        for (let i = 0; i < baseData.length; i++) {
          // Add harmonics and modulation 
          baseData[i] = (baseData[i] + 0.3 * Math.sin(i * 0.1) + 0.2 * Math.cos(i * 0.05)) * 0.6;
        }
        return baseData;
      }
    
    case "audible":
    default:
      // Standard audible test patterns
      if (type === "sweep") {
        return generateSineSweep();
      } else if (type === "noise") {
        return generateWhiteNoise();
      } else if (type === "pulse") {
        return generatePulseTrain(2); // 2Hz pulse train
      } else {
        // Default tone
        return generateTestTone(1000);
      }
  }
}

// Generate spectrum analyzer data for test display
export function generateSpectrumData(mode: "audible" | "ultrasonic" | "optical", pattern: string = "normal"): Uint8Array {
  // Create synthetic spectrum data (typically 32 - 128 bands)
  const bands = 32;
  const data = new Uint8Array(bands);
  
  switch (pattern) {
    case "sweep": {
      // Create a moving peak across the spectrum
      const peakPosition = (Date.now() % 3000) / 3000; // 0 to 1, moving over time
      const peakIndex = Math.floor(peakPosition * bands);
      
      for (let i = 0; i < bands; i++) {
        const distance = Math.abs(i - peakIndex);
        const value = Math.max(0, 255 - (distance * distance * 1.5));
        data[i] = value;
      }
      break;
    }
    
    case "flat": {
      // Create a flat response with slight variations
      for (let i = 0; i < bands; i++) {
        data[i] = 180 + Math.random() * 40;
      }
      break;
    }
    
    case "lowpass": {
      // Create a low pass filter response
      for (let i = 0; i < bands; i++) {
        const normalizedFreq = i / bands;
        data[i] = 255 * Math.pow(Math.max(0, 1 - normalizedFreq * 2), 2) + Math.random() * 20;
      }
      break;
    }
    
    case "highpass": {
      // Create a high pass filter response
      for (let i = 0; i < bands; i++) {
        const normalizedFreq = i / bands;
        data[i] = 255 * Math.pow(Math.min(1, normalizedFreq * 2), 2) + Math.random() * 20;
      }
      break;
    }
    
    case "bandpass": {
      // Create a band pass filter response
      const centerBand = bands / 2;
      for (let i = 0; i < bands; i++) {
        const distance = Math.abs(i - centerBand) / (bands / 4);
        data[i] = 255 * Math.pow(Math.max(0, 1 - distance), 2) + Math.random() * 20;
      }
      break;
    }
    
    case "noise": {
      // Random noise pattern
      for (let i = 0; i < bands; i++) {
        data[i] = Math.random() * 255;
      }
      break;
    }
    
    case "normal":
    default: {
      // Create a realistic audio spectrum with more energy in low frequencies
      for (let i = 0; i < bands; i++) {
        // Higher values for lower frequencies (left side) with falloff
        const normalizedFreq = i / bands;
        let value;
        
        if (mode === "ultrasonic") {
          // For ultrasonic, more energy in higher frequencies
          value = 100 + (normalizedFreq * 155) + (Math.random() * 20);
        } else if (mode === "optical") {
          // For optical, peaks at specific frequencies (WDM channels)
          const peaks = [0.1, 0.3, 0.5, 0.7, 0.9];
          let peakValue = 0;
          
          for (const peak of peaks) {
            const distance = Math.abs(normalizedFreq - peak);
            if (distance < 0.05) {
              peakValue = Math.max(peakValue, (1 - distance * 20) * 255);
            }
          }
          
          value = peakValue + (Math.random() * 30);
        } else {
          // Standard audio spectrum falloff
          value = 255 * Math.pow(Math.max(0.1, 1 - normalizedFreq), 1.5) + (Math.random() * 40);
        }
        
        data[i] = Math.min(255, Math.max(0, value));
      }
    }
  }
  
  return data;
}
