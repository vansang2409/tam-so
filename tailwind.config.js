/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: ['h-Kim', 'h-Mộc', 'h-Thủy', 'h-Hỏa', 'h-Thổ'],
  theme: {
    extend: {
      colors: {
        // Clean-SaaS light: bề mặt trắng, chữ slate, nhấn hổ phách (giữ chất Tam Sở)
        ink: '#ffffff',      // bề mặt chính (card)
        ink2: '#f8fafc',     // bề mặt phụ (slate-50)
        gold: { DEFAULT: '#b45309', soft: '#d97706' },  // amber-700 / amber-600 — nhấn
        clay: { DEFAULT: '#d97706' },
        plum: { DEFAULT: '#7c3aed' },   // tím nhẹ cho điểm nhấn phụ (huyền học hiện đại)
        cream: '#0f172a',    // CHỮ CHÍNH (slate-900)
        muted: '#64748b'     // chữ phụ (slate-500)
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      maxWidth: { content: '1120px' },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,.04), 0 4px 16px -8px rgba(15,23,42,.12)',
        card: '0 1px 2px rgba(15,23,42,.05), 0 1px 3px rgba(15,23,42,.04)',
        lift: '0 12px 32px -12px rgba(15,23,42,.18)'
      },
      spacing: { section: '4rem' },
      borderRadius: { xl2: '1.25rem' },
      fontSize: {
        kicker: ['.72rem', { lineHeight: '1rem', letterSpacing: '.18em', fontWeight: '700' }],
        lead: ['1.15rem', { lineHeight: '1.75rem' }],
        display: ['clamp(2.4rem,5.5vw,3.8rem)', { lineHeight: '1.04', letterSpacing: '-.035em', fontWeight: '700' }],
        h1: ['2.1rem', { lineHeight: '2.4rem', letterSpacing: '-.025em', fontWeight: '700' }],
        h2: ['1.55rem', { lineHeight: '2rem', letterSpacing: '-.02em', fontWeight: '700' }],
        h3: ['1.18rem', { lineHeight: '1.55rem', letterSpacing: '-.01em', fontWeight: '600' }]
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
