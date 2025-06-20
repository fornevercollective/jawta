
// ASCII art generation utilities

// Characters arranged by density (light to dark)
const ASCII_CHARS_LIGHT_TO_DARK = " .,:;i1tfLCG08@";
const ASCII_CHARS_DETAILED = " .`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

/**
 * Convert an image to ASCII art
 * @param imageData Image data as Uint8ClampedArray
 * @param width Image width
 * @param height Image height
 * @param options Configuration options
 * @returns ASCII art string
 */
export function imageToAscii(
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  options: {
    charSet?: string;
    contrast?: number;
    brightness?: number;
    invert?: boolean;
    colorize?: boolean;
    width?: number;
    lineBreak?: string;
  } = {}
): { text: string; colors?: string[] } {
  // Default options
  const {
    charSet = ASCII_CHARS_LIGHT_TO_DARK,
    contrast = 1,
    brightness = 0,
    invert = false,
    colorize = false,
    width: outputWidth = width / 2,
    lineBreak = "\n"
  } = options;

  // Calculate character dimensions
  const ratio = width / height;
  const outputHeight = Math.round(outputWidth / ratio / 2); // Chars are taller than wide
  const blockWidth = Math.floor(width / outputWidth);
  const blockHeight = Math.floor(height / outputHeight);
  
  let result = "";
  const colors: string[] = [];
  
  // Process each block
  for (let y = 0; y < outputHeight; y++) {
    for (let x = 0; x < outputWidth; x++) {
      // Calculate the average brightness of this block
      let totalBrightness = 0;
      let totalPixels = 0;
      let r = 0, g = 0, b = 0;
      
      // Sample pixels in this block
      for (let blockY = 0; blockY < blockHeight; blockY++) {
        for (let blockX = 0; blockX < blockWidth; blockX++) {
          const pixelX = Math.min(x * blockWidth + blockX, width - 1);
          const pixelY = Math.min(y * blockHeight + blockY, height - 1);
          const idx = (pixelY * width + pixelX) * 4;
          
          // Get pixel color
          const pixelR = imageData[idx];
          const pixelG = imageData[idx + 1];
          const pixelB = imageData[idx + 2];
          
          // Calculate brightness (weighted RGB)
          const pixelBrightness = (pixelR * 0.299 + pixelG * 0.587 + pixelB * 0.114) / 255;
          totalBrightness += pixelBrightness;
          
          // If colorize, accumulate colors
          if (colorize) {
            r += pixelR;
            g += pixelG;
            b += pixelB;
          }
          
          totalPixels++;
        }
      }
      
      // Calculate average brightness of the block
      let avgBrightness = totalBrightness / totalPixels;
      
      // Apply contrast and brightness adjustments
      avgBrightness = Math.pow(avgBrightness, 1 / contrast);
      avgBrightness = Math.min(1, Math.max(0, avgBrightness + brightness));
      
      // Invert if needed
      if (invert) {
        avgBrightness = 1 - avgBrightness;
      }
      
      // Map brightness to character
      const charIndex = Math.floor(avgBrightness * (charSet.length - 1));
      const char = charSet[charIndex];
      result += char;
      
      // Add color if colorize is true
      if (colorize) {
        // Calculate average color
        const avgR = Math.round(r / totalPixels);
        const avgG = Math.round(g / totalPixels);
        const avgB = Math.round(b / totalPixels);
        colors.push(`rgb(${avgR}, ${avgG}, ${avgB})`);
      }
    }
    
    // Add line break
    if (y < outputHeight - 1) {
      result += lineBreak;
    }
  }
  
  return {
    text: result,
    ...(colorize && { colors }) // Only include colors if colorize is true
  };
}

/**
 * Convert text to ASCII art using banner style fonts
 * @param text Text to convert
 * @param style Font style
 * @returns ASCII art string
 */
