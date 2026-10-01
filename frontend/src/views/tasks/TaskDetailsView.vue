<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, Check, Pencil, Trash2 } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppButton from '../../components/common/AppButton.vue'
import AppConfirmDialog from '../../components/common/AppConfirmDialog.vue'
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge.vue'
import { useTasks } from '../../composables/useTasks'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasks()
const toast = useToast()
const task = computed(() => tasksStore.currentTask)
const deleteOpen = ref(false)

onMounted(async () => {
  try {
    await tasksStore.fetchTask(route.params.id)
  } catch (error) {
    toast.error(error.message)
  }
})

async function toggle() {
  try {
    await tasksStore.updateTask(task.value.id, {
      title: task.value.title,
      description: task.value.description,
      is_completed: !task.value.is_completed,
    })
    toast.success(
      task.value.is_completed ? 'Task marked complete.' : 'Task moved back to in progress.',
    )
  } catch (error) {
    toast.error(error.message)
  }
}

async function remove() {
  try {
    await tasksStore.deleteTask(task.value.id)
    toast.success('Task deleted.')
    router.replace({ name: 'tasks' })
  } catch (error) {
    toast.error(error.message)
  } finally {
    deleteOpen.value = false
  }
}
</script>

<template>
  <div class="detail-view">
    <RouterLink class="back-link" :to="{ name: 'tasks' }"
      ><ArrowLeft :size="16" /> Back to tasks</RouterLink
    >
    <div v-if="tasksStore.loading && !task" class="detail-panel skeleton"></div>
    <section v-else-if="task" class="detail-panel">
      <div class="detail-topline">
        <span class="eyebrow">TASK-{{ String(task.id).padStart(3, '0') }}</span
        ><TaskStatusBadge :completed="task.is_completed" />
      </div>
      <h1 class="font-display detail-title">{{ task.title }}</h1>
      <p class="detail-description">{{ task.description }}</p>
      <div class="detail-actions">
        <AppButton @click="toggle"
          ><Check :size="17" /> {{ task.is_completed ? 'Reopen task' : 'Mark complete' }}</AppButton
        ><RouterLink
          class="app-button app-button--quiet"
          :to="{ name: 'task-edit', params: { id: task.id } }"
          ><Pencil :size="16" /> Edit</RouterLink
        ><AppButton variant="danger-quiet" @click="deleteOpen = true"
          ><Trash2 :size="16" /> Delete</AppButton
        >
      </div>
    </section>
    <div v-else class="inline-state">
      <p>The task could not be loaded.</p>
      <RouterLink class="text-link" :to="{ name: 'tasks' }">Return to tasks</RouterLink>
    </div>
    <AppConfirmDialog
      :open="deleteOpen"
      :busy="tasksStore.saving"
      title="Delete this task?"
      message="This task will be permanently removed from your workspace."
      @cancel="deleteOpen = false"
      @confirm="remove"
    />
  </div>
</template>
