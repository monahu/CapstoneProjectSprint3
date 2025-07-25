import { Formik, Form } from 'formik'
import { createValidationSchema } from '../../utils/postValidationSchema'
import {
  ImageUploadField,
  RichTextField,
} from './FormFields'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../../utils/config'
import FieldWithMic from '../Speech/FieldWithMic'
import SpeechButton from '../Speech/SpeechButton'

const CreateForm = ({ onSubmit, isLoading, serverError }) => {
  const [ratings, setRatings] = useState([])
  const [ratingsLoading, setRatingsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetch(getApiUrl('/api/ratings'))
      .then(res => res.json())
      .then(data => {
        setRatings(data)
        setRatingsLoading(false)
      })
      .catch(() => setRatingsLoading(false))
  }, [])

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      if (onSubmit) {
        await onSubmit(values)
        setSuccessMessage('Post created successfully!')
        resetForm()
        setTimeout(() => setSuccessMessage(''), 5000) // clear message after 5 sec
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
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
        ratingId: '',
        placeName: '',
        location: '',
        tags: '',
      }}
      validationSchema={createValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue, errors, touched }) => (
        <Form className="space-y-6">
          {/* Success message */}
          {successMessage && (
            <div className="text-sm text-green-700 bg-green-100 border border-green-300 p-2 rounded">
              {successMessage}
            </div>
          )}

          {/* Server-side error */}
          {serverError && (
            <div className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
              {serverError}
            </div>
          )}

          <FieldWithMic name="title" label="Review Title" required>
            <SpeechButton fieldName="title" setFieldValue={setFieldValue} />
          </FieldWithMic>

          <FieldWithMic name="placeName" label="Place Name" required>
            <SpeechButton fieldName="placeName" setFieldValue={setFieldValue} />
          </FieldWithMic>

          <div>
            <label htmlFor="ratingId" className="block text-sm font-medium text-gray-900">
              Rating <span className="text-red-500">*</span>
            </label>
            <select
              id="ratingId"
              name="ratingId"
              className={`block w-full rounded-md border ${
                touched.ratingId && errors.ratingId ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 mt-1`}
              value={values.ratingId}
              onChange={e => setFieldValue('ratingId', e.target.value)}
              disabled={ratingsLoading}
            >
              <option value="">{ratingsLoading ? 'Loading...' : 'Select rating'}</option>
              {ratings.map(rating => (
                <option key={rating._id || rating.id} value={rating._id || rating.id}>
                  {rating.type}{rating.description ? ` - ${rating.description}` : ''}
                </option>
              ))}
            </select>
            {touched.ratingId && errors.ratingId && (
              <div className="text-sm text-red-600 mt-1">{errors.ratingId}</div>
            )}
          </div>

          <FieldWithMic name="location" label="Location" required>
            <SpeechButton fieldName="location" setFieldValue={setFieldValue} />
          </FieldWithMic>

          <FieldWithMic name="tags" label="Tags (comma-separated)">
            <SpeechButton fieldName="tags" setFieldValue={setFieldValue} />
          </FieldWithMic>

          <ImageUploadField />
          <RichTextField />

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2 rounded-md text-white font-semibold disabled:opacity-60"
              disabled={isSubmitting || isLoading}
            >
              {isLoading || isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default CreateForm