export function textToAsciiArt(text: string, style: 'standard' | 'block' | 'slim' | 'outline' = 'standard'): string {
  // Simplified version with just a few styles
  const fonts: Record<string, Record<string, string[]>> = {
    standard: {
      A: [' AAA ', 'A   A', 'AAAAA', 'A   A', 'A   A'],
      B: ['BBBB ', 'B   B', 'BBBB ', 'B   B', 'BBBB '],
      C: [' CCCC', 'C    ', 'C    ', 'C    ', ' CCCC'],
      // ... more letters would be defined here
    },
    block: {
      A: ['███', '█ █', '███', '█ █', '█ █'],
      B: ['██ ', '█ █', '██ ', '█ █', '██ '],
      C: ['███', '█  ', '█  ', '█  ', '███'],
      // ... more block letters would be defined here
    },
    // ... other styles
  };
  
  // Default to standard if style doesn't exist
  const fontStyle = fonts[style] || fonts.standard;
  
  // Create the ASCII art
  const result: string[] = ['', '', '', '', ''];
  
  // For each character in the text
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    
    // If space, add spaces to all rows
    if (char === ' ') {
      for (let row = 0; row < 5; row++) {
        result[row] += '   ';
      }
      continue;
    }
    
    // If the character is in our font, add it to each row
    if (fontStyle[char]) {
      for (let row = 0; row < 5; row++) {
        result[row] += fontStyle[char][row] + ' ';
      }
    } else {
      // For characters not in our font, use a default
      for (let row = 0; row < 5; row++) {
        result[row] += '? ';
      }
    }
  }
  
  return result.join('\n');
}

/**
 * Generate basic ASCII art pattern
 * @param pattern Pattern type
 * @param width Width of pattern
 * @param height Height of pattern
 * @returns ASCII art string
 */
export function generateAsciiPattern(pattern: 'random' | 'gradient' | 'checkerboard' | 'wave', width = 40, height = 20): string {
  const chars = ASCII_CHARS_DETAILED;
  let result = '';
  
  switch (pattern) {
    case 'random':
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          result += chars[randomIndex];
        }
        result += '\n';
      }
      break;
      
    case 'gradient':
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Create a diagonal gradient
          const gradient = (x + y) / (width + height);
          const charIndex = Math.floor(gradient * (chars.length - 1));
          result += chars[charIndex];
        }
        result += '\n';
      }
      break;
      
    case 'checkerboard':
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Simple checkerboard pattern
          result += (x + y) % 2 === 0 ? '█' : ' ';
        }
        result += '\n';
      }
      break;
      
    case 'wave':
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Create a sine wave pattern
          const wave = Math.sin((x / width) * Math.PI * 4 + (y / height) * Math.PI * 2);
          const normalizedWave = (wave + 1) / 2; // Convert from [-1, 1] to [0, 1]
          const charIndex = Math.floor(normalizedWave * (chars.length - 1));
          result += chars[charIndex];
        }
        result += '\n';
      }
      break;
  }
  
  return result;
}

/**
 * Apply effects to ASCII art
 * @param asciiArt ASCII art string
 * @param effect Effect to apply
 * @returns Modified ASCII art string
 */
export function applyAsciiEffect(asciiArt: string, effect: 'flip-horizontal' | 'flip-vertical' | 'rotate' | 'invert'): string {
  const lines = asciiArt.split('\n');
  const height = lines.length;
  const width = lines[0].length;
  
  switch (effect) {
    case 'flip-horizontal':
      return lines.map(line => [...line].reverse().join('')).join('\n');
      
    case 'flip-vertical':
      return [...lines].reverse().join('\n');
      
    case 'rotate':
      // Rotate 90 degrees clockwise
      const rotated: string[] = [];
      for (let x = 0; x < width; x++) {
        let newLine = '';
        for (let y = height - 1; y >= 0; y--) {
          newLine += lines[y][x] || ' ';
        }
        rotated.push(newLine);
      }
      return rotated.join('\n');
      
    case 'invert':
      // Simple character inversion
      const invertMap: Record<string, string> = {
        ' ': '█', '.': '@', ':': '8', '-': '#', '+': '%',
        '=': '&', '?': '$', '*': 'W', '#': '.', '@': ' ',
        '█': ' '
      };
      
      return lines.map(line => 
        [...line].map(char => invertMap[char] || char).join('')
      ).join('\n');
      
    default:
      return asciiArt;
  }
}
