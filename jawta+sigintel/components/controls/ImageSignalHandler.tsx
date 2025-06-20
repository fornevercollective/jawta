
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';

interface ImageSignalHandlerProps {
  onImageProcessed: (text: string) => void;
}

export function ImageSignalHandler({ onImageProcessed }: ImageSignalHandlerProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [detectedSignals, setDetectedSignals] = useState<string[]>([]);
  const [detectionMethod, setDetectionMethod] = useState<string>('morse');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create URL for the uploaded image
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setDetectedSignals([]);
  };

  // Handle image processing
  const handleProcessImage = () => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Mock detection results based on selected method
      let detected: string[] = [];
      
      switch (detectionMethod) {
        case 'morse':
          detected = ['... --- ...', '.... . .-.. .--', '-- --- .-. ... .'];
          break;
        case 'binary':
          detected = ['01001000 01100101 01101100 01101100 01101111'];
          break;
        case 'braille':
          detected = ['⠓⠑⠇⠇⠕', '⠺⠕⠗⠇⠙'];
          break;
        case 'semaphore':
          detected = ['SIGNAL', 'MESSAGE'];
          break;
      }
      
      setDetectedSignals(detected);
      setIsProcessing(false);
      
      // Pass the first detected signal to the parent component
      if (detected.length > 0) {
        onImageProcessed(detected[0]);
      }
    }, 1500);
  };

  // Trigger file input click
  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label>Select Signal Type</Label>
        <Tabs 
          defaultValue="morse" 
          value={detectionMethod}
          onValueChange={setDetectionMethod}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="morse">Morse</TabsTrigger>
            <TabsTrigger value="binary">Binary</TabsTrigger>
            <TabsTrigger value="braille">Braille</TabsTrigger>
            <TabsTrigger value="semaphore">Semaphore</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSelectImage} variant="outline" size="sm">
          Select Image
        </Button>
        <Button 
          onClick={handleProcessImage} 
          variant="default" 
          size="sm"
          disabled={!imageUrl || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Process Image'}
        </Button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*" 
        />
      </div>

      {imageUrl && (
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <ImageWithFallback
              src={imageUrl}
              alt="Signal image"
              width={300}
              height={200}
              className="rounded-md object-contain w-full h-40"
            />
          </CardContent>
        </Card>
      )}

      {detectedSignals.length > 0 && (
        <div className="bg-accent/30 p-3 rounded-md">
          <Label className="mb-1 block">Detected Signals</Label>
          <ul className="space-y-1 text-sm">
            {detectedSignals.map((signal, index) => (
              <li key={index} className="font-mono p-1 bg-background/50 rounded">
                {signal}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
