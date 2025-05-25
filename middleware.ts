import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks'
];

// Protected routes that explicitly require authentication
const protectedRoutes = [
  '/code(.*)',  // /code route and any subroutes
  '/codereview(.*)' // /codereview route and any subroutes
];

// Public assets and Next.js system routes that should be excluded from auth checks
const systemRoutes = [
  '/_next/(.*)',
  '/favicon.ico',
  '/assets/(.*)',
  '/images/(.*)',
  '/api/auth/(.*)',
  '/(.*)\.(svg|jpg|png|gif|ico|css|js)'
];

// This is the main middleware function
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // First, check if it's a system route that doesn't need auth
  if (isMatchingRoute(pathname, systemRoutes)) {
    return NextResponse.next();
  }
  
  // Check if it's an explicitly protected route
  if (isMatchingRoute(pathname, protectedRoutes)) {
    // If protected and not authenticated, redirect to sign-up
    if (!checkAuth(request)) {
      console.log(`Protected route access attempted: ${pathname}`);
      return redirectToSignUp(request);
    }
  }
  
  // If it's a public route, allow access
  if (isMatchingRoute(pathname, publicRoutes)) {
    return NextResponse.next();
  }
  
  // Default behavior - protect all other routes
  if (!checkAuth(request)) {
    console.log(`Default protection for route: ${pathname}`);
    return redirectToSignUp(request);
  }
  
  return NextResponse.next();
}

// Helper function to check if user is authenticated
function checkAuth(request: NextRequest): boolean {
  return (
    request.cookies.has('__clerk_db_jwt_token') || 
    request.cookies.has('__session') || 
    request.cookies.has('__clerk_session')
  );
}

// Helper function to redirect to sign-up
function redirectToSignUp(request: NextRequest): NextResponse {
  const signUpUrl = new URL('/sign-up', request.url);
  signUpUrl.searchParams.set('redirect_url', request.url);
  return NextResponse.redirect(signUpUrl);
}

// Helper function to check if a path matches any of the provided patterns
function isMatchingRoute(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
}

// Configure the middleware matcher
export const config = {
  matcher: ['/((?!.+\.[\w]+$|_next).*)', '/(api|trpc)(.*)'],
};