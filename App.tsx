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
  Signal
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
    'text-conversion'
  >('main');
  const { isVisionOS, applyTranslucent } = useVision();
  const { isMobile } = useResponsive();
  const [searchQuery, setSearchQuery] = useState(''); // Added search state for App.tsx
  const [showThemeTest, setShowThemeTest] = useState(false); // For testing theme
  
  // Handle tab changes from quick access panel
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Toggle transmission state
  const handleStartStop = () => {
    setIsTransmitting(!isTransmitting);
  };
  
  // Handle navigation to specific pages
  const handleNavigate = (page: 'main' | 'walkie-talkie' | 'burst-settings' | 'live-radio-intel' | 'streaming-control-center' | 'text-conversion') => {
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
                      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <SoundWaveLogo size={16} />
                          <p className="text-xs md:text-sm">
                            sig+intel app
                          </p>
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