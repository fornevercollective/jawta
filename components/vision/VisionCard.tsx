
import React from 'react';
import { useVision } from './VisionProvider';
import { cn } from '../ui/utils';

interface VisionCardProps {
  children: React.ReactNode;
  translucencyLevel?: 'light' | 'medium' | 'heavy';
  spatial?: boolean;
  className?: string;
  border?: boolean;
  depth?: number;
}

export function VisionCard({
  children,
  translucencyLevel = 'medium',
  spatial = true,
  border = true,
  depth = 0.5,
  className
}: VisionCardProps) {
  const { isVisionOS, applyTranslucent } = useVision();
  
  let cardClasses: string = '';
  
  if (isVisionOS) {
    // visionOS specific styles
    const glassClass = applyTranslucent(translucencyLevel);
    
    cardClasses = cn(
      "rounded-xl glass-panel",
      glassClass,
      {
        'border border-vision-border': border,
        'vision-spatial': spatial,
        'shadow-lg': !spatial,
      },
      className
    );
    
    // Apply custom depth through style if needed
    if (spatial && depth && depth !== 0.5) {
      const depthStyle = {
        '--vision-depth': depth.toString(),
        '--vision-depth-active': (depth * 1.5).toString()
      } as React.CSSProperties;
      
      return (
        <div className={cardClasses} style={depthStyle}>
          {children}
        </div>
      );
    }
  } else {
    // Standard styles for non-visionOS
    cardClasses = cn(
      "rounded-xl glass-card",
      {
        'border border-border/50': border,
      },
      className
    );
  }
  
  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}
