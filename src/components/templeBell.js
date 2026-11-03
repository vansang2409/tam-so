// Start at contact with the existing immediate sound cue, then recoil and settle.
// Positive travel is bounded by the .1 rad contact angle used by the bell geometry.
export function templeBellAngle(elapsed,{reduced=false}={}) {
  if(reduced||!Number.isFinite(elapsed)||elapsed<0||elapsed>8)return 0
  return .1*Math.exp(-elapsed*2)*Math.cos(elapsed*3)
}
