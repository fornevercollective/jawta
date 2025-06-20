
import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Wifi,
  Smartphone,
  Bluetooth,
  Signal,
  Volume2,
  VolumeX,
  ArrowLeft,
  Settings,
  Users,
  UserPlus,
  Gauge,
  Activity,
  BarChart2,
  Map,
  MapPin,
  ChevronDown,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { WaveformVisualizer } from '../visualization/WaveformVisualizer';
import { MiniWaveformVisualizer } from '../visualization/MiniWaveformVisualizer';
import { useResponsive } from '../ui/use-responsive';
import { useVision } from '../vision/VisionProvider';
import { GeohashMap } from '../visualization/GeohashMap';
import { UserProfile } from '../profile/UserProfile';

interface WalkieTalkiePageProps {
  onBack?: () => void;
}

// Define spectrum bands
const spectrumBands = [
  { id: 'vlf', name: 'VLF', frequency: '3-30 kHz', color: 'bg-indigo-500/70' },
  { id: 'lf', name: 'LF', frequency: '30-300 kHz', color: 'bg-blue-500/70' },
  { id: 'mf', name: 'MF', frequency: '300-3000 kHz', color: 'bg-cyan-500/70' },
  { id: 'hf', name: 'HF', frequency: '3-30 MHz', color: 'bg-teal-500/70' },
  { id: 'vhf', name: 'VHF', frequency: '30-300 MHz', color: 'bg-green-500/70' }
];

// Define communication modes
const communicationModes = [
  { 
    id: 'wifi', 
    name: 'WiFi', 
    color: 'bg-blue-500/70',
    icon: <Wifi className="h-4 w-4" />
  },
  { 
    id: 'cell', 
    name: 'Cellular', 
    color: 'bg-red-500/70',
    icon: <Smartphone className="h-4 w-4" />
  },
  { 
    id: 'bluetooth', 
    name: 'Bluetooth', 
    color: 'bg-indigo-500/70',
    icon: <Bluetooth className="h-4 w-4" />
  },
  { 
    id: 'mesh', 
    name: 'Mesh', 
    color: 'bg-purple-500/70',
    icon: <Signal className="h-4 w-4" />
  }
];

// Define preset channels by mode
const presetChannels = {
  wifi: [
    { id: 'wifi-1', name: 'WiFi Channel 1', frequency: '2.412 GHz' },
    { id: 'wifi-2', name: 'WiFi Channel 6', frequency: '2.437 GHz' },
    { id: 'wifi-3', name: 'WiFi Channel 11', frequency: '2.462 GHz' },
    { id: 'wifi-4', name: '5GHz Channel 36', frequency: '5.180 GHz' },
    { id: 'wifi-5', name: '5GHz Channel 149', frequency: '5.745 GHz' }
  ],
  cell: [
    { id: 'cell-1', name: 'LTE B4', frequency: '1.7/2.1 GHz' },
    { id: 'cell-2', name: 'LTE B13', frequency: '700 MHz' },
    { id: 'cell-3', name: 'LTE B66', frequency: '1.7/2.1 GHz' },
    { id: 'cell-4', name: '5G n41', frequency: '2.5 GHz' },
    { id: 'cell-5', name: '5G n77', frequency: '3.7 GHz' }
  ],
  bluetooth: [
    { id: 'bt-1', name: 'BT Channel 0', frequency: '2.402 GHz' },
    { id: 'bt-2', name: 'BT Channel 15', frequency: '2.432 GHz' },
    { id: 'bt-3', name: 'BT Channel 39', frequency: '2.441 GHz' },
    { id: 'bt-4', name: 'BT Channel 78', frequency: '2.480 GHz' },
    { id: 'bt-5', name: 'BT LE 37', frequency: '2.435 GHz' }
  ],
  mesh: [
    { id: 'mesh-1', name: 'Mesh Channel 1', frequency: '2.412 GHz' },
    { id: 'mesh-2', name: 'Mesh Channel 2', frequency: '2.417 GHz' },
    { id: 'mesh-3', name: 'Mesh Channel 3', frequency: '2.422 GHz' },
    { id: 'mesh-4', name: 'Mesh Channel 4', frequency: '2.427 GHz' },
    { id: 'mesh-5', name: 'Mesh Channel 5', frequency: '2.432 GHz' }
  ]
};

