import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const EditForm = ({ postId, onSuccess }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: [],
    rating: '',
    imageUrls: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch post data for editing
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts/${postId}`);
        setForm(res.data);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const idToken = user ? await user.getIdToken() : null;
      await axios.put(
        `/api/posts/${postId}`,
        form,
        {
          headers: {
            Authorization: idToken ? `Bearer ${idToken}` : '',
          },
        }
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="input input-bordered w-full"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="textarea textarea-bordered w-full"
        required
      />
      {/* Add tag and rating fields as needed */}
      <button type="submit" className="btn btn-primary">Update Post</button>
    </form>
  );
};

export default EditForm;
