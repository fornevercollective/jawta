import React, { useState, useCallback, useEffect } from 'react';
import { 
  BarChart2, 
  Link, 
  Unlink, 
  LayoutGrid, 
  MinusSquare, 
  PlusSquare,
  Maximize2,
  Minimize2,
  XCircle,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { SpectrumAnalyzerContainer } from '../visualization/SpectrumAnalyzerContainer';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

// Define feed types (using same types from LiveRadioIntelPage)
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

interface SpectrumTabViewProps {
  feeds: Feed[];
  onBack?: () => void;
  isCollapsed?: boolean;
  initialSelectedFeeds?: string[];
}

export function SpectrumTabView({ feeds, onBack, isCollapsed = false, initialSelectedFeeds = [] }: SpectrumTabViewProps) {
  // Grid layout and feed management
  const [gridSize, setGridSize] = useState<'1x1' | '2x2' | '3x3' | '4x4' | '6x5'>('2x2');
  const [displayedFeeds, setDisplayedFeeds] = useState<string[]>(initialSelectedFeeds);
  const [focusedFeed, setFocusedFeed] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Window linking functionality
  const [isLinkedToOtherWindows, setIsLinkedToOtherWindows] = useState(false);
  const [linkMode, setLinkMode] = useState<'freq' | 'time'>('freq');
  const [linkFrequency, setLinkFrequency] = useState(145.5);
  const [linkTimeScale, setLinkTimeScale] = useState(10); // seconds
  
  // Feed selection UI
  const [isSelectingFeeds, setIsSelectingFeeds] = useState(false);
  const [availableFeeds, setAvailableFeeds] = useState<Feed[]>(feeds);
  const [selectedTab, setSelectedTab] = useState<'grid' | 'focus' | 'settings'>('grid');
  
  // Performance settings
  const [refreshRate, setRefreshRate] = useState(1); // seconds
  const [resolution, setResolution] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Update available feeds when feeds prop changes
  useEffect(() => {
    setAvailableFeeds(feeds);
  }, [feeds]);
  
  // Helper function for grid size
  const getMaxFeedsForGridSize = (size: '1x1' | '2x2' | '3x3' | '4x4' | '6x5'): number => {
    switch (size) {
      case '1x1': return 1;
      case '2x2': return 4;
      case '3x3': return 9;
      case '4x4': return 16;
      case '6x5': return 30;
      default: return 4;
    }
  };
  
  // Helper function for grid style
  const getGridStyle = (size: '1x1' | '2x2' | '3x3' | '4x4' | '6x5'): string => {
    switch (size) {
      case '1x1': return 'grid-cols-1';
      case '2x2': return 'grid-cols-2';
      case '3x3': return 'grid-cols-3';
      case '4x4': return 'grid-cols-4';
      case '6x5': return 'grid-cols-6';
      default: return 'grid-cols-2';
    }
  };
  
  // Handler for grid size change
  const handleGridSizeChange = (newSize: '1x1' | '2x2' | '3x3' | '4x4' | '6x5') => {
    setGridSize(newSize);
    
    // Adjust displayed feeds based on new grid size
    const maxFeeds = getMaxFeedsForGridSize(newSize);
    if (displayedFeeds.length > maxFeeds) {
      setDisplayedFeeds(prev => prev.slice(0, maxFeeds));
    }
  };
  
  // Toggle feed selection UI
  const toggleFeedSelection = () => {
    setIsSelectingFeeds(!isSelectingFeeds);
  };
  
  // Handle toggling a feed in/out of display
  const toggleFeed = (feedId: string) => {
    setDisplayedFeeds(prev => {
      if (prev.includes(feedId)) {
        // Remove feed
        return prev.filter(id => id !== feedId);
      } else {
        // Add feed if we haven't reached the max for current grid size
        const maxFeeds = getMaxFeedsForGridSize(gridSize);
        if (prev.length < maxFeeds) {
          return [...prev, feedId];
        }
        return prev;
      }
    });
  };
  
  // Set focus to a specific feed (expands it to full view)
  const handleFocusFeed = (feedId: string) => {
    setFocusedFeed(feedId);
    setSelectedTab('focus');
  };
  
  // Clear focus and return to grid view
  const handleClearFocus = () => {
    setFocusedFeed(null);
    setSelectedTab('grid');
  };
  
  // Toggle window linking
  const handleToggleWindowLinking = () => {
    setIsLinkedToOtherWindows(!isLinkedToOtherWindows);
  };
  
  // Find a feed by ID
  const getFeedById = (id: string): Feed | undefined => {
    return feeds.find(feed => feed.id === id);
  };
  
  // Get a color class based on signal strength
  const getSignalStrengthClass = (signal: SignalStrength) => {
    switch (signal) {
      case 'strong': return 'signal-strong';
      case 'medium': return 'signal-medium';
      case 'weak': return 'signal-weak';
      case 'poor': return 'signal-poor';
    }
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Controls header */}
      <div className="p-3 border-b border-border/30 flex justify-between items-center bg-black/50">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium flex items-center">
            <BarChart2 className="h-4 w-4 mr-1.5 text-cyan-400" />
            <span>Spectrum Analysis</span>
            {isLinkedToOtherWindows && (
              <Badge className="ml-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
                Linked
              </Badge>
            )}
          </h3>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
            {displayedFeeds.length} / {getMaxFeedsForGridSize(gridSize)} Feeds
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs 
            value={selectedTab} 
            onValueChange={(v) => setSelectedTab(v as 'grid' | 'focus' | 'settings')}
            className="h-10 min-h-[80px]"
          >
            <TabsList className="bg-black/50 h-10 min-h-[80px] p-0.5 border border-white/10">
              <TabsTrigger 
                value="grid" 
                className="px-2 py-1 h-10 min-h-[80px] tab-neon data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600/30 data-[state=active]:to-purple-600/20"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </TabsTrigger>
              <TabsTrigger 
                value="focus" 
                className="px-2 py-1 h-10 min-h-[80px] tab-neon data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600/30 data-[state=active]:to-purple-600/20" 
                disabled={!focusedFeed}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="px-2 py-1 h-10 min-h-[80px] tab-neon data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600/30 data-[state=active]:to-purple-600/20"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 6h9.75M10.5 12h9.75m-9.75 6h9.75M3.75 6H6m-2.25 6H6m-2.25 6H6" />
                </svg>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 min-h-[80px] w-10 p-0 rounded-md view-toggle-btn"
            onClick={handleToggleWindowLinking}
          >
            {isLinkedToOtherWindows ? (
              <Unlink className="h-4 w-4 text-cyan-400" />
            ) : (
              <Link className="h-4 w-4" />
            )}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 min-h-[80px] w-10 p-0 rounded-md view-toggle-btn"
              >
                {gridSize === '1x1' ? (
                  <PlusSquare className="h-4 w-4" />
                ) : (
                  <MinusSquare className="h-4 w-4" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-black border border-white/20" align="end">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Grid Layout</h4>
                <div className="grid grid-cols-5 gap-1">
                  <Button
                    variant={gridSize === '1x1' ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full h-8 ${gridSize === '1x1' ? 'bg-gradient-to-r from-cyan-600/50 to-purple-600/50 border-white/10' : 'bg-black border-white/10'}`}
                    onClick={() => handleGridSizeChange('1x1')}
                  >
                    1×1
                  </Button>
                  <Button
                    variant={gridSize === '2x2' ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full h-8 ${gridSize === '2x2' ? 'bg-gradient-to-r from-cyan-600/50 to-purple-600/50 border-white/10' : 'bg-black border-white/10'}`}
                    onClick={() => handleGridSizeChange('2x2')}
                  >
                    2×2
                  </Button>
                  <Button
                    variant={gridSize === '3x3' ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full h-8 ${gridSize === '3x3' ? 'bg-gradient-to-r from-cyan-600/50 to-purple-600/50 border-white/10' : 'bg-black border-white/10'}`}
                    onClick={() => handleGridSizeChange('3x3')}
                  >
                    3×3
                  </Button>
                  <Button
                    variant={gridSize === '4x4' ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full h-8 ${gridSize === '4x4' ? 'bg-gradient-to-r from-cyan-600/50 to-purple-600/50 border-white/10' : 'bg-black border-white/10'}`}
                    onClick={() => handleGridSizeChange('4x4')}
                  >
                    4×4
                  </Button>
                  <Button
                    variant={gridSize === '6x5' ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full h-8 ${gridSize === '6x5' ? 'bg-gradient-to-r from-cyan-600/50 to-purple-600/50 border-white/10' : 'bg-black border-white/10'}`}
                    onClick={() => handleGridSizeChange('6x5')}
                  >
                    6×5
                  </Button>
                </div>
                <div className="pt-2 text-xs text-muted-foreground">
                  Max feeds: {getMaxFeedsForGridSize(gridSize)}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 min-h-[80px] w-10 p-0 rounded-md view-toggle-btn"
            onClick={toggleFeedSelection}
          >
            {isSelectingFeeds ? (
              <XCircle className="h-4 w-4 text-cyan-400" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Feed selection UI - shown when isSelectingFeeds is true */}
        {isSelectingFeeds && (
          <div className="border-b border-border/30 p-3 bg-black/40 overflow-y-auto max-h-[180px]">
            <h4 className="text-sm font-medium mb-2">Select Feeds</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {availableFeeds
                .filter(feed => feed.type === 'spectrum' && feed.status === 'active')
                .map(feed => (
                  <div 
                    key={feed.id}
                    className={`
                      flex items-center space-x-2 p-2 rounded-md text-xs border 
                      ${displayedFeeds.includes(feed.id) 
                        ? 'bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-cyan-500/40' 
                        : 'bg-black/30 border-border/30 hover:bg-black/50'
                      }
                      min-h-[80px]
                    `}
                  >
                    <Checkbox 
                      id={`feed-${feed.id}`}
                      checked={displayedFeeds.includes(feed.id)}
                      onCheckedChange={() => toggleFeed(feed.id)}
                      disabled={!displayedFeeds.includes(feed.id) && displayedFeeds.length >= getMaxFeedsForGridSize(gridSize)}
                    />
                    <div className="space-y-1 flex-1">
                      <label 
                        htmlFor={`feed-${feed.id}`}
                        className="font-medium leading-none cursor-pointer flex items-center"
                      >
                        <span className={`signal-indicator ${getSignalStrengthClass(feed.signal)}`}></span>
                        {feed.name}
                      </label>
                      <div className="text-[10px] text-muted-foreground">
                        {feed.frequency?.toFixed(1) || '---'} MHz
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        
        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={selectedTab} className="h-full">
            <TabsContent value="grid" className="flex-1 p-1 h-full overflow-hidden m-0">
              <div className={`grid ${getGridStyle(gridSize)} gap-1 h-full`}>
                {/* Empty state */}
                {displayedFeeds.length === 0 && (
                  <div className="col-span-full h-full flex items-center justify-center bg-black/30 rounded-lg border border-border/30">
                    <div className="text-center p-4">
                      <BarChart2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-40" />
                      <h3 className="text-sm font-medium">No Spectrum Feeds Selected</h3>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">
                        Click the eye icon to select feeds to display
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/40 hover:to-purple-600/40 border-white/10 min-h-[80px]"
                        onClick={toggleFeedSelection}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Select Feeds
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Render feeds */}
                {displayedFeeds.map((feedId, index) => {
                  const feed = getFeedById(feedId);
                  if (!feed) return null;
                  
                  return (
                    <div 
                      key={feedId}
                      className={`
                        relative border border-border/20 rounded-md bg-black/60 overflow-hidden
                        hover:border-cyan-500/40 transition-colors duration-200
                        ${gridSize === '6x5' ? 'aspect-[5/3]' : 'aspect-square md:aspect-video'}
                      `}
                    >
                      {/* Feed header */}
                      <div className="absolute top-0 left-0 right-0 z-10 p-1.5 flex justify-between items-center bg-gradient-to-b from-black/80 to-black/0 text-xs">
                        <div className="flex items-center">
                          <span className={`signal-indicator ${getSignalStrengthClass(feed.signal)}`}></span>
                          <span className="truncate max-w-[120px]">{feed.name}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="bg-black/70 border-white/20 text-[10px] py-0 px-1 h-4"
                        >
                          {feed.frequency?.toFixed(1) || '---'} MHz
                        </Badge>
                      </div>
                      
                      {/* Spectrum analyzer */}
                      <div className="w-full h-full pt-6">
                        <SpectrumAnalyzerContainer 
                          isActive={true} 
                          simplified={gridSize === '6x5' || gridSize === '4x4'} 
                          frequency={feed.frequency}
                        />
                      </div>
                      
                      {/* Overlaid controls */}
                      <div className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 transition-opacity duration-150">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 min-h-0 w-8 p-0 bg-black/70 rounded-md"
                            onClick={() => handleFocusFeed(feedId)}
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 min-h-0 w-8 p-0 bg-black/70 rounded-md"
                            onClick={() => toggleFeed(feedId)}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="focus" className="h-full p-0 m-0">
              {focusedFeed ? (
                <div className="h-full flex flex-col">
                  <div className="p-2 border-b border-border/30 flex justify-between items-center bg-black/50">
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const feed = getFeedById(focusedFeed);
                        if (!feed) return null;
                        
                        return (
                          <>
                            <span className={`signal-indicator ${getSignalStrengthClass(feed.signal)}`}></span>
                            <span className="font-medium">{feed.name}</span>
                            <Badge variant="outline" className="bg-black/80 border-white/20">
                              {feed.frequency?.toFixed(3) || '---'} MHz
                            </Badge>
                          </>
                        );
                      })()}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 min-h-[80px] w-10 p-0 rounded-md view-toggle-btn"
                      onClick={handleClearFocus}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 p-2">
                    {(() => {
                      const feed = getFeedById(focusedFeed);
                      if (!feed) return null;
                      
                      return (
                        <SpectrumAnalyzerContainer 
                          isActive={true} 
                          simplified={false}
                          frequency={feed.frequency}
                        />
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p>Select a feed to focus</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/40 hover:to-purple-600/40 border-white/10 min-h-[80px]"
                      onClick={() => setSelectedTab('grid')}
                    >
                      Return to Grid
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="h-full p-4 overflow-auto m-0">
              <div className="space-y-6 max-w-xl mx-auto">
                <div>
                  <h3 className="text-sm font-medium mb-2">Window Linking</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Link Windows Together</h4>
                        <p className="text-xs text-muted-foreground">
                          Synchronize all spectrum windows
                        </p>
                      </div>
                      <Button
                        variant={isLinkedToOtherWindows ? "default" : "outline"}
                        size="sm"
                        className={isLinkedToOtherWindows ? 
                          "bg-gradient-to-r from-cyan-600 to-blue-600 border-white/30 hover:bg-cyan-600" : 
                          "bg-black border-white/10 hover:bg-black/40"
                        }
                      >
                        {isLinkedToOtherWindows ? (
                          <>
                            <Unlink className="h-4 w-4 mr-2" />
                            Linked
                          </>
                        ) : (
                          <>
                            <Link className="h-4 w-4 mr-2" />
                            Not Linked
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {isLinkedToOtherWindows && (
                      <>
                        <div className="space-y-2">
                          <h4 className="text-sm">Link Mode</h4>
                          <div className="flex gap-2">
                            <Button
                              variant={linkMode === 'freq' ? "default" : "outline"}
                              size="sm"
                              className={linkMode === 'freq' ? 
                                "bg-gradient-to-r from-cyan-600/50 to-blue-600/50 border-white/20" : 
                                "bg-black border-white/10"
                              }
                              onClick={() => setLinkMode('freq')}
                            >
                              Frequency
                            </Button>
                            <Button
                              variant={linkMode === 'time' ? "default" : "outline"}
                              size="sm"
                              className={linkMode === 'time' ? 
                                "bg-gradient-to-r from-cyan-600/50 to-blue-600/50 border-white/20" : 
                                "bg-black border-white/10"
                              }
                              onClick={() => setLinkMode('time')}
                            >
                              Time Scale
                            </Button>
                          </div>
                        </div>
                        
                        {linkMode === 'freq' && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <h4 className="text-sm">Link Frequency</h4>
                              <span className="text-sm">{linkFrequency.toFixed(1)} MHz</span>
                            </div>
                            <Slider
                              value={[linkFrequency]}
                              min={30}
                              max={300}
                              step={0.1}
                              onValueChange={(values) => setLinkFrequency(values[0])}
                            />
                          </div>
                        )}
                        
                        {linkMode === 'time' && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <h4 className="text-sm">Time Scale</h4>
                              <span className="text-sm">{linkTimeScale} seconds</span>
                            </div>
                            <Slider
                              value={[linkTimeScale]}
                              min={1}
                              max={60}
                              step={1}
                              onValueChange={(values) => setLinkTimeScale(values[0])}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Performance Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="text-sm">Refresh Rate</h4>
                        <span className="text-sm">{refreshRate} second{refreshRate !== 1 ? 's' : ''}</span>
                      </div>
                      <Slider
                        value={[refreshRate]}
                        min={0.2}
                        max={5}
                        step={0.1}
                        onValueChange={(values) => setRefreshRate(values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower values are more responsive but use more CPU
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm">Resolution</h4>
                      <div className="flex gap-2">
                        <Button
                          variant={resolution === 'low' ? "default" : "outline"}
                          size="sm"
                          className={resolution === 'low' ? 
                            "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border-white/10" : 
                            "bg-black border-white/10"
                          }
                          onClick={() => setResolution('low')}
                        >
                          Low
                        </Button>
                        <Button
                          variant={resolution === 'medium' ? "default" : "outline"}
                          size="sm"
                          className={resolution === 'medium' ? 
                            "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border-white/10" : 
                            "bg-black border-white/10"
                          }
                          onClick={() => setResolution('medium')}
                        >
                          Medium
                        </Button>
                        <Button
                          variant={resolution === 'high' ? "default" : "outline"}
                          size="sm"
                          className={resolution === 'high' ? 
                            "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border-white/10" : 
                            "bg-black border-white/10"
                          }
                          onClick={() => setResolution('high')}
                        >
                          High
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Higher resolution uses more memory but shows more detail
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}