// Mock user list
const users = ['Sam (You)', 'Alex', 'Taylor', 'Morgan', 'Jordan', 'Riley', 'Avery'];

export function WalkieTalkiePage({ onBack }: WalkieTalkiePageProps) {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [activeBand, setActiveBand] = useState('vhf');
  const [activeMode, setActiveMode] = useState('wifi');
  const [activeChannel, setActiveChannel] = useState('wifi-1');
  const [activeTab, setActiveTab] = useState('channels');
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [showSpectrum, setShowSpectrum] = useState(true);
  const [geohashViewActive, setGeohashViewActive] = useState(true);
  
  // Collapsible section states
  const [geoRangeExpanded, setGeoRangeExpanded] = useState(true);
  const [spectrumBandsExpanded, setSpectrumBandsExpanded] = useState(true);
  const [communicationModeExpanded, setCommunicationModeExpanded] = useState(true);
  
  const { isMobile } = useResponsive();
  const { isVisionOS } = useVision();
  
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
    
    // In a real implementation, this would handle actual camera media
    if (!isVideoEnabled && videoRef.current) {
      // This is a mock example - in real code you'd use navigator.mediaDevices.getUserMedia
      // For demo, we just show a black background
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw some mock "video feed" elements
        ctx.fillStyle = '#333';
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(
            Math.random() * canvas.width, 
            Math.random() * canvas.height, 
            Math.random() * 100 + 50, 
            Math.random() * 100 + 50
          );
        }
        
        // Convert to video stream
        const stream = canvas.captureStream(25); // 25 fps
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    }
  };
  
  // Handle frequency band changes
  const handleBandChange = (bandId: string) => {
    setActiveBand(bandId);
  };
  
  // Handle communication mode changes
  const handleModeChange = (modeId: string) => {
    setActiveMode(modeId);
    // Set the first channel in the new mode
    setActiveChannel(presetChannels[modeId as keyof typeof presetChannels][0].id);
  };
  
  // Handle channel changes
  const handleChannelChange = (channelId: string) => {
    setActiveChannel(channelId);
  };
  
  // Handle geohash region selection
  const handleRegionSelect = (region: string) => {
    console.log(`Selected region: ${region}`);
    // In a real app, this would switch to that region's communication channel
  };
  
  // Handle user selection from the geohash view
  const handleUserSelect = (userId: string) => {
    console.log(`Selected user: ${userId}`);
    // In a real app, this would start a direct communication with that user
  };
  
  // Toggle geohash view
  const toggleGeohashView = () => {
    setGeohashViewActive(!geohashViewActive);
  };

  // Toggle section expanded states
  const toggleGeoRangeExpanded = () => {
    setGeoRangeExpanded(prev => !prev);
  };

  const toggleSpectrumBandsExpanded = () => {
    setSpectrumBandsExpanded(prev => !prev);
  };

  const toggleCommunicationModeExpanded = () => {
    setCommunicationModeExpanded(prev => !prev);
  };
  
  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <header className="border-b border-border/30 bg-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="font-semibold">Walkie</h1>
          <Badge variant={isTransmitting ? "destructive" : "outline"} className={isTransmitting ? "animate-pulse" : ""}>
            {isTransmitting ? "TRANSMITTING" : "IDLE"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Username Component */}
          <UserProfile compact className="mr-2" />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 ${showSpectrum ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setShowSpectrum(!showSpectrum)}
          >
            <Activity className="h-4 w-4" />
            <span className="sr-only">Toggle Spectrum</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 ${geohashViewActive ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={toggleGeohashView}
          >
            <MapPin className="h-4 w-4" />
            <span className="sr-only">Toggle Geohash Map</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 ${isVideoEnabled ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={toggleVideo}
          >
            <Video className="h-4 w-4" />
            <span className="sr-only">Toggle Video</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 bg-[rgba(0,0,0,0)]">
        {/* Video Feed (when enabled) */}
        {isVideoEnabled && (
          <div className="mb-4 relative rounded-lg overflow-hidden border border-border/30 aspect-video bg-black/50 flex items-center justify-center">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              autoPlay 
              playsInline 
              muted
            />
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
            </div>
            <div className="absolute bottom-3 right-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-black border-white/10 hover:bg-[rgba(45,45,45,0.6)]"
                onClick={toggleVideo}
              >
                <VideoOff className="h-4 w-4 mr-1" />
                <span>Stop Video</span>
              </Button>
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <p className="text-muted-foreground text-sm">Video feed is disabled</p>
              </div>
            )}
          </div>
        )}
        
        {/* Spectrum Analyzer (when enabled) */}
        {showSpectrum && (
          <div className="mb-4 border border-border/30 rounded-lg p-3 bg-black/20">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Spectrum Analysis</h4>
              <Badge 
                variant="outline" 
                className={`${spectrumBands.find(band => band.id === activeBand)?.color} text-xs px-2 py-0.5`}
              >
                {activeBand.toUpperCase()}
              </Badge>
            </div>
            <div className="h-[140px]">
              <WaveformVisualizer 
                isActive={isTransmitting || !isMuted} 
                volume={volume}
              />
            </div>
          </div>
        )}
        
        {/* GeoHash Map - Collapsible Section */}
        {geohashViewActive && (
          <div className="mb-4">
            <div 
              className="flex justify-between items-center p-2 cursor-pointer border border-border/30 rounded-lg rounded-b-none bg-black/40 hover:bg-black/50 transition-colors"
              onClick={toggleGeoRangeExpanded}
            >
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>Geo Range</span>
              </h3>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${geoRangeExpanded ? '' : '-rotate-90'}`}
              />
            </div>
            
            <div 
              className={`overflow-hidden transition-all duration-300 border-x border-b border-border/30 rounded-b-lg ${
                geoRangeExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 border-none'
              }`}
            >
              <GeohashMap 
                onRegionSelect={handleRegionSelect}
                onUserSelect={handleUserSelect}
              />
            </div>
          </div>
        )}
        
        {/* Spectrum Bands - Collapsible Section */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center p-2 cursor-pointer border border-border/30 rounded-lg rounded-b-none bg-black/40 hover:bg-black/50 transition-colors"
            onClick={toggleSpectrumBandsExpanded}
          >
            <h4 className="text-sm font-medium flex items-center gap-1.5">
              <Radio className="h-4 w-4" />
              <span>Spectrum Bands</span>
            </h4>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${spectrumBandsExpanded ? '' : '-rotate-90'}`}
            />
          </div>
          
          <div 
            className={`overflow-hidden transition-all duration-300 border-x border-b border-border/30 rounded-b-lg ${
              spectrumBandsExpanded ? 'max-h-[150px] opacity-100 p-3' : 'max-h-0 opacity-0 border-none p-0'
            }`}
          >
            <div className="grid grid-cols-3 gap-2">
              {spectrumBands.map((band) => (
                <Button
                  key={band.id}
                  variant="outline"
                  size="sm"
                  className={`h-auto py-1.5 px-2 midi-pad transition-all duration-200 rounded-lg bg-black ${
                    activeBand === band.id ? `border-2 border-${band.id}-500/80` : "border-white/10"
                  }`}
                  onClick={() => handleBandChange(band.id)}
                >
                  <div className="flex flex-col items-center">
                    <span className={`font-medium ${activeBand === band.id ? `text-${band.id}-400` : ''}`}>{band.name}</span>
                    <span className="text-[10px] text-muted-foreground">{band.frequency}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Communication Modes - Collapsible Section */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center p-2 cursor-pointer border border-border/30 rounded-lg rounded-b-none bg-black/40 hover:bg-black/50 transition-colors"
            onClick={toggleCommunicationModeExpanded}
          >
            <h4 className="text-sm font-medium flex items-center gap-1.5">
              <Signal className="h-4 w-4" />
              <span>Communication Mode</span>
            </h4>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${communicationModeExpanded ? '' : '-rotate-90'}`}
            />
          </div>
          
          <div 
            className={`overflow-hidden transition-all duration-300 border-x border-b border-border/30 rounded-b-lg ${
              communicationModeExpanded ? 'max-h-[150px] opacity-100 p-3' : 'max-h-0 opacity-0 border-none p-0'
            }`}
          >
            <div className="grid grid-cols-4 gap-2">
              {communicationModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant="outline"
                  className={`midi-pad transition-all duration-200 rounded-lg flex-1 h-auto py-2 bg-black ${
                    activeMode === mode.id ? 'border-2 border-white/30' : 'border-white/10'
                  }`}
                  onClick={() => handleModeChange(mode.id)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`${activeMode === mode.id ? 'text-primary' : ''}`}>
                      {mode.icon}
                    </div>
                    <span className="text-xs mt-1">{mode.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tabs for Channels and Users */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="channels" className="text-sm">
              Channels
            </TabsTrigger>
            <TabsTrigger value="users" className="text-sm">
              Users
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="channels" className="mt-0">
            <div className="border border-border/30 rounded-lg bg-black/30 divide-y divide-border/20">
              {presetChannels[activeMode as keyof typeof presetChannels].map((channel) => (
                <div 
                  key={channel.id}
                  className={`p-3 flex justify-between items-center cursor-pointer transition-colors hover:bg-black/40 ${
                    activeChannel === channel.id ? 'bg-black/40' : ''
                  }`}
                  onClick={() => handleChannelChange(channel.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activeChannel === channel.id ? 'bg-primary animate-pulse-subtle' : 'bg-muted'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">{channel.frequency}</p>
                    </div>
                  </div>
                  
                  <MiniWaveformVisualizer 
                    isActive={isTransmitting && activeChannel === channel.id} 
                    volume={isMuted ? 0 : volume}
                    width={60}
                    height={24}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="mt-0">
            <div className="border border-border/30 rounded-lg bg-black/30 divide-y divide-border/20">
              {users.map((user, index) => (
                <div 
                  key={index}
                  className="p-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{user}</p>
                      <p className="text-xs text-muted-foreground">
                        {index === 0 ? 'Speaking...' : 'Online'}
                      </p>
                    </div>
                  </div>
                  
                  <MiniWaveformVisualizer 
                    isActive={index === 0} 
                    volume={60}
                    width={60}
                    height={24}
                  />
                </div>
              ))}
              
              <div className="p-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2 bg-black border-white/10 hover:bg-[rgba(45,45,45,0.6)] hover:border-white/20"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Invite User</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Volume Controls & Talk Button */}
      <div className="border-t border-border/30 p-4">
        {/* Volume Slider */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Volume</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          
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
            className="mb-6"
            disabled={isMuted}
          />
        </div>
        
        {/* Talk Button */}
        <Button
          size="lg"
          className={`w-full h-16 rounded-lg transition-all duration-300 ${
            isTransmitting ? 'talk-button-active' : 'talk-button-pulse'
          }`}
          onPointerDown={toggleTransmit}
          onPointerUp={toggleTransmit}
        >
          <div className="flex flex-col items-center">
            {isTransmitting ? (
              <MicOff className="h-6 w-6 mb-1" />
            ) : (
              <Mic className="h-6 w-6 mb-1" />
            )}
            <span>{isTransmitting ? 'Release to stop' : 'Press to talk'}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
