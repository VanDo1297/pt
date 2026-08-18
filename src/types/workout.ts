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

/** Một buổi tập (Sáng hoặc Tối của một ngày) — mỗi buổi là một item riêng. */
export interface WorkoutSession {
  id: string
  /** Ngày trong tuần, vd "Thứ 2" */
  day: string
  /** Buổi: "Sáng" | "Tối" */
  session: string
  /** Nhãn phụ, vd "Push A", "Pull B", "Legs A" */
  tag?: string
  /** Nhóm cơ chính, vd "Ngực", "Vai + Triceps", "Đùi + Mông" */
  focus: string
  exercises: Exercise[]
}
