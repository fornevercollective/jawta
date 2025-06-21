import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  BarChart2, 
  Waves, 
  Network,
  SignalHigh,
  Clock,
  Settings,
  Download,
  Upload,
  Music,
  Podcast,
  Settings2,
  FileText,
  Radio,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Monitor,
  Send,
  Server,
  Satellite,
  Wifi,
  PackageOpen,
  Cloud,
  Globe,
  Signal,
  Zap,
  MapPin,
  Share2,
  Users,
  Video,
  WifiOff,
  Mic,
  XCircle,
  SendHorizontal,
  Grid,
  PlusSquare,
  MinusSquare,
  LayoutGrid,
  Unlink,
  Link,
  LinkIcon,
  Expand,
  Eye,
  Filter,
  List,
  CircleSlash,
  ChevronLeft,
  PanelLeft,
  PanelRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { WaveformVisualizer } from '../visualization/WaveformVisualizer';
import { SpectrumAnalyzer } from '../visualization/SpectrumAnalyzer';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { SpectrumAnalyzerContainer } from '../visualization/SpectrumAnalyzerContainer';
import { FrequencyControls } from '../controls/FrequencyControls';
import { Switch } from '../ui/switch';
import { useVision } from '../vision/VisionProvider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { TextFeedVisualizer } from '../visualization/TextFeedVisualizer';
import { TerminalVisualizer } from '../visualization/TerminalVisualizer';
import { useResponsive } from '../ui/use-responsive';
import { SoundWaveLogo } from '../ui/sound-wave-logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { SpectrumTabView } from './SpectrumTabView';
import { MobileWalkieTalkieInterface } from '../controls/MobileWalkieTalkieInterface';

interface LiveRadioIntelPageProps {
  onBack?: () => void;
}

// Define feed types
type FeedType = 'video' | 'audio' | 'text' | 'terminal' | 'spectrum';
type FeedStatus = 'active' | 'inactive';
type SignalStrength = 'strong' | 'medium' | 'weak' | 'poor';

// Define feed interface
interface Feed {
  id: string;
  name: string;
  type: FeedType;
  status: FeedStatus;
  signal: SignalStrength;
  description?: string;
  source?: string;
  frequency?: number;
}

