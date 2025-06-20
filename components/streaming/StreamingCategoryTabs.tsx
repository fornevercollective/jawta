import React from 'react';
import { 
  Radio, 
  Podcast, 
  Music, 
  Layers, 
  Mic, 
  BarChart,
  Globe,
  Headphones,
  Star
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface StreamingCategoryTabsProps {
  activeCategory: string;
  onChange: (value: string) => void;
}

export function StreamingCategoryTabs({ 
  activeCategory,
  onChange
}: StreamingCategoryTabsProps) {
  return (
    <Tabs value={activeCategory} onValueChange={onChange}>
      <TabsList className="h-10 grid grid-cols-4 sm:grid-cols-8 bg-black border border-border/30 rounded-lg p-0.5">
        <TabsTrigger 
          value="featured" 
          className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white"
        >
          <Star className="h-4 w-4 mr-1.5 sm:mr-0 md:mr-1.5" />
          <span className="hidden sm:inline sm:text-xs md:text-sm">Featured</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="radio" 
          className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white"
        >
          <Radio className="h-4 w-4 mr-1.5 sm:mr-0 md:mr-1.5" />
          <span className="hidden sm:inline sm:text-xs md:text-sm">Radio</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="podcasts" 
          className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white"
        >
          <Podcast className="h-4 w-4 mr-1.5 sm:mr-0 md:mr-1.5" />
          <span className="hidden sm:inline sm:text-xs md:text-sm">Podcasts</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="music" 
          className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white"
        >
          <Music className="h-4 w-4 mr-1.5 sm:mr-0 md:mr-1.5" />
          <span className="hidden sm:inline sm:text-xs md:text-sm">Music</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="live" 
          className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white"
        >
          <Mic className="h-4 w-4 mr-1.5 sm:mr-0 md:mr-1.5" />
          <span className="hidden sm:inline sm:text-xs md:text-sm">Live</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="charts" 
          className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white"
        >
          <BarChart className="h-4 w-4 mr-1.5 sm:mr-0 md:mr-1.5" />
          <span className="hidden sm:inline sm:text-xs md:text-sm">Charts</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="international" 
          className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white"
        >
          <Globe className="h-4 w-4 mr-1.5 sm:mr-0 md:mr-1.5" />
          <span className="hidden sm:inline sm:text-xs md:text-sm">Global</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="favorites" 
          className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white"
        >
          <Headphones className="h-4 w-4 mr-1.5 sm:mr-0 md:mr-1.5" />
          <span className="hidden sm:inline sm:text-xs md:text-sm">My Library</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}