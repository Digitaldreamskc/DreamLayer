/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Comprehensive fallbacks for browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        worker_threads: false,
        perf_hooks: false,
        async_hooks: false,
      };

      // Ignore problematic modules
      config.externals = {
        ...config.externals,
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'encoding': 'commonjs encoding',
        'got': 'commonjs got',
      };
    }

    // Handle ESM modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    return config;
  },
  // Handle CSS issues
  transpilePackages: [
    '@solana/web3.js',
    '@metaplex-foundation/js',
    '@privy-io/react-auth',
    '@aptos-labs/ts-sdk',
    '@aptos-labs/aptos-client',
    '@rainbow-me/rainbowkit',
    '@story-protocol/core-sdk',
    'wagmi',
    'viem'
  ],
  // Optimize output
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = nextConfig;