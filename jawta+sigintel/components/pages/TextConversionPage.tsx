import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Code, 
  Smartphone, 
  Vibrate, 
  Keyboard, 
  Type, 
  FileSymlink, 
  GlobeLock, 
  Languages, 
  BrainCircuit, 
  Database, 
  FileCode, 
  Lightbulb, 
  ArrowRightLeft, 
  EyeOff, 
  Eye,
  Copy,
  Check,
  Compass,
  Send,
  RefreshCw,
  X,
  RotateCw,
  Save,
  FileDown,
  FileUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Card, CardContent } from '../ui/card';
import { useResponsive } from '../ui/use-responsive';
import { MorseVisualizer } from '../visualization/MorseVisualizer';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

// Mock functions for text conversion utilities
import { 
  textToMorse, 
  morseToText,
  qwertyToNumberpad,
  numberpadToQwerty,
  encryptText,
  decryptText,
  textToAsciiArt,
  convertToWingdings,
  detectLanguage,
  convertToVibrationPattern,
  convertToLightPattern,
  translateToCustomLanguage,
  getUnicodeInfo
} from '../utils/textUtils';

// Sample mock data for custom languages
const CUSTOM_LANGUAGES = [
  { id: 'klingon', name: 'Klingon', type: 'fictional' },
  { id: 'elvish', name: 'Elvish', type: 'fictional' },
  { id: 'dothraki', name: 'Dothraki', type: 'fictional' },
  { id: 'minionese', name: 'Minionese', type: 'fictional' },
  { id: 'navi', name: 'Na\'vi', type: 'fictional' },
  { id: 'morse', name: 'Morse Code', type: 'code' },
  { id: 'binary', name: 'Binary', type: 'code' },
  { id: 'hex', name: 'Hexadecimal', type: 'code' },
  { id: 'ascii', name: 'ASCII Art', type: 'visual' },
  { id: 'wingdings', name: 'Wingdings', type: 'visual' },
  { id: 'braille', name: 'Braille', type: 'tactile' },
  { id: 'semaphore', name: 'Semaphore', type: 'visual' },
  { id: 'enigma', name: 'Enigma', type: 'encryption' }
];

// Sample encryption algorithms
const ENCRYPTION_METHODS = [
  { id: 'aes', name: 'AES-256', type: 'symmetric' },
  { id: 'rsa', name: 'RSA', type: 'asymmetric' },
  { id: 'caesar', name: 'Caesar Cipher', type: 'classical' },
  { id: 'vigenere', name: 'Vigenère Cipher', type: 'classical' },
  { id: 'base64', name: 'Base64', type: 'encoding' },
  { id: 'jwt', name: 'JWT', type: 'token' },
  { id: 'custom', name: 'Custom Algorithm', type: 'advanced' }
];

// Sample database protocols
const DATABASE_PROTOCOLS = [
  { id: 'sql', name: 'SQL Query', type: 'relational' },
  { id: 'nosql', name: 'NoSQL Command', type: 'document' },
  { id: 'graphql', name: 'GraphQL Query', type: 'graph' },
  { id: 'redis', name: 'Redis Command', type: 'key-value' },
  { id: 'mqtt', name: 'MQTT Packet', type: 'messaging' }
];

// Mobile phone models
const PHONE_MODELS = [
  { id: 'generic', name: 'Generic Smartphone', type: 'modern' },
  { id: 'nokia3310', name: 'Nokia 3310', type: 'classic' },
  { id: 'blackberry', name: 'BlackBerry', type: 'qwerty' },
  { id: 't9', name: 'T9 Predictive', type: 'classic' },
  { id: 'flip', name: 'Flip Phone', type: 'classic' }
];

// Sample light/vibration patterns
const PATTERNS = [
  { id: 'sos', name: 'SOS', pattern: '... --- ...', type: 'emergency' },
  { id: 'alert', name: 'Alert', pattern: '- - - - -', type: 'warning' },
  { id: 'acknowledge', name: 'Acknowledge', pattern: '.- -.-', type: 'confirmation' },
  { id: 'custom', name: 'Custom Pattern', pattern: '', type: 'user' }
];

