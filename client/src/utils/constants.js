// App Configuration
export const APP_CONFIG = {
  name: "RestJAM",
  logo: "logo.png",
  supportEmail: "support@restjam.com",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  BROWSE: "/browse",
  PROFILE: "/profile",
  ERROR: "/error",
};

// Authentication
export const AUTH_CONFIG = {
  minPasswordLength: 6,
  minUsernameLength: 3,
  avatarBaseUrl: "https://i.pravatar.cc/150?img=",
  maxAvatarNumber: 150,
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  email: {
    invalid: "Invalid email address",
    required: "Email is required",
  },
  password: {
    minLength: "Password must be at least 6 characters",
    required: "Password is required",
    mustMatch: "Passwords must match",
    confirmRequired: "Please confirm your password",
  },
  username: {
    minLength: "Username must be at least 3 characters",
    required: "Username is required",
  },
  name: {
    firstNameRequired: "First name is required",
    lastNameRequired: "Last name is required",
  },
  phone: {
    invalidFormat: "Invalid phone number format",
    pattern: /^\d{3}\s?\d{3}\s?\d{4}$/,
  },
};

// Form Field Placeholders
export const PLACEHOLDERS = {
  username: "Username",
  firstName: "enter your first name...",
  lastName: "enter your last name...",
  phone: "xxx xxx xxxx",
  confirmPassword: "Confirm your password",
  search: "Search",
};

// UI Text
export const UI_TEXT = {
  login: {
    signIn: "Log in",
    signUp: "Sign up",
    toAccount: "to your account",
    processing: "Processing...",
    forgotPassword: "Forgot password?",
    newToApp: "New to RestJAM? 👉Sign Up👈 Now",
    alreadyRegistered: "Already registered? 👉Login In👈 Now.",
    loginSignup: "Login/Signup",
  },
  error: {
    pageNotFound: "Page Not Found",
    pageNotFoundDesc:
      "The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.",
    goHome: "Go Home",
    goBack: "Go Back",
    needHelp: "Need help? Contact our support team",
  },
  buttons: {
    getStarted: "Get Started",
    logIn: "Log In",
    signUp: "Sign Up",
    signOut: "Sign out",
    profile: "Your Profile",
    google: "Google",
  },
  labels: {
    username: "Username",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email address",
    password: "Password",
    confirmPassword: "Confirm Password",
    phone: "Phone",
    required: "*",
  },
  hero: {
    title: "Hello there",
    description:
      "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.",
    button: "Get Started",
  },
};

// Navigation
export const NAVIGATION = {
  userDropdown: [
    { name: UI_TEXT.buttons.profile, href: ROUTES.PROFILE },
    { name: UI_TEXT.buttons.signOut, href: "#", hasAction: true },
  ],
  hideLogoRoutes: [ROUTES.LOGIN, "/signup"],
  sidebar: [
    { name: "Home", href: ROUTES.HOME, icon: "House", current: true },
    { name: "Create", href: "/create", icon: "SquarePen", current: false },
    { name: "Profile", href: ROUTES.PROFILE, icon: "Settings", current: false },
  ],
  explore: {
    name: "Explore",
    href: "#",
    icon: "Telescope",
    current: false,
  },
  tags: [{ id: 1, name: "tag1", genre: "normal", current: false }],
};

// Social Links
export const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
  github: "#",
};

// Form Configuration
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
