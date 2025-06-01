/** @type {import('next').NextConfig} */

// This configuration helps handle packages with React version conflicts
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    // These packages have dependencies on older React versions
    '@keystonehq/sdk',
    'qrcode.react',
    'react-qr-reader',
    '@reown/appkit',
    '@reown/appkit-adapter-wagmi',
  ],
  images: {
    domains: [
      'ipfs.io',
      'gateway.irys.xyz',
      'secure.walletconnect.org',
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // IMPORTANT: These packages have vulnerabilities or other issues
    // that need special handling with alias or fallbacks
    if (!isServer) {
      // Replace vulnerable packages with shims or newer versions when possible
      config.resolve.alias = {
        ...config.resolve.alias,
        // Example of aliasing a problematic package if needed
        // 'problem-package': 'path/to/shim-or-fixed-version',
      }

      // Add optimization for AppKit chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            appkit: {
              test: /[\\/]node_modules[\\/]@reown[\\/]appkit[\\/]/,
              name: 'appkit',
              priority: 20,
              chunks: 'all',
              enforce: true,
            },
            appkitAdapter: {
              test: /[\\/]node_modules[\\/]@reown[\\/]appkit-adapter-wagmi[\\/]/,
              name: 'appkit-adapter',
              priority: 10,
              chunks: 'all',
              enforce: true,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 5,
              chunks: 'all',
            },
          },
        },
      }
    }
    
    return config
  },
}

module.exports = nextConfig
