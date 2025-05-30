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
  
  // Disable trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
}

module.exports = nextConfig