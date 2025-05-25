// Clerk authentication configuration
export const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/api(.*)'
];

export const protectedRoutes = [
  '/code',
  '/code/(.*)',
  '/codereview',
  '/codereview/(.*)'
];

// Check if a given path is a public route
export function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => {
    const routePattern = new RegExp(`^${route.replace(/\(.*\)/, '.*')}$`);
    return routePattern.test(path);
  });
}

// Check if a given path is a protected route
export function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => {
    const routePattern = new RegExp(`^${route.replace(/\(.*\)/, '.*')}$`);
    return routePattern.test(path);
  });
}
