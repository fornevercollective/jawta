
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Wifi, 
  Radio, 
  CreditCard, 
  Zap, 
  Signal, 
  Smartphone, 
  Lock, 
  Monitor, 
  KeySquare,
  ServerCrash,
  Antenna,
  Eye
} from "lucide-react";

// Types for different RF protocols
type RFProtocol = "subghz" | "nfc" | "rfid" | "infrared" | "bluetooth";
type DeviceMode = "scan" | "emulate" | "read" | "write";

// Device profiles
const deviceProfiles = [
  { 
    id: "flipper_zero", 
    name: "Flipper Zero", 
    capabilities: ["subghz", "nfc", "rfid", "infrared", "gpio"],
    thumbnail: "🐬",
    description: "Multi-tool for pentesters and hardware security researchers"
  },
  { 
    id: "proxmark3", 
    name: "Proxmark3", 
    capabilities: ["nfc", "rfid", "13.56mhz", "125khz"],
    thumbnail: "📟",
    description: "Advanced RFID/NFC research and cloning device"
  },
  { 
    id: "hackrf_one", 
    name: "HackRF One", 
    capabilities: ["sdr", "subghz", "10mhz-6ghz"],
    thumbnail: "📻",
    description: "Software defined radio peripheral"
  },
  { 
    id: "yardstick_one", 
    name: "Yardstick One", 
    capabilities: ["subghz", "433mhz", "868mhz", "915mhz"],
    thumbnail: "📡",
    description: "Sub-1 GHz wireless development platform"
  }
];

// Protocol frequency bands
const protocolFrequencies = {
  subghz: [
    { name: "433.92 MHz", value: 433.92, use: "Common remote controls" },
    { name: "868.35 MHz", value: 868.35, use: "European ISM band" },
    { name: "915.00 MHz", value: 915.00, use: "North American ISM band" }
  ],
  nfc: [
    { name: "13.56 MHz", value: 13.56, use: "NFC/RFID standard frequency" }
  ],
  rfid: [
    { name: "125 kHz", value: 0.125, use: "LF RFID common frequency" },
    { name: "134 kHz", value: 0.134, use: "Animal tracking" }
  ],
  infrared: [
    { name: "38 kHz", value: 0.038, use: "Common IR carrier frequency" },
    { name: "56 kHz", value: 0.056, use: "Alternative IR carrier" }
  ],
  bluetooth: [
    { name: "2.4 GHz", value: 2400, use: "Bluetooth/BLE frequency band" }
  ]
};

// Common modulation types
const modulationTypes = [
  "AM", "FM", "ASK", "FSK", "OOK", "2-FSK", "GFSK", "4-FSK", "GMSK", "PSK"
];

// Mock key fobs and access cards
const savedDevices = [
  { id: "key_1", name: "Garage Door", type: "subghz", frequency: 433.92, modulation: "OOK", code: "7A93BF21" },
  { id: "key_2", name: "Car Key", type: "subghz", frequency: 433.92, modulation: "AM", code: "DE7F9C4A" },
  { id: "card_1", name: "Office Badge", type: "rfid", frequency: 13.56, protocol: "MIFARE", uid: "A47BEF32" },
  { id: "card_2", name: "Apartment Fob", type: "nfc", frequency: 13.56, protocol: "EM4100", uid: "208AF1D9" },
  { id: "remote_1", name: "TV Remote", type: "infrared", protocol: "NEC", code: "20DF10EF" }
];

