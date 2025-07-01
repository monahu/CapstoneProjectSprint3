import { Formik, Form } from 'formik'
import { getValidationSchema } from '../../utils/validationSchema'
import {
  TitleField,
  ImageUploadField,
  RichTextField,
} from './FormFields'
import { UI_TEXT } from '../../utils/constants/ui'
import { FORM_CONFIG } from '../../utils/constants/form'

const CreateForm = ({ onSubmit, isLoading }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (onSubmit) {
        await onSubmit(values)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      // validationSchema={getValidationSchema(isSignInForm)}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className='space-y-6'>

          <TitleField />
          <ImageUploadField />
          <RichTextField />

        </Form>
      )}
    </Formik>
  )
}

export default CreateForm
