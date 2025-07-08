import { useParams, useNavigate } from 'react-router'
import { usePost } from '../../hooks/usePost'
import heroImage from '../../assets/img/detail_hero1.webp'
import Hero from '../Hero'
import { PostCardSkeleton, ImageSkeleton } from '../Skeleton'
import { UI_TEXT } from '../../utils/constants/ui'
import CreateForm from './CreateForm'

const Create = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { post, loading, error } = usePost(id)

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
            onSubmit={(values) => {
              // form submission logic here
              console.log('Form submitted with:', values)
            }}
            isLoading={false}
          />
        </div>
      </div>

    </div>
  )
}

export default Create
