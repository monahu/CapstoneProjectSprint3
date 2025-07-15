
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { ImageUploadField, RichTextField } from '../Create/FormFields';

const RATINGS = [
  { type: 'SO-SO', description: 'Average experience', id: 'SO-SO' },
  { type: 'RECOMMENDED', description: 'Highly recommended place', id: 'RECOMMENDED' },
  { type: 'NEW', description: 'New Place to try', id: 'NEW' },
];

const EditForm = ({ postId, onSuccess }) => {
  const { user } = useAuth();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts/${postId}`);
        const post = res.data;
        setInitialValues({
          title: post.title || '',
          placeName: post.placeName || '',
          ratingId: post.rating?.id || post.ratingId || '',
          location: post.location || '',
          tags: post.tags ? post.tags.map(tag => tag.name || tag).join(', ') : '',
          image: null, // Image upload field
          content: post.content || '',
        });
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      let imageUrls = null;
      if (values.image) {
        // Upload image to backend to get all URLs
        const formData = new FormData();
        formData.append('image', values.image);
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          imageUrls = data.urls;
        } else {
          throw new Error('Image upload failed');
        }
      }
      // Convert tags string to array
      const tagsArray = (values.tags || '').split(',').map(t => t.trim()).filter(Boolean);
      // Get Firebase ID token
      let idToken = null;
      if (user && user.getIdToken) {
        idToken = await user.getIdToken();
      }
      const postPayload = {
        title: values.title,
        placeName: values.placeName,
        ratingId: values.ratingId,
        location: values.location,
        tags: tagsArray,
        imageUrls,
        content: values.content,
      };
      await axios.put(`/api/posts/${postId}`, postPayload, {
        headers: {
          Authorization: idToken ? `Bearer ${idToken}` : '',
        },
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !initialValues) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-6">
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
              required
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
            >
              <option value="">Select rating</option>
              {RATINGS.map(rating => (
                <option key={rating.id} value={rating.id}>{rating.type} - {rating.description}</option>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditForm;
