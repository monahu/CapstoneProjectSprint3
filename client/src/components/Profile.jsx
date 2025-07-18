import { useSelector } from 'react-redux'
import { usePosts } from '../hooks/usePost' // 🔄 Importa hook genérico
import Hero from './Hero'
import RestaurantCard from './Post/RestaurantCard'
import heroImage from '../assets/img/resJam_post_1.webp'
import { useNavbar } from '../hooks/useNavbar'

const Profile = () => {
  const { handleSignOut } = useNavbar()
  const user = useSelector((state) => state.user.data)
  const { posts, loading } = usePosts() // 🔄 Usa todos os posts

  // Filtra somente os posts do usuário logado (via userId)
  const userPosts =
    posts?.filter((post) => post?.author?.id === user?._id) || []

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex'>
        <main className='flex-1 px-4 sm:px-8 md:px-12'>
          <Hero
            heroImage={heroImage}
            title='Rest Jam Profile'
            description=''
            showButton={false}
            className='h-[200px] md:h-[240px] lg:h-[280px]'
          />

          <div className='mt-6 mb-10 bg-white shadow-md rounded-xl p-6 text-center'>
            <h2 className='text-xl font-semibold'>
              Hello, {user?.displayName || 'Guest'}!
            </h2>
            <div className='mt-2 text-sm text-gray-600'>
              <div>Total posts: {userPosts.length}</div>
              <div>Total want to go: 6</div>
            </div>
            <div className='mt-4 space-x-4'>
              <a
                href='/profile'
                className='text-purple-600 font-medium underline'
              >
                💜 Check your profile
              </a>
              <button
                onClick={handleSignOut}
                className='text-red-500 font-medium'
              >
                Logout
              </button>
            </div>
          </div>

          <section className='mt-8'>
            <h3 className='text-lg font-semibold mb-4'>Post List</h3>
            {loading ? (
              <div className='text-gray-500'>Loading posts...</div>
            ) : userPosts.length === 0 ? (
              <div className='rounded-md border border-gray-300 p-4 text-gray-700 text-sm'>
                You haven't shared any posts yet.
              </div>
            ) : (
              <div className='grid gap-6'>
                {userPosts.map((post) => (
                  <RestaurantCard
                    key={post.id}
                    id={post.id}
                    image={
                      post.imageUrls?.desktop ||
                      post.imageUrls?.mobile ||
                      post.imageUrls?.thumbnail
                    }
                    user={{
                      name: post.author?.displayName || 'You',
                      avatar:
                        post.author?.photoURL ||
                        'https://img.daisyui.com/images/profile/demo/2@94.webp',
                    }}
                    location={post.location}
                    title={post.title}
                    placeName={post.placeName}
                    description={post.content}
                    date={new Date(post.createdAt).toLocaleDateString()}
                    tags={post.tags?.map((tag) => tag.name) || []}
                    rating={post.rating?.type}
                    likeCount={post.likeCount}
                    shareCount={post.shareCount || 0}
                    wantToGoCount={post.attendeeCount}
                    isWantToGo={post.isWantToGo}
                    isLiked={post.isLiked}
                    className='max-w-full'
                  />
                ))}
              </div>
            )}
          </section>

          <section className='mt-10'>
            <h3 className='text-lg font-semibold mb-4'>Going List</h3>
            <div className='rounded-md border border-gray-300 p-4 text-gray-700 text-sm'>
              Going list component goes here.
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Profile
