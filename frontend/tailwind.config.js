/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#3B82F6',
        accent: '#F97316',
        background: '#FAFAF8',
        foreground: '#1E293B',
        status: {
          applied: '#3B82F6',
          interview: '#F59E0B',
          offer: '#22C55E',
          rejected: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
};
