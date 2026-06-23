import { useId } from 'react'

/* TempleScene — cảnh "Chùa An Lạc" vẽ thuần bằng SVG (KHÔNG dùng ảnh chụp/bản quyền).
 * Tự sinh từ code: trời theo tông (dawn/day/dusk/gold), núi, cây, sân và công trình
 * thay đổi theo từng khu (scene). Mỗi instance có id gradient riêng để không đụng nhau. */

const TONES = {
  dawn: { t: '#241f3a', m: '#7c5a6e', b: '#f0b389', sun: '#ffe2b0', glow: '#ff9d5c', mtn: '#3a3550', mtn2: '#4d4566', haze: '#f0b389' },
  day:  { t: '#274b73', m: '#5a86b0', b: '#cfe6f4', sun: '#fff6dd', glow: '#ffeebb', mtn: '#33566b', mtn2: '#436277', haze: '#dcecf6' },
  dusk: { t: '#170f2c', m: '#3d2a55', b: '#8a5f88', sun: '#e6d2ff', glow: '#a888d8', mtn: '#221a38', mtn2: '#2f2447', haze: '#7a5688' },
  gold: { t: '#2a1a0f', m: '#7a4f24', b: '#eaa84e', sun: '#ffe9a8', glow: '#ffc25c', mtn: '#3a2a18', mtn2: '#4d3a22', haze: '#eaa84e' }
}

// một tầng mái cong (upturned eaves)
function roofPath(cx, baseY, halfW, h, ridgeHalf) {
  const topY = baseY - h
  const tipY = baseY - h * 0.06
  return `M ${cx - halfW},${tipY}
    Q ${cx - halfW + h * 0.5},${tipY + h * 0.10} ${cx - halfW + h * 0.45},${baseY}
    Q ${cx - halfW * 0.5},${topY + h * 0.28} ${cx - ridgeHalf},${topY}
    L ${cx + ridgeHalf},${topY}
    Q ${cx + halfW * 0.5},${topY + h * 0.28} ${cx + halfW - h * 0.45},${baseY}
    Q ${cx + halfW - h * 0.5},${tipY + h * 0.10} ${cx + halfW},${tipY}
    Q ${cx},${baseY - h * 0.04} ${cx - halfW},${tipY} Z`
}

function Roof({ cx, baseY, halfW, h, ridgeHalf, roof, roofHi, gold }) {
  return (
    <g>
      <path d={roofPath(cx, baseY, halfW, h, ridgeHalf)} fill={roof} stroke={roofHi} strokeWidth="1.5" />
      {/* dải ngói sáng dọc sống mái */}
      <path d={roofPath(cx, baseY - h * 0.5, halfW * 0.62, h * 0.5, ridgeHalf)} fill={roofHi} opacity="0.5" />
      {/* viền vàng mép mái */}
      <path d={`M ${cx - halfW},${baseY - h * 0.06} Q ${cx},${baseY + h * 0.02} ${cx + halfW},${baseY - h * 0.06}`} fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      {/* chóp lưỡng long / bầu */}
      <circle cx={cx} cy={baseY - h - 6} r="5" fill={gold} />
    </g>
  )
}

