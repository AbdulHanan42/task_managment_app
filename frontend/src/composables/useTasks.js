import { useTasksStore } from '../stores/tasks'

export function useTasks() {
  return useTasksStore()
}
