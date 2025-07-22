import { Formik, Form } from 'formik'
import { getValidationSchema } from '../../utils/validationSchema'
import {
  ImageUploadField,
  RichTextField,
} from './FormFields'
import { useEffect, useState } from 'react';
import { UI_TEXT } from '../../utils/constants/ui'
import { FORM_CONFIG } from '../../utils/constants/form'
import { getApiUrl } from '../../utils/config'

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

  // Fetch ratings from backend REST API
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  useEffect(() => {
    fetch(getApiUrl('/api/ratings'))
      .then(res => res.json())
      .then(data => {
        setRatings(data);
        setRatingsLoading(false);
      })
      .catch(() => setRatingsLoading(false));
  }, []);
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
      // validationSchema={getValidationSchema(isSignInForm)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className='space-y-6'>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900">Review Title</label>
            <input
              id="title"
              name="title"
              type="text"
              className="block w-full rounded-md border-gray-300 px-3 py-2 mt-1"
              placeholder="Enter review title"
              value={values.title}
              onChange={e => setFieldValue('title', e.target.value)}
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
              value={values.placeName}
              onChange={e => setFieldValue('placeName', e.target.value)}
            />
          </div>
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
              {Array.isArray(ratings) && ratings.length > 0 && ratings.map(rating => (
                <option key={rating._id || rating.id} value={rating._id || rating.id}>{rating.type}{rating.description ? ` - ${rating.description}` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-900">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              className="block w-full rounded-md border-gray-300 px-3 py-2 mt-1"
              placeholder="Enter location"
              value={values.location}
              onChange={e => setFieldValue('location', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-900">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              className="block w-full rounded-md border-gray-300 px-3 py-2 mt-1"
              placeholder="Comma separated tags (e.g. Food,Review,Low Calorie)"
              value={values.tags}
              onChange={e => setFieldValue('tags', e.target.value)}
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
