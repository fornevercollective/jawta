import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Power, Wifi, Signal, HardDrive, Cpu, Activity, Globe, Lock, Eye, Zap } from 'lucide-react';
import { TerminalVisualizer } from '../visualization/TerminalVisualizer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface SystemTerminalPanelProps {
  onEmergency?: (type: string) => void;
}

export function SystemTerminalPanel({ onEmergency }: SystemTerminalPanelProps) {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '[09:42:15] JAWTA System Terminal v2.1.0',
    '[09:42:16] Signal Processing Interface Active',
    '[09:42:17] RF Monitoring Online | WiFi Scanner Ready',
    '[09:42:18] Type "help" for available commands',
    '[09:42:19] Type "scan" to start network analysis',
    '[09:42:20] Type "status" for system diagnostics',
    'jawta@signal:~$ '
  ]);
  
  const [systemStatus, setSystemStatus] = useState({
    cpu: 23,
    memory: 45,
    signals: 8,
    networks: 12
  });

  // Simulated command responses
  const commandResponses = {
    help: [
      'Available Commands:',
      '  scan          - Start wireless network scan',
      '  status        - Show system status',
      '  signals       - List detected RF signals',
      '  networks      - Show nearby networks',
      '  spectrum      - Display spectrum analysis',
      '  decode <type> - Decode signal (morse, binary, etc.)',
      '  monitor       - Start signal monitoring',
      '  clear         - Clear terminal',
      '  exit          - Close terminal'
    ],
    status: [
      'System Status Report:',
      `CPU Usage: ${systemStatus.cpu}%`,
      `Memory: ${systemStatus.memory}%`,
      `Active Signals: ${systemStatus.signals}`,
      `Networks: ${systemStatus.networks}`,
      'RF Modules: ONLINE',
      'Signal Processor: READY',
      'Encryption Engine: ACTIVE'
    ],
    scan: [
      'Starting wireless scan...',
      'Detected Networks:',
      '  WiFi-5G-7B3A    | -42dBm | WPA3 | Ch.149',
      '  HomeNetwork_2.4 | -55dBm | WPA2 | Ch.6',
      '  NETGEAR_Guest   | -67dBm | Open | Ch.11',
      '  BT_Device_A1B2  | -35dBm | BLE  | 2.4GHz',
      'Scan complete. 4 networks detected.'
    ],
    signals: [
      'RF Signal Analysis:',
      '  433.92MHz | FSK  | Remote Control | -78dBm',
      '  868.30MHz | LoRa | IoT Sensor     | -82dBm',
      '  2.4GHz    | WiFi | Data Stream    | -45dBm',
      '  5.8GHz    | WiFi | Video Stream   | -38dBm',
      'Total: 4 active signals detected'
    ],
    networks: [
      'Network Topology:',
      '  Local: 192.168.1.0/24 (12 devices)',
      '  Guest: 192.168.2.0/24 (3 devices)',
      '  IoT:   10.0.1.0/24 (8 devices)',
      'Gateway: 192.168.1.1 | Online',
      'DNS: 8.8.8.8, 1.1.1.1 | Responding'
    ],
    spectrum: [
      'Spectrum Analysis Active:',
      '  2.4GHz Band: 73% utilization',
      '  5GHz Band:   41% utilization',
      '  UHF Band:    12% utilization',
      'Peak Activity: Channel 6 (2.437GHz)',
      'Interference: Minimal'
    ],
    monitor: [
      'Signal monitoring started...',
      'Capturing on all bands...',
      '[10:23:45] New device connected: B4:A9:FC:1E:23:67',
      '[10:23:52] LoRa packet decoded: Sensor ID 0x4A3F',
      '[10:24:01] WiFi handshake captured',
      'Monitoring active. Type "stop" to halt.'
    ]
  };

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    let response: string[] = [];

    if (cmd === 'clear') {
      setTerminalOutput(['jawta@signal:~$ ']);
      return;
    }

    if (cmd === 'exit') {
      setTerminalOutput(prev => [...prev, 'Terminal session ended.']);
      return;
    }

    // Add the command to output first
    setTerminalOutput(prev => [...prev, `jawta@signal:~$ ${command}`]);

    // Generate response based on command
    if (commandResponses[cmd as keyof typeof commandResponses]) {
      response = commandResponses[cmd as keyof typeof commandResponses];
    } else if (cmd.startsWith('decode ')) {
      const type = cmd.split(' ')[1];
      response = [
        `Decoding ${type} signal...`,
        'Signal acquired and processed.',
        type === 'morse' ? 'Decoded: "HELLO WORLD"' : 'Binary data: 0x4A57544121',
        'Decode complete.'
      ];
    } else if (cmd === 'stop') {
      response = ['Monitoring stopped.', 'All capture processes terminated.'];
    } else {
      response = [`Command not found: ${command}`, 'Type "help" for available commands.'];
    }

    // Add response to terminal with slight delay
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, ...response, 'jawta@signal:~$ ']);
      
      // Update system status occasionally
      if (Math.random() > 0.7) {
        setSystemStatus(prev => ({
          cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 20)),
          memory: Math.max(20, Math.min(80, prev.memory + (Math.random() - 0.5) * 15)),
          signals: Math.max(0, Math.min(20, prev.signals + Math.floor((Math.random() - 0.5) * 3))),
          networks: Math.max(5, Math.min(25, prev.networks + Math.floor((Math.random() - 0.5) * 2)))
        }));
      }
    }, 200);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-gray-600/20 to-slate-600/20">
            <Terminal className="h-6 w-6 text-gray-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">System Terminal</h2>
            <p className="text-sm text-muted-foreground">Signal processing command interface</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            <Activity className="h-3 w-3 mr-1" />
            ONLINE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Interface */}
        <div className="lg:col-span-2">
          <TerminalVisualizer
            terminalOutput={terminalOutput}
            height="500px"
            feedName="Signal Terminal"
            onCommand={handleCommand}
            className="h-[500px]"
          />
        </div>

        {/* System Status Panel */}
        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              System Status
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">CPU</span>
                  <span className="text-white">{systemStatus.cpu}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${systemStatus.cpu}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="text-white">{systemStatus.memory}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-violet-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${systemStatus.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Signal className="h-4 w-4" />
              RF Activity
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Active Signals</span>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  {systemStatus.signals}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Networks</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                  {systemStatus.networks}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </h3>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleCommand('scan')}
              >
                <Wifi className="h-3 w-3 mr-2" />
                Network Scan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleCommand('spectrum')}
              >
                <Activity className="h-3 w-3 mr-2" />
                Spectrum Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleCommand('monitor')}
              >
                <Eye className="h-3 w-3 mr-2" />
                Start Monitor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Command Reference */}
      <div className="bg-black/20 rounded-lg border border-white/10 p-4">
        <h3 className="text-sm font-medium text-white mb-2">Quick Command Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <span className="text-cyan-400">scan</span>
          <span className="text-cyan-400">status</span>
          <span className="text-cyan-400">signals</span>
          <span className="text-cyan-400">networks</span>
          <span className="text-cyan-400">spectrum</span>
          <span className="text-cyan-400">monitor</span>
          <span className="text-cyan-400">decode morse</span>
          <span className="text-cyan-400">help</span>
        </div>
      </div>
    </div>
  );
}
