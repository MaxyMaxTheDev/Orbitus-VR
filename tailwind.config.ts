
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-chakra-petch)', 'sans-serif'],
        headline: ['var(--font-orbitron)', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'spin-slow': {
            'to': { transform: 'rotate(360deg)' }
        },
        'scanline': {
          '0%': { transform: 'translateY(-10%)' },
          '100%': { transform: 'translateY(110%)' },
        },
        'glitch-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.9) skew(5deg, 5deg)',
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.02) skew(0, 0)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) skew(0, 0)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          },
        },
        'glitch-out': {
          '0%': { 
            opacity: '1',
            transform: 'scale(1) skew(0, 0)',
          },
          '50%': { 
            opacity: '0.5',
            transform: 'scale(1.02) skew(-5deg, -5deg)',
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.9)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'spin-slow': 'spin-slow 10s linear infinite',
        'scanline': 'scanline 10s linear infinite',
        'glitch-in': 'glitch-in 0.5s ease-out forwards',
        'glitch-out': 'glitch-out 0.3s ease-in forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
