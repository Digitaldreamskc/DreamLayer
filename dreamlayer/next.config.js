/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { dev, isServer }) => {
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
            // Ignore problematic native modules
            config.externals = {
                ...config.externals,
                'utf-8-validate': 'commonjs utf-8-validate',
                'bufferutil': 'commonjs bufferutil',
                'encoding': 'commonjs encoding',
            };
        }
        // Disable cache in development
        if (dev) {
            config.cache = false;
        }
        // Enable top-level await
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };
        return config;
    },
    transpilePackages: [
        '@solana/web3.js',
        '@metaplex-foundation/js',
        '@privy-io/react-auth',
    ],
    // Remove swcMinify entirely as it's deprecated and enabled by default
    // If you need to disable it for debugging, you can uncomment the line below:
    // swcMinify: false,
};

module.exports = nextConfig;
