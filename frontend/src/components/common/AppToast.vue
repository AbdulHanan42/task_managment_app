<script setup>
import { Check, CircleAlert, X } from 'lucide-vue-next'
import { useToast } from '../../composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="false">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="`toast--${toast.type}`"
      role="status"
    >
      <Check v-if="toast.type === 'success'" :size="18" /><CircleAlert v-else :size="18" />
      <span>{{ toast.message }}</span>
      <button
        type="button"
        class="icon-button toast-close"
        aria-label="Dismiss notification"
        @click="dismiss(toast.id)"
      >
        <X :size="16" />
      </button>
    </div>
  </div>
</template>
