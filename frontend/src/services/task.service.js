import { api } from './api'

export const taskService = {
  list: () => api.get('/tasks/all_tasks'),
  get: (id) => api.get(`/tasks/one_task/${encodeURIComponent(id)}`),
  create: (task) => api.post('/tasks/create', task),
  update: (id, task) => api.put(`/tasks/update_task/${encodeURIComponent(id)}`, task),
  delete: (id) => api.delete(`/tasks/delete_task/${encodeURIComponent(id)}`),
}
