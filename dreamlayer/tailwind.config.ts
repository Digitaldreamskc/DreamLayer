import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

const config: Config = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    safelist: [
        // Add any dynamically generated classes here
        'bg-primary-500',
        'text-accent-500',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui'],
                display: ['var(--font-display)', 'sans-serif'],
            },
            colors: {
                cyber: {
                    50: '#E6FBF9',
                    500: '#14B8A6',
                    glow: '#14b8a640',
                },
                accent: {
                    500: '#8B5CF6',
                },
                primary: {
                    500: '#3B82F6',
                },
                dark: {
                    900: '#0f0f0f',
                    800: '#1c1c1c',
                },
            },
            screens: {
                xs: '475px',
                '3xl': '1920px',
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '4rem',
                    xl: '5rem',
                },
            },
            blur: {
                xs: '2px',
                '4xl': '72px',
            },
            width: {
                wallet: '160px',
            },
            dropShadow: {
                cyber: '0 0 10px rgba(20, 184, 166, 0.25)',
                glow: '0 0 10px rgba(139, 92, 246, 0.25)',
            },
            backgroundImage: {
                'cyber-grid': 'radial-gradient(#14B8A6 0.5px, transparent 0.5px)',
            },
            animation: {
                flicker: 'flicker 2s infinite ease-in-out',
                float: 'float 6s ease-in-out infinite',
            },
            keyframes: {
                flicker: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.4' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
            },
        },
    },
    plugins: [typography, forms],
}

export default config
