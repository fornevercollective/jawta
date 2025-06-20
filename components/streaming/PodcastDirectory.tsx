import React, { useState } from 'react';
import { PodcastEpisode } from './RadioStreamPlayer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Podcast, Clock, Calendar, Heart, PlayCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface PodcastDirectoryProps {
  episodes: PodcastEpisode[];
  onSelectEpisode: (episode: PodcastEpisode) => void;
  onToggleFavorite: (episodeId: string) => void;
  activeEpisodeId?: string;
}

interface PodcastShow {
  name: string;
  episodes: PodcastEpisode[];
}

export function PodcastDirectory({
  episodes,
  onSelectEpisode,
  onToggleFavorite,
  activeEpisodeId
}: PodcastDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'show' | 'recent' | 'popular'>('show');
  
  // Group episodes by show name 
  const groupedByShow: Record<string, PodcastEpisode[]> = React.useMemo(() => {
    const result: Record<string, PodcastEpisode[]> = {};
    
    episodes.forEach(episode => {
      if (!episode.showName) return;
      
      if (!result[episode.showName]) {
        result[episode.showName] = [];
      }
      
      result[episode.showName].push(episode);
    });
    
    return result;
  }, [episodes]);
  
  // Convert to array for easier sorting and filtering
  const showsArray: PodcastShow[] = React.useMemo(() => {
    return Object.entries(groupedByShow).map(([name, episodes]) => ({
      name,
      episodes
    }));
  }, [groupedByShow]);
  
  // Filter episodes based on search query
  const filteredEpisodes = React.useMemo(() => {
    if (!searchQuery) return episodes;
    
    return episodes.filter(episode => 
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.showName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [episodes, searchQuery]);
  
  // Sort episodes based on sort mode
  const sortedEpisodes = React.useMemo(() => {
    switch (sortMode) {
      case 'recent':
        return [...filteredEpisodes].sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
      case 'popular':
        // In a real app, this would sort by listen count or ratings
        // For now, just shuffle them a bit
        return [...filteredEpisodes].sort((a, b) => a.id.localeCompare(b.id));
      default:
        return filteredEpisodes;
    }
  }, [filteredEpisodes, sortMode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/30"
          />
          <Podcast className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Tabs value={sortMode} onValueChange={(v) => setSortMode(v as 'show' | 'recent' | 'popular')}>
          <TabsList className="h-8 bg-black border border-border/30 rounded-lg">
            <TabsTrigger 
              value="show" 
              className="rounded-md text-xs data-[state=active]:bg-[rgba(45,45,45,0.6)]"
            >
              By Show
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="rounded-md text-xs data-[state=active]:bg-[rgba(45,45,45,0.6)]"
            >
              Most Recent
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="rounded-md text-xs data-[state=active]:bg-[rgba(45,45,45,0.6)]"
            >
              Popular
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="h-[calc(100vh-400px)] pr-4">
        {sortMode === 'show' && !searchQuery ? (
          // Group by show when not searching
          <div className="space-y-6">
            {showsArray.map((show) => (
              <div key={show.name} className="space-y-2">
                <h3 className="text-sm font-medium">{show.name}</h3>
                <div className="space-y-1">
                  {show.episodes.map(episode => (
                    <EpisodeItem 
                      key={episode.id}
                      episode={episode}
                      isActive={activeEpisodeId === episode.id}
                      onSelect={onSelectEpisode}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat list when searching or sorting differently
          <div className="space-y-1">
            {sortedEpisodes.map(episode => (
              <EpisodeItem 
                key={episode.id}
                episode={episode}
                isActive={activeEpisodeId === episode.id}
                onSelect={onSelectEpisode}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface EpisodeItemProps {
  episode: PodcastEpisode;
  isActive: boolean;
  onSelect: (episode: PodcastEpisode) => void;
  onToggleFavorite: (episodeId: string) => void;
}

function EpisodeItem({ episode, isActive, onSelect, onToggleFavorite }: EpisodeItemProps) {
  return (
    <div 
      className={`flex items-center justify-between rounded-lg p-2 ${
        isActive ? 'bg-[rgba(45,45,45,0.6)]' : 'hover:bg-black/30'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-black/50 rounded flex items-center justify-center flex-shrink-0">
          {episode.imageUrl ? (
            <img 
              src={episode.imageUrl} 
              alt={episode.showName} 
              className="w-full h-full object-cover rounded" 
            />
          ) : (
            <Podcast className="h-5 w-5 text-purple-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{episode.title}</h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="mr-2 truncate">{episode.showName}</span>
            
            <div className="flex items-center mr-2">
              <Clock className="h-3 w-3 mr-0.5" />
              <span>{episode.duration}</span>
            </div>
            
            <div className="hidden sm:flex items-center">
              <Calendar className="h-3 w-3 mr-0.5" />
              <span>{new Date(episode.publishDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 rounded-full ${episode.isFavorite ? 'text-red-400' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(episode.id);
          }}
        >
          <Heart className="h-3.5 w-3.5" fill={episode.isFavorite ? 'currentColor' : 'none'} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-purple-400"
          onClick={() => onSelect(episode)}
        >
          <PlayCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}