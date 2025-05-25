'use client';

import { useEffect, useRef } from 'react';
import { SignInButton } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

/**
 * Component to handle authentication redirects
 * This creates a professional experience by automatically handling auth redirects
 */
export function AuthRedirectHandler() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  
  // Create a ref to store the button element
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    // If redirected from a protected route, trigger the sign-in modal
    if (redirectUrl && buttonRef.current) {
      // Slight delay to ensure everything is loaded
      setTimeout(() => {
        buttonRef.current?.click();
      }, 100);
    }
  }, [redirectUrl]);
  
  // Don't render anything if no redirect URL
  if (!redirectUrl) return null;
  
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
