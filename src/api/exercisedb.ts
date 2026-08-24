import type { ExerciseDbDetail } from '../types/workout'

const API_URL = 'https://oss.exercisedb.dev/api/v1'

/** Cache theo id để không fetch lại bài đã xem trong phiên. */
const cache = new Map<string, ExerciseDbDetail>()
const inflight = new Map<string, Promise<ExerciseDbDetail>>()

interface ApiResponse {
  success: boolean
  data: ExerciseDbDetail
}

/** Lấy chi tiết một bài tập (GIF + hướng dẫn) từ ExerciseDB theo id. */
export async function fetchExerciseDetail(id: string): Promise<ExerciseDbDetail> {
  const cached = cache.get(id)
  if (cached) return cached

  const existing = inflight.get(id)
  if (existing) return existing

  const promise = (async () => {
    const res = await fetch(`${API_URL}/exercises/${id}`)
    if (!res.ok) {
      throw new Error(`ExerciseDB trả về ${res.status}`)
    }
    const json = (await res.json()) as ApiResponse
    if (!json.success || !json.data) {
      throw new Error('Không tìm thấy dữ liệu bài tập')
    }
    cache.set(id, json.data)
    return json.data
  })()

  inflight.set(id, promise)
  try {
    return await promise
  } finally {
    inflight.delete(id)
  }
}
