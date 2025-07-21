export const AUTH_CONFIG = {
  minPasswordLength: 6,
  minUsernameLength: 3,
  avatarBaseUrl: 'https://i.pravatar.cc/150?img=',
  maxAvatarNumber: 70,
  // MongoDB Model Limits
  maxDisplayNameLength: 50,
  maxFirstNameLength: 30,
  maxLastNameLength: 30,
  minDisplayNameLength: 2,
  minFirstNameLength: 1,
  minLastNameLength: 1,
}

export const VALIDATION_MESSAGES = {
  email: {
    invalid: 'Please provide a valid email address', // Match MongoDB message
    required: 'Email is required',
  },
  password: {
    minLength: 'Password must be at least 6 characters',
    required: 'Password is required',
    mustMatch: 'Passwords must match',
    confirmRequired: 'Please confirm your password',
  },
  displayName: {
    minLength: 'Display name must be at least 2 characters',
    maxLength: 'Display name cannot exceed 50 characters',
    pattern:
      'Display name must be at least 2 characters and contain only letters, numbers, spaces, hyphens, and apostrophes',
    required: 'Username is required',
  },
  firstName: {
    minLength: 'First name must be at least 1 character',
    maxLength: 'First name cannot exceed 30 characters',
    pattern:
      'First name can only contain letters, spaces, hyphens, and apostrophes',
    required: 'First name is required',
  },
  lastName: {
    minLength: 'Last name must be at least 1 character',
    maxLength: 'Last name cannot exceed 30 characters',
    pattern:
      'Last name can only contain letters, spaces, hyphens, and apostrophes',
    required: 'Last name is required',
  },
  phone: {
    invalid: 'Please provide a valid phone number', // Match MongoDB message
    pattern: /^[+]?[1-9][\d\s\-()]{0,15}$/, // Allow spaces, hyphens, and parentheses
  },
}

// Regex patterns matching MongoDB validators
export const VALIDATION_PATTERNS = {
  displayName: /^[a-zA-Z0-9\s'-]{2,}$/, // alphanumeric + spaces, hyphens, apostrophes, min 2 chars
  firstName: /^[a-zA-Z\s'-]+$/, // alpha + spaces, hyphens, apostrophes
  lastName: /^[a-zA-Z\s'-]+$/, // alpha + spaces, hyphens, apostrophes
}
