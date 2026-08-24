import { useRestTimer } from '../context/restTimerContext'
import { formatDuration } from '../utils/date'

const PRESETS = [60, 90, 120]

export function RestTimerBar() {
  const { remaining, running, defaultSec, add, skip, setDefault } = useRestTimer()

  if (!running) return null

  return (
    <div className="rest-bar" role="status" aria-live="polite">
      <div className="rest-bar__main">
        <span className="rest-bar__label">Nghỉ</span>
        <span className="rest-bar__time">{formatDuration(remaining)}</span>
      </div>

      <div className="rest-bar__presets">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`rest-bar__preset${defaultSec === p ? ' rest-bar__preset--on' : ''}`}
            onClick={() => setDefault(p)}
          >
            {p}s
          </button>
        ))}
      </div>

      <div className="rest-bar__actions">
        <button type="button" className="rest-bar__btn" onClick={() => add(15)}>
          +15s
        </button>
        <button
          type="button"
          className="rest-bar__btn rest-bar__btn--skip"
          onClick={skip}
        >
          Bỏ qua
        </button>
      </div>
    </div>
  )
}
