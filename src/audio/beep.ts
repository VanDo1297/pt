let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

/** Mở khoá audio — phải gọi trong một thao tác chạm của người dùng. */
export function unlockAudio(): void {
  const c = getCtx()
  if (c && c.state === 'suspended') void c.resume()
}

/** Một tiếng beep ngắn tại thời điểm `at`, tần số `freq`. */
function tone(c: AudioContext, at: number, freq: number, dur: number, vol = 0.4): void {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, at)
  gain.gain.linearRampToValueAtTime(vol, at + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(at)
  osc.stop(at + dur + 0.02)
}

/** Tiếng "tick" ngắn cho mỗi giây đếm ngược (5→1). */
export function playTick(): void {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  tone(c, c.currentTime, 660, 0.12)
}

/** Tiếng báo hết giờ nghỉ (cao & dài hơn) tại mốc 0s. */
export function playBeep(): void {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  tone(c, c.currentTime, 1040, 0.45, 0.5)
}
