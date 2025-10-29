import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#008080',
          dark: '#00a3a3',
        },
        accent: '#e59b25',
        text: {
          DEFAULT: '#2e2f30',
          dark: '#eaeaea',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#121212',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'Poppins',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.25rem',
          md: '2rem',
          lg: '2.5rem',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
