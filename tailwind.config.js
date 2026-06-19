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
      boxShadow: {
        soft: '0 12px 30px rgba(120,90,40,.16)',
        card: '0 12px 20px rgba(60,46,24,.05)',
        lift: '0 16px 30px rgba(60,46,24,.09)'
      },
      spacing: { section: '3rem' },
      fontSize: {
        kicker: ['.74rem', { lineHeight: '1rem', letterSpacing: '.22em', fontWeight: '700' }],
        lead: ['1.125rem', { lineHeight: '1.75rem' }],
        display: ['clamp(2.3rem,5vw,3.6rem)', { lineHeight: '1.08', letterSpacing: '-.02em' }],
        h1: ['2rem', { lineHeight: '2.4rem', letterSpacing: '-.01em' }],
        h2: ['1.5rem', { lineHeight: '1.95rem' }],
        h3: ['1.2rem', { lineHeight: '1.55rem' }]
      },
      keyframes: {
        fade: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        twinkle: { from: { opacity: .18 }, to: { opacity: .5 } }
      },
      animation: { fade: 'fade .4s ease', twinkle: 'twinkle 7s ease-in-out infinite alternate' }
    }
  },
  plugins: []
}
