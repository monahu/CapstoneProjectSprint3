import * as Yup from 'yup'
import {
  AUTH_CONFIG,
  VALIDATION_MESSAGES,
  VALIDATION_PATTERNS,
} from './constants/auth'

export const getValidationSchema = (isSignInForm) => {
  return Yup.object({
    email: Yup.string()
      .email(VALIDATION_MESSAGES.email.invalid)
      .required(VALIDATION_MESSAGES.email.required),
    password: Yup.string()
      .min(
        AUTH_CONFIG.minPasswordLength,
        VALIDATION_MESSAGES.password.minLength
      )
      .required(VALIDATION_MESSAGES.password.required),
    ...(isSignInForm
      ? {}
      : {
          userName: Yup.string()
            .min(
              AUTH_CONFIG.minDisplayNameLength,
              VALIDATION_MESSAGES.displayName.minLength
            )
            .max(
              AUTH_CONFIG.maxDisplayNameLength,
              VALIDATION_MESSAGES.displayName.maxLength
            )
            .matches(
              VALIDATION_PATTERNS.displayName,
              VALIDATION_MESSAGES.displayName.pattern
            )
            .required(VALIDATION_MESSAGES.displayName.required),
          firstName: Yup.string()
            .min(
              AUTH_CONFIG.minFirstNameLength,
              VALIDATION_MESSAGES.firstName.minLength
            )
            .max(
              AUTH_CONFIG.maxFirstNameLength,
              VALIDATION_MESSAGES.firstName.maxLength
            )
            .matches(
              VALIDATION_PATTERNS.firstName,
              VALIDATION_MESSAGES.firstName.pattern
            )
            .required(VALIDATION_MESSAGES.firstName.required),
          lastName: Yup.string()
            .min(
              AUTH_CONFIG.minLastNameLength,
              VALIDATION_MESSAGES.lastName.minLength
            )
            .max(
              AUTH_CONFIG.maxLastNameLength,
              VALIDATION_MESSAGES.lastName.maxLength
            )
            .matches(
              VALIDATION_PATTERNS.lastName,
              VALIDATION_MESSAGES.lastName.pattern
            )
            .required(VALIDATION_MESSAGES.lastName.required),
          phone: Yup.string()
            .matches(
              VALIDATION_MESSAGES.phone.pattern,
              VALIDATION_MESSAGES.phone.invalid
            )
            .nullable(), // Optional field, can be empty
          confirmPassword: Yup.string()
            .oneOf(
              [Yup.ref('password')],
              VALIDATION_MESSAGES.password.mustMatch
            )
            .required(VALIDATION_MESSAGES.password.confirmRequired),
        }),
  })
}
