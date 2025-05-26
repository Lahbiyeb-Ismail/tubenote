/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable output file tracing for monorepos
  output: 'standalone',
  
  // Set the tracing root to include the entire monorepo
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
  
  // Transpile shared packages
  transpilePackages: [
    '@tubenote/types',
    '@tubenote/dtos',
    '@tubenote/utils',
    '@tubenote/schemas'
  ],
  
  // Experimental features for better monorepo support
  experimental: {
    // Enable external directory support
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
