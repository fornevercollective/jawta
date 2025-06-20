import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Speaker, VolumeX, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface MorseVisualizerProps {
  morseText?: string;
  autoPlay?: boolean;
  height?: number;
  showControls?: boolean;
}

export function MorseVisualizer({
  morseText = '',
  autoPlay = false,
  height = 100,
  showControls = true,
}: MorseVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(1.0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  // Initialize morse patterns as arrays of dots, dashes, spaces
  const parseMorse = (text: string) => {
    if (!text) return [];

    // Convert morse text to array of signals
    return text.split('').map(char => {
      switch (char) {
        case '.': return { type: 'dot', duration: 1 };
        case '-': return { type: 'dash', duration: 3 };
        case ' ': return { type: 'space', duration: 1 };
        case '/': return { type: 'wordspace', duration: 7 };
        default: return null;
      }
    }).filter(Boolean);
  };

  const morsePatterns = parseMorse(morseText);

  // Create audio context for sound
  useEffect(() => {
    if (soundEnabled && !audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioCtx.current) {
        audioCtx.current.close();
        audioCtx.current = null;
      }
    };
  }, [soundEnabled]);

  // Play a beep sound for morse code
  const playMorseSound = (duration: number) => {
    if (!audioCtx.current || !soundEnabled) return;

    const oscillator = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();
    
    // Set the waveform and frequency
    oscillator.type = 'sine';
    oscillator.frequency.value = 600;
    
    // Connect and configure the gain node
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);
    
    // Start and stop the oscillator
    const now = audioCtx.current.currentTime;
    oscillator.start(now);
    oscillator.stop(now + duration * (1/speed));
  };

  // Animation frame logic for playing the morse code
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    let unitDuration = 100 / speed; // milliseconds per unit (dot)
    
    const render = (time: number) => {
      if (!isPlaying) return;
      
      const deltaTime = time - lastTime;
      
      if (deltaTime >= unitDuration && morsePatterns.length > 0) {
        lastTime = time;
        
        const pattern = morsePatterns[currentPosition];
        
        if (pattern && pattern.type !== 'space' && pattern.type !== 'wordspace') {
          // Play sound for dots and dashes
          playMorseSound(pattern.duration * 0.1);
        }
        
        // Advance position
        setCurrentPosition((prev) => {
          const next = (prev + 1) % morsePatterns.length;
          return next;
        });
      }
      
      drawMorseCanvas();
      animationId = requestAnimationFrame(render);
    };
    
    const drawMorseCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set up dimensions
      const unitWidth = Math.min(30, canvas.width / (morsePatterns.length * 3));
      const dotHeight = canvas.height * 0.3;
      const dashHeight = canvas.height * 0.3;
      const yPos = canvas.height * 0.5;
      
      // Draw timeline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, yPos - 1, canvas.width, 2);
      
      // Draw each morse element
      let xPos = 10; // Start with a small offset
      
      morsePatterns.forEach((pattern, index) => {
        const isActive = index === currentPosition && isPlaying;
        
        if (pattern.type === 'dot') {
          ctx.fillStyle = isActive ? '#FFD700' : '#844213';
          ctx.beginPath();
          ctx.arc(xPos + unitWidth/2, yPos, unitWidth/2, 0, 2 * Math.PI);
          ctx.fill();
          
          // Glow effect for active element
          if (isActive) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(xPos + unitWidth/2, yPos, unitWidth/2 + 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          
          xPos += unitWidth * 2;
        } else if (pattern.type === 'dash') {
          ctx.fillStyle = isActive ? '#FFD700' : '#844213';
          ctx.fillRect(xPos, yPos - dashHeight/2, unitWidth * 3, dashHeight);
          
          // Glow effect for active element
          if (isActive) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 10;
            ctx.fillRect(xPos, yPos - dashHeight/2, unitWidth * 3, dashHeight);
            ctx.shadowBlur = 0;
          }
          
          xPos += unitWidth * 4;
        } else if (pattern.type === 'space') {
          // Space between characters
          xPos += unitWidth;
        } else if (pattern.type === 'wordspace') {
          // Space between words
          xPos += unitWidth * 4;
        }
      });
    };
    
    // Start or pause the animation
    if (isPlaying) {
      animationId = requestAnimationFrame(render);
    } else {
      drawMorseCanvas(); // Draw static state
    }
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, morsePatterns, currentPosition, speed, soundEnabled]);

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = height;
        }
      }
    };

    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset animation to beginning
  const handleReset = () => {
    setCurrentPosition(0);
  };

  // Toggle sound on/off
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full bg-black/30 rounded"
        />
        
        {!morseText && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-sm text-muted-foreground">
            <p>No Morse code to display</p>
          </div>
        )}
      </div>
      
      {showControls && morseText && (
        <div className="flex items-center justify-between mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-amber-400" />
            ) : (
              <Play className="h-4 w-4 text-amber-400" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleReset}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 px-2">
            <Slider
              value={[speed]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(values) => setSpeed(values[0])}
            />
          </div>
          
          <span className="text-xs text-muted-foreground mr-2">
            {speed.toFixed(1)}x
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={toggleSound}
          >
            {soundEnabled ? (
              <Speaker className="h-4 w-4 text-green-400" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}