
import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Users, Locate, ZoomIn, ZoomOut, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

// Geohash precision levels
type PrecisionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface GeohashMapProps {
  className?: string;
  onRegionSelect?: (region: string) => void;
  onUserSelect?: (userId: string) => void;
  selectedUser?: string;
}

interface NearbyUser {
  id: string;
  name: string;
  geohash: string;
  distance: number; // meters
  lastActive: Date;
  isActive: boolean;
}

interface GeohashCell {
  geohash: string;
  isSelected: boolean;
  userCount: number;
  signalStrength: number; // 0-100
}

// Mock nearby users data
const NEARBY_USERS: NearbyUser[] = [
  { 
    id: 'user1', 
    name: 'Alex',
    geohash: 'dr5r9', 
    distance: 120,
    lastActive: new Date(),
    isActive: true
  },
  { 
    id: 'user2', 
    name: 'Morgan',
    geohash: 'dr5r8', 
    distance: 350,
    lastActive: new Date(),
    isActive: true
  },
  { 
    id: 'user3', 
    name: 'Jordan',
    geohash: 'dr5re', 
    distance: 550,
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
    isActive: false
  },
  { 
    id: 'user4', 
    name: 'Taylor',
    geohash: 'dr5rc', 
    distance: 780,
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    isActive: true
  },
  { 
    id: 'user5', 
    name: 'Riley',
    geohash: 'dr5q2', 
    distance: 1200,
    lastActive: new Date(),
    isActive: true
  },
  { 
    id: 'user6', 
    name: 'Avery',
    geohash: 'dr5qf', 
    distance: 1500,
    lastActive: new Date(Date.now() - 15 * 60 * 1000),
    isActive: false
  },
  { 
    id: 'user7', 
    name: 'Quinn',
    geohash: 'dr5q8', 
    distance: 1800,
    lastActive: new Date(),
    isActive: true
  },
  { 
    id: 'user8', 
    name: 'Casey',
    geohash: 'dr5qw', 
    distance: 2500,
    lastActive: new Date(),
    isActive: false
  }
];

// Base-32 characters for geohash encoding
const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';

// Generate a grid of geohashes at a specific precision
const generateGeohashGrid = (
  centerGeohash: string, 
  precision: PrecisionLevel, 
  gridSize: number = 5
): GeohashCell[][] => {
  // For the mock implementation, we'll generate a simple grid
  const grid: GeohashCell[][] = [];
  
  for (let y = 0; y < gridSize; y++) {
    const row: GeohashCell[] = [];
    for (let x = 0; x < gridSize; x++) {
      // Generate a geohash that's modified from the center
      // In a real implementation, this would use proper geohash math
      const cellGeohash = centerGeohash.substring(0, precision - 1) + 
        base32[(base32.indexOf(centerGeohash.charAt(precision - 1)) + x - Math.floor(gridSize/2) + 32) % 32];
      
      // Simulated signal strength - strongest in the center, decreasing outward
      const distFromCenter = Math.max(
        Math.abs(x - Math.floor(gridSize/2)),
        Math.abs(y - Math.floor(gridSize/2))
      );
      
      const signalStrength = Math.max(0, 100 - (distFromCenter * 25));
      
      // Count users in this cell
      const userCount = NEARBY_USERS.filter(u => 
        u.geohash.startsWith(cellGeohash)
      ).length;
      
      row.push({
        geohash: cellGeohash,
        isSelected: x === Math.floor(gridSize/2) && y === Math.floor(gridSize/2),
        userCount,
        signalStrength
      });
    }
    grid.push(row);
  }
  
  return grid;
};

