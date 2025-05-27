export const FORM_CONFIG = {
  maxWidth: {
    sm: "480px",
    lg: "600px",
  },
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
      "userName",
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "phone",
    ],
    signIn: ["email", "password"],
  },
  initialValues: {
    signUp: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    signIn: {
      email: "",
      password: "",
    },
  },
};

export const FORM_PLACEHOLDERS = {
  username: "Username",
  firstName: "enter your first name...",
  lastName: "enter your last name...",
  phone: "xxx xxx xxxx",
  confirmPassword: "Confirm your password",
  search: "Search",
};
