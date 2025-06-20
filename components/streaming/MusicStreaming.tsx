import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Music, Headphones, Star, BarChart2, Disc, ListMusic, Heart } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface MusicStreamingProps {
  providers: StreamingProvider[];
  onSelectProvider: (provider: StreamingProvider) => void;
}

export interface StreamingProvider {
  id: string;
  name: string;
  logoUrl?: string;
  color?: string;
  url: string;
  popular: boolean;
}

// Mock streaming providers
const defaultProviders: StreamingProvider[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    logoUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=100',
    color: '#1DB954',
    url: 'https://open.spotify.com',
    popular: true
  },
  {
    id: 'apple',
    name: 'Apple Music',
    logoUrl: 'https://images.unsplash.com/photo-1696928634052-41aa345ef686?q=80&w=100',
    color: '#FA243C',
    url: 'https://www.apple.com/apple-music/',
    popular: true
  },
  {
    id: 'youtube',
    name: 'YouTube Music',
    logoUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=100',
    color: '#FF0000',
    url: 'https://music.youtube.com',
    popular: true
  },
  {
    id: 'tidal',
    name: 'Tidal',
    logoUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=100',
    color: '#000000',
    url: 'https://tidal.com',
    popular: true
  },
  {
    id: 'deezer',
    name: 'Deezer',
    logoUrl: 'https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?q=80&w=100',
    color: '#00C7F2',
    url: 'https://www.deezer.com',
    popular: false
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    logoUrl: 'https://images.unsplash.com/photo-1563940360116-88814b9aee9d?q=80&w=100',
    color: '#FF5500',
    url: 'https://soundcloud.com',
    popular: false
  },
  {
    id: 'amazon',
    name: 'Amazon Music',
    logoUrl: 'https://images.unsplash.com/photo-1649367500693-bcc3bc61abf5?q=80&w=100',
    color: '#00A8E1',
    url: 'https://music.amazon.com',
    popular: false
  }
];

export function MusicStreaming({ 
  providers = defaultProviders,
  onSelectProvider
}: MusicStreamingProps) {
  const [filter, setFilter] = useState<'all' | 'popular'>('all');
  
  const filteredProviders = filter === 'all' 
    ? providers
    : providers.filter(provider => provider.popular);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Music className="h-4 w-4 mr-2 text-indigo-400" />
          <span>Streaming Services</span>
        </h3>
        
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'popular')}>
          <TabsList className="h-8 bg-black border border-border/30 rounded-lg">
            <TabsTrigger 
              value="all" 
              className="rounded-md text-xs data-[state=active]:bg-[rgba(45,45,45,0.6)]"
            >
              All
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredProviders.map(provider => (
          <Button
            key={provider.id}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-black/30 border-border/20"
            onClick={() => onSelectProvider(provider)}
          >
            <div 
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: provider.color ? `${provider.color}20` : 'rgba(0,0,0,0.2)',
                border: provider.color ? `1px solid ${provider.color}40` : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {provider.logoUrl ? (
                <img 
                  src={provider.logoUrl} 
                  alt={provider.name} 
                  className="h-8 w-8 rounded-full object-contain" 
                />
              ) : (
                <Music className="h-6 w-6" style={{ color: provider.color || '#ffffff' }} />
              )}
            </div>
            <span className="text-sm">{provider.name}</span>
            {provider.popular && (
              <Badge className="text-[10px] bg-black/40 text-white">Popular</Badge>
            )}
          </Button>
        ))}
      </div>
      
      <div className="mt-8 space-y-4">
        <h3 className="font-medium flex items-center">
          <ListMusic className="h-4 w-4 mr-2 text-indigo-400" />
          <span>Curated Playlists</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({length: 6}).map((_, idx) => (
            <div 
              key={idx} 
              className="border border-border/20 bg-black/20 rounded-lg p-3 flex items-center gap-3"
            >
              <div className="w-16 h-16 bg-black/30 rounded flex items-center justify-center">
                <Disc className="h-8 w-8 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-medium">{[
                  "Ambient Focus", 
                  "Deep Work", 
                  "Chill Beats", 
                  "Instrumental Mix", 
                  "Focus Flow", 
                  "Signal Waves"
                ][idx]}</h4>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 50 + 10)} tracks • {Math.floor(Math.random() * 4 + 1)}h {Math.floor(Math.random() * 59)}m
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}