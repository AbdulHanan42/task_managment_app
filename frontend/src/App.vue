<script setup>
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import AppToast from './components/common/AppToast.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <component
      :is="Component"
      v-if="route.meta.layout === 'auth' || route.meta.layout === 'plain'"
    />
    <AppLayout v-else>
      <component :is="Component" />
    </AppLayout>
  </RouterView>
  <AppToast />
</template>
