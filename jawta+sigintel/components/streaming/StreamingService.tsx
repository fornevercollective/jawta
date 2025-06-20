import React, { useState } from 'react';
import { 
  Search, 
  Headphones, 
  Radio as RadioIcon, 
  Music, 
  Podcast,
  Antenna,
  Wifi,
  History,
  Clock,
  Star,
  Heart
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { StreamingCategoryTabs } from './StreamingCategoryTabs';
import { RadioStationList } from './RadioStationList';
import { PodcastDirectory } from './PodcastDirectory';
import { MusicStreaming } from './MusicStreaming';
import { RadioStreamPlayer, RadioStation, PodcastEpisode } from './RadioStreamPlayer';

// Mock radio stations
const mockRadioStations: RadioStation[] = [
  { 
    id: 'r1', 
    name: 'Public Radio One', 
    frequency: '90.5 FM', 
    genre: 'News',
    streamUrl: '#',
    location: 'National',
    isLive: true
  },
  { 
    id: 'r2', 
    name: 'Classic 103.7', 
    frequency: '103.7 FM', 
    genre: 'Classical',
    streamUrl: '#',
    location: 'Boston, MA',
    isLive: true
  },
  { 
    id: 'r3', 
    name: 'Jazz 88', 
    frequency: '88.1 FM', 
    genre: 'Jazz',
    streamUrl: '#',
    location: 'New York, NY',
    isLive: true,
    isFavorite: true
  },
  { 
    id: 'r4', 
    name: 'Rock 97.1', 
    frequency: '97.1 FM', 
    genre: 'Rock',
    streamUrl: '#',
    location: 'Chicago, IL',
    isLive: true
  },
  { 
    id: 'r5', 
    name: 'Talk 770', 
    frequency: '770 AM', 
    genre: 'Talk',
    streamUrl: '#',
    location: 'Atlanta, GA',
    isLive: true
  },
  { 
    id: 'r6', 
    name: 'Indie 105.3', 
    frequency: '105.3 FM', 
    genre: 'Indie',
    streamUrl: '#',
    location: 'Portland, OR',
    isLive: true
  },
  { 
    id: 'r7', 
    name: 'Country 94.5', 
    frequency: '94.5 FM', 
    genre: 'Country',
    streamUrl: '#',
    location: 'Nashville, TN',
    isLive: true
  },
  { 
    id: 'r8', 
    name: 'Urban Beat 102.3', 
    frequency: '102.3 FM', 
    genre: 'Hip Hop',
    streamUrl: '#',
    location: 'Los Angeles, CA',
    isLive: true,
    isFavorite: true
  },
  { 
    id: 'r9', 
    name: 'Smooth Jazz 91.1', 
    frequency: '91.1 FM', 
    genre: 'Jazz',
    streamUrl: '#',
    location: 'San Francisco, CA',
    isLive: true
  },
  { 
    id: 'r10', 
    name: 'News Talk 106.7', 
    frequency: '106.7 FM', 
    genre: 'News',
    streamUrl: '#',
    location: 'Washington, DC',
    isLive: true
  },
];

// Mock podcast episodes
const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: 'p1',
    title: 'The Future of Signal Processing',
    showName: 'Signal Science',
    duration: '52:37',
    totalDuration: 3157,
    streamUrl: '#',
    publishDate: '2025-05-15',
    isFavorite: true
  },
  {
    id: 'p2',
    title: 'Mastering RF Communication',
    showName: 'Signal Science',
    duration: '45:14',
    totalDuration: 2714,
    streamUrl: '#',
    publishDate: '2025-05-08'
  },
  {
    id: 'p3',
    title: 'Tech Trends for 2025',
    showName: 'Digital Horizons',
    duration: '67:22',
    totalDuration: 4042,
    streamUrl: '#',
    publishDate: '2025-05-20'
  },
  {
    id: 'p4',
    title: 'Quantum Computing Explained',
    showName: 'Digital Horizons',
    duration: '58:17',
    totalDuration: 3497,
    streamUrl: '#',
    publishDate: '2025-05-13'
  },
  {
    id: 'p5',
    title: 'Radio History Part 1',
    showName: 'Broadcasting Past',
    duration: '48:05',
    totalDuration: 2885,
    streamUrl: '#',
    publishDate: '2025-04-30'
  },
  {
    id: 'p6',
    title: 'The Dawn of Digital Radio',
    showName: 'Broadcasting Past',
    duration: '51:42',
    totalDuration: 3102,
    streamUrl: '#',
    publishDate: '2025-05-07'
  },
  {
    id: 'p7',
    title: 'Steganography Techniques',
    showName: 'Crypto & Security',
    duration: '63:19',
    totalDuration: 3799,
    streamUrl: '#',
    publishDate: '2025-05-18'
  },
  {
    id: 'p8',
    title: 'Secure Communications 101',
    showName: 'Crypto & Security',
    duration: '54:28',
    totalDuration: 3268,
    streamUrl: '#',
    publishDate: '2025-05-11'
  },
];