export function RFDeviceEmulator() {
  // State for device settings
  const [selectedDevice, setSelectedDevice] = useState(deviceProfiles[0].id);
  const [activeProtocol, setActiveProtocol] = useState<RFProtocol>("subghz");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("scan");
  const [frequency, setFrequency] = useState(433.92);
  const [modulation, setModulation] = useState("OOK");
  const [isScanning, setIsScanning] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const [detectedSignals, setDetectedSignals] = useState<any[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  
  // Effect for simulating signal detection
  useEffect(() => {
    if (!isScanning) return;
    
    // Interval to simulate signal detection
    const scanInterval = setInterval(() => {
      // Randomly fluctuate signal strength
      setSignalStrength(prev => {
        const newValue = prev + (Math.random() * 0.4 - 0.2);
        return Math.max(0, Math.min(1, newValue));
      });
      
      // Randomly detect signals
      if (Math.random() > 0.85 && detectedSignals.length < 5) {
        const newSignal = generateRandomSignal(activeProtocol, frequency);
        setDetectedSignals(prev => [...prev, newSignal]);
      }
    }, 700);
    
    return () => clearInterval(scanInterval);
  }, [isScanning, activeProtocol, frequency, detectedSignals]);
  
  // Simulate receiving a signal
  const generateRandomSignal = (protocol: RFProtocol, baseFreq: number) => {
    const signalTypes = {
      subghz: ["Car Key", "Garage Door", "Gate Remote", "Alarm System", "Remote Switch"],
      nfc: ["Credit Card", "Access Badge", "Transit Card", "Phone Payment", "Passport"],
      rfid: ["Key Fob", "Animal Tag", "Asset Tag", "Security Badge", "Inventory Tag"],
      infrared: ["TV Remote", "AC Remote", "Media Center", "Projector", "Light Controller"],
      bluetooth: ["Phone", "Headphones", "Fitness Tracker", "Smart Watch", "Speaker"]
    };
    
    const type = signalTypes[protocol][Math.floor(Math.random() * signalTypes[protocol].length)];
    
    // Small frequency variation
    const freqVariation = (Math.random() * 0.2 - 0.1).toFixed(4);
    const detectedFreq = baseFreq + parseFloat(freqVariation);
    
    // Random hex code for signal
    const code = Array.from({length: 8}, () => 
      Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
    
    return {
      id: `signal_${Date.now()}`,
      type,
      protocol,
      frequency: detectedFreq,
      modulation: modulationTypes[Math.floor(Math.random() * modulationTypes.length)],
      code,
      strength: Math.floor(Math.random() * 30) + 70, // 70-100%
      timestamp: new Date().toISOString()
    };
  };
  
  const handleStartScan = () => {
    setIsScanning(true);
    setDetectedSignals([]);
  };
  
  const handleStopScan = () => {
    setIsScanning(false);
  };
  
  const handleProtocolChange = (protocol: RFProtocol) => {
    setActiveProtocol(protocol);
    // Set default frequency for the selected protocol
    if (protocolFrequencies[protocol]?.length > 0) {
      setFrequency(protocolFrequencies[protocol][0].value);
    }
  };
  
  const handleFrequencyChange = (value: number[]) => {
    setFrequency(value[0]);
  };
  
  const handleReplaySignal = (signal: any) => {
    setSelectedSignal(signal);
    setDeviceMode("emulate");
    // Would trigger emulation in a real device
    alert(`Transmitting signal: ${signal.code} [${signal.modulation}] at ${signal.frequency} MHz`);
  };
  
  const handleSaveSignal = (signal: any) => {
    alert(`Signal ${signal.code} saved successfully!`);
  };
  
  const renderDeviceStats = () => {
    const deviceInfo = deviceProfiles.find(d => d.id === selectedDevice);
    
    if (!deviceInfo) return null;
    
    return (
      <div className="mb-4 p-3 border rounded-md bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{deviceInfo.thumbnail}</span>
            <div>
              <h3 className="font-medium">{deviceInfo.name}</h3>
              <p className="text-xs text-muted-foreground">{deviceInfo.description}</p>
            </div>
          </div>
          <Badge variant={isScanning ? "default" : "outline"} className="ml-2">
            {isScanning ? "Active" : "Standby"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-xs text-muted-foreground">Signal Strength</div>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${signalStrength * 100}%` }} 
              />
            </div>
            <span className="text-xs font-mono">{Math.round(signalStrength * 100)}%</span>
          </div>
          
          <div className="text-xs text-muted-foreground">Battery</div>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: "85%" }} />
            </div>
            <span className="text-xs font-mono">85%</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Main component rendering
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            <span>RF Device Emulator</span>
            <Badge variant="outline" className="ml-2">{frequency} MHz</Badge>
          </CardTitle>
          
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              {deviceProfiles.map(device => (
                <SelectItem key={device.id} value={device.id}>
                  <div className="flex items-center gap-2">
                    <span>{device.thumbnail}</span>
                    <span>{device.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          Simulate and analyze RF signals across multiple protocols
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {renderDeviceStats()}
        
        <Tabs defaultValue="subghz" value={activeProtocol} onValueChange={(v) => handleProtocolChange(v as RFProtocol)} className="w-full">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="subghz" className="gap-1.5">
              <Antenna className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">SubGHz</span>
            </TabsTrigger>
            <TabsTrigger value="nfc" className="gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">NFC</span>
            </TabsTrigger>
            <TabsTrigger value="rfid" className="gap-1.5">
              <KeySquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">RFID</span>
            </TabsTrigger>
            <TabsTrigger value="infrared" className="gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">IR</span>
            </TabsTrigger>
            <TabsTrigger value="bluetooth" className="gap-1.5">
              <Signal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">BLE</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex-none w-full sm:w-auto">
                <Label className="text-xs mb-1 block">Operation Mode</Label>
                <Select value={deviceMode} onValueChange={(v) => setDeviceMode(v as DeviceMode)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scan">Scan</SelectItem>
                    <SelectItem value="emulate">Emulate</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 space-y-1">
                <Label className="text-xs mb-1 block">Frequency: {frequency} MHz</Label>
                <div className="flex gap-4 items-center">
                  <Slider 
                    value={[frequency]}
                    min={activeProtocol === "rfid" ? 0.1 : 
                          activeProtocol === "infrared" ? 0.01 : 
                          activeProtocol === "bluetooth" ? 2400 : 300}
                    max={activeProtocol === "rfid" ? 14 : 
                         activeProtocol === "infrared" ? 0.06 : 
                         activeProtocol === "bluetooth" ? 2500 : 1000}
                    step={activeProtocol === "rfid" || activeProtocol === "infrared" ? 0.001 : 0.01}
                    onValueChange={handleFrequencyChange}
                    className="flex-1"
                  />
                  
                  <Select value={modulation} onValueChange={setModulation} disabled={activeProtocol === "nfc"}>
                    <SelectTrigger className="w-[90px]">
                      <SelectValue placeholder="Mod" />
                    </SelectTrigger>
                    <SelectContent>
                      {modulationTypes.map(mod => (
                        <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-primary" />
                    <span>Signal Scanner</span>
                  </h3>
                  
                  {isScanning ? (
                    <Button variant="destructive" size="sm" onClick={handleStopScan} className="h-7 text-xs">
                      Stop Scanning
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" onClick={handleStartScan} className="h-7 text-xs">
                      Start Scanning
                    </Button>
                  )}
                </div>
                
                <div className="h-[180px] overflow-y-auto border rounded-md bg-muted/30">
                  {detectedSignals.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      {isScanning ? "Scanning for signals..." : "No signals detected yet"}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {detectedSignals.map(signal => (
                        <div key={signal.id} className="p-2 hover:bg-muted/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-sm">{signal.type}</div>
                              <div className="text-xs text-muted-foreground">
                                {signal.frequency.toFixed(2)} MHz • {signal.modulation}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleReplaySignal(signal)}>
                                <Radio className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleSaveSignal(signal)}>
                                <Lock className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="font-mono text-xs mt-1 text-primary">
                            {signal.code}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${signal.strength}%` }} 
                              />
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">{signal.strength}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    <ServerCrash className="h-4 w-4 text-primary" />
                    <span>Saved Devices</span>
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {savedDevices.length} items
                  </Badge>
                </div>
                
                <div className="h-[180px] overflow-y-auto border rounded-md bg-muted/30">
                  <div className="divide-y">
                    {savedDevices.map(device => (
                      <div key={device.id} className="p-2 hover:bg-muted/50 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">{device.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {device.frequency} MHz • {device.type.toUpperCase()}
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleReplaySignal(device)}>
                            <Radio className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="font-mono text-xs mt-1 text-primary">
                          {device.code || device.uid}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {activeProtocol === "subghz" && (
              <div className="p-3 border rounded-md bg-muted/30">
                <h3 className="text-sm font-medium mb-2">Common Frequencies</h3>
                <div className="flex flex-wrap gap-2">
                  {protocolFrequencies.subghz.map(freq => (
                    <Button
                      key={freq.value}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setFrequency(freq.value)}
                    >
                      {freq.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {deviceMode === "emulate" && selectedSignal && (
              <div className="p-3 border rounded-md bg-card animate-pulse-subtle">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Radio className="h-4 w-4 text-destructive" />
                  <span>Emulating Signal</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="text-xs text-muted-foreground">Type</div>
                  <div className="text-xs font-medium">{selectedSignal.type}</div>
                  
                  <div className="text-xs text-muted-foreground">Frequency</div>
                  <div className="text-xs font-medium">{selectedSignal.frequency} MHz</div>
                  
                  <div className="text-xs text-muted-foreground">Modulation</div>
                  <div className="text-xs font-medium">{selectedSignal.modulation}</div>
                  
                  <div className="text-xs text-muted-foreground">Code</div>
                  <div className="text-xs font-medium font-mono">{selectedSignal.code || selectedSignal.uid}</div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <Button variant="destructive" size="sm" className="h-7 text-xs">Stop Transmission</Button>
                  <Badge variant="outline" className="animate-pulse-fast">Transmitting</Badge>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 mt-2">
        <div className="flex items-center gap-1.5">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Device Connection Status: <span className="text-green-500">Ready</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="debug-mode" />
          <Label htmlFor="debug-mode" className="text-xs">Debug Mode</Label>
        </div>
      </CardFooter>
    </Card>
  );
}
