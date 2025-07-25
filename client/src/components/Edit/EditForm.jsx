import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { auth } from '../../utils/firebase'
import { ImageUploadField, RichTextField } from '../Create/FormFields'
import { getApiUrl } from '../../utils/config'
import { createValidationSchema } from '../../utils/postValidationSchema'
import FieldWithMic from '../Speech/FieldWithMic'
import SpeechButton from '../Speech/SpeechButton'

const EditForm = ({ postId, onSuccess }) => {
  const [initialValues, setInitialValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ratings, setRatings] = useState([])
  const [ratingsLoading, setRatingsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [postData, setPostData] = useState(null)
  const user = useSelector((state) => state.user.data)

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await axios.get(getApiUrl(`/api/posts/${postId}`))
        setPostData(res.data)
      } catch {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postId])

  // Fetch ratings
  useEffect(() => {
    fetch(getApiUrl('/api/ratings'))
      .then((res) => res.json())
      .then((data) => {
        setRatings(data)
        setRatingsLoading(false)
      })
      .catch(() => setRatingsLoading(false))
  }, [])

  // Prepare initial form values
  useEffect(() => {
    if (ratingsLoading || !postData || ratings.length === 0) return

    let ratingId = ''
    if (postData.ratingId) ratingId = String(postData.ratingId)
    else if (postData.rating?._id) ratingId = String(postData.rating._id)
    else if (typeof postData.rating === 'string') {
      const found = ratings.find((r) => r.type === postData.rating)
      if (found) ratingId = String(found._id)
    }

    setInitialValues({
      title: postData.title || '',
      placeName: postData.placeName || '',
      ratingId,
      location: postData.location || '',
      tags: Array.isArray(postData.tags)
        ? postData.tags.map((tag) => tag.name || tag).join(', ')
        : '',
      image: postData.imageUrls?.desktop || '',
      content: postData.content || '',
      imageUrls: postData.imageUrls || {},
    })
  }, [ratingsLoading, ratings, postData])

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setError(null)

    try {
      const idToken = await auth.currentUser?.getIdToken()
      if (!idToken) {
        setError('Authentication required.')
        setSubmitting(false)
        return
      }

      let imageUrls = values.imageUrls || {}
      if (values.image instanceof File) {
        const formData = new FormData()
        formData.append('image', values.image)
        const res = await fetch(getApiUrl('/api/upload-image'), {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.success && data.urls) {
          imageUrls = {
            desktop: data.urls.desktop || '',
            mobile: data.urls.mobile || '',
            mobile2x: data.urls['mobile@2x'] || '',
            tablet: data.urls.tablet || '',
          }
        } else {
          throw new Error('Image upload failed')
        }
      }

      const payload = {
        title: values.title,
        placeName: values.placeName,
        ratingId: values.ratingId,
        location: values.location,
        tags: values.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrls,
        content: values.content,
      }

      await axios.put(getApiUrl(`/api/posts/${postId}`), payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      setError('Failed to update post.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return <div className="text-red-600">Please log in to edit this post.</div>
  if (loading || !initialValues) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={createValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting, touched, errors }) => (
        <Form className="space-y-6">
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
              onChange={(e) => setFieldValue('ratingId', e.target.value)}
              disabled={ratingsLoading}
            >
              <option value="">{ratingsLoading ? 'Loading...' : 'Select rating'}</option>
              {ratings.map((rating) => (
                <option key={rating._id} value={rating._id}>
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

          {values.image && typeof values.image === 'string' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">Current Image</label>
              <img
                src={values.image}
                alt="Current post image"
                className="max-w-xs rounded-md border border-gray-300 mt-2"
              />
            </div>
          )}

          <ImageUploadField
            value={values.image}
            setFieldValue={setFieldValue}
            initialImage={values.image}
          />

          <RichTextField
            value={values.content}
            setFieldValue={setFieldValue}
            initialContent={values.content}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2 rounded-md text-white font-semibold disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default EditForm
