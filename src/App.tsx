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

    return { day, exercise: day.exercises[index], index }
  }, [selected])

  if (selectedExercise) {
    const { day, exercise, index } = selectedExercise
    const prev = index > 0 ? day.exercises[index - 1] : null
    const next = index < day.exercises.length - 1 ? day.exercises[index + 1] : null

    return (
      <ExerciseDetail
        exercise={exercise}
        dayLabel={day.label}
        position={index + 1}
        total={day.exercises.length}
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
