/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enables static HTML export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Configure trailing slash for better compatibility with static hosting
  trailingSlash: true,
};

module.exports = nextConfig;