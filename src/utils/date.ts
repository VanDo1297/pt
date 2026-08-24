const WEEKDAY = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

/** Tên thứ tiếng Anh của một ngày (khớp với `day` trong plan). */
export function weekdayName(d: Date): string {
  return WEEKDAY[d.getDay()]
}

/** Ngày đầu tuần (Thứ 2) chứa ngày `d`. */
export function startOfWeek(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const mondayOffset = (r.getDay() + 6) % 7
  r.setDate(r.getDate() - mondayOffset)
  return r
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Chuỗi ngày dạng YYYY-MM-DD (dùng làm khoá lưu). */
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Định dạng thời lượng: HH:MM:SS hoặc MM:SS. */
export function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${pad(m)}:${pad(sec)}`
    : `${pad(m)}:${pad(sec)}`
}
