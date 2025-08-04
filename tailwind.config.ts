import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-primary-500',
    'text-accent-500',
    'bg-background',
    'text-foreground',
    'border-border',
    'bg-card',
    'text-card-foreground',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

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
          800: '#1c1c1c',
          900: '#0f0f0f',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
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
};

export default config;

