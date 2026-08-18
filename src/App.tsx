import { useMemo, useState } from 'react'
import { workoutPlan } from './data/workoutPlan.ts'
import { ExerciseDetail } from './components/ExerciseDetail'
import { WorkoutPlanList } from './components/WorkoutPlanList'

function App() {
  const [selected, setSelected] = useState<{ sessionId: string; exerciseId: string } | null>(
    null,
  )
  const [openSessionId, setOpenSessionId] = useState<string | null>(
    workoutPlan[0]?.id ?? null,
  )

  const selectedExercise = useMemo(() => {
    if (!selected) return null

    const session = workoutPlan.find((s) => s.id === selected.sessionId)
    if (!session) return null

    const index = session.exercises.findIndex((e) => e.id === selected.exerciseId)
    if (index === -1) return null

    return { session, exercise: session.exercises[index], index }
  }, [selected])

  if (selectedExercise) {
    const { session, exercise, index } = selectedExercise
    const prev = index > 0 ? session.exercises[index - 1] : null
    const next =
      index < session.exercises.length - 1 ? session.exercises[index + 1] : null

    return (
      <ExerciseDetail
        exercise={exercise}
        title={session.focus}
        subtitle={`${session.day} · ${session.session}`}
        position={index + 1}
        total={session.exercises.length}
        onBack={() => setSelected(null)}
        onPrev={
          prev
            ? () => setSelected({ sessionId: session.id, exerciseId: prev.id })
            : undefined
        }
        onNext={
          next
            ? () => setSelected({ sessionId: session.id, exerciseId: next.id })
            : undefined
        }
      />
    )
  }

  return (
    <WorkoutPlanList
      sessions={workoutPlan}
      openSessionId={openSessionId}
      onToggleSession={(sessionId) =>
        setOpenSessionId((current) => (current === sessionId ? null : sessionId))
      }
      onSelectExercise={(sessionId, exerciseId) => {
        setOpenSessionId(sessionId)
        setSelected({ sessionId, exerciseId })
      }}
    />
  )
}

export default App
