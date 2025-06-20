
import React, { createContext, useContext, useEffect, useState } from "react";

interface VisionContextType {
  isVisionOS: boolean;
  updateVisionDetection: (detected: boolean) => void;
  applyTranslucent: (level: "light" | "medium" | "heavy") => string;
}

const VisionContext = createContext<VisionContextType>({
  isVisionOS: false,
  updateVisionDetection: () => {},
  applyTranslucent: () => "",
});

export const useVision = () => useContext(VisionContext);

interface VisionProviderProps {
  children: React.ReactNode;
}

export function VisionProvider({ children }: VisionProviderProps) {
  const [isVisionOS, setIsVisionOS] = useState<boolean>(false);
  
  // Function to update Vision detection status
  const updateVisionDetection = (detected: boolean) => {
    setIsVisionOS(detected);
    
    // Apply visionOS class to document root for global styles
    if (detected) {
      document.documentElement.classList.add('visionos');
    } else {
      document.documentElement.classList.remove('visionos');
    }
  };
  
  // Helper function to apply appropriate translucency level
  const applyTranslucent = (level: "light" | "medium" | "heavy") => {
    switch(level) {
      case "light":
        return "bg-translucent-light backdrop-blur-sm";
      case "medium":
        return "bg-translucent-medium backdrop-blur-md";
      case "heavy":
        return "bg-translucent-heavy backdrop-blur-lg";
      default:
        return "bg-translucent backdrop-blur-md";
    }
  };
  
  // Initial detection on mount
  useEffect(() => {
    // Simple detection of visionOS based on user agent (prototype)
    // In a real app, use more robust detection methods
    const userAgent = navigator.userAgent.toLowerCase();
    const isVisionOSDevice = userAgent.includes('visionos') || 
                             window.location.search.includes('visionos') ||
                             localStorage.getItem('visionos-mode') === 'true';
    
    updateVisionDetection(isVisionOSDevice);
  }, []);
  
  const value = {
    isVisionOS,
    updateVisionDetection,
    applyTranslucent
  };
  
  return (
    <VisionContext.Provider value={value}>
      {children}
    </VisionContext.Provider>
  );
}
