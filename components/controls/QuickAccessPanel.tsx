import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { 
  Radio, 
  Waves, 
  Gauge,
  Satellite, 
  FileImage, 
  Code,
  FileSearch,
  Binary,
  Wifi,
  Smartphone,
  Play,
  Pause,
  ChevronDown,
  Volume2,
  Volume,
  VolumeX,
  Menu,
  Maximize2,
  Minimize2,
  ChevronRight,
  Settings,
  Home,
  Bell,
  BarChart2,
  Wand2,
  LifeBuoy,
  Settings2,
  Search,
  X,
  Zap,
  Radio as WalkieIcon,
  Signal,
  Info,
  AlertTriangle,
  Mic,
  BrainCircuit,
  Share2,
  Users,
  Rss,
  User,
  Music,
  Podcast,
  ArrowUpRight,
  Terminal
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { SoundWaveLogo } from '../ui/sound-wave-logo';
import { Input } from '../ui/input';
import { MiniWaveformVisualizer } from '../visualization/MiniWaveformVisualizer';
import { UserProfile } from '../profile/UserProfile';

// Define navigation style mappings
const navGradients = {
  signal: 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20',
  optical: 'bg-gradient-to-r from-green-600/20 to-emerald-600/20',
  imaging: 'bg-gradient-to-r from-pink-600/20 to-rose-600/20',
  radio: 'bg-gradient-to-r from-purple-600/20 to-violet-600/20',
  tools: 'bg-gradient-to-r from-indigo-600/20 to-blue-600/20',
  morse: 'bg-gradient-to-r from-yellow-600/20 to-amber-600/20',
  terminal: 'bg-gradient-to-r from-gray-600/20 to-slate-600/20',
  walkietalkie: 'bg-gradient-to-r from-red-600/20 to-orange-600/20'
};

// Define props interface
interface QuickAccessPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isTransmitting: boolean;
  onStartStop: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMobile: boolean;
  onEmergency?: (type: string) => void;
}

