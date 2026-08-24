import { useEffect, useState } from 'react'
import { fetchExerciseDetail } from '../api/exercisedb'
import type { ExerciseDbDetail } from '../types/workout'

interface State {
  data: ExerciseDbDetail | null
  loading: boolean
  error: string | null
}

/** Fetch chi tiết bài tập từ ExerciseDB theo id, chỉ chạy khi cần (mở chi tiết). */
export function useExerciseDetail(id: string): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let active = true
    setState({ data: null, loading: true, error: null })

    fetchExerciseDetail(id)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (active) {
          const message =
            err instanceof Error ? err.message : 'Không tải được dữ liệu'
          setState({ data: null, loading: false, error: message })
        }
      })

    return () => {
      active = false
    }
  }, [id])

  return state
}
