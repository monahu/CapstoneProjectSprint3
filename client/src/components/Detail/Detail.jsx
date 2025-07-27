import { useParams, useNavigate } from 'react-router'
import { usePost } from '../../hooks/usePost'
import { extractIdFromRestaurantUrl } from '../../utils/slugUtils'
import heroImage from '../../assets/img/detail_hero1.webp'
import Hero from '../Hero'
import LoadingState from '../LoadingState'
import ErrorMessage from '../ErrorMessage'
import RestaurantDetail from './RestaurantDetail'
import { UI_TEXT } from '../../utils/constants/ui'

const Detail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const id = extractIdFromRestaurantUrl(slug)
  const { post, loading, error, refetch } = usePost(id)

  // Loading state
  if (loading) {
    return (
      <LoadingState
        type={UI_TEXT.loadingTypes.DATA}
        skeletonCount={1}
        message={UI_TEXT.loading.detail}
      />
    )
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => refetch()}
      />
    )
  }

  // No post found
  if (!post) {
    return (
      <ErrorMessage
        error={{
          message: "The restaurant post you're looking for doesn't exist.",
        }}
        onRetry={() => navigate(-1)}
      />
    )
  }

  // Success state
  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        showButton={false}
        title={UI_TEXT.detailHero.title}
        description={UI_TEXT.detailHero.description}
        className='min-h-[30vh]'
      />
      <RestaurantDetail
        post={post}
        loading={loading}
        error={error}
        refetch={refetch}
        className='mt-10 max-w-full md:max-w-5/6 lg:max-w-3/4'
      />
    </div>
  )
}

export default Detail
