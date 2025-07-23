import React from 'react'
import EditForm from './EditForm'
import { useParams } from 'react-router-dom'

const Edit = () => {
  const { id: postId } = useParams()

  const handleSuccess = async () => {
    window.location.href = '/'
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Edit Post</h2>
      <EditForm
        postId={postId}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

export default Edit
