
import { useEffect, useState } from "react";

type Environment = {
  isVisionOS: boolean;
  isTranslucent: boolean;
  supportsHover: boolean;
  prefersDarkMode: boolean;
};

export function useEnvironment(): Environment {
  const [environment, setEnvironment] = useState<Environment>({
    isVisionOS: false,
    isTranslucent: false,
    supportsHover: true,
    prefersDarkMode: false,
  });

  useEffect(() => {
    // Check for visionOS
    const isVisionOS = 
      typeof window !== 'undefined' && 
      (
        // @ts-ignore - visionOS detection
        window.navigator?.userAgentData?.platform === 'visionOS' ||
        window.navigator.userAgent.includes('VisionOS') ||
        // CSS environment check for visionOS
        (window.CSS && CSS.supports('background: -apple-system-visual-effects-surface-material'))
      );

    // Check for translucency support
    const isTranslucent = 
      isVisionOS || 
      (window.CSS && CSS.supports('backdrop-filter', 'blur(10px)'));
    
    // Check hover capabilities
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    
    // Check color scheme preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setEnvironment({
      isVisionOS,
      isTranslucent,
      supportsHover,
      prefersDarkMode,
    });

    // Set up listener for dark mode changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setEnvironment(prev => ({
        ...prev,
        prefersDarkMode: e.matches
      }));
    };

    darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  return environment;
}
