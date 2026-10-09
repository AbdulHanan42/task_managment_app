<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowRight, CheckSquare } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import AppButton from '../../components/common/AppButton.vue'
import AppInput from '../../components/common/AppInput.vue'
import { useAuth } from '../../composables/useAuth'
import { useToast } from '../../composables/useToast'
import { validateCredentials } from '../../utils/validators'

const auth = useAuth()
const router = useRouter()
const toast = useToast()
const form = reactive({ name: '', username: '', email: '', password: '' })
const errors = ref({})
const message = ref('')
const passwordStrength = computed(() => {
  const password = form.password
  const score = [
    password.length >= 8,
    /[A-Za-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length

  return {
    score,
    label: ['', 'Weak', 'Fair', 'Good', 'Strong'][score],
  }
})

async function submit() {
  errors.value = validateCredentials(form, true)
  message.value = ''
  if (Object.keys(errors.value).length) return
  try {
    await auth.register(form)
    toast.success('Your account is ready. Sign in to continue.')
    router.replace({ name: 'login' })
  } catch (error) {
    if (error.fieldErrors) errors.value = error.fieldErrors
    message.value = error.message
  }
}
</script>

<template>
  <main class="auth-screen auth-screen--register">
    <div class="auth-brand">
      <span class="brand-mark"><CheckSquare :size="19" /></span
      ><span class="brand-name">taskflow<span>.</span></span>
    </div>
    <section class="auth-panel auth-panel--register page-enter">
      <div class="auth-kicker"><span class="kicker-line"></span> START WITH A CLEAR DESK</div>
      <h1 class="auth-title font-display">A little more<br /><em>in focus.</em></h1>
      <p class="auth-copy">Create your personal workspace and keep the important things moving.</p>
      <form class="auth-form" @submit.prevent="submit">
        <AppInput
          v-model="form.name"
          name="name"
          label="Name"
          placeholder="Your name"
          autocomplete="name"
          :error="errors.name"
        /><AppInput
          v-model="form.username"
          name="username"
          label="Username"
          placeholder="Choose a username"
          autocomplete="username"
          :error="errors.username"
        /><AppInput
          v-model="form.email"
          name="email"
          label="Email"
          placeholder="you@example.com"
          autocomplete="email"
          :error="errors.email"
        />
        <div class="register-password-field">
          <AppInput
            v-model="form.password"
            name="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            autocomplete="new-password"
            :error="errors.password"
          />
          <div class="password-strength">
            <div
              class="password-strength__meter"
              :class="
                passwordStrength.score
                  ? `password-strength__meter--${passwordStrength.label.toLowerCase()}`
                  : ''
              "
              role="meter"
              aria-label="Password strength"
              aria-valuemin="0"
              aria-valuemax="4"
              :aria-valuenow="passwordStrength.score"
              :aria-valuetext="passwordStrength.label || 'No password entered'"
            >
              <span
                v-for="segment in 4"
                :key="segment"
                class="password-strength__segment"
                :class="{ 'password-strength__segment--filled': passwordStrength.score >= segment }"
              />
            </div>
            <div class="password-strength__meta">
              <span>Use 8 or more characters with a mix of letters, numbers &amp; symbols.</span>
              <strong v-if="passwordStrength.label">{{ passwordStrength.label }}</strong>
            </div>
          </div>
        </div>
        <div v-if="message" class="form-alert" role="alert">{{ message }}</div>
        <AppButton type="submit" class="auth-submit" :loading="auth.loading"
          >Create account <ArrowRight :size="17"
        /></AppButton>
      </form>
      <p class="auth-switch">
        Already have an account? <RouterLink :to="{ name: 'login' }">Sign in</RouterLink>
      </p>
    </section>
    <div class="auth-bottom">TASKFLOW <span>·</span> PERSONAL TASK MANAGEMENT</div>
  </main>
</template>
