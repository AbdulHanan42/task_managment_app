import { defineStore } from 'pinia'
import { authService } from '../services/auth.service'
import { userService } from '../services/user.service'
import { clearToken, getToken, setToken } from '../utils/storage'

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: getToken(), user: null, loading: false, error: null, initialized: false }),
  getters: { isAuthenticated: (state) => Boolean(state.token && state.user) },
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const result = await authService.login(credentials)
        const token = result?.Token
        if (!token) throw new Error('The login response did not include a token.')
        this.token = token
        setToken(token)
        this.user = await authService.currentUser()
        this.initialized = true
        return this.user
      } catch (error) {
        this.clearAuth()
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async register(details) {
      this.loading = true
      this.error = null
      try {
        return await authService.register(details)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateProfile(profile) {
      this.loading = true
      this.error = null
      try {
        this.user = await userService.updateProfile(profile)
        return this.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async getCurrentUser() {
      if (!this.token) {
        this.initialized = true
        return null
      }
      this.loading = true
      this.error = null
      try {
        this.user = await authService.currentUser()
        return this.user
      } catch (error) {
        this.clearAuth()
        this.error = error.message
        throw error
      } finally {
        this.initialized = true
        this.loading = false
      }
    },
    clearAuth() {
      clearToken()
      this.token = null
      this.user = null
      this.initialized = true
    },
    logout() {
      this.clearAuth()
      this.error = null
    },
  },
})
