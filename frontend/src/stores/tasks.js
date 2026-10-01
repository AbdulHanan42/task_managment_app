import { defineStore } from 'pinia'
import { taskService } from '../services/task.service'

export const useTasksStore = defineStore('tasks', {
  state: () => ({ tasks: [], currentTask: null, loading: false, saving: false, error: null }),
  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        this.tasks = await taskService.list()
        return this.tasks
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchTask(id) {
      this.loading = true
      this.error = null
      this.currentTask = null
      try {
        this.currentTask = await taskService.get(id)
        return this.currentTask
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async createTask(task) {
      this.saving = true
      this.error = null
      try {
        const created = await taskService.create(task)
        this.tasks.unshift(created)
        return created
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.saving = false
      }
    },
    async updateTask(id, task) {
      this.saving = true
      this.error = null
      try {
        const updated = await taskService.update(id, task)
        const index = this.tasks.findIndex((item) => item.id === updated.id)
        if (index >= 0) this.tasks[index] = updated
        if (this.currentTask?.id === updated.id) this.currentTask = updated
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.saving = false
      }
    },
    async deleteTask(id) {
      this.saving = true
      this.error = null
      try {
        await taskService.delete(id)
        this.tasks = this.tasks.filter((item) => item.id !== Number(id))
        if (this.currentTask?.id === Number(id)) this.currentTask = null
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
