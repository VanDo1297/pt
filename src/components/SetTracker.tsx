import { useEffect, useMemo, useRef, useState } from 'react'
import { useRestTimer } from '../context/restTimerContext'
import { unlockAudio } from '../audio/beep'

interface SetRow {
  id: number
  warmup: boolean
  weight: string
  reps: string
  done: boolean
}

export interface StoredRow {
  warmup: boolean
  weight: string
  reps: string
  done: boolean
}

interface SetTrackerProps {
  /** Khoá lưu bản nháp (localStorage), duy nhất theo ngày + bài */
  storageKey: string
  /** Số set chính mặc định (từ plan) */
  defaultSets: number
  /** Reps gốc từ plan, vd "8-12" — dùng làm gợi ý */
  defaultReps: string
  /** Dữ liệu từ buổi đã lưu (nếu ngày này đã hoàn thành) */
  initialSets?: StoredRow[]
  /** Chỉ xem (ngày đã hoàn thành, không phải buổi đang tập) */
  readOnly?: boolean
}

/** Lấy số đầu tiên trong chuỗi reps, vd "8-12" -> "8". */
function parseReps(reps: string): string {
  const m = reps.match(/\d+/)
  return m ? m[0] : ''
}

function makeDefault(
  defaultSets: number,
  defaultReps: string,
  nextId: () => number,
): SetRow[] {
  const reps = parseReps(defaultReps)
  return Array.from({ length: Math.max(1, defaultSets) }, () => ({
    id: nextId(),
    warmup: false,
    weight: '',
    reps,
    done: false,
  }))
}

function loadDraft(storageKey: string): StoredRow[] | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredRow[]) : null
  } catch {
    return null
  }
}

export function SetTracker({
  storageKey,
  defaultSets,
  defaultReps,
  initialSets,
  readOnly = false,
}: SetTrackerProps) {
  const idRef = useRef(0)
  const nextId = () => ++idRef.current
  const rest = useRestTimer()

  const [rows, setRows] = useState<SetRow[]>(() => {
    const source = loadDraft(storageKey) ?? initialSets
    if (source && source.length > 0) {
      return source.map((r) => ({ ...r, id: nextId() }))
    }
    return makeDefault(defaultSets, defaultReps, nextId)
  })

  // Lưu bản nháp khi đang tập (không lưu ở chế độ chỉ xem)
  useEffect(() => {
    if (readOnly) return
    const toStore: StoredRow[] = rows.map(({ warmup, weight, reps, done }) => ({
      warmup,
      weight,
      reps,
      done,
    }))
    try {
      localStorage.setItem(storageKey, JSON.stringify(toStore))
    } catch {
      // bỏ qua
    }
  }, [rows, storageKey, readOnly])

  const repsHint = useMemo(() => parseReps(defaultReps), [defaultReps])

  const update = (id: number, patch: Partial<SetRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const toggleDone = (row: SetRow) => {
    if (readOnly) return
    const next = !row.done
    update(row.id, { done: next })
    // Tick xong 1 set chính -> bắt đầu đếm giờ nghỉ + chuông khi hết
    if (next && !row.warmup) {
      unlockAudio()
      rest.start()
    }
  }

  const addSet = (warmup: boolean) =>
    setRows((prev) => {
      const last = [...prev].reverse().find((r) => r.warmup === warmup)
      const newRow: SetRow = {
        id: nextId(),
        warmup,
        weight: last?.weight ?? '',
        reps: last?.reps ?? repsHint,
        done: false,
      }
      if (!warmup) return [...prev, newRow]
      const firstWork = prev.findIndex((r) => !r.warmup)
      if (firstWork === -1) return [...prev, newRow]
      return [...prev.slice(0, firstWork), newRow, ...prev.slice(firstWork)]
    })

  const removeRow = (id: number) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))

  const reset = () => setRows(makeDefault(defaultSets, defaultReps, nextId))

  let workIndex = 0

  return (
    <div className="set-tracker">
      <div className="set-tracker__row set-tracker__row--head">
        <span>Set</span>
        <span>Kg</span>
        <span>Reps</span>
        <span aria-hidden="true" />
      </div>

      {rows.map((row) => {
        if (!row.warmup) workIndex += 1
        return (
          <div
            key={row.id}
            className={`set-tracker__row${row.done ? ' set-tracker__row--done' : ''}`}
          >
            <span className="set-tracker__label">
              {row.warmup ? 'W' : workIndex}
            </span>
            <input
              className="set-tracker__input"
              type="number"
              inputMode="decimal"
              placeholder="—"
              value={row.weight}
              disabled={readOnly}
              onChange={(e) => update(row.id, { weight: e.target.value })}
            />
            <input
              className="set-tracker__input"
              type="number"
              inputMode="numeric"
              placeholder={repsHint || '—'}
              value={row.reps}
              disabled={readOnly}
              onChange={(e) => update(row.id, { reps: e.target.value })}
            />
            <div className="set-tracker__row-actions">
              <button
                type="button"
                className={`set-tracker__check${row.done ? ' set-tracker__check--on' : ''}`}
                onClick={() => toggleDone(row)}
                aria-pressed={row.done}
                aria-label="Đánh dấu hoàn thành"
                disabled={readOnly}
              >
                ✓
              </button>
              {!readOnly && (
                <button
                  type="button"
                  className="set-tracker__remove"
                  onClick={() => removeRow(row.id)}
                  aria-label="Xoá set"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )
      })}

      {!readOnly && (
        <div className="set-tracker__actions">
          <button
            type="button"
            className="set-tracker__btn"
            onClick={() => addSet(false)}
          >
            + Thêm set
          </button>
          <button
            type="button"
            className="set-tracker__btn"
            onClick={() => addSet(true)}
          >
            + Khởi động
          </button>
          <button
            type="button"
            className="set-tracker__btn set-tracker__btn--ghost"
            onClick={reset}
          >
            Đặt lại
          </button>
        </div>
      )}
    </div>
  )
}
