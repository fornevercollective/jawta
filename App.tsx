import { SignalConverter } from "./components/Signal/SignalConverter";
import { useState } from "react";
import { 
  Radio, 
  BarChart2, 
  Settings2, 
  Menu, 
  X, 
  Satellite, 
  FileImage, 
  Code, 
  FileSearch, 
  Binary,
  Wifi,
  Smartphone,
  Wand2,
  Play,
  Pause,
  LifeBuoy,
  Gauge,
  Bell,
  Search,
  Zap,
  RadioTower,
  Signal,
  Monitor,
  Grid3X3
} from "lucide-react";
import { SoundWaveLogo } from "./components/ui/sound-wave-logo";
import { BackgroundPattern } from "./components/ui/BackgroundPattern";
import { VisionProvider, useVision } from "./components/vision/VisionProvider";
import { VisionCard } from "./components/vision/VisionCard";
import { VisionUIDetection } from "./components/vision/VisionUIDetection";
import { Button } from "./components/ui/button";
import { QuickAccessPanel } from "./components/controls/QuickAccessPanel";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { useResponsive } from "./components/ui/use-responsive";
import { MiniWaveformVisualizer } from "./components/visualization/MiniWaveformVisualizer";
import { WalkieTalkiePage } from "./components/pages/WalkieTalkiePage";
import { BurstSettingsPage } from "./components/pages/BurstSettingsPage";
import { LiveRadioIntelPage } from "./components/pages/LiveRadioIntelPage";
import { StreamingControlCenterPage } from "./components/pages/StreamingControlCenterPage";
import { TextConversionPage } from "./components/pages/TextConversionPage";
import { UserProvider } from "./components/context/UserContext";
import { ThemeTest } from "./components/ui/theme-test";
import { AdvancedToolsPanel } from "./components/features/AdvancedToolsPanel";
import { ASCIILiveStream } from "./components/features/ASCIILiveStream";

// Define common button hover/active styles 
const buttonHoverStyle = "hover:bg-[rgba(45,45,45,0.6)] transition-colors duration-200";
const activeButtonStyle = "bg-[rgba(45,45,45,0.6)]";

