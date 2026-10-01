import { api } from './api'

export const authService = {
  login: (credentials) => api.post('/user/login', credentials),
  register: (details) => api.post('/user/register', details),
  currentUser: () => api.get('/user/is_auth'),
}
