// Environment configuration

// Default empty values for Clerk keys
export const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';
export const clerkSecretKey = process.env.CLERK_SECRET_KEY || 'sk_test_placeholder';

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development';

// Helper to determine if auth should be enabled
export const isAuthEnabled = () => {
  // In production, only enable auth if real keys are provided
  if (process.env.NODE_ENV === 'production') {
    return (
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
      process.env.CLERK_SECRET_KEY &&
      process.env.CLERK_SECRET_KEY.startsWith('sk_')
    );
  }
  
  // In development, always enable auth with either real keys or placeholders
  return true;
};