// Main application component with Vision support wrapping
function AppContent() {
  const [activeTab, setActiveTab] = useState('signal');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentPage, setCurrentPage] = useState<
    'main' | 
    'walkie-talkie' | 
    'burst-settings' | 
    'live-radio-intel' | 
    'streaming-control-center' | 
    'text-conversion' |
    'advanced-tools' |
    'ascii-stream'
  >('main');
  const { isVisionOS, applyTranslucent } = useVision();
  const { isMobile } = useResponsive();
  const [searchQuery, setSearchQuery] = useState(''); // Added search state for App.tsx
  const [showThemeTest, setShowThemeTest] = useState(false); // For testing theme
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [showASCIIStream, setShowASCIIStream] = useState(false);
  const [streamRepositoryUrl, setStreamRepositoryUrl] = useState('https://api.github.com/repos/jawta/live-stream/contents/');
  
  // Handle tab changes from quick access panel
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Toggle transmission state
  const handleStartStop = () => {
    setIsTransmitting(!isTransmitting);
  };
  
  // Handle navigation to specific pages
  const handleNavigate = (page: 'main' | 'walkie-talkie' | 'burst-settings' | 'live-radio-intel' | 'streaming-control-center' | 'text-conversion' | 'advanced-tools' | 'ascii-stream') => {
    setCurrentPage(page);
  };
  
  // Handle emergency actions like walkie-talkie mode or burst settings
  const handleEmergency = (type: string) => {
    if (type === 'walkie') {
      // Mobile users go to simple walkie-talkie, desktop to advanced radio intel page
      if (isMobile) {
        handleNavigate('walkie-talkie');
      } else {
        handleNavigate('live-radio-intel');
      }
    } else if (type === 'burst') {
      handleNavigate('burst-settings');
    } else if (type === 'streaming') {
      handleNavigate('streaming-control-center');
    } else if (type === 'morse' || type === 'text') {
      handleNavigate('text-conversion');
    } else if (type === 'advanced-tools') {
      setShowAdvancedTools(true);
    } else if (type === 'ascii-stream') {
      setShowASCIIStream(true);
    } else if (type === 'radio-scan') {
      // Use the Radio icon functionality
      setShowAdvancedTools(true);
      setActiveTab('radio');
    } else if (type === 'analytics') {
      // Use the BarChart2 icon functionality
      setShowAdvancedTools(true);
      setActiveTab('signal');
    } else if (type === 'satellite') {
      // Use the Satellite icon functionality
      setShowAdvancedTools(true);
    } else if (type === 'binary') {
      // Use the Binary icon functionality
      setShowAdvancedTools(true);
    } else if (type === 'wifi') {
      // Use the Wifi icon functionality
      setShowAdvancedTools(true);
    } else if (type === 'smartphone') {
      // Use the Smartphone icon functionality for mobile tools
      if (isMobile) {
        setShowAdvancedTools(true);
      }
    } else if (type === 'wand') {
      // Use the Wand2 icon for automated tools
      setShowAdvancedTools(true);
    } else if (type === 'lifebuoy') {
      // Use the LifeBuoy icon for emergency tools
      setShowAdvancedTools(true);
    } else if (type === 'gauge') {
      // Use the Gauge icon for performance monitoring
      setShowAdvancedTools(true);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <BackgroundPattern opacity={0.6}>
      <div className="min-h-screen text-white flex bg-black">
        {/* Show theme test if enabled */}
        {showThemeTest ? (
          <div className="w-full p-4 bg-black">
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => setShowThemeTest(false)}
            >
              Back to App
            </Button>
            <ThemeTest />
          </div>
        ) : (
          <>
            {/* Show appropriate content based on current page */}
            {currentPage === 'walkie-talkie' ? (
              <div className="flex-1 flex flex-col">
                <WalkieTalkiePage onBack={() => handleNavigate('main')} />
              </div>
            ) : currentPage === 'burst-settings' ? (
              <div className="flex-1 flex flex-col">
                <BurstSettingsPage onBack={() => handleNavigate('main')} />
              </div>
            ) : currentPage === 'live-radio-intel' ? (
              <div className="flex-1 flex flex-col">
                <LiveRadioIntelPage onBack={() => handleNavigate('main')} />
              </div>
            ) : currentPage === 'streaming-control-center' ? (
              <div className="flex-1 flex flex-col">
                <StreamingControlCenterPage onBack={() => handleNavigate('main')} />
              </div>
            ) : currentPage === 'text-conversion' ? (
              <div className="flex-1 flex flex-col">
                <TextConversionPage onBack={() => handleNavigate('main')} />
              </div>
            ) : (
              <>
                {/* Sidebar for tablet/desktop */}
                {!isMobile && (
                  <div className="w-64 flex-shrink-0">
                    <QuickAccessPanel 
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                      isTransmitting={isTransmitting}
                      onStartStop={handleStartStop}
                      volume={volume}
                      onVolumeChange={setVolume}
                      isMobile={false}
                      onEmergency={handleEmergency}
                    />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col">
                  {/* Mobile header with dropdown panel */}
                  {isMobile && (
                    <QuickAccessPanel 
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                      isTransmitting={isTransmitting}
                      onStartStop={handleStartStop}
                      volume={volume}
                      onVolumeChange={setVolume}
                      isMobile={true}
                      onEmergency={handleEmergency}
                    />
                  )}
                  
                  <main className={`flex-1 w-full p-4 ${isMobile ? 'pt-14' : ''}`}>
                    {/* Desktop Header Bar */}
                    {!isMobile && (
                      <div className="rounded-xl border border-white/10 mb-4 bg-black">
                        <div className="px-6 py-3 flex justify-between items-center bg-black rounded-xl">
                          <div className="relative w-1/3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="search" 
                              placeholder="Search signals and devices..." 
                              className="pl-9 h-10 rounded-lg bg-input-background border-border focus:border-primary/50 text-white"
                              value={searchQuery}
                              onChange={handleSearchChange}
                            />
                          </div>
                          
                          <div>
                            <h2 className="text-lg font-medium text-white">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {/* Mini Waveform Visualizer */}
                            <MiniWaveformVisualizer 
                              isActive={isTransmitting}
                              volume={volume}
                              className="mr-2"
                            />
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`rounded-full relative ${buttonHoverStyle} text-white`}
                            >
                              <Bell className="h-5 w-5" />
                              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`rounded-full ${buttonHoverStyle} text-white`}
                              onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                              title="Advanced Tools - File Analysis, Code Tools & More"
                            >
                              {showAdvancedTools ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`rounded-full ${buttonHoverStyle} text-white`}
                              onClick={() => setShowASCIIStream(!showASCIIStream)}
                              title="ASCII Live Stream"
                            >
                              <Monitor className="h-5 w-5" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`rounded-full ${buttonHoverStyle} text-white`}
                            >
                              <Settings2 className="h-5 w-5" />
                            </Button>
                            
                            <Button
                              variant={isTransmitting ? "destructive" : "default"}
                              size="sm"
                              onClick={handleStartStop}
                              className="rounded-lg text-white"
                            >
                              {isTransmitting ? (
                                <>
                                  <Pause className="h-4 w-4 mr-1" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  <span>Start</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Main Content Area */}
                    <div className={`mx-auto ${!isMobile ? 'max-w-6xl' : ''}`}>
                      {/* Advanced Tools Panel */}
                      {showAdvancedTools && (
                        <div className="mb-6">
                          <AdvancedToolsPanel 
                            onClose={() => setShowAdvancedTools(false)}
                            className="w-full"
                          />
                          <div className="mt-4 p-4 bg-black/50 border border-white/10 rounded-lg">
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <FileImage className="h-4 w-4 text-yellow-400" />
                                <span>Image Analysis</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Code className="h-4 w-4 text-cyan-400" />
                                <span>Code Tools</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileSearch className="h-4 w-4 text-orange-400" />
                                <span>File Scanner</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Signal className="h-4 w-4 text-green-400" />
                                <span>Signal Processing</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <RadioTower className="h-4 w-4 text-purple-400" />
                                <span>RF Tower</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span>Quick Actions</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* ASCII Live Stream Panel */}
                      {showASCIIStream && (
                        <div className="mb-6">
                          <ASCIILiveStream 
                            className="w-full"
                            repositoryUrl={streamRepositoryUrl}
                            onStreamData={(data) => {
                              console.log('Stream data:', data.length, 'chars');
                            }}
                          />
                        </div>
                      )}
                      
                      {/* If we're in visionOS, wrap the SignalConverter in a VisionCard */}
                      {isVisionOS ? (
                        <VisionCard translucencyLevel="light" spatial={false}>
                          <SignalConverter 
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            isTransmitting={isTransmitting}
                            onTransmissionChange={setIsTransmitting}
                            volume={volume}
                            onVolumeChange={setVolume}
                            onEmergency={handleEmergency}
                          />
                        </VisionCard>
                      ) : (
                        <div className="bg-black rounded-lg border border-white/10">
                          <SignalConverter 
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            isTransmitting={isTransmitting}
                            onTransmissionChange={setIsTransmitting}
                            volume={volume}
                            onVolumeChange={setVolume}
                            onEmergency={handleEmergency}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Footer - now visible on all devices */}
                    <div className={`mx-auto mt-8 p-4 border-t border-border/30 text-sm text-muted-foreground ${!isMobile ? 'max-w-6xl' : ''}`}>
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                          <SoundWaveLogo size={16} />
                          <p className="text-xs md:text-sm">
                            sig+intel app
                          </p>
                        </div>
                        
                        {/* Quick Tool Access */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmergency('radio-scan')}
                            className="text-xs text-blue-400 hover:text-blue-300"
                            title="Radio Scanner"
                          >
                            <Radio className="h-3 w-3 mr-1" />
                            Scanner
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmergency('analytics')}
                            className="text-xs text-green-400 hover:text-green-300"
                            title="Signal Analytics"
                          >
                            <BarChart2 className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmergency('satellite')}
                            className="text-xs text-purple-400 hover:text-purple-300"
                            title="Satellite Tracking"
                          >
                            <Satellite className="h-3 w-3 mr-1" />
                            Satellite
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmergency('binary')}
                            className="text-xs text-red-400 hover:text-red-300"
                            title="Binary Analyzer"
                          >
                            <Binary className="h-3 w-3 mr-1" />
                            Binary
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmergency('wifi')}
                            className="text-xs text-indigo-400 hover:text-indigo-300"
                            title="WiFi Analyzer"
                          >
                            <Wifi className="h-3 w-3 mr-1" />
                            WiFi
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowASCIIStream(true)}
                            className="text-xs text-cyan-400 hover:text-cyan-300"
                            title="ASCII Live Stream"
                          >
                            <Monitor className="h-3 w-3 mr-1" />
                            Stream
                          </Button>
                          {isMobile && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEmergency('smartphone')}
                              className="text-xs text-pink-400 hover:text-pink-300"
                              title="Mobile Tools"
                            >
                              <Smartphone className="h-3 w-3 mr-1" />
                              Mobile
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmergency('wand')}
                            className="text-xs text-emerald-400 hover:text-emerald-300"
                            title="Auto Tools"
                          >
                            <Wand2 className="h-3 w-3 mr-1" />
                            Auto
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmergency('gauge')}
                            className="text-xs text-blue-500 hover:text-blue-400"
                            title="Performance Monitor"
                          >
                            <Gauge className="h-3 w-3 mr-1" />
                            Monitor
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmergency('lifebuoy')}
                            className="text-xs text-red-500 hover:text-red-400"
                            title="Emergency Tools"
                          >
                            <LifeBuoy className="h-3 w-3 mr-1" />
                            Emergency
                          </Button>
                        </div>
                        
                        <div>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 text-xs md:text-sm text-muted-foreground hover:text-white"
                            onClick={() => setShowThemeTest(!showThemeTest)}
                          >
                            © 2025 jawta
                          </Button>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </>
            )}
          </>
        )}
        
        {/* Vision UI detection component */}
        <VisionUIDetection />
      </div>
    </BackgroundPattern>
  );
}

// Export the wrapped application
export default function App() {
  return (
    <VisionProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </VisionProvider>
  );
}