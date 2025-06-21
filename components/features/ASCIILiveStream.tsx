import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Monitor, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Download, 
  Upload,
  Zap,
  Eye,
  EyeOff,
  Maximize,
  Minimize
} from "lucide-react";
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';

interface ASCIILiveStreamProps {
  className?: string;
  onStreamData?: (data: string) => void;
  repositoryUrl?: string;
}

export function ASCIILiveStream({ className = "", onStreamData, repositoryUrl }: ASCIILiveStreamProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [frameRate, setFrameRate] = useState(10);
  const [compressionLevel, setCompressionLevel] = useState(80);
  const [asciiWidth, setAsciiWidth] = useState(80);
  const [asciiHeight, setAsciiHeight] = useState(24);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [bytesTransmitted, setBytesTransmitted] = useState(0);
  const [streamData, setStreamData] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ASCII characters for conversion (from dark to light)
  const ASCII_CHARS = ' .:-=+*#%@';

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setConnectionStatus('disconnected');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setConnectionStatus('disconnected');
  };

  const convertToASCII = useCallback((imageData: ImageData) => {
    const { data, width, height } = imageData;
    let ascii = '';
    
    const stepX = Math.floor(width / asciiWidth);
    const stepY = Math.floor(height / asciiHeight);
    
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const pixelIndex = (y * width + x) * 4;
        const r = data[pixelIndex];
        const g = data[pixelIndex + 1];
        const b = data[pixelIndex + 2];
        
        // Convert to grayscale
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
        // Map to ASCII character
        const charIndex = Math.floor((gray / 255) * (ASCII_CHARS.length - 1));
        ascii += ASCII_CHARS[charIndex];
      }
      ascii += '\n';
    }
    
    return ascii;
  }, [asciiWidth, asciiHeight]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Convert to ASCII
    const asciiFrame = convertToASCII(imageData);
    
    // Compress based on compression level
    const compressed = compressASCII(asciiFrame);
    
    // Update stream data
    setStreamData(prev => {
      const newData = [...prev, compressed];
      // Keep only last 50 frames
      return newData.slice(-50);
    });
    
    // Update bytes transmitted
    setBytesTransmitted(prev => prev + compressed.length);
    
    // Send to callback if provided
    if (onStreamData) {
      onStreamData(compressed);
    }
    
    // Send to repository if streaming
    if (isStreaming && repositoryUrl) {
      sendToRepository(compressed);
    }
    
  }, [convertToASCII, compressionLevel, onStreamData, isStreaming, repositoryUrl]);

  const compressASCII = (ascii: string): string => {
    // Simple compression: remove duplicate spaces and apply RLE for repeated characters
    if (compressionLevel < 50) return ascii;
    
    let compressed = ascii;
    
    // Remove excessive spaces
    if (compressionLevel > 70) {
      compressed = compressed.replace(/ {3,}/g, '  ');
    }
    
    // Simple run-length encoding for high compression
    if (compressionLevel > 90) {
      compressed = compressed.replace(/(.)\1{2,}/g, (match, char) => {
        return `${char}${match.length}`;
      });
    }
    
    return compressed;
  };

  const sendToRepository = async (data: string) => {
    try {
      // Simulate sending to repository
      console.log('Sending to repository:', repositoryUrl, data.length, 'bytes');
      
      // In a real implementation, this would be:
      // await fetch(repositoryUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'text/plain' },
      //   body: data
      // });
      
    } catch (error) {
      console.error('Error sending to repository:', error);
    }
  };

  const startStreaming = async () => {
    setConnectionStatus('connecting');
    await startCamera();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(captureFrame, 1000 / frameRate);
    setIsStreaming(true);
  };

  const stopStreaming = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    stopCamera();
    setIsStreaming(false);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const downloadStream = () => {
    const dataStr = streamData.join('\n---FRAME---\n');
    const dataBlob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ascii-stream-${Date.now()}.txt`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      default: return 'Disconnected';
    }
  };

  return (
    <Card className={`p-6 bg-black/90 border-white/10 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-6 w-6 text-cyan-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">ASCII Live Stream</h3>
              <p className="text-sm text-gray-400">Real-time camera to ASCII conversion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                ● REC
              </Badge>
            )}
          </div>
        </div>

        {/* Video and Canvas (hidden) */}
        <div className="hidden">
          <video ref={videoRef} autoPlay muted />
          <canvas ref={canvasRef} />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stream Controls */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Stream Controls</h4>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={isStreaming ? stopStreaming : startStreaming}
                variant={isStreaming ? "destructive" : "default"}
                size="sm"
                className="flex-1"
              >
                {isStreaming ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Stream
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Stream
                  </>
                )}
              </Button>
              
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                disabled={!isStreaming}
              >
                {isRecording ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                onClick={downloadStream}
                variant="outline"
                size="sm"
                disabled={streamData.length === 0}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Repository URL */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Repository URL</label>
              <Input 
                placeholder="https://api.github.com/repos/user/repo/contents/stream.txt"
                defaultValue={repositoryUrl}
                className="text-sm"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Settings</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400">Frame Rate: {frameRate} FPS</label>
                <Slider
                  value={[frameRate]}
                  onValueChange={(value) => setFrameRate(value[0])}
                  max={30}
                  min={1}
                  step={1}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Compression: {compressionLevel}%</label>
                <Slider
                  value={[compressionLevel]}
                  onValueChange={(value) => setCompressionLevel(value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Width</label>
                  <Input 
                    type="number"
                    value={asciiWidth}
                    onChange={(e) => setAsciiWidth(Number(e.target.value))}
                    min={20}
                    max={200}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Height</label>
                  <Input 
                    type="number"
                    value={asciiHeight}
                    onChange={(e) => setAsciiHeight(Number(e.target.value))}
                    min={10}
                    max={100}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ASCII Preview */}
        {showPreview && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Live Preview</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(!showPreview)}
                  className="h-6 w-6"
                >
                  {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="h-6 w-6"
                >
                  {isFullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            
            <div className={`bg-black border border-white/20 p-4 font-mono text-xs leading-none overflow-auto ${
              isFullscreen ? 'h-96' : 'h-48'
            }`}>
              {streamData.length > 0 ? (
                <pre className="text-green-400 whitespace-pre">
                  {streamData[streamData.length - 1]}
                </pre>
              ) : (
                <div className="text-gray-500 flex items-center justify-center h-full">
                  Start streaming to see ASCII preview
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">{streamData.length}</div>
            <div className="text-xs text-gray-400">Frames Captured</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {(bytesTransmitted / 1024).toFixed(1)}KB
            </div>
            <div className="text-xs text-gray-400">Data Transmitted</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{frameRate}</div>
            <div className="text-xs text-gray-400">FPS</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
