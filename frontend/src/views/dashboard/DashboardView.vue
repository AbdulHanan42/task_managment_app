<script setup>
import { computed, onMounted } from 'vue'
import { ArrowRight, Check, CheckCircle2, Circle, Plus, Sparkles } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import AppButton from '../../components/common/AppButton.vue'
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge.vue'
import { useAuth } from '../../composables/useAuth'
import { useTasks } from '../../composables/useTasks'
import { useToast } from '../../composables/useToast'

const auth = useAuth()
const tasksStore = useTasks()
const toast = useToast()
const completeCount = computed(() => tasksStore.tasks.filter((task) => task.is_completed).length)
const openCount = computed(() => tasksStore.tasks.length - completeCount.value)
const completion = computed(() =>
  tasksStore.tasks.length ? Math.round((completeCount.value / tasksStore.tasks.length) * 100) : 0,
)
const latestTasks = computed(() => [...tasksStore.tasks].sort((a, b) => b.id - a.id).slice(0, 4))

onMounted(async () => {
  try {
    await tasksStore.fetchTasks()
  } catch (error) {
    toast.error(error.message)
  }
})
</script>

<template>
  <div class="dashboard-view">
    <section class="welcome-band">
      <div class="welcome-copy">
        <div class="welcome-eyebrow"><Sparkles :size="14" /> A FRESH LOOK AT YOUR WORK</div>
        <h1 class="font-display">
          Good to see you,<br /><em
            >{{ auth.user?.name?.split(' ')[0] || auth.user?.username || 'there' }}.</em
          >
        </h1>
        <p>Your plans, progress, and next small win are all here.</p>
      </div>
      <div class="welcome-illustration" aria-hidden="true">
        <span class="sun-disc"></span><span class="sun-arc"></span
        ><span class="plant-stem stem-one"></span><span class="plant-stem stem-two"></span
        ><span class="plant-leaf leaf-one"></span><span class="plant-leaf leaf-two"></span
        ><span class="plant-leaf leaf-three"></span
        ><span class="illustration-caption">MAKE SPACE<br />TO THINK</span>
      </div>
      <RouterLink class="welcome-action" :to="{ name: 'task-create' }"
        ><span>New task</span><span class="round-arrow"><Plus :size="19" /></span
      ></RouterLink>
    </section>
    <div
      v-if="tasksStore.loading && !tasksStore.tasks.length"
      class="stats-grid"
      aria-label="Loading task summary"
    >
      <div v-for="index in 3" :key="index" class="stat-card skeleton"></div>
    </div>
    <div v-else class="stats-grid">
      <article class="stat-card stat-card--total">
        <span class="stat-icon"><Circle :size="18" /></span><span class="stat-label">All tasks</span
        ><strong>{{ tasksStore.tasks.length }}</strong
        ><span class="stat-foot">Across your workspace</span>
      </article>
      <article class="stat-card stat-card--open">
        <span class="stat-icon"><Sparkles :size="18" /></span
        ><span class="stat-label">In progress</span><strong>{{ openCount }}</strong
        ><span class="stat-foot">Ready for your next step</span>
      </article>
      <article class="stat-card stat-card--done">
        <span class="stat-icon"><CheckCircle2 :size="18" /></span
        ><span class="stat-label">Complete</span><strong>{{ completeCount }}</strong
        ><span class="stat-foot">{{ completion }}% of your task list</span>
        <div class="stat-progress"><span :style="{ width: `${completion}%` }"></span></div>
      </article>
    </div>
    <section class="dashboard-lower">
      <div class="section-heading">
        <div>
          <span class="eyebrow">YOUR WORK, IN MOTION</span>
          <h2 class="font-display">Recently added</h2>
        </div>
        <RouterLink class="text-link" :to="{ name: 'tasks' }"
          >All tasks <ArrowRight :size="15"
        /></RouterLink>
      </div>
      <div v-if="tasksStore.error && !tasksStore.tasks.length" class="inline-state">
        <p>{{ tasksStore.error }}</p>
        <AppButton
          variant="quiet"
          @click="tasksStore.fetchTasks().catch((error) => toast.error(error.message))"
          >Try again</AppButton
        >
      </div>
      <div v-else-if="!tasksStore.loading && !latestTasks.length" class="empty-state">
        <span class="empty-symbol"><Check :size="22" /></span>
        <h3 class="font-display">Start with one thing.</h3>
        <p>Tasks you add will show up here, ready for a little momentum.</p>
        <RouterLink class="text-link" :to="{ name: 'task-create' }"
          >Add your first task <ArrowRight :size="15"
        /></RouterLink>
      </div>
      <div v-else class="recent-list">
        <RouterLink
          v-for="task in latestTasks"
          :key="task.id"
          class="recent-row"
          :to="{ name: 'task-details', params: { id: task.id } }"
          ><span class="recent-indicator" :class="{ 'recent-indicator--done': task.is_completed }"
            ><Check v-if="task.is_completed" :size="13" /></span
          ><span class="recent-title">{{ task.title }}</span
          ><TaskStatusBadge :completed="task.is_completed" /><ArrowRight
            class="recent-arrow"
            :size="16"
        /></RouterLink>
      </div>
    </section>
  </div>
</template>