export function QuickAccessPanel({
  activeTab,
  onTabChange,
  isTransmitting,
  onStartStop,
  volume,
  onVolumeChange,
  isMobile,
  onEmergency
}: QuickAccessPanelProps) {
  // State variables
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeNav, setNavActive] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Define common button hover style
  const buttonHoverStyle = "hover:bg-[rgba(45,45,45,0.6)] transition-colors duration-200";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Handle tab click
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Render mobile header
  const renderMobileHeader = () => {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-border/30 p-2">
        <div className="flex justify-between items-center">
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="rounded-lg"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center">
            <SoundWaveLogo className="mr-2" />
            <span className="font-semibold text-white">jawta</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-lg"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <User className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Render full sidebar
  const renderSidebar = () => {
    return (
      <div className="flex flex-col h-screen bg-black border-r border-border/30">
        {/* Header with logo */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center">
            <SoundWaveLogo className="mr-3" size={24} />
            <h1 className="text-xl font-semibold text-white">jawta</h1>
          </div>
          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
            ALPHA
          </Badge>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-9 h-10 rounded-lg bg-input-background border-border focus:border-primary/50 text-white"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-2">
          <div className="space-y-1">
            {/* Signal tools */}
            <div className="mb-5">
              <h3 className="text-xs font-medium text-muted-foreground ml-3 mb-2 uppercase">
                Signal Processing
              </h3>
              
              <Button
                variant={activeTab === 'signal' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('signal');
                  setNavActive('signal');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 ${
                  activeTab === 'signal' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'signal' ? `${navGradients.signal} midi-activate` : ''}`}
              >
                <Signal className="h-5 w-5" />
                <span>Signal Intel</span>
              </Button>
              
              <Button
                variant={activeTab === 'optical' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('optical');
                  setNavActive('optical');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 ${
                  activeTab === 'optical' ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'optical' ? `${navGradients.optical} midi-activate` : ''}`}
              >
                <Waves className="h-5 w-5" />
                <span>Optical Comms</span>
              </Button>
              
              <Button
                variant={activeTab === 'imaging' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('imaging');
                  setNavActive('imaging');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 ${
                  activeTab === 'imaging' ? 'bg-gradient-to-r from-pink-600 to-rose-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'imaging' ? `${navGradients.imaging} midi-activate` : ''}`}
              >
                <FileImage className="h-5 w-5" />
                <span>Image Signal</span>
              </Button>
              
              <Button
                variant={activeTab === 'morse' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('morse');
                  setNavActive('morse');
                  if (onEmergency) {
                    onEmergency('morse');
                  }
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 ${
                  activeTab === 'morse' ? 'bg-gradient-to-r from-yellow-600 to-amber-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'morse' ? `${navGradients.morse} midi-activate` : ''}`}
              >
                <Code className="h-5 w-5" />
                <span>Text & Morse</span>
              </Button>
              
              <Button
                variant={activeTab === 'terminal' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('terminal');
                  setNavActive('terminal');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 ${
                  activeTab === 'terminal' ? 'bg-gradient-to-r from-gray-600 to-slate-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'terminal' ? `${navGradients.terminal} midi-activate` : ''}`}
              >
                <Terminal className="h-5 w-5" />
                <span>System Terminal</span>
              </Button>
            </div>
            
            {/* Network tools */}
            <div className="mb-5">
              <h3 className="text-xs font-medium text-muted-foreground ml-3 mb-2 uppercase">
                Network
              </h3>
              
              <Button
                variant={activeTab === 'radio' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('radio');
                  setNavActive('radio');
                  if (onEmergency) {
                    onEmergency('streaming');
                  }
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 ${
                  activeTab === 'radio' ? 'bg-gradient-to-r from-purple-600 to-violet-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'radio' ? `${navGradients.radio} midi-activate` : ''}`}
              >
                <Radio className="h-5 w-5" />
                <span>Streaming</span>
              </Button>
              
              <Button
                variant={activeTab === 'wifi' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('wifi');
                  setNavActive('wifi');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 ${
                  activeTab === 'wifi' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-white/30' : buttonHoverStyle
                }`}
              >
                <Wifi className="h-5 w-5" />
                <span>WiFi</span>
              </Button>
              
              <Button
                variant={activeTab === 'tools' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('tools');
                  setNavActive('tools');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 ${
                  activeTab === 'tools' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'tools' ? `${navGradients.tools} midi-activate` : ''}`}
              >
                <Gauge className="h-5 w-5" />
                <span>Diagnostics</span>
              </Button>
            </div>
            
            {/* Emergency functions */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground ml-3 mb-2 uppercase">
                Emergency
              </h3>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (onEmergency) onEmergency('walkie');
                  setNavActive('walkietalkie');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/40 hover:to-orange-600/40 border-white/10
                ${activeNav === 'walkietalkie' ? 'bg-gradient-to-r from-red-600/60 to-orange-600/40' : ''}`}
              >
                <WalkieIcon className="h-5 w-5" />
                <span>Walkie-Talkie Mode</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (onEmergency) onEmergency('burst');
                }}
                className="w-full justify-start gap-3 rounded-lg h-12 mt-1 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 hover:from-amber-600/40 hover:to-yellow-600/40 border-white/10"
              >
                <Zap className="h-5 w-5" />
                <span>Burst Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Broadcast area */}
        <div className="p-3 border-t border-border/30">
          <div className="flex items-center mb-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Signal Status</h3>
              <p className="text-xs text-muted-foreground">
                {isTransmitting ? 'Transmitting' : 'Standby'}
              </p>
            </div>
            <Button
              variant={isTransmitting ? "destructive" : "default"}
              size="sm"
              onClick={onStartStop}
              className={`h-10 rounded-lg text-white ${isTransmitting ? 'animate-pulse-subtle' : ''}`}
            >
              {isTransmitting ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Volume2 className="h-4 w-4 mr-2" />
            <span className="mr-2">{volume}%</span>
            <MiniWaveformVisualizer
              isActive={isTransmitting}
              volume={volume}
              className="flex-1"
            />
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-border/30">
          <UserProfile />
        </div>
      </div>
    );
  };

  // Render mobile dropdown menu
  const renderMobileMenu = () => {
    if (!isMenuOpen) return null;
    
    return (
      <div 
        ref={menuRef}
        className="fixed top-14 left-0 right-0 bottom-0 bg-black/95 z-40 backdrop-blur-sm flex flex-col"
      >
        <div className="overflow-y-auto py-3 px-3 flex-1">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-9 h-10 rounded-lg bg-input-background border-border focus:border-primary/50 text-white"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="space-y-1">
            {/* Signal tools */}
            <div className="mb-5">
              <h3 className="text-xs font-medium text-muted-foreground ml-3 mb-2 uppercase">
                Signal Processing
              </h3>
              
              <Button
                variant={activeTab === 'signal' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('signal');
                  setNavActive('signal');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] ${
                  activeTab === 'signal' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'signal' ? `${navGradients.signal} midi-activate` : ''}`}
              >
                <Signal className="h-5 w-5" />
                <span>Signal Intel</span>
              </Button>
              
              <Button
                variant={activeTab === 'optical' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('optical');
                  setNavActive('optical');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] ${
                  activeTab === 'optical' ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'optical' ? `${navGradients.optical} midi-activate` : ''}`}
              >
                <Waves className="h-5 w-5" />
                <span>Optical Comms</span>
              </Button>
              
              <Button
                variant={activeTab === 'imaging' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('imaging');
                  setNavActive('imaging');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] ${
                  activeTab === 'imaging' ? 'bg-gradient-to-r from-pink-600 to-rose-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'imaging' ? `${navGradients.imaging} midi-activate` : ''}`}
              >
                <FileImage className="h-5 w-5" />
                <span>Image Signal</span>
              </Button>
              
              <Button
                variant={activeTab === 'morse' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('morse');
                  setNavActive('morse');
                  if (onEmergency) {
                    onEmergency('morse');
                  }
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] ${
                  activeTab === 'morse' ? 'bg-gradient-to-r from-yellow-600 to-amber-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'morse' ? `${navGradients.morse} midi-activate` : ''}`}
              >
                <Code className="h-5 w-5" />
                <span>Text & Morse</span>
              </Button>
              
              <Button
                variant={activeTab === 'terminal' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('terminal');
                  setNavActive('terminal');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] ${
                  activeTab === 'terminal' ? 'bg-gradient-to-r from-gray-600 to-slate-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'terminal' ? `${navGradients.terminal} midi-activate` : ''}`}
              >
                <Terminal className="h-5 w-5" />
                <span>System Terminal</span>
              </Button>
            </div>
            
            {/* Network tools */}
            <div className="mb-5">
              <h3 className="text-xs font-medium text-muted-foreground ml-3 mb-2 uppercase">
                Network
              </h3>
              
              <Button
                variant={activeTab === 'radio' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('radio');
                  setNavActive('radio');
                  if (onEmergency) {
                    onEmergency('streaming');
                  }
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] ${
                  activeTab === 'radio' ? 'bg-gradient-to-r from-purple-600 to-violet-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'radio' ? `${navGradients.radio} midi-activate` : ''}`}
              >
                <Radio className="h-5 w-5" />
                <span>Streaming</span>
              </Button>
              
              <Button
                variant={activeTab === 'wifi' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('wifi');
                  setNavActive('wifi');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] ${
                  activeTab === 'wifi' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-white/30' : buttonHoverStyle
                }`}
              >
                <Wifi className="h-5 w-5" />
                <span>WiFi</span>
              </Button>
              
              <Button
                variant={activeTab === 'tools' ? "default" : "ghost"}
                size="lg"
                onClick={() => {
                  handleTabClick('tools');
                  setNavActive('tools');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] ${
                  activeTab === 'tools' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-white/30' : buttonHoverStyle
                } ${activeNav === 'tools' ? `${navGradients.tools} midi-activate` : ''}`}
              >
                <Gauge className="h-5 w-5" />
                <span>Diagnostics</span>
              </Button>
            </div>
            
            {/* Emergency functions */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground ml-3 mb-2 uppercase">
                Emergency
              </h3>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (onEmergency) onEmergency('walkie');
                  setNavActive('walkietalkie');
                }}
                className={`w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/40 hover:to-orange-600/40 border-white/10
                ${activeNav === 'walkietalkie' ? 'bg-gradient-to-r from-red-600/60 to-orange-600/40' : ''}`}
              >
                <WalkieIcon className="h-5 w-5" />
                <span>Walkie-Talkie Mode</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (onEmergency) onEmergency('burst');
                }}
                className="w-full justify-start gap-3 rounded-lg h-12 min-h-[80px] mt-1 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 hover:from-amber-600/40 hover:to-yellow-600/40 border-white/10"
              >
                <Zap className="h-5 w-5" />
                <span>Burst Settings</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu footer */}
        <div className="p-4 border-t border-border/30 bg-black/80">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-white">Signal Status</h3>
              <p className="text-xs text-muted-foreground">
                {isTransmitting ? 'Transmitting' : 'Standby'}
              </p>
            </div>
            <Button
              variant={isTransmitting ? "destructive" : "default"}
              size="sm"
              onClick={() => {
                onStartStop();
                setIsMenuOpen(false);
              }}
              className={`h-10 min-h-[80px] rounded-lg text-white ${isTransmitting ? 'animate-pulse-subtle' : ''}`}
            >
              {isTransmitting ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Return the appropriate component based on isMobile prop
  return isMobile ? (
    <>
      {renderMobileHeader()}
      {renderMobileMenu()}
    </>
  ) : (
    renderSidebar()
  );
}