<script setup>
import { ref } from 'vue'
import AppNavbar from './AppNavbar.vue'
import AppSidebar from './AppSidebar.vue'

const menuOpen = ref(false)
</script>

<template>
  <div class="app-shell">
    <AppSidebar :open="menuOpen" @close="menuOpen = false" />
    <div class="main-column">
      <AppNavbar @menu="menuOpen = true" />
      <main class="page-content page-enter"><slot /></main>
      <footer class="app-footer">
        <span>Taskflow</span><span>Keep the important things moving.</span>
      </footer>
    </div>
  </div>
</template>
