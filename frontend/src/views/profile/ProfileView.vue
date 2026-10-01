<script setup>
import { reactive, ref, watch } from 'vue'
import { Pencil } from 'lucide-vue-next'
import AppButton from '../../components/common/AppButton.vue'
import AppInput from '../../components/common/AppInput.vue'
import { useAuth } from '../../composables/useAuth'
import { useToast } from '../../composables/useToast'
import { initials } from '../../utils/formatters'
import { validateProfile } from '../../utils/validators'

const auth = useAuth()
const toast = useToast()
const editing = ref(false)
const errors = ref({})
const message = ref('')
const form = reactive({ name: '', username: '', email: '' })

watch(
  () => auth.user,
  (user) => {
    form.name = user?.name || ''
    form.username = user?.username || ''
    form.email = user?.email || ''
  },
  { immediate: true },
)

function startEditing() {
  errors.value = {}
  message.value = ''
  editing.value = true
}

function cancelEditing() {
  form.name = auth.user?.name || ''
  form.username = auth.user?.username || ''
  form.email = auth.user?.email || ''
  errors.value = {}
  message.value = ''
  editing.value = false
}

async function saveProfile() {
  errors.value = validateProfile(form)
  message.value = ''
  if (Object.keys(errors.value).length) return
  try {
    await auth.updateProfile({
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
    })
    editing.value = false
    toast.success('Your profile has been updated.')
  } catch (error) {
    errors.value = error.fieldErrors || {}
    message.value = error.message
  }
}
</script>

<template>
  <div class="profile-view">
    <section class="view-heading">
      <div>
        <span class="eyebrow">YOUR ACCOUNT</span>
        <h1 class="font-display">Profile<span class="heading-period">.</span></h1>
        <p>Your account details and contact information.</p>
      </div>
      <AppButton v-if="!editing" variant="quiet" @click="startEditing"
        ><Pencil :size="15" /> Edit profile</AppButton
      >
    </section>
    <section class="profile-panel">
      <div class="profile-identity">
        <span class="avatar avatar--large">{{ initials(auth.user?.name) }}</span>
        <div>
          <h2 class="font-display">{{ auth.user?.name }}</h2>
          <p>@{{ auth.user?.username }}</p>
        </div>
      </div>
      <form v-if="editing" class="profile-edit-form" @submit.prevent="saveProfile">
        <AppInput
          v-model="form.name"
          name="profile-name"
          label="Name"
          autocomplete="name"
          :error="errors.name"
        />
        <AppInput
          v-model="form.username"
          name="profile-username"
          label="Username"
          autocomplete="username"
          :error="errors.username"
        />
        <AppInput
          v-model="form.email"
          name="profile-email"
          label="Email"
          type="email"
          autocomplete="email"
          :error="errors.email"
        />
        <p v-if="message" class="form-alert" role="alert">{{ message }}</p>
        <div class="form-actions">
          <AppButton variant="quiet" @click="cancelEditing">Cancel</AppButton
          ><AppButton type="submit" :loading="auth.loading">Save profile</AppButton>
        </div>
      </form>
      <dl v-else class="profile-fields">
        <div>
          <dt>Name</dt>
          <dd>{{ auth.user?.name }}</dd>
        </div>
        <div>
          <dt>Username</dt>
          <dd>{{ auth.user?.username }}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{{ auth.user?.email }}</dd>
        </div>
      </dl>
      <p class="profile-note">Changes update your account details across this workspace.</p>
    </section>
  </div>
</template>
