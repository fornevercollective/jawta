import React from 'react';
import { RadioStation } from './RadioStreamPlayer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Radio, Signal, Heart, PlayCircle, Globe } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface RadioStationListProps {
  stations: RadioStation[];
  onSelectStation: (station: RadioStation) => void;
  onToggleFavorite: (stationId: string) => void;
  activeStationId?: string;
}

export function RadioStationList({
  stations,
  onSelectStation,
  onToggleFavorite,
  activeStationId
}: RadioStationListProps) {
  const groupedStations = React.useMemo(() => {
    const groups: Record<string, RadioStation[]> = {};
    
    stations.forEach(station => {
      const genre = station.genre || 'Uncategorized';
      if (!groups[genre]) {
        groups[genre] = [];
      }
      groups[genre].push(station);
    });
    
    return groups;
  }, [stations]);

  return (
    <ScrollArea className="h-[calc(100vh-350px)] pr-4">
      <div className="space-y-6">
        {Object.entries(groupedStations).map(([genre, stationGroup]) => (
          <div key={genre} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{genre}</h3>
            <div className="space-y-1">
              {stationGroup.map(station => (
                <div 
                  key={station.id}
                  className={`flex items-center justify-between rounded-lg p-2 ${
                    activeStationId === station.id 
                      ? 'bg-[rgba(45,45,45,0.6)]' 
                      : 'hover:bg-black/30'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-black/50 rounded flex items-center justify-center flex-shrink-0">
                      {station.logoUrl ? (
                        <img 
                          src={station.logoUrl} 
                          alt={station.name} 
                          className="w-full h-full object-cover rounded" 
                        />
                      ) : (
                        <Radio className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h4 className="font-medium truncate">{station.name}</h4>
                        {station.isLive && (
                          <Badge className="ml-2 bg-red-500/20 text-red-400 text-[10px] h-4 px-1">LIVE</Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {station.frequency && (
                          <div className="flex items-center mr-2">
                            <Signal className="h-3 w-3 mr-0.5" />
                            <span>{station.frequency}</span>
                          </div>
                        )}
                        {station.location && (
                          <div className="flex items-center">
                            <Globe className="h-3 w-3 mr-0.5" />
                            <span>{station.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 rounded-full ${station.isFavorite ? 'text-red-400' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(station.id);
                      }}
                    >
                      <Heart className="h-3.5 w-3.5" fill={station.isFavorite ? 'currentColor' : 'none'} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-blue-400"
                      onClick={() => onSelectStation(station)}
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}