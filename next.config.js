/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '',
  // This allows us to modify the basePath for different environments
  // The GitHub Action will modify this for non-main branches
  
  // Enable trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
  
  // Add assetPrefix for GitHub Pages
  // Use relative paths for assets to work with different base paths
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
}

module.exports = nextConfig