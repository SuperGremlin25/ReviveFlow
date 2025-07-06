module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        accent: {
          DEFAULT: '#a855f7', // purple-500
          dark: '#7c3aed',   // purple-600
        },
        bg: {
          dark: '#18181b',   // zinc-900
          card: '#23232a',
        }
      },
      boxShadow: {
        glass: '0 4px 32px rgba(80,80,120,0.15)',
      },
    },
  },
  plugins: [],
};
