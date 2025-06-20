import { useState, useEffect } from 'react';

interface ResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

export function useResponsive(): ResponsiveReturn {
  // Default to desktop view (safer default for SSR)
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);

  useEffect(() => {
    // Only run this in the browser
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const width = window.innerWidth;
        setIsMobile(width < 640);
        setIsTablet(width >= 640 && width < 1024);
        setIsDesktop(width >= 1024 && width < 1536);
        setIsLargeDesktop(width >= 1536);
      };

      // Run once on mount
      handleResize();
      
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return { isMobile, isTablet, isDesktop, isLargeDesktop };
}