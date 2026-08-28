/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#97d700",
        "primary-glow": "#b2f432",
        "primary-container": "#97d700",
        "on-primary": "#233600",
        "on-primary-container": "#3d5900",
        "cyber-blue": "#00E5FF",
        "secondary": "#bdf4ff",
        "on-secondary": "#00363d",
        "secondary-container": "#00e3fd",
        "warning-amber": "#FFAB00",
        "tertiary": "#ffdaab",
        "on-tertiary": "#452b00",
        "tertiary-container": "#ffb644",
        "surface": "#131313",
        "surface-charcoal": "#1A1C1E",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "surface-bright": "#393939",
        "background": "#131313",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c2caaf",
        "outline": "#8c947b",
        "outline-variant": "#424935",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "border-cyan": "rgba(0, 229, 255, 0.2)",
        "surface-glass": "rgba(255, 255, 255, 0.03)"
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'scan-line': 'scan 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cyber-radar': 'radar 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)' },
          '50%': { opacity: 0.3, boxShadow: '0 0 5px rgba(0, 229, 255, 0.1)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
