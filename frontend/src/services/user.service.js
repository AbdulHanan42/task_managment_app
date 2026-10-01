import { api } from './api'

export const userService = {
  current: () => api.get('/user/is_auth'),
  updateProfile: (profile) => api.patch('/user/profile', profile),
}
