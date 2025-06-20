import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal, 
  Radio,
  Music, 
  Podcast, 
  Zap, 
  BarChart2, 
  Globe, 
  ListMusic, 
  Star, 
  SkipForward, 
  SkipBack, 
  Clock, 
  Download, 
  Bookmark, 
  Share2, 
  Search, 
  Plus,
  Users,
  Headphones,
  Signal,
  Mic,
  Wifi,
  Info,
  AlignJustify,
  List,
  MoveHorizontal,
  LucideProps
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { SoundWaveLogo } from '../ui/sound-wave-logo';
import { WaveformVisualizer } from '../visualization/WaveformVisualizer';
import { useResponsive } from '../ui/use-responsive';
import { ScrollArea } from '../ui/scroll-area';
import { Slider } from '../ui/slider';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StreamingControlCenterPageProps {
  onBack?: () => void;
}

// Define category interface with icon as a React component type
interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<LucideProps>;
}

// Define stream interface
interface StreamItem {
  id: string;
  title: string;
  creator: string;
  coverUrl: string;
  type: 'radio' | 'podcast' | 'music' | 'live';
  category?: string;
  listeners?: number;
  duration?: string;
  isLive?: boolean;
}

export function StreamingControlCenterPage({ onBack }: StreamingControlCenterPageProps) {
  // State variables
  const [activeCategory, setActiveCategory] = useState('featured');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<StreamItem | null>(null);
  const [volume, setVolume] = useState(70);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedView, setExpandedView] = useState(false);
  const { isMobile } = useResponsive();
  
  // Define the main categories
  const categories: Category[] = [
    { id: 'featured', name: 'Featured', icon: Star },
    { id: 'radio', name: 'Radio', icon: Radio },
    { id: 'podcasts', name: 'Podcasts', icon: Podcast },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'live', name: 'Live', icon: Zap },
    { id: 'charts', name: 'Charts', icon: BarChart2 },
    { id: 'global', name: 'Global', icon: Globe },
    { id: 'library', name: 'My Library', icon: ListMusic },
  ];
  
  // Featured content for the landing page
  const featuredContent: StreamItem[] = [
    {
      id: 'featured-1',
      title: 'Signal Intelligence Today',
      creator: 'Tech Forward',
      coverUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=500&q=80',
      type: 'podcast',
      listeners: 2458,
    },
    {
      id: 'featured-2',
      title: 'Emergency Broadcast Network',
      creator: 'National Alert System',
      coverUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=500&q=80',
      type: 'radio',
      isLive: true,
      listeners: 4523,
    },
    {
      id: 'featured-3',
      title: 'Ambient Frequencies',
      creator: 'Waves Collective',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80',
      type: 'music',
      duration: '1:23:45',
    },
    {
      id: 'featured-4',
      title: 'The Signal Processing Show',
      creator: 'RF Engineering Network',
      coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=500&q=80',
      type: 'podcast',
      listeners: 1879,
    },
    {
      id: 'featured-5',
      title: 'Global Frequency Scanner',
      creator: 'Worldwide Radio',
      coverUrl: 'https://images.unsplash.com/photo-1620283085278-9f6b8b361989?auto=format&fit=crop&w=500&q=80',
      type: 'live',
      isLive: true,
      listeners: 3217,
    },
    {
      id: 'featured-6',
      title: 'Digital Signal Synthesis',
      creator: 'Electronic Audio Lab',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80',
      type: 'music',
      duration: '58:22',
    },
  ];
  
  // Radio stations
  const radioStations: StreamItem[] = [
    {
      id: 'radio-1',
      title: 'Global Emergency Broadcast',
      creator: 'International Alert Network',
      coverUrl: 'https://images.unsplash.com/photo-1593078165638-b0a132b77a05?auto=format&fit=crop&w=500&q=80',
      type: 'radio',
      isLive: true,
      listeners: 8542,
    },
    {
      id: 'radio-2',
      title: 'HAM Radio Community',
      creator: 'Amateur Radio Network',
      coverUrl: 'https://images.unsplash.com/photo-1593672715438-d88a1cf7a04f?auto=format&fit=crop&w=500&q=80',
      type: 'radio',
      isLive: true,
      listeners: 3254,
    },
    {
      id: 'radio-3',
      title: 'Shortwave Signals',
      creator: 'International Broadcasting',
      coverUrl: 'https://images.unsplash.com/photo-1608321009587-7c3fae1bfd85?auto=format&fit=crop&w=500&q=80',
      type: 'radio',
      isLive: true,
      listeners: 2178,
    },
    {
      id: 'radio-4',
      title: 'VHF Communications',
      creator: 'Local Network',
      coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=500&q=80',
      type: 'radio',
      isLive: true,
      listeners: 1456,
    },
    {
      id: 'radio-5',
      title: 'UHF Scanner',
      creator: 'City Emergency Services',
      coverUrl: 'https://images.unsplash.com/photo-1517373116369-9bdb8cdc9f62?auto=format&fit=crop&w=500&q=80',
      type: 'radio',
      isLive: true,
      listeners: 2865,
    },
    {
      id: 'radio-6',
      title: 'Marine Radio',
      creator: 'Coast Guard Channel',
      coverUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=500&q=80',
      type: 'radio',
      isLive: true,
      listeners: 1965,
    },
  ];
  
  // Podcasts
  const podcasts: StreamItem[] = [
    {
      id: 'podcast-1',
      title: 'Radio Engineering Today',
      creator: 'RF Engineering Network',
      coverUrl: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=500&q=80',
      type: 'podcast',
      duration: '1:45:22',
    },
    {
      id: 'podcast-2',
      title: 'The Signal Processing Show',
      creator: 'Digital Audio Labs',
      coverUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=500&q=80',
      type: 'podcast',
      duration: '58:14',
    },
    {
      id: 'podcast-3',
      title: 'Spectrum Analysis Weekly',
      creator: 'Tech Forward',
      coverUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=500&q=80',
      type: 'podcast',
      duration: '1:12:45',
    },
    {
      id: 'podcast-4',
      title: 'Field Communications',
      creator: 'Emergency Services Network',
      coverUrl: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=500&q=80',
      type: 'podcast',
      duration: '45:33',
    },
    {
      id: 'podcast-5',
      title: 'Digital Signal Theory',
      creator: 'Engineering Academy',
      coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80',
      type: 'podcast',
      duration: '2:05:17',
    },
    {
      id: 'podcast-6',
      title: 'RF Modernization',
      creator: 'Defense Tech Network',
      coverUrl: 'https://images.unsplash.com/photo-1539683255143-73a6b838b106?auto=format&fit=crop&w=500&q=80',
      type: 'podcast',
      duration: '1:23:41',
    },
  ];
  
  // Music playlists
  const musicPlaylists: StreamItem[] = [
    {
      id: 'music-1',
      title: 'Focus Frequencies',
      creator: 'Signal Processing Lab',
      coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=500&q=80',
      type: 'music',
      duration: '2:45:00',
    },
    {
      id: 'music-2',
      title: 'Ambient Waves',
      creator: 'Electronic Artists Collective',
      coverUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&w=500&q=80',
      type: 'music',
      duration: '1:58:30',
    },
    {
      id: 'music-3',
      title: 'Frequency Modulation',
      creator: 'Digital Audio Project',
      coverUrl: 'https://images.unsplash.com/photo-1602848597941-0d3d3a2c9b50?auto=format&fit=crop&w=500&q=80',
      type: 'music',
      duration: '2:12:45',
    },
    {
      id: 'music-4',
      title: 'Radio Waves',
      creator: 'Signal Arts',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80',
      type: 'music',
      duration: '1:34:27',
    },
    {
      id: 'music-5',
      title: 'Analog Signals',
      creator: 'Retro Electronics',
      coverUrl: 'https://images.unsplash.com/photo-1528575950036-63c4853d3f6f?auto=format&fit=crop&w=500&q=80',
      type: 'music',
      duration: '1:47:52',
    },
    {
      id: 'music-6',
      title: 'Digital Harmonics',
      creator: 'Wave Synthesis Project',
      coverUrl: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?auto=format&fit=crop&w=500&q=80',
      type: 'music',
      duration: '2:23:15',
    },
  ];
  
  // Live streams
  const liveStreams: StreamItem[] = [
    {
      id: 'live-1',
      title: 'Field Operations',
      creator: 'Emergency Response Network',
      coverUrl: 'https://images.unsplash.com/photo-1564177426695-8177f1acfb11?auto=format&fit=crop&w=500&q=80',
      type: 'live',
      isLive: true,
      listeners: 3452,
    },
    {
      id: 'live-2',
      title: 'Global Communications',
      creator: 'International Signal Corps',
      coverUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80',
      type: 'live',
      isLive: true,
      listeners: 2789,
    },
    {
      id: 'live-3',
      title: 'Satellite Downlink',
      creator: 'Space Communications Network',
      coverUrl: 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?auto=format&fit=crop&w=500&q=80',
      type: 'live',
      isLive: true,
      listeners: 4127,
    },
    {
      id: 'live-4',
      title: 'Marine Emergency Channel',
      creator: 'Coast Guard Network',
      coverUrl: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=500&q=80',
      type: 'live',
      isLive: true,
      listeners: 1985,
    },
    {
      id: 'live-5',
      title: 'Weather Alerts',
      creator: 'National Weather Service',
      coverUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=500&q=80',
      type: 'live',
      isLive: true,
      listeners: 6521,
    },
    {
      id: 'live-6',
      title: 'Air Traffic Control',
      creator: 'Aviation Network',
      coverUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80',
      type: 'live',
      isLive: true,
      listeners: 3247,
    },
  ];
  
  // Get current content based on active category
  const getCurrentContent = () => {
    switch (activeCategory) {
      case 'featured':
        return featuredContent;
      case 'radio':
        return radioStations;
      case 'podcasts':
        return podcasts;
      case 'music':
        return musicPlaylists;
      case 'live':
        return liveStreams;
      default:
        return featuredContent;
    }
  };
  
  // Function to play a track
  const handlePlay = (track: StreamItem) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  // Function to toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Function to handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Get type icon for stream item
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'radio':
        return <Radio className="h-4 w-4" />;
      case 'podcast':
        return <Podcast className="h-4 w-4" />;
      case 'music':
        return <Music className="h-4 w-4" />;
      case 'live':
        return <Zap className="h-4 w-4" />;
      default:
        return <Music className="h-4 w-4" />;
    }
  };
  
  // Function to render a content card
  const renderContentCard = (item: StreamItem) => {
    return (
      <Card key={item.id} className="bg-black/40 border-border/30 overflow-hidden hover:bg-black/50 transition-colors">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <ImageWithFallback
              src={item.coverUrl}
              alt={item.title}
              className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
            />
            {item.isLive && (
              <Badge className="absolute top-2 right-2 bg-red-500/90 text-white">LIVE</Badge>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-primary/90"
                onClick={() => handlePlay(item)}
              >
                <Play className="h-5 w-5" fill="currentColor" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <CardTitle className="text-sm font-medium line-clamp-1">{item.title}</CardTitle>
          <CardDescription className="text-xs line-clamp-1 flex items-center gap-1 mt-1">
            {getTypeIcon(item.type)}
            {item.creator}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between text-xs text-muted-foreground">
          {item.listeners ? (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {item.listeners.toLocaleString()}
            </span>
          ) : item.duration ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.duration}
            </span>
          ) : (
            <span></span>
          )}
          
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Function to render main content
  const renderContent = () => {
    const content = getCurrentContent();
    
    // If search query is present, filter content
    const filteredContent = searchQuery
      ? content.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.creator.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : content;
      
    if (filteredContent.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search query</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredContent.map(item => renderContentCard(item))}
      </div>
    );
  };
  
  // Helper function to get the active category's icon component
  const getActiveCategoryIcon = () => {
    const category = categories.find(c => c.id === activeCategory);
    if (category) {
      const IconComponent = category.icon;
      return <IconComponent className="h-5 w-5 text-primary" />;
    }
    return null;
  };
  
  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/30 bg-black px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="font-semibold flex items-center">
            <Signal className="h-5 w-5 mr-1.5" />
            Streaming Control Center
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Search className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          
          {isPlaying && (
            <Button variant={isPlaying ? "default" : "outline"} size="sm" onClick={togglePlayPause}>
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </Button>
          )}
        </div>
      </header>
      
      {/* Main container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Category Tabs */}
        <div className="border-b border-border/30 bg-black/30">
          <ScrollArea orientation="horizontal" className="px-4">
            <div className="flex space-x-1 py-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'default' : 'ghost'}
                    size="sm"
                    className={`gap-2 ${activeCategory === category.id ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-white/30' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-auto p-4">
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeCategory}...`}
                className="pl-9 h-10 bg-black/40 border-border/30"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          {/* Category title */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium flex items-center gap-2">
              {getActiveCategoryIcon()}
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8">
                <AlignJustify className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Content grid */}
          {renderContent()}
        </div>
      </div>
      
      {/* Now Playing Bar (if something is playing) */}
      {currentTrack && (
        <div className="border-t border-border/30 bg-black p-2 sm:p-3 flex items-center gap-2">
          <div className="flex items-center flex-1 min-w-0">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <ImageWithFallback 
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="rounded object-cover w-full h-full"
              />
              {currentTrack.isLive && (
                <Badge className="absolute -top-1 -right-1 bg-red-500/90 text-white text-[8px] h-4">LIVE</Badge>
              )}
            </div>
            
            <div className="min-w-0 ml-3">
              <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                {getTypeIcon(currentTrack.type)}
                {currentTrack.creator}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isMobile && (
              <div className="flex items-center gap-6 mr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-primary"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" fill="currentColor" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                  )}
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            
            {isMobile ? (
              <Button
                variant="default"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  className="w-24"
                  onValueChange={(values) => setVolume(values[0])}
                />
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setExpandedView(!expandedView)}
            >
              <MoveHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Mobile & Tablet Version of Player (if expanded) */}
      {expandedView && currentTrack && isMobile && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => setExpandedView(false)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h3 className="font-medium">Now Playing</h3>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 relative mb-6">
              <ImageWithFallback
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              {currentTrack.isLive && (
                <Badge className="absolute top-3 right-3 bg-red-500/90 text-white">LIVE</Badge>
              )}
            </div>
            
            <h2 className="text-xl font-medium text-center">{currentTrack.title}</h2>
            <p className="text-muted-foreground flex items-center gap-1 mt-1 mb-6">
              {getTypeIcon(currentTrack.type)}
              {currentTrack.creator}
            </p>
            
            <div className="w-full max-w-md mb-6">
              <WaveformVisualizer isActive={isPlaying} volume={volume} />
            </div>
            
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                className="h-16 w-16 rounded-full bg-primary"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" fill="currentColor" />
                ) : (
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <Heart className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                className="w-32"
                onValueChange={(values) => setVolume(values[0])}
              />
            </div>
            
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}