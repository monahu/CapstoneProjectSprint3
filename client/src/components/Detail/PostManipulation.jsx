import { Edit, Trash, Loader2 } from 'lucide-react'
import { useDeletePost } from '../../hooks/posts/useDeletePost'
import ConfirmDialog from '../ConfirmDialog'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'

const PostManipulation = ({ isOwner, postId, navigate }) => {
  const { deletePost, loading } = useDeletePost()
  const { confirmDelete, dialogProps } = useConfirmDialog()

  const handleDelete = async () => {
    const confirmed = await confirmDelete()
    if (!confirmed) return

    try {
      await deletePost({ variables: { id: postId } })
      navigate('/')
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (!isOwner) return null

  return (
    <div className='relative'>
      {/* Loading Overlay */}
      {loading && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg'>
          <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2'>
            <Loader2 className='w-5 h-5 animate-spin text-red-500' />
            <span className='text-gray-700 font-medium'>Deleting post...</span>
          </div>
        </div>
      )}

      <div className='text-gray-600 text-base text-center mb-8'>
        <div className='badge badge-soft badge-primary'>
          Manipulate your post
        </div>
      </div>
      <div className='flex justify-center align-middle w-full mb-8'>
        <div
          className='tooltip tooltip-top tooltip-accent'
          data-tip='edit your post'
        >
          <button
            className='btn btn-accent btn-sm mr-2'
            onClick={() => navigate(`/edit/${postId}`)}
            disabled={loading}
          >
            <Edit className='w-4 h-4' /> EDIT
          </button>
        </div>
        <p>|</p>
        <div
          className='tooltip tooltip-top tooltip-error'
          data-tip='delete your post'
        >
          <button
            className='btn btn-error btn-sm ml-2'
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash className='w-4 h-4' /> DELETE
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog {...dialogProps} loading={loading} />
    </div>
  )
}

export default PostManipulation
