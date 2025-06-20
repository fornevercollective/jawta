
import React, { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Image as ImageIcon,
  Waves,
  SquareAsterisk,
  ChevronsUpDown
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function WaveformArtVisualizer() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [lineCount, setLineCount] = useState<number>(50);
  const [lineSpacing, setLineSpacing] = useState<number>(3);
  const [amplitude, setAmplitude] = useState<number>(30);
  const [frequency, setFrequency] = useState<number>(0.5);
  const [waveStyle, setWaveStyle] = useState<'sine' | 'square' | 'triangle' | 'sawtooth'>('sine');
  const [lineThickness, setLineThickness] = useState<number>(1);
  const [colorMode, setColorMode] = useState<'monochrome' | 'gradient' | 'original'>('monochrome');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
        setRendered(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const renderWaveformArt = async () => {
    console.log("Rendering waveform art...");
    if (!imageUrl || !canvasRef.current) return;
    
    setProcessing(true);
    
    try {
      // Create a temporary image object to load the image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      
      img.onload = () => {
        // Store the original image for reprocessing
        originalImageRef.current = img;
        
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        
        // Set canvas dimensions based on image aspect ratio
        const aspectRatio = img.width / img.height;
        
        // Fixed canvas width
        const canvasWidth = 800;
        const canvasHeight = canvasWidth / aspectRatio;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create a temporary canvas to process the image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const tempCtx = tempCanvas.getContext('2d')!;
        
        // Draw the image to the temp canvas, scaling it to fit
        tempCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        
        // Get image data from the temp canvas
        const imageData = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight);
        
        // Process the image data into waveform lines
        const lineHeight = canvasHeight / lineCount;
        
        ctx.lineWidth = lineThickness;
        
        // Draw each horizontal waveform line
        for (let y = 0; y < lineCount; y++) {
          const lineY = y * lineHeight + lineHeight / 2;
          
          // Sample line
          const sampleY = Math.floor(y * (canvasHeight / lineCount));
          
          ctx.beginPath();
          
          // Set line color based on mode
          if (colorMode === 'monochrome') {
            ctx.strokeStyle = '#000000';
          } else if (colorMode === 'gradient') {
            const hue = (y / lineCount) * 270;
            ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
          }
          
          // Starting point for the line
          ctx.moveTo(0, lineY);
          
          // For each x position, calculate the wave height based on pixel brightness
          for (let x = 0; x < canvasWidth; x++) {
            // Sample at this x position in the original image
            const pixelIndex = (sampleY * canvasWidth + x) * 4;
            
            // Calculate brightness (0-255)
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            // Brightness from 0 (black) to 1 (white)
            const brightness = 1 - ((r + g + b) / (3 * 255));
            
            // Calculate wave amplitude based on brightness and settings
            const waveAmplitude = brightness * amplitude;
            
            // Calculate wave position based on style
            const phase = x * frequency * (Math.PI / 180);
            let waveY = lineY;
            
            switch (waveStyle) {
              case 'sine':
                waveY += Math.sin(phase) * waveAmplitude;
                break;
              case 'square':
                waveY += Math.sin(phase) > 0 ? waveAmplitude : -waveAmplitude;
                break;
              case 'triangle':
                waveY += (2 / Math.PI) * Math.asin(Math.sin(phase)) * waveAmplitude;
                break;
              case 'sawtooth':
                waveY += ((phase % (Math.PI * 2)) / Math.PI - 1) * waveAmplitude;
                break;
            }
            
            // If using original color mode, set the line color based on pixel
            if (colorMode === 'original') {
              ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
            }
            
            ctx.lineTo(x, waveY);
          }
          
          ctx.stroke();
        }
        
        setProcessing(false);
        setRendered(true);
      };
      
      img.onerror = () => {
        console.error('Error loading image');
        setProcessing(false);
        alert('Error loading image. Please try another image.');
      };
    } catch (error) {
      console.error('Error rendering waveform art:', error);
      setProcessing(false);
    }
  };
  
  // Re-render when params change and we have an image
  useEffect(() => {
    if (imageUrl && !processing && originalImageRef.current) {
      const timer = setTimeout(() => {
        renderWaveformArt();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lineCount, amplitude, frequency, waveStyle, lineThickness, colorMode]);
  
  // Download the waveform art as PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    try {
      const link = document.createElement('a');
      link.download = 'waveform-art.png';
      link.href = canvasRef.current.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  const handleRandomize = () => {
    setLineCount(Math.floor(Math.random() * 80) + 20);
    setAmplitude(Math.floor(Math.random() * 50) + 10);
    setFrequency(Math.random() * 0.9 + 0.1);
    
    const styles: ('sine' | 'square' | 'triangle' | 'sawtooth')[] = ['sine', 'square', 'triangle', 'sawtooth'];
    setWaveStyle(styles[Math.floor(Math.random() * styles.length)]);
    
    setLineThickness(Math.random() * 2 + 0.5);
    
    const colorModes: ('monochrome' | 'gradient' | 'original')[] = ['monochrome', 'gradient', 'original'];
    setColorMode(colorModes[Math.floor(Math.random() * colorModes.length)]);
  };
  
  // Use appropriate icons from lucide-react instead of non-existent ones
  const waveStyleIcons = {
    sine: <Waves className="h-4 w-4" />,
    square: <SquareAsterisk className="h-4 w-4" />,
    triangle: <ChevronsUpDown className="h-4 w-4" />,
    sawtooth: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6L8 18L14 6L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  };

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  return (
    <div className="space-y-4">
      {/* Image upload area */}
      {!imageUrl ? (
        <Card 
          className="border-dashed border-2 p-6 text-center flex flex-col items-center justify-center bg-muted/30 cursor-pointer" 
          onClick={handleUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-medium mb-1">Upload an image</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Select an image to convert into waveform art
          </p>
          <Button type="button">
            <Upload className="h-4 w-4 mr-2" />
            Select Image
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-0">
              {/* Image & Result Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Image */}
                <Card>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Original Image</h3>
                      <button 
                        onClick={handleButtonClick(handleUploadClick)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3 gap-1.5 border bg-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        Change
                      </button>
                    </div>
                    <div className="border rounded-md overflow-hidden bg-muted/20">
                      <ImageWithFallback
                        src={imageUrl}
                        alt="Original image"
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Waveform Art Display */}
                <Card>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium flex items-center gap-1.5">
                        Waveform Art
                        {processing && <Badge variant="outline" className="animate-pulse ml-1">Processing...</Badge>}
                      </h3>
                      <button 
                        onClick={handleButtonClick(handleDownload)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3 gap-1.5 border bg-background hover:bg-accent hover:text-accent-foreground"
                        disabled={!rendered || processing}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Save
                      </button>
                    </div>
                    <div className="border rounded-md overflow-hidden bg-background">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-auto"
                      ></canvas>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="controls" className="mt-0">
              {/* Controls UI */}
              <Card>
                <CardContent className="space-y-4 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Waveform Settings</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleButtonClick(renderWaveformArt)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3 gap-1.5 border bg-background hover:bg-accent hover:text-accent-foreground"
                        disabled={processing}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 mr-1 ${processing ? 'animate-spin' : ''}`} />
                        {processing ? 'Processing...' : 'Regenerate'}
                      </button>
                      <button 
                        onClick={handleButtonClick(handleRandomize)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={processing}
                      >
                        Randomize
                      </button>
                    </div>
                  </div>

                  {/* Control sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                      {/* Line Count */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="line-count">Line Count</Label>
                          <span className="text-sm text-muted-foreground">{lineCount}</span>
                        </div>
                        <Slider 
                          id="line-count"
                          min={10} 
                          max={150} 
                          step={1}
                          value={[lineCount]} 
                          onValueChange={(value) => setLineCount(value[0])}
                          disabled={processing}
                        />
                      </div>

                      {/* Line Thickness */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="line-thickness">Line Thickness</Label>
                          <span className="text-sm text-muted-foreground">{lineThickness.toFixed(1)}px</span>
                        </div>
                        <Slider 
                          id="line-thickness"
                          min={0.5} 
                          max={3} 
                          step={0.1}
                          value={[lineThickness]} 
                          onValueChange={(value) => setLineThickness(value[0])}
                          disabled={processing}
                        />
                      </div>

                      {/* Wave Style */}
                      <div className="space-y-2">
                        <Label htmlFor="wave-style">Wave Style</Label>
                        <Select
                          value={waveStyle}
                          onValueChange={(value: 'sine' | 'square' | 'triangle' | 'sawtooth') => setWaveStyle(value)}
                          disabled={processing}
                        >
                          <SelectTrigger id="wave-style">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sine" className="flex items-center">
                              <div className="flex items-center">
                                {waveStyleIcons.sine}
                                <span className="ml-2">Sine Wave</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="square">
                              <div className="flex items-center">
                                {waveStyleIcons.square}
                                <span className="ml-2">Square Wave</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="triangle">
                              <div className="flex items-center">
                                {waveStyleIcons.triangle}
                                <span className="ml-2">Triangle Wave</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="sawtooth">
                              <div className="flex items-center">
                                {waveStyleIcons.sawtooth}
                                <span className="ml-2">Sawtooth Wave</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Amplitude */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="amplitude">Wave Amplitude</Label>
                          <span className="text-sm text-muted-foreground">{amplitude}</span>
                        </div>
                        <Slider 
                          id="amplitude"
                          min={1} 
                          max={80} 
                          step={1}
                          value={[amplitude]} 
                          onValueChange={(value) => setAmplitude(value[0])}
                          disabled={processing}
                        />
                      </div>

                      {/* Frequency */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="frequency">Wave Frequency</Label>
                          <span className="text-sm text-muted-foreground">{frequency.toFixed(1)}</span>
                        </div>
                        <Slider 
                          id="frequency"
                          min={0.1} 
                          max={2} 
                          step={0.1}
                          value={[frequency]} 
                          onValueChange={(value) => setFrequency(value[0])}
                          disabled={processing}
                        />
                      </div>

                      {/* Color Mode */}
                      <div className="space-y-2">
                        <Label htmlFor="color-mode">Color Mode</Label>
                        <Select
                          value={colorMode}
                          onValueChange={(value: 'monochrome' | 'gradient' | 'original') => setColorMode(value)}
                          disabled={processing}
                        >
                          <SelectTrigger id="color-mode">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monochrome">Monochrome</SelectItem>
                            <SelectItem value="gradient">Color Gradient</SelectItem>
                            <SelectItem value="original">Original Colors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
