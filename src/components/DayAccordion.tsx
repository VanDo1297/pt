import type { WorkoutSession } from '../types/workout'

interface SessionAccordionProps {
  session: WorkoutSession
  isOpen: boolean
  onToggle: () => void
  onSelectExercise: (exerciseId: string) => void
}

export function SessionAccordion({
  session,
  isOpen,
  onToggle,
  onSelectExercise,
}: SessionAccordionProps) {
  const isMorning = session.session === 'Sáng'

  return (
    <div
      className={`day-accordion day-accordion--${isMorning ? 'am' : 'pm'} ${
        isOpen ? 'day-accordion--open' : ''
      }`}
    >
      <button
        type="button"
        className="day-accordion__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="day-accordion__icon" aria-hidden="true">
          {isMorning ? '🌅' : '🌙'}
        </span>
        <div className="day-accordion__info">
          <span className="day-accordion__label">
            {session.session}
            <span className="day-accordion__focus"> · {session.focus}</span>
          </span>
          <span className="day-accordion__count">{session.exercises.length} bài</span>
        </div>
        <span className="day-accordion__chevron" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <ul className="day-accordion__exercises">
          {session.exercises.map((exercise, index) => (
            <li key={exercise.id}>
              <button
                type="button"
                className="exercise-item"
                onClick={() => onSelectExercise(exercise.id)}
              >
                <span className="exercise-item__index">{index + 1}</span>
                <span className="exercise-item__content">
                  <span className="exercise-item__name">{exercise.name}</span>
                  {(exercise.sets || exercise.reps) && (
                    <span className="exercise-item__meta">
                      {[
                        exercise.sets && `${exercise.sets} sets`,
                        exercise.reps && `${exercise.reps} reps`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  )}
                </span>
                <span className="exercise-item__arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
