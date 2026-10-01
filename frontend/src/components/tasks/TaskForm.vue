<script setup>
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { validateTask } from '../../utils/validators'
import AppButton from '../common/AppButton.vue'
import AppInput from '../common/AppInput.vue'

const props = defineProps({
  task: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  backendErrors: { type: Object, default: () => ({}) },
  submitLabel: { type: String, default: 'Save task' },
})
const emit = defineEmits(['submit'])
const router = useRouter()
const form = reactive({ title: '', description: '', is_completed: false })
const errors = reactive({})

watch(
  () => props.task,
  (task) => {
    form.title = task?.title || ''
    form.description = task?.description || ''
    form.is_completed = task?.is_completed || false
  },
  { immediate: true },
)

function submit() {
  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, validateTask(form))
  if (Object.keys(errors).length) return
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    is_completed: form.is_completed,
  })
}
</script>

<template>
  <form class="form-panel task-form" @submit.prevent="submit">
    <AppInput
      v-model="form.title"
      name="title"
      label="Task title"
      placeholder="What needs to move forward?"
      :error="errors.title || backendErrors.title"
    />
    <AppInput
      v-model="form.description"
      name="description"
      label="Description"
      placeholder="Add a few useful details"
      :error="errors.description || backendErrors.description"
      multiline
    />
    <label class="checkbox-row"
      ><input v-model="form.is_completed" type="checkbox" /><span class="checkbox-visual"></span
      ><span
        ><strong>Mark as complete</strong
        ><small>Completed tasks stay in your list for reference.</small></span
      ></label
    >
    <div class="form-actions">
      <AppButton variant="quiet" @click="router.back()">Cancel</AppButton
      ><AppButton type="submit" :loading="loading">{{ submitLabel }}</AppButton>
    </div>
  </form>
</template>
