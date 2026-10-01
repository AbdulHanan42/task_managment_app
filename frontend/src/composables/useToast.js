import { reactive } from 'vue'

const toasts = reactive([])
let nextId = 0

function show(message, type = 'success') {
  const id = ++nextId
  toasts.push({ id, message, type })
  window.setTimeout(() => {
    const index = toasts.findIndex((toast) => toast.id === id)
    if (index >= 0) toasts.splice(index, 1)
  }, 3800)
}

export function useToast() {
  return {
    toasts,
    success: (message) => show(message, 'success'),
    error: (message) => show(message, 'error'),
    dismiss: (id) => {
      const index = toasts.findIndex((toast) => toast.id === id)
      if (index >= 0) toasts.splice(index, 1)
    },
  }
}
