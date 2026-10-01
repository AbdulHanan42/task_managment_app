export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const TOKEN_KEY = 'taskflow.access-token'
export const TASK_PRIORITIES = [
  { value: 'most_important', label: 'Most important' },
  { value: 'important', label: 'Important' },
  { value: 'normal', label: 'Normal' },
  { value: 'regular', label: 'Regular' },
]

export const TASK_PRIORITY_LABELS = Object.fromEntries(
  TASK_PRIORITIES.map(({ value, label }) => [value, label]),
)
