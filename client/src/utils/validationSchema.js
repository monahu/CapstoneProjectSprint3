import * as Yup from "yup";

export const getValidationSchema = (isSignInForm) => {
  return Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    ...(isSignInForm
      ? {}
      : {
          userName: Yup.string()
            .min(3, "Username must be at least 3 characters")
            .required("Username is required"),
          firstName: Yup.string().required("First name is required"),
          lastName: Yup.string().required("Last name is required"),
          phone: Yup.string().matches(
            /^\d{3}\s?\d{3}\s?\d{4}$/,
            "Invalid phone number format"
          ),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Please confirm your password"),
        }),
  });
};
