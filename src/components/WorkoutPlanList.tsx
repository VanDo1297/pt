import type { WorkoutDay } from '../types/workout'
import { DayAccordion } from './DayAccordion'

interface WorkoutPlanListProps {
  days: WorkoutDay[]
  openDayId: string | null
  onToggleDay: (dayId: string) => void
  onSelectExercise: (dayId: string, exerciseId: string) => void
}

export function WorkoutPlanList({
  days,
  openDayId,
  onToggleDay,
  onSelectExercise,
}: WorkoutPlanListProps) {
  return (
    <div className="workout-plan">
      <header className="workout-plan__header">
        <h1>Kế hoạch tập</h1>
        <p>Thứ 2 → Thứ 6 · Lặp lại mỗi tuần</p>
      </header>

      <div className="workout-plan__days">
        {days.map((day) => (
          <DayAccordion
            key={day.id}
            day={day}
            isOpen={openDayId === day.id}
            onToggle={() => onToggleDay(day.id)}
            onSelectExercise={(exerciseId) => onSelectExercise(day.id, exerciseId)}
          />
        ))}
      </div>
    </div>
  )
}
