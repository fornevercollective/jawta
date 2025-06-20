
import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Users, Locate, ZoomIn, ZoomOut, ChevronRight, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

// Mock H3 functions - in production, these would be imported from h3-js
const h3 = {
  geoToH3: (lat: number, lng: number, res: number) => {
    // Mock function - returns a fake H3 index string based on inputs
    return `h3-${res}-${lat.toFixed(2)}-${lng.toFixed(2)}`;
  },
  h3ToGeo: (h3Index: string) => {
    // Mock function - parse our fake H3 index string format
    const parts = h3Index.split('-');
    return [parseFloat(parts[2]), parseFloat(parts[3])];
  },
  h3Distance: (h3Index1: string, h3Index2: string) => {
    // Mock function - calculate "distance" between mock indexes
    const parts1 = h3Index1.split('-');
    const parts2 = h3Index2.split('-');
    const lat1 = parseFloat(parts1[2]);
    const lng1 = parseFloat(parts1[3]);
    const lat2 = parseFloat(parts2[2]);
    const lng2 = parseFloat(parts2[3]);
    
    // Simple Euclidean distance as a mock
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 1000;
  },
  kRing: (h3Index: string, ringSize: number) => {
    // Mock function - generate a ring of indexes around center
    const center = h3Index.split('-');
    const centerLat = parseFloat(center[2]);
    const centerLng = parseFloat(center[3]);
    const res = parseInt(center[1]);
    
    const result = [];
    // Create a simple grid around the center point
    for (let i = -ringSize; i <= ringSize; i++) {
      for (let j = -ringSize; j <= ringSize; j++) {
        // Skip center for rings > 0
        if (ringSize > 0 && i === 0 && j === 0) continue;
        
        // Create a new mock H3 index
        const newLat = centerLat + (i * 0.01);
        const newLng = centerLng + (j * 0.01);
        result.push(`h3-${res}-${newLat.toFixed(2)}-${newLng.toFixed(2)}`);
      }
    }
    
    return result;
  },
  h3ToParent: (h3Index: string, parentRes: number) => {
    // Mock function - create parent cell index at lower resolution
    const parts = h3Index.split('-');
    const lat = parseFloat(parts[2]);
    const lng = parseFloat(parts[3]);
    // Round to simulate lower precision
    const roundedLat = Math.round(lat * 10) / 10;
    const roundedLng = Math.round(lng * 10) / 10;
    return `h3-${parentRes}-${roundedLat.toFixed(2)}-${roundedLng.toFixed(2)}`;
  },
  h3ToChildren: (h3Index: string, childRes: number) => {
    // Mock function - create child cells at higher resolution
    const parts = h3Index.split('-');
    const lat = parseFloat(parts[2]);
    const lng = parseFloat(parts[3]);
    
    const children = [];
    // Create a grid of child cells
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const childLat = lat + (i * 0.01);
        const childLng = lng + (j * 0.01);
        children.push(`h3-${childRes}-${childLat.toFixed(2)}-${childLng.toFixed(2)}`);
      }
    }
    
    return children;
  },
};

// Types
interface H3Cell {
  h3Index: string;
  lat: number;
  lng: number;
  userCount: number;
  signalStrength: 'strong' | 'medium' | 'weak' | 'poor';
  isSelected: boolean;
}

interface User {
  id: string;
  name: string;
  h3Index: string;
  isActive: boolean;
  distance: number;
  lat: number;
  lng: number;
}

interface H3MapVisualizationProps {
  className?: string;
  onUserSelect?: (userId: string) => void;
  selectedUser?: string;
}

