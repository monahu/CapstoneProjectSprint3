import { Field, ErrorMessage } from 'formik'
import { UI_TEXT } from '../../utils/constants/ui'
import { FORM_PLACEHOLDERS } from '../../utils/constants/form'

// Common styles
const FIELD_STYLES = {
  label: 'block text-sm font-medium text-gray-900',
  input:
    'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm',
  error: 'mt-1 text-sm text-red-600',
  required: 'text-pink-600',
  optional: 'text-sm text-gray-500 ml-1',
}

const RequiredIndicator = () => (
  <span
    className={FIELD_STYLES.required}
    aria-label='required'
  >
    {UI_TEXT.labels.required}
  </span>
)

const FormField = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  autoComplete,
  className = '',
}) => (
  <div className={className}>
    <label
      htmlFor={id}
      className={FIELD_STYLES.label}
    >
      {label}
      {required ? (
        <RequiredIndicator />
      ) : (
        <span className={FIELD_STYLES.optional}>(optional)</span>
      )}
    </label>
    <div className='mt-2'>
      <Field
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={FIELD_STYLES.input}
        aria-required={required}
        aria-describedby={`${name}-error`}
      />
      <ErrorMessage
        name={name}
        component='div'
        className={FIELD_STYLES.error}
        id={`${name}-error`}
        role='alert'
        aria-live='polite'
      />
    </div>
  </div>
)

export const SignUpFields = () => (
  <div
    role='group'
    aria-labelledby='personal-info-legend'
  >
    <h3
      id='personal-info-legend'
      className='sr-only'
    >
      Personal Information
    </h3>

    <FormField
      id='userName'
      name='userName'
      label={UI_TEXT.labels.username}
      placeholder={FORM_PLACEHOLDERS.username}
      required
      className='mb-4'
    />

    <div
      className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'
      role='group'
      aria-labelledby='name-legend'
    >
      <h4
        id='name-legend'
        className='sr-only'
      >
        Name Information
      </h4>

      <FormField
        id='firstName'
        name='firstName'
        label={UI_TEXT.labels.firstName}
        placeholder={FORM_PLACEHOLDERS.firstName}
        required
      />

      <FormField
        id='lastName'
        name='lastName'
        label={UI_TEXT.labels.lastName}
        placeholder={FORM_PLACEHOLDERS.lastName}
        required
      />
    </div>

    <FormField
      id='phone'
      name='phone'
      type='tel'
      label={UI_TEXT.labels.phone}
      placeholder={FORM_PLACEHOLDERS.phone}
      className='mb-4'
    />
  </div>
)

export const EmailField = () => (
  <FormField
    id='email'
    name='email'
    type='email'
    label={UI_TEXT.labels.email}
    autoComplete='email'
    required
  />
)

export const PasswordField = () => (
  <FormField
    id='password'
    name='password'
    type='password'
    label={UI_TEXT.labels.password}
    autoComplete='current-password'
    required
  />
)

export const ConfirmPasswordField = () => (
  <FormField
    id='confirmPassword'
    name='confirmPassword'
    type='password'
    label={UI_TEXT.labels.confirmPassword}
    placeholder={FORM_PLACEHOLDERS.confirmPassword}
    required
  />
)
