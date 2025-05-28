/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@solana/web3.js']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    // Handle styled-jsx
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/styled-jsx/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: ['styled-jsx/babel']
        },
      },
    });
    // Ensure styled-jsx is properly resolved
    config.resolve.alias = {
      ...config.resolve.alias,
      'styled-jsx/style': require.resolve('styled-jsx/style')
    };
    return config;
  },
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