export function GeohashMap({ className = '', onRegionSelect, onUserSelect, selectedUser }: GeohashMapProps) {
  // Current user's geohash (would normally come from GPS)
  const [userGeohash, setUserGeohash] = useState<string>('dr5r7');
  const [precision, setPrecision] = useState<PrecisionLevel>(5);
  const [grid, setGrid] = useState<GeohashCell[][]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['dr5r7']);
  const [visibleUsers, setVisibleUsers] = useState<NearbyUser[]>([]);
  const [sortMethod, setSortMethod] = useState<'distance' | 'activity'>('distance');
  const [maxDistance, setMaxDistance] = useState<number>(2000); // meters
  const [showOfflineUsers, setShowOfflineUsers] = useState<boolean>(true);
  const [autoSelectRegion, setAutoSelectRegion] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  // Generate the grid when parameters change
  useEffect(() => {
    const newGrid = generateGeohashGrid(userGeohash, precision);
    setGrid(newGrid);
  }, [userGeohash, precision]);
  
  // Filter and sort users based on settings
  useEffect(() => {
    let filteredUsers = [...NEARBY_USERS];
    
    // Filter by max distance
    filteredUsers = filteredUsers.filter(u => u.distance <= maxDistance);
    
    // Filter by online/offline status if needed
    if (!showOfflineUsers) {
      filteredUsers = filteredUsers.filter(u => u.isActive);
    }
    
    // Filter by selected regions if not in auto mode
    if (!autoSelectRegion && selectedRegions.length > 0) {
      filteredUsers = filteredUsers.filter(u => 
        selectedRegions.some(region => u.geohash.startsWith(region))
      );
    }
    
    // Sort by chosen method
    if (sortMethod === 'distance') {
      filteredUsers.sort((a, b) => a.distance - b.distance);
    } else {
      filteredUsers.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
    }
    
    setVisibleUsers(filteredUsers);
    
  }, [maxDistance, showOfflineUsers, selectedRegions, sortMethod, autoSelectRegion]);
  
  // Handle clicking on a grid cell to select/deselect a region
  const toggleRegionSelection = (geohash: string) => {
    if (autoSelectRegion) return; // Don't allow manual selection in auto mode
    
    setSelectedRegions(prev => {
      if (prev.includes(geohash)) {
        return prev.filter(g => g !== geohash);
      } else {
        return [...prev, geohash];
      }
    });
    
    if (onRegionSelect) {
      onRegionSelect(geohash);
    }
  };
  
  // Handle user selection
  const handleUserSelect = (userId: string) => {
    if (onUserSelect) {
      onUserSelect(userId);
    }
  };
  
  // Mock function to obtain user's location
  const locateUser = () => {
    // In a real app, this would use the Geolocation API
    // For now, we'll just choose a random geohash from the list
    const randomUser = NEARBY_USERS[Math.floor(Math.random() * NEARBY_USERS.length)];
    setUserGeohash(randomUser.geohash);
    
    // If auto mode is on, select this region
    if (autoSelectRegion) {
      setSelectedRegions([randomUser.geohash]);
      if (onRegionSelect) {
        onRegionSelect(randomUser.geohash);
      }
    }
  };
  
  // Increase zoom level (more precision)
  const zoomIn = () => {
    if (precision < 8) {
      setPrecision((precision + 1) as PrecisionLevel);
    }
  };
  
  // Decrease zoom level (less precision)
  const zoomOut = () => {
    if (precision > 1) {
      setPrecision((precision - 1) as PrecisionLevel);
    }
  };
  
  // Function to get the color based on signal strength
  const getSignalColor = (strength: number): string => {
    if (strength >= 80) return 'bg-green-500/30 border-green-500/50';
    if (strength >= 50) return 'bg-blue-500/30 border-blue-500/50';
    if (strength >= 30) return 'bg-yellow-500/30 border-yellow-500/50';
    return 'bg-red-500/30 border-red-500/50';
  };
  
  // Function to get cell border style based on selection
  const getCellBorderStyle = (cell: GeohashCell): string => {
    if (cell.geohash === userGeohash) {
      return 'border-2 border-primary';
    }
    if (selectedRegions.includes(cell.geohash)) {
      return 'border-2 border-blue-500';
    }
    return 'border border-border/30';
  };
  
  return (
    <div className={`p-4 rounded-lg bg-black/20 border border-border/30 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>Geo Range</span>
          <Badge variant="outline" className="ml-1 text-[10px] py-0.5 px-1.5">
            {precision}
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
          {/* Geohash grid visualization */}
          <div className="relative aspect-square w-full">
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1">
              {grid.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      cursor-pointer relative ${getSignalColor(cell.signalStrength)} 
                      ${getCellBorderStyle(cell)} 
                      flex items-center justify-center rounded
                      transition-all duration-200 hover:bg-opacity-50
                    `}
                    onClick={() => toggleRegionSelection(cell.geohash)}
                  >
                    {cell.geohash === userGeohash && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full relative">
                          <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping"></div>
                        </div>
                      </div>
                    )}
                    {cell.userCount > 0 && (
                      <Badge variant="outline" className="bg-black/60 absolute top-1 right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[9px]">
                        {cell.userCount}
                      </Badge>
                    )}
                    
                    <span className="text-[8px] opacity-70">
                      {cell.geohash.substring(cell.geohash.length - 2)}
                    </span>
                  </div>
                ))
              )}
            </div>
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
                <span className="text-muted-foreground">GeoHash: </span>
                <span className="font-mono">{userGeohash}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0" 
                onClick={zoomOut}
                disabled={precision <= 1}
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0" 
                onClick={zoomIn}
                disabled={precision >= 8}
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
                          {user.geohash}
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
    </div>
  );
}