function Hall({ cx, baseY, w, palette }) {
  const { wood, woodDk, col, gold, roof, roofHi, stone, stoneDk, doorGlow } = palette
  const bodyTop = baseY - 78, bodyH = 78
  const half = w / 2
  return (
    <g>
      {/* nền bệ đá */}
      <rect x={cx - half - 26} y={baseY} width={w + 52} height="20" rx="3" fill={stoneDk} />
      <rect x={cx - half - 14} y={baseY - 6} width={w + 28} height="10" fill={stone} />
      {/* thân điện */}
      <rect x={cx - half} y={bodyTop} width={w} height={bodyH} fill={wood} />
      <rect x={cx - half} y={bodyTop} width={w} height={bodyH} fill="url(#shade)" opacity="0.25" />
      {/* cột */}
      {[-0.82, -0.45, 0.45, 0.82].map((f, i) => (
        <rect key={i} x={cx + f * half - 5} y={bodyTop} width="10" height={bodyH} fill={col} />
      ))}
      {/* cửa giữa phát sáng */}
      <rect x={cx - 30} y={bodyTop + 12} width="60" height={bodyH - 12} rx="4" fill="url(#door)" />
      <rect x={cx - 30} y={bodyTop + 12} width="60" height={bodyH - 12} rx="4" fill="none" stroke={gold} strokeWidth="2" />
      {/* mái dưới (rộng) + mái trên */}
      <Roof cx={cx} baseY={bodyTop + 6} halfW={half + 44} h={46} ridgeHalf={half * 0.34} roof={roof} roofHi={roofHi} gold={gold} />
      <Roof cx={cx} baseY={bodyTop - 30} halfW={half * 0.78} h={40} ridgeHalf={half * 0.2} roof={roof} roofHi={roofHi} gold={gold} />
      {/* bậc thềm */}
      <polygon points={`${cx - 40},${baseY} ${cx + 40},${baseY} ${cx + 56},${baseY + 18} ${cx - 56},${baseY + 18}`} fill={stone} stroke={stoneDk} strokeWidth="1" />
    </g>
  )
}

function Tower({ cx, baseY, palette }) {
  const { wood, gold, roof, roofHi, stone, stoneDk, doorGlow } = palette
  const tiers = 5
  let y = baseY
  const out = []
  out.push(<rect key="base" x={cx - 46} y={baseY} width="92" height="16" rx="3" fill={stoneDk} />)
  for (let i = 0; i < tiers; i++) {
    const bw = 70 - i * 9
    const bh = 30 - i * 1.5
    out.push(<rect key={'b' + i} x={cx - bw / 2} y={y - bh} width={bw} height={bh} fill={wood} opacity={0.92} />)
    out.push(<rect key={'d' + i} x={cx - 7} y={y - bh + 4} width="14" height={bh - 6} rx="2" fill="url(#door)" />)
    out.push(<g key={'r' + i}><Roof cx={cx} baseY={y - bh + 4} halfW={bw / 2 + 16} h={20} ridgeHalf={bw * 0.16} roof={roof} roofHi={roofHi} gold={gold} /></g>)
    y -= bh + 16
  }
  out.push(<circle key="fin" cx={cx} cy={y + 2} r="6" fill={gold} />)
  // quả chuông treo gợi ý (tầng dưới)
  out.push(<path key="bell" d={`M ${cx - 9},${baseY - 26} q 0,-12 9,-12 q 9,0 9,12 z`} fill={gold} opacity="0.9" />)
  return <g>{out}</g>
}

function Gate({ cx, baseY, w, palette }) {
  const { wood, woodDk, gold, roof, roofHi, stone, stoneDk } = palette
  const half = w / 2
  const bodyTop = baseY - 64
  return (
    <g>
      <rect x={cx - half - 18} y={baseY} width={w + 36} height="16" rx="3" fill={stoneDk} />
      <rect x={cx - half} y={bodyTop} width={w} height="64" fill={wood} />
      {/* 4 trụ chia 3 lối */}
      {[-1, -0.34, 0.34, 1].map((f, i) => (
        <rect key={i} x={cx + f * half - 7} y={bodyTop} width="14" height="64" fill={woodDk} />
      ))}
      {/* 3 cửa vòm */}
      <rect x={cx - 26} y={bodyTop + 14} width="52" height="50" rx="22" fill="url(#door)" />
      <rect x={cx - half + 14} y={bodyTop + 24} width="34" height="40" rx="16" fill="url(#door)" opacity="0.8" />
      <rect x={cx + half - 48} y={bodyTop + 24} width="34" height="40" rx="16" fill="url(#door)" opacity="0.8" />
      {/* mái: 1 lớn giữa + 2 nhỏ hai bên */}
      <Roof cx={cx - half + 31} baseY={bodyTop + 2} halfW={48} h={26} ridgeHalf={14} roof={roof} roofHi={roofHi} gold={gold} />
      <Roof cx={cx + half - 31} baseY={bodyTop + 2} halfW={48} h={26} ridgeHalf={14} roof={roof} roofHi={roofHi} gold={gold} />
      <Roof cx={cx} baseY={bodyTop - 14} halfW={half * 0.7} h={40} ridgeHalf={half * 0.18} roof={roof} roofHi={roofHi} gold={gold} />
    </g>
  )
}

