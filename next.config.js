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

// Only add basePath and assetPrefix when building for production (not in dev mode)
if (process.env.NODE_ENV === 'production') {
  nextConfig.basePath = '/mita-state-self-assessment-tool';
  nextConfig.assetPrefix = '/mita-state-self-assessment-tool';
}

module.exports = nextConfig;