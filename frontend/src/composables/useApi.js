import { ref } from 'vue'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  async function run(operation) {
    loading.value = true
    error.value = null
    try {
      return await operation()
    } catch (cause) {
      error.value = cause.message || 'The request could not be completed.'
      throw cause
    } finally {
      loading.value = false
    }
  }

  return { loading, error, run }
}
