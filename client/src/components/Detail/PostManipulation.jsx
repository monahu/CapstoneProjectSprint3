import { Edit, Trash } from 'lucide-react'
const PostManipulation = ({ isOwner, postId, navigate }) => {
  if (!isOwner) return null
  return (
    <>
      <div className='text-gray-600 text-base text-center mb-8'>
        <div className='badge badge-soft badge-primary'>
          Manipulate your post
        </div>
      </div>
      <div
        className='flex justify-center align-middle w-full mb-8
      '
      >
        <div
          className='tooltip tooltip-top tooltip-accent'
          data-tip='edit your post'
        >
          <button
            className='btn btn-accent btn-sm mr-2'
            onClick={() => navigate(`/edit/${postId}`)}
          >
            <Edit className='w-4 h-4' /> EDIT
          </button>
        </div>
        <p>|</p>
        <div
          className='tooltip tooltip-top tooltip-error'
          data-tip='delete your post'
        >
          <button className='btn btn-error btn-sm ml-2'>
            <Trash className='w-4 h-4' /> DELETE
          </button>
        </div>
      </div>
    </>
  )
}

export default PostManipulation
