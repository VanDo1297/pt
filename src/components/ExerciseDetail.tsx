import type { Exercise } from '../types/workout'

interface ExerciseDetailProps {
  exercise: Exercise
  /** Tiêu đề chính = nhóm cơ, vd "Ngực", "Vai + Triceps" */
  title: string
  /** Dòng phụ, vd "Thứ 3 · Sáng" */
  subtitle: string
  position: number
  total: number
  onBack: () => void
  onPrev?: () => void
  onNext?: () => void
}

export function ExerciseDetail({
  exercise,
  title,
  subtitle,
  position,
  total,
  onBack,
  onPrev,
  onNext,
}: ExerciseDetailProps) {
  const hasDescription = exercise.description.some((line) => line.trim().length > 0)

  return (
    <div className="exercise-detail">
      <header className="exercise-detail__top">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
      </header>

      <p className="exercise-detail__day">{subtitle}</p>
      <p className="exercise-detail__focus">{title}</p>
      <h1 className="exercise-detail__title">{exercise.name}</h1>

      {(exercise.sets || exercise.reps) && (
        <p className="exercise-detail__meta">
          {exercise.sets && <span>{exercise.sets} sets</span>}
          {exercise.sets && exercise.reps && <span> · </span>}
          {exercise.reps && <span>{exercise.reps} reps</span>}
        </p>
      )}

      <div className="video-wrapper">
        <video
          key={exercise.id}
          className="exercise-video"
          controls
          playsInline
          autoPlay
          muted
          preload="metadata"
        >
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

      <nav className="exercise-detail__nav">
        <button
          type="button"
          className="nav-btn"
          onClick={onPrev}
          disabled={!onPrev}
        >
          ← Bài trước
        </button>
        <span className="exercise-detail__count">
          {position}/{total}
        </span>
        <button
          type="button"
          className="nav-btn"
          onClick={onNext}
          disabled={!onNext}
        >
          Bài tiếp →
        </button>
      </nav>
    </div>
  )
}
