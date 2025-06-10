export const AUTH_CONFIG = {
  minPasswordLength: 6,
  minUsernameLength: 3,
  avatarBaseUrl: 'https://i.pravatar.cc/150?img=',
  maxAvatarNumber: 70,
}

export const VALIDATION_MESSAGES = {
  email: {
    invalid: 'Invalid email address',
    required: 'Email is required',
  },
  password: {
    minLength: 'Password must be at least 6 characters',
    required: 'Password is required',
    mustMatch: 'Passwords must match',
    confirmRequired: 'Please confirm your password',
  },
  username: {
    minLength: 'Username must be at least 3 characters',
    required: 'Username is required',
  },
  name: {
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
  },
  phone: {
    invalidFormat: 'Invalid phone number format',
    pattern: /^\d{3}\s?\d{3}\s?\d{4}$/,
  },
}
