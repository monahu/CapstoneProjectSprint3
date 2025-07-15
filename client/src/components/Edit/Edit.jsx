import React from 'react';
import EditForm from './EditForm';

const Edit = ({ postId, onSuccess }) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <EditForm postId={postId} onSuccess={onSuccess} />
    </div>
  );
};

export default Edit;
