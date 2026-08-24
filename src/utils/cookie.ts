import type { WorkoutSessionRecord } from '../types/workout'

const SESSION_DAYS = 30
const SESSION_PREFIX = 'ptplan_s_'

function setCookie(name: string, value: string, days: number): void {
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; samesite=lax`
}

function getCookie(name: string): string | null {
  const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')
  const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

/** Lưu buổi tập của một ngày (cookie, hết hạn sau 30 ngày). */
export function saveSession(dateStr: string, record: WorkoutSessionRecord): void {
  setCookie(SESSION_PREFIX + dateStr, JSON.stringify(record), SESSION_DAYS)
}

/** Đọc buổi tập đã lưu của một ngày, hoặc null nếu chưa có. */
export function loadSession(dateStr: string): WorkoutSessionRecord | null {
  const raw = getCookie(SESSION_PREFIX + dateStr)
  if (!raw) return null
  try {
    return JSON.parse(raw) as WorkoutSessionRecord
  } catch {
    return null
  }
}

/** Có buổi tập đã lưu cho ngày này không. */
export function hasSession(dateStr: string): boolean {
  return getCookie(SESSION_PREFIX + dateStr) !== null
}