export function H3MapVisualization({ className = '', onUserSelect, selectedUser }: H3MapVisualizationProps) {
  // State
  const [resolution, setResolution] = useState(6);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [userH3Index, setUserH3Index] = useState('h3-6-37.77-122.42'); // Mock SF location
  const [grid, setGrid] = useState<H3Cell[][]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState(1000);
  const [showOfflineUsers, setShowOfflineUsers] = useState(true);
  const [autoSelectRegion, setAutoSelectRegion] = useState(true);
  const [sortMethod, setSortMethod] = useState<'distance' | 'activity'>('distance');
  const [comparisonMetrics, setComparisonMetrics] = useState({
    h3Coverage: 0,
    geohashCoverage: 0,
    h3Accuracy: 0,
    geohashAccuracy: 0,
    h3Performance: 0,
    geohashPerformance: 0
  });
  
  // Mock users data
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alice', h3Index: 'h3-6-37.78-122.41', isActive: true, distance: 120, lat: 37.78, lng: -122.41 },
    { id: '2', name: 'Bob', h3Index: 'h3-6-37.76-122.40', isActive: false, distance: 350, lat: 37.76, lng: -122.40 },
    { id: '3', name: 'Charlie', h3Index: 'h3-6-37.79-122.43', isActive: true, distance: 270, lat: 37.79, lng: -122.43 },
    { id: '4', name: 'Diana', h3Index: 'h3-6-37.75-122.44', isActive: true, distance: 580, lat: 37.75, lng: -122.44 },
    { id: '5', name: 'Ethan', h3Index: 'h3-6-37.74-122.46', isActive: false, distance: 860, lat: 37.74, lng: -122.46 },
    { id: '6', name: 'Fiona', h3Index: 'h3-6-37.80-122.39', isActive: true, distance: 430, lat: 37.80, lng: -122.39 },
    { id: '7', name: 'George', h3Index: 'h3-6-37.81-122.40', isActive: false, distance: 950, lat: 37.81, lng: -122.40 },
    { id: '8', name: 'Hannah', h3Index: 'h3-6-37.77-122.45', isActive: true, distance: 320, lat: 37.77, lng: -122.45 }
  ]);

  // Filtered users based on settings
  const visibleUsers = users.filter(user => {
    // Distance filter
    if (h3.h3Distance(userH3Index, user.h3Index) > maxDistance) {
      return false;
    }
    
    // Online status filter
    if (!showOfflineUsers && !user.isActive) {
      return false;
    }
    
    // Region filter
    if (selectedRegions.length > 0 && !autoSelectRegion) {
      return selectedRegions.includes(user.h3Index);
    }
    
    return true;
  }).sort((a, b) => {
    if (sortMethod === 'distance') {
      return a.distance - b.distance;
    } else { // 'activity'
      return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
    }
  });

  // Generate H3 hexagon grid
  const generateGrid = useCallback(() => {
    // Generate a grid of H3 cells around the user's location
    const centerLat = 37.77;
    const centerLng = -122.42;
    const gridSize = 5;
    const newGrid: H3Cell[][] = [];
    
    const centerH3 = h3.geoToH3(centerLat, centerLng, resolution);
    
    // Get ring of hexagons around center
    const allHexagons = [centerH3, ...h3.kRing(centerH3, gridSize)];
    
    // Organize hexagons into a grid-like structure for rendering
    for (let row = 0; row < gridSize; row++) {
      newGrid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        // Calculate index in allHexagons array
        const idx = row * gridSize + col;
        const h3Index = allHexagons[idx] || `h3-${resolution}-${(centerLat + (row - gridSize/2) * 0.01).toFixed(2)}-${(centerLng + (col - gridSize/2) * 0.01).toFixed(2)}`;
        
        const [lat, lng] = h3.h3ToGeo(h3Index);
        
        // Count users in this cell
        const usersInCell = users.filter(user => user.h3Index === h3Index);
        
        // Determine signal strength based on distance from center
        let signalStrength: 'strong' | 'medium' | 'weak' | 'poor' = 'poor';
        const distance = h3.h3Distance(centerH3, h3Index);
        if (distance < 300) signalStrength = 'strong';
        else if (distance < 600) signalStrength = 'medium';
        else if (distance < 900) signalStrength = 'weak';
        
        newGrid[row][col] = {
          h3Index,
          lat,
          lng, 
          userCount: usersInCell.length,
          signalStrength,
          isSelected: selectedRegions.includes(h3Index)
        };
      }
    }
    
    setGrid(newGrid);
  }, [resolution, users, selectedRegions]);
  
  // Handle region selection
  const toggleRegionSelection = (h3Index: string) => {
    if (selectedRegions.includes(h3Index)) {
      setSelectedRegions(selectedRegions.filter(idx => idx !== h3Index));
    } else {
      setSelectedRegions([...selectedRegions, h3Index]);
    }
  };
  
  // Handle user selection
  const handleUserSelect = (userId: string) => {
    if (onUserSelect) {
      onUserSelect(userId);
    }
  };
  
  // Handle user location
  const locateUser = () => {
    // In a real app, this would use the browser's geolocation API
    // For this demo, we'll just reset to the default position
    setUserH3Index('h3-6-37.77-122.42');
    generateGrid();
  };
  
  // Zoom controls
  const zoomIn = () => {
    if (resolution < 15) {
      setResolution(resolution + 1);
    }
  };
  
  const zoomOut = () => {
    if (resolution > 1) {
      setResolution(resolution - 1);
    }
  };
  
  // Get color based on signal strength
  const getSignalColor = (signalStrength: string) => {
    switch (signalStrength) {
      case 'strong': return 'bg-[var(--geohash-signal-strong)]';
      case 'medium': return 'bg-[var(--geohash-signal-medium)]';
      case 'weak': return 'bg-[var(--geohash-signal-weak)]';
      default: return 'bg-[var(--geohash-signal-poor)]';
    }
  };
  
  // Get border style based on cell properties
  const getCellBorderStyle = (cell: H3Cell) => {
    if (cell.isSelected) {
      return 'border-2 border-[var(--geohash-selected)]';
    }
    
    if (cell.h3Index === userH3Index) {
      return 'border-2 border-[var(--geohash-user)]';
    }
    
    switch (cell.signalStrength) {
      case 'strong': return 'border border-[var(--geohash-border-strong)]';
      case 'medium': return 'border border-[var(--geohash-border-medium)]';
      case 'weak': return 'border border-[var(--geohash-border-weak)]';
      default: return 'border border-[var(--geohash-border-poor)]';
    }
  };
  
  // Generate comparison metrics
  const generateComparisonMetrics = useCallback(() => {
    // In a real app, these would be calculated based on actual measurements
    // For this demo, we'll use mock values
    setComparisonMetrics({
      h3Coverage: 92, // Percentage of area covered
      geohashCoverage: 85,
      h3Accuracy: 88, // Percentage accuracy in distance calculations
      geohashAccuracy: 82,
      h3Performance: 95, // Performance score (higher is better)
      geohashPerformance: 90
    });
  }, []);
  
  // Initial setup
  useEffect(() => {
    generateGrid();
    generateComparisonMetrics();
  }, [generateGrid, generateComparisonMetrics]);
  
  // Update grid when resolution changes
  useEffect(() => {
    generateGrid();
  }, [resolution, generateGrid]);

  return (
    <div className={`p-4 rounded-lg bg-black/20 border border-border/30 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>H3 Hexagonal Grid</span>
          <Badge variant="outline" className="ml-1 text-[10px] py-0.5 px-1.5">
            {resolution}
          </Badge>
        </h3>
        
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'map' | 'list')} className="h-7">
            <TabsList className="h-6 p-0.5 bg-black/40">
              <TabsTrigger value="map" className="text-[10px] h-full px-2">Map</TabsTrigger>
              <TabsTrigger value="list" className="text-[10px] h-full px-2">List</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Filter Settings</h4>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Max Distance: {maxDistance}m</span>
                    <Badge variant="outline" className="text-[10px]">{visibleUsers.length} users</Badge>
                  </div>
                  <Slider 
                    value={[maxDistance]} 
                    min={100} 
                    max={3000} 
                    step={100}
                    onValueChange={(values) => setMaxDistance(values[0])}
                    className="h-3"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Show Offline Users</span>
                  <Switch checked={showOfflineUsers} onCheckedChange={setShowOfflineUsers} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Auto-Select Region</span>
                  <Switch checked={autoSelectRegion} onCheckedChange={setAutoSelectRegion} />
                </div>
                
                <div className="space-y-1 pt-1">
                  <span className="text-xs">Sort By:</span>
                  <div className="flex items-center gap-2 pt-1">
                    <Button 
                      size="sm" 
                      variant={sortMethod === 'distance' ? 'default' : 'outline'} 
                      onClick={() => setSortMethod('distance')}
                      className="text-xs h-7 flex-1"
                    >
                      Distance
                    </Button>
                    <Button 
                      size="sm" 
                      variant={sortMethod === 'activity' ? 'default' : 'outline'}
                      onClick={() => setSortMethod('activity')}
                      className="text-xs h-7 flex-1"
                    >
                      Activity
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {viewMode === 'map' ? (
        <>
          {/* H3 hexagonal grid visualization */}
          <div className="relative aspect-square w-full bg-black/10 rounded">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Render hexagons in a grid pattern */}
              {grid.map((row, rowIndex) => 
                row.map((cell, colIndex) => {
                  // Calculate hexagon points
                  const centerX = 10 + colIndex * 20;
                  const centerY = 10 + rowIndex * 20;
                  const size = 8;
                  
                  // Create hexagon points
                  const points = [];
                  for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const x = centerX + size * Math.cos(angle);
                    const y = centerY + size * Math.sin(angle);
                    points.push(`${x},${y}`);
                  }
                  
                  const hexPoints = points.join(' ');
                  
                  return (
                    <g key={`${rowIndex}-${colIndex}`} className="cursor-pointer group">
                      <polygon 
                        points={hexPoints}
                        className={`
                          ${getSignalColor(cell.signalStrength)}
                          transition-all duration-200 hover:opacity-80
                          ${cell.isSelected ? 'stroke-[var(--geohash-selected)] stroke-[2px]' : ''}
                          ${cell.h3Index === userH3Index ? 'stroke-[var(--geohash-user)] stroke-[2px]' : 'stroke-[rgba(255,255,255,0.1)]'}
                        `}
                        onClick={() => toggleRegionSelection(cell.h3Index)}
                      />
                      
                      {cell.h3Index === userH3Index && (
                        <circle 
                          cx={centerX} 
                          cy={centerY} 
                          r={2} 
                          className="fill-primary animate-pulse-subtle"
                        >
                          <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      
                      {cell.userCount > 0 && (
                        <text 
                          x={centerX} 
                          y={centerY + 1} 
                          className="text-[3px] fill-current text-white font-medium text-center"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {cell.userCount}
                        </text>
                      )}
                    </g>
                  );
                })
              )}
            </svg>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0" 
                onClick={locateUser}
              >
                <Locate className="h-4 w-4" />
              </Button>
              <div className="text-xs">
                <span className="text-muted-foreground">H3 Index: </span>
                <span className="font-mono">{userH3Index.substring(0, 10)}...</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0" 
                onClick={zoomOut}
                disabled={resolution <= 1}
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0" 
                onClick={zoomIn}
                disabled={resolution >= 15}
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-1 mb-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">
              {visibleUsers.length} users in range
              {selectedRegions.length > 0 && !autoSelectRegion ? ` (${selectedRegions.length} regions)` : ''}
            </span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 py-0 px-2 text-xs" 
              onClick={locateUser}
            >
              <Locate className="h-3.5 w-3.5 mr-1" />
              Locate
            </Button>
          </div>
          
          <div className="h-[180px] overflow-y-auto pr-1 scrollbar-hide">
            {visibleUsers.length > 0 ? (
              visibleUsers.map(user => (
                <div 
                  key={user.id}
                  className={`
                    p-2 mb-1 rounded flex justify-between items-center cursor-pointer
                    border border-border/30 hover:bg-black/40 transition-colors
                    ${user.isActive ? 'bg-black/30' : 'bg-black/20 opacity-75'}
                    ${selectedUser === user.id ? 'border-primary/50' : ''}
                  `}
                  onClick={() => handleUserSelect(user.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-black/60 border border-border/50 flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      {user.isActive && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-black"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="flex items-center">
                        <span className="text-[10px] text-muted-foreground font-mono mr-1">
                          {user.h3Index.substring(0, 10)}...
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {user.distance}m
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No users in range
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Comparison Metrics */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <h4 className="text-xs font-medium mb-2 flex items-center gap-1.5">
          <BarChart2 className="h-3.5 w-3.5" />
          <span>H3 vs Geohash Comparison</span>
        </h4>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black/30 p-2 rounded">
            <div className="text-[10px] text-muted-foreground mb-1">Coverage</div>
            <div className="flex items-center justify-between">
              <span className="text-xs">H3</span>
              <span className="text-xs text-green-400">{comparisonMetrics.h3Coverage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Geohash</span>
              <span className="text-xs">{comparisonMetrics.geohashCoverage}%</span>
            </div>
          </div>
          
          <div className="bg-black/30 p-2 rounded">
            <div className="text-[10px] text-muted-foreground mb-1">Accuracy</div>
            <div className="flex items-center justify-between">
              <span className="text-xs">H3</span>
              <span className="text-xs text-green-400">{comparisonMetrics.h3Accuracy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Geohash</span>
              <span className="text-xs">{comparisonMetrics.geohashAccuracy}%</span>
            </div>
          </div>
          
          <div className="bg-black/30 p-2 rounded">
            <div className="text-[10px] text-muted-foreground mb-1">Performance</div>
            <div className="flex items-center justify-between">
              <span className="text-xs">H3</span>
              <span className="text-xs text-green-400">{comparisonMetrics.h3Performance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Geohash</span>
              <span className="text-xs">{comparisonMetrics.geohashPerformance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
