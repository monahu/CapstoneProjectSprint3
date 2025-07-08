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
      initialValues={{
        title: '',
        image: null,
        content: '',
        userId: '',
        ratingId: '',
        placeName: '',
        location: '',
      }}
      // validationSchema={getValidationSchema(isSignInForm)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className='space-y-6'>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-900">User ID</label>
            <input
              id="userId"
              name="userId"
              type="text"
              className="block w-full rounded-md border-gray-300 px-3 py-2 mt-1"
              placeholder="Enter user ID"
            />
          </div>
          <div>
            <label htmlFor="ratingId" className="block text-sm font-medium text-gray-900">Rating ID</label>
            <input
              id="ratingId"
              name="ratingId"
              type="text"
              className="block w-full rounded-md border-gray-300 px-3 py-2 mt-1"
              placeholder="Enter rating ID"
            />
          </div>
          <div>
            <label htmlFor="placeName" className="block text-sm font-medium text-gray-900">Place Name</label>
            <input
              id="placeName"
              name="placeName"
              type="text"
              className="block w-full rounded-md border-gray-300 px-3 py-2 mt-1"
              placeholder="Enter place name"
            />
          </div>
          <TitleField />
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-900">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              className="block w-full rounded-md border-gray-300 px-3 py-2 mt-1"
              placeholder="Enter location"
            />
          </div>
          <ImageUploadField />
          <RichTextField />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2 rounded-md text-white font-semibold disabled:opacity-60"
              disabled={isSubmitting || isLoading}
            >
              {isLoading || isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default CreateForm
