import { useMemo, useState } from 'react'
import { workoutPlan } from './data/workoutPlan.ts'
import { ExerciseDetail } from './components/ExerciseDetail'
import { WorkoutPlanList } from './components/WorkoutPlanList'

function App() {
  const [selected, setSelected] = useState<{ dayId: string; exerciseId: string } | null>(
    null,
  )
  const [openDayId, setOpenDayId] = useState<string | null>(workoutPlan[0]?.id ?? null)

  const selectedExercise = useMemo(() => {
    if (!selected) return null

    const day = workoutPlan.find((d) => d.id === selected.dayId)
    if (!day) return null

    const index = day.exercises.findIndex((e) => e.id === selected.exerciseId)
    if (index === -1) return null

    const exercise = day.exercises[index]
    // Chỉ điều hướng trong cùng một buổi (Sáng/Tối)
    const sessionExercises = day.exercises.filter(
      (e) => e.session === exercise.session,
    )
    const sessionIndex = sessionExercises.findIndex((e) => e.id === exercise.id)

    return { day, exercise, sessionExercises, sessionIndex }
  }, [selected])

  if (selectedExercise) {
    const { day, exercise, sessionExercises, sessionIndex } = selectedExercise
    const prev = sessionIndex > 0 ? sessionExercises[sessionIndex - 1] : null
    const next =
      sessionIndex < sessionExercises.length - 1
        ? sessionExercises[sessionIndex + 1]
        : null

    return (
      <ExerciseDetail
        exercise={exercise}
        dayLabel={exercise.session ? `${day.label} · ${exercise.session}` : day.label}
        position={sessionIndex + 1}
        total={sessionExercises.length}
        onBack={() => setSelected(null)}
        onPrev={
          prev ? () => setSelected({ dayId: day.id, exerciseId: prev.id }) : undefined
        }
        onNext={
          next ? () => setSelected({ dayId: day.id, exerciseId: next.id }) : undefined
        }
      />
    )
  }

  return (
    <WorkoutPlanList
      days={workoutPlan}
      openDayId={openDayId}
      onToggleDay={(dayId) =>
        setOpenDayId((current) => (current === dayId ? null : dayId))
      }
      onSelectExercise={(dayId, exerciseId) => {
        setOpenDayId(dayId)
        setSelected({ dayId, exerciseId })
      }}
    />
  )
}

export default App