function Statue({ cx, baseY, palette }) {
  const { gold } = palette
  const topY = baseY - 200
  return (
    <g>
      {/* hào quang */}
      <circle cx={cx} cy={topY + 26} r="40" fill="none" stroke={gold} strokeWidth="2" opacity="0.55" />
      <circle cx={cx} cy={topY + 26} r="52" fill="#fff" opacity="0.06" />
      {/* thân áo choàng */}
      <path d={`M ${cx},${topY + 14}
        C ${cx - 30},${topY + 30} ${cx - 40},${baseY - 60} ${cx - 46},${baseY - 8}
        L ${cx + 46},${baseY - 8}
        C ${cx + 40},${baseY - 60} ${cx + 30},${topY + 30} ${cx},${topY + 14} Z`}
        fill="#f3f0ea" stroke="#d8d2c4" strokeWidth="1.5" />
      {/* đầu */}
      <circle cx={cx} cy={topY + 16} r="15" fill="#f6f3ee" stroke="#d8d2c4" strokeWidth="1" />
      {/* tịnh bình / tay chắp */}
      <ellipse cx={cx} cy={baseY - 70} rx="9" ry="16" fill="#eceae3" />
      {/* đài sen */}
      <path d={`M ${cx - 54},${baseY - 8} Q ${cx},${baseY - 24} ${cx + 54},${baseY - 8} Q ${cx + 30},${baseY + 10} ${cx},${baseY + 10} Q ${cx - 30},${baseY + 10} ${cx - 54},${baseY - 8} Z`} fill="#e7d9b4" stroke="#cdbb8c" strokeWidth="1" />
    </g>
  )
}

function Pond({ cx, y }) {
  return (
    <g>
      <ellipse cx={cx} cy={y} rx="150" ry="36" fill="#3f7fa6" opacity="0.85" />
      <ellipse cx={cx} cy={y - 3} rx="150" ry="36" fill="none" stroke="#bfe0ef" strokeWidth="1.5" opacity="0.5" />
      {[[-70, 4], [40, -6], [90, 8], [-20, 10]].map(([dx, dy], i) => (
        <ellipse key={i} cx={cx + dx} cy={y + dy} rx="20" ry="6" fill="#3f8f5a" opacity="0.85" />
      ))}
      {[[-66, 2], [44, -8]].map(([dx, dy], i) => (
        <g key={'l' + i}>
          <circle cx={cx + dx} cy={y + dy - 3} r="6" fill="#f6b8d0" />
          <circle cx={cx + dx} cy={y + dy - 3} r="3" fill="#fde3ee" />
        </g>
      ))}
    </g>
  )
}

function ZenRocks({ cx, y }) {
  return (
    <g>
      {[0, 1, 2, 3].map(i => (
        <path key={i} d={`M ${cx - 90 + i * 60},${y} q 12,-22 30,0 z`} fill="#9aa0a6" stroke="#7a8086" strokeWidth="1" />
      ))}
      {[0, 1, 2].map(i => (
        <path key={'s' + i} d={`M ${cx - 150},${y + 14 + i * 9} Q ${cx},${y + 4 + i * 9} ${cx + 150},${y + 14 + i * 9}`} fill="none" stroke="#cfc6b4" strokeWidth="1" opacity="0.7" />
      ))}
    </g>
  )
}

