
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  Keyboard, 
  Camera, 
  Send, 
  X, 
  Mic, 
  Image,
  Sparkles,
  Radio,
  Waves,
  Wifi,
  Satellite,
  FileCode,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { StatusToast } from '../vision/StatusToast';

// Types for conversion and input modes
type ConversionType = 'signal' | 'morse' | 'optical' | 'satellite' | 'binary';
type InputMode = 'text' | 'image' | 'voice';

interface MobileInputBarProps {
  onTextChange: (text: string) => void;
  className?: string;
  initialMode?: ConversionType;
}

export function MobileInputBar({
  onTextChange,
  className = "",
  initialMode = 'signal'
}: MobileInputBarProps) {
  // State for input content
  const [text, setText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [conversionType, setConversionType] = useState<ConversionType>(initialMode);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Conversion types configuration
  const conversionTypes = [
    { id: 'signal', name: 'Signal', icon: <Radio className="h-4 w-4 text-primary" /> },
    { id: 'morse', name: 'Morse', icon: <Waves className="h-4 w-4 text-primary" /> },
    { id: 'optical', name: 'Optical', icon: <Wifi className="h-4 w-4 text-primary" /> },
    { id: 'satellite', name: 'Satellite', icon: <Satellite className="h-4 w-4 text-primary" /> },
    { id: 'binary', name: 'Binary', icon: <FileCode className="h-4 w-4 text-primary" /> }
  ];
  
  // Function to get appropriate placeholder text
  const getPlaceholderText = () => {
    switch(conversionType) {
      case 'morse': return "Enter text for Morse conversion...";
      case 'optical': return "Enter data for optical transmission...";
      case 'satellite': return "Enter telemetry data...";
      case 'binary': return "Enter text for binary encoding...";
      default: return "Enter signal data...";
    }
  };
  
  // Function to get current type icon
  const getCurrentTypeIcon = () => {
    const found = conversionTypes.find(type => type.id === conversionType);
    return found ? found.icon : <Radio className="h-4 w-4 text-primary" />;
  };
  
  // Function to get current type name
  const getCurrentTypeName = () => {
    const found = conversionTypes.find(type => type.id === conversionType);
    return found ? found.name : "Signal";
  };
  
  // Text change handler
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  };
  
  // File select handler for image input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Convert to data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setInputMode('image');
        // Also trigger onTextChange with image metadata or placeholder
        onTextChange(`[Image: ${file.name}]`);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Clear image handler
  const handleClearImage = () => {
    setSelectedImage(null);
    setInputMode('text');
    onTextChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text && !selectedImage) return;
    
    // Simulate processing
    setIsProcessing(true);
    
    // In a real app, this would send data to your signal processing API
    setTimeout(() => {
      setIsProcessing(false);
      
      // Show success toast
      setToastMessage(`${conversionType.charAt(0).toUpperCase() + conversionType.slice(1)} successfully processed`);
      setShowToast(true);
      
      // Clear input after success
      setText("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onTextChange("");
    }, 1500);
  };
  
  // Handle conversion type change
  const handleConversionTypeChange = (type: ConversionType) => {
    setConversionType(type);
  };
  
  // Simulate voice input
  const simulateVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      
      // Simulate voice recognition results
      const voiceTexts = [
        "Signal detected at 1550nm wavelength",
        "Activate optical transmission mode",
        "Begin satellite data capture",
        "Enable Morse code output",
        "Switch to binary encoding"
      ];
      
      const randomText = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
      setText(randomText);
      onTextChange(randomText);
      
      // Show toast about voice recognition
      setToastMessage("Voice input processed");
      setShowToast(true);
      
    } else {
      setIsRecording(true);
      
      // Simulate audio recording and processing
      setTimeout(() => {
        if (isRecording) {
          simulateVoiceInput(); // End the recording after a delay
        }
      }, 2000);
    }
  };
  
  // Handle toast close
  const handleDismissToast = () => {
    setShowToast(false);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-10 p-3 pb-6 md:relative md:p-0 ${className}`}>
      <form ref={formRef} onSubmit={handleSubmit} className="relative">
        <div className="ai-input-container p-1.5 transition-all duration-300">
          <div className="flex items-center gap-2">
            {/* Quick Action Floating Menu - New Component */}
            <Popover>
              <PopoverTrigger>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="rounded-full aspect-square h-12 w-12 flex items-center justify-center border-2 border-primary/30 bg-background/50 backdrop-blur-md shadow-lg p-0"
                >
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-2" align="start" sideOffset={5}>
                <div className="grid grid-cols-3 gap-2">
                  {/* Quick Action Grid - Large Buttons for Gloved Input */}
                  <Button variant="outline" size="lg" className="flex flex-col items-center justify-center h-20 gap-1">
                    <Radio className="h-7 w-7" />
                    <span className="text-xs font-bold">Signal</span>
                  </Button>
                  <Button variant="outline" size="lg" className="flex flex-col items-center justify-center h-20 gap-1">
                    <Waves className="h-7 w-7" />
                    <span className="text-xs font-bold">Waves</span>
                  </Button>
                  <Button variant="outline" size="lg" className="flex flex-col items-center justify-center h-20 gap-1">
                    <Wifi className="h-7 w-7" />
                    <span className="text-xs font-bold">Optical</span>
                  </Button>
                  <Button variant="outline" size="lg" className="flex flex-col items-center justify-center h-20 gap-1">
                    <Satellite className="h-7 w-7" />
                    <span className="text-xs font-bold">Sat</span>
                  </Button>
                  <Button variant="outline" size="lg" className="flex flex-col items-center justify-center h-20 gap-1">
                    <FileCode className="h-7 w-7" />
                    <span className="text-xs font-bold">Binary</span>
                  </Button>
                  <Button variant="outline" size="lg" className="flex flex-col items-center justify-center h-20 gap-1 bg-primary/10">
                    <Send className="h-7 w-7" />
                    <span className="text-xs font-bold">Send</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Conversion Type Selector - Modified for larger touch targets */}
            <Popover>
              <PopoverTrigger>
                <div 
                  className={`rounded-full px-4 h-12 ai-chip flex items-center gap-2 ${isProcessing ? 'opacity-70' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    {getCurrentTypeIcon()}
                    <span className="text-base font-medium">{getCurrentTypeName()}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 ml-0.5 opacity-70" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2" align="start">
                <div className="grid grid-cols-1 gap-2">
                  {conversionTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant="ghost"
                      size="lg"
                      className={`h-14 justify-start px-4 flex items-center gap-3 ${
                        conversionType === type.id ? 'ai-chip-active' : 'ai-chip'
                      }`}
                      onClick={() => handleConversionTypeChange(type.id as ConversionType)}
                    >
                      {type.icon}
                      <span className="text-base">{type.name}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Input Field Area with Larger Size for Gloved Operation */}
            <div className={`
              relative flex-1 rounded-2xl 
              ${text || selectedImage ? 'ai-typing-indicator' : ''}
            `}>
              {/* Text Input - Hidden when image is shown */}
              {(!selectedImage || inputMode === 'text') && (
                <Input
                  ref={inputRef}
                  value={text}
                  onChange={handleTextChange}
                  className="flex-1 border-0 focus-visible:ring-0 pl-4 py-3 min-h-[48px] text-base bg-transparent rounded-2xl"
                  placeholder={getPlaceholderText()}
                  disabled={isProcessing}
                  // Prevent zooming on mobile devices
                  style={{ fontSize: '16px' }}
                />
              )}

              {/* Image Preview - Enhanced for mobile */}
              {selectedImage && inputMode === 'image' && (
                <div className="relative flex-1 h-24 rounded-xl overflow-hidden mx-1">
                  <ImageWithFallback
                    src={selectedImage}
                    alt="Selected image"
                    className="h-full w-auto object-cover rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
                    onClick={handleClearImage}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                </div>
              )}
            </div>

            {/* Large Action Buttons for Use with Gloves */}
            <div className="flex gap-2">
              {/* Voice Input - Larger Button */}
              <Button
                type="button"
                variant={isRecording ? "destructive" : "ghost"}
                size="lg"
                className={`rounded-full aspect-square h-12 w-12 flex items-center justify-center ${isRecording ? 'ai-processing' : ''} ${isProcessing ? 'opacity-70' : ''}`}
                onClick={simulateVoiceInput}
                disabled={isProcessing}
              >
                <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
              </Button>

              {/* Image Upload - Larger Button */}
              {inputMode === 'image' && !selectedImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className={`rounded-full aspect-square h-12 w-12 flex items-center justify-center ${isProcessing ? 'opacity-70' : ''}`}
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <Image className="h-5 w-5" />
                </Button>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                disabled={isProcessing}
              />

              {/* Submit/Convert Button - Larger */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className={`rounded-full aspect-square h-12 w-12 flex items-center justify-center ${isProcessing ? 'ai-processing opacity-90' : ''}`}
                disabled={isProcessing || (!text && !selectedImage)}
              >
                {isProcessing ? (
                  <Sparkles className="h-5 w-5 animate-pulse-subtle" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Status Toast */}
      <StatusToast
        message={toastMessage}
        show={showToast}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
