/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: 'var(--bg-deep)',
          panel: 'var(--bg-panel)',
          surface: 'var(--surface)',
          border: 'var(--border)',
          'border-strong': 'var(--border-strong)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          soft: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        amber: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        coral: 'var(--accent-coral)',
        teal: 'var(--accent-teal)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}