
// Audio signal processing utilities
export enum MonitoringType {
  AMBIENT = 'ambient',
  FREQUENCY_SCAN = 'frequency_scan',
  ULTRASONIC = 'ultrasonic',
  MORSE = 'morse',
  RADIOFAX = 'radiofax',
  SATELLITE = 'satellite'
}

// Frequency ranges for different monitoring types
export const monitoringRanges: Record<string, { min: number, max: number, sampleRate?: number }> = {
  [MonitoringType.AMBIENT]: { min: 20, max: 20000 },
  [MonitoringType.FREQUENCY_SCAN]: { min: 100, max: 10000 },
  [MonitoringType.ULTRASONIC]: { min: 18000, max: 22000 },
  [MonitoringType.MORSE]: { min: 500, max: 1500 },
  [MonitoringType.RADIOFAX]: { min: 1500, max: 2550, sampleRate: 11025 },
  [MonitoringType.SATELLITE]: { min: 137000, max: 138000, sampleRate: 48000 }
};

// Morse code map
const morseCodeMap: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

// Signal monitoring class
export class SignalMonitor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private updateIntervalId: NodeJS.Timeout | null = null;
  private dataCallback: ((data: { frequencyData: Uint8Array, waveformData: Float32Array }) => void) | null = null;

  // Start monitoring audio input
  async startMonitoring(type: MonitoringType, callback: (data: { frequencyData: Uint8Array, waveformData: Float32Array }) => void): Promise<boolean> {
    this.dataCallback = callback;

    try {
      // Initialize audio context if needed
      if (!this.audioContext) {
        this.audioContext = createAudioContext();
        if (!this.audioContext) {
          throw new Error('Web Audio API is not supported in this browser');
        }
      }

      // Request microphone access
      const constraints = { audio: true };
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Create audio source from microphone
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create analyzer
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;  // Large FFT for detailed frequency analysis
      
      // Higher FFT size for radiofax and satellite data
      if (type === MonitoringType.RADIOFAX || type === MonitoringType.SATELLITE) {
        this.analyser.fftSize = 4096;
      }
      
      // For Morse detection, we want more time resolution
      if (type === MonitoringType.MORSE) {
        this.analyser.smoothingTimeConstant = 0.5;
      } else {
        this.analyser.smoothingTimeConstant = 0.8;
      }
      
      // Connect the source to the analyzer
      this.source.connect(this.analyser);
      
      // Set up the update interval
      const updateInterval = type === MonitoringType.MORSE ? 50 : 30;
      this.updateIntervalId = setInterval(() => {
        this.updateData();
      }, updateInterval);

      return true;
    } catch (error) {
      console.error('Error starting audio monitoring:', error);
      this.stopMonitoring();
      return false;
    }
  }

  // Stop monitoring and clean up resources
  stopMonitoring() {
    // Clear the update interval
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
      this.updateIntervalId = null;
    }

    // Disconnect audio nodes
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    // Stop media stream tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      // Note: We don't close the AudioContext as it may be reused later
      // this.audioContext.close();
      // this.audioContext = null;
    }

    this.analyser = null;
    this.dataCallback = null;
  }

  // Update and process audio data
  private updateData() {
    if (!this.analyser || !this.dataCallback) return;

    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(frequencyData);

    const waveformData = new Float32Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatTimeDomainData(waveformData);

    this.dataCallback({ frequencyData, waveformData });
  }

  // For development and testing when no microphone is available
  simulateSignalData() {
    // Create simulated frequency data (32 bands)
    const frequencyData = new Uint8Array(32);
    for (let i = 0; i < frequencyData.length; i++) {
      // Generate a bell curve pattern with some randomness
      const mid = frequencyData.length / 2;
      const distance = Math.abs(i - mid);
      const baseValue = 200 * Math.exp(-(distance * distance) / (mid * mid / 2));
      frequencyData[i] = Math.min(255, Math.max(0, Math.floor(baseValue + Math.random() * 55)));
    }

    // Create simulated waveform data
    const waveformData = new Float32Array(512);
    for (let i = 0; i < waveformData.length; i++) {
      // Generate a sine wave with some noise
      waveformData[i] = Math.sin(i * 0.1) * 0.5 + (Math.random() * 0.1 - 0.05);
    }

    return { frequencyData, waveformData };
  }
  
  // Simulate radiofax reception
  simulateRadiofaxData() {
    // Create a simulated radiofax image (black and white horizontal lines)
    const width = 800;
    const height = 400;
    const imageData = new Uint8ClampedArray(width * height * 4);
    
    for (let y = 0; y < height; y++) {
      const intensity = Math.sin(y * 0.1) * 0.5 + 0.5; // creates vertical waves
      
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const noise = Math.random() * 0.1;
        const pattern = (x % 100 < 50) ? 0.8 : 0.2; // horizontal stripes
        const value = Math.floor(((intensity + pattern + noise) / 2) * 255);
        
        imageData[index] = value;     // R
        imageData[index + 1] = value; // G
        imageData[index + 2] = value; // B
        imageData[index + 3] = 255;   // A
      }
    }
    
    return { imageData, width, height };
  }
  
  // Simulate satellite data burst reception
  simulateSatelliteData() {
    // Generate simulated satellite telemetry data
    const packetCount = 5 + Math.floor(Math.random() * 5);
    const packets = [];
    
    const satelliteIds = [
      "NOAA-15", "NOAA-18", "NOAA-19", "METEOR-M N2", "ISS", 
      "GOES-16", "HIMAWARI-8", "METOP-B", "FENGYUN-3D"
    ];
    
    const dataTypes = [
      "APT", "HRPT", "LRPT", "HRIT", "TELEMETRY", "BEACON"
    ];
    
    // Generate random satellite data packets
    const selectedSatellite = satelliteIds[Math.floor(Math.random() * satelliteIds.length)];
    
    for (let i = 0; i < packetCount; i++) {
      const dataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
      const signalStrength = Math.floor(Math.random() * 100);
      const frequency = 137000 + Math.floor(Math.random() * 1000) / 1000;
      
      // Generate random hex data
      const dataLength = 8 + Math.floor(Math.random() * 24);
      let hexData = '';
      const hexChars = '0123456789ABCDEF';
      
      for (let j = 0; j < dataLength; j++) {
        hexData += hexChars[Math.floor(Math.random() * 16)];
        if (j % 2 === 1 && j < dataLength - 1) hexData += ' ';
      }
      
      packets.push({
        id: `PKT-${Date.now().toString(36)}-${i}`,
        satelliteId: selectedSatellite,
        timestamp: new Date().toISOString(),
        dataType,
        signalStrength,
        frequency: frequency.toFixed(3),
        data: hexData
      });
    }
    
    return {
      satellite: selectedSatellite,
      packetCount,
      packets,
      signal: {
        frequency: `${(137000 + Math.random()).toFixed(3)}MHz`,
        snr: `${(Math.random() * 12 + 8).toFixed(1)}dB`,
        elevation: `${Math.floor(Math.random() * 90)}°`,
        doppler: `${(Math.random() * 10 - 5).toFixed(2)}kHz` 
      }
    };
  }
}

