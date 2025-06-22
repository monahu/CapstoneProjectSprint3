import { Field, ErrorMessage } from 'formik'
import { UI_TEXT } from '../../utils/constants/ui'
import { FORM_PLACEHOLDERS } from '../../utils/constants/form'

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

    {/* Username */}
    <div className='mb-4'>
      <label
        htmlFor='userName'
        className='block text-sm font-medium text-gray-900'
      >
        {UI_TEXT.labels.username}
        <span
          className='text-pink-600'
          aria-label='required'
        >
          {UI_TEXT.labels.required}
        </span>
      </label>
      <div className='mt-2'>
        <Field
          id='userName'
          name='userName'
          type='text'
          placeholder={FORM_PLACEHOLDERS.username}
          className='block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm'
          aria-required='true'
          aria-describedby='userName-error'
        />
        <ErrorMessage
          name='userName'
          component='div'
          className='mt-1 text-sm text-red-600'
          id='userName-error'
          role='alert'
          aria-live='polite'
        />
      </div>
    </div>

    {/* First and Last Name */}
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

      <div>
        <label
          htmlFor='firstName'
          className='block text-sm font-medium text-gray-900'
        >
          {UI_TEXT.labels.firstName}
          <span
            className='text-pink-600'
            aria-label='required'
          >
            {UI_TEXT.labels.required}
          </span>
        </label>
        <Field
          id='firstName'
          name='firstName'
          type='text'
          placeholder={FORM_PLACEHOLDERS.firstName}
          className='block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm'
          aria-required='true'
          aria-describedby='firstName-error'
        />
        <ErrorMessage
          name='firstName'
          component='div'
          className='mt-1 text-sm text-red-600'
          id='firstName-error'
          role='alert'
          aria-live='polite'
        />
      </div>

      <div>
        <label
          htmlFor='lastName'
          className='block text-sm font-medium text-gray-900'
        >
          {UI_TEXT.labels.lastName}
          <span
            className='text-pink-600'
            aria-label='required'
          >
            {UI_TEXT.labels.required}
          </span>
        </label>
        <Field
          id='lastName'
          name='lastName'
          type='text'
          placeholder={FORM_PLACEHOLDERS.lastName}
          className='block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm'
          aria-required='true'
          aria-describedby='lastName-error'
        />
        <ErrorMessage
          name='lastName'
          component='div'
          className='mt-1 text-sm text-red-600'
          id='lastName-error'
          role='alert'
          aria-live='polite'
        />
      </div>
    </div>

    {/* Phone */}
    <div className='mb-4'>
      <label
        htmlFor='phone'
        className='block text-sm font-medium text-gray-900'
      >
        {UI_TEXT.labels.phone}
        <span className='text-sm text-gray-500 ml-1'>(optional)</span>
      </label>
      <Field
        id='phone'
        name='phone'
        type='tel'
        placeholder={FORM_PLACEHOLDERS.phone}
        className='block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm'
        aria-describedby='phone-error'
      />
      <ErrorMessage
        name='phone'
        component='div'
        className='mt-1 text-sm text-red-600'
        id='phone-error'
        role='alert'
        aria-live='polite'
      />
    </div>
  </div>
)

export const EmailField = () => (
  <div>
    <label
      htmlFor='email'
      className='block text-sm/6 font-medium text-gray-900'
    >
      {UI_TEXT.labels.email}
      <span
        className='text-pink-600'
        aria-label='required'
      >
        {UI_TEXT.labels.required}
      </span>
    </label>
    <div className='mt-2'>
      <Field
        id='email'
        name='email'
        type='email'
        autoComplete='email'
        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
        aria-required='true'
        aria-describedby='email-error'
      />
      <ErrorMessage
        name='email'
        component='div'
        className='mt-1 text-sm text-red-600'
        id='email-error'
        role='alert'
        aria-live='polite'
      />
    </div>
  </div>
)

export const PasswordField = () => (
  <div>
    <label
      htmlFor='password'
      className='block text-sm/6 font-medium text-gray-900'
    >
      {UI_TEXT.labels.password}
      <span
        className='text-pink-600'
        aria-label='required'
      >
        {UI_TEXT.labels.required}
      </span>
    </label>
    <div className='mt-2'>
      <Field
        id='password'
        name='password'
        type='password'
        autoComplete='current-password'
        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
        aria-required='true'
        aria-describedby='password-error'
      />
      <ErrorMessage
        name='password'
        component='div'
        className='mt-1 text-sm text-red-600'
        id='password-error'
        role='alert'
        aria-live='polite'
      />
    </div>
  </div>
)

export const ConfirmPasswordField = () => (
  <div>
    <label
      htmlFor='confirmPassword'
      className='block text-sm font-medium text-gray-900'
    >
      {UI_TEXT.labels.confirmPassword}
      <span
        className='text-pink-600'
        aria-label='required'
      >
        {UI_TEXT.labels.required}
      </span>
    </label>
    <div className='mt-2'>
      <Field
        id='confirmPassword'
        name='confirmPassword'
        type='password'
        placeholder={FORM_PLACEHOLDERS.confirmPassword}
        className='block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-red-500 sm:text-sm'
        aria-required='true'
        aria-describedby='confirmPassword-error'
      />
      <ErrorMessage
        name='confirmPassword'
        component='div'
        className='mt-1 text-sm text-red-600'
        id='confirmPassword-error'
        role='alert'
        aria-live='polite'
      />
    </div>
  </div>
)
