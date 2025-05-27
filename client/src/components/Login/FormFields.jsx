import { Field, ErrorMessage } from "formik";

export const SignUpFields = () => (
  <>
    {/* Username */}
    <div>
      <label
        htmlFor="userName"
        className="block text-sm font-medium text-gray-900"
      >
        Username<span className="text-pink-600">*</span>
      </label>
      <div className="mt-2">
        <Field
          name="userName"
          type="text"
          placeholder="Username"
          className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        />
        <ErrorMessage
          name="userName"
          component="div"
          className="mt-1 text-sm text-red-600"
        />
      </div>
    </div>

    {/* First and Last Name */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-900"
        >
          First Name<span className="text-pink-600">*</span>
        </label>
        <Field
          name="firstName"
          type="text"
          placeholder="enter your first name..."
          className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        />
        <ErrorMessage
          name="firstName"
          component="div"
          className="mt-1 text-sm text-red-600"
        />
      </div>
      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-900"
        >
          Last Name<span className="text-pink-600">*</span>
        </label>
        <Field
          name="lastName"
          type="text"
          placeholder="enter your last name..."
          className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        />
        <ErrorMessage
          name="lastName"
          component="div"
          className="mt-1 text-sm text-red-600"
        />
      </div>
    </div>

    {/* Phone */}
    <div>
      <label
        htmlFor="phone"
        className="block text-sm font-medium text-gray-900"
      >
        Phone
      </label>
      <Field
        name="phone"
        type="tel"
        placeholder="xxx xxx xxxx"
        className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
      />
      <ErrorMessage
        name="phone"
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  </>
);

export const EmailField = () => (
  <div>
    <label
      htmlFor="email"
      className="block text-sm/6 font-medium text-gray-900"
    >
      Email address<span className="text-pink-600">*</span>
    </label>
    <div className="mt-2">
      <Field
        name="email"
        type="email"
        autoComplete="email"
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />
      <ErrorMessage
        name="email"
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  </div>
);

export const PasswordField = () => (
  <div>
    <label
      htmlFor="password"
      className="block text-sm/6 font-medium text-gray-900"
    >
      Password<span className="text-pink-600">*</span>
    </label>
    <div className="mt-2">
      <Field
        name="password"
        type="password"
        autoComplete="current-password"
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />
      <ErrorMessage
        name="password"
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  </div>
);

export const ConfirmPasswordField = () => (
  <div>
    <label
      htmlFor="confirmPassword"
      className="block text-sm font-medium text-gray-900"
    >
      Confirm Password<span className="text-pink-600">*</span>
    </label>
    <Field
      name="confirmPassword"
      type="password"
      placeholder="Confirm your password"
      className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-red-500 sm:text-sm"
    />
    <ErrorMessage
      name="confirmPassword"
      component="div"
      className="mt-1 text-sm text-red-600"
    />
  </div>
);
