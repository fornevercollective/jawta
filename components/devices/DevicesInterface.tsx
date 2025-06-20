
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DeviceProtocolAnalyzer } from "./DeviceProtocolAnalyzer";
import { RFDeviceEmulator } from "./RFDeviceEmulator";
import { 
  Radio, 
  Smartphone, 
  Usb, 
  Bluetooth, 
  Wifi, 
  Calendar, 
  CreditCard,
  Volume2,
  VolumeX
} from "lucide-react";
import { Badge } from "../ui/badge";

interface DevicesInterfaceProps {
  volume?: number; // Volume as a value between 0 and 1
}

export function DevicesInterface({ volume = 1 }: DevicesInterfaceProps) {
  const [activeDeviceTab, setActiveDeviceTab] = useState<string>("proxmark");
  const isMuted = volume <= 0;
  
  return (
    <div className="space-y-3">
      {/* Volume warning when muted */}
      {isMuted && (
        <div className="flex items-center gap-2 text-sm border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
          <VolumeX className="h-5 w-5 text-amber-500" />
          <span>Device output is currently <strong>muted</strong>. Adjust volume control to enable output.</span>
        </div>
      )}
      
      <div className="border rounded-md bg-card overflow-hidden">
        <Tabs defaultValue="proxmark" value={activeDeviceTab} onValueChange={setActiveDeviceTab}>
          <div className="flex justify-between items-center border-b p-2">
            <TabsList className="bg-muted/40">
              <TabsTrigger 
                value="proxmark"
                className="data-[state=active]:bg-background h-8"
              >
                <Radio className="h-4 w-4 mr-1.5" />
                Proxmark3
                <Badge variant="outline" className="ml-2 py-0">RFID</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="flipper"
                className="data-[state=active]:bg-background h-8"
              >
                <Smartphone className="h-4 w-4 mr-1.5" />
                Flipper Zero
                <Badge variant="outline" className="ml-2 py-0">Multi</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="hackrf"
                className="data-[state=active]:bg-background h-8"
              >
                <Usb className="h-4 w-4 mr-1.5" />
                HackRF
                <Badge variant="outline" className="ml-2 py-0">SDR</Badge>
              </TabsTrigger>
            </TabsList>
            
            {volume < 1 && (
              <div className="flex items-center gap-1 pr-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {Math.round(volume * 100)}%
                </Badge>
              </div>
            )}
          </div>
          
          <TabsContent value="proxmark" className="p-4">
            <DeviceProtocolAnalyzer 
              deviceType="proxmark3" 
              features={["lf", "hf", "nfc", "smartcard"]}
              volume={volume}
            />
          </TabsContent>
          
          <TabsContent value="flipper" className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3 space-y-3">
                <div className="border rounded-md p-3">
                  <h3 className="font-medium text-sm flex items-center gap-1">
                    <Smartphone className="h-4 w-4 text-primary" />
                    Flipper Zero
                  </h3>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">Status</Badge>
                      <span className={`flex items-center gap-1 ${isMuted ? 'text-amber-500' : 'text-green-600'}`}>
                        <div className={`h-2 w-2 rounded-full ${isMuted ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`}></div>
                        {isMuted ? 'Output Muted' : 'Connected'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded-md p-2 flex flex-col">
                        <span className="text-xs text-muted-foreground">Sub-GHz</span>
                        <Badge variant={activeDeviceTab === "flipper" && !isMuted ? "secondary" : "outline"} className="mt-1">
                          Active
                        </Badge>
                      </div>
                      <div className="border rounded-md p-2 flex flex-col">
                        <span className="text-xs text-muted-foreground">NFC/RFID</span>
                        <Badge variant="outline" className="mt-1">Ready</Badge>
                      </div>
                      <div className="border rounded-md p-2 flex flex-col">
                        <span className="text-xs text-muted-foreground">Infrared</span>
                        <Badge variant="outline" className="mt-1">Ready</Badge>
                      </div>
                      <div className="border rounded-md p-2 flex flex-col">
                        <span className="text-xs text-muted-foreground">iButton</span>
                        <Badge variant="outline" className="mt-1">Ready</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 space-y-3">
                  <h3 className="font-medium text-sm">Available Protocols</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="py-0.5 text-xs">
                      <Radio className="h-3 w-3 mr-1" /> Sub-1GHz
                    </Badge>
                    <Badge variant="outline" className="py-0.5 text-xs">
                      <Bluetooth className="h-3 w-3 mr-1" /> BLE
                    </Badge>
                    <Badge variant="outline" className="py-0.5 text-xs">
                      <Wifi className="h-3 w-3 mr-1" /> RFID 125kHz
                    </Badge>
                    <Badge variant="outline" className="py-0.5 text-xs">
                      <Calendar className="h-3 w-3 mr-1" /> NFC 13.56MHz
                    </Badge>
                    <Badge variant="outline" className="py-0.5 text-xs">
                      <CreditCard className="h-3 w-3 mr-1" /> 125kHz Cards
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <RFDeviceEmulator 
                  deviceType="flipper" 
                  supportedBands={["subghz", "lf-rfid", "nfc", "ir"]}
                  volume={volume}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hackrf" className="p-4">
            <div className="h-64 flex items-center justify-center border rounded-md">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Usb className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Connect HackRF device to begin SDR operations</p>
                {isMuted && (
                  <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 border-amber-200 dark:border-amber-800">
                    Volume Muted
                  </Badge>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
