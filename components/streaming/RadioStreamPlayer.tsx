import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Heart, 
  Share2, 
  Download,
  Radio,
  Bookmark,
  Clock,
  Music
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { WaveformVisualizer } from '../visualization/WaveformVisualizer';

interface RadioStreamPlayerProps {
  station?: RadioStation;
  episode?: PodcastEpisode;
  isLive?: boolean;
  onFavorite?: (id: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface RadioStation {
  id: string;
  name: string;
  frequency?: string;
  genre?: string;
  logoUrl?: string;
  streamUrl: string;
  location?: string;
  isFavorite?: boolean;
  isLive: boolean;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  showName: string;
  duration: string;
  currentTime?: number;
  totalDuration?: number;
  imageUrl?: string;
  streamUrl: string;
  publishDate: string;
  isFavorite?: boolean;
}

export function RadioStreamPlayer({ 
  station, 
  episode, 
  isLive = true, 
  onFavorite, 
  onNext, 
  onPrevious 
}: RadioStreamPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Generate some random visualizer data when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        // Generate random values for the visualizer
        const newData = Array(40).fill(0).map(() => Math.random() * 100);
        setVisualizerData(newData);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying]);
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100;
      if (newVolume[0] === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && !isLive) {
      const newTime = value[0];
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleFavorite = () => {
    if (onFavorite && (station || episode)) {
      onFavorite(station?.id || episode?.id || '');
    }
  };
  
  const streamSource = station?.streamUrl || episode?.streamUrl;
  const isEpisode = !!episode;
  const mediaTitle = station?.name || episode?.title || 'Unknown';
  const mediaInfo = station?.frequency || episode?.showName || '';
  const isFavorite = station?.isFavorite || episode?.isFavorite || false;
  const imageUrl = station?.logoUrl || episode?.imageUrl;
  
  return (
    <div className="w-full bg-black/40 border border-border/30 rounded-lg overflow-hidden">
      <audio 
        ref={audioRef} 
        src={streamSource} 
        onTimeUpdate={() => {
          if (audioRef.current && !isLive) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && !isLive) {
            setDuration(audioRef.current.duration);
          }
        }}
      />
      
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Station/Episode Image */}
          <div className="w-16 h-16 flex-shrink-0 bg-black/50 rounded overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt={mediaTitle} className="w-full h-full object-cover" />
            ) : (
              <Radio className="h-8 w-8 text-blue-400" />
            )}
          </div>
          
          {/* Station/Episode Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium truncate">{mediaTitle}</h4>
                <p className="text-sm text-muted-foreground truncate">{mediaInfo}</p>
              </div>
              {isLive && (
                <Badge className="bg-red-500 text-[10px]">LIVE</Badge>
              )}
            </div>
            
            {/* Player Controls */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {!isLive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={onPrevious}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                {!isLive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={onNext}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${isFavorite ? 'text-red-400' : ''}`}
                  onClick={handleFavorite}
                >
                  <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar for podcasts/recordings */}
        {!isLive && (
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={1}
                onValueChange={handleProgressChange}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
        
        {/* Waveform visualizer for live content */}
        {isLive && isPlaying && (
          <div className="mt-3 h-10">
            <WaveformVisualizer 
              data={visualizerData} 
              height={40} 
              width={800}
              barWidth={3}
              barGap={2}
              className="mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}