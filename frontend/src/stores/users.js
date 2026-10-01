import { defineStore } from 'pinia'
import { userService } from '../services/user.service'

export const useUsersStore = defineStore('users', {
  state: () => ({ currentUser: null, loading: false, error: null }),
  actions: {
    async fetchCurrentUser() {
      this.loading = true
      this.error = null
      try {
        this.currentUser = await userService.current()
        return this.currentUser
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
