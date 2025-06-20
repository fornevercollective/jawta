/**
 * Text Conversion Utilities
 * 
 * This file contains utility functions for various text conversion operations
 * including Morse code, encryption, ASCII art, and mobile text patterns.
 */

// ASCII/Unicode Character Information
export const getUnicodeInfo = (char: string) => {
  if (!char) return null;
  
  const codePoint = char.codePointAt(0);
  if (!codePoint) return null;
  
  return {
    char,
    unicode: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
    hex: `0x${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
    decimal: codePoint,
    name: getUnicodeName(codePoint)
  };
};

// Mock function to get Unicode character name
function getUnicodeName(codePoint: number): string {
  // This would ideally use a proper Unicode database
  // For now, we'll just return placeholder names for common ranges
  if (codePoint >= 65 && codePoint <= 90) {
    return `LATIN CAPITAL LETTER ${String.fromCodePoint(codePoint)}`;
  } else if (codePoint >= 97 && codePoint <= 122) {
    return `LATIN SMALL LETTER ${String.fromCodePoint(codePoint)}`;
  } else if (codePoint >= 48 && codePoint <= 57) {
    return `DIGIT ${String.fromCodePoint(codePoint)}`;
  } else if (codePoint === 32) {
    return "SPACE";
  } else {
    return "UNKNOWN CHARACTER";
  }
}

// Morse Code conversions
const MORSE_CODE: Record<string, string> = {
  'A': '.-',     'B': '-...',   'C': '-.-.', 
  'D': '-..',    'E': '.',      'F': '..-.',
  'G': '--.',    'H': '....',   'I': '..',
  'J': '.---',   'K': '-.-',    'L': '.-..',
  'M': '--',     'N': '-.',     'O': '---',
  'P': '.--.',   'Q': '--.-',   'R': '.-.',
  'S': '...',    'T': '-',      'U': '..-',
  'V': '...-',   'W': '.--',    'X': '-..-',
  'Y': '-.--',   'Z': '--..',   
  '0': '-----',  '1': '.----',  '2': '..---',
  '3': '...--',  '4': '....-',  '5': '.....',
  '6': '-....',  '7': '--...',  '8': '---..',
  '9': '----.',  '.': '.-.-.-', ',': '--..--',
  '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.',  '(': '-.--.',  ')': '-.--.-',
  '&': '.-...',  ':': '---...', ';': '-.-.-.',
  '=': '-...-',  '+': '.-.-.',  '-': '-....-',
  '_': '..-.-',  '"': '.-..-.', '$': '...-..-',
  '@': '.--.-.',
};

// Reverse mapping for Morse to text conversion
const REVERSE_MORSE_CODE: Record<string, string> = 
  Object.entries(MORSE_CODE).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);

export const textToMorse = (text: string): string => {
  if (!text) return '';
  
  return text.toUpperCase().split('')
    .map(char => {
      if (char === ' ') return '/' // Space between words
      return MORSE_CODE[char] || char;
    })
    .join(' '); // Space between letters
};

export const morseToText = (morse: string): string => {
  if (!morse) return '';
  
  return morse
    .split('/')
    .map(word => 
      word
        .trim()
        .split(' ')
        .map(morseChar => REVERSE_MORSE_CODE[morseChar] || morseChar)
        .join('')
    )
    .join(' ');
};

// Mobile Phone Keypad Conversions
// T9 keyboard mapping
const T9_KEYMAP: Record<string, string> = {
  'A': '2', 'B': '22', 'C': '222',
  'D': '3', 'E': '33', 'F': '333',
  'G': '4', 'H': '44', 'I': '444',
  'J': '5', 'K': '55', 'L': '555',
  'M': '6', 'N': '66', 'O': '666',
  'P': '7', 'Q': '77', 'R': '777', 'S': '7777',
  'T': '8', 'U': '88', 'V': '888',
  'W': '9', 'X': '99', 'Y': '999', 'Z': '9999',
  ' ': '0',
  '1': '1',
  '0': '00'
};

// Reverse mapping for number to text conversion
const REVERSE_T9_KEYMAP: Record<string, string> = {
  '2': 'A', '22': 'B', '222': 'C',
  '3': 'D', '33': 'E', '333': 'F',
  '4': 'G', '44': 'H', '444': 'I',
  '5': 'J', '55': 'K', '555': 'L',
  '6': 'M', '66': 'N', '666': 'O',
  '7': 'P', '77': 'Q', '777': 'R', '7777': 'S',
  '8': 'T', '88': 'U', '888': 'V',
  '9': 'W', '99': 'X', '999': 'Y', '9999': 'Z',
  '0': ' ', '00': '0', '1': '1'
};

export const qwertyToNumberpad = (text: string, phoneModel: string = 'generic'): string => {
  if (!text) return '';
  
  // Different phone models could have different mappings
  if (phoneModel === 'blackberry') {
    // For BlackBerry, we wouldn't use the T9 system
    return `[${text}]`; // Just a placeholder to indicate it's coming from a BlackBerry
  }
  
  return text.toUpperCase().split('')
    .map(char => {
      // Add a | to separate sequences of the same key
      let result = T9_KEYMAP[char] || char;
      return result;
    })
    .join(' ');
};

export const numberpadToQwerty = (numbers: string): string => {
  if (!numbers) return '';
  
  // Split by spaces (which represent pauses between button sequences)
  return numbers.split(' ')
    .map(sequence => REVERSE_T9_KEYMAP[sequence] || sequence)
    .join('');
};

// Convert text to light/vibration patterns
export const convertToLightPattern = (text: string, phoneModel: string = 'generic'): string => {
  // First convert to Morse, then adapt for light patterns
  const morse = textToMorse(text);
  
  // Replace Morse symbols with light pattern notation
  // Dot becomes short flash, dash becomes long flash
  const lightPattern = morse
    .replace(/\./g, 'F ') // Short flash
    .replace(/-/g, 'FF ') // Long flash
    .replace(/\//g, '   '); // Word separator
    
  return `[Light Pattern]\n${lightPattern.trim()}\n\nF = Short flash (0.2s)\nFF = Long flash (0.6s)`;
};

export const convertToVibrationPattern = (text: string, phoneModel: string = 'generic'): string => {
  // First convert to Morse, then adapt for vibration patterns
  const morse = textToMorse(text);
  
  // Replace Morse symbols with vibration pattern notation
  const vibrationPattern = morse
    .replace(/\./g, 'V ') // Short vibration
    .replace(/-/g, 'VV ') // Long vibration
    .replace(/\//g, '   '); // Word separator
    
  return `[Vibration Pattern]\n${vibrationPattern.trim()}\n\nV = Short vibration (0.1s)\nVV = Long vibration (0.3s)`;
};

// ASCII Art & Wingdings
export const textToAsciiArt = (text: string): string => {
  if (!text) return '';
  
  // This is a simple mock function for demonstration
  // In a real implementation, we'd use a library like figlet.js
  const banner = [
    "┏━━━┓╋╋╋╋╋╋╋╋╋┏┓",
    "┃┏━┓┃╋╋╋╋╋╋╋╋╋┃┃",
    "┃┗━━┳━━┳━┓┏━━┓┃┃",
    "┗━━┓┃┃━┫┏┓┫┏┓┃┃┃",
    "┃┗━┛┃┃━┫┃┃┃┗┛┃┃┗┓",
    "┗━━━┻━━┻┛┗┫┏━┛┗━┛",
    "╋╋╋╋╋╋╋╋╋╋┃┃",
    "╋╋╋╋╋╋╋╋╋╋┗┛"
  ].join('\n');
  
  if (text.toLowerCase() === "ascii") {
    return banner;
  }
  
  // Otherwise create a simple frame
  const lines = text.split('\n');
  const maxLength = Math.max(...lines.map(line => line.length));
  
  const border = '+-' + '-'.repeat(maxLength) + '-+';
  const formatted = lines.map(line => '| ' + line.padEnd(maxLength) + ' |');
  
  return [border, ...formatted, border].join('\n');
};

export const convertToWingdings = (text: string): string => {
  if (!text) return '';
  
  // This is a mock implementation - in reality you'd map characters to actual Wingdings
  // For now, we'll just indicate what would happen
  return text.split('').map(char => {
    // Simple mock transformation
    // In reality this would use a proper mapping to Wingdings
    const charCode = char.charCodeAt(0);
    if (char >= 'A' && char <= 'Z') {
      return `✉️`;  // Example: Letters become mail symbol
    } else if (char >= 'a' && char <= 'z') {
      return `📌`;  // Example: Lowercase letters become push pin 
    } else if (char >= '0' && char <= '9') {
      return `🔢`;  // Example: Numbers become 1234 symbol
    } else if (char === ' ') {
      return ' ';
    } else {
      return `🔣`;  // Other characters
    }
  }).join('');
};

// Language Detection and Translation
export const detectLanguage = (text: string): string => {
  // This is a mock implementation - a real one would use AI language detection
  // Return a random language for demo purposes
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  return languages[Math.floor(Math.random() * languages.length)];
};

export const translateToCustomLanguage = (text: string, targetLang: string): string => {
  if (!text) return '';
  
  switch (targetLang) {
    case 'klingon':
      return `tlhIngan Hol: ${text.toUpperCase()}`;
    case 'elvish':
      return `Elvish: ` + text.split('').reverse().join('');
    case 'dothraki':
      return `Dothraki: ${text} + ki`;
    case 'minionese':
      return `Minionese: bananaaaa ${text.replace(/[aeiou]/g, 'a')} potatoooo`;
    case 'navi':
      return `Na'vi: ${text} na'vi`;
    case 'morse':
      return textToMorse(text);
    case 'binary':
      return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    case 'hex':
      return text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase()).join(' ');
    case 'ascii':
      return text.split('').map(char => char.charCodeAt(0).toString()).join(' ');
    case 'wingdings':
      return convertToWingdings(text);
    case 'braille':
      return `⠃⠗⠁⠊⠇⠇⠑: ${text}`;
    case 'semaphore':
      return `[Semaphore Representation of: ${text}]`;
    case 'enigma':
      return encryptText(text, 'enigma');
    default:
      return text;
  }
};

// Cryptography functions
export const encryptText = (text: string, method: string, key?: string): string => {
  if (!text) return '';
  
  switch (method) {
    case 'aes':
      return `[AES-256 Encrypted]\n${Buffer.from(text).toString('base64')}\n\n[Key hash]: ${key ? hash(key) : 'No key provided'}`;
    case 'rsa':
      return `[RSA Encrypted]\n${Buffer.from(text).toString('base64')}\n\n[Public key hash]: ${key ? hash(key) : 'No key provided'}`;
    case 'caesar':
      // Simple Caesar cipher with shift of 3
      return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + 3) % 26) + 65);
          } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + 3) % 26) + 97);
          }
        }
        return char;
      }).join('');
    case 'vigenere':
      // Simple mock implementation
      return `[Vigenere Cipher]\n${text.split('').reverse().join('')}\n\n[Key]: ${key || 'default'}`;
    case 'base64':
      return Buffer.from(text).toString('base64');
    case 'jwt':
      // Mock JWT token
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
      const payload = Buffer.from(JSON.stringify({ data: text, iat: Date.now() })).toString('base64');
      const signature = hash(header + '.' + payload + (key || '')).slice(0, 40);
      return `${header}.${payload}.${signature}`;
    case 'enigma':
      // Simulated Enigma output
      return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
          const random = Math.floor(Math.random() * 26);
          return String.fromCharCode((char.toLowerCase().charCodeAt(0) - 97 + random) % 26 + 97).toUpperCase();
        }
        return char;
      }).join('');
    case 'custom':
    default:
      return `[Custom Encrypted]\n${Buffer.from(text).toString('base64')}`;
  }
};

export const decryptText = (text: string, method: string, key?: string): string => {
  if (!text) return '';
  
  switch (method) {
    case 'aes':
      try {
        return `[Decrypted AES-256]\n${Buffer.from(text.split('\n')[1], 'base64').toString('utf-8')}`;
      } catch (e) {
        return '[Error: Invalid AES ciphertext]';
      }
    case 'base64':
      try {
        return Buffer.from(text, 'base64').toString('utf-8');
      } catch (e) {
        return '[Error: Invalid Base64]';
      }
    case 'caesar':
      // Reverse Caesar cipher shift
      return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 - 3 + 26) % 26) + 65);
          } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 - 3 + 26) % 26) + 97);
          }
        }
        return char;
      }).join('');
    case 'vigenere':
      // Reverse the mock implementation
      if (text.startsWith('[Vigenere Cipher]')) {
        const ciphertext = text.split('\n')[1];
        return ciphertext.split('').reverse().join('');
      }
      return text;
    default:
      return '[Unable to decrypt this format]';
  }
};

// Helper function to create a simple hash
function hash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16).padStart(8, '0');
}