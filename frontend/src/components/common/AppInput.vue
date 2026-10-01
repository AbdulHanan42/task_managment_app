<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: undefined },
  error: { type: String, default: '' },
  multiline: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="field" :for="name">
    <span class="field-label">{{ label }}</span>
    <textarea
      v-if="multiline"
      :id="name"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${name}-error` : undefined"
      rows="5"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <input
      v-else
      :id="name"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${name}-error` : undefined"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" :id="`${name}-error`" class="field-error">{{ error }}</span>
  </label>
</template>
