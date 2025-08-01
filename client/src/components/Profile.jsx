import { useSelector } from 'react-redux'
import { useMyPosts } from '../hooks/useMyPosts'
import Hero from './Hero'
import heroImage from '../assets/img/profile_hero1.webp'
import { useNavbar } from '../hooks/useNavbar'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import { useNavigate } from 'react-router-dom'
import { useDeletePost } from '../hooks/useDeletePost'

const Profile = () => {
  const { handleSignOut } = useNavbar()
  const user = useSelector((state) => state.user.data)
  const authInitialized = useSelector((state) => state.user.authInitialized)
  const { posts, loading, error, refetch } = useMyPosts()
  const { deletePost } = useDeletePost()
  const navigate = useNavigate()

  const handlePostCreated = () => {
    navigate('/create', { state: { from: 'profile' } })
  }

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    )
    if (!confirmed) return

    try {
      await deletePost(postId)
      alert('Post deleted successfully!')
      refetch({ fetchPolicy: 'network-only' })
      window.location.href = '/profile'
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete the post.')
    }
  }

  if (!authInitialized) {
    return <div>Loading authentication...</div>
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex'>
        <main className='flex-1 px-2 sm:px-4 md:px-8 lg:px-12'>
          {/* Header */}
          <Hero
            heroImage={heroImage}
            title='Rest Jam Profile'
            description=''
            showButton={false}
            className='min-h-[30vh]'
          />

          {/* Profile Stats */}
          <div className='mt-6 mb-10 bg-white shadow-md rounded-xl p-4 sm:p-6 text-center'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'>
              Hello, {user?.displayName || 'Guest'}!
            </h2>

            <div className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-x-8 md:gap-x-10'>
              {/* Total Posts */}
              <div className='min-w-[80px] sm:min-w-[100px] text-center'>
                <div className='text-gray-500 text-xs sm:text-sm'>
                  Total posts
                </div>
                <div className='text-2xl sm:text-3xl md:text-4xl font-bold'>
                  {posts.length}
                </div>
              </div>

              {/* Avatar */}
              <div className='order-first sm:order-none'>
                <img
                  src={
                    user?.photoURL ||
                    'https://img.daisyui.com/images/profile/demo/2@94.webp'
                  }
                  alt='Profile'
                  className='h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-4 border-white shadow-md'
                />
              </div>

              {/* Total Want to Go */}
              <div className='min-w-[80px] sm:min-w-[100px] text-center'>
                <div className='text-gray-500 text-xs sm:text-sm'>
                  Total want to go
                </div>
                <div className='text-2xl sm:text-3xl md:text-4xl font-bold'>
                  6
                </div>
              </div>
            </div>

            {/* Links */}
            <div className='mt-6 flex flex-col items-center space-y-2'>
              <button
                onClick={handleSignOut}
                className='text-purple-600 cursor-pointer font-medium underline flex items-center space-x-1'
              >
                <span>👤</span>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Post List Section */}
          <section className='mt-6 sm:mt-8'>
            <h3 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4'>
              Post List
            </h3>

            {loading && <div className='text-gray-500'>Loading posts...</div>}
            {error && (
              <ErrorMessage
                error={error}
                onRetry={() => refetch({ fetchPolicy: 'network-only' })}
              />
            )}
            {!loading && !error && (
              <div className='overflow-x-auto'>
                <table className='min-w-full text-sm text-left bg-white shadow-md rounded-xl overflow-hidden'>
                  <thead className='text-gray-700 uppercase bg-gray-100'>
                    <tr>
                      <th className='px-2 sm:px-4 py-3'>ID</th>
                      <th className='px-2 sm:px-4 py-3'>Restaurant</th>
                      <th className='px-2 sm:px-4 py-3 hidden sm:table-cell'>
                        Address
                      </th>
                      <th className='px-2 sm:px-4 py-3 hidden md:table-cell'>
                        Date
                      </th>
                      <th className='px-2 sm:px-4 py-3 text-right'>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {posts.length > 0 ? (
                      posts.map((post, index) => (
                        <tr
                          key={post.id}
                          className='hover:bg-gray-50 border-b last:border-b-0'
                        >
                          <td className='px-2 sm:px-4 py-3 font-bold'>
                            {index + 1}
                          </td>
                          <td className='px-2 sm:px-4 py-3 font-bold'>
                            {post.title}
                          </td>
                          <td className='px-2 sm:px-4 py-3 font-bold hidden sm:table-cell'>
                            {post.location}
                          </td>
                          <td className='px-2 sm:px-4 py-3 text-gray-400 hidden md:table-cell'>
                            {
                              new Date(post.createdAt)
                                .toISOString()
                                .split('T')[0]
                            }
                          </td>
                          <td className='px-2 sm:px-4 py-3 text-right'>
                            <div className='flex flex-col sm:flex-row gap-1 sm:gap-2 sm:justify-end'>
                              <button
                                className='bg-gray-700 cursor-pointer hover:bg-gray-800 text-white text-xs px-2 sm:px-3 py-1 rounded-2xl'
                                onClick={() => navigate(`/edit/${post.id}`)}
                              >
                                Edit
                              </button>
                              <button
                                className='bg-purple-800 cursor-pointer text-white hover:bg-purple-900 text-xs px-2 sm:px-3 py-1 rounded-2xl'
                                onClick={() => navigate(`/post/${post.id}`)}
                              >
                                Detail
                              </button>
                              <button
                                className='bg-red-600 cursor-pointer hover:bg-red-700 text-white text-xs px-2 sm:px-3 py-1 rounded-2xl'
                                onClick={() => handleDelete(post.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className='px-4 py-8 text-center text-gray-500'
                        >
                          <div className='flex flex-col items-center gap-2'>
                            <p className='text-base'>
                              You haven’t posted anything yet.
                            </p>
                            <button
                              onClick={handlePostCreated}
                              className='bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-2 rounded-xl'
                            >
                              Share Your Experience
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {posts.length > 0 && (
                  <div className='mt-4 flex justify-center space-x-1'>
                    <button className='px-3 cursor-pointer py-1 rounded border border-gray-300 text-sm'>
                      1
                    </button>
                    <button className='px-3 cursor-pointer py-1 rounded border border-gray-300 text-sm'>
                      2
                    </button>
                    <button className='px-3 cursor-pointer py-1 rounded border border-gray-300 text-sm'>
                      3
                    </button>
                    <button className='px-3 cursor-pointer py-1 rounded border border-gray-300 text-sm'>
                      4
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
          {/* // ! TODO: Implement Going List Section */}
          {/* Going List Section (placeholder) */}
          <section className='mt-8 sm:mt-10'>
            <h3 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4'>
              Going List
            </h3>
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
