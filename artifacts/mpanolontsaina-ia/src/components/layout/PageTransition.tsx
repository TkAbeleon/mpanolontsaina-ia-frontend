import { useEffect, useState, useRef, ReactNode } from 'react';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // After exit animation, update location and start enter animation
      timeoutRef.current = window.setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 200); // Match pageExit duration
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location, displayLocation]);

  return (
    <div 
      key={displayLocation}
      className={isTransitioning ? 'page-transition-exit' : 'page-transition-enter'}
    >
      {children}
    </div>
  );
}