export function LiveRadioIntelPage({ onBack }: LiveRadioIntelPageProps) {
  // Main state variables
  const [isRecording, setIsRecording] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [selectedBand, setSelectedBand] = useState('vhf');
  const [frequency, setFrequency] = useState(145.5);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isWideView, setIsWideView] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [isLeftColumnCollapsed, setIsLeftColumnCollapsed] = useState(false);
  const [activeMonitorTab, setActiveMonitorTab] = useState<'spectrum' | 'text' | 'terminal'>('spectrum');
  const [activeMainTab, setActiveMainTab] = useState<'monitor' | 'terminal' | 'spectrum' | 'deployment' | 'streaming'>('monitor');
  const [activeMonitor, setActiveMonitor] = useState<string | null>(null);
  const [activeFeeds, setActiveFeeds] = useState<string[]>([]);
  const { isMobile } = useResponsive();
  
  // Multiple spectrum feeds feature
  const [gridSize, setGridSize] = useState<'1x1' | '2x2' | '3x3' | '4x4' | '6x5'>('2x2');
  const [displayedSpectrumFeeds, setDisplayedSpectrumFeeds] = useState<string[]>([]);
  const [isLinkedToOtherWindows, setIsLinkedToOtherWindows] = useState(false);
  const [isSelectingFeeds, setIsSelectingFeeds] = useState(false);
  
  // Terminal output simulation data
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '[08:42:15] Starting frequency scan...',
    '[08:42:18] Signal detected on 146.52 MHz',
    '[08:42:20] Initiating recording - buffer active',
    '[08:42:35] Traffic identified: VOICE (unencrypted)',
    '[08:43:01] Receiving station ID: NET-071'
  ]);
  
  // Text feed simulation data
  const [liveTextStream, setLiveTextStream] = useState<string[]>([
    'Receiving message payload...',
    'Coordinates: 37.7749° N, 122.4194° W',
    'Timestamp: 08:42 UTC',
    'Message: Routine check-in complete',
    'Signal strength: Good (SNR +12dB)'
  ]);
  
  // System log simulation
  const [logEntries, setLogEntries] = useState<string[]>([
    '[SYSTEM] Radio terminal initialized',
    '[SYSTEM] Scanning for active signals',
    '[INFO] Connected to signal intelligence network',
    '[INFO] 5 channels available on VHF band'
  ]);
  
  // Feed definitions
  const videoFeeds: Feed[] = [
    { id: 'video-1', name: 'Channel 1 Live', type: 'video', status: 'active', signal: 'strong', frequency: 146.52 },
    { id: 'video-2', name: 'Satellite Feed 2', type: 'video', status: 'active', signal: 'medium', frequency: 437.5 },
    { id: 'video-3', name: 'Remote Cam 3', type: 'video', status: 'inactive', signal: 'poor', frequency: 155.7 }
  ];
  
  const audioFeeds: Feed[] = [
    { id: 'audio-1', name: 'VHF Main Net', type: 'audio', status: 'active', signal: 'strong', frequency: 145.2 },
    { id: 'audio-2', name: 'Emergency Channel', type: 'audio', status: 'active', signal: 'medium', frequency: 162.4 },
    { id: 'audio-3', name: 'UHF Local Relay', type: 'audio', status: 'active', signal: 'weak', frequency: 445.9 }
  ];
  
  const textFeeds: Feed[] = [
    { id: 'text-1', name: 'Live Message Stream', type: 'text', status: 'active', signal: 'strong', frequency: 144.39 },
    { id: 'text-2', name: 'Digital Traffic Net', type: 'text', status: 'active', signal: 'medium', frequency: 144.9 },
    { id: 'text-3', name: 'APRS Bulletins', type: 'text', status: 'inactive', signal: 'weak', frequency: 144.39 }
  ];
  
  const terminalFeeds: Feed[] = [
    { id: 'terminal-1', name: 'System Terminal', type: 'terminal', status: 'active', signal: 'strong', frequency: 0 },
    { id: 'terminal-2', name: 'Network Log', type: 'terminal', status: 'active', signal: 'medium', frequency: 0 },
    { id: 'terminal-3', name: 'Debug Console', type: 'terminal', status: 'inactive', signal: 'poor', frequency: 0 }
  ];
  
  const spectrumFeeds: Feed[] = [
    { id: 'spectrum-1', name: 'Real-time Spectrum', type: 'spectrum', status: 'active', signal: 'strong', frequency: 145.5 },
    { id: 'spectrum-2', name: 'Waterfall Display', type: 'spectrum', status: 'active', signal: 'strong', frequency: 432.1 },
    { id: 'spectrum-3', name: 'Band Activity', type: 'spectrum', status: 'inactive', signal: 'medium', frequency: 28.4 },
    { id: 'spectrum-4', name: 'VHF Monitor', type: 'spectrum', status: 'active', signal: 'strong', frequency: 146.52 },
    { id: 'spectrum-5', name: 'UHF Scanner', type: 'spectrum', status: 'active', signal: 'medium', frequency: 433.5 },
    { id: 'spectrum-6', name: 'HF Bands', type: 'spectrum', status: 'active', signal: 'weak', frequency: 14.2 }
  ];
  
  // Combine all feeds for easier access
  const allFeeds: Feed[] = [
    ...videoFeeds,
    ...audioFeeds,
    ...textFeeds,
    ...terminalFeeds,
    ...spectrumFeeds
  ];
  
  // Generate additional spectrum feeds for testing the grid layout
  const extraSpectrumFeeds: Feed[] = Array.from({ length: 24 }, (_, i) => ({
    id: `extra-spectrum-${i + 1}`,
    name: `Spectrum Feed ${i + 7}`,
    type: 'spectrum' as FeedType,
    status: 'active' as FeedStatus,
    signal: ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)] as SignalStrength,
    frequency: 144 + Math.random() * 200
  }));
  
  // Add the extra feeds to the spectrum feeds and all feeds arrays
  const fullSpectrumFeeds = [...spectrumFeeds, ...extraSpectrumFeeds];
  const fullAllFeeds = [...allFeeds, ...extraSpectrumFeeds];
  
  // Deployment status data
  const [deploymentStatus, setDeploymentStatus] = useState([
    { id: 'node-1', name: 'Field Node Alpha', status: 'active', battery: 87, signal: 'strong', lastUpdate: '2 min ago' },
    { id: 'node-2', name: 'Relay Station Beta', status: 'active', battery: 92, signal: 'strong', lastUpdate: '1 min ago' },
    { id: 'node-3', name: 'Remote Sensor Gamma', status: 'warning', battery: 42, signal: 'medium', lastUpdate: '15 min ago' },
    { id: 'node-4', name: 'Mobile Unit Delta', status: 'offline', battery: 12, signal: 'poor', lastUpdate: '1 hr ago' }
  ]);

  // Streaming sources
  const [streamingSources, setStreamingSources] = useState([
    { id: 'stream-1', name: 'Emergency Broadcast', type: 'radio', status: 'live', listeners: 124 },
    { id: 'stream-2', name: 'Field Communications', type: 'voice', status: 'live', listeners: 26 },
    { id: 'stream-3', name: 'Signal Analysis Podcast', type: 'podcast', status: 'recorded', listeners: 0 },
    { id: 'stream-4', name: 'Weather Updates', type: 'data', status: 'live', listeners: 53 }
  ]);
  
  // Bands available for selection
  const bands = [
    { id: 'vlf', name: 'VLF', freq: '3-30 kHz' },
    { id: 'lf', name: 'LF', freq: '30-300 kHz' },
    { id: 'mf', name: 'MF', freq: '300-3000 kHz' },
    { id: 'hf', name: 'HF', freq: '3-30 MHz' },
    { id: 'vhf', name: 'VHF', freq: '30-300 MHz' }
  ];

  // Initialize displayed spectrum feeds with first few feeds
  useEffect(() => {
    const initialDisplayedFeeds = fullSpectrumFeeds
      .filter(feed => feed.status === 'active')
      .slice(0, getMaxFeedsForGridSize(gridSize))
      .map(feed => feed.id);
    
    setDisplayedSpectrumFeeds(initialDisplayedFeeds);
  }, []);
  
  // Get active feed by ID
  const getActiveFeed = (id: string): Feed | undefined => {
    return fullAllFeeds.find(feed => feed.id === id);
  };
  
  // Set the active monitor feed
  const handleSetActiveMonitor = (feedId: string) => {
    const feed = getActiveFeed(feedId);
    if (feed?.status === 'active') {
      setActiveMonitor(feedId);
      
      // If not already in active feeds, add it
      if (!activeFeeds.includes(feedId)) {
        setActiveFeeds(prev => [...prev, feedId]);
      }
      
      // Set active tab based on feed type
      switch (feed.type) {
        case 'video':
          setActiveMonitorTab('spectrum');
          break;
        case 'audio':
          setActiveMonitorTab('spectrum');
          break;
        case 'text':
          setActiveMonitorTab('text');
          break;
        case 'terminal':
          setActiveMonitorTab('terminal');
          break;
        case 'spectrum':
          setActiveMonitorTab('spectrum');
          break;
      }
    }
  };

  // Toggle feed active state  
  const toggleFeed = (feedId: string) => {
    const feed = getActiveFeed(feedId);
    
    if (feed?.status === 'active') {
      // Toggle feed in active feeds list
      setActiveFeeds(prev => {
        if (prev.includes(feedId)) {
          return prev.filter(id => id !== feedId);
        } else {
          return [...prev, feedId];
        }
      });
      
      // If removing current active monitor, clear it
      if (activeMonitor === feedId && activeFeeds.includes(feedId)) {
        setActiveMonitor(null);
      }
    }
  };
  
  // Toggle recording state
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Add a log entry
    if (!isRecording) {
      addLogEntry('[SYSTEM] Recording started');
    } else {
      addLogEntry('[SYSTEM] Recording stopped');
    }
  };
  
  // Toggle streaming state
  const toggleStream = () => {
    setStreamActive(!streamActive);
    
    // Add a log entry
    if (!streamActive) {
      addLogEntry('[SYSTEM] Stream activated');
    } else {
      addLogEntry('[SYSTEM] Stream deactivated');
    }
  };
  
  // Handle frequency change
  const handleFrequencyChange = (newFreq: number) => {
    setFrequency(newFreq);
    addLogEntry(`[SYSTEM] Frequency tuned to ${newFreq.toFixed(1)} MHz`);
  };
  
  // Add a log entry
  const addLogEntry = (entry: string) => {
    setLogEntries(prev => [...prev, entry]);
    
    // Also add to terminal output if it's a system message
    if (entry.includes('[SYSTEM]') || entry.includes('[INFO]')) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTerminalOutput(prev => [...prev.slice(-40), `[${timestamp}] ${entry.replace(/\[\w+\]\s/, '')}`]);
    }
  };
  
  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
    addLogEntry(`[SYSTEM] Audio ${isMuted ? 'unmuted' : 'muted'}`);
  };
  
  // Function to get signal strength class based on signal
  const getSignalStrengthClass = (signal: SignalStrength) => {
    switch (signal) {
      case 'strong':
        return 'signal-strong';
      case 'medium':
        return 'signal-medium';
      case 'weak':
        return 'signal-weak';
      case 'poor':
        return 'signal-poor';
    }
  };
  
  // Function to get feed icon based on feed type
  const getFeedIcon = (type: FeedType) => {
    switch (type) {
      case 'video':
        return <Video className="h-3 w-3 mr-1.5 text-muted-foreground" />;
      case 'audio':
        return <Volume2 className="h-3 w-3 mr-1.5 text-muted-foreground" />;
      case 'text':
        return <FileText className="h-3 w-3 mr-1.5 text-muted-foreground" />;
      case 'terminal':
        return <Terminal className="h-3 w-3 mr-1.5 text-muted-foreground" />;
      case 'spectrum':
        return <BarChart2 className="h-3 w-3 mr-1.5 text-muted-foreground" />;
    }
  };
  
  // Update terminal output periodically with sample data
  useEffect(() => {
    if (activeMainTab !== 'terminal' && activeMonitorTab !== 'terminal') return;
    
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const messages = [
        'Scanning frequencies...',
        'Signal detected',
        'Processing audio stream',
        'Network status: optimal',
        'Analyzing spectral data',
        'Memory usage: 42%'
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setTerminalOutput(prev => [...prev.slice(-40), `[${timestamp}] ${randomMessage}`]);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeMainTab, activeMonitorTab]);
  
  // Update text stream periodically if active
  useEffect(() => {
    if (activeMainTab !== 'monitor' && activeMonitorTab !== 'text') return;
    
    const interval = setInterval(() => {
      const textMessages = [
        'Incoming packet data...',
        'Location update received',
        'Message checksum verified',
        'Traffic report: clear',
        'Weather alert: clear conditions',
        'System status: operational'
      ];
      const randomMessage = textMessages[Math.floor(Math.random() * textMessages.length)];
      setLiveTextStream(prev => [...prev.slice(-40), randomMessage]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [activeMainTab, activeMonitorTab]);
  
  // Get color classes based on status
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'active':
      case 'live':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'offline':
      case 'error':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };
  
  // Get background color classes based on status
  const getStatusBgClass = (status: string) => {
    switch (status) {
      case 'active':
      case 'live':
        return 'bg-green-500/20 border-green-500/40';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/40';
      case 'offline':
      case 'error':
        return 'bg-red-500/20 border-red-500/40';
      default:
        return 'bg-blue-500/20 border-blue-500/40';
    }
  };
  
  // Get battery status color
  const getBatteryColorClass = (level: number) => {
    if (level > 70) return 'text-green-400';
    if (level > 30) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Get stream type icon
  const getStreamTypeIcon = (type: string) => {
    switch (type) {
      case 'radio':
        return <Radio className="h-4 w-4 text-blue-400" />;
      case 'voice':
        return <Volume2 className="h-4 w-4 text-cyan-400" />;
      case 'podcast':
        return <Podcast className="h-4 w-4 text-purple-400" />;
      case 'data':
        return <FileText className="h-4 w-4 text-green-400" />;
      default:
        return <Share2 className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Helper functions for managing multiple spectrum feeds
  const getMaxFeedsForGridSize = (gridSize: '1x1' | '2x2' | '3x3' | '4x4' | '6x5'): number => {
    switch (gridSize) {
      case '1x1': return 1;
      case '2x2': return 4;
      case '3x3': return 9;
      case '4x4': return 16;
      case '6x5': return 30;
      default: return 4;
    }
  };
  
  const getGridStyle = (gridSize: '1x1' | '2x2' | '3x3' | '4x4' | '6x5'): string => {
    switch (gridSize) {
      case '1x1': return 'grid-cols-1 grid-rows-1';
      case '2x2': return 'grid-cols-2 grid-rows-2';
      case '3x3': return 'grid-cols-3 grid-rows-3';
      case '4x4': return 'grid-cols-4 grid-rows-4';
      case '6x5': return 'grid-cols-6 grid-rows-5';
      default: return 'grid-cols-2 grid-rows-2';
    }
  };
  
  const handleGridSizeChange = (newSize: '1x1' | '2x2' | '3x3' | '4x4' | '6x5') => {
    setGridSize(newSize);
    
    // Adjust displayed feeds based on new grid size
    const maxFeeds = getMaxFeedsForGridSize(newSize);
    if (displayedSpectrumFeeds.length > maxFeeds) {
      setDisplayedSpectrumFeeds(prev => prev.slice(0, maxFeeds));
    }
  };
  
  // Toggle left column collapsed state with smooth transition
  const toggleLeftColumn = () => {
    setIsLeftColumnCollapsed(!isLeftColumnCollapsed);
  };
  
  // Toggle grid view
  const toggleGridView = () => {
    setIsGridView(!isGridView);
  };

  // Render the spectrum tab content with the new SpectrumTabView component
  const renderSpectrumTabContent = () => {
    return (
      <div className="h-full flex flex-col">
        <SpectrumTabView 
          feeds={fullSpectrumFeeds} 
          isCollapsed={isLeftColumnCollapsed}
          initialSelectedFeeds={displayedSpectrumFeeds}
        />
      </div>
    );
  };

  // Display the current active feed in the content area
  const renderActiveFeedContent = () => {
    if (!activeMonitor) {
      return (
        <div className="flex items-center justify-center h-full bg-black/30 rounded-lg border border-border/30 p-4">
          <div className="text-center">
            <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium">No Active Monitor</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Select a feed from the sidebar to monitor
            </p>
          </div>
        </div>
      );
    }
    
    const feed = getActiveFeed(activeMonitor);
    if (!feed) return null;
    
    return (
      <div className="h-full bg-black rounded-lg border border-border/30 flex flex-col">
        <div className="p-3 border-b border-border/30 flex justify-between items-center">
          <div className="flex items-center">
            {getFeedIcon(feed.type)}
            <h3 className="text-sm font-medium">{feed.name}</h3>
            {feed.frequency && (
              <Badge className="ml-2 bg-black/80 border-white/20">
                {feed.frequency.toFixed(2)} MHz
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Badge className="bg-black/80 border-white/20">
              <span className={`signal-indicator ${getSignalStrengthClass(feed.signal)}`}></span>
              {feed.signal.toUpperCase()}
            </Badge>
            {/* Define Tabs container for the monitor tabs */}
            <Tabs value={activeMonitorTab} onValueChange={(v) => setActiveMonitorTab(v as 'spectrum' | 'text' | 'terminal')}>
              <TabsList className="h-7 bg-black/50">
                <TabsTrigger value="spectrum" className="h-6 px-2 py-0">
                  <BarChart2 className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger value="text" className="h-6 px-2 py-0">
                  <FileText className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger value="terminal" className="h-6 px-2 py-0">
                  <Terminal className="h-3.5 w-3.5" />
                </TabsTrigger>
              </TabsList>
              
              {/* TabsContent components must be within the Tabs container */}
              <TabsContent value="spectrum" className="flex-1 p-0 m-0">
                <div className="h-full">
                  <SpectrumAnalyzerContainer isActive={true} frequency={feed.frequency} />
                </div>
              </TabsContent>
              
              <TabsContent value="text" className="flex-1 p-0 m-0">
                <TextFeedVisualizer textStream={liveTextStream} height="full" />
              </TabsContent>
              
              <TabsContent value="terminal" className="flex-1 p-0 m-0">
                <TerminalVisualizer terminalOutput={terminalOutput} height="full" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the main content based on the active tab
  const renderMainContent = () => {
    switch (activeMainTab) {
      case 'monitor':
        // Existing monitor content
        return (
          <div className="h-full">
            {renderActiveFeedContent()}
          </div>
        );
      case 'terminal':
        // Terminal tab content
        return (
          <div className="h-full bg-black rounded-lg border border-border/30 flex flex-col">
            <div className="p-3 border-b border-border/30 flex justify-between items-center">
              <h3 className="text-sm font-medium flex items-center">
                <Terminal className="h-4 w-4 mr-1.5 text-green-400" />
                <span>System Terminal</span>
              </h3>
              <Badge variant="outline" className="bg-black/80 border-white/20 text-green-400">
                TERMINAL
              </Badge>
            </div>
            <div className="flex-1 p-2 overflow-y-auto bg-black/90 font-mono text-xs terminal-text space-y-0.5">
              {terminalOutput.map((line, index) => (
                <div 
                  key={index} 
                  className={`${index === terminalOutput.length - 1 ? 'animate-typing' : ''}`}
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border/30">
              <form onSubmit={(e) => { e.preventDefault(); }} className="flex gap-2">
                <Input 
                  className="bg-black/50 border-gray-700 text-xs font-mono"
                  placeholder="Enter command..."
                />
                <Button type="submit" size="sm" variant="outline">
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        );
      case 'spectrum':
        // Spectrum tab content - using our new component
        return renderSpectrumTabContent();
      case 'deployment':
        // Deployment tab content
        return (
          <div className="h-full bg-black rounded-lg border border-border/30 flex flex-col">
            <div className="p-3 border-b border-border/30">
              <h3 className="text-sm font-medium flex items-center">
                <Server className="h-4 w-4 mr-1.5 text-purple-400" />
                <span>Deployment Status</span>
              </h3>
            </div>
            <div className="flex-1 p-3">
              <div className="grid gap-3 md:grid-cols-2">
                {deploymentStatus.map(node => (
                  <div 
                    key={node.id} 
                    className={`p-3 rounded-lg border ${getStatusBgClass(node.status)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium">{node.name}</h4>
                      <Badge className={getStatusBgClass(node.status)}>
                        {node.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div className="text-xs text-muted-foreground">
                        <span>Battery</span>
                      </div>
                      <div className="text-xs font-medium flex justify-end">
                        <span className={getBatteryColorClass(node.battery)}>
                          {node.battery}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span>Signal</span>
                      </div>
                      <div className="text-xs font-medium flex items-center justify-end">
                        <span className={`signal-indicator ${getSignalStrengthClass(node.signal as SignalStrength)}`}></span>
                        {node.signal}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span>Last Update</span>
                      </div>
                      <div className="text-xs font-medium flex justify-end">
                        {node.lastUpdate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'streaming':
        // Streaming tab content
        return (
          <div className="h-full bg-black rounded-lg border border-border/30 flex flex-col">
            <div className="p-3 border-b border-border/30">
              <h3 className="text-sm font-medium flex items-center">
                <Radio className="h-4 w-4 mr-1.5 text-blue-400" />
                <span>Streaming Control</span>
              </h3>
            </div>
            <div className="flex-1 p-3">
              <div className="grid gap-3 md:grid-cols-2">
                {streamingSources.map(source => (
                  <div 
                    key={source.id} 
                    className={`p-3 rounded-lg border ${getStatusBgClass(source.status)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getStreamTypeIcon(source.type)}
                        <h4 className="text-sm font-medium ml-2">{source.name}</h4>
                      </div>
                      <Badge className={getStatusBgClass(source.status)}>
                        {source.status === 'live' ? 'LIVE' : 'RECORDED'}
                      </Badge>
                    </div>
                    {source.status === 'live' && (
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div className="text-xs text-muted-foreground">
                          <span>Listeners</span>
                        </div>
                        <div className="text-xs font-medium flex justify-end">
                          <Users className="h-3 w-3 mr-1.5" />
                          {source.listeners}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span>Status</span>
                        </div>
                        <div className="text-xs font-medium flex items-center justify-end">
                          <span className={`signal-indicator signal-strong`}></span>
                          Broadcasting
                        </div>
                      </div>
                    )}
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border-white/10 transition-all"
                      >
                        {source.status === 'live' ? (
                          <>
                            <Radio className="h-4 w-4 mr-1 animate-pulse" />
                            Listen
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Play
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full bg-black/30 rounded-lg border border-border/30 flex items-center justify-center">
            <div className="text-center p-4">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium">Select a Tab</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Choose a tab from above to view different controls
              </p>
            </div>
          </div>
        );
    }
  };
  
  // Add or remove a feed from the displayed spectrum feeds
  const toggleSpectrumFeed = (feedId: string) => {
    setDisplayedSpectrumFeeds(prev => {
      if (prev.includes(feedId)) {
        // Remove feed
        return prev.filter(id => id !== feedId);
      } else {
        // Add feed if we haven't reached the max for current grid size
        if (prev.length < getMaxFeedsForGridSize(gridSize)) {
          return [...prev, feedId];
        }
        return prev;
      }
    });
  };
  
  // Handle linking to other windows
  const toggleLinking = () => {
    setIsLinkedToOtherWindows(!isLinkedToOtherWindows);
    addLogEntry(`[SYSTEM] ${!isLinkedToOtherWindows ? 'Linked' : 'Unlinked'} with other monitoring windows`);
  };
  
  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Header Bar */}
      <div className="bg-black border-b border-border/30 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-md" 
              onClick={onBack}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-medium flex items-center">
            <Radio className="h-5 w-5 mr-2 text-cyan-400" />
            <span className="text-white">Live Radio Intelligence</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={isRecording ? 'destructive' : 'outline'} 
            size="sm" 
            onClick={toggleRecording}
            className={`h-10 min-h-[80px] px-4 ${isRecording ? 'animate-pulse-subtle' : ''} ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border-white/10 text-white'}`}
          >
            {isRecording ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Recording
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleStream}
            className={`h-10 min-h-[80px] text-white ${streamActive ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border-white/10'}`}
          >
            {streamActive ? (
              <>
                <Radio className="h-5 w-5 mr-2 animate-pulse" />
                <span>Streaming</span>
              </>
            ) : (
              <>
                <Wifi className="h-5 w-5 mr-2" />
                <span>Start Stream</span>
              </>
            )}
          </Button>
          
          <Button 
            variant={isMuted ? 'outline' : 'ghost'} 
            size="sm" 
            className="h-10 min-h-[80px] text-white"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Main Content Area with Tabs */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="flex-1 flex flex-col">
            {/* Mobile Walkie-Talkie Interface */}
            <div className="p-3">
              <MobileWalkieTalkieInterface className="w-full" />
            </div>
            
            {/* Mobile Signal Intelligence Content */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid gap-3">
                {/* Compact spectrum display */}
                <div className="bg-black/50 border border-border/30 rounded-lg p-3">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1.5 text-cyan-400" />
                    Spectrum Monitor
                  </h3>
                  <div className="h-32">
                    <SpectrumAnalyzer 
                      data={Array.from({length: 64}, (_, i) => Math.random() * 100)}
                      isActive={streamActive}
                    />
                  </div>
                </div>
                
                {/* Active feeds summary */}
                <div className="bg-black/50 border border-border/30 rounded-lg p-3">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Signal className="h-4 w-4 mr-1.5 text-green-400" />
                    Active Feeds ({activeFeeds.length})
                  </h3>
                  <div className="space-y-1">
                    {fullAllFeeds
                      .filter(feed => feed.status === 'active')
                      .slice(0, 3) // Show only top 3 feeds on mobile
                      .map(feed => (
                      <div key={feed.id} className="flex items-center justify-between p-2 bg-black/30 rounded">
                        <div className="flex items-center gap-2">
                          {getFeedIcon(feed.type)}
                          <span className="text-xs truncate">{feed.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] h-4">
                          {feed.frequency ? `${feed.frequency.toFixed(2)} MHz` : 'Digital'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Quick controls */}
                <div className="bg-black/50 border border-border/30 rounded-lg p-3">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-1.5 text-orange-400" />
                    Quick Controls
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={isRecording ? 'destructive' : 'outline'} 
                      size="sm" 
                      onClick={toggleRecording}
                      className="h-8"
                    >
                      {isRecording ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                      {isRecording ? 'Stop' : 'Record'}
                    </Button>
                    <Button 
                      variant={streamActive ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={toggleStream}
                      className="h-8"
                    >
                      <Radio className="h-3 w-3 mr-1" />
                      {streamActive ? 'Streaming' : 'Stream'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <>
        {/* Left sidebar - frequency bands, active feeds, and system status */}
        <div 
          className={`transition-layout border-r border-border/30 bg-black
                     ${isLeftColumnCollapsed ? 'sidebar-collapsed' : 'w-64'}`}
        >
          {!isLeftColumnCollapsed && (
            <div className="flex flex-col h-full">
              {/* Frequency bands section */}
              <div className="p-3 border-b border-border/30">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase">Frequency Bands</h3>
                <div className="flex flex-wrap gap-1">
                  {bands.map(band => (
                    <Button
                      key={band.id}
                      variant={selectedBand === band.id ? 'default' : 'outline'}
                      size="sm"
                      className={`h-7 text-xs flex-1 text-white ${selectedBand === band.id ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-black/30'}`}
                      onClick={() => setSelectedBand(band.id)}
                    >
                      {band.name}
                    </Button>
                  ))}
                </div>
                <div className="mt-3">
                  <FrequencyControls 
                    frequency={frequency}
                    onFrequencyChange={handleFrequencyChange}
                    min={30}
                    max={300}
                  />
                </div>
              </div>
              
              {/* Active feeds section */}
              <div className="flex-1 overflow-auto p-3 border-b border-border/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase">Active Feeds</h3>
                  <Badge variant="outline" className="bg-black/80 border-white/20 text-xs h-5 text-white">
                    {activeFeeds.length}/{fullAllFeeds.filter(f => f.status === 'active').length}
                  </Badge>
                </div>
                
                <div className="space-y-1.5">
                  {fullAllFeeds
                    .filter(feed => feed.status === 'active')
                    .slice(0, 10) // Limit to first 10 feeds for UX
                    .map(feed => (
                    <Button
                      key={feed.id}
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-full justify-start px-2 text-white ${activeMonitor === feed.id ? 'bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-white/10' : 'hover:bg-black/40'}`}
                      onClick={() => handleSetActiveMonitor(feed.id)}
                    >
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center overflow-hidden">
                          {getFeedIcon(feed.type)}
                          <span className="truncate text-xs">{feed.name}</span>
                        </div>
                        <span className={`signal-indicator ${getSignalStrengthClass(feed.signal)}`}></span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Live settings section */}
              <div className="p-3 border-b border-border/30">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase">Live Settings</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">Volume</span>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        className="w-28"
                        onValueChange={(values) => setVolume(values[0])}
                      />
                      <span className="text-xs w-6 text-right text-white">{volume}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">Noise Reduction</span>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">Auto-Gain</span>
                    <Switch checked />
                  </div>
                </div>
              </div>
              
              {/* System status */}
              <div className="p-3">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase">System Status</h3>
                
                <div className="space-y-1.5 text-xs">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Signal Quality:</span>
                    <span className="flex items-center text-white">
                      <span className="signal-indicator signal-strong"></span>
                      Good
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Network:</span>
                    <span className="flex items-center text-white">
                      <span className="signal-indicator signal-strong"></span>
                      Connected
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Buffer:</span>
                    <span className="flex items-center text-white">45s</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Storage:</span>
                    <span className="flex items-center text-white">3.2 GB</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right content area with main tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* View options bar */}
          <div className="bg-black/50 border-b border-border/30 p-2 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 min-h-[80px] w-10 p-0 view-toggle-btn rounded-md mr-1 hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-purple-600/20 text-white"
                onClick={toggleLeftColumn}
                aria-label="Toggle sidebar"
              >
                {isLeftColumnCollapsed ? (
                  <PanelRight className="h-5 w-5" />
                ) : (
                  <PanelLeft className="h-5 w-5" />
                )}
              </Button>
              
              <div className="h-6 border-r border-border/30 mx-2"></div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant={!isGridView ? "default" : "ghost"}
                  size="sm"
                  className={`h-10 min-h-[80px] rounded-md view-toggle-btn text-white ${!isGridView ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/20' : ''}`}
                  onClick={() => setIsGridView(false)}
                >
                  <List className="h-4.5 w-4.5" />
                </Button>
                
                <Button
                  variant={isGridView ? "default" : "ghost"}
                  size="sm"
                  className={`h-10 min-h-[80px] rounded-md view-toggle-btn text-white ${isGridView ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/20' : ''}`}
                  onClick={() => setIsGridView(true)}
                >
                  <LayoutGrid className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
            
            <Tabs
              value={activeMainTab}
              onValueChange={(value) => setActiveMainTab(value as 'monitor' | 'terminal' | 'spectrum' | 'deployment' | 'streaming')}
              className="w-auto"
            >
              <TabsList className="bg-black/40 h-10 min-h-[80px] border border-white/10">
                <TabsTrigger 
                  value="monitor" 
                  className="min-h-[80px] text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600/30 data-[state=active]:to-purple-600/20"
                >
                  <Monitor className="h-4 w-4 mr-1.5" />
                  <span>Monitor</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="terminal"
                  className="min-h-[80px] text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600/30 data-[state=active]:to-purple-600/20"
                >
                  <Terminal className="h-4 w-4 mr-1.5" />
                  <span>Terminal</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="spectrum"
                  className="min-h-[80px] text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600/30 data-[state=active]:to-purple-600/20"
                >
                  <BarChart2 className="h-4 w-4 mr-1.5" />
                  <span>Spectrum</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="deployment"
                  className="min-h-[80px] text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600/30 data-[state=active]:to-purple-600/20"
                >
                  <Server className="h-4 w-4 mr-1.5" />
                  <span>Deployment</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="streaming"
                  className="min-h-[80px] text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600/30 data-[state=active]:to-purple-600/20"
                >
                  <Radio className="h-4 w-4 mr-1.5" />
                  <span>Streaming</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 min-h-[80px] w-10 p-0 rounded-md view-toggle-btn text-white"
                onClick={toggleLinking}
              >
                {isLinkedToOtherWindows ? (
                  <Unlink className="h-4.5 w-4.5 text-cyan-400" />
                ) : (
                  <Link className="h-4.5 w-4.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-10 min-h-[80px] w-10 p-0 rounded-md view-toggle-btn text-white"
              >
                <Settings2 className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
          
          {/* Main content area */}
          <div className={`flex-1 p-3 overflow-auto ${isGridView ? 'grid-layout-expanded' : ''}`}>
            {renderMainContent()}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}