// Convert text to audio data
export function textToAudioData(text: string, baseFrequency: number, duration: number): Float32Array {
  // Create an audio context for the conversion
  const audioContext = createAudioContext();
  if (!audioContext) return new Float32Array(0);

  // Determine sample rate
  const sampleRate = audioContext.sampleRate;
  
  // Calculate total samples based on duration
  const totalSamples = Math.floor(sampleRate * duration);
  
  // Create the audio buffer
  const audioData = new Float32Array(totalSamples);
  
  // Fill the buffer with a tone for each character
  let position = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Map character code to a frequency offset
    const freqOffset = (charCode - 32) / 95; // Map ASCII printable range (32-126) to 0-1
    const frequency = baseFrequency * (1 + freqOffset * 0.5);
    
    // Calculate samples for this character
    const charDuration = duration / text.length;
    const charSamples = Math.floor(sampleRate * charDuration);
    
    // Generate the tone
    for (let j = 0; j < charSamples && position < totalSamples; j++) {
      const t = j / sampleRate;
      // Add a slight envelope to avoid clicks
      const envelope = j < sampleRate * 0.01 ? j / (sampleRate * 0.01) :
                       j > charSamples - sampleRate * 0.01 ? (charSamples - j) / (sampleRate * 0.01) : 1;
      
      audioData[position] = Math.sin(2 * Math.PI * frequency * t) * 0.5 * envelope;
      position++;
    }
  }
  
  return audioData;
}

