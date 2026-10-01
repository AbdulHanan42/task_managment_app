<script setup>
import { reactive, ref } from 'vue'
import { ArrowRight, CheckSquare } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppButton from '../../components/common/AppButton.vue'
import AppInput from '../../components/common/AppInput.vue'
import { useAuth } from '../../composables/useAuth'
import { useToast } from '../../composables/useToast'
import { validateCredentials } from '../../utils/validators'

const auth = useAuth()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const form = reactive({ username: '', password: '' })
const errors = ref({})
const message = ref('')

async function submit() {
  errors.value = validateCredentials(form)
  message.value = ''
  if (Object.keys(errors.value).length) return
  try {
    await auth.login(form)
    toast.success(`Welcome back, ${auth.user.name || auth.user.username}.`)
    const next = typeof route.query.next === 'string' ? route.query.next : '/dashboard'
    router.replace(next.startsWith('/') ? next : '/dashboard')
  } catch (error) {
    if (error.fieldErrors) errors.value = error.fieldErrors
    message.value = error.message
  }
}
</script>

<template>
  <main class="auth-screen">
    <div class="auth-brand">
      <span class="brand-mark"><CheckSquare :size="19" /></span
      ><span class="brand-name">taskflow<span>.</span></span>
    </div>
    <section class="auth-panel page-enter">
      <div class="auth-kicker"><span class="kicker-line"></span> YOUR WORKSPACE, READY</div>
      <h1 class="auth-title font-display">Make today<br /><em>count.</em></h1>
      <p class="auth-copy">Sign in to pick up where your best work begins.</p>
      <form class="auth-form" @submit.prevent="submit">
        <AppInput
          v-model="form.username"
          name="username"
          label="Username"
          placeholder="Your username"
          autocomplete="username"
          :error="errors.username"
        /><AppInput
          v-model="form.password"
          name="password"
          label="Password"
          type="password"
          placeholder="Your password"
          autocomplete="current-password"
          :error="errors.password"
        />
        <div v-if="message" class="form-alert" role="alert">{{ message }}</div>
        <AppButton type="submit" class="auth-submit" :loading="auth.loading"
          >Sign in <ArrowRight :size="17"
        /></AppButton>
      </form>
      <p class="auth-switch">
        New to Taskflow? <RouterLink :to="{ name: 'register' }">Create an account</RouterLink>
      </p>
    </section>
    <div class="auth-side-note">
      <span>01</span>
      <p>Small steps,<br />meaningful progress.</p>
    </div>
    <div class="auth-bottom">TASKFLOW <span>·</span> PERSONAL TASK MANAGEMENT</div>
  </main>
</template>
