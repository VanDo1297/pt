import type { WorkoutDay } from '../types/workout'

interface DayAccordionProps {
  day: WorkoutDay
  isOpen: boolean
  onToggle: () => void
  onSelectExercise: (exerciseId: string) => void
}

export function DayAccordion({
  day,
  isOpen,
  onToggle,
  onSelectExercise,
}: DayAccordionProps) {
  return (
    <div className={`day-accordion ${isOpen ? 'day-accordion--open' : ''}`}>
      <button
        type="button"
        className="day-accordion__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="day-accordion__info">
          <span className="day-accordion__label">{day.label}</span>
          <span className="day-accordion__focus">{day.focus}</span>
        </div>
        <span className="day-accordion__count">{day.exercises.length} bài</span>
        <span className="day-accordion__chevron" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <ul className="day-accordion__exercises">
          {day.exercises.map((exercise, index) => (
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
                      {[exercise.sets && `${exercise.sets} sets`, exercise.reps && `${exercise.reps} reps`]
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
