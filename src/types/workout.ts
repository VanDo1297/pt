export interface Exercise {
  id: string
  name: string
  description: string[]
  /** File .mov trong `public/videos/`, vd: `/videos/push-up.mov` */
  videoUrl: string
  /** Link web nguồn, mở tab mới */
  sourceUrl?: string
  sets?: string
  reps?: string
}

export interface WorkoutDay {
  id: string
  label: string
  focus: string
  exercises: Exercise[]
}
