import { Formik, Form } from "formik";
import { getValidationSchema } from "../../utils/validationSchema";
import {
  SignUpFields,
  ConfirmPasswordField,
} from "./FormFields";
import { UI_TEXT } from "../../utils/constants/ui";
import { FORM_CONFIG } from "../../utils/constants/form";
import FieldWithMic from "../Speech/FieldWithMic";
import SpeechButton from "../Speech/SpeechButton";

const LoginForm = ({ isSignInForm, onSubmit, isLoading }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      key={isSignInForm ? "signin" : "signup"}
      initialValues={
        isSignInForm
          ? FORM_CONFIG.initialValues.signIn
          : FORM_CONFIG.initialValues.signUp
      }
      validationSchema={getValidationSchema(isSignInForm)}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-6">
          {!isSignInForm && <SignUpFields />}

          <FieldWithMic name="email" type="email">
            <SpeechButton
              fieldName="email"
              setFieldValue={setFieldValue}
            />
          </FieldWithMic>

          <FieldWithMic name="password" type="password">
            <SpeechButton
              fieldName="password"
              setFieldValue={setFieldValue}
            />
          </FieldWithMic>

          {!isSignInForm && <ConfirmPasswordField />}

          <div className="flex items-center justify-between">
            <div className="text-sm/6">
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                {UI_TEXT.login.forgotPassword}
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isLoading
                ? UI_TEXT.login.processing
                : isSignInForm
                ? UI_TEXT.buttons.logIn
                : UI_TEXT.buttons.signUp}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
