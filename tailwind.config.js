/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: ['h-Kim', 'h-Mộc', 'h-Thủy', 'h-Hỏa', 'h-Thổ'],
  theme: {
    extend: {
      colors: {
        ink: '#0e0b1f',
        ink2: '#161235',
        gold: { DEFAULT: '#e7c873', soft: '#c9a24a' },
        plum: { DEFAULT: '#9b80e8' },
        cream: '#eceaf6',
        muted: '#a89fce'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      maxWidth: { content: '1120px' },
      boxShadow: { soft: '0 18px 48px rgba(0,0,0,.45)' },
      keyframes: {
        fade: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        twinkle: { from: { opacity: .45 }, to: { opacity: .95 } }
      },
      animation: { fade: 'fade .4s ease', twinkle: 'twinkle 7s ease-in-out infinite alternate' }
    }
  },
  plugins: []
}
