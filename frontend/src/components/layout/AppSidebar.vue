<script setup>
import { CheckSquare, LayoutDashboard, UserRound, X } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

defineProps({ open: { type: Boolean, default: false } })
defineEmits(['close'])
const links = [
  { name: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { name: 'tasks', label: 'Tasks', icon: CheckSquare },
  { name: 'profile', label: 'Profile', icon: UserRound },
]
</script>

<template>
  <button
    v-if="open"
    class="sidebar-scrim"
    aria-label="Close navigation"
    @click="$emit('close')"
  ></button>
  <aside class="sidebar" :class="{ 'sidebar--open': open }">
    <div class="brand-row">
      <RouterLink class="brand" :to="{ name: 'dashboard' }" @click="$emit('close')"
        ><span class="brand-mark"><CheckSquare :size="19" /></span
        ><span class="brand-name">taskflow<span>.</span></span></RouterLink
      ><button
        class="icon-button sidebar-close"
        aria-label="Close navigation"
        @click="$emit('close')"
      >
        <X :size="20" />
      </button>
    </div>
    <div class="sidebar-label">Workspace</div>
    <nav class="sidebar-nav" aria-label="Main navigation">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        class="nav-link"
        active-class="nav-link--active"
        @click="$emit('close')"
      >
        <component :is="link.icon" :size="18" :stroke-width="1.8" /><span>{{ link.label }}</span
        ><span v-if="link.name === 'tasks'" class="nav-dot"></span>
      </RouterLink>
    </nav>
    <div class="sidebar-bottom">
      <div class="sidebar-note">
        <span class="note-mark">✳</span>
        <p>Make room for<br /><strong>good work.</strong></p>
      </div>
      <div class="sidebar-version">TASKFLOW · PERSONAL SPACE</div>
    </div>
  </aside>
</template>
