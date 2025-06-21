import React, { useState, useEffect } from 'react';
import { Clock, Download, FileText } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface TextFeedVisualizerProps {
  textStream?: string[];
  height?: string;
  isActive?: boolean;
  feedName?: string;
  className?: string;
  initialData?: string[];
}

export function TextFeedVisualizer({
  textStream,
  height,
  isActive = true,
  feedName = "Live Text Feed",
  className = "",
  initialData = []
}: TextFeedVisualizerProps) {
  const [textData, setTextData] = useState<string[]>(
    textStream && textStream.length > 0 ? textStream : 
    initialData.length > 0 ? initialData : [
    'Initializing text feed...',
    'Connecting to message source',
    'Handshake complete',
    'Ready to receive data'
  ]);
  
  // Update data when textStream changes
  useEffect(() => {
    if (textStream && textStream.length > 0) {
      setTextData(textStream);
    }
  }, [textStream]);
  
  // Simulate new data coming in
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      const messages = [
        'Incoming packet data received',
        'Signal strength: Excellent',
        'Location update: 37.7749° N, 122.4194° W',
        'Weather conditions: Clear',
        'Time sync complete',
        'Network status: Connected',
        'Frequency: 146.520 MHz',
        'Mode: FM Narrowband',
        'Transmission complete',
        'Awaiting next update...'
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setTextData(prev => [...prev.slice(-19), `[${timestamp}] ${randomMessage}`]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  // Handle download text data
  const handleDownload = () => {
    const data = textData.join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${feedName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className={`h-full flex flex-col overflow-hidden bg-black rounded-lg border border-border/30 ${className}`}>
      <div className="p-3 border-b border-border/30 flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center">
          <FileText className="h-4 w-4 mr-1.5 text-blue-400" />
          <span>{feedName}</span>
        </h3>
        <Badge variant="outline" className={`bg-black/80 border-white/20 ${isActive ? 'text-blue-400' : 'text-muted-foreground'}`}>
          {isActive ? 'LIVE' : 'STANDBY'}
        </Badge>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto bg-black/50 font-mono text-xs space-y-2">
        {textData.map((line, index) => (
          <div 
            key={index} 
            className={`p-2 border-l-2 border-blue-500/50 bg-black/30 ${index === textData.length - 1 && isActive ? 'animate-pulse-subtle' : ''}`}
          >
            {line}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <Clock className="h-3 w-3 inline mr-1" />
            Updated: {new Date().toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}