export function validateTask(values) {
  const errors = {}
  if (!values.title?.trim()) errors.title = 'Add a task title.'
  if (!values.description?.trim()) errors.description = 'Add a description.'
  return errors
}

export function validateCredentials(values, isRegistration = false) {
  const errors = {}
  if (!values.username?.trim()) errors.username = 'Enter your username.'
  if (!values.password) errors.password = 'Enter your password.'
  if (isRegistration) {
    if (!values.name?.trim()) errors.name = 'Enter your name.'
    if (!values.email?.trim()) errors.email = 'Enter your email.'
  }
  return errors
}

export function validateProfile(values) {
  const errors = {}
  if (!values.name?.trim()) errors.name = 'Enter your name.'
  if (!values.username?.trim()) errors.username = 'Enter your username.'
  if (!values.email?.trim()) errors.email = 'Enter your email.'
  return errors
}
