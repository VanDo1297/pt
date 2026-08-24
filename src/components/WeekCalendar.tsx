import type { WorkoutDay } from '../types/workout'
import { addDays, isSameDay, weekdayName } from '../utils/date'
import { dayShort } from '../utils/day'

interface WeekCalendarProps {
  /** Thứ 2 của tuần đang hiển thị */
  weekStart: Date
  today: Date
  selected: Date
  workoutByDay: Record<string, WorkoutDay>
  /** Ngày này đã có buổi tập lưu lại chưa */
  isCompleted: (date: Date) => boolean
  onSelect: (day: Date) => void
}

export function WeekCalendar({
  weekStart,
  today,
  selected,
  workoutByDay,
  isCompleted,
  onSelect,
}: WeekCalendarProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="week-cal" role="group" aria-label="Lịch tuần">
      {days.map((date) => {
        const wd = weekdayName(date)
        const hasWorkout = Boolean(workoutByDay[wd])
        const isToday = isSameDay(date, today)
        const isSelected = isSameDay(date, selected)
        const done = isCompleted(date)

        return (
          <button
            key={date.toISOString()}
            type="button"
            className={[
              'week-cal__day',
              isSelected ? 'week-cal__day--selected' : '',
              isToday ? 'week-cal__day--today' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(date)}
            aria-pressed={isSelected}
          >
            <span className="week-cal__dow">{dayShort(wd)}</span>
            <span className="week-cal__date">{date.getDate()}</span>
            {done ? (
              <span className="week-cal__mark" aria-label="Đã tập">
                ✓
              </span>
            ) : (
              <span
                className={`week-cal__dot${hasWorkout ? ' week-cal__dot--on' : ''}`}
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
