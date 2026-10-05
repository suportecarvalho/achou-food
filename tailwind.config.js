/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
      },
      colors: {
        // Design System - Brand
        'red-base': '#8F141F',
        'red-dark': '#6E0E17',
        'red-transparent_30': 'rgba(143, 20, 31, 0.30)',
        
        // Feedback
        'success-base': '#069F62',
        'success-transparent_20': 'rgba(6, 159, 98, 0.20)',

        // Grayscale
        'gray-100': '#FAFAFA',
        'gray-200': '#EBEBEB',
        'gray-300': '#E0DCDC',
        'gray-400': '#5C5656',
        'gray-500': '#423A3A',
        'gray-600': '#1F1818',

        // Transparent & Gradients
        'gray-transparent_20': 'rgba(219, 219, 219, 0.20)',
        'gray-transparent_40': 'rgba(240, 240, 240, 0.40)',
        'gray-transparent_80': 'rgba(240, 240, 240, 0.80)',

        // shadcn/ui semantic tokens mapped to design system
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#8F141F',
          foreground: '#FFFFFF',
          dark: '#6E0E17',
        },
        secondary: {
          DEFAULT: '#EBEBEB',
          foreground: '#1F1818',
        },
        destructive: {
          DEFAULT: '#8F141F',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#FAFAFA',
          foreground: '#5C5656',
        },
        accent: {
          DEFAULT: 'rgba(143, 20, 31, 0.10)',
          foreground: '#8F141F',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F1818',
        },
      },
      fontSize: {
        'title-lg': ['18px', { lineHeight: '140%', fontWeight: '600' }],
        'title-md': ['16px', { lineHeight: '140%', fontWeight: '600' }],
        'title-sm': ['14px', { lineHeight: '140%', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '140%', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '140%', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '140%', fontWeight: '400' }],
        'label-xs': ['12px', { lineHeight: '140%', fontWeight: '600' }],
        'label-2xs': ['10px', { lineHeight: '140%', fontWeight: '600' }],
      },
      backgroundImage: {
        'white-gradient': 'linear-gradient(163deg, #FFF 12.36%, rgba(255, 255, 255, 0.60) 32.02%, rgba(255, 255, 255, 0.25) 38.89%, rgba(255, 255, 255, 0.08) 51.76%, rgba(255, 255, 255, 0.60) 58.23%, rgba(255, 255, 255, 0.80) 77.89%)',
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(31, 24, 24, 0.06)',
        'tab-bar': '0 8px 30px rgba(31, 24, 24, 0.12)',
        'pill': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '12px',
        'sm': '8px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}
