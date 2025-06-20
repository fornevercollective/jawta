
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useVision } from './VisionProvider';

interface StatusToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  duration?: number; // in milliseconds
  visible: boolean;
  onClose?: () => void;
}

export function StatusToast({
  message,
  type = 'info',
  icon,
  duration = 3000,
  visible,
  onClose
}: StatusToastProps) {
  const [isVisible, setIsVisible] = useState(visible);
  const { isVisionOS } = useVision();

  // Handle visibility changes based on props
  useEffect(() => {
    setIsVisible(visible);
    
    // Auto-hide after duration if visible
    let timer: NodeJS.Timeout;
    if (visible && duration !== Infinity) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, duration, onClose]);

  // Hide the toast
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // If not visible, don't render
  if (!isVisible) return null;

  // Determine background style based on type
  const getBgStyle = () => {
    switch (type) {
      case 'success': return 'bg-green-500/80 text-white';
      case 'warning': return 'bg-amber-500/80 text-white';
      case 'error': return 'bg-red-500/80 text-white';
      case 'info':
      default: return 'bg-background/80 backdrop-blur-md';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 max-w-xs w-full px-2">
      <div className={`${getBgStyle()} rounded-lg shadow-md backdrop-blur-md flex items-center gap-2 px-3 py-2`}>
        {icon && <span>{icon}</span>}
        <span className="text-sm flex-1">{message}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100" 
          onClick={handleClose}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
}

// Specialized version for VisionOS detection results
export function VisionStatusToast({
  isVisionOS,
  isTranslucent,
  isVisible,
  onClose
}: {
  isVisionOS: boolean;
  isTranslucent: boolean;
  isVisible: boolean;
  onClose?: () => void;
}) {
  const message = isVisionOS 
    ? `VisionOS ${isTranslucent ? 'translucent mode' : 'standard mode'} detected`
    : 'Standard browser mode';
  
  const type = isVisionOS ? 'success' : 'info';
  
  return (
    <StatusToast
      message={message}
      type={type}
      duration={4000}
      visible={isVisible}
      onClose={onClose}
      icon={
        <Badge 
          variant={isVisionOS ? "default" : "outline"}
          className="h-5 text-xs"
        >
          {isVisionOS ? "VisionOS" : "Browser"}
        </Badge>
      }
    />
  );
}
