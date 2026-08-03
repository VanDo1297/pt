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
    const exercise = day?.exercises.find((e) => e.id === selected.exerciseId)

    if (!day || !exercise) return null

    return { day, exercise }
  }, [selected])

  if (selectedExercise) {
    return (
      <ExerciseDetail
        exercise={selectedExercise.exercise}
        dayLabel={selectedExercise.day.label}
        onBack={() => setSelected(null)}
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
