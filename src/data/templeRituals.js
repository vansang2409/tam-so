export const BOW_DURATION=12000
const clamp=n=>Math.max(0,Math.min(1,n))
const smooth=n=>{const t=clamp(n);return t*t*(3-2*t)}
// Ba nhịp: chắp tay, cúi/chạm trán gần sàn, nâng người về tư thế quỳ.
export function bowFrame(progress) {
  const p=clamp(Number.isFinite(progress)?progress:0),phase=p===1?1:p*3%1
  const amount=phase<.18?0:phase<.45?smooth((phase-.18)/.27):phase<.62?1:phase<.9?1-smooth((phase-.62)/.28):0
  return {amount,number:Math.min(3,Math.floor(p*3)+1),finished:p===1}
}
export const meditationSeconds=(end,now=Date.now())=>Math.max(0,Math.ceil((end-now)/1000))
