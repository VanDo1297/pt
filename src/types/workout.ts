/** Một bài tập trong kế hoạch — dữ liệu tĩnh, video/mô tả lấy runtime từ ExerciseDB theo `exerciseId`. */
export interface Exercise {
  order: number
  name: string
  /** ID tra cứu trên ExerciseDB, dùng để fetch GIF + hướng dẫn */
  exerciseId: string
  sets: number
  reps: string
  /** Nhãn phụ, vd "warm-up" */
  type?: string
  /** Hướng dẫn tiếng Việt (dịch sẵn), mỗi phần tử là một bước */
  description?: string[]
}

/** Một ngày tập trong tuần. */
export interface WorkoutDay {
  /** Thứ trong tuần, vd "Monday" */
  day: string
  /** Tên buổi, vd "Upper", "Push", "Legs" */
  name: string
  exercises: Exercise[]
}

/** Toàn bộ kế hoạch tập. */
export interface WorkoutPlan {
  name: string
  schedule: WorkoutDay[]
}

/** Một set đã ghi lại (đã tick hoàn thành) trong một buổi tập. */
export interface SavedSet {
  warmup: boolean
  weight: string
  reps: string
}

/** Một bài tập đã hoàn thành trong buổi (chỉ gồm các set được tick). */
export interface SavedExercise {
  slot: number
  exerciseId: string
  name: string
  sets: SavedSet[]
}

/** Bản ghi một buổi tập đã kết thúc, lưu theo ngày (cookie 30 ngày). */
export interface WorkoutSessionRecord {
  date: string
  day: string
  durationSec: number
  endedAt: number
  exercises: SavedExercise[]
}

/** Chi tiết bài tập trả về từ ExerciseDB (`GET /exercises/{id}`). */
export interface ExerciseDbDetail {
  exerciseId: string
  name: string
  gifUrl: string
  targetMuscles: string[]
  bodyParts: string[]
  equipments: string[]
  secondaryMuscles: string[]
  instructions: string[]
}
