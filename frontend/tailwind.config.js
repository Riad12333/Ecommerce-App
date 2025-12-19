/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D47A1', // Deep Blue
          light: '#1E40AF',
          dark: '#0a367a',
        },
        secondary: {
          DEFAULT: '#00B0FF', // Cyan / Light Blue
          hover: '#33C0FF',
        },
        accent: {
          DEFAULT: '#FFC107', // Amber / Orange
          hover: '#FFD54F',
        },
        background: {
          DEFAULT: '#F4F6FB', // Very light gray
          paper: '#FFFFFF',
        },
        text: {
          main: '#111827',
          secondary: '#6B7280',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      }
    },
  },
  plugins: [],
}

