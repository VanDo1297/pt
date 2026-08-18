import type { WorkoutSession } from '../types/workout'
import { SessionAccordion } from './DayAccordion'

interface WorkoutPlanListProps {
  sessions: WorkoutSession[]
  openSessionId: string | null
  onToggleSession: (sessionId: string) => void
  onSelectExercise: (sessionId: string, exerciseId: string) => void
}

export function WorkoutPlanList({
  sessions,
  openSessionId,
  onToggleSession,
  onSelectExercise,
}: WorkoutPlanListProps) {
  // Gom các buổi theo ngày để hiển thị tiêu đề ngày một lần
  const days: { day: string; items: WorkoutSession[] }[] = []
  for (const s of sessions) {
    const last = days[days.length - 1]
    if (last && last.day === s.day) last.items.push(s)
    else days.push({ day: s.day, items: [s] })
  }

  return (
    <div className="workout-plan">
      <header className="workout-plan__header">
        <h1>Kế hoạch tập</h1>
        <p>Thứ 2 → Thứ 7 · Sáng &amp; Tối · Lặp lại mỗi tuần</p>
      </header>

      <div className="workout-plan__days">
        {days.map(({ day, items }) => (
          <section key={day} className="day-group">
            <h2 className="day-group__title">
              {day}
              {items[0]?.tag && <span className="day-group__tag">{items[0].tag}</span>}
            </h2>
            {items.map((session) => (
              <SessionAccordion
                key={session.id}
                session={session}
                isOpen={openSessionId === session.id}
                onToggle={() => onToggleSession(session.id)}
                onSelectExercise={(exerciseId) =>
                  onSelectExercise(session.id, exerciseId)
                }
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
