import { Formik, Form } from "formik";
import { getValidationSchema } from "../../utils/validationSchema";
import {
  SignUpFields,
  EmailField,
  PasswordField,
  ConfirmPasswordField,
} from "./FormFields";

const LoginForm = ({ isSignInForm, onSubmit }) => {
  const initialValues = {
    email: "",
    password: "",
    ...(isSignInForm
      ? {}
      : {
          userName: "",
          firstName: "",
          lastName: "",
          phone: "",
          confirmPassword: "",
        }),
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (onSubmit) {
      onSubmit(values);
    }
    setSubmitting(false);
  };

  return (
    <Formik
      key={isSignInForm ? "signin" : "signup"}
      initialValues={initialValues}
      validationSchema={getValidationSchema(isSignInForm)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {!isSignInForm && <SignUpFields />}

          <EmailField />
          <PasswordField />

          {!isSignInForm && <ConfirmPasswordField />}

          <div className="flex items-center justify-between">
            <div className="text-sm/6">
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing..."
                : isSignInForm
                  ? "Log In"
                  : "Sign Up"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

/* LoginForm.propTypes = {
  isSignInForm: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func,
}; */

export default LoginForm;
