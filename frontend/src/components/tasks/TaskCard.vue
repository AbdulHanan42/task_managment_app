<script setup>
import { ArrowUpRight, Check, MoreHorizontal } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import TaskStatusBadge from './TaskStatusBadge.vue'

defineProps({ task: { type: Object, required: true } })
defineEmits(['toggle', 'delete'])
</script>

<template>
  <article class="task-card" :class="{ 'task-card--complete': task.is_completed }">
    <button
      class="task-check"
      :class="{ 'task-check--checked': task.is_completed }"
      :aria-label="task.is_completed ? 'Mark task in progress' : 'Mark task complete'"
      @click="$emit('toggle', task)"
    >
      <Check v-if="task.is_completed" :size="14" :stroke-width="3" />
    </button>
    <div class="task-card-main">
      <RouterLink class="task-card-title" :to="{ name: 'task-details', params: { id: task.id } }">{{
        task.title
      }}</RouterLink>
      <p class="task-card-description">{{ task.description }}</p>
      <div class="task-card-meta">
        <TaskStatusBadge :completed="task.is_completed" /><span class="task-id"
          >TASK-{{ String(task.id).padStart(3, '0') }}</span
        >
      </div>
    </div>
    <div class="task-card-actions">
      <RouterLink
        class="icon-button"
        :to="{ name: 'task-details', params: { id: task.id } }"
        :aria-label="`Open ${task.title}`"
        ><ArrowUpRight :size="18" /></RouterLink
      ><button
        class="icon-button task-more"
        :aria-label="`Delete ${task.title}`"
        @click="$emit('delete', task)"
      >
        <MoreHorizontal :size="19" />
      </button>
    </div>
  </article>
</template>
