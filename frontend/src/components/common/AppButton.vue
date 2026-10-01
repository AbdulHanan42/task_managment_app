<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})
</script>

<template>
  <button
    :type="type"
    class="app-button"
    :class="`app-button--${variant}`"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="button-spinner" aria-hidden="true"></span><slot />
  </button>
</template>
