const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {(phase: string) => import('next').NextConfig} */
const isDev = (phase) => phase === PHASE_DEVELOPMENT_SERVER;

const nextConfig = (phase) => ({
  // Step 5.6: Bundle size optimization
  ...(isDev(phase) ? {} : { output: 'export' }),
  distDir: isDev(phase) ? '.next' : 'dist',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Webpack optimizations
  webpack: (config, { dev }) => {
    if (!dev) {
      // Split chunks for better production caching.
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }
    
    return config;
  },
});

module.exports = nextConfig;