export function StreamingService() {
  const [activeCategory, setActiveCategory] = useState('radio');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [stations, setStations] = useState<RadioStation[]>(mockRadioStations);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(mockPodcastEpisodes);
  
  // Toggle favorite status for a radio station
  const toggleStationFavorite = (stationId: string) => {
    setStations(stations.map(station => 
      station.id === stationId 
        ? { ...station, isFavorite: !station.isFavorite } 
        : station
    ));
    
    if (currentStation?.id === stationId) {
      setCurrentStation({
        ...currentStation,
        isFavorite: !currentStation.isFavorite
      });
    }
  };
  
  // Toggle favorite status for a podcast episode
  const toggleEpisodeFavorite = (episodeId: string) => {
    setEpisodes(episodes.map(episode => 
      episode.id === episodeId 
        ? { ...episode, isFavorite: !episode.isFavorite } 
        : episode
    ));
    
    if (currentEpisode?.id === episodeId) {
      setCurrentEpisode({
        ...currentEpisode,
        isFavorite: !currentEpisode.isFavorite
      });
    }
  };
  
  // Select a radio station to play
  const handleSelectStation = (station: RadioStation) => {
    setCurrentStation(station);
    setCurrentEpisode(null);
  };
  
  // Select a podcast episode to play
  const handleSelectEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
    setCurrentStation(null);
  };
  
  // Render different content based on active category
  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'radio':
        return (
          <RadioStationList 
            stations={stations}
            onSelectStation={handleSelectStation}
            onToggleFavorite={toggleStationFavorite}
            activeStationId={currentStation?.id}
          />
        );
      case 'podcasts':
        return (
          <PodcastDirectory 
            episodes={episodes}
            onSelectEpisode={handleSelectEpisode}
            onToggleFavorite={toggleEpisodeFavorite}
            activeEpisodeId={currentEpisode?.id}
          />
        );
      case 'music':
        return (
          <MusicStreaming 
            onSelectProvider={(provider) => {
              // In a real app, this would connect to the streaming service
              console.log(`Connect to ${provider.name}`);
            }}
          />
        );
      case 'featured':
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-1.5 text-yellow-400" />
              <span>Featured Content</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border/20 bg-black/20 rounded-lg p-4">
                <h4 className="font-medium flex items-center mb-3">
                  <RadioIcon className="h-4 w-4 mr-1.5 text-blue-400" />
                  <span>Popular Radio Stations</span>
                </h4>
                {stations.filter(s => s.isFavorite).slice(0, 3).map(station => (
                  <div 
                    key={station.id}
                    className="flex items-center justify-between py-2 border-b border-border/10 last:border-0"
                    onClick={() => handleSelectStation(station)}
                  >
                    <div>
                      <div className="font-medium">{station.name}</div>
                      <div className="text-xs text-muted-foreground">{station.frequency} - {station.location}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-400">
                      <Antenna className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="border border-border/20 bg-black/20 rounded-lg p-4">
                <h4 className="font-medium flex items-center mb-3">
                  <Podcast className="h-4 w-4 mr-1.5 text-purple-400" />
                  <span>Featured Podcasts</span>
                </h4>
                {episodes.filter(e => e.isFavorite).slice(0, 3).map(episode => (
                  <div 
                    key={episode.id}
                    className="flex items-center justify-between py-2 border-b border-border/10 last:border-0"
                    onClick={() => handleSelectEpisode(episode)}
                  >
                    <div>
                      <div className="font-medium">{episode.title}</div>
                      <div className="text-xs text-muted-foreground">{episode.showName} - {episode.duration}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-purple-400">
                      <Headphones className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border border-border/20 bg-black/20 rounded-lg p-4">
              <h4 className="font-medium flex items-center mb-3">
                <History className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>Recently Played</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[...stations.slice(0, 2), ...episodes.slice(0, 1)].map((item) => {
                  const isStation = 'frequency' in item;
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center gap-2 p-2 border border-border/10 rounded-md"
                      onClick={() => isStation 
                        ? handleSelectStation(item as RadioStation) 
                        : handleSelectEpisode(item as PodcastEpisode)
                      }
                    >
                      <div className="h-8 w-8 rounded bg-black/40 flex items-center justify-center flex-shrink-0">
                        {isStation ? (
                          <RadioIcon className="h-4 w-4 text-blue-400" />
                        ) : (
                          <Podcast className="h-4 w-4 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium truncate">
                          {isStation ? (item as RadioStation).name : (item as PodcastEpisode).title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {isStation 
                            ? (item as RadioStation).frequency 
                            : (item as PodcastEpisode).showName
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'favorites':
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-1.5 text-yellow-400" />
              <span>My Library</span>
            </h3>
            
            <div className="space-y-4">
              <div className="border border-border/20 bg-black/20 rounded-lg p-4">
                <h4 className="font-medium flex items-center mb-3">
                  <RadioIcon className="h-4 w-4 mr-1.5 text-blue-400" />
                  <span>Favorite Radio Stations</span>
                </h4>
                {stations.filter(s => s.isFavorite).length > 0 ? (
                  <div className="space-y-2">
                    {stations.filter(s => s.isFavorite).map(station => (
                      <div 
                        key={station.id}
                        className="flex items-center justify-between py-2"
                        onClick={() => handleSelectStation(station)}
                      >
                        <div className="flex items-center">
                          <RadioIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{station.name}</div>
                            <div className="text-xs text-muted-foreground">{station.frequency} - {station.location}</div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStationFavorite(station.id);
                          }}
                        >
                          <Heart className="h-4 w-4" fill="currentColor" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No favorite stations yet.</p>
                )}
              </div>
              
              <div className="border border-border/20 bg-black/20 rounded-lg p-4">
                <h4 className="font-medium flex items-center mb-3">
                  <Podcast className="h-4 w-4 mr-1.5 text-purple-400" />
                  <span>Favorite Podcasts</span>
                </h4>
                {episodes.filter(e => e.isFavorite).length > 0 ? (
                  <div className="space-y-2">
                    {episodes.filter(e => e.isFavorite).map(episode => (
                      <div 
                        key={episode.id}
                        className="flex items-center justify-between py-2"
                        onClick={() => handleSelectEpisode(episode)}
                      >
                        <div className="flex items-center">
                          <Podcast className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{episode.title}</div>
                            <div className="text-xs text-muted-foreground">{episode.showName} - {episode.duration}</div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEpisodeFavorite(episode.id);
                          }}
                        >
                          <Heart className="h-4 w-4" fill="currentColor" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No favorite podcasts yet.</p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Select a category to browse content</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Global search bar */}
      {activeCategory !== 'podcasts' && activeCategory !== 'music' && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeCategory === 'radio' ? 'radio stations' : 'content'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/30"
          />
        </div>
      )}
      
      {/* Category tabs */}
      <StreamingCategoryTabs 
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />
      
      {/* Currently playing media */}
      {(currentStation || currentEpisode) && (
        <RadioStreamPlayer 
          station={currentStation || undefined}
          episode={currentEpisode || undefined}
          isLive={!!currentStation}
          onFavorite={(id) => {
            if (currentStation) {
              toggleStationFavorite(id);
            } else if (currentEpisode) {
              toggleEpisodeFavorite(id);
            }
          }}
          onNext={() => {
            // In a real app, this would play the next episode
            if (currentEpisode) {
              const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
              if (currentIndex < episodes.length - 1) {
                setCurrentEpisode(episodes[currentIndex + 1]);
              }
            }
          }}
          onPrevious={() => {
            // In a real app, this would play the previous episode
            if (currentEpisode) {
              const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
              if (currentIndex > 0) {
                setCurrentEpisode(episodes[currentIndex - 1]);
              }
            }
          }}
        />
      )}
      
      {/* Category-specific content */}
      {renderCategoryContent()}
    </div>
  );
}