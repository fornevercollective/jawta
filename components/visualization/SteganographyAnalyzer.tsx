
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Upload, Image as ImageIcon, Layers, Eye, Search, FileText, 
  AlertCircle, FileDown, ArrowRight, Lock, Unlock, Grid, FileImage,
  BarChart, Download
} from 'lucide-react';
import { 
  analyzeImageSteganography, 
  hideDataInImage, 
  extractDataFromImage, 
  StegoAnalysisResult
} from '../utils/stegoUtils';

interface SteganographyAnalyzerProps {
  initialImage?: string;
  className?: string;
}

export function SteganographyAnalyzer({ initialImage, className }: SteganographyAnalyzerProps) {
  // Image states
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis results
  const [analysisResult, setAnalysisResult] = useState<StegoAnalysisResult | null>(null);
  const [currentBitPlane, setCurrentBitPlane] = useState(0);
  
  // Embedding states
  const [messageToHide, setMessageToHide] = useState('');
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [useEncryption, setUseEncryption] = useState(false);
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);
  const bitPlaneCanvasRef = useRef<HTMLCanvasElement>(null);
  const stegoCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    // Create image URL
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setIsImageLoaded(false);
    setAnalysisResult(null);
    setStegoImage(null);
    setError(null);
  };
  
  // Handle drag and drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setIsImageLoaded(false);
      setAnalysisResult(null);
      setStegoImage(null);
      setError(null);
    }
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Handle image load
  const handleImageLoad = () => {
    if (!image || !canvasRef.current) return;
    
    setIsImageLoaded(true);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setImageData(imgData);
    };
    
    img.onerror = () => {
      setError('Failed to load image. Try a different file.');
      setImage(null);
      setIsImageLoaded(false);
    };
    
    img.src = image;
  };
  
  // Analyze image for steganography
  const analyzeImage = async () => {
    if (!imageData) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Analyze image
      const result = analyzeImageSteganography(imageData);
      setAnalysisResult(result);
      
      // Set initial bit plane
      setCurrentBitPlane(0);
      
      // Render bit plane
      if (result.bitPlaneThumbnails && result.bitPlaneThumbnails.length > 0) {
        renderBitPlane(result.bitPlaneThumbnails[0]);
      }
      
      // Render heatmap if available
      if (result.anomalyHeatmap) {
        renderHeatmap(result.anomalyHeatmap);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err instanceof Error ? err.message : 'Unknown error analyzing image');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Render bit plane on canvas
  const renderBitPlane = (bitPlaneData: ImageData) => {
    const canvas = bitPlaneCanvasRef.current;
    if (!canvas) return;
    
    canvas.width = bitPlaneData.width;
    canvas.height = bitPlaneData.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.putImageData(bitPlaneData, 0, 0);
  };
  
  // Render heatmap on canvas
  const renderHeatmap = (heatmapData: ImageData) => {
    const canvas = heatmapCanvasRef.current;
    if (!canvas) return;
    
    canvas.width = heatmapData.width;
    canvas.height = heatmapData.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.putImageData(heatmapData, 0, 0);
    
    // If we have suspicious areas, highlight them
    if (analysisResult?.suspiciousAreas) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.lineWidth = 2;
      
      analysisResult.suspiciousAreas.forEach(area => {
        ctx.strokeRect(area.x, area.y, area.width, area.height);
      });
    }
  };
  
  // Show different bit plane
  const showBitPlane = (index: number) => {
    if (!analysisResult?.bitPlaneThumbnails || index < 0 || index >= analysisResult.bitPlaneThumbnails.length) return;
    
    setCurrentBitPlane(index);
    renderBitPlane(analysisResult.bitPlaneThumbnails[index]);
  };
  
  // Hide message in image
  const hideMessage = async () => {
    if (!imageData || !messageToHide) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      let message = messageToHide;
      
      // Simple encryption (in a real app, use proper encryption)
      if (useEncryption && encryptionKey) {
        // Simple XOR encryption for demonstration
        message = simpleEncrypt(message, encryptionKey);
      }
      
      // Hide message in image
      const stegoData = hideDataInImage(imageData, message);
      
      // Create stego image
      const canvas = stegoCanvasRef.current;
      if (!canvas) return;
      
      canvas.width = stegoData.width;
      canvas.height = stegoData.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.putImageData(stegoData, 0, 0);
      
      // Generate data URL
      const stegoUrl = canvas.toDataURL('image/png');
      setStegoImage(stegoUrl);
    } catch (err) {
      console.error('Error hiding message:', err);
      setError(err instanceof Error ? err.message : 'Unknown error hiding message');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Extract message from image
  const extractMessage = async () => {
    if (!imageData) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Extract message
      let message = extractDataFromImage(imageData);
      
      // Decrypt if needed
      if (useEncryption && encryptionKey) {
        message = simpleEncrypt(message, encryptionKey); // Same XOR function both ways
      }
      
      setExtractedMessage(message);
    } catch (err) {
      console.error('Error extracting message:', err);
      setError(err instanceof Error ? err.message : 'Unknown error extracting message');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Simple encryption (XOR)
  const simpleEncrypt = (text: string, key: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const textChar = text.charCodeAt(i);
      result += String.fromCharCode(textChar ^ keyChar);
    }
    return result;
  };
  
  // Download stego image
  const downloadStegoImage = () => {
    if (!stegoImage) return;
    
    const link = document.createElement('a');
    link.href = stegoImage;
    link.download = 'stego_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Effect to load image when source changes
  useEffect(() => {
    if (image) {
      handleImageLoad();
    }
  }, [image]);
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Upload Area */}
      <Card>
        <CardContent className="p-4">
          <div 
            className="border-2 border-dashed rounded-md flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {image ? (
              <div className="text-center">
                <ImageWithFallback 
                  src={image} 
                  alt="Source image" 
                  className="max-h-52 max-w-full mx-auto rounded mb-2 object-contain" 
                  onLoad={handleImageLoad}
                />
                <p className="text-sm text-muted-foreground">Click or drop to change image</p>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Click to select or drop an image</p>
                <p className="text-xs text-muted-foreground mt-1">PNG format recommended for best results</p>
              </div>
            )}
            
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/png,image/jpeg,image/gif,image/webp" 
              onChange={handleFileChange} 
              className="hidden" 
            />
            
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
            <canvas ref={stegoCanvasRef} className="hidden" />
          </div>
        </CardContent>
      </Card>
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Main Controls */}
      {image && isImageLoaded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Steganography Tools
            </CardTitle>
            <CardDescription>
              Analyze images for hidden data or create your own steganographic images
            </CardDescription>
            
            <Tabs defaultValue="analyze" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analyze" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Analyze</span>
                </TabsTrigger>
                <TabsTrigger value="hide" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Hide Data</span>
                </TabsTrigger>
                <TabsTrigger value="extract" className="flex items-center gap-2">
                  <Unlock className="h-4 w-4" />
                  <span>Extract Data</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-6 pt-2">
            <TabsContent value="analyze" className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Analyze the image for potential hidden data using steganographic detection techniques.
                </p>
                <Button 
                  onClick={analyzeImage} 
                  disabled={isAnalyzing || !imageData}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Analyze Image</span>
                    </>
                  )}
                </Button>
              </div>
              
              {analysisResult && (
                <div className="mt-6 space-y-6">
                  {/* Statistical analysis */}
                  {analysisResult.statisticalAnalysis && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        Statistical Analysis
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">LSB Entropy:</span>
                            <span>{analysisResult.statisticalAnalysis.lsbEntropy.toFixed(3)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Unusual Patterns:</span>
                            <span>{analysisResult.statisticalAnalysis.unusualPatterns ? 'Detected' : 'None'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Hidden Message Probability:</span>
                            <span className={`${analysisResult.statisticalAnalysis.messageProbability > 0.5 ? 'text-orange-500' : ''} ${analysisResult.statisticalAnalysis.messageProbability > 0.7 ? 'text-red-500 font-medium' : ''}`}>
                              {(analysisResult.statisticalAnalysis.messageProbability * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        {/* Color histogram */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Color Distribution:</div>
                          <div className="h-6 bg-muted rounded-full overflow-hidden flex">
                            {analysisResult.statisticalAnalysis.colorHistogram.map((value, i) => (
                              <div 
                                key={i}
                                className="h-full"
                                style={{
                                  width: `${(100 / analysisResult.statisticalAnalysis!.colorHistogram.length).toFixed(2)}%`,
                                  background: `hsl(${(i / analysisResult.statisticalAnalysis!.colorHistogram.length) * 360}, 80%, ${50 + value * 30}%)`,
                                  opacity: 0.5 + value * 0.5
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bit planes */}
                  {analysisResult.bitPlaneThumbnails && analysisResult.bitPlaneThumbnails.length > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Grid className="h-4 w-4" />
                          Bit Plane Analysis
                        </h3>
                        
                        <Select 
                          value={currentBitPlane.toString()} 
                          onValueChange={(v) => showBitPlane(parseInt(v))}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Select bit" />
                          </SelectTrigger>
                          <SelectContent>
                            {analysisResult.bitPlaneThumbnails.map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                Bit {i} {i === 0 ? '(LSB)' : i === 7 ? '(MSB)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md flex flex-col items-center">
                        <canvas 
                          ref={bitPlaneCanvasRef} 
                          className="max-w-full border border-border rounded"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Bit {currentBitPlane} plane 
                          {currentBitPlane === 0 && ' (LSB, most commonly used for steganography)'}
                          {currentBitPlane === 7 && ' (MSB, most significant visual impact)'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Anomaly heatmap */}
                  {analysisResult.anomalyHeatmap && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileImage className="h-4 w-4" />
                        Anomaly Heatmap
                      </h3>
                      
                      <div className="bg-muted p-4 rounded-md flex flex-col items-center">
                        <div className="relative">
                          <ImageWithFallback 
                            src={image} 
                            alt="Original" 
                            className="max-w-full rounded opacity-50" 
                          />
                          <canvas 
                            ref={heatmapCanvasRef} 
                            className="absolute top-0 left-0 w-full h-full"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Red areas indicate potential steganographic data
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Extracted data */}
                  {analysisResult.extractedData && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Extracted Data
                      </h3>
                      
                      <Alert variant={analysisResult.statisticalAnalysis?.messageProbability! > 0.7 ? "destructive" : "default"}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>
                          {analysisResult.statisticalAnalysis?.messageProbability! > 0.7 
                            ? 'Hidden data detected with high confidence'
                            : 'Potential hidden data detected'}
                        </AlertTitle>
                        <AlertDescription>
                          Type: {analysisResult.extractedData.type}<br />
                          Size: {analysisResult.extractedData.size} bytes<br />
                          {analysisResult.extractedData.type === 'text' && (
                            <p className="mt-1">
                              Preview: <code>{analysisResult.extractedData.data.substring(0, 100)}</code>
                              {analysisResult.extractedData.data.length > 100 && '...'}
                            </p>
                          )}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {/* No steganographic data detected */}
                  {analysisResult.statisticalAnalysis?.messageProbability === 0 && !analysisResult.extractedData && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No steganographic data detected</AlertTitle>
                      <AlertDescription>
                        This image doesn't seem to contain any hidden information.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="hide" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Hide a message within the image using LSB (Least Significant Bit) steganography.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message to Hide</Label>
                  <Textarea
                    id="message"
                    value={messageToHide}
                    onChange={(e) => setMessageToHide(e.target.value)}
                    placeholder="Enter the secret message to hide in this image..."
                    className="min-h-24"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="encryption"
                    checked={useEncryption}
                    onCheckedChange={setUseEncryption}
                  />
                  <Label htmlFor="encryption">Use encryption</Label>
                </div>
                
                {useEncryption && (
                  <div className="space-y-2">
                    <Label htmlFor="encryptionKey">Encryption Key</Label>
                    <Input
                      id="encryptionKey"
                      type="password"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      placeholder="Enter encryption key"
                      className="max-w-md"
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll need this key to extract the message later
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={hideMessage} 
                  disabled={isAnalyzing || !imageData || !messageToHide}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Hide Message</span>
                    </>
                  )}
                </Button>
                
                {/* Steganographic image result */}
                {stegoImage && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-medium">Result</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Original Image</div>
                        <ImageWithFallback 
                          src={image} 
                          alt="Original" 
                          className="w-full max-h-60 object-contain border rounded" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="text-xs text-muted-foreground">Steganographic Image</div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={downloadStegoImage}
                            className="h-6 text-xs flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            <span>Download</span>
                          </Button>
                        </div>
                        <ImageWithFallback 
                          src={stegoImage} 
                          alt="With hidden message" 
                          className="w-full max-h-60 object-contain border rounded" 
                        />
                        <p className="text-xs text-muted-foreground">
                          This image contains your hidden message. The changes are invisible to the human eye.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="extract" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Extract hidden messages from this image using steganographic techniques.
              </p>
              
              {useEncryption && (
                <div className="space-y-2">
                  <Label htmlFor="extractionKey">Decryption Key</Label>
                  <Input
                    id="extractionKey"
                    type="password"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    placeholder="Enter decryption key"
                    className="max-w-md"
                  />
                </div>
              )}
              
              <Button 
                onClick={extractMessage} 
                disabled={isAnalyzing || !imageData}
                className="flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4" />
                    <span>Extract Message</span>
                  </>
                )}
              </Button>
              
              {extractedMessage && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Extracted Message</h3>
                  <Card>
                    <CardContent className="p-4">
                      <p className="whitespace-pre-wrap">{extractedMessage}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
