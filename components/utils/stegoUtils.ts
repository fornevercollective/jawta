
// Steganography utilities for detecting and extracting hidden data

/**
 * Types for steganography analysis results
 */
export interface StegoAnalysisResult {
  suspiciousAreas?: {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }[];
  statisticalAnalysis?: {
    lsbEntropy: number;
    colorHistogram: number[];
    unusualPatterns: boolean;
    messageProbability: number;
  };
  extractedData?: {
    type: 'text' | 'binary' | 'unknown';
    data: string;
    size: number;
  };
  bitPlaneThumbnails?: ImageData[];
  anomalyHeatmap?: ImageData;
}

/**
 * Main function to analyze image for potential steganography
 * @param imageData Image data as ImageData
 * @returns Analysis results
 */
export function analyzeImageSteganography(imageData: ImageData): StegoAnalysisResult {
  const result: StegoAnalysisResult = {};
  
  // Generate bit plane thumbnails (decomposed channels by bit significance)
  result.bitPlaneThumbnails = generateBitPlanes(imageData);
  
  // Run statistical analysis
  result.statisticalAnalysis = analyzeImageStatistics(imageData);
  
  // Detect suspicious areas based on pixel analysis
  if (result.statisticalAnalysis.messageProbability > 0.5) {
    result.suspiciousAreas = detectSuspiciousAreas(imageData, result.statisticalAnalysis);
    result.anomalyHeatmap = generateAnomalyHeatmap(imageData);
  }
  
  // Attempt to extract data if high probability
  if (result.statisticalAnalysis.messageProbability > 0.7) {
    result.extractedData = attemptDataExtraction(imageData);
  }
  
  return result;
}

/**
 * Generate bit planes for the image
 * @param imageData Original image data
 * @returns Array of bit plane images
 */
function generateBitPlanes(imageData: ImageData): ImageData[] {
  const { width, height, data } = imageData;
  const bitPlanes: ImageData[] = [];
  
  // Create 8 bit planes (one for each bit position)
  for (let bit = 0; bit < 8; bit++) {
    const bitPlane = new ImageData(width, height);
    
    for (let i = 0; i < data.length; i += 4) {
      // Extract the bit at position 'bit' for R, G, and B channels
      const r = (data[i] >> bit) & 1;
      const g = (data[i + 1] >> bit) & 1;
      const b = (data[i + 2] >> bit) & 1;
      
      // Set the pixel in the bit plane (white if bit is 1, black if 0)
      bitPlane.data[i] = r ? 255 : 0;     // R
      bitPlane.data[i + 1] = g ? 255 : 0; // G
      bitPlane.data[i + 2] = b ? 255 : 0; // B
      bitPlane.data[i + 3] = 255;         // Alpha (always full opacity)
    }
    
    bitPlanes.push(bitPlane);
  }
  
  return bitPlanes;
}

/**
 * Analyze image statistics for steganography detection
 * @param imageData Original image data
 * @returns Statistical analysis
 */
function analyzeImageStatistics(imageData: ImageData): {
  lsbEntropy: number;
  colorHistogram: number[];
  unusualPatterns: boolean;
  messageProbability: number;
} {
  const { data } = imageData;
  
  // Calculate LSB (Least Significant Bit) entropy
  let lsbEntropy = 0;
  const lsbFrequency: Record<number, number> = { 0: 0, 1: 0 };
  
  // Count LSBs for each channel
  for (let i = 0; i < data.length; i += 4) {
    lsbFrequency[data[i] & 1]++;     // R
    lsbFrequency[data[i + 1] & 1]++; // G
    lsbFrequency[data[i + 2] & 1]++; // B
  }
  
  // Calculate entropy (randomness of LSBs)
  const totalPixels = data.length / 4 * 3; // 3 channels per pixel
  const prob0 = lsbFrequency[0] / totalPixels;
  const prob1 = lsbFrequency[1] / totalPixels;
  
  if (prob0 > 0) lsbEntropy -= prob0 * Math.log2(prob0);
  if (prob1 > 0) lsbEntropy -= prob1 * Math.log2(prob1);
  
  // Generate color histogram (simplified for analysis)
  const colorHistogram = new Array(16).fill(0); // 16 bins for color distribution
  
  for (let i = 0; i < data.length; i += 4) {
    // Simplified binning of colors
    const r = Math.floor(data[i] / 16);
    const g = Math.floor(data[i + 1] / 16);
    const b = Math.floor(data[i + 2] / 16);
    
    // Use just one channel for histogram (red)
    colorHistogram[r]++;
  }
  
  // Normalize histogram
  const maxCount = Math.max(...colorHistogram);
  for (let i = 0; i < colorHistogram.length; i++) {
    colorHistogram[i] = colorHistogram[i] / maxCount;
  }
  
  // Check for unusual patterns (e.g., too-perfect entropy is suspicious)
  // In natural images, LSB isn't perfectly random
  const unusualPatterns = Math.abs(lsbEntropy - 1.0) < 0.05; // Too close to perfect entropy
  
  // Calculate overall probability of hidden message
  // This is a heuristic based on entropy and unusualness
  let messageProbability = 0;
  
  if (unusualPatterns) {
    messageProbability += 0.5;
  }
  
  if (lsbEntropy > 0.9 && lsbEntropy < 0.99) {
    messageProbability += 0.3;
  }
  
  // Clamp to [0, 1] range
  messageProbability = Math.min(1, Math.max(0, messageProbability));
  
  return {
    lsbEntropy,
    colorHistogram,
    unusualPatterns,
    messageProbability
  };
}

