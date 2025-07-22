export const FORM_CONFIG = {
  validation: {
    password: {
      minLength: 8,
      maxLength: 20,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true,
    },
    username: {
      minLength: 3,
      maxLength: 20,
      allowedChars: /^[a-zA-Z0-9_]+$/,
    },
  },
  fields: {
    signUp: [
      'userName',
      'firstName',
      'lastName',
      'email',
      'password',
      'confirmPassword',
      'phone',
    ],
    signIn: ['email', 'password'],
  },
  initialValues: {
    signUp: {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
    signIn: {
      email: '',
      password: '',
    },
  },
  /*   maxWidth: {
    sm: "480px",
    lg: "600px",
  }, */
}

export const FORM_PLACEHOLDERS = {
  username: 'e.g. john123, mary_doe',
  firstName: 'e.g. John, Mary-Jane',
  lastName: "e.g. Smith, O'Connor",
  phone: '+1234567890 (optional)',
  email: 'your.email@example.com',
  password: 'Enter your password',
  confirmPassword: 'Confirm your password',
  search: 'Search',
}
