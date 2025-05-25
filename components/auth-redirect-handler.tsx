'use client';

import { useEffect, useRef, useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { isAuthEnabled } from '@/app/env';

/**
 * Component to handle authentication redirects
 * This creates a professional experience by automatically handling auth redirects
 */
export function AuthRedirectHandler() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  const [authEnabled] = useState(isAuthEnabled());
  
  // Create a ref to store the button element
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    // If auth is enabled and redirected from a protected route, trigger the sign-in modal
    if (authEnabled && redirectUrl && buttonRef.current) {
      // Slight delay to ensure everything is loaded
      setTimeout(() => {
        buttonRef.current?.click();
      }, 100);
    }
  }, [redirectUrl, authEnabled]);
  
  // Don't render anything if no redirect URL or auth is disabled
  if (!redirectUrl || !authEnabled) return null;
  
  return (
    <div className="hidden">
      <SignInButton mode="modal">
        <button 
          ref={buttonRef} 
          className="hidden"
        >
          Sign In
        </button>
      </SignInButton>
    </div>
  );
}