/**
 * Detect suspicious areas in the image that may contain hidden data
 * @param imageData Original image data
 * @param stats Statistical analysis results
 * @returns Array of suspicious areas
 */
function detectSuspiciousAreas(imageData: ImageData, stats: any): { 
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  confidence: number; 
}[] {
  const { width, height, data } = imageData;
  const areas: { x: number; y: number; width: number; height: number; confidence: number; }[] = [];
  
  // Simplified detection - in a real app, this would use more advanced algorithms
  // We'll divide the image into blocks and analyze each
  const blockSize = 32;
  
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      // Calculate local entropy for this block
      let localLsbEntropy = 0;
      const lsbFrequency: Record<number, number> = { 0: 0, 1: 0 };
      
      // Bounds checking
      const blockWidth = Math.min(blockSize, width - x);
      const blockHeight = Math.min(blockSize, height - y);
      
      // Analyze this block
      for (let by = 0; by < blockHeight; by++) {
        for (let bx = 0; bx < blockWidth; bx++) {
          const pixelIndex = ((y + by) * width + (x + bx)) * 4;
          
          // Count LSBs
          lsbFrequency[data[pixelIndex] & 1]++;     // R
          lsbFrequency[data[pixelIndex + 1] & 1]++; // G
          lsbFrequency[data[pixelIndex + 2] & 1]++; // B
        }
      }
      
      // Calculate local entropy
      const totalBits = blockWidth * blockHeight * 3; // 3 channels per pixel
      const prob0 = lsbFrequency[0] / totalBits;
      const prob1 = lsbFrequency[1] / totalBits;
      
      if (prob0 > 0) localLsbEntropy -= prob0 * Math.log2(prob0);
      if (prob1 > 0) localLsbEntropy -= prob1 * Math.log2(prob1);
      
      // If entropy is high in this block, mark it as suspicious
      if (localLsbEntropy > 0.95) {
        // Calculate confidence based on how close to perfect entropy
        const confidence = 1 - Math.abs(1 - localLsbEntropy);
        
        areas.push({
          x,
          y,
          width: blockWidth,
          height: blockHeight,
          confidence
        });
      }
    }
  }
  
  return areas;
}

/**
 * Generate a heatmap showing anomaly likelihood
 * @param imageData Original image data
 * @returns Heatmap as ImageData
 */
function generateAnomalyHeatmap(imageData: ImageData): ImageData {
  const { width, height, data } = imageData;
  const heatmap = new ImageData(width, height);
  
  // Simple LSB visualization for demonstration
  // In a real app, this would use more advanced analysis
  for (let i = 0; i < data.length; i += 4) {
    // Get LSB randomness measure for this pixel
    const lsbR = data[i] & 1;
    const lsbG = data[i + 1] & 1;
    const lsbB = data[i + 2] & 1;
    
    // Calculate local anomaly score (higher when LSBs for the three channels differ)
    let anomalyScore = 0;
    if (lsbR !== lsbG) anomalyScore += 0.5;
    if (lsbR !== lsbB) anomalyScore += 0.5;
    if (lsbG !== lsbB) anomalyScore += 0.5;
    
    // Set pixel in heatmap
    // Red channel indicates anomaly (brighter = more suspicious)
    heatmap.data[i] = Math.min(255, anomalyScore * 255);
    heatmap.data[i + 1] = 0;
    heatmap.data[i + 2] = 0;
    heatmap.data[i + 3] = Math.min(200, anomalyScore * 255); // Semi-transparent overlay
  }
  
  return heatmap;
}

/**
 * Attempt to extract hidden data from the image
 * @param imageData Original image data
 * @returns Extracted data information
 */
