<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import TaskForm from '../../components/tasks/TaskForm.vue'
import { useTasks } from '../../composables/useTasks'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasks()
const toast = useToast()
const isEditing = computed(() => Boolean(route.params.id))
const task = ref(null)
const message = ref('')
const fieldErrors = ref({})

onMounted(async () => {
  if (!isEditing.value) return
  try {
    task.value = await tasksStore.fetchTask(route.params.id)
  } catch (error) {
    message.value = error.message
  }
})

async function saveTask(values) {
  message.value = ''
  fieldErrors.value = {}
  try {
    if (isEditing.value) {
      await tasksStore.updateTask(route.params.id, values)
      toast.success('Your changes are saved.')
      router.replace({ name: 'task-details', params: { id: route.params.id } })
    } else {
      const created = await tasksStore.createTask(values)
      toast.success('Task added to your workspace.')
      router.replace({ name: 'task-details', params: { id: created.id } })
    }
  } catch (error) {
    message.value = error.message
    fieldErrors.value = error.fieldErrors || {}
  }
}
</script>

<template>
  <div class="editor-view">
    <RouterLink class="back-link" :to="{ name: 'tasks' }"
      ><ArrowLeft :size="16" /> Back to tasks</RouterLink
    >
    <section class="view-heading editor-heading">
      <div>
        <span class="eyebrow">{{ isEditing ? 'REFINE THE DETAILS' : 'MAKE IT REAL' }}</span>
        <h1 class="font-display">
          {{ isEditing ? 'Edit task' : 'New task' }}<span class="heading-period">.</span>
        </h1>
        <p>
          {{
            isEditing
              ? 'Update the details or adjust its progress.'
              : 'Start with a clear title and the next useful detail.'
          }}
        </p>
      </div>
    </section>
    <div
      v-if="tasksStore.loading && isEditing && !task"
      class="form-panel skeleton loading-form"
    ></div>
    <div v-else-if="message && !task && isEditing" class="inline-state">
      <p>{{ message }}</p>
      <RouterLink class="text-link" :to="{ name: 'tasks' }">Return to tasks</RouterLink>
    </div>
    <template v-else
      ><div v-if="message" class="form-alert" role="alert">{{ message }}</div>
      <TaskForm
        :task="task"
        :loading="tasksStore.saving"
        :backend-errors="fieldErrors"
        :submit-label="isEditing ? 'Save changes' : 'Create task'"
        @submit="saveTask"
    /></template>
  </div>
</template>
