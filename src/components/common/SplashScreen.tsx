// components/SplashScreen.tsx
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  duration?: number;
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  duration = 3000, 
  onAnimationComplete 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="w-[150px] h-[150px]">
        <img 
          src="/assets/logo.png" 
          alt="App Logo" 
          className="w-full h-full animate-pulse animate-fade-in" 
        />
      </div>
    </div>
  );
};

export default SplashScreen;