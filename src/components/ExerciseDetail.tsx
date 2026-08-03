import type { Exercise } from '../types/workout'

interface ExerciseDetailProps {
  exercise: Exercise
  dayLabel: string
  onBack: () => void
}

export function ExerciseDetail({ exercise, dayLabel, onBack }: ExerciseDetailProps) {
  const hasDescription = exercise.description.some((line) => line.trim().length > 0)

  return (
    <div className="exercise-detail">
      <header className="exercise-detail__top">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
      </header>

      <p className="exercise-detail__day">{dayLabel}</p>
      <h1 className="exercise-detail__title">{exercise.name}</h1>

      {(exercise.sets || exercise.reps) && (
        <p className="exercise-detail__meta">
          {exercise.sets && <span>{exercise.sets} sets</span>}
          {exercise.sets && exercise.reps && <span> · </span>}
          {exercise.reps && <span>{exercise.reps} reps</span>}
        </p>
      )}

      <div className="video-wrapper">
        <video className="exercise-video" controls playsInline preload="metadata">
          <source src={exercise.videoUrl} type="video/quicktime" />
          Trình duyệt không hỗ trợ phát file .mov.
        </video>
      </div>

      {exercise.sourceUrl && (
        <a
          className="source-link"
          href={exercise.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Xem nguồn ↗
        </a>
      )}

      {hasDescription && (
        <div className="exercise-detail__description">
          <h2>Mô tả</h2>
          <ul className="exercise-detail__description-list">
            {exercise.description
              .filter((line) => line.trim().length > 0)
              .map((line, index) => (
                <li key={index}>{line}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
