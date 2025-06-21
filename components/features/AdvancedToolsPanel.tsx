import React, { useState } from 'react';
import { 
  Radio, 
  BarChart2, 
  Menu, 
  X, 
  Satellite, 
  FileImage, 
  Code, 
  FileSearch, 
  Binary,
  Wifi,
  Smartphone,
  Wand2,
  LifeBuoy,
  Gauge,
  Monitor,
  Play,
  Pause,
  Settings,
  Download
} from "lucide-react";
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

interface AdvancedToolsPanelProps {
  onClose?: () => void;
  className?: string;
}

export function AdvancedToolsPanel({ onClose, className = "" }: AdvancedToolsPanelProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const features = [
    {
      id: 'radio',
      icon: Radio,
      title: 'Radio Scanner',
      description: 'Scan and monitor radio frequencies',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      id: 'analytics',
      icon: BarChart2,
      title: 'Signal Analytics',
      description: 'Advanced signal analysis and reporting',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      id: 'satellite',
      icon: Satellite,
      title: 'Satellite Tracking',
      description: 'Track and communicate with satellites',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      id: 'fileimage',
      icon: FileImage,
      title: 'Image Analysis',
      description: 'Analyze images for hidden signals',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      id: 'code',
      icon: Code,
      title: 'Code Tools',
      description: 'Programming and scripting utilities',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20'
    },
    {
      id: 'filesearch',
      icon: FileSearch,
      title: 'File Scanner',
      description: 'Search and analyze file contents',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      id: 'binary',
      icon: Binary,
      title: 'Binary Analyzer',
      description: 'Binary data analysis and conversion',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      id: 'wifi',
      icon: Wifi,
      title: 'WiFi Analyzer',
      description: 'Wireless network analysis and monitoring',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20'
    },
    {
      id: 'smartphone',
      icon: Smartphone,
      title: 'Mobile Tools',
      description: 'Mobile device interaction utilities',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20'
    },
    {
      id: 'wand',
      icon: Wand2,
      title: 'Auto Tools',
      description: 'Automated signal processing tools',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
    },
    {
      id: 'lifebuoy',
      icon: LifeBuoy,
      title: 'Emergency Tools',
      description: 'Emergency communication tools',
      color: 'text-red-500',
      bgColor: 'bg-red-600/20'
    },
    {
      id: 'gauge',
      icon: Gauge,
      title: 'Performance Monitor',
      description: 'System performance and metrics',
      color: 'text-blue-500',
      bgColor: 'bg-blue-600/20'
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
  };

  const renderFeatureContent = (feature: any) => {
    switch (feature.id) {
      case 'radio':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline">FM Scan</Button>
              <Button size="sm" variant="outline">AM Scan</Button>
              <Button size="sm" variant="outline">HAM Radio</Button>
            </div>
            <div className="text-sm text-gray-400">
              Frequency: 101.5 MHz | Signal: Strong | Status: Active
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">87%</div>
                <div className="text-xs text-gray-400">Signal Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">2.4GHz</div>
                <div className="text-xs text-gray-400">Peak Frequency</div>
              </div>
            </div>
          </div>
        );
      case 'satellite':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>ISS</span>
                <Badge variant="outline" className="text-green-400">Visible</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>GPS Satellites</span>
                <Badge variant="outline" className="text-blue-400">12 Active</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Weather Sat</span>
                <Badge variant="outline" className="text-yellow-400">Acquiring</Badge>
              </div>
            </div>
          </div>
        );
      case 'fileimage':
        return (
          <div className="space-y-4">
            <Input placeholder="Drop image file or paste URL..." className="text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline">Steganography</Button>
              <Button size="sm" variant="outline">Metadata</Button>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline">JavaScript</Button>
              <Button size="sm" variant="outline">Python</Button>
              <Button size="sm" variant="outline">Signal Script</Button>
              <Button size="sm" variant="outline">CLI Tools</Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-sm text-gray-400">
            {feature.description} - Coming soon...
          </div>
        );
    }
  };

  return (
    <Card className={`p-6 bg-black/90 border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Menu className="h-5 w-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Advanced Tools</h3>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;

          return (
            <div key={feature.id} className="space-y-2">
              <Card 
                className={`p-4 cursor-pointer transition-all duration-200 border ${
                  isActive ? 'border-white/30 bg-white/5' : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                    <Icon className={`h-4 w-4 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{feature.title}</h4>
                    <p className="text-xs text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </Card>

              {isActive && (
                <Card className="p-3 bg-black/50 border-white/10">
                  {renderFeatureContent(feature)}
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
