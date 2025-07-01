import { Field, ErrorMessage, useField, useFormikContext  } from 'formik'
import { UI_TEXT } from '../../utils/constants/ui'
import { FORM_PLACEHOLDERS } from '../../utils/constants/form'
import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

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

export const TitleField = () => (
  <FormField
    id='title'
    name='title'
    type='text'
    label={UI_TEXT.labels.title}
    autoComplete='off'
    required
  />
)

export const ImageUploadField = () => {
  const { setFieldValue } = useFormikContext()
  const [field, meta] = useField('image')

  return (
    <div className='mb-4'>
      <label
        htmlFor='image'
        className={FIELD_STYLES.label}
      >
        {UI_TEXT.labels.image}
        <RequiredIndicator />
      </label>
      <div className='mt-2'>
        <input
          id='image'
          name='image'
          type='file'
          accept='image/*'
          onChange={(event) => {
            setFieldValue('image', event.currentTarget.files[0])
          }}
          className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500'
        />
        {meta.touched && meta.error && (
          <div className={FIELD_STYLES.error}>{meta.error}</div>
        )}
      </div>
    </div>
  )
}

export const RichTextField = () => {
  const { setFieldValue } = useFormikContext()
  const [field, meta] = useField('content')

  const editor = useEditor({
    extensions: [StarterKit],
    content: field.value || '',
    onUpdate: ({ editor }) => {
      setFieldValue('content', editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && field.value) {
      editor.commands.setContent(field.value)
    }
  }, [editor, field.value])

  return (
    <div className='mb-4'>
      <label htmlFor='content' className={FIELD_STYLES.label}>
        {UI_TEXT.labels.content || 'Content'}
        <RequiredIndicator />
      </label>
      <div
        id='content'
        className='mt-2 min-h-[150px] rounded-md border border-gray-300 p-2 focus-within:border-indigo-600 prose max-w-full'
      >
        <EditorContent editor={editor} />
      </div>
      {meta.touched && meta.error && (
        <div className={FIELD_STYLES.error}>{meta.error}</div>
      )}
    </div>
  )
}

