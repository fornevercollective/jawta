
// Metadata extraction and analysis utilities

/**
 * Type definitions for metadata
 */
export interface FileMetadata {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  lastModified?: Date;
  dimensions?: {
    width?: number;
    height?: number;
  };
  // Image specific
  exif?: ExifData;
  // Audio specific
  audio?: AudioMetadata;
  // Generic metadata
  headers?: Record<string, string>;
  rawMetadata?: Record<string, any>;
}

export interface ExifData {
  camera?: string;
  model?: string;
  dateTaken?: string;
  exposureTime?: string;
  fNumber?: number;
  iso?: number;
  focalLength?: string;
  gps?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
  };
}

export interface AudioMetadata {
  duration?: number;
  channels?: number;
  sampleRate?: number;
  bitRate?: number;
  codec?: string;
  artist?: string;
  album?: string;
  title?: string;
}

/**
 * Extract metadata from file
 * @param file File to extract metadata from
 * @returns Promise with metadata
 */
export async function extractFileMetadata(file: File): Promise<FileMetadata> {
  const metadata: FileMetadata = {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    lastModified: new Date(file.lastModified),
    headers: {}
  };
  
  // Process different file types
  if (file.type.startsWith('image/')) {
    return extractImageMetadata(file, metadata);
  }
  else if (file.type.startsWith('audio/')) {
    return extractAudioMetadata(file, metadata);
  }
  else if (file.type.startsWith('video/')) {
    return extractVideoMetadata(file, metadata);
  }
  else if (file.type === 'application/pdf') {
    return extractDocumentMetadata(file, metadata);
  }
  else {
    // Generic file type
    return metadata;
  }
}

/**
 * Extract metadata from an image file
 */
async function extractImageMetadata(file: File, metadata: FileMetadata): Promise<FileMetadata> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      // Set dimensions
      metadata.dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      
      // Simulate EXIF data extraction (in a real app, we'd use a library like exif-js)
      // This is a simplified simulation for demonstration purposes
      metadata.exif = simulateExifData(file);
      
      URL.revokeObjectURL(img.src); // Clean up
      resolve(metadata);
    };
    
    img.onerror = () => {
      // Failed to load image
      resolve(metadata);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Extract metadata from an audio file
 */
async function extractAudioMetadata(file: File, metadata: FileMetadata): Promise<FileMetadata> {
  return new Promise((resolve) => {
    const audio = new Audio();
    
    audio.onloadedmetadata = () => {
      metadata.audio = {
        duration: audio.duration,
        // In a real app, we'd extract more metadata using a library
        // This is simulated data for demonstration purposes
        channels: 2,
        sampleRate: 44100,
        bitRate: 128000,
        codec: guessCodecFromType(file.type),
        title: getFileNameWithoutExtension(file.name),
        artist: 'Unknown Artist',
        album: 'Unknown Album'
      };
      
      URL.revokeObjectURL(audio.src); // Clean up
      resolve(metadata);
    };
    
    audio.onerror = () => {
      // Failed to load audio
      resolve(metadata);
    };
    
    audio.src = URL.createObjectURL(file);
  });
}

/**
 * Extract metadata from a video file
 */
async function extractVideoMetadata(file: File, metadata: FileMetadata): Promise<FileMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      metadata.dimensions = {
        width: video.videoWidth,
        height: video.videoHeight
      };
      
      metadata.audio = {
        duration: video.duration,
        // Simulated audio data for the video
        channels: 2,
        sampleRate: 48000,
        bitRate: 192000,
        codec: guessCodecFromType(file.type)
      };
      
      URL.revokeObjectURL(video.src); // Clean up
      resolve(metadata);
    };
    
    video.onerror = () => {
      // Failed to load video
      resolve(metadata);
    };
    
    video.src = URL.createObjectURL(file);
  });
}

/**
 * Extract metadata from a document file (PDF)
 */
async function extractDocumentMetadata(file: File, metadata: FileMetadata): Promise<FileMetadata> {
  // In a real app, we'd use a library like pdf.js to extract metadata
  // For now, we'll just return basic metadata
  return metadata;
}

/**
 * Simulate EXIF data extraction (for demonstration purposes)
 */
