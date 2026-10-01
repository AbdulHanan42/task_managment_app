<script setup>
defineProps({ completed: { type: Boolean, default: false } })
</script>

<template>
  <span class="status-badge" :class="completed ? 'status-badge--done' : 'status-badge--open'"
    ><span class="status-dot"></span>{{ completed ? 'Complete' : 'In progress' }}</span
  >
</template>
