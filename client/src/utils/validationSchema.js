import * as Yup from "yup";
import { AUTH_CONFIG, VALIDATION_MESSAGES } from "./constants/auth";

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
              AUTH_CONFIG.minUsernameLength,
              VALIDATION_MESSAGES.username.minLength
            )
            .required(VALIDATION_MESSAGES.username.required),
          firstName: Yup.string().required(
            VALIDATION_MESSAGES.name.firstNameRequired
          ),
          lastName: Yup.string().required(
            VALIDATION_MESSAGES.name.lastNameRequired
          ),
          phone: Yup.string().matches(
            VALIDATION_MESSAGES.phone.pattern,
            VALIDATION_MESSAGES.phone.invalidFormat
          ),
          confirmPassword: Yup.string()
            .oneOf(
              [Yup.ref("password")],
              VALIDATION_MESSAGES.password.mustMatch
            )
            .required(VALIDATION_MESSAGES.password.confirmRequired),
        }),
  });
};
