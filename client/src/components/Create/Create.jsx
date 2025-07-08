import { useParams, useNavigate } from 'react-router'
import { usePost, useCreatePost } from '../../hooks/usePost'
import heroImage from '../../assets/img/detail_hero1.webp'
import Hero from '../Hero'
import { PostCardSkeleton, ImageSkeleton } from '../Skeleton'
import { UI_TEXT } from '../../utils/constants/ui'
import CreateForm from './CreateForm'

const Create = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { post, loading, error } = usePost(id)
  const { createPost, loading: creating, error: createError } = useCreatePost()

  if (loading) {
    return (
      <div className='min-h-screen'>
        <ImageSkeleton />
        <div className='container mx-auto px-4 py-8 space-y-6'>
          {Array.from({ length: 4 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <Hero
          heroImage={heroImage}
          showButton={false}
          title={UI_TEXT.detailHero.title}
          description={UI_TEXT.detailHero.description}
        />
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Something went wrong!
          </h2>
          <p className='text-gray-600 mb-6'>{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className='btn btn-primary'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        showButton={false}
        title={UI_TEXT.createHero.title}
        description={UI_TEXT.createHero.description}
        className='min-h-[30vh]'
      />

      <div className="w-full px-0 sm:px-0 py-8 flex justify-center">
        <div
          className="bg-white rounded-xl shadow-lg p-2 xs:p-4 sm:p-6 md:p-10 mt-6 md:mt-10 w-full max-w-screen-xl mx-0 sm:mx-4"
        >
          <CreateForm
            isSignInForm={false}
            onSubmit={async (values, { resetForm }) => {
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
              const postPayload = {
                title: values.title,
                content: values.content,
                imageUrls,
              };
              try {
                const res = await fetch('/api/posts', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(postPayload),
                });
                const data = await res.json();
                if (data.success) {
                  resetForm && resetForm();
                  navigate('/');
                } else {
                  throw new Error(data.error || 'Failed to create post');
                }
              } catch (err) {
                console.error('Create post error:', err);
              }
            }}
            isLoading={creating}
          />
          {createError && (
            <div className="text-red-600 mt-4">{createError.message}</div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Create
