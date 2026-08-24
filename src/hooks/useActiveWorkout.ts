import { useCallback, useEffect, useState } from 'react'

const KEY = 'ptplan:active'

interface ActiveWorkout {
  dateStr: string
  day: string
  /** Mốc thời điểm (epoch ms) bắt đầu tính cho đoạn đang chạy hiện tại */
  startedAt: number
  /** Số giây đã tích luỹ từ các đoạn trước (trước khi pause) */
  accumulatedSec: number
  running: boolean
}

function read(): ActiveWorkout | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ActiveWorkout) : null
  } catch {
    return null
  }
}

function write(a: ActiveWorkout | null): void {
  try {
    if (a) localStorage.setItem(KEY, JSON.stringify(a))
    else localStorage.removeItem(KEY)
  } catch {
    // bỏ qua
  }
}

function elapsed(a: ActiveWorkout | null): number {
  if (!a) return 0
  const live = a.running ? (Date.now() - a.startedAt) / 1000 : 0
  return Math.floor(a.accumulatedSec + live)
}

/** Quản lý buổi tập đang diễn ra (timer đếm lên), lưu localStorage để sống qua refresh. */
export function useActiveWorkout() {
  const [active, setActive] = useState<ActiveWorkout | null>(() => read())
  const [, setTick] = useState(0)

  // Cập nhật hiển thị mỗi giây khi đang chạy
  useEffect(() => {
    if (!active?.running) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [active?.running])

  const apply = (a: ActiveWorkout | null) => {
    write(a)
    setActive(a)
  }

  const start = useCallback((dateStr: string, day: string) => {
    apply({ dateStr, day, startedAt: Date.now(), accumulatedSec: 0, running: true })
  }, [])

  const pause = useCallback(() => {
    setActive((a) => {
      if (!a || !a.running) return a
      const next: ActiveWorkout = {
        ...a,
        accumulatedSec: a.accumulatedSec + (Date.now() - a.startedAt) / 1000,
        running: false,
      }
      write(next)
      return next
    })
  }, [])

  const resume = useCallback(() => {
    setActive((a) => {
      if (!a || a.running) return a
      const next: ActiveWorkout = { ...a, startedAt: Date.now(), running: true }
      write(next)
      return next
    })
  }, [])

  const stop = useCallback(() => apply(null), [])

  return {
    active,
    elapsedSec: elapsed(active),
    start,
    pause,
    resume,
    stop,
  }
}
