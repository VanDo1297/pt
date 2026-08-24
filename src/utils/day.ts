const DAY_LABELS: Record<string, string> = {
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ nhật',
}

const DAY_SHORT: Record<string, string> = {
  Monday: 'T2',
  Tuesday: 'T3',
  Wednesday: 'T4',
  Thursday: 'T5',
  Friday: 'T6',
  Saturday: 'T7',
  Sunday: 'CN',
}

/** Chuyển tên thứ tiếng Anh sang nhãn tiếng Việt để hiển thị. */
export function dayLabel(day: string): string {
  return DAY_LABELS[day] ?? day
}

/** Nhãn ngắn cho lịch tuần, vd "T2", "CN". */
export function dayShort(day: string): string {
  return DAY_SHORT[day] ?? day
}
