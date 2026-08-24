import { useState } from 'react'
import type { Exercise } from '../types/workout'
import { useExerciseDetail } from '../hooks/useExerciseDetail'
import { SetTracker, type StoredRow } from './SetTracker'

interface ExerciseAccordionProps {
  exercise: Exercise
  index: number
  /** Khoá lưu số liệu set, duy nhất theo ngày + bài */
  storageKey: string
  /** Set đã lưu từ buổi hoàn thành của ngày này */
  savedSets?: StoredRow[]
  /** Chỉ xem (ngày đã hoàn thành) */
  readOnly?: boolean
}

export function ExerciseAccordion({
  exercise,
  index,
  storageKey,
  savedSets,
  readOnly,
}: ExerciseAccordionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`ex-acc${open ? ' ex-acc--open' : ''}`}>
      <button
        type="button"
        className="ex-acc__header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="ex-acc__index">{index + 1}</span>
        <span className="ex-acc__content">
          <span className="ex-acc__name">
            {exercise.name}
            {exercise.type && <span className="ex-acc__tag">{exercise.type}</span>}
          </span>
          <span className="ex-acc__meta">
            {exercise.sets} sets · {exercise.reps} reps
          </span>
        </span>
        {readOnly && <span className="ex-acc__done" aria-hidden="true">✓</span>}
        <span className="ex-acc__chevron" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <ExerciseBody
          exercise={exercise}
          storageKey={storageKey}
          savedSets={savedSets}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}

/** Tách riêng để chỉ fetch chi tiết khi bài được mở (lazy). */
function ExerciseBody({
  exercise,
  storageKey,
  savedSets,
  readOnly,
}: {
  exercise: Exercise
  storageKey: string
  savedSets?: StoredRow[]
  readOnly?: boolean
}) {
  const { data, loading, error } = useExerciseDetail(exercise.exerciseId)

  return (
    <div className="ex-acc__body">
      <div className="ex-gif">
        {loading && <div className="ex-gif__status">Đang tải minh hoạ…</div>}
        {error && !loading && (
          <div className="ex-gif__status ex-gif__status--error">
            Không tải được minh hoạ
          </div>
        )}
        {data && (
          <img
            className="ex-gif__img"
            src={data.gifUrl}
            alt={`Minh hoạ ${exercise.name}`}
            loading="lazy"
          />
        )}
      </div>

      <SetTracker
        storageKey={storageKey}
        defaultSets={exercise.sets}
        defaultReps={exercise.reps}
        initialSets={savedSets}
        readOnly={readOnly}
      />

      {exercise.description && exercise.description.length > 0 && (
        <div className="ex-desc-wrap">
          <h3 className="ex-desc-title">Hướng dẫn</h3>
          <ol className="ex-desc">
            {exercise.description.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
