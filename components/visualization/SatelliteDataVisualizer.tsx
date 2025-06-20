
import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowUpRight, Satellite } from 'lucide-react';

interface SatelliteDataVisualizerProps {
  satelliteData?: {
    satellite: string;
    packetCount: number;
    packets: Array<{
      id: string;
      satelliteId: string;
      timestamp: string;
      dataType: string;
      signalStrength: number;
      frequency: string;
      data: string;
    }>;
    signal: {
      frequency: string;
      snr: string;
      elevation: string;
      doppler: string;
    };
  };
  isLive?: boolean;
}

export function SatelliteDataVisualizer({
  satelliteData,
  isLive = false
}: SatelliteDataVisualizerProps) {
  if (!satelliteData || !satelliteData.packets || satelliteData.packets.length === 0) {
    return (
      <div className="border border-border rounded-md p-8 flex flex-col items-center justify-center min-h-[300px] bg-muted/20">
        <Satellite className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
        <p className="text-muted-foreground">No satellite data available</p>
        {isLive && (
          <p className="text-xs text-muted-foreground mt-2">Scanning for satellite transmissions...</p>
        )}
      </div>
    );
  }
  
  // Format timestamp to readable format
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch (e) {
      return isoString;
    }
  };
  
  // Color based on signal strength
  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'bg-green-500';
    if (strength >= 60) return 'bg-emerald-500';
    if (strength >= 40) return 'bg-yellow-500';
    if (strength >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Satellite className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{satelliteData.satellite}</h3>
          <Badge variant="outline" className="ml-2">
            {satelliteData.packetCount} packets
          </Badge>
        </div>
        
        <div className="flex gap-2 text-xs">
          <Badge variant="secondary" className="whitespace-nowrap">
            {satelliteData.signal.frequency}
          </Badge>
          <Badge variant="secondary" className="whitespace-nowrap">
            SNR: {satelliteData.signal.snr}
          </Badge>
          <Badge variant="secondary" className="whitespace-nowrap">
            Elev: {satelliteData.signal.elevation}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        {satelliteData.packets.map((packet) => (
          <Card key={packet.id} className="overflow-hidden">
            <div className={`h-1 ${getSignalColor(packet.signalStrength)}`} />
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                    {packet.dataType}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(packet.timestamp)}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex gap-1 items-center">
                    <div className="flex h-2 items-center gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className={`w-1 h-${Math.min(5, Math.max(1, Math.ceil(packet.signalStrength / 25) + 1 - i))} 
                            ${i <= Math.ceil(packet.signalStrength / 25) ? 'bg-primary' : 'bg-muted'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs ml-1">{packet.signalStrength}%</span>
                  </div>
                </div>
              </div>
              
              <div className="font-mono text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                {packet.data}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {isLive && (
        <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
          <span className={`inline-block h-2 w-2 rounded-full bg-green-500 ${isLive ? 'animate-pulse' : ''}`}></span>
          Live reception - {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
