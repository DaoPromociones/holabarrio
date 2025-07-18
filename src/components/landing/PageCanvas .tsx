// components/PageCanvas.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function PageCanvas({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const backgroundStyle = {
    light: { backgroundImage: "url('/nublado.png')" }, //'linear-gradient(to bottom right, #e0f2fe, #ffffff, #f3e8ff)'
    dark:  { backgroundImage: "url('/nebula-bg.png')" } // Usamos el .png que funciona
  };

  useEffect(() => {
    if (isMounted && divRef.current) {
      const styleToApply = theme === 'dark' ? backgroundStyle.dark : backgroundStyle.light;
      divRef.current.style.backgroundImage = styleToApply.backgroundImage;
    }
  }, [isMounted, theme]);

  return (
    <div 
      ref={divRef}
      className="bg-cover bg-center bg-fixed transition-all duration-1000" 
    >
      {children}
    </div>
  );
}
