
import React, { useState } from 'react';
import { GeohashMap } from './GeohashMap';
import { H3MapVisualization } from './H3MapVisualization';
import { Button } from '../ui/button';
import { Info, MapPin } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface SpatialComparisonMapProps {
  className?: string;
  onUserSelect?: (userId: string) => void;
  selectedUser?: string;
}

export function SpatialComparisonMap({ className = '', onUserSelect, selectedUser }: SpatialComparisonMapProps) {
  const [activeSystem, setActiveSystem] = useState<'geohash' | 'h3'>('geohash');
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>Spatial Mapping System</span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-80">
                <p className="text-xs">
                  Compare Geohash (rectangular grid) with H3 (hexagonal grid) spatial indexing systems. 
                  H3 provides more uniform distance calculations and better handling of edge cases.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
        <div className="flex rounded-lg overflow-hidden border border-border/30 bg-black/40">
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-3 rounded-none ${activeSystem === 'geohash' ? 'bg-black' : 'hover:bg-black/60'}`}
            onClick={() => setActiveSystem('geohash')}
          >
            Geohash
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-3 rounded-none ${activeSystem === 'h3' ? 'bg-black' : 'hover:bg-black/60'}`}
            onClick={() => setActiveSystem('h3')}
          >
            H3 Hex
          </Button>
        </div>
      </div>
      
      {activeSystem === 'geohash' ? (
        <GeohashMap 
          onUserSelect={onUserSelect}
          selectedUser={selectedUser}
        />
      ) : (
        <H3MapVisualization
          onUserSelect={onUserSelect}
          selectedUser={selectedUser}
        />
      )}
      
      <div className="bg-black/20 p-3 rounded-lg border border-border/30">
        <h4 className="text-xs font-medium mb-2">System Comparison</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h5 className="text-xs font-medium mb-1">Geohash</h5>
            <ul className="text-[11px] text-muted-foreground space-y-1">
              <li>• Rectangular grid system</li>
              <li>• Simple prefix-based hierarchy</li>
              <li>• Variable precision (1-12)</li>
              <li>• Uneven cell sizes at borders</li>
              <li>• Efficient string encoding</li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-xs font-medium mb-1">H3</h5>
            <ul className="text-[11px] text-muted-foreground space-y-1">
              <li>• Hexagonal grid system</li>
              <li>• Uniform distance to neighbors</li>
              <li>• Resolution levels (0-15)</li>
              <li>• Consistent cell shapes</li>
              <li>• Better for distance analysis</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-border/20">
          <h5 className="text-[11px] font-medium mb-1">Use Cases</h5>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/30 p-2 rounded">
              <span className="text-[11px]">Geohash Best For:</span>
              <ul className="text-[10px] text-muted-foreground mt-1">
                <li>• Simple location encoding</li>
                <li>• Prefix-based searching</li>
                <li>• Legacy system integration</li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-2 rounded">
              <span className="text-[11px]">H3 Best For:</span>
              <ul className="text-[10px] text-muted-foreground mt-1">
                <li>• Complex spatial analysis</li>
                <li>• Even neighbor distributions</li>
                <li>• Movement pattern analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
