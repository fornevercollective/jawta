import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ChevronLeft, 
  Sliders, 
  BrainCircuit, 
  Save, 
  Clock, 
  Shield, 
  Rocket,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Radio
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { WaveformVisualizer } from '../visualization/WaveformVisualizer';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useVision } from '../vision/VisionProvider';
import { Card } from '../ui/card';

interface BurstSettingsPageProps {
  onBack: () => void;
}

export function BurstSettingsPage({ onBack }: BurstSettingsPageProps) {
  const { isVisionOS } = useVision();
  const [compressionLevel, setCompressionLevel] = useState<number>(70);
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(true);
  const [aiAssisted, setAiAssisted] = useState<boolean>(true);
  const [burstFrequency, setBurstFrequency] = useState<number>(5);
  const [activeBurstType, setActiveBurstType] = useState<'quick' | 'standard' | 'secure'>('standard');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [redundancy, setRedundancy] = useState<number>(30);
  const [errorCorrection, setErrorCorrection] = useState<number>(50);
  const [bandwidth, setBandwidth] = useState<number>(75);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [burstPreview, setBurstPreview] = useState<string>('');
  
  // Simulated burst preview data
  const burstPreviews = {
    quick: "BURST-QUICK<01FD94><n:jawta><c:4><d:05-28><A4D2F1B9>",
    standard: "BURST-STD<02AC18><n:jawta><c:6><d:05-28><enc+><ai+><l:70%><err:50><A4D2F1B9EEFF34>",
    secure: "BURST-SEC<03BE47><n:jawta><c:8><d:05-28><enc+><ai+><l:70%><err:50><r:30><bdw:75><A4D2F1B9EEFF3412675309>"
  };
  
  // Update burst preview when settings change
  useEffect(() => {
    setBurstPreview(burstPreviews[activeBurstType]);
  }, [activeBurstType]);
  
  // Apply preset configurations when burst type changes
  useEffect(() => {
    switch (activeBurstType) {
      case 'quick':
        setCompressionLevel(90);
        setEncryptionEnabled(false);
        setAiAssisted(true);
        setBurstFrequency(8);
        setRedundancy(10);
        setErrorCorrection(30);
        setBandwidth(90);
        break;
      case 'standard':
        setCompressionLevel(70);
        setEncryptionEnabled(true);
        setAiAssisted(true);
        setBurstFrequency(5);
        setRedundancy(30);
        setErrorCorrection(50);
        setBandwidth(75);
        break;
      case 'secure':
        setCompressionLevel(50);
        setEncryptionEnabled(true);
        setAiAssisted(true);
        setBurstFrequency(3);
        setRedundancy(50);
        setErrorCorrection(70);
        setBandwidth(60);
        break;
    }
  }, [activeBurstType]);
  
  // Simulate burst transmission
  const handleSimulate = () => {
    setIsSimulating(true);
    
    // Simulated completion after 3 seconds
    setTimeout(() => {
      setIsSimulating(false);
    }, 3000);
  };
  
  // Get color for compression efficiency indicator
  const getCompressionEfficiencyColor = () => {
    if (compressionLevel < 40) return 'bg-red-500';
    if (compressionLevel < 70) return 'bg-yellow-400';
    return 'bg-green-500';
  };
  
  // Calculate effective data rate based on settings
  const calculateDataRate = () => {
    const base = burstFrequency * 5; // Base data rate in kbps
    const compressionFactor = compressionLevel / 100;
    const bandwidthFactor = bandwidth / 100;
    
    return Math.round(base * compressionFactor * bandwidthFactor);
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black border-b border-border/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="mr-3 rounded-full h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            <h1 className="text-lg font-medium">Burst Settings</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isSimulating ? "default" : "outline"}
            size="sm"
            disabled={isSimulating}
            onClick={handleSimulate}
            className="h-8"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-1" />
                <span>Test Burst</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 px-4 py-4 md:max-w-4xl md:mx-auto w-full">
        {/* Visualization */}
        <div className="mb-4 border border-border/30 rounded-lg bg-black/20 p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1.5 text-yellow-400" />
              <h2 className="text-sm font-medium">Burst Signal</h2>
            </div>
            <Badge variant="outline" className="bg-black/40">
              {activeBurstType.toUpperCase()}
            </Badge>
          </div>
          
          <div className="h-36">
            <WaveformVisualizer 
              isActive={isSimulating} 
              volume={compressionLevel} 
            />
          </div>
          
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-1.5">Compression:</span>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${getCompressionEfficiencyColor()} mr-1`}></div>
                  <span>{compressionLevel}%</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-1.5">Data Rate:</span>
                <span>{calculateDataRate()} kbps</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-1.5">Frequency:</span>
                <span>{burstFrequency} Hz</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for settings */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-2 h-10 bg-black border border-border/30 rounded-lg p-0.5">
            <TabsTrigger 
              value="basic" 
              className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)]"
            >
              Basic Settings
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)]"
            >
              Advanced
            </TabsTrigger>
          </TabsList>
          
          {/* Basic Settings Tab */}
          <TabsContent value="basic" className="mt-4">
            {/* Burst Type Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Radio className="h-4 w-4 mr-1.5 text-blue-400" />
                <span>Burst Type</span>
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className={`flex flex-col items-center justify-center h-20 rounded-xl border border-border/30 transition-all duration-200 ${activeBurstType === 'quick' ? 'bg-[rgba(45,45,45,0.6)] border-yellow-500/50' : 'bg-black'}`}
                  onClick={() => setActiveBurstType('quick')}
                >
                  <Clock className={`h-5 w-5 mb-1.5 ${activeBurstType === 'quick' ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                  <span className="text-xs">Quick</span>
                </Button>
                
                <Button
                  variant="outline"
                  className={`flex flex-col items-center justify-center h-20 rounded-xl border border-border/30 transition-all duration-200 ${activeBurstType === 'standard' ? 'bg-[rgba(45,45,45,0.6)] border-blue-500/50' : 'bg-black'}`}
                  onClick={() => setActiveBurstType('standard')}
                >
                  <Zap className={`h-5 w-5 mb-1.5 ${activeBurstType === 'standard' ? 'text-blue-400' : 'text-muted-foreground'}`} />
                  <span className="text-xs">Standard</span>
                </Button>
                
                <Button
                  variant="outline"
                  className={`flex flex-col items-center justify-center h-20 rounded-xl border border-border/30 transition-all duration-200 ${activeBurstType === 'secure' ? 'bg-[rgba(45,45,45,0.6)] border-green-500/50' : 'bg-black'}`}
                  onClick={() => setActiveBurstType('secure')}
                >
                  <Shield className={`h-5 w-5 mb-1.5 ${activeBurstType === 'secure' ? 'text-green-400' : 'text-muted-foreground'}`} />
                  <span className="text-xs">Secure</span>
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                {activeBurstType === 'quick' && "Optimized for speed with minimal overhead. Best for time-sensitive data."}
                {activeBurstType === 'standard' && "Balanced compression and security for general use. Recommended for most scenarios."}
                {activeBurstType === 'secure' && "Maximum security with additional redundancy. Slower but more resilient transmission."}
              </div>
            </div>
            
            {/* Compression Settings */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <BrainCircuit className="h-4 w-4 mr-1.5 text-purple-400" />
                <span>Compression Settings</span>
              </h3>
              
              <div className="space-y-5 bg-black/20 border border-border/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Sliders className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-sm">Compression Level</span>
                    </div>
                    <span className="text-sm font-medium">{compressionLevel}%</span>
                  </div>
                  <Slider
                    value={[compressionLevel]}
                    min={10}
                    max={90}
                    step={5}
                    onValueChange={(values) => setCompressionLevel(values[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Size Priority</span>
                    <span>Quality Priority</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Enable Encryption</span>
                  </div>
                  <Switch
                    checked={encryptionEnabled}
                    onCheckedChange={setEncryptionEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">AI-Assisted Compression</span>
                  </div>
                  <Switch
                    checked={aiAssisted}
                    onCheckedChange={setAiAssisted}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-sm">Burst Frequency</span>
                    </div>
                    <span className="text-sm font-medium">{burstFrequency} Hz</span>
                  </div>
                  <Slider
                    value={[burstFrequency]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(values) => setBurstFrequency(values[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="mt-4">
            {/* Advanced transmission settings */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Sliders className="h-4 w-4 mr-1.5 text-indigo-400" />
                <span>Advanced Transmission Settings</span>
              </h3>
              
              <div className="space-y-5 bg-black/20 border border-border/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm">Signal Redundancy</span>
                    </div>
                    <span className="text-sm font-medium">{redundancy}%</span>
                  </div>
                  <Slider
                    value={[redundancy]}
                    min={5}
                    max={80}
                    step={5}
                    onValueChange={(values) => setRedundancy(values[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Minimal</span>
                    <span>Maximum</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm">Error Correction</span>
                    </div>
                    <span className="text-sm font-medium">{errorCorrection}%</span>
                  </div>
                  <Slider
                    value={[errorCorrection]}
                    min={10}
                    max={90}
                    step={5}
                    onValueChange={(values) => setErrorCorrection(values[0])}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm">Bandwidth Allocation</span>
                    </div>
                    <span className="text-sm font-medium">{bandwidth}%</span>
                  </div>
                  <Slider
                    value={[bandwidth]}
                    min={20}
                    max={100}
                    step={5}
                    onValueChange={(values) => setBandwidth(values[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            {/* Burst Signal Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Info className="h-4 w-4 mr-1.5 text-blue-400" />
                <span>Burst Signal Preview</span>
              </h3>
              
              <div className="bg-black/30 border border-border/30 rounded-lg p-3">
                <div className="font-mono text-xs text-green-400 bg-[rgba(0,20,0,0.3)] p-2 rounded border border-green-900/30 overflow-x-auto scrollbar-hide">
                  {burstPreview}
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Estimated Size:</span>
                    <span>{128 - Math.floor(compressionLevel * 0.8)} bytes</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Transmission Time:</span>
                    <span>{(5 / burstFrequency).toFixed(2)} seconds</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Success Rate:</span>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${errorCorrection > 60 ? 'bg-green-500' : errorCorrection > 30 ? 'bg-yellow-500' : 'bg-red-500'} mr-1`}></div>
                      <span>{85 + Math.floor(errorCorrection / 5)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="sticky bottom-4 mt-4 flex gap-3">
          <Button className="flex-1" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Cancel</span>
          </Button>
          
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onBack}>
            <Save className="h-4 w-4 mr-1" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}