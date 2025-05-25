/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Configure compiler options to help with hydration issues
  compiler: {
    // Disable removal of console logs in production
    removeConsole: false,
  },
  
  // Experimental features
  experimental: {
    // Improve hydration error reporting
    optimizeServerReact: true,
    // Use new React features
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  
  // Configure webpack to handle large serializations
  webpack: (config) => {
    // Optimize serialization performance
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Use Buffer for serializing large strings
    config.optimization.moduleIds = 'deterministic';
    
    return config;
  },
}

module.exports = nextConfig
