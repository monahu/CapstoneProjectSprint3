import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const EditForm = ({ postId, onSuccess }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    content: '',
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
        // Map API response to form fields
        const post = res.data;
        setForm({
          title: post.title || '',
          content: post.content || '',
          tags: post.tags || [],
          rating: post.rating?.type || '',
          imageUrls: post.imageUrls || {},
        });
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
        className="input input-bordered w-full bg-white text-black placeholder-gray-500"
        required
      />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Content"
        className="textarea textarea-bordered w-full bg-white text-black placeholder-gray-500"
        required
      />
      <input
        type="text"
        name="rating"
        value={form.rating}
        onChange={handleChange}
        placeholder="Rating (e.g. SO-SO, GOOD, BAD)"
        className="input input-bordered w-full bg-white text-black placeholder-gray-500"
      />
      <input
        type="text"
        name="tags"
        value={form.tags.map(tag => tag.name || tag).join(', ')}
        onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()) }))}
        placeholder="Tags (comma separated)"
        className="input input-bordered w-full bg-white text-black placeholder-gray-500"
      />
      {/* You can add image upload/edit fields here if needed */}
      <button type="submit" className="btn btn-primary">Update Post</button>
    </form>
  );
};

export default EditForm;