function Lantern({ x, y }) {
  return (
    <g opacity="0.92">
      <rect x={x - 3} y={y + 14} width="6" height="16" fill="#9a9182" />
      <rect x={x - 10} y={y + 6} width="20" height="10" rx="2" fill="#b8b0a0" />
      <rect x={x - 8} y={y - 4} width="16" height="11" rx="2" fill="#cabfad" />
      <rect x={x - 7} y={y - 3} width="14" height="9" rx="1" fill="#ffcf7a" opacity="0.85" />
      <polygon points={`${x - 12},${y - 4} ${x + 12},${y - 4} ${x},${y - 16}`} fill="#a99f8c" />
    </g>
  )
}

function Censer({ cx, y }) {
  return (
    <g>
      {/* khói */}
      {[0, 1, 2].map(i => (
        <path key={i} d={`M ${cx - 6 + i * 6},${y - 18} q 8,-14 -2,-26 q -8,-12 4,-26`} fill="none" stroke="#e8edf3" strokeWidth="2" opacity="0.28" strokeLinecap="round" />
      ))}
      {/* que hương */}
      {[-7, 0, 7].map((dx, i) => (
        <g key={'h' + i}>
          <rect x={cx + dx - 1} y={y - 22} width="2" height="22" fill="#c9962f" />
          <circle cx={cx + dx} cy={y - 23} r="2.4" fill="#ff7a3c" />
        </g>
      ))}
      {/* lư hương 3 chân */}
      <path d={`M ${cx - 26},${y} h 52 l -7,22 h -38 z`} fill="#b9842f" stroke="#7c5614" strokeWidth="1.5" />
      <rect x={cx - 30} y={y - 6} width="60" height="8" rx="3" fill="#caa44a" />
      <rect x={cx - 22} y={y + 22} width="6" height="10" fill="#7c5614" />
      <rect x={cx + 16} y={y + 22} width="6" height="10" fill="#7c5614" />
    </g>
  )
}

function Tree({ x, y, s = 1, c = '#2f5a36' }) {
  return (
    <g>
      <rect x={x - 3 * s} y={y} width={6 * s} height={26 * s} fill="#5a4326" />
      <circle cx={x} cy={y - 6 * s} r={24 * s} fill={c} />
      <circle cx={x - 16 * s} cy={y + 2 * s} r={16 * s} fill={c} />
      <circle cx={x + 16 * s} cy={y + 2 * s} r={16 * s} fill={c} />
      <circle cx={x} cy={y - 16 * s} r={16 * s} fill={c} opacity="0.85" />
    </g>
  )
}

