
import React, { useState } from 'react';
import { 
  Lightbulb, 
  Wifi, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Radio, 
  Gauge, 
  Cable
} from 'lucide-react';
import { Button } from '../ui/button';
import { OpticalSpectrumAnalyzer } from '../visualization/OpticalSpectrumAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Badge } from '../ui/badge';

interface OpticalCommunicationPanelProps {
  isActive?: boolean;
}

interface WDMChannel {
  id: number;
  wavelength: number;
  power: number;
  active: boolean;
  label: string;
}

export function OpticalCommunicationPanel({ isActive = false }: OpticalCommunicationPanelProps) {
  // Optical configuration states
  const [opticalBand, setOpticalBand] = useState<'C-Band' | 'L-Band' | 'S-Band' | 'Full-Spectrum'>('C-Band');
  const [showWDM, setShowWDM] = useState(true);
  const [attenuation, setAttenuation] = useState(0);
  const [transmissionMode, setTransmissionMode] = useState<'Continuous' | 'Burst' | 'Modulated'>('Continuous');
  const [powerLevel, setPowerLevel] = useState(0); // dBm
  const [distanceReach, setDistanceReach] = useState(10); // km
  const [selectedTab, setSelectedTab] = useState('analyzer');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // WDM channels
  const [wdmChannels, setWdmChannels] = useState<WDMChannel[]>([
    { id: 1, wavelength: 1530.33, power: 0, active: true, label: 'Ch 1' },
    { id: 2, wavelength: 1531.12, power: -3, active: true, label: 'Ch 2' },
    { id: 3, wavelength: 1531.90, power: -1, active: false, label: 'Ch 3' },
    { id: 4, wavelength: 1532.68, power: -2, active: true, label: 'Ch 4' },
    { id: 5, wavelength: 1534.25, power: 0, active: true, label: 'Ch 5' },
    { id: 6, wavelength: 1535.04, power: -4, active: false, label: 'Ch 6' },
    { id: 7, wavelength: 1535.82, power: -1, active: true, label: 'Ch 7' },
    { id: 8, wavelength: 1536.61, power: 0, active: true, label: 'Ch 8' },
  ]);
  
  // Fiber parameters
  const [fiberType, setFiberType] = useState<'Single-Mode' | 'Multi-Mode'>('Single-Mode');
  const [connectorType, setConnectorType] = useState<'LC' | 'SC' | 'FC' | 'ST'>('LC');
  const [bitRate, setBitRate] = useState(10); // Gbps
  
  // Handle section toggle
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  // Update WDM channel
  const updateWDMChannel = (id: number, field: keyof WDMChannel, value: any) => {
    setWdmChannels(channels => 
      channels.map(channel => 
        channel.id === id ? { ...channel, [field]: value } : channel
      )
    );
  };

  // Update attenuation based on distance
  const handleDistanceChange = (distance: number) => {
    setDistanceReach(distance);
    // Basic model: 0.25 dB/km attenuation
    const calculatedAttenuation = Math.round(distance * 0.25);
    setAttenuation(calculatedAttenuation);
  };

  // Calculate optical link budget
  const calculateLinkBudget = () => {
    const connectorLoss = 0.5; // dB per connector
    const spliceLoss = 0.1; // dB per splice
    const fiberLoss = fiberType === 'Single-Mode' ? 0.25 : 3; // dB/km
    
    const totalConnectorLoss = connectorLoss * 2; // Two connectors
    const totalSpliceLoss = spliceLoss * Math.floor(distanceReach / 10); // One splice every 10km
    const totalFiberLoss = fiberLoss * distanceReach;
    
    const totalLoss = totalConnectorLoss + totalSpliceLoss + totalFiberLoss;
    const linkBudget = powerLevel - totalLoss;
    
    return {
      totalConnectorLoss,
      totalSpliceLoss,
      totalFiberLoss,
      totalLoss,
      linkBudget
    };
  };
  
  const linkBudget = calculateLinkBudget();
  const activeChannelCount = wdmChannels.filter(ch => ch.active).length;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-medium">Optical Communication</h2>
        </div>
        
        <div>
          <Badge variant={isActive ? "default" : "secondary"} className="rounded-md">
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 bg-black border border-border/30 rounded-lg p-0.5">
          <TabsTrigger className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white" value="analyzer">Spectrum Analyzer</TabsTrigger>
          <TabsTrigger className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white" value="config">WDM Configuration</TabsTrigger>
          <TabsTrigger className="rounded-md data-[state=active]:bg-[rgba(45,45,45,0.6)] text-white" value="params">Optical Parameters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyzer" className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Select value={opticalBand} onValueChange={(v) => setOpticalBand(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Band" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C-Band">C-Band</SelectItem>
                  <SelectItem value="L-Band">L-Band</SelectItem>
                  <SelectItem value="S-Band">S-Band</SelectItem>
                  <SelectItem value="Full-Spectrum">Full Spectrum</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="wdm-toggle" className="text-sm whitespace-nowrap">WDM:</Label>
                <Switch 
                  id="wdm-toggle" 
                  checked={showWDM} 
                  onCheckedChange={setShowWDM}
                />
              </div>
              
              <div className="flex flex-1 items-center gap-2">
                <Label className="text-sm whitespace-nowrap">Attenuation:</Label>
                <Slider
                  value={[attenuation]}
                  onValueChange={([v]) => setAttenuation(v)}
                  min={0}
                  max={30}
                  step={1}
                  className="w-32"
                />
                <span className="text-sm">{attenuation} dB</span>
              </div>
            </div>
            
            <OpticalSpectrumAnalyzer 
              isActive={isActive}
              bandType={opticalBand}
              showWDM={showWDM}
              attenuation={attenuation}
              width={800}
              height={350}
            />
          </div>
          
          <Card>
            <CardHeader className="py-3 bg-black text-white">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Transmission Settings</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleSection('transmission')}
                  className="h-6 w-6 p-0 text-white hover:bg-[rgba(45,45,45,0.6)]"
                >
                  {expandedSection === 'transmission' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </CardTitle>
            </CardHeader>
            
            {expandedSection === 'transmission' && (
              <CardContent className="bg-[rgba(0,0,0,1)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Transmission Mode</Label>
                      <Select value={transmissionMode} onValueChange={(v) => setTransmissionMode(v as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Continuous">Continuous</SelectItem>
                          <SelectItem value="Burst">Burst</SelectItem>
                          <SelectItem value="Modulated">Modulated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">Bit Rate (Gbps)</Label>
                      <div className="flex items-center gap-2">
                        <Slider 
                          value={[bitRate]} 
                          onValueChange={([v]) => setBitRate(v)}
                          min={1}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm w-12 text-right">{bitRate} G</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Power Level (dBm)</Label>
                      <div className="flex items-center gap-2">
                        <Slider 
                          value={[powerLevel]} 
                          onValueChange={([v]) => setPowerLevel(v)}
                          min={-10}
                          max={10}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm w-16 text-right">{powerLevel} dBm</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">Distance Reach (km)</Label>
                      <div className="flex items-center gap-2">
                        <Slider 
                          value={[distanceReach]} 
                          onValueChange={([v]) => handleDistanceChange(v)}
                          min={1}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm w-16 text-right">{distanceReach} km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader className="py-3 bg-black text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">WDM Channel Configuration</CardTitle>
                  <CardDescription className="text-white/80">
                    Configure wavelength-division multiplexing channels
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">{activeChannelCount} Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 text-xs uppercase text-muted-foreground border-b pb-1 border-border">
                  <div className="col-span-1">Ch</div>
                  <div className="col-span-3">Label</div>
                  <div className="col-span-3">Wavelength (nm)</div>
                  <div className="col-span-3">Power (dBm)</div>
                  <div className="col-span-2 text-center">Status</div>
                </div>
                
                <div className="space-y-2">
                  {wdmChannels.map((channel) => (
                    <div key={channel.id} className="grid grid-cols-12 items-center">
                      <div className="col-span-1 text-sm font-medium">{channel.id}</div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={channel.label}
                          onChange={(e) => updateWDMChannel(channel.id, 'label', e.target.value)}
                          className="bg-input-background text-sm border border-border p-1 rounded w-full"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={channel.wavelength}
                          onChange={(e) => updateWDMChannel(channel.id, 'wavelength', parseFloat(e.target.value))}
                          step="0.01"
                          className="bg-input-background text-sm border border-border p-1 rounded w-full"
                        />
                      </div>
                      <div className="col-span-3">
                        <Slider
                          value={[channel.power]}
                          onValueChange={([value]) => updateWDMChannel(channel.id, 'power', value)}
                          min={-10}
                          max={3}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="col-span-2 text-center">
                        <Switch
                          checked={channel.active}
                          onCheckedChange={(checked) => updateWDMChannel(channel.id, 'active', checked)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" className="gap-2">
              <Zap className="h-4 w-4" />
              <span>Auto-Level</span>
            </Button>
            
            <div className="space-x-2">
              <Button variant="outline">Reset</Button>
              <Button>Apply Configuration</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="params" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 bg-black text-white">
                <CardTitle className="text-base">Fiber Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Fiber Type</Label>
                    <Select value={fiberType} onValueChange={(v) => setFiberType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single-Mode">Single-Mode</SelectItem>
                        <SelectItem value="Multi-Mode">Multi-Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Connector Type</Label>
                    <Select value={connectorType} onValueChange={(v) => setConnectorType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LC">LC Connector</SelectItem>
                        <SelectItem value="SC">SC Connector</SelectItem>
                        <SelectItem value="FC">FC Connector</SelectItem>
                        <SelectItem value="ST">ST Connector</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Maximum Distance (km)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      value={[distanceReach]} 
                      onValueChange={([v]) => handleDistanceChange(v)}
                      min={1}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">{distanceReach} km</span>
                  </div>
                </div>
                
                <div className="bg-black/20 p-3 rounded-md">
                  <div className="text-sm font-medium mb-2">Fiber Properties</div>
                  <div className="grid grid-cols-2 gap-y-1 text-xs">
                    <div className="text-muted-foreground">Attenuation coefficient:</div>
                    <div>{fiberType === 'Single-Mode' ? '0.25' : '3.0'} dB/km</div>
                    
                    <div className="text-muted-foreground">Core diameter:</div>
                    <div>{fiberType === 'Single-Mode' ? '9μm' : '50/62.5μm'}</div>
                    
                    <div className="text-muted-foreground">Typical use:</div>
                    <div>{fiberType === 'Single-Mode' ? 'Long-haul' : 'LAN/Building'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 bg-black text-white">
                <CardTitle className="text-base">Link Budget Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-muted-foreground">Transmit power:</div>
                    <div>{powerLevel} dBm</div>
                    
                    <div className="text-muted-foreground">Fiber loss:</div>
                    <div>{linkBudget.totalFiberLoss.toFixed(1)} dB</div>
                    
                    <div className="text-muted-foreground">Connector loss:</div>
                    <div>{linkBudget.totalConnectorLoss.toFixed(1)} dB</div>
                    
                    <div className="text-muted-foreground">Splice loss:</div>
                    <div>{linkBudget.totalSpliceLoss.toFixed(1)} dB</div>
                    
                    <div className="text-muted-foreground">Total attenuation:</div>
                    <div>{linkBudget.totalLoss.toFixed(1)} dB</div>
                    
                    <div className="border-t border-border pt-1 text-muted-foreground font-medium">Link budget:</div>
                    <div className="border-t border-border pt-1 font-medium">
                      <span className={linkBudget.linkBudget >= -25 ? 'text-green-400' : 'text-red-400'}>
                        {linkBudget.linkBudget.toFixed(1)} dBm
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-md">
                    <div className="text-sm font-medium mb-2">Link Status</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${linkBudget.linkBudget >= -25 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">
                          {linkBudget.linkBudget >= -25 ? 'Link operational' : 'Link power insufficient'}
                        </span>
                      </div>
                      <Button size="sm" className="h-7" variant="outline">Details</Button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Receiver sensitivity: -25 dBm
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-black/20">
            <CardHeader className="py-3 bg-black text-white">
              <CardTitle className="text-base">Transmission Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Bit Rate</div>
                  <div className="text-lg font-medium">{bitRate} Gbps</div>
                </div>
                
                <div className="bg-black/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Wavelengths</div>
                  <div className="text-lg font-medium">{activeChannelCount}</div>
                </div>
                
                <div className="bg-black/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Total Capacity</div>
                  <div className="text-lg font-medium">{activeChannelCount * bitRate} Gbps</div>
                </div>
                
                <div className="bg-black/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Maximum Reach</div>
                  <div className="text-lg font-medium">{distanceReach} km</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset Configuration</Button>
        <Button>Start Optical Scan</Button>
      </div>
    </div>
  );
}
