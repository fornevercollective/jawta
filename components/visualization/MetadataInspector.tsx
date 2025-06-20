
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Upload, FileText, Info, Map, Camera, Clock, Tag, 
  HelpCircle, ExternalLink, AlertCircle, Headphones, Eye
} from 'lucide-react';
import { FileMetadata, extractFileMetadata, extractHexDump, identifyFileFormat } from '../utils/metadataUtils';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface MetadataInspectorProps {
  initialFile?: File;
  className?: string;
}

export function MetadataInspector({ initialFile, className }: MetadataInspectorProps) {
  // File state
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Metadata states
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [hexDump, setHexDump] = useState<string | null>(null);
  const [hexDumpOffset, setHexDumpOffset] = useState(0);
  const [fileFormatInfo, setFileFormatInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // File input reference
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    await processFile(selectedFile);
  };
  
  // Handle drag and drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Process the file
  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setError(null);
    setFile(selectedFile);
    
    try {
      // Create preview URL if it's an image
      if (selectedFile.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(selectedFile);
        setFilePreview(previewUrl);
      } else {
        setFilePreview(null);
      }
      
      // Extract metadata
      const metaData = await extractFileMetadata(selectedFile);
      setMetadata(metaData);
      
      // Extract hex dump
      const hexData = await extractHexDump(selectedFile, 0, 256);
      setHexDump(hexData);
      
      // Identify file format
      const formatInfo = await identifyFileFormat(selectedFile);
      setFileFormatInfo(formatInfo);
      
      // Reset to general tab
      setActiveTab('general');
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Unknown error processing file');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Load more hex data
  const loadMoreHex = async () => {
    if (!file) return;
    
    const newOffset = hexDumpOffset + 256;
    try {
      const hexData = await extractHexDump(file, newOffset, 256);
      setHexDump((prev) => prev + hexData);
      setHexDumpOffset(newOffset);
    } catch (err) {
      console.error('Error loading more hex data:', err);
    }
  };
  
  // Format bytes to readable string
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleString();
  };
  
  // Get icon based on file type
  const getFileIcon = (): JSX.Element => {
    if (!file) return <HelpCircle className="h-6 w-6" />;
    
    if (file.type.startsWith('image/')) {
      return <Camera className="h-6 w-6" />;
    } else if (file.type.startsWith('audio/')) {
      return <Headphones className="h-6 w-6" />;
    } else if (file.type.startsWith('video/')) {
      return <Eye className="h-6 w-6" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-6 w-6" />;
    } else {
      return <FileText className="h-6 w-6" />;
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Upload Area */}
      <Card>
        <CardContent className="p-4">
          <div 
            className="border-2 border-dashed rounded-md flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {filePreview ? (
                    <ImageWithFallback 
                      src={filePreview} 
                      alt={file.name} 
                      className="h-16 w-auto object-contain" 
                    />
                  ) : (
                    getFileIcon()
                  )}
                </div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatBytes(file.size)} • {file.type || 'Unknown type'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Click or drop to change file
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>Click to select or drop a file</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Metadata inspection works with images, audio, video, and documents
                </p>
              </div>
            )}
            
            <input 
              ref={fileInputRef} 
              type="file" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Metadata Display */}
      {metadata && !isProcessing && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Metadata Inspector
              </CardTitle>
              <Badge variant="outline">{fileFormatInfo || 'Unknown format'}</Badge>
            </div>
            <CardDescription>
              Showing extracted metadata for {file?.name}
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="details">Detailed Info</TabsTrigger>
                <TabsTrigger value="hexdump">Hex Dump</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-0">
              <TabsContent value="general" className="p-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic file info */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      File Information
                    </h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 text-sm">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="col-span-2 font-medium truncate">{metadata.fileName}</span>
                      </div>
                      <div className="grid grid-cols-3 text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="col-span-2">{metadata.fileType || 'Unknown'}</span>
                      </div>
                      <div className="grid grid-cols-3 text-sm">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="col-span-2">{formatBytes(metadata.fileSize || 0)}</span>
                      </div>
                      <div className="grid grid-cols-3 text-sm">
                        <span className="text-muted-foreground">Modified:</span>
                        <span className="col-span-2">{metadata.lastModified ? formatDate(metadata.lastModified) : 'Unknown'}</span>
                      </div>
                      {metadata.dimensions && (
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span className="col-span-2">{metadata.dimensions.width} × {metadata.dimensions.height} px</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Image specific info */}
                  {metadata.exif && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        Camera Information
                      </h3>
                      <div className="space-y-2">
                        {metadata.exif.camera && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Camera:</span>
                            <span className="col-span-2">{metadata.exif.camera}</span>
                          </div>
                        )}
                        {metadata.exif.model && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Model:</span>
                            <span className="col-span-2">{metadata.exif.model}</span>
                          </div>
                        )}
                        {metadata.exif.dateTaken && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Date Taken:</span>
                            <span className="col-span-2">{new Date(metadata.exif.dateTaken).toLocaleString()}</span>
                          </div>
                        )}
                        {metadata.exif.exposureTime && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Exposure:</span>
                            <span className="col-span-2">{metadata.exif.exposureTime} sec</span>
                          </div>
                        )}
                        {metadata.exif.fNumber && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Aperture:</span>
                            <span className="col-span-2">f/{metadata.exif.fNumber}</span>
                          </div>
                        )}
                        {metadata.exif.iso && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">ISO:</span>
                            <span className="col-span-2">{metadata.exif.iso}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Audio specific info */}
                  {metadata.audio && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Headphones className="h-4 w-4" />
                        Audio Information
                      </h3>
                      <div className="space-y-2">
                        {metadata.audio.duration !== undefined && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="col-span-2">{Math.round(metadata.audio.duration)} seconds</span>
                          </div>
                        )}
                        {metadata.audio.channels && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Channels:</span>
                            <span className="col-span-2">{metadata.audio.channels}</span>
                          </div>
                        )}
                        {metadata.audio.sampleRate && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Sample Rate:</span>
                            <span className="col-span-2">{metadata.audio.sampleRate} Hz</span>
                          </div>
                        )}
                        {metadata.audio.bitRate && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Bit Rate:</span>
                            <span className="col-span-2">{Math.round(metadata.audio.bitRate / 1000)} kbps</span>
                          </div>
                        )}
                        {metadata.audio.codec && (
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Codec:</span>
                            <span className="col-span-2">{metadata.audio.codec}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* GPS info */}
                  {metadata.exif?.gps && (
                    metadata.exif.gps.latitude !== undefined && 
                    metadata.exif.gps.longitude !== undefined && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Map className="h-4 w-4" />
                          Location Information
                        </h3>
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Latitude:</span>
                            <span className="col-span-2">{metadata.exif.gps.latitude.toFixed(6)}°</span>
                          </div>
                          <div className="grid grid-cols-3 text-sm">
                            <span className="text-muted-foreground">Longitude:</span>
                            <span className="col-span-2">{metadata.exif.gps.longitude.toFixed(6)}°</span>
                          </div>
                          {metadata.exif.gps.altitude !== undefined && (
                            <div className="grid grid-cols-3 text-sm">
                              <span className="text-muted-foreground">Altitude:</span>
                              <span className="col-span-2">{metadata.exif.gps.altitude.toFixed(1)} m</span>
                            </div>
                          )}
                          <div className="mt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs h-7 flex items-center gap-1"
                              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${metadata.exif!.gps!.latitude},${metadata.exif!.gps!.longitude}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View on Map</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="p-6 pt-2">
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '30%' }}>Property</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Basic file info */}
                    <TableRow>
                      <TableCell className="font-medium">File Name</TableCell>
                      <TableCell>{metadata.fileName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">MIME Type</TableCell>
                      <TableCell>{metadata.fileType || 'Unknown'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Size</TableCell>
                      <TableCell>{formatBytes(metadata.fileSize || 0)} ({metadata.fileSize} bytes)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Last Modified</TableCell>
                      <TableCell>{metadata.lastModified ? formatDate(metadata.lastModified) : 'Unknown'}</TableCell>
                    </TableRow>
                    
                    {/* Dimensions if available */}
                    {metadata.dimensions && (
                      <TableRow>
                        <TableCell className="font-medium">Dimensions</TableCell>
                        <TableCell>{metadata.dimensions.width} × {metadata.dimensions.height} pixels</TableCell>
                      </TableRow>
                    )}
                    
                    {/* EXIF data */}
                    {metadata.exif && Object.entries(metadata.exif).map(([key, value]) => {
                      // Skip nested objects like GPS for tabular view
                      if (typeof value === 'object') return null;
                      
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </TableCell>
                          <TableCell>{String(value)}</TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {/* Audio data */}
                    {metadata.audio && Object.entries(metadata.audio).map(([key, value]) => {
                      if (value === undefined) return null;
                      
                      // Format special values
                      let displayValue = value;
                      if (key === 'duration') displayValue = `${Math.round(value as number)} seconds`;
                      if (key === 'bitRate') displayValue = `${Math.round((value as number) / 1000)} kbps`;
                      if (key === 'sampleRate') displayValue = `${value} Hz`;
                      
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </TableCell>
                          <TableCell>{String(displayValue)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {/* Show GPS data separately */}
                {metadata.exif?.gps && (
                  metadata.exif.gps.latitude !== undefined && 
                  metadata.exif.gps.longitude !== undefined && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">GPS Location</h3>
                      <Table className="border">
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Latitude</TableCell>
                            <TableCell>{metadata.exif.gps.latitude.toFixed(6)}°</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Longitude</TableCell>
                            <TableCell>{metadata.exif.gps.longitude.toFixed(6)}°</TableCell>
                          </TableRow>
                          {metadata.exif.gps.altitude !== undefined && (
                            <TableRow>
                              <TableCell className="font-medium">Altitude</TableCell>
                              <TableCell>{metadata.exif.gps.altitude.toFixed(1)} meters</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )
                )}
              </TabsContent>
              
              <TabsContent value="hexdump" className="p-6 pt-2">
                {hexDump ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Hex Dump</h3>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          value={hexDumpOffset} 
                          onChange={(e) => setHexDumpOffset(parseInt(e.target.value) || 0)}
                          className="w-24 h-8 text-xs"
                        />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs"
                          onClick={loadMoreHex}
                        >
                          Load More
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
                      {hexDump}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p>No hex data available</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      )}
      
      {/* Loading state */}
      {isProcessing && (
        <Card className="p-8 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full border-4 border-primary/30 border-t-primary h-10 w-10 mb-4" />
          <p>Processing file metadata...</p>
        </Card>
      )}
    </div>
  );
}