export default function TempleScene({ scene = 'dien', tone = 'day', bienHieu = '', className = '', style }) {
  const P = TONES[tone] || TONES.day
  const uid = useId().replace(/[:]/g, '')
  const pal = {
    wood: '#8a5230', woodDk: '#5e3720', col: '#9a6a44', gold: '#e3b54e',
    roof: '#7d3325', roofHi: '#a44a35', stone: '#d6cdba', stoneDk: '#a99f8c', doorGlow: '#ffcf7a'
  }
  const horizon = 300
  const moon = tone === 'dusk'
  // công trình chính theo scene
  const mainStruct = (() => {
    switch (scene) {
      case 'cong': return <Gate cx={500} baseY={360} w={300} palette={pal} />
      case 'thap': return <Tower cx={500} baseY={376} palette={pal} />
      case 'tuong': return (<g><Hall cx={290} baseY={352} w={200} palette={pal} /><Statue cx={680} baseY={404} palette={pal} /></g>)
      default: return <Hall cx={500} baseY={360} w={300} palette={pal} />
    }
  })()

  return (
    <svg viewBox="0 0 1000 600" className={className} style={style} preserveAspectRatio="xMidYMid slice" role="img"
      aria-label={'Minh hoạ ' + (bienHieu || 'Chùa An Lạc')}>
      <defs>
        <linearGradient id={'sky' + uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.t} />
          <stop offset="55%" stopColor={P.m} />
          <stop offset="100%" stopColor={P.b} />
        </linearGradient>
        <radialGradient id={'sun' + uid} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={P.sun} />
          <stop offset="40%" stopColor={P.glow} stopOpacity="0.7" />
          <stop offset="100%" stopColor={P.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe6a8" />
          <stop offset="100%" stopColor="#c8741f" />
        </linearGradient>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={'ground' + uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.haze} stopOpacity="0.5" />
          <stop offset="22%" stopColor="#bfb39a" />
          <stop offset="100%" stopColor="#8f836b" />
        </linearGradient>
        <radialGradient id={'vig' + uid} cx="50%" cy="46%" r="72%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.42" />
        </radialGradient>
      </defs>

      {/* trời */}
      <rect x="0" y="0" width="1000" height={horizon + 40} fill={`url(#sky${uid})`} />
      {/* mặt trời / trăng + quầng */}
      <circle cx="772" cy="132" r="120" fill={`url(#sun${uid})`} />
      <circle cx="772" cy="132" r={moon ? 28 : 34} fill={P.sun} opacity={moon ? 0.92 : 0.95} />
      {moon && <circle cx="784" cy="126" r="26" fill={P.m} opacity="0.9" />}
      {/* mây */}
      {[[180, 90, 1], [620, 70, 0.8], [430, 150, 0.7]].map(([x, y, o], i) => (
        <g key={i} opacity={0.5 * o}>
          <ellipse cx={x} cy={y} rx="70" ry="16" fill="#fff" />
          <ellipse cx={x + 44} cy={y + 6} rx="50" ry="13" fill="#fff" />
          <ellipse cx={x - 40} cy={y + 8} rx="44" ry="12" fill="#fff" />
        </g>
      ))}
      {/* núi xa */}
      <path d={`M 0,${horizon} L 150,235 L 320,290 L 480,210 L 660,285 L 840,230 L 1000,288 L 1000,${horizon + 40} L 0,${horizon + 40} Z`} fill={P.mtn2} opacity="0.7" />
      <path d={`M 0,${horizon + 6} L 220,262 L 420,300 L 600,255 L 820,300 L 1000,268 L 1000,${horizon + 40} L 0,${horizon + 40} Z`} fill={P.mtn} opacity="0.85" />

      {/* sân (đất + lát đá phối cảnh) */}
      <rect x="0" y={horizon} width="1000" height={600 - horizon} fill={`url(#ground${uid})`} />
      {[120, 250, 380].map((dy, i) => (
        <path key={i} d={`M 0,${horizon + dy} L 1000,${horizon + dy}`} stroke="#7a6e58" strokeWidth="1" opacity="0.4" />
      ))}
      {[-380, -150, 150, 380].map((dx, i) => (
        <path key={'v' + i} d={`M 500,${horizon} L ${500 + dx},600`} stroke="#7a6e58" strokeWidth="1" opacity="0.35" />
      ))}
      {/* lối chính giữa sáng hơn */}
      <polygon points={`455,${horizon} 545,${horizon} 650,600 350,600`} fill="#cdc2a8" opacity="0.5" />

      {/* hàng cây quanh sân */}
      <Tree x={120} y={300} s={1.25} c="#274d2d" />
      <Tree x={210} y={320} s={0.9} c="#2f5a36" />
      <Tree x={880} y={300} s={1.25} c="#274d2d" />
      <Tree x={800} y={322} s={0.9} c="#2f5a36" />

      {/* công trình chính */}
      {mainStruct}

      {/* props theo scene */}
      {scene === 'vuon' && <Pond cx={500} y={500} />}
      {scene === 'thien' && <ZenRocks cx={500} y={470} />}
      {scene !== 'vuon' && scene !== 'thien' && <Censer cx={500} y={462} />}
      <Lantern x={330} y={420} />
      <Lantern x={670} y={420} />

      {/* biển hiệu */}
      {bienHieu && (
        <g>
          <rect x="385" y="246" width="230" height="30" rx="5" fill="#3a1d10" stroke={pal.gold} strokeWidth="1.5" />
          <text x="500" y="266" textAnchor="middle" fontFamily="serif" fontSize="15" fontWeight="700" fill={pal.gold} letterSpacing="1.5">{bienHieu}</text>
        </g>
      )}

      <rect x="0" y="0" width="1000" height="600" fill={`url(#vig${uid})`} />
    </svg>
  )
}
