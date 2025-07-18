import { useParams, useNavigate } from 'react-router'
import { usePost, useCreatePost } from '../../hooks/usePost'
import heroImage from '../../assets/img/detail_hero1.webp'
import Hero from '../Hero'
import { PostCardSkeleton, ImageSkeleton } from '../Skeleton'
import { UI_TEXT } from '../../utils/constants/ui'
import CreateForm from './CreateForm'
import { useCacheRefresh } from '../../hooks/useCacheRefresh'

const Create = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshPosts } = useCacheRefresh()

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

      <div className='w-full px-0 sm:px-0 py-8 flex justify-center'>
        <div className='bg-white rounded-xl shadow-lg p-2 xs:p-4 sm:p-6 md:p-10 mt-6 md:mt-10 w-full max-w-screen-xl mx-0 sm:mx-4'>
          <CreateForm
            isSignInForm={false}
            onSubmit={async (values, formikHelpers) => {
              let imageUrls = null
              if (values.image) {
                // Upload image to backend to get all URLs
                const formData = new FormData()
                formData.append('image', values.image)
                const res = await fetch('/api/upload-image', {
                  method: 'POST',
                  body: formData,
                })
                const data = await res.json()
                if (data.success) {
                  const {
                    desktop,
                    mobile,
                    'mobile@2x': mobile2x,
                    tablet,
                  } = data.urls
                  imageUrls = { desktop, mobile, mobile2x, tablet }
                } else {
                  throw new Error('Image upload failed')
                }
              }
              // Convert tags string to array (comma separated, trimmed, non-empty)
              const tagsArray = (values.tags || '')
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)

              // Get Firebase ID token
              let idToken = null
              try {
                const { auth } = await import('../../utils/firebase')
                if (auth.currentUser) {
                  idToken = await auth.currentUser.getIdToken()
                } else {
                  throw new Error('User not authenticated')
                }
              } catch (err) {
                console.error('Failed to get Firebase ID token:', err)
                throw err
              }

              const postPayload = {
                title: values.title,
                content: values.content,
                imageUrls,
                ratingId: values.ratingId,
                placeName: values.placeName,
                location: values.location,
                tags: tagsArray,
              }

              // <-- Add console.log here to debug payload before sending -->
              console.log('🟡 Submitting post:', postPayload)

              try {
                const res = await fetch('/api/posts', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                  },
                  body: JSON.stringify(postPayload),
                })
                const data = await res.json()
                if (data.success) {
                  // Refresh posts cache to show new post on home page
                  await refreshPosts()

                  if (formikHelpers && formikHelpers.resetForm)
                    formikHelpers.resetForm()
                  navigate('/')
                } else {
                  throw new Error(data.error || 'Failed to create post')
                }
              } catch (err) {
                console.error('Create post error:', err)
              }
            }}
            isLoading={creating}
          />
          {createError && (
            <div className='text-red-600 mt-4'>{createError.message}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Create
