<script setup>
import { computed, onMounted, ref } from 'vue'
import { ListFilter, Plus, Search, X } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import AppButton from '../../components/common/AppButton.vue'
import AppConfirmDialog from '../../components/common/AppConfirmDialog.vue'
import TaskCard from '../../components/tasks/TaskCard.vue'
import { useTasks } from '../../composables/useTasks'
import { useToast } from '../../composables/useToast'

const tasksStore = useTasks()
const toast = useToast()
const query = ref('')
const status = ref('all')
const pendingDelete = ref(null)
const pendingDeleteTitle = computed(() => `Delete ${pendingDelete.value?.title || 'this task'}?`)
const visibleTasks = computed(() =>
  tasksStore.tasks.filter((task) => {
    const matchesQuery = `${task.title} ${task.description}`
      .toLowerCase()
      .includes(query.value.toLowerCase().trim())
    const matchesStatus =
      status.value === 'all' || task.is_completed === (status.value === 'complete')
    return matchesQuery && matchesStatus
  }),
)

onMounted(async () => {
  try {
    await tasksStore.fetchTasks()
  } catch (error) {
    toast.error(error.message)
  }
})

async function toggleTask(task) {
  try {
    await tasksStore.updateTask(task.id, {
      title: task.title,
      description: task.description,
      is_completed: !task.is_completed,
      priority: task.priority,
    })
    toast.success(!task.is_completed ? 'Task marked complete.' : 'Task moved back to in progress.')
  } catch (error) {
    toast.error(error.message)
    try {
      await tasksStore.fetchTasks()
    } catch {
      /* Keep the original request error visible. */
    }
  }
}

async function deleteTask() {
  if (!pendingDelete.value) return
  try {
    await tasksStore.deleteTask(pendingDelete.value.id)
    toast.success('Task deleted.')
  } catch (error) {
    toast.error(error.message)
  } finally {
    pendingDelete.value = null
  }
}

function clearFilters() {
  query.value = ''
  status.value = 'all'
}
</script>

<template>
  <div class="tasks-view">
    <section class="view-heading">
      <div>
        <span class="eyebrow">YOUR PERSONAL WORKSPACE</span>
        <h1 class="font-display">Tasks<span class="heading-period">.</span></h1>
        <p>Keep the next step clear and the important work moving.</p>
      </div>
      <RouterLink
        class="app-button app-button--primary create-task-link"
        :to="{ name: 'task-create' }"
        ><Plus :size="17" /> New task</RouterLink
      >
    </section>
    <section class="task-controls" aria-label="Task search and filters">
      <label class="search-box"
        ><Search :size="17" /><input
          v-model="query"
          type="search"
          placeholder="Search your tasks"
          aria-label="Search tasks" /><button
          v-if="query"
          class="icon-button search-clear"
          aria-label="Clear search"
          @click="query = ''"
        >
          <X :size="15" /></button></label
      ><label class="filter-select"
        ><ListFilter :size="17" /><select v-model="status" aria-label="Filter by status">
          <option value="all">All tasks</option>
          <option value="open">In progress</option>
          <option value="complete">Complete</option>
        </select></label
      ><span class="result-count"
        >{{ visibleTasks.length }} {{ visibleTasks.length === 1 ? 'task' : 'tasks' }}</span
      >
    </section>
    <div
      v-if="tasksStore.loading && !tasksStore.tasks.length"
      class="task-grid"
      aria-label="Loading tasks"
    >
      <div v-for="index in 4" :key="index" class="task-card skeleton"></div>
    </div>
    <div v-else-if="tasksStore.error && !tasksStore.tasks.length" class="inline-state">
      <p>{{ tasksStore.error }}</p>
      <AppButton
        variant="quiet"
        @click="tasksStore.fetchTasks().catch((error) => toast.error(error.message))"
        >Try again</AppButton
      >
    </div>
    <div v-else-if="!visibleTasks.length" class="empty-state empty-state--wide">
      <span class="empty-symbol"
        ><Search v-if="query || status !== 'all'" :size="22" /><Plus v-else :size="22"
      /></span>
      <h2 class="font-display">
        {{
          query || status !== 'all'
            ? 'Nothing matches just yet.'
            : 'A clear space for your next task.'
        }}
      </h2>
      <p>
        {{
          query || status !== 'all'
            ? 'Try another search or status filter.'
            : 'Add a task to give your ideas a place to land.'
        }}
      </p>
      <button v-if="query || status !== 'all'" class="text-link" @click="clearFilters">
        Clear filters <X :size="15" /></button
      ><RouterLink v-else class="text-link" :to="{ name: 'task-create' }"
        >Create a task <Plus :size="15"
      /></RouterLink>
    </div>
    <div v-else class="task-grid">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @delete="pendingDelete = $event"
      />
    </div>
    <AppConfirmDialog
      :open="Boolean(pendingDelete)"
      :busy="tasksStore.saving"
      :title="pendingDeleteTitle"
      message="This task will be permanently removed from your workspace."
      @cancel="pendingDelete = null"
      @confirm="deleteTask"
    />
  </div>
</template>
