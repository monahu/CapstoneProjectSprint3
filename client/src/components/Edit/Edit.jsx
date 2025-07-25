import React from 'react'
import EditForm from './EditForm'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = () => {
  const { id: postId } = useParams()  
  const navigate = useNavigate()

  const handleSuccess = () => {
    // // Simple approach: go to home and refresh
    // window.location.href = '/'
     // Redirect to home with success message
      navigate('/', {
        state: {
          successMessage: 'Post updated successfully!',
        },
      })
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