interface TextConversionPageProps {
  onBack?: () => void;
}

export function TextConversionPage({ onBack }: TextConversionPageProps) {
  // Core state variables
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedConversionTab, setSelectedConversionTab] = useState('morse');
  const [showPreview, setShowPreview] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { isMobile } = useResponsive();

  // State for specific conversion types
  const [selectedLanguage, setSelectedLanguage] = useState('morse');
  const [selectedEncryption, setSelectedEncryption] = useState('aes');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [selectedPhoneModel, setSelectedPhoneModel] = useState('generic');
  const [selectedPattern, setSelectedPattern] = useState('sos');
  const [customPattern, setCustomPattern] = useState('');
  const [dbProtocol, setDbProtocol] = useState('sql');
  const [dbQuery, setDbQuery] = useState('');
  
  // Special states for various features
  const [useLightOutput, setUseLightOutput] = useState(true);
  const [useVibrationOutput, setUseVibrationOutput] = useState(true);
  const [useAI, setUseAI] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [unicodeDetails, setUnicodeDetails] = useState<any>(null);

  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // If AI detection is enabled, simulate language detection
    if (useAI && e.target.value.length > 10) {
      const detectedLang = detectLanguage(e.target.value);
      setDetectedLanguage(detectedLang);
    }
    
    // Get Unicode info for the first character
    if (e.target.value.length > 0) {
      setUnicodeDetails(getUnicodeInfo(e.target.value[0]));
    } else {
      setUnicodeDetails(null);
    }
  };

  // Handle conversion based on selected tab
  const handleConvert = () => {
    setIsProcessing(true);
    
    // Add a slight delay to simulate processing
    setTimeout(() => {
      let result = '';
      
      switch (selectedConversionTab) {
        case 'morse':
          result = textToMorse(inputText);
          break;
        case 'mobile':
          if (useLightOutput) {
            result = convertToLightPattern(inputText, selectedPhoneModel);
          } else if (useVibrationOutput) {
            result = convertToVibrationPattern(inputText, selectedPhoneModel);
          } else {
            result = qwertyToNumberpad(inputText, selectedPhoneModel);
          }
          break;
        case 'ascii':
          result = textToAsciiArt(inputText);
          break;
        case 'wingdings':
          result = convertToWingdings(inputText);
          break;
        case 'language':
          result = translateToCustomLanguage(inputText, selectedLanguage);
          break;
        case 'crypto':
          if (selectedEncryption === 'aes' || selectedEncryption === 'rsa') {
            if (!encryptionKey) {
              result = "Please provide an encryption key";
            } else {
              result = encryptText(inputText, selectedEncryption, encryptionKey);
            }
          } else {
            result = encryptText(inputText, selectedEncryption);
          }
          break;
        case 'database':
          result = `Simulated ${dbProtocol.toUpperCase()} packet:\n` + 
                   `${dbQuery || 'No query provided'}\n\n` +
                   "Response: SUCCESS\nTimestamp: " + new Date().toISOString() +
                   "\nAffected rows: 12\nExecution time: 42ms";
          break;
        default:
          result = inputText;
      }
      
      setOutputText(result);
      setIsProcessing(false);
    }, 300);
  };

  // Effect to auto-convert when input changes (for simpler conversions)
  useEffect(() => {
    if (['morse', 'ascii', 'mobile'].includes(selectedConversionTab) && inputText) {
      handleConvert();
    }
  }, [inputText, selectedConversionTab, useLightOutput, useVibrationOutput, selectedPhoneModel]);

  // Copy output to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Render specific input options based on selected tab
  const renderTabSpecificControls = () => {
    switch (selectedConversionTab) {
      case 'mobile':
        return (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="phoneModel">Phone Model</Label>
              <Select value={selectedPhoneModel} onValueChange={setSelectedPhoneModel}>
                <SelectTrigger id="phoneModel" className="bg-black border-gray-700">
                  <SelectValue placeholder="Select phone model" />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_MODELS.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="useLightOutput" 
                  checked={useLightOutput}
                  onCheckedChange={setUseLightOutput}
                />
                <Label htmlFor="useLightOutput" className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-400" />
                  Light Pattern
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="useVibrationOutput" 
                  checked={useVibrationOutput}
                  onCheckedChange={setUseVibrationOutput}
                />
                <Label htmlFor="useVibrationOutput" className="flex items-center">
                  <Vibrate className="h-4 w-4 mr-2 text-green-400" />
                  Vibration Pattern
                </Label>
              </div>
            </div>
            
            {(useLightOutput || useVibrationOutput) && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="pattern">Pattern Template</Label>
                <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                  <SelectTrigger id="pattern" className="bg-black border-gray-700">
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {PATTERNS.map(pattern => (
                      <SelectItem key={pattern.id} value={pattern.id}>
                        {pattern.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedPattern === 'custom' && (
                  <Input
                    placeholder="Enter custom pattern (e.g. .--.-.)"
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    className="mt-2 bg-black border-gray-700"
                  />
                )}
              </div>
            )}
          </div>
        );
        
      case 'language':
        return (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="language">Target Language/Code</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger id="language" className="bg-black border-gray-700">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto" disabled={!useAI}>
                    Auto-Detect {!useAI && "(Requires AI)"}
                  </SelectItem>
                  {CUSTOM_LANGUAGES.map(lang => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="useAI" 
                checked={useAI}
                onCheckedChange={setUseAI}
              />
              <Label htmlFor="useAI" className="flex items-center">
                <BrainCircuit className="h-4 w-4 mr-2 text-purple-400" />
                Use AI Translation
              </Label>
            </div>
            
            {useAI && detectedLanguage && (
              <div className="rounded-md bg-black/50 border border-purple-500/30 p-2 text-xs">
                <div className="flex items-center">
                  <BrainCircuit className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                  <span className="text-muted-foreground">AI detected language:</span>
                  <Badge variant="secondary" className="ml-2 bg-purple-900/30 text-purple-200 border-purple-700/30">
                    {detectedLanguage || "Analyzing..."}
                  </Badge>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline"
              className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border-white/10"
              onClick={handleConvert}
              disabled={isProcessing || !inputText}
            >
              {isProcessing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4 mr-2" />
                  Translate
                </>
              )}
            </Button>
          </div>
        );
        
      case 'crypto':
        return (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="cryptoMethod">Encryption Method</Label>
              <Select value={selectedEncryption} onValueChange={setSelectedEncryption}>
                <SelectTrigger id="cryptoMethod" className="bg-black border-gray-700">
                  <SelectValue placeholder="Select encryption method" />
                </SelectTrigger>
                <SelectContent>
                  {ENCRYPTION_METHODS.map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(selectedEncryption === 'aes' || selectedEncryption === 'rsa' || selectedEncryption === 'vigenere') && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="encryptionKey">Encryption Key</Label>
                <div className="relative">
                  <Input
                    id="encryptionKey"
                    type="password" 
                    placeholder="Enter encryption key"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    className="bg-black border-gray-700 pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={() => {
                      const input = document.getElementById('encryptionKey') as HTMLInputElement;
                      if (input) {
                        input.type = input.type === 'password' ? 'text' : 'password';
                      }
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 hover:from-green-600/40 hover:to-cyan-600/40 border-white/10"
                onClick={handleConvert}
                disabled={isProcessing || !inputText}
              >
                <GlobeLock className="h-4 w-4 mr-2 text-green-400" />
                Encrypt
              </Button>
              
              <Button 
                variant="outline"
                className="bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/40 hover:to-orange-600/40 border-white/10"
                onClick={() => {
                  setInputText(outputText);
                  setTimeout(() => {
                    // Then decrypt it
                    setOutputText(decryptText(outputText, selectedEncryption, encryptionKey));
                  }, 100);
                }}
                disabled={isProcessing || !outputText}
              >
                <EyeOff className="h-4 w-4 mr-2 text-orange-400" />
                Decrypt
              </Button>
            </div>
          </div>
        );
        
      case 'database':
        return (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="dbProtocol">Database Protocol</Label>
              <Select value={dbProtocol} onValueChange={setDbProtocol}>
                <SelectTrigger id="dbProtocol" className="bg-black border-gray-700">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  {DATABASE_PROTOCOLS.map(protocol => (
                    <SelectItem key={protocol.id} value={protocol.id}>
                      {protocol.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="dbQuery">Database Query</Label>
              <Textarea
                id="dbQuery"
                placeholder={dbProtocol === 'sql' ? 'SELECT * FROM users WHERE id = 1' : 'Enter your query'}
                value={dbQuery}
                onChange={(e) => setDbQuery(e.target.value)}
                className="min-h-[80px] bg-black border-gray-700 font-mono text-sm"
              />
            </div>
            
            <Button 
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/40 hover:to-indigo-600/40 border-white/10"
              onClick={handleConvert}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Execute Query
                </>
              )}
            </Button>
          </div>
        );
        
      case 'ascii':
      case 'wingdings':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="showPreview" 
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
              <Label htmlFor="showPreview">Show Live Preview</Label>
            </div>
            
            {unicodeDetails && (
              <div className="rounded-md bg-black/50 border border-cyan-500/30 p-2 text-xs">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="text-muted-foreground">Unicode:</div>
                  <div>{unicodeDetails.unicode}</div>
                  <div className="text-muted-foreground">Hex:</div>
                  <div>{unicodeDetails.hex}</div>
                  <div className="text-muted-foreground">Name:</div>
                  <div>{unicodeDetails.name}</div>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline"
              className="w-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/40 hover:to-blue-600/40 border-white/10"
              onClick={handleConvert}
              disabled={isProcessing || !inputText}
            >
              <FileCode className="h-4 w-4 mr-2" />
              Generate {selectedConversionTab === 'ascii' ? 'ASCII Art' : 'Wingdings'}
            </Button>
          </div>
        );
      
      case 'morse':
      default:
        return (
          <div className="space-y-4">
            <div className="rounded-md bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/30 p-3">
              <MorseVisualizer 
                morseText={outputText} 
                autoPlay={false}
                height={60}
                showControls
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 hover:from-amber-600/40 hover:to-yellow-600/40 border-white/10"
                onClick={() => {
                  setOutputText(textToMorse(inputText));
                }}
                disabled={!inputText}
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Text → Morse
              </Button>
              
              <Button 
                variant="outline"
                className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 hover:from-yellow-600/40 hover:to-amber-600/40 border-white/10"
                onClick={() => {
                  setInputText(outputText);
                  setOutputText(morseToText(outputText));
                }}
                disabled={!outputText}
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Morse → Text
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Header Bar */}
      <div className="bg-black border-b border-border/30 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-md" 
              onClick={onBack}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center">
            <Code className="h-5 w-5 mr-2 text-amber-400" />
            <h1 className="text-lg font-medium text-white">Text & Code Utilities</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 min-h-[80px] bg-gradient-to-r from-yellow-600/20 to-amber-600/20 hover:from-yellow-600/40 hover:to-amber-600/40 border-white/10"
            onClick={() => {
              // Reset form
              setInputText('');
              setOutputText('');
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Clear</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 min-h-[80px] bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/40 hover:to-emerald-600/40 border-white/10"
            onClick={() => {
              // Save functionality would go here
              const element = document.createElement("a");
              const file = new Blob([outputText], {type: "text/plain"});
              element.href = URL.createObjectURL(file);
              element.download = `converted_text_${new Date().getTime()}.txt`;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            disabled={!outputText}
          >
            <FileDown className="h-4 w-4 mr-2" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row w-full h-full gap-4">
          {/* Input Panel */}
          <div className="flex-1 flex flex-col h-full">
            <div className="mb-3 flex justify-between items-center">
              <h2 className="font-medium text-white flex items-center">
                <FileUp className="h-4 w-4 mr-2 text-blue-400" />
                Input Text
              </h2>
              <Badge variant="outline" className="bg-black/80 border-white/20 text-xs">
                {inputText.length} chars
              </Badge>
            </div>
            
            <Textarea
              placeholder="Enter text to convert..."
              value={inputText}
              onChange={handleInputChange}
              className="flex-1 min-h-[200px] bg-black border-gray-700 font-mono text-sm resize-none"
            />
          </div>
          
          {/* Controls Panel */}
          <div className="w-full sm:w-64 md:w-72 flex flex-col h-full bg-black/30 rounded-lg border border-border/30 p-3">
            <h2 className="font-medium text-white mb-3 flex items-center justify-center">
              <Compass className="h-4 w-4 mr-2 text-cyan-400" />
              Conversion Tools
            </h2>
            
            <Tabs 
              value={selectedConversionTab} 
              onValueChange={setSelectedConversionTab as any}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-2 bg-black/60 p-1 h-auto">
                <TabsTrigger value="morse" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600/30 data-[state=active]:to-amber-600/30 h-10 px-2 py-1">
                  <Code className="h-4 w-4 mr-1 lg:mr-2" />
                  <span>Morse</span>
                </TabsTrigger>
                <TabsTrigger value="mobile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600/30 data-[state=active]:to-emerald-600/30 h-10 px-2 py-1">
                  <Smartphone className="h-4 w-4 mr-1 lg:mr-2" />
                  <span>Mobile</span>
                </TabsTrigger>
                <TabsTrigger value="ascii" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-cyan-600/30 h-10 px-2 py-1">
                  <FileSymlink className="h-4 w-4 mr-1 lg:mr-2" />
                  <span>ASCII</span>
                </TabsTrigger>
                <TabsTrigger value="wingdings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/30 data-[state=active]:to-blue-600/30 h-10 px-2 py-1">
                  <Type className="h-4 w-4 mr-1 lg:mr-2" />
                  <span>Wingdings</span>
                </TabsTrigger>
                <TabsTrigger value="language" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-violet-600/30 h-10 px-2 py-1">
                  <Languages className="h-4 w-4 mr-1 lg:mr-2" />
                  <span>Languages</span>
                </TabsTrigger>
                <TabsTrigger value="crypto" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-orange-600/30 h-10 px-2 py-1">
                  <GlobeLock className="h-4 w-4 mr-1 lg:mr-2" />
                  <span>Crypto</span>
                </TabsTrigger>
                <TabsTrigger value="database" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-indigo-600/30 h-10 col-span-2 px-2 py-1">
                  <Database className="h-4 w-4 mr-1 lg:mr-2" />
                  <span>Database Tools</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="pt-2">
                {renderTabSpecificControls()}
              </div>
            </Tabs>
            
            <div className="mt-auto pt-3">
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500"
                onClick={handleConvert}
                disabled={isProcessing || !inputText}
              >
                {isProcessing ? (
                  <><RotateCw className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Convert</>
                )}
              </Button>
            </div>
          </div>
          
          {/* Output Panel */}
          <div className="flex-1 flex flex-col h-full">
            <div className="mb-3 flex justify-between items-center">
              <h2 className="font-medium text-white flex items-center">
                <FileDown className="h-4 w-4 mr-2 text-green-400" />
                Output
              </h2>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleCopy}
                disabled={!outputText}
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            
            <div className="flex-1 min-h-[200px] relative rounded overflow-hidden border border-gray-700">
              <pre className="h-full overflow-auto p-3 bg-black text-sm font-mono whitespace-pre-wrap">
                {outputText || <span className="text-muted-foreground">Output will appear here...</span>}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}