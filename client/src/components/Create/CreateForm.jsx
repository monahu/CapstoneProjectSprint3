import { Formik, Form } from 'formik'
import { getValidationSchema } from '../../utils/validationSchema'
import {
  ImageUploadField,
  RichTextField,
} from './FormFields'
import { useEffect, useState } from 'react'
import { UI_TEXT } from '../../utils/constants/ui'
import { FORM_CONFIG } from '../../utils/constants/form'
import { getApiUrl } from '../../utils/config'
import FieldWithMic from '../Speech/FieldWithMic'
import SpeechButton from '../Speech/SpeechButton'

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

  const [ratings, setRatings] = useState([])
  const [ratingsLoading, setRatingsLoading] = useState(true)

  useEffect(() => {
    fetch(getApiUrl('/api/ratings'))
      .then(res => res.json())
      .then(data => {
        setRatings(data)
        setRatingsLoading(false)
      })
      .catch(() => setRatingsLoading(false))
  }, [])

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
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className='space-y-6'>

          <FieldWithMic name="title" label="Review Title">
            <SpeechButton fieldName="title" setFieldValue={setFieldValue} />
          </FieldWithMic>

          <FieldWithMic name="placeName" label="Place Name">
            <SpeechButton fieldName="placeName" setFieldValue={setFieldValue} />
          </FieldWithMic>

          <div>
            <label htmlFor="ratingId" className="block text-sm font-medium text-gray-900">Rating</label>
            <select
              id="ratingId"
              name="ratingId"
              className="block w-full rounded-md border-gray-300 px-3 py-2 mt-1"
              value={values.ratingId}
              onChange={e => setFieldValue('ratingId', e.target.value)}
              required
              disabled={ratingsLoading}
            >
              <option value="">{ratingsLoading ? 'Loading...' : 'Select rating'}</option>
              {Array.isArray(ratings) && ratings.map(rating => (
                <option key={rating._id || rating.id} value={rating._id || rating.id}>
                  {rating.type}{rating.description ? ` - ${rating.description}` : ''}
                </option>
              ))}
            </select>
          </div>

          <FieldWithMic name="location" label="Location">
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
