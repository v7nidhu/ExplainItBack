/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foundation: {
          DEFAULT: '#ffffff',
          pure: '#ffffff',
          subtle: '#fafafa',
          elevated: '#ffffff',
          dark: '#0c0c0d',
        },
        ink: {
          primary: '#0a0a0a',
          secondary: '#666666',
          muted: '#8c8c8c',
          faint: '#b3b3b3',
        },
        editorial: {
          border: '#e6e4df',
          borderSubtle: '#f0ede6',
          borderDark: '#262626',
          divider: '#eae7e1',
          accent: '#171717', // Restrained functional accent
          highlight: '#737373',
          warmGray: '#f7f6f3',
        }
      },
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'Georgia', 'serif'],
        sans: ['"Times New Roman"', 'Times', 'Georgia', 'serif'],
        mono: ['"Times New Roman"', 'Times', 'Georgia', 'serif'],
      },
      animation: {
        'fade-rise': 'fadeRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-rise-delay': 'fadeRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'fade-rise-delay-2': 'fadeRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeRise: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
