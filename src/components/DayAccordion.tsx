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
          {day.exercises.map((exercise, index) => {
            const isSessionStart =
              exercise.session &&
              exercise.session !== day.exercises[index - 1]?.session
            // Số thứ tự đếm lại từ 1 trong mỗi buổi
            const sessionIndex =
              day.exercises
                .slice(0, index)
                .filter((e) => e.session === exercise.session).length + 1
            const focusForSession =
              exercise.session === 'Sáng'
                ? day.focus.split(' + ')[0]
                : day.focus.split(' + ')[1]

            return (
              <li key={exercise.id}>
                {isSessionStart && (
                  <div className={`session-header session-header--${exercise.session === 'Sáng' ? 'am' : 'pm'}`}>
                    <span className="session-header__icon" aria-hidden="true">
                      {exercise.session === 'Sáng' ? '🌅' : '🌙'}
                    </span>
                    <span className="session-header__label">{exercise.session}</span>
                    {focusForSession && (
                      <span className="session-header__focus">{focusForSession}</span>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  className="exercise-item"
                  onClick={() => onSelectExercise(exercise.id)}
                >
                  <span className="exercise-item__index">{sessionIndex}</span>
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
            )
          })}
        </ul>
      )}
    </div>
  )
}
