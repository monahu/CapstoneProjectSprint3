import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { ImageUploadField, RichTextField } from '../Create/FormFields';

const EditForm = ({ postId, onSuccess }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts/${postId}`);
        setPostData(res.data);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    // Use absolute URL in development
    let url = '/api/ratings';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      url = 'http://localhost:3500/api/ratings';
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setRatings(data);
        setRatingsLoading(false);
      })
      .catch(() => setRatingsLoading(false));
  }, []);

  useEffect(() => {
    // Wait until both postData and ratings are ready
    if (ratingsLoading || !postData || ratings.length === 0) return;

    let ratingId = '';
    // Use ratingId from postData if present
    if (postData.ratingId) {
      ratingId = String(postData.ratingId);
    } else if (postData.rating && postData.rating._id) {
      ratingId = String(postData.rating._id);
    } else if (postData.rating && ratings.length > 0) {
      // Fallback: try to match by type if _id is missing
      const found = ratings.find(r => r.type === postData.rating.type);
      if (found) ratingId = String(found._id);
    }

    let tags = '';
    if (Array.isArray(postData.tags)) {
      tags = postData.tags.map(tag => tag.name || tag).join(', ');
    } else if (typeof postData.tags === 'string') {
      tags = postData.tags;
    } else {
      tags = '';
    }

    setInitialValues({
      title: postData.title || '',
      placeName: postData.placeName || '',
      ratingId,
      location: postData.location || '',
      tags,
      image: postData.imageUrls?.desktop || postData.image || '',
      content: postData.content || '',
    });
  }, [ratingsLoading, ratings, postData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      const idToken = user ? await user.getIdToken() : null;
      const payload = {
        title: values.title,
        placeName: values.placeName,
        ratingId: values.ratingId,
        location: values.location,
        tags: values.tags
          ? values.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],
        imageUrls: { desktop: values.image },
        content: values.content,
      };
      await axios.put(`/api/posts/${postId}`, payload, {
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
      {({ isSubmitting, values, setFieldValue }) => {
        console.log('Formik values:', values); // Optional debug
        return (
          <Form className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">Title</label>
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
                disabled={ratingsLoading}
              >
                <option value="">{ratingsLoading ? 'Loading...' : 'Select rating'}</option>
                {ratings.map(rating => (
                  <option key={rating._id} value={String(rating._id)}>
                    {rating.type}{rating.description ? ` - ${rating.description}` : ''}
                  </option>
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
        );
      }}
    </Formik>
  );
};

export default EditForm;
