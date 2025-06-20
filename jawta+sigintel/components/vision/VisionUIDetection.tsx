
import React, { useEffect, useState } from "react";
import { useVision } from "./VisionProvider";
import { AlertCircle, CheckCircle } from "lucide-react";

export function VisionUIDetection() {
  const { isVisionOS, updateVisionDetection } = useVision();
  const [showDetection, setShowDetection] = useState<boolean>(false);
  
  useEffect(() => {
    // Show detection notification briefly on mount
    setShowDetection(true);
    
    const timer = setTimeout(() => {
      setShowDetection(false);
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!showDetection) return null;
  
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 fade-in ${isVisionOS ? 'visionos-notification' : ''}`}>
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-md
        ${isVisionOS 
          ? 'bg-background/30 backdrop-blur-md border border-white/10' 
          : 'bg-background/70 backdrop-blur-lg border border-border'}
      `}>
        {isVisionOS ? (
          <>
            <CheckCircle className="text-green-500 h-5 w-5" />
            <div>
              <p className="text-sm font-medium">visionOS detected</p>
              <p className="text-xs text-muted-foreground">UI optimized for spatial computing</p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="text-amber-500 h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Standard mode</p>
              <p className="text-xs text-muted-foreground">For mobile and desktop devices</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
