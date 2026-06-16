/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: ['h-Kim', 'h-Mộc', 'h-Thủy', 'h-Hỏa', 'h-Thổ'],
  theme: {
    extend: {
      colors: {
        ink: '#1b1206',
        ink2: '#2a1d0d',
        gold: { DEFAULT: '#d3a24e', soft: '#a9772f' },
        clay: { DEFAULT: '#c47648' },
        plum: { DEFAULT: '#c47648' },
        cream: '#efe7d6',
        muted: '#b8a98c'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      maxWidth: { content: '1120px' },
      boxShadow: { soft: '0 18px 48px rgba(0,0,0,.5)' },
      keyframes: {
        fade: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        twinkle: { from: { opacity: .45 }, to: { opacity: .95 } }
      },
      animation: { fade: 'fade .4s ease', twinkle: 'twinkle 7s ease-in-out infinite alternate' }
    }
  },
  plugins: []
}
