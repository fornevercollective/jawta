
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AsciiArtVisualizerProps {
  initialText?: string;
}

export function AsciiArtVisualizer({ initialText = '' }: AsciiArtVisualizerProps) {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [activeTab, setActiveTab] = useState('text-to-ascii');
  
  // Simple text to ASCII art conversion
  const convertToAscii = () => {
    if (!inputText) {
      setOutputText('Please enter some text to convert.');
      return;
    }
    
    // Create a basic ASCII art representation (simplified)
    let output = '';
    const lines = inputText.split('\n');
    
    for (const line of lines) {
      // Create a simple border
      if (line) {
        output += '┌' + '─'.repeat(line.length + 2) + '┐\n';
        output += '│ ' + line + ' │\n';
        output += '└' + '─'.repeat(line.length + 2) + '┘\n\n';
      }
    }
    
    setOutputText(output || 'Conversion complete.');
  };
  
  // Convert ASCII art patterns to signal data
  const convertToSignal = () => {
    if (!inputText) {
      setOutputText('Please enter ASCII art to convert.');
      return;
    }
    
    // Simplified conversion - in a real application this would convert to actual signal data
    const signalValues = inputText.split('').map(char => {
      const code = char.charCodeAt(0);
      return code.toString(2).padStart(8, '0');
    });
    
    setOutputText(signalValues.join(' '));
  };
  
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="text-to-ascii" className="flex-1">
            Text to ASCII Art
          </TabsTrigger>
          <TabsTrigger value="ascii-to-signal" className="flex-1">
            ASCII Art to Signal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text-to-ascii">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Input Text</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to convert to ASCII art..."
                className="w-full h-40 p-2 bg-black/40 border border-border/30 rounded-md font-mono text-sm"
              />
              <Button onClick={convertToAscii} className="w-full">
                Convert to ASCII Art
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">ASCII Output</label>
              <div className="w-full h-40 p-2 bg-black/40 border border-border/30 rounded-md font-mono text-sm overflow-auto whitespace-pre">
                {outputText}
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(outputText)}>
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ascii-to-signal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">ASCII Art Input</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter ASCII art to convert to signal data..."
                className="w-full h-40 p-2 bg-black/40 border border-border/30 rounded-md font-mono text-sm"
              />
              <Button onClick={convertToSignal} className="w-full">
                Convert to Signal Data
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Signal Output</label>
              <div className="w-full h-40 p-2 bg-black/40 border border-border/30 rounded-md font-mono text-xs overflow-auto">
                {outputText}
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(outputText)}>
                Copy Binary Data
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