function attemptDataExtraction(imageData: ImageData): {
  type: 'text' | 'binary' | 'unknown';
  data: string;
  size: number;
} {
  const { data } = imageData;
  let extractedBits = '';
  
  // Extract LSBs (simplified for demonstration)
  // In a real app, this would use proper steganographic extraction algorithms
  for (let i = 0; i < Math.min(data.length, 4000); i += 4) {
    extractedBits += data[i] & 1;     // R LSB
    extractedBits += data[i + 1] & 1; // G LSB
    extractedBits += data[i + 2] & 1; // B LSB
  }
  
  // Try to convert bits to text
  let extractedText = '';
  for (let i = 0; i < extractedBits.length; i += 8) {
    if (i + 8 <= extractedBits.length) {
      const byte = parseInt(extractedBits.substr(i, 8), 2);
      // Only add printable characters
      if (byte >= 32 && byte <= 126) {
        extractedText += String.fromCharCode(byte);
      }
    }
  }
  
  // Determine if the extracted data seems like text
  const textPattern = /^[\x20-\x7E]{8,}$/; // At least 8 consecutive printable ASCII chars
  const isText = textPattern.test(extractedText);
  
  return {
    type: isText ? 'text' : 'binary',
    data: isText ? extractedText : extractedBits.slice(0, 100) + '...',
    size: extractedBits.length / 8
  };
}

/**
 * Hide data in an image using LSB steganography
 * @param imageData Original image data
 * @param message Message to hide
 * @returns New image data with hidden message
 */
export function hideDataInImage(imageData: ImageData, message: string): ImageData {
  const { width, height, data } = imageData;
  const outputData = new ImageData(width, height);
  
  // Copy the original image
  for (let i = 0; i < data.length; i++) {
    outputData.data[i] = data[i];
  }
  
  // Convert message to binary
  let binaryMessage = '';
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    binaryMessage += charCode.toString(2).padStart(8, '0');
  }
  
  // Add end marker
  binaryMessage += '00000000'; // ASCII null terminator
  
  // Hide the binary data in the LSBs of the image
  let bitIndex = 0;
  
  // First 32 bits: message length as a header
  const lengthBinary = message.length.toString(2).padStart(32, '0');
  
  for (let i = 0; i < 32; i++) {
    const pixelIndex = i * 4;
    
    // Replace LSB with our bit
    outputData.data[pixelIndex] = (outputData.data[pixelIndex] & ~1) | parseInt(lengthBinary[i], 2);
  }
  
  // Now hide the actual message
  for (let i = 0; bitIndex < binaryMessage.length && i < outputData.data.length - 4; i += 4) {
    // Skip the first 32 pixels where we stored the length
    if (i < 32 * 4) continue;
    
    // Hide in RGB channels (skip Alpha)
    for (let c = 0; c < 3 && bitIndex < binaryMessage.length; c++, bitIndex++) {
      // Clear the LSB and then set it to the message bit
      outputData.data[i + c] = (outputData.data[i + c] & ~1) | parseInt(binaryMessage[bitIndex], 2);
    }
  }
  
  return outputData;
}

/**
 * Extract hidden data from an image (LSB steganography)
 * @param imageData Image with potential hidden data
 * @returns Extracted message
 */
export function extractDataFromImage(imageData: ImageData): string {
  const { data } = imageData;
  
  // First extract the 32-bit length header
  let lengthBinary = '';
  for (let i = 0; i < 32; i++) {
    const pixelIndex = i * 4;
    lengthBinary += data[pixelIndex] & 1; // Extract LSB
  }
  
  const messageLength = parseInt(lengthBinary, 2);
  
  // Sanity check
  if (messageLength <= 0 || messageLength > 10000) {
    return 'No valid message found';
  }
  
  // Extract the message bits
  let binaryMessage = '';
  let bitIndex = 0;
  const bitsNeeded = messageLength * 8;
  
  for (let i = 32 * 4; bitIndex < bitsNeeded && i < data.length - 4; i += 4) {
    // Extract from RGB channels (skip Alpha)
    for (let c = 0; c < 3 && bitIndex < bitsNeeded; c++, bitIndex++) {
      binaryMessage += data[i + c] & 1; // Extract LSB
    }
  }
  
  // Convert binary to text
  let message = '';
  for (let i = 0; i < binaryMessage.length; i += 8) {
    if (i + 8 <= binaryMessage.length) {
      const byte = parseInt(binaryMessage.substr(i, 8), 2);
      message += String.fromCharCode(byte);
    }
  }
  
  return message;
}
