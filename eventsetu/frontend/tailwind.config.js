/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1B1F',
        paper: '#FAF8F5',
        card: '#FFFFFF',
        brand: {
          50: '#EAF1EE',
          100: '#CFE0D8',
          DEFAULT: '#2F5D50',
          light: '#3F7A69',
          dark: '#1E3E36',
        },
        accent: {
          50: '#FBF0E4',
          100: '#F4DCBC',
          DEFAULT: '#C9762C',
          dark: '#9C5A1F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,27,31,0.04), 0 8px 24px rgba(27,27,31,0.05)',
        'card-hover': '0 2px 6px rgba(27,27,31,0.06), 0 16px 32px rgba(27,27,31,0.09)',
      },
    },
  },
  plugins: [],
}
