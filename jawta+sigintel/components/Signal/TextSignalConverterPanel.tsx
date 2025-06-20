import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Type, 
  Languages, 
  BrainCircuit, 
  GlobeLock, 
  Database, 
  Keyboard, 
  ArrowRightLeft,
  Smartphone,
  Vibrate,
  Lightbulb,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { MorseVisualizer } from '../visualization/MorseVisualizer';
import { textToMorse, morseToText } from '../utils/textUtils';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface TextSignalConverterPanelProps {
  onEmergency?: (type: string) => void;
}

export function TextSignalConverterPanel({ onEmergency }: TextSignalConverterPanelProps) {
  const [inputText, setInputText] = useState('');
  const [morseOutput, setMorseOutput] = useState('');
  const [textMode, setTextMode] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');

  // Process text when input changes
  useEffect(() => {
    if (textMode === 'text-to-morse' && inputText) {
      setMorseOutput(textToMorse(inputText));
    } else if (textMode === 'morse-to-text' && inputText) {
      setMorseOutput(morseToText(inputText));
    } else {
      setMorseOutput('');
    }
  }, [inputText, textMode]);

  // Handle text mode toggle
  const toggleTextMode = () => {
    setTextMode(prev => prev === 'text-to-morse' ? 'morse-to-text' : 'text-to-morse');
    setInputText('');
    setMorseOutput('');
  };

  // Handle opening the full text conversion page
  const openFullTextTools = () => {
    if (onEmergency) {
      onEmergency('text');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Code className="h-6 w-6 text-amber-400" /> 
          <span>Text & Code Utilities</span>
        </h2>
        
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 hover:from-amber-600/40 hover:to-yellow-600/40 border-white/10"
          onClick={openFullTextTools}
        >
          <ExternalLink className="h-4 w-4 mr-1.5" />
          All Tools
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="bg-black/40 border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <ArrowRightLeft className="h-4 w-4 mr-1.5 text-amber-400" />
              Quick Morse Converter
            </CardTitle>
            <CardDescription className="text-xs">
              Convert between text and Morse code
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {textMode === 'text-to-morse' ? 'Convert text to Morse code' : 'Convert Morse code to text'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs" 
                  onClick={toggleTextMode}
                >
                  Switch Mode
                </Button>
              </div>
              
              <Textarea 
                placeholder={textMode === 'text-to-morse' 
                  ? "Type text to convert to Morse code..." 
                  : "Enter Morse code (dots, dashes and slashes)..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[100px] resize-none bg-black border-gray-700"
              />
              
              <div className="bg-black/30 p-2 rounded-md">
                <MorseVisualizer 
                  morseText={morseOutput} 
                  height={60} 
                  showControls={!!morseOutput}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500"
              onClick={openFullTextTools}
            >
              Advanced Morse Tools
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-4">
          <Card className="bg-black/40 border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Smartphone className="h-4 w-4 mr-1.5 text-cyan-400" />
                Mobile Device Features
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col h-20 justify-center bg-gradient-to-b from-cyan-900/20 to-blue-900/20 hover:from-cyan-900/40 hover:to-blue-900/40 border-white/10"
                  onClick={() => onEmergency?.('text')}
                >
                  <Keyboard className="h-6 w-6 mb-1 text-cyan-400" />
                  <span className="text-xs">QWERTY ↔ T9</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col h-20 justify-center bg-gradient-to-b from-cyan-900/20 to-blue-900/20 hover:from-cyan-900/40 hover:to-blue-900/40 border-white/10"
                  onClick={() => onEmergency?.('text')}
                >
                  <Vibrate className="h-6 w-6 mb-1 text-green-500" />
                  <span className="text-xs">Vibration Patterns</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col h-20 justify-center bg-gradient-to-b from-cyan-900/20 to-blue-900/20 hover:from-cyan-900/40 hover:to-blue-900/40 border-white/10"
                  onClick={() => onEmergency?.('text')}
                >
                  <Lightbulb className="h-6 w-6 mb-1 text-yellow-400" />
                  <span className="text-xs">Light Patterns</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col h-20 justify-center bg-gradient-to-b from-purple-900/20 to-violet-900/20 hover:from-purple-900/40 hover:to-violet-900/40 border-white/10"
                  onClick={() => onEmergency?.('text')}
                >
                  <Database className="h-6 w-6 mb-1 text-purple-400" />
                  <span className="text-xs">Database Tools</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <BrainCircuit className="h-4 w-4 mr-1.5 text-purple-400" />
                Advanced Features
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-16 flex flex-col justify-center bg-gradient-to-b from-red-900/20 to-orange-900/20 hover:from-red-900/40 hover:to-orange-900/40 border-white/10 px-1"
                  onClick={() => onEmergency?.('text')}
                >
                  <GlobeLock className="h-5 w-5 mb-1 text-red-400" />
                  <span className="text-xs">Encryption</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-16 flex flex-col justify-center bg-gradient-to-b from-indigo-900/20 to-violet-900/20 hover:from-indigo-900/40 hover:to-violet-900/40 border-white/10 px-1"
                  onClick={() => onEmergency?.('text')}
                >
                  <Languages className="h-5 w-5 mb-1 text-indigo-400" />
                  <span className="text-xs">Languages</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-16 flex flex-col justify-center bg-gradient-to-b from-blue-900/20 to-cyan-900/20 hover:from-blue-900/40 hover:to-cyan-900/40 border-white/10 px-1"
                  onClick={() => onEmergency?.('text')}
                >
                  <Type className="h-5 w-5 mb-1 text-cyan-400" />
                  <span className="text-xs">ASCII Art</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <Badge variant="outline" className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border-amber-500/30">
          <Zap className="h-3 w-3 mr-1 text-amber-400" />
          Quick access to full text & code utilities is available in the sidebar
        </Badge>
      </div>
    </div>
  );
}