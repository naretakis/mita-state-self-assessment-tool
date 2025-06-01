/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  
  // Optimize images - use Next.js Image Optimization
  images: {
    // We need unoptimized: true for static export
    unoptimized: true,
    // But we can still set quality and formats for when using next/image
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Base path configuration - use environment variable for multi-branch deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/mita-state-self-assessment-tool' : ''),
  // Enable trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
  // Add assetPrefix for GitHub Pages - use environment variable for multi-branch deployment
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/mita-state-self-assessment-tool' : ''),
  
  // Configure webpack for optimizations
  webpack: (config, { dev, isServer }) => {
    // Only run in client production builds
    if (!dev && !isServer) {
      // Split chunks more aggressively for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a framework chunk for React, etc.
          framework: {
            name: 'framework',
            test: /[\\\/]node_modules[\\\/](react|react-dom|scheduler|prop-types)[\\\/]/,
            priority: 40,
            chunks: 'all',
            enforce: true,
          },
          // Create a chunk for CMS design system
          cmsDesignSystem: {
            name: 'cms-design-system',
            test: /[\\\/]node_modules[\\\/]@cmsgov[\\\/]/,
            priority: 30,
            chunks: 'all',
          },
          // Create a chunk for charting libraries
          charts: {
            name: 'charts',
            test: /[\\\/]node_modules[\\\/](chart\.js|react-chartjs-2)[\\\/]/,
            priority: 20,
            chunks: 'all',
          },
          // Create a chunk for PDF generation
          pdfLibs: {
            name: 'pdf-libs',
            test: /[\\\/]node_modules[\\\/](jspdf|jspdf-autotable)[\\\/]/,
            priority: 20,
            chunks: 'all',
          },
          // Create a chunk for markdown processing
          markdownLibs: {
            name: 'markdown-libs',
            test: /[\\\/]node_modules[\\\/](react-markdown|remark-gfm|gray-matter|js-yaml)[\\\/]/,
            priority: 20,
            chunks: 'all',
          },
          // Group common libraries
          lib: {
            test: /[\\\/]node_modules[\\\/]/,
            priority: 10,
            chunks: 'async',
            minChunks: 2,
          },
          // Group components by domain
          components: {
            name: 'components',
            test: /[\\\/]src[\\\/]components[\\\/]/,
            priority: 10,
            chunks: 'async',
            minChunks: 2,
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig