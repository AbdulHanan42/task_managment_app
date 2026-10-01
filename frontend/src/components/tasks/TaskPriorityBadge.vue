<script setup>
import { computed } from 'vue'
import { TASK_PRIORITY_LABELS } from '../../utils/constants'

const props = defineProps({ priority: { type: String, default: 'regular' } })
const label = computed(() => TASK_PRIORITY_LABELS[props.priority] || TASK_PRIORITY_LABELS.regular)
</script>

<template>
  <span class="priority-badge" :class="`priority-badge--${priority}`">{{ label }}</span>
</template>
