/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Optimize images - use Next.js Image Optimization
  images: {
    // We need unoptimized: true for static export
    unoptimized: true,
  },
  
  // Base path configuration - use environment variable for multi-branch deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/mita-state-self-assessment-tool' : ''),
  
  // Enable trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
  
  // Add assetPrefix for GitHub Pages - use environment variable for multi-branch deployment
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/mita-state-self-assessment-tool' : ''),
  
  // Ignore TypeScript errors during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig