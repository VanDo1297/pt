import { useMemo, useState } from 'react'
import { workoutPlan } from './data/workoutPlan.ts'
import { WeekCalendar } from './components/WeekCalendar'
import { ExerciseAccordion } from './components/ExerciseAccordion'
import { RestTimerBar } from './components/RestTimerBar'
import type { StoredRow } from './components/SetTracker'
import { unlockAudio } from './audio/beep'
import { useActiveWorkout } from './hooks/useActiveWorkout'
import { hasSession, loadSession, saveSession } from './utils/cookie'
import {
  addDays,
  formatDuration,
  startOfWeek,
  weekdayName,
  ymd,
} from './utils/date'
import { dayLabel } from './utils/day'
import type { SavedExercise, WorkoutDay, WorkoutSessionRecord } from './types/workout'

const draftKey = (dateStr: string, slot: number, id: string) =>
  `ptplan:draft:${dateStr}:${slot}:${id}`

/** Gom các set đã tick từ bản nháp thành một bản ghi buổi tập. */
function gatherSession(
  dateStr: string,
  day: string,
  exercises: WorkoutDay['exercises'],
  durationSec: number,
): WorkoutSessionRecord {
  const saved: SavedExercise[] = []
  exercises.forEach((ex, i) => {
    const raw = localStorage.getItem(draftKey(dateStr, i, ex.exerciseId))
    if (!raw) return
    let rows: StoredRow[]
    try {
      rows = JSON.parse(raw)
    } catch {
      return
    }
    const done = rows
      .filter((r) => r.done)
      .map(({ warmup, weight, reps }) => ({ warmup, weight, reps }))
    if (done.length > 0) {
      saved.push({ slot: i, exerciseId: ex.exerciseId, name: ex.name, sets: done })
    }
  })
  return { date: dateStr, day, durationSec, endedAt: Date.now(), exercises: saved }
}

function clearDrafts(dateStr: string, exercises: WorkoutDay['exercises']): void {
  exercises.forEach((ex, i) => {
    try {
      localStorage.removeItem(draftKey(dateStr, i, ex.exerciseId))
    } catch {
      // bỏ qua
    }
  })
}

