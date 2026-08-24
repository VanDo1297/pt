import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { playBeep, playTick } from '../audio/beep'
import { RestTimerContext, type RestTimerValue } from './restTimerContext'

const REST_KEY = 'ptplan:rest'
const DEFAULT_REST = 90

function readDefault(): number {
  try {
    const raw = localStorage.getItem(REST_KEY)
    const n = raw ? parseInt(raw, 10) : NaN
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_REST
  } catch {
    return DEFAULT_REST
  }
}

export function RestTimerProvider({ children }: { children: ReactNode }) {
  const [endAt, setEndAtState] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [defaultSec, setDefaultSec] = useState<number>(() => readDefault())

  // ref đồng bộ để đọc trong handler mà không dính giá trị cũ
  const endAtRef = useRef<number | null>(null)
  const totalRef = useRef(0)
  // giây cuối đã phát beep, tránh phát lặp trong cùng 1 giây (tick chạy 4 lần/giây)
  const lastBeepRef = useRef<number | null>(null)

  const setEndAt = (v: number | null) => {
    endAtRef.current = v
    setEndAtState(v)
  }

  useEffect(() => {
    if (endAt == null) return
    const tick = () => {
      const rem = Math.ceil((endAt - Date.now()) / 1000)
      if (rem <= 0) {
        setRemaining(0)
        setEndAt(null)
        if (lastBeepRef.current !== 0) {
          lastBeepRef.current = 0
          playBeep() // báo hết giờ tại 0s
        }
      } else {
        setRemaining(rem)
        // beep đếm ngược 5,4,3,2,1 — mỗi giây một lần
        if (rem <= 5 && lastBeepRef.current !== rem) {
          lastBeepRef.current = rem
          playTick()
        }
      }
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [endAt])

  const start = useCallback(
    (sec?: number) => {
      const s = sec ?? defaultSec
      totalRef.current = s
      lastBeepRef.current = null
      setRemaining(s)
      setEndAt(Date.now() + s * 1000)
    },
    [defaultSec],
  )

  const skip = useCallback(() => {
    lastBeepRef.current = null
    setEndAt(null)
    setRemaining(0)
  }, [])

  const add = useCallback((sec: number) => {
    totalRef.current += sec
    lastBeepRef.current = null
    const base = endAtRef.current ?? Date.now()
    setEndAt(base + sec * 1000)
  }, [])

  const setDefault = useCallback((sec: number) => {
    setDefaultSec(sec)
    try {
      localStorage.setItem(REST_KEY, String(sec))
    } catch {
      // bỏ qua
    }
    // Nếu đang nghỉ: đổi hiệp hiện tại sang tổng mới, giữ nguyên phần đã trôi
    if (endAtRef.current != null) {
      const now = Date.now()
      const remNow = Math.ceil((endAtRef.current - now) / 1000)
      const elapsed = Math.max(0, totalRef.current - remNow)
      const newRem = sec - elapsed
      totalRef.current = sec
      lastBeepRef.current = null
      if (newRem <= 0) {
        setRemaining(0)
        setEndAt(null)
        playBeep()
      } else {
        setRemaining(newRem)
        setEndAt(now + newRem * 1000)
      }
    }
  }, [])

  const value = useMemo<RestTimerValue>(
    () => ({
      remaining,
      running: endAt != null,
      defaultSec,
      start,
      skip,
      add,
      setDefault,
    }),
    [remaining, endAt, defaultSec, start, skip, add, setDefault],
  )

  return (
    <RestTimerContext.Provider value={value}>{children}</RestTimerContext.Provider>
  )
}
