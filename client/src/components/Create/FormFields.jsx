import { Field, ErrorMessage, useField, useFormikContext } from 'formik';
import { UI_TEXT } from '../../utils/constants/ui';
import { FORM_PLACEHOLDERS } from '../../utils/constants/form';
import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const FIELD_STYLES = {
  label: 'block text-sm font-medium text-gray-900',
  input:
    'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm',
  error: 'mt-1 text-sm text-red-600',
  required: 'text-pink-600',
  optional: 'text-sm text-gray-500 ml-1',
};

const RequiredIndicator = () => (
  <span className={FIELD_STYLES.required} aria-label="required">
    {UI_TEXT.labels.required}
  </span>
);

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
    <label htmlFor={id} className={FIELD_STYLES.label}>
      {label}
      {required ? (
        <RequiredIndicator />
      ) : (
        <span className={FIELD_STYLES.optional}>(optional)</span>
      )}
    </label>
    <div className="mt-2">
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
        component="div"
        className={FIELD_STYLES.error}
        id={`${name}-error`}
        role="alert"
        aria-live="polite"
      />
    </div>
  </div>
);

export const TitleField = () => (
  <FormField
    id="title"
    name="title"
    type="text"
    label={UI_TEXT.labels.title}
    autoComplete="off"
    required
  />
);

export const ImageUploadField = () => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField('image');

  return (
    <div className="mb-4">
      <label htmlFor="image" className={FIELD_STYLES.label}>
        {UI_TEXT.labels.image}
        <RequiredIndicator />
      </label>
      <div className="mt-2">
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={(event) => {
            setFieldValue('image', event.currentTarget.files[0]);
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
        />
        {meta.touched && meta.error && (
          <div className={FIELD_STYLES.error}>{meta.error}</div>
        )}
      </div>
    </div>
  );
};

export const RichTextField = () => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField('content');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: field.value || '',
    onUpdate: ({ editor }) => {
      setFieldValue('content', editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && field.value && editor.getHTML() !== field.value) {
      editor.commands.setContent(field.value);
    }
  }, [editor]);

  const Toolbar = () => (
    <div className="flex gap-2 mb-2 flex-wrap items-center">
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }} className={editor.isActive('bold') ? 'font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>B</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }} className={editor.isActive('italic') ? 'italic bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>I</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }} className={editor.isActive('strike') ? 'line-through bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>S</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }} className={editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>• List</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }} className={editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>1. List</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }} className={editor.isActive('paragraph') ? 'bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>P</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }} className={editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>H1</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }} className={editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>H2</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }} className={editor.isActive('heading', { level: 3 }) ? 'bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-gray-300' : 'px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50'}>H3</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }} className="px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50">↺ Undo</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }} className="px-2 py-1 rounded border border-gray-300 hover:bg-indigo-50">↻ Redo</button>
    </div>
  );

  return (
    <div className="mb-4">
      <label htmlFor="content" className={FIELD_STYLES.label}>
        {UI_TEXT.labels.content || 'Content'}
        <RequiredIndicator />
      </label>
      <div className="mt-2 min-h-[150px] rounded-md border border-gray-300 p-2 focus-within:border-indigo-600 prose max-w-full">
        {editor && <Toolbar />}
        {editor && (
          <EditorContent
            editor={editor}
            className="tiptap-editor prose prose-sm max-w-none min-h-[150px] p-2"
          />
        )}
      </div>
      {meta.touched && meta.error && (
        <div className={FIELD_STYLES.error}>{meta.error}</div>
      )}
    </div>
  );
};