// Convert text to Morse code
export function textToMorse(text: string): string {
  // Convert text to uppercase for morse lookup
  const upperText = text.toUpperCase();
  
  // Convert each character to morse
  let morseOutput = '';
  
  for (let i = 0; i < upperText.length; i++) {
    const char = upperText[i];
    if (char === ' ') {
      // Word space (7 units - 3 letter spaces already, so add 4 more)
      morseOutput += '    ';
    } else if (morseCodeMap[char]) {
      // Add the morse code with a letter space
      morseOutput += morseCodeMap[char] + ' ';
    }
  }
  
  return morseOutput;
}

// Convert text to radiofax format
export function textToRadiofax(text: string, width: number = 800, height: number = 400): { 
  imageData: Uint8ClampedArray, 
  width: number, 
  height: number 
} {
  const imageData = new Uint8ClampedArray(width * height * 4);
  
  // Create a simple text rendering on the image
  const fontSize = Math.max(8, Math.min(32, width / text.length));
  const lineHeight = fontSize * 1.5;
  const maxLinesPerPage = Math.floor(height / lineHeight);
  
  // Calculate how many characters fit per line
  const charsPerLine = Math.floor(width / (fontSize * 0.6));
  
  // Split text into lines
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if (currentLine.length + word.length + 1 <= charsPerLine) {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Fill with white background
  for (let i = 0; i < imageData.length; i += 4) {
    imageData[i] = 255;     // R
    imageData[i + 1] = 255; // G
    imageData[i + 2] = 255; // B
    imageData[i + 3] = 255; // A
  }
  
  // Add header markers (sync lines)
  for (let x = 0; x < width; x++) {
    const pattern = x % 60;
    
    // Black sync line at the top
    for (let y = 0; y < 10; y++) {
      const index = (y * width + x) * 4;
      const value = pattern < 30 ? 0 : 255;
      
      imageData[index] = value;     // R
      imageData[index + 1] = value; // G
      imageData[index + 2] = value; // B
    }
    
    // Phasing lines for alignment
    for (let y = 15; y < 30; y++) {
      const index = (y * width + x) * 4;
      const value = x < width / 8 ? 0 : 255;
      
      imageData[index] = value;     // R
      imageData[index + 1] = value; // G
      imageData[index + 2] = value; // B
    }
  }
  
  // Draw text lines
  lines.forEach((line, lineIndex) => {
    if (lineIndex >= maxLinesPerPage) return;
    
    const yStart = 40 + lineIndex * lineHeight;
    
    // Simple text rendering - each character creates a block of pixels
    for (let i = 0; i < line.length; i++) {
      const charCode = line.charCodeAt(i);
      const xStart = 10 + i * fontSize * 0.6;
      
      if (xStart + fontSize > width) break;
      
      // Draw a simple letter pattern (just blocks for demonstration)
      for (let y = 0; y < fontSize; y++) {
        for (let x = 0; x < fontSize * 0.6; x++) {
          const value = charCode % 2 === 0 ? 
            // Even char codes get diagonal pattern
            ((x + y) % 5 === 0 ? 0 : 255) :
            // Odd char codes get a different pattern
            ((x * y) % 5 === 0 ? 0 : 255);
            
          const pixelY = yStart + y;
          const pixelX = Math.floor(xStart + x);
          
          if (pixelY < height && pixelX < width) {
            const index = (pixelY * width + pixelX) * 4;
            imageData[index] = value;     // R
            imageData[index + 1] = value; // G
            imageData[index + 2] = value; // B
          }
        }
      }
    }
  });
  
  // Add footer markers
  for (let x = 0; x < width; x++) {
    for (let y = height - 10; y < height; y++) {
      const index = (y * width + x) * 4;
      const value = (x + y) % 20 < 10 ? 0 : 255;
      
      imageData[index] = value;     // R
      imageData[index + 1] = value; // G
      imageData[index + 2] = value; // B
    }
  }
  
  return { imageData, width, height };
}

// Convert text to satellite data burst format
export function textToSatelliteData(text: string, satelliteType: string = "NOAA"): {
  packets: any[],
  metadata: any
} {
  // Generate synthetic satellite data burst containing the text
  const packets = [];
  const words = text.split(' ');
  
  // Generate packet header
  const satId = satelliteType === "NOAA" ? `NOAA-${Math.floor(Math.random() * 5) + 15}` : 
                satelliteType === "METEOR" ? "METEOR-M2" : 
                satelliteType === "GOES" ? "GOES-16" : "UNKNOWN-SAT";
  
  const packetTypes = ["TELEMETRY", "IMAGE", "APT", "HRPT", "LRPT"];
  const freq = (137.0 + Math.random()).toFixed(3);
  
  // Split text into packets
  const wordsPerPacket = 3;
  for (let i = 0; i < words.length; i += wordsPerPacket) {
    const packetWords = words.slice(i, i + wordsPerPacket);
    const packetText = packetWords.join(' ');
    
    // Convert to hex representation
    let hexData = '';
    for (let j = 0; j < packetText.length; j++) {
      const hexChar = packetText.charCodeAt(j).toString(16).toUpperCase();
      hexData += (hexChar.length === 1 ? '0' : '') + hexChar + ' ';
    }
    
    packets.push({
      id: `PKT-${Date.now().toString(36)}-${i}`,
      type: packetTypes[i % packetTypes.length],
      timestamp: new Date(Date.now() + i * 1000).toISOString(),
      signalStrength: 60 + Math.floor(Math.random() * 40),
      data: hexData.trim(),
      rawText: packetText
    });
  }
  
  // Generate metadata
  const metadata = {
    satellite: satId,
    frequency: `${freq} MHz`,
    modulation: satelliteType === "NOAA" ? "APT/HRPT" : 
                satelliteType === "METEOR" ? "LRPT" : "DIGITAL",
    orbit: "Polar-Orbiting",
    elevation: `${Math.floor(Math.random() * 90)}°`,
    azimuth: `${Math.floor(Math.random() * 360)}°`,
    snr: `${(Math.random() * 12 + 8).toFixed(1)} dB`,
    timestamp: new Date().toISOString()
  };
  
  return { packets, metadata };
}

// Analyze frequency bands in audio data
export function analyzeFrequencyBands(audioData: Float32Array, bands: number): number[] {
  if (!audioData || audioData.length === 0) {
    return Array(bands).fill(0);
  }

  // Simple spectral analysis
  const result = Array(bands).fill(0);
  const samplesPerBand = Math.floor(audioData.length / bands);
  
  for (let i = 0; i < bands; i++) {
    let bandSum = 0;
    const start = i * samplesPerBand;
    const end = Math.min(start + samplesPerBand, audioData.length);
    
    for (let j = start; j < end; j++) {
      bandSum += Math.abs(audioData[j]);
    }
    
    result[i] = bandSum / samplesPerBand;
  }
  
  // Normalize to 0-1 range
  const maxValue = Math.max(...result, 0.0001);
  return result.map(v => v / maxValue);
}

// Apply equalization to audio data
export function applyEqualization(audioData: Float32Array, eqValues: number[]): Float32Array {
  if (!audioData || audioData.length === 0 || !eqValues || eqValues.length === 0) {
    return audioData;
  }
  
  // Simple frequency domain equalization
  const result = new Float32Array(audioData.length);
  const bandsPerSample = eqValues.length / audioData.length;
  
  for (let i = 0; i < audioData.length; i++) {
    const bandIndex = Math.min(eqValues.length - 1, Math.floor(i * bandsPerSample));
    result[i] = audioData[i] * eqValues[bandIndex] * 2;
  }
  
  return result;
}

// Create an AudioContext
export function createAudioContext(): AudioContext | null {
  try {
    // Use the AudioContext or webkitAudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    
    return new AudioContextClass();
  } catch (error) {
    console.error('Failed to create AudioContext', error);
    return null;
  }
}

// Format frequency value with appropriate units (Hz, kHz, MHz)
export function formatFrequency(frequency: number): string {
  if (frequency >= 1_000_000) {
    return `${(frequency / 1_000_000).toFixed(1)}MHz`;
  } else if (frequency >= 1000) {
    return `${(frequency / 1000).toFixed(1)}kHz`;
  } else {
    return `${Math.round(frequency)}Hz`;
  }
}

// Generate a frequency band label for equalizer bands
export function getFrequencyBandLabel(index: number, totalBands: number): string {
  // For a standard audio equalizer, we use a logarithmic scale from 20Hz to 20kHz
  // This is a simplified version that creates labels across the audible spectrum
  
  // Minimum and maximum frequencies for human hearing
  const minFreq = 20;    // 20Hz
  const maxFreq = 20000; // 20kHz
  
  // Calculate frequency using logarithmic scale for better representation of how we hear
  // This gives more bands in the lower frequencies where our hearing is more sensitive
  const logMin = Math.log10(minFreq);
  const logMax = Math.log10(maxFreq);
  const logStep = (logMax - logMin) / (totalBands - 1);
  
  const frequency = Math.pow(10, logMin + index * logStep);
  
  return formatFrequency(frequency);
}
