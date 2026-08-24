import { createContext, useContext } from 'react'

export interface RestTimerValue {
  remaining: number
  running: boolean
  defaultSec: number
  /** Bắt đầu nghỉ (mặc định dùng defaultSec) */
  start: (sec?: number) => void
  skip: () => void
  add: (sec: number) => void
  setDefault: (sec: number) => void
}

export const RestTimerContext = createContext<RestTimerValue | null>(null)

export function useRestTimer(): RestTimerValue {
  const ctx = useContext(RestTimerContext)
  if (!ctx) throw new Error('useRestTimer phải dùng trong RestTimerProvider')
  return ctx
}
