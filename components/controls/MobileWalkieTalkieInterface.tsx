import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Volume2,
  VolumeX,
  Send,
  Terminal,
  Radio,
  Signal,
  Settings,
  Users,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { WaveformVisualizer } from '../visualization/WaveformVisualizer';
import { MiniWaveformVisualizer } from '../visualization/MiniWaveformVisualizer';
import { ScrollArea } from '../ui/scroll-area';

interface MobileWalkieTalkieInterfaceProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'voice' | 'text' | 'packet';
}

interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: string;
}

export function MobileWalkieTalkieInterface({ className = '' }: MobileWalkieTalkieInterfaceProps) {
  // Walkie-talkie state
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Chat and messaging state
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'System',
      message: 'Signal intelligence interface active',
      timestamp: '08:42:15',
      type: 'text'
    },
    {
      id: '2',
      sender: 'Alex',
      message: 'Voice transmission received',
      timestamp: '08:42:18',
      type: 'voice'
    },
    {
      id: '3',
      sender: 'You',
      message: 'Packet deployed: STATUS_REQ',
      timestamp: '08:42:20',
      type: 'packet'
    }
  ]);
  
  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([
    {
      id: '1',
      command: 'scan --freq 146.52',
      output: 'Signal detected: 146.52 MHz\nStrength: -82 dBm\nMode: FM',
      timestamp: '08:42:10'
    },
    {
      id: '2',
      command: 'deploy packet --type status',
      output: 'Packet deployed successfully\nTarget: 192.168.1.100\nStatus: ACK received',
      timestamp: '08:42:25'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('chat');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle microphone activation (transmit button)
  const toggleTransmit = () => {
    setIsTransmitting(!isTransmitting);
  };
  
  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Toggle video feed
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    // Mock video stream simulation
    if (!isVideoEnabled && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw mock video elements
        ctx.fillStyle = '#333';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(
            Math.random() * canvas.width * 0.8, 
            Math.random() * canvas.height * 0.8, 
            Math.random() * 50 + 30, 
            Math.random() * 50 + 30
          );
        }
        
        const stream = canvas.captureStream(25);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    }
  };
  
  // Send chat message
  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: currentMessage,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        type: 'text'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
    }
  };
  
  // Execute terminal command
  const executeCommand = () => {
    if (terminalInput.trim()) {
      const newCommand: TerminalCommand = {
        id: Date.now().toString(),
        command: terminalInput,
        output: `Executing: ${terminalInput}\n> Command completed successfully`,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };
      setTerminalHistory(prev => [...prev, newCommand]);
      setTerminalInput('');
    }
  };
  
  const getMessageTypeIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'voice':
        return <Mic className="h-3 w-3" />;
      case 'packet':
        return <Signal className="h-3 w-3" />;
      default:
        return <Send className="h-3 w-3" />;
    }
  };
  
  const getMessageTypeColor = (type: ChatMessage['type']) => {
    switch (type) {
      case 'voice':
        return 'text-green-400';
      case 'packet':
        return 'text-cyan-400';
      default:
        return 'text-blue-400';
    }
  };
  
  return (
    <div className={`bg-black/90 border border-border/30 rounded-lg overflow-hidden ${className}`}>
      {/* Header with controls */}
      <div className="p-3 border-b border-border/30 bg-black/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium">Mobile Intel</span>
            <Badge variant={isTransmitting ? "destructive" : "outline"} className={isTransmitting ? "animate-pulse" : ""}>
              {isTransmitting ? "TX" : "RX"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? (
                <Video className="h-3 w-3 text-cyan-400" />
              ) : (
                <VideoOff className="h-3 w-3" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Video feed (compact) */}
        {isVideoEnabled && (
          <div className="relative rounded-md overflow-hidden border border-border/30 aspect-video bg-black/50 mb-2">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              autoPlay 
              playsInline 
              muted
            />
            <div className="absolute top-1 right-1">
              <Badge variant="destructive" className="text-[10px] px-1 animate-pulse">LIVE</Badge>
            </div>
          </div>
        )}
        
        {/* Audio waveform */}
        <div className="h-12 mb-2">
          <MiniWaveformVisualizer 
            isActive={isTransmitting || !isMuted} 
            volume={volume}
            width={240}
            height={48}
          />
        </div>
        
        {/* Volume control */}
        <div className="flex items-center gap-2 mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => {
              setVolume(values[0]);
              if (isMuted && values[0] > 0) {
                setIsMuted(false);
              }
            }}
            className="flex-1"
            disabled={isMuted}
          />
          
          <span className="text-xs text-muted-foreground w-8">{isMuted ? 0 : volume}</span>
        </div>
        
        {/* Talk button */}
        <Button
          size="sm"
          className={`w-full h-8 rounded-md transition-all duration-300 ${
            isTransmitting ? 'talk-button-active' : 'talk-button-pulse'
          }`}
          onPointerDown={toggleTransmit}
          onPointerUp={toggleTransmit}
        >
          <div className="flex items-center gap-1">
            {isTransmitting ? (
              <MicOff className="h-3 w-3" />
            ) : (
              <Mic className="h-3 w-3" />
            )}
            <span className="text-xs">{isTransmitting ? 'Release' : 'Press to talk'}</span>
          </div>
        </Button>
      </div>
      
      {/* Expandable content area */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 m-2 bg-black/40">
            <TabsTrigger value="chat" className="text-xs">
              <Send className="h-3 w-3 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="terminal" className="text-xs">
              <Terminal className="h-3 w-3 mr-1" />
              Terminal
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-0 px-2 pb-2">
            {/* Chat/Text Log */}
            <div className="bg-black/50 border border-border/30 rounded-md">
              <ScrollArea className="h-32 p-2">
                <div className="space-y-1">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-xs">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className={`${getMessageTypeColor(msg.type)}`}>
                          {getMessageTypeIcon(msg.type)}
                        </span>
                        <span className="text-muted-foreground">[{msg.timestamp}]</span>
                        <span className="font-medium">{msg.sender}:</span>
                      </div>
                      <p className="text-white/90 ml-4">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-2 border-t border-border/30">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-1">
                  <Input 
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="bg-black/50 border-gray-700 text-xs h-6"
                    placeholder="Type message..."
                  />
                  <Button type="submit" size="sm" variant="outline" className="h-6 w-6 p-0">
                    <Send className="h-3 w-3" />
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="terminal" className="mt-0 px-2 pb-2">
            {/* Tiny Terminal */}
            <div className="bg-black/50 border border-border/30 rounded-md">
              <ScrollArea className="h-32 p-2 font-mono">
                <div className="space-y-1">
                  {terminalHistory.map((cmd) => (
                    <div key={cmd.id} className="text-xs">
                      <div className="text-green-400">
                        [{cmd.timestamp}] $ {cmd.command}
                      </div>
                      <div className="text-white/70 whitespace-pre-wrap ml-2">
                        {cmd.output}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-2 border-t border-border/30">
                <form onSubmit={(e) => { e.preventDefault(); executeCommand(); }} className="flex gap-1">
                  <Input 
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="bg-black/50 border-gray-700 text-xs h-6 font-mono"
                    placeholder="$ command..."
                  />
                  <Button type="submit" size="sm" variant="outline" className="h-6 w-6 p-0">
                    <Terminal className="h-3 w-3" />
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
