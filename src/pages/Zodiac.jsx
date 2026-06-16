import { useState } from 'react'
import { ZODIAC, getZodiac, zodiacCompat, LUCKY } from '../data/zodiac.js'

const elColor = { 'Lửa': 'h-Hỏa', 'Đất': 'h-Thổ', 'Khí': 'h-Kim', 'Nước': 'h-Thủy' }
const VC = { 'Rất hợp': 'text-emerald-300', 'Hợp': 'text-emerald-300', 'Cần dung hòa': 'text-pink-300', 'Trung bình': 'text-amber-200' }

export default function Zodiac() {
  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Chiêm tinh phương Tây</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Cung Hoàng Đạo</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">12 cung theo vị trí Mặt Trời lúc bạn sinh, gom thành 4 nguyên tố Lửa – Đất – Khí – Nước.</p>
      </section>

      <SignTool />
      <CompatTool />

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Toàn bộ 12 cung</h2>
        <p className="text-muted text-center max-w-[680px] mx-auto mb-7">Mốc ngày theo hệ phổ biến; người sinh sát ranh giới nên kiểm chứng theo năm cụ thể.</p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))' }}>
          {ZODIAC.map(z => (
            <div key={z.en} className="panel p-5">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[2rem]">{z.sym}</span>
                <div><div className="font-serif text-[1.2rem] text-cream">{z.ten}</div><div className="note">{z.from[1]}/{z.from[0]} – {z.to[1]}/{z.to[0]}</div></div>
              </div>
              <div className="flex gap-2 flex-wrap my-2"><span className={`pill ${elColor[z.nguyenTo]}`}>{z.nguyenTo}</span><span className="badge">{z.sao}</span></div>
              <p className="text-[.92rem] text-muted m-0">{z.net}</p>
              <p className="note mt-2 mb-0">Màu {LUCKY[z.en].mau} · Đá {LUCKY[z.en].da} · Số {LUCKY[z.en].so}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Lưu ý.</b> Chiêm tinh phương Tây là hệ thống biểu tượng – văn hóa, <b>không phải khoa học</b>. Mốc ngày có thể lệch ±1 ngày tùy năm;
          màu/đá/số may mắn theo quan niệm phổ biến, <span className="note">cần kiểm chứng thêm</span>.
        </div>
      </section>
    </>
  )
}

function SignTool() {
  const [d, setD] = useState(''); const [m, setM] = useState(''); const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const dd = +d, mm = +m
    if (!dd || !mm || dd < 1 || dd > 31 || mm < 1 || mm > 12) { setErr('Vui lòng nhập ngày và tháng hợp lệ.'); setRes(null); return }
    setErr(''); setRes(getZodiac(dd, mm))
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">① Xem cung của bạn</h2>
      <div className="panel p-[26px] max-w-[760px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <Field label="Ngày" value={d} set={setD} ph="16" /><Field label="Tháng" value={m} set={setM} ph="6" />
          <button className="btn btn-primary" onClick={calc}>♈ Xem cung</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade text-center">
            <div className="text-[3.4rem] leading-none">{res.sym}</div>
            <h3 className="text-[2rem] my-1">{res.ten} <span className="note">({res.en})</span></h3>
            <div className="flex gap-2 flex-wrap justify-center my-2"><span className={`pill ${elColor[res.nguyenTo]}`}>Nguyên tố {res.nguyenTo}</span><span className="badge">{res.sao}</span></div>
            <p className="max-w-[560px] mx-auto">{res.net}</p>
            <p className="note m-0">Màu may mắn {LUCKY[res.en].mau} · Đá {LUCKY[res.en].da} · Số {LUCKY[res.en].so}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function CompatTool() {
  const [d1, setD1] = useState(''); const [m1, setM1] = useState(''); const [d2, setD2] = useState(''); const [m2, setM2] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const a = getZodiac(+d1, +m1), b = getZodiac(+d2, +m2)
    if (!a || !b) { setErr('Vui lòng nhập đủ ngày/tháng của cả hai người.'); setRes(null); return }
    setErr(''); setRes(zodiacCompat(a, b))
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">② Tương hợp hai cung</h2>
      <div className="panel p-[26px] max-w-[760px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <Field label="Ngày (người 1)" value={d1} set={setD1} ph="16" /><Field label="Tháng" value={m1} set={setM1} ph="6" />
          <span className="text-gold pb-2">×</span>
          <Field label="Ngày (người 2)" value={d2} set={setD2} ph="23" /><Field label="Tháng" value={m2} set={setM2} ph="11" />
          <button className="btn btn-primary" onClick={calc}>💞 Xem hợp</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade text-center">
            <div className="flex items-center justify-center gap-4 flex-wrap mb-1">
              <span className="badge badge-gold">{res.a.sym} {res.a.ten}</span><span className="text-gold">×</span><span className="badge badge-gold">{res.b.sym} {res.b.ten}</span>
            </div>
            <div className={`font-serif text-[2.2rem] ${VC[res.verdict] || 'text-cream'}`}>{res.verdict}</div>
            <p className="max-w-[560px] mx-auto m-0">{res.note}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function Field({ label, value, set, ph }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={ph} className="field-input w-[110px]" /></div>)
}
