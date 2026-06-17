/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: ['h-Kim', 'h-Mộc', 'h-Thủy', 'h-Hỏa', 'h-Thổ'],
  theme: {
    extend: {
      colors: {
        ink: '#efe2c4',
        ink2: '#f6eedb',
        gold: { DEFAULT: '#6e490e', soft: '#a9772f' },
        clay: { DEFAULT: '#c47648' },
        plum: { DEFAULT: '#c47648' },
        cream: '#33270f',
        muted: '#4d3c20'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      maxWidth: { content: '1120px' },
      boxShadow: { soft: '0 12px 30px rgba(120,90,40,.16)' },
      keyframes: {
        fade: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        twinkle: { from: { opacity: .18 }, to: { opacity: .5 } }
      },
      animation: { fade: 'fade .4s ease', twinkle: 'twinkle 7s ease-in-out infinite alternate' }
    }
  },
  plugins: []
}
