<script setup>
import { computed } from 'vue'
import { ArrowLeft, House } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const props = defineProps({ code: { type: String, default: '404' } })
const copy = computed(
  () =>
    ({
      401: ['Sign in required', 'This page needs an authenticated session.'],
      403: ['Access denied', 'Your account does not have access to this page.'],
      404: ['Page not found', 'This page has wandered outside your workspace.'],
    })[props.code] || ['Something went wrong', 'Return to your workspace and try again.'],
)
</script>

<template>
  <main class="error-screen page-enter">
    <RouterLink class="brand error-brand" :to="{ name: 'login' }"
      ><span class="brand-mark"><House :size="18" /></span
      ><span class="brand-name">taskflow<span>.</span></span></RouterLink
    ><span class="error-code font-display">{{ code }}</span>
    <h1 class="font-display">{{ copy[0] }}</h1>
    <p>{{ copy[1] }}</p>
    <RouterLink class="app-button app-button--primary" :to="{ name: 'login' }"
      ><ArrowLeft :size="16" /> Return to sign in</RouterLink
    >
  </main>
</template>