function App() {
  const today = useMemo(() => new Date(), [])
  const [selected, setSelected] = useState<Date>(today)
  const [weekOffset, setWeekOffset] = useState(0)
  const [version, setVersion] = useState(0) // ép đọc lại cookie sau khi lưu
  const [pending, setPending] = useState<WorkoutSessionRecord | null>(null)

  const timer = useActiveWorkout()

  const workoutByDay = useMemo(() => {
    const map: Record<string, WorkoutDay> = {}
    for (const day of workoutPlan.schedule) map[day.day] = day
    return map
  }, [])

  const weekStart = useMemo(
    () => addDays(startOfWeek(today), weekOffset * 7),
    [today, weekOffset],
  )
  const weekEnd = addDays(weekStart, 6)

  const selectedStr = ymd(selected)
  const weekday = weekdayName(selected)
  const workout = workoutByDay[weekday]

  // version tham chiếu để tính lại khi có thay đổi lưu trữ
  void version
  const session = loadSession(selectedStr)
  const isActiveHere = timer.active?.dateStr === selectedStr
  const isActiveElsewhere = Boolean(timer.active) && !isActiveHere
  const readOnly = Boolean(session) && !isActiveHere

  const savedBySlot = useMemo(() => {
    const map = new Map<number, StoredRow[]>()
    if (session) {
      for (const ex of session.exercises) {
        map.set(
          ex.slot,
          ex.sets.map((s) => ({ ...s, done: true })),
        )
      }
    }
    return map
  }, [session])

  const startWorkout = () => {
    if (isActiveElsewhere) return
    unlockAudio() // mở khoá âm thanh trong thao tác chạm
    timer.start(selectedStr, weekday)
  }

  const requestFinish = () => {
    if (!workout || !timer.active) return
    setPending(
      gatherSession(selectedStr, weekday, workout.exercises, timer.elapsedSec),
    )
  }

  const confirmFinish = () => {
    if (!pending || !workout) return
    saveSession(pending.date, pending)
    clearDrafts(pending.date, workout.exercises)
    timer.stop()
    setPending(null)
    setVersion((v) => v + 1)
  }

  const rangeLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1} – ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">Kế hoạch tập</p>
        <h1>{workoutPlan.name}</h1>
      </header>

      <div className="cal-nav">
        <button
          type="button"
          className="cal-nav__btn"
          onClick={() => setWeekOffset((w) => w - 1)}
          aria-label="Tuần trước"
        >
          ‹
        </button>
        <span className="cal-nav__label">
          {weekOffset === 0 ? 'Tuần này' : rangeLabel}
        </span>
        <button
          type="button"
          className="cal-nav__btn"
          onClick={() => setWeekOffset((w) => w + 1)}
          aria-label="Tuần sau"
        >
          ›
        </button>
      </div>

      <WeekCalendar
        weekStart={weekStart}
        today={today}
        selected={selected}
        workoutByDay={workoutByDay}
        isCompleted={(d) => hasSession(ymd(d))}
        onSelect={setSelected}
      />

      {weekOffset !== 0 && (
        <button
          type="button"
          className="today-jump"
          onClick={() => {
            setWeekOffset(0)
            setSelected(today)
          }}
        >
          ↩ Về hôm nay
        </button>
      )}

      <section className="day-content">
        <div className="day-content__title">
          <h2>{dayLabel(weekday)}</h2>
          <span className="day-content__focus">
            {workout ? `${workout.name} · ${workout.exercises.length} bài` : 'Ngày nghỉ'}
          </span>
        </div>

        {workout && (
          <div className="session-bar">
            {isActiveHere ? (
              <>
                <span className="session-bar__timer" aria-live="polite">
                  ⏱ {formatDuration(timer.elapsedSec)}
                </span>
                <div className="session-bar__actions">
                  {timer.active?.running ? (
                    <button
                      type="button"
                      className="session-bar__btn"
                      onClick={timer.pause}
                    >
                      ⏸ Tạm dừng
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="session-bar__btn"
                      onClick={timer.resume}
                    >
                      ▶ Tiếp tục
                    </button>
                  )}
                  <button
                    type="button"
                    className="session-bar__btn session-bar__btn--end"
                    onClick={requestFinish}
                  >
                    Kết thúc
                  </button>
                </div>
              </>
            ) : session ? (
              <>
                <span className="session-bar__done">
                  ✓ Đã tập · ⏱ {formatDuration(session.durationSec)}
                </span>
                <button
                  type="button"
                  className="session-bar__btn"
                  onClick={startWorkout}
                  disabled={isActiveElsewhere}
                >
                  Tập lại
                </button>
              </>
            ) : isActiveElsewhere ? (
              <span className="session-bar__note">
                Đang có buổi tập ở ngày khác — kết thúc buổi đó trước.
              </span>
            ) : (
              <button
                type="button"
                className="session-bar__btn session-bar__btn--start"
                onClick={startWorkout}
              >
                ▶ Bắt đầu
              </button>
            )}
          </div>
        )}

        {workout ? (
          <div className="ex-list">
            {workout.exercises.map((exercise, i) => (
              <ExerciseAccordion
                key={`${selectedStr}:${readOnly ? 'r' : 'e'}:${exercise.exerciseId}:${i}`}
                exercise={exercise}
                index={i}
                storageKey={draftKey(selectedStr, i, exercise.exerciseId)}
                savedSets={savedBySlot.get(i)}
                readOnly={readOnly}
              />
            ))}
          </div>
        ) : (
          <p className="rest-day">Hôm nay không có buổi tập — nghỉ ngơi &amp; phục hồi 💤</p>
        )}
      </section>

      {pending && (
        <div className="dialog-overlay" role="dialog" aria-modal="true">
          <div className="dialog">
            <h3 className="dialog__title">Kết thúc buổi tập?</h3>
            <p className="dialog__body">
              Thời lượng <strong>{formatDuration(pending.durationSec)}</strong> ·{' '}
              {pending.exercises.length} bài ·{' '}
              {pending.exercises.reduce((n, e) => n + e.sets.length, 0)} set đã tick.
              <br />
              Số liệu sẽ được lưu lại để so sánh với lần sau.
            </p>
            <div className="dialog__actions">
              <button
                type="button"
                className="dialog__btn"
                onClick={() => setPending(null)}
              >
                Huỷ
              </button>
              <button
                type="button"
                className="dialog__btn dialog__btn--primary"
                onClick={confirmFinish}
              >
                Lưu &amp; kết thúc
              </button>
            </div>
          </div>
        </div>
      )}

      <RestTimerBar />
    </div>
  )
}

export default App
