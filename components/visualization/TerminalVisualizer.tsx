import React, { useState, useEffect, useRef } from 'react';
import { Terminal, SendHorizontal, Clock, XCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface TerminalVisualizerProps {
  terminalOutput?: string[];
  height?: string;
  isActive?: boolean;
  feedName?: string;
  className?: string;
  initialData?: string[];
  onCommand?: (command: string) => void;
}

export function TerminalVisualizer({
  terminalOutput: terminalOutputProp,
  height,
  isActive = true,
  feedName = "System Terminal",
  className = "",
  initialData = [],
  onCommand
}: TerminalVisualizerProps) {
  const [terminalOutput, setTerminalOutput] = useState<string[]>(
    terminalOutputProp && terminalOutputProp.length > 0 ? terminalOutputProp :
    initialData.length > 0 ? initialData : [
    '[08:42:15] Terminal session started',
    '[08:42:16] System initialized',
    '[08:42:17] Type "help" for available commands'
  ]);
  
  // Update output when terminalOutputProp changes
  useEffect(() => {
    if (terminalOutputProp && terminalOutputProp.length > 0) {
      setTerminalOutput(terminalOutputProp);
    }
  }, [terminalOutputProp]);
  
  const [command, setCommand] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);
  
  // Simulate incoming terminal data
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      const systemMessages = [
        'System status: operational',
        'Network connection established',
        'Memory usage: 42%',
        'CPU load: 18%',
        'Scanning frequencies...',
        'Background process completed',
        'Cache cleared',
        'Scheduled maintenance in 24 hours'
      ];
      
      if (Math.random() > 0.7) { // Only show messages sometimes
        const randomMessage = systemMessages[Math.floor(Math.random() * systemMessages.length)];
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        setTerminalOutput(prev => [...prev.slice(-50), `[${timestamp}] ${randomMessage}`]);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  // Handle command submission
  const handleSubmitCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Add command to terminal with timestamp
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTerminalOutput(prev => [...prev, `[${timestamp}] > ${command}`]);
    
    // Process common commands
    if (command.toLowerCase() === 'clear') {
      setTerminalOutput([`[${timestamp}] Terminal cleared`]);
    } else if (command.toLowerCase() === 'help') {
      setTerminalOutput(prev => [
        ...prev,
        `[${timestamp}] Available commands:`,
        `[${timestamp}] - help: Show this help`,
        `[${timestamp}] - clear: Clear terminal`,
        `[${timestamp}] - status: Show system status`,
        `[${timestamp}] - scan: Scan frequencies`,
        `[${timestamp}] - exit: Close terminal session`
      ]);
    } else if (command.toLowerCase() === 'status') {
      setTerminalOutput(prev => [
        ...prev,
        `[${timestamp}] System status: OPERATIONAL`,
        `[${timestamp}] Memory: 42% used`,
        `[${timestamp}] CPU: 18% load`,
        `[${timestamp}] Disk: 67% free`,
        `[${timestamp}] Network: Connected (VPN active)`
      ]);
    } else if (command.toLowerCase() === 'scan') {
      setTerminalOutput(prev => [
        ...prev,
        `[${timestamp}] Beginning frequency scan...`,
        `[${timestamp}] Detected signal on 145.500 MHz`,
        `[${timestamp}] Detected signal on 432.100 MHz`,
        `[${timestamp}] Scan complete. 2 active signals found.`
      ]);
    } else {
      // Pass the command to parent if handler provided
      if (onCommand) {
        onCommand(command);
      } else {
        // Default response
        setTerminalOutput(prev => [...prev, `[${timestamp}] Command not recognized: ${command}`]);
      }
    }
    
    // Clear input
    setCommand('');
  };
  
  // Clear the terminal
  const clearTerminal = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTerminalOutput([`[${timestamp}] Terminal cleared`]);
  };
  
  return (
    <div className={`h-full flex flex-col overflow-hidden bg-black rounded-lg border border-border/30 ${className}`}>
      <div className="p-3 border-b border-border/30 flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center">
          <Terminal className="h-4 w-4 mr-1.5 text-green-400" />
          <span>{feedName}</span>
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-black/80 border-white/20 text-green-400">
            TERMINAL
          </Badge>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={clearTerminal}>
            <XCircle className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-2 overflow-y-auto bg-black/90 font-mono text-xs text-green-400 space-y-0.5"
      >
        {terminalOutput.map((line, index) => (
          <div 
            key={index} 
            className={`${index === terminalOutput.length - 1 ? 'animate-typing' : ''} ${line.includes('> ') ? 'text-blue-400' : ''}`}
          >
            {line}
          </div>
        ))}
        {isActive && (
          <div className="animate-pulse-subtle">█</div>
        )}
      </div>
      
      <div className="p-2 border-t border-border/30">
        <form onSubmit={handleSubmitCommand} className="flex gap-2">
          <Input 
            className="bg-black/50 border-gray-700 text-xs font-mono text-green-400"
            placeholder="Enter command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={!isActive}
          />
          <Button type="submit" size="sm" variant="outline" disabled={!isActive}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}