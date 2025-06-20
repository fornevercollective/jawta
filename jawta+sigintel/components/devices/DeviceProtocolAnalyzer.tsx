
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import {
  Activity,
  Binary,
  FileCode,
  Waves,
  Code2,
  BarChart4
} from "lucide-react";

interface SignalData {
  timestamp: number;
  pulse: number;
  gap: number;
  length: number;
}

interface DecodedProtocol {
  name: string;
  confidence: number;
  data: string;
  description: string;
}

interface BinarySequence {
  data: string;
  length: number;
}

export function DeviceProtocolAnalyzer() {
  // State for captured signal data
  const [rawSignalData, setRawSignalData] = useState<SignalData[]>([]);
  const [binarySequence, setBinarySequence] = useState<BinarySequence | null>(null);
  const [decodedProtocols, setDecodedProtocols] = useState<DecodedProtocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [sampleRate, setSampleRate] = useState<number>(250);
  const [signalThreshold, setSignalThreshold] = useState<number>(30);
  const [minPulseValue, setMinPulseValue] = useState<string>("100");
  const [maxPulseValue, setMaxPulseValue] = useState<string>("15000");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureIntervalRef = useRef<number | null>(null);
  
  // Effect for capturing signal data
  useEffect(() => {
    if (!isCapturing) return;
    
    let dataPoints: SignalData[] = [];
    let startTime = Date.now();
    
    // Simulate capturing RF signal data
    captureIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      // Generate somewhat realistic pulse/gap pattern with some randomness
      // but also following patterns that might represent real protocols
      if (dataPoints.length < 200) {
        // Add simulated data points
        if (dataPoints.length % 8 === 0) {
          // Simulate a longer gap (protocol separator)
          dataPoints.push({
            timestamp: elapsed,
            pulse: 0,
            gap: 15 + Math.random() * 5,
            length: 15 + Math.random() * 5
          });
        } else {
          // Regular pulse-gap pattern
          const pulseLen = Math.random() > 0.5 ? 5 + Math.random() * 3 : 1 + Math.random() * 2;
          const gapLen = Math.random() > 0.5 ? 5 + Math.random() * 3 : 1 + Math.random() * 2;
          
          dataPoints.push({
            timestamp: elapsed,
            pulse: pulseLen,
            gap: gapLen,
            length: pulseLen + gapLen
          });
        }
        
        setRawSignalData([...dataPoints]);
      } else {
        // Enough data captured, stop and analyze
        stopCapturing();
        performAnalysis(dataPoints);
      }
    }, 50); // Generate data points at 50ms intervals
    
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
    };
  }, [isCapturing]);
  
  // Effect to draw signal visualization
  useEffect(() => {
    if (!canvasRef.current || !rawSignalData.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Setup canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaling factors
    const padding = 20;
    const graphHeight = canvas.height - 2 * padding;
    const graphWidth = canvas.width - 2 * padding;
    
    // Calculate total signal length for x-scale
    const totalLength = rawSignalData.reduce((sum, point) => sum + point.length, 0);
    const xScale = graphWidth / totalLength;
    
    // Draw time axis
    ctx.beginPath();
    ctx.strokeStyle = "#888";
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw signal
    let xPosition = padding;
    ctx.beginPath();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    
    // Start at baseline
    ctx.moveTo(xPosition, canvas.height - padding);
    
    // Draw each pulse and gap
    rawSignalData.forEach((point) => {
      // Draw pulse (high)
      if (point.pulse > 0) {
        ctx.lineTo(xPosition, canvas.height - padding - graphHeight * 0.8);
        xPosition += point.pulse * xScale;
        ctx.lineTo(xPosition, canvas.height - padding - graphHeight * 0.8);
      }
      
      // Draw gap (low)
      ctx.lineTo(xPosition, canvas.height - padding);
      xPosition += point.gap * xScale;
      ctx.lineTo(xPosition, canvas.height - padding);
    });
    
    ctx.stroke();
    
    // Draw vertical time markers
    ctx.strokeStyle = "#44444422";
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * graphWidth;
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      
      // Add time label
      ctx.fillStyle = "#666";
      ctx.font = "10px sans-serif";
      ctx.fillText(`${Math.floor((i / 10) * totalLength)}µs`, x - 15, canvas.height - 5);
    }
    ctx.stroke();
    
  }, [rawSignalData]);
  
  const startCapturing = () => {
    setIsCapturing(true);
    setRawSignalData([]);
    setBinarySequence(null);
    setDecodedProtocols([]);
    setAnalysisComplete(false);
    setSelectedProtocol(null);
  };
  
  const stopCapturing = () => {
    setIsCapturing(false);
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };
  
  const clearData = () => {
    setRawSignalData([]);
    setBinarySequence(null);
    setDecodedProtocols([]);
    setAnalysisComplete(false);
    setSelectedProtocol(null);
  };
  
  const handleMinPulseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPulseValue(e.target.value);
  };
  
  const handleMaxPulseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPulseValue(e.target.value);
  };
  
  // Convert pulse-gap data to binary sequence
  const convertToBinary = (data: SignalData[]): BinarySequence => {
    // Simple threshold-based conversion
    // Short pulse = 0, long pulse = 1
    // This is a simplified example - real decoders have more complex algorithms
    
    const threshold = 3; // Threshold to distinguish short vs long pulses
    let binary = "";
    
    data.forEach(point => {
      if (point.pulse < threshold) {
        binary += "0";
      } else {
        binary += "1";
      }
    });
    
    return {
      data: binary,
      length: binary.length
    };
  };
  
  // Simulate protocol analysis
  const performAnalysis = (data: SignalData[]) => {
    // Convert to binary first
    const binary = convertToBinary(data);
    setBinarySequence(binary);
    
    // Simulate protocol analysis
    setTimeout(() => {
      // These are mock protocols that would be detected by a real analyzer
      const protocols: DecodedProtocol[] = [
        {
          name: "Princeton PT2264",
          confidence: 87,
          data: "0x" + parseInt(binary.data.substring(0, 24), 2).toString(16).toUpperCase(),
          description: "Common in garage door openers and home security systems"
        },
        {
          name: "Nice FLO",
          confidence: 65,
          data: "0x" + parseInt(binary.data.substring(0, 32), 2).toString(16).toUpperCase(),
          description: "Rolling code system used in gate remotes"
        },
        {
          name: "Keeloq",
          confidence: 42,
          data: "0x" + parseInt(binary.data.substring(0, 64), 2).toString(16).toUpperCase(),
          description: "Hopping code used in automotive security"
        },
        {
          name: "Generic OOK",
          confidence: 95,
          data: binary.data.substring(0, 40),
          description: "On-off keying modulation"
        }
      ];
      
      setDecodedProtocols(protocols);
      setSelectedProtocol(protocols[0].name);
      setAnalysisComplete(true);
    }, 1500); // Simulate processing delay
  };
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileCode className="h-5 w-5 text-primary" />
            <span>Protocol Analyzer</span>
            {analysisComplete && (
              <Badge variant="outline" className="ml-2">{decodedProtocols.length} Protocols</Badge>
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            {isCapturing ? (
              <Button variant="destructive" size="sm" onClick={stopCapturing}>
                Stop Capture
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={startCapturing}
                disabled={isCapturing}
              >
                Capture Signal
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearData}
              disabled={isCapturing || rawSignalData.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
        <CardDescription>
          Analyze and decode RF protocols from captured signals
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Signal visualization canvas */}
          <div className="border rounded-md p-2 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <Waves className="h-4 w-4 text-primary" />
                <span>Signal Waveform</span>
              </h3>
              
              {isCapturing && (
                <Badge variant="secondary" className="animate-pulse-subtle">Capturing...</Badge>
              )}
            </div>
            
            <div className="h-[120px] relative">
              {rawSignalData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  {isCapturing ? "Waiting for signal..." : "No signal data captured yet"}
                </div>
              ) : (
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full" 
                />
              )}
            </div>
          </div>
          
          {/* Capture settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 p-3 border rounded-md">
              <h3 className="text-sm font-medium">Capture Settings</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label htmlFor="sample-rate">Sample Rate</Label>
                  <span className="text-muted-foreground">{sampleRate} kSps</span>
                </div>
                <Slider
                  id="sample-rate"
                  min={100}
                  max={500}
                  step={10}
                  value={[sampleRate]}
                  onValueChange={(v) => setSampleRate(v[0])}
                  disabled={isCapturing}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label htmlFor="threshold">Signal Threshold</Label>
                  <span className="text-muted-foreground">{signalThreshold}%</span>
                </div>
                <Slider
                  id="threshold"
                  min={10}
                  max={80}
                  step={1}
                  value={[signalThreshold]}
                  onValueChange={(v) => setSignalThreshold(v[0])}
                  disabled={isCapturing}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <Label htmlFor="min-pulse" className="text-xs">Min Pulse (µs)</Label>
                  <Input 
                    id="min-pulse" 
                    value={minPulseValue} 
                    onChange={handleMinPulseChange}
                    disabled={isCapturing} 
                    className="h-8 text-sm" 
                  />
                </div>
                <div>
                  <Label htmlFor="max-pulse" className="text-xs">Max Pulse (µs)</Label>
                  <Input 
                    id="max-pulse" 
                    value={maxPulseValue} 
                    onChange={handleMaxPulseChange}
                    disabled={isCapturing} 
                    className="h-8 text-sm" 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-3 p-3 border rounded-md">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <Binary className="h-4 w-4 text-primary" />
                <span>Binary Data</span>
              </h3>
              
              {binarySequence ? (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    Length: {binarySequence.length} bits
                  </div>
                  <ScrollArea className="h-[90px] bg-muted/20 rounded border p-2">
                    <code className="text-xs font-mono whitespace-pre-wrap break-all">
                      {binarySequence.data}
                    </code>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center h-[120px] text-muted-foreground text-sm">
                  No binary data available
                </div>
              )}
            </div>
          </div>
          
          {/* Protocol Analysis Results */}
          {analysisComplete && (
            <div className="border rounded-md p-3">
              <h3 className="text-sm font-medium flex items-center gap-1.5 mb-3">
                <BarChart4 className="h-4 w-4 text-primary" />
                <span>Protocol Analysis Results</span>
              </h3>
              
              <Tabs value={selectedProtocol || ""} onValueChange={setSelectedProtocol}>
                <TabsList className="mb-2">
                  {decodedProtocols.map(protocol => (
                    <TabsTrigger key={protocol.name} value={protocol.name}>
                      {protocol.name}
                      <Badge 
                        variant="outline" 
                        className={`ml-1.5 text-[9px] ${
                          protocol.confidence > 70 ? "text-green-500" : 
                          protocol.confidence > 50 ? "text-amber-500" : "text-red-500"
                        }`}
                      >
                        {protocol.confidence}%
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {decodedProtocols.map(protocol => (
                  <TabsContent key={protocol.name} value={protocol.name} className="mt-2 pt-0 border-0">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-6 p-3 border rounded-md">
                      <div className="text-sm font-medium">Protocol</div>
                      <div className="text-sm">{protocol.name}</div>
                      
                      <div className="text-sm font-medium">Confidence</div>
                      <div className="text-sm">{protocol.confidence}%</div>
                      
                      <div className="text-sm font-medium">Data</div>
                      <div className="text-sm font-mono">{protocol.data}</div>
                      
                      <div className="text-sm font-medium">Description</div>
                      <div className="text-sm">{protocol.description}</div>
                      
                      <div className="col-span-2 mt-2">
                        <Button size="sm" className="text-xs mr-2">Clone Signal</Button>
                        <Button size="sm" variant="outline" className="text-xs">Save to Library</Button>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
          
          {/* Raw Data Table */}
          {rawSignalData.length > 0 && (
            <div className="border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span>Raw Signal Data</span>
                </h3>
                <Badge variant="outline" className="text-xs">
                  {rawSignalData.length} points
                </Badge>
              </div>
              
              <div className="overflow-x-auto">
                <ScrollArea className="h-[150px]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-1 text-left font-medium">#</th>
                        <th className="px-2 py-1 text-left font-medium">Time (µs)</th>
                        <th className="px-2 py-1 text-left font-medium">Pulse (µs)</th>
                        <th className="px-2 py-1 text-left font-medium">Gap (µs)</th>
                        <th className="px-2 py-1 text-left font-medium">Length (µs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rawSignalData.slice(0, 50).map((point, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                          <td className="px-2 py-1">{index + 1}</td>
                          <td className="px-2 py-1">{point.timestamp}</td>
                          <td className="px-2 py-1">{point.pulse.toFixed(2)}</td>
                          <td className="px-2 py-1">{point.gap.toFixed(2)}</td>
                          <td className="px-2 py-1">{point.length.toFixed(2)}</td>
                        </tr>
                      ))}
                      {rawSignalData.length > 50 && (
                        <tr>
                          <td colSpan={5} className="text-center py-1 text-muted-foreground">
                            {rawSignalData.length - 50} more entries...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 mt-2">
        <div className="flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Protocol Analysis Status: {analysisComplete ? "Complete" : "Ready"}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
