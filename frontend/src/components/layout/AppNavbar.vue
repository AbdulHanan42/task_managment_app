<script setup>
import { computed } from 'vue'
import { LogOut, Menu } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { initials } from '../../utils/formatters'

defineEmits(['menu'])
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const title = computed(() => route.meta.title || 'Workspace')

function logout() {
  auth.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <header class="topbar">
    <button class="icon-button menu-toggle" aria-label="Open navigation" @click="$emit('menu')">
      <Menu :size="21" />
    </button>
    <div class="topbar-title font-display">{{ title }}</div>
    <div class="topbar-actions">
      <RouterLink class="profile-chip" :to="{ name: 'profile' }"
        ><span class="avatar avatar--small">{{ initials(auth.user?.name) }}</span
        ><span class="profile-chip-name">{{
          auth.user?.name || auth.user?.username
        }}</span></RouterLink
      ><button
        class="icon-button logout-button"
        title="Sign out"
        aria-label="Sign out"
        @click="logout"
      >
        <LogOut :size="18" />
      </button>
    </div>
  </header>
</template>
