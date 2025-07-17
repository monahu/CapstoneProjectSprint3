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
    let url = '/api/ratings';
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      url = 'http://localhost:3500/api/ratings';
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRatings(data);
        setRatingsLoading(false);
      })
      .catch(() => setRatingsLoading(false));
  }, []);

  useEffect(() => {
    if (ratingsLoading || !postData || ratings.length === 0) return;

    let ratingId = '';

    // Use ratingId directly if available
    if (postData.ratingId) {
      ratingId = String(postData.ratingId);
    } else if (postData.rating && postData.rating._id) {
      ratingId = String(postData.rating._id);
    } else if (typeof postData.rating === 'string') {
      const found = ratings.find(r => r.type === postData.rating);
      if (found) ratingId = String(found._id);
    } else if (postData.rating?.type) {
      const found = ratings.find(r => r.type === postData.rating.type);
      if (found) ratingId = String(found._id);
    }

    // Debug logs
    console.log('[DEBUG] Rating Preselection Info:');
    console.log('postData.ratingId:', postData.ratingId);
    console.log('Resolved ratingId:', ratingId);
    console.log('Available ratings:', ratings.map(r => ({ _id: r._id, type: r.type })));

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
    });
  }, [ratingsLoading, ratings, postData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);

    console.log('handleSubmit user:', user);
    console.log('handleSubmit user.getIdToken:', user?.getIdToken);

    if (!user || typeof user.getIdToken !== 'function') {
      setError('You must be logged in to update a post.');
      setSubmitting(false);
      return;
    }

    try {
      const idToken = await user.getIdToken();

      if (!idToken || typeof idToken !== 'string' || idToken.length < 10) {
        setError('No valid authentication token found. Please log in again.');
        setSubmitting(false);
        return;
      }

      const payload = {
        title: values.title,
        placeName: values.placeName,
        ratingId: values.ratingId,
        location: values.location,
        tags: values.tags.split(',').map((t) => t.trim()),
        imageUrls: { desktop: values.image },
        content: values.content,
      };

      console.log('EditForm PUT: idToken', idToken);
      console.log('EditForm PUT: payload', payload);

      await axios.put(`/api/posts/${postId}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  // Show message if not logged in
  if (!user) {
    return <div className="text-red-600">Please log in to edit this post.</div>;
  }

  if (loading || !initialValues) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
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
  );
};

export default EditForm;