function simulateExifData(file: File): ExifData {
  // Generate random but plausible EXIF data based on the file name
  // In a real app, we'd extract this from the actual image using exif-js
  const nameHash = hashString(file.name);
  
  const cameras = ['Canon EOS R6', 'Nikon Z6', 'Sony A7 III', 'Fujifilm X-T4', 'iPhone 14 Pro'];
  const camera = cameras[nameHash % cameras.length];
  
  const models = ['ILCE-7M3', 'X-T4', 'EOS R6', 'iPhone'];
  const model = models[(nameHash + 1) % models.length];
  
  // Create a plausible date in the past few years
  const now = new Date();
  const pastDate = new Date(
    now.getFullYear() - Math.floor(nameHash % 4), // 0-3 years ago
    Math.floor((nameHash * 7) % 12), // 0-11 months
    Math.floor((nameHash * 13) % 28) + 1, // 1-28 day
    Math.floor((nameHash * 17) % 24), // 0-23 hour
    Math.floor((nameHash * 19) % 60), // 0-59 minute
    Math.floor((nameHash * 23) % 60) // 0-59 second
  );
  
  return {
    camera: camera,
    model: model,
    dateTaken: pastDate.toISOString(),
    exposureTime: `1/${Math.floor(nameHash % 1000) + 60}`,
    fNumber: parseFloat(((nameHash % 28) / 10 + 1.4).toFixed(1)),
    iso: [100, 200, 400, 800, 1600, 3200][(nameHash + 2) % 6],
    focalLength: `${Math.floor(nameHash % 200) + 16}mm`,
    gps: {
      latitude: ((nameHash % 180) - 90) + Math.random(),
      longitude: ((nameHash * 2) % 360) - 180 + Math.random(),
      altitude: (nameHash % 1000) + Math.random() * 100
    }
  };
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Ensure positive
  return Math.abs(hash);
}

/**
 * Get file name without extension
 */
function getFileNameWithoutExtension(fileName: string): string {
  return fileName.split('.').slice(0, -1).join('.');
}

/**
 * Guess audio codec from MIME type
 */
function guessCodecFromType(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case 'audio/mpeg': return 'MP3';
    case 'audio/mp4': return 'AAC';
    case 'audio/ogg': return 'Vorbis';
    case 'audio/wav': return 'PCM';
    case 'audio/webm': return 'Opus';
    case 'audio/flac': return 'FLAC';
    case 'video/mp4': return 'H.264/AAC';
    case 'video/webm': return 'VP8/VP9';
    case 'video/ogg': return 'Theora/Vorbis';
    default: return 'Unknown';
  }
}

/**
 * Extract hex dump from file
 */
export async function extractHexDump(file: File, offset: number = 0, length: number = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || !event.target.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const buffer = event.target.result as ArrayBuffer;
      const view = new Uint8Array(buffer);
      let result = '';
      
      // Generate hex dump with address, hex values, and ASCII representation
      for (let i = offset; i < Math.min(offset + length, view.length); i += 16) {
        // Address
        result += `${i.toString(16).padStart(8, '0')}: `;
        
        // Hex values (up to 16 bytes per line)
        for (let j = 0; j < 16; j++) {
          if (i + j < view.length) {
            result += `${view[i + j].toString(16).padStart(2, '0')} `;
          } else {
            result += '   '; // Padding for incomplete lines
          }
          
          // Group bytes in sets of 8
          if (j === 7) {
            result += ' ';
          }
        }
        
        // ASCII representation
        result += ' |';
        for (let j = 0; j < 16; j++) {
          if (i + j < view.length) {
            const byte = view[i + j];
            // Display printable ASCII characters
            result += byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.';
          } else {
            result += ' ';
          }
        }
        result += '|\n';
      }
      
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read a slice of the file if needed
    const end = Math.min(offset + length, file.size);
    reader.readAsArrayBuffer(file.slice(offset, end));
  });
}

/**
 * Extract file signatures (magic numbers) for file format identification
 */
export async function identifyFileFormat(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || !event.target.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const buffer = event.target.result as ArrayBuffer;
      const view = new Uint8Array(buffer);
      
      // Check common file signatures
      if (view.length >= 2 && view[0] === 0xFF && view[1] === 0xD8) {
        resolve('JPEG image');
      }
      else if (view.length >= 8 && 
        view[0] === 0x89 && view[1] === 0x50 && view[2] === 0x4E && view[3] === 0x47 && 
        view[4] === 0x0D && view[5] === 0x0A && view[6] === 0x1A && view[7] === 0x0A) {
        resolve('PNG image');
      }
      else if (view.length >= 4 && 
        view[0] === 0x47 && view[1] === 0x49 && view[2] === 0x46 && view[3] === 0x38) {
        resolve('GIF image');
      }
      else if (view.length >= 4 && 
        (view[0] === 0x49 && view[1] === 0x44 && view[2] === 0x33) || 
        (view[0] === 0xFF && view[1] === 0xFB)) {
        resolve('MP3 audio');
      }
      else if (view.length >= 4 && 
        view[0] === 0x52 && view[1] === 0x49 && view[2] === 0x46 && view[3] === 0x46) {
        resolve('WAV or AVI');
      }
      else if (view.length >= 4 && 
        view[0] === 0x25 && view[1] === 0x50 && view[2] === 0x44 && view[3] === 0x46) {
        resolve('PDF document');
      }
      else if (view.length >= 4 && 
        view[0] === 0x50 && view[1] === 0x4B && view[2] === 0x03 && view[3] === 0x04) {
        resolve('ZIP archive or Office document');
      }
      else {
        resolve('Unknown format');
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read just the beginning of the file for signature
    reader.readAsArrayBuffer(file.slice(0, 16));
  });
}
