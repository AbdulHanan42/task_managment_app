<script setup>
import AppButton from './AppButton.vue'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  busy: { type: Boolean, default: false },
})
defineEmits(['cancel', 'confirm'])
</script>

<template>
  <div
    v-if="open"
    class="modal-backdrop"
    @click.self="$emit('cancel')"
    @keydown.esc="$emit('cancel')"
  >
    <section class="confirm-dialog" role="alertdialog" aria-modal="true" :aria-label="title">
      <span class="eyebrow">Please confirm</span>
      <h2 class="font-display">{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="dialog-actions">
        <AppButton variant="quiet" @click="$emit('cancel')">Cancel</AppButton
        ><AppButton variant="danger" :loading="busy" @click="$emit('confirm')"
          >Delete task</AppButton
        >
      </div>
    </section>
  </div>
</template>
