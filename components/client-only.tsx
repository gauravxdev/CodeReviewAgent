'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component ensures content is only rendered client-side
 * This helps prevent hydration errors from browser extensions that modify the DOM
 * while maintaining your theme preferences and UI customizations
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return fallback;
  }
  
  return <>{children}</>;
}
