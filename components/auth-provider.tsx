'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode, useEffect, useState } from 'react';
import { clerkPublishableKey, isAuthEnabled } from '@/app/env';

/**
 * A wrapper component that conditionally provides Clerk authentication
 * or renders children directly if auth is disabled
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // State to track if we're in a browser environment
  const [isBrowser, setIsBrowser] = useState(false);
  
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Don't attempt to use Clerk during SSR if auth is disabled
  if (!isBrowser && !isAuthEnabled()) {
    return <>{children}</>;
  }
  
  // When on the client or when auth is enabled, use Clerk
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          card: 'bg-background',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-background text-foreground border border-border',
          socialButtonsBlockButtonText: 'text-foreground',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-background border-border text-foreground',
          footer: 'hidden',
          footerActionLink: 'text-primary',
          identityPreview: 'bg-background border-border text-foreground',
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
