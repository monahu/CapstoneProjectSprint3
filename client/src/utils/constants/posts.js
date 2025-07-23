import resJam_post_1 from '../../assets/img/resJam_post_1.webp'
import resJam_post_2 from '../../assets/img/resJam_post_2.webp'
import resJam_post_3 from '../../assets/img/resJam_post_3.webp'

export const postImage = {
  default: resJam_post_1,
  restaurant1: resJam_post_1,
  restaurant2: resJam_post_2,
  restaurant3: resJam_post_3,
}

export const POST_QUERY_CONFIG = {
  DEFAULT_LIMIT: 6,
  DEFAULT_OFFSET: 0,
  DEFAULT_FILTER: {},
}

// Default variables used by Home component and cache updates
export const DEFAULT_POSTS_VARIABLES = {
  limit: POST_QUERY_CONFIG.DEFAULT_LIMIT,
  offset: POST_QUERY_CONFIG.DEFAULT_OFFSET,
  filter: POST_QUERY_CONFIG.DEFAULT_FILTER,
}

// Helper function to create refetch queries configuration
export const createPostsRefetchConfig = (
  variables = DEFAULT_POSTS_VARIABLES
) => ({
  include: [
    {
      query: null, // Will be set by the calling code
      variables,
    },
  ],
})

// Helper function to create cache update variables
export const createCacheUpdateConfig = (
  query,
  variables = DEFAULT_POSTS_VARIABLES
) => ({
  query,
  variables,
})

export const POSTS_DATA = [
  {
    id: 1,
    image: resJam_post_1,
    user: {
      name: 'Mona Hu',
      avatar: 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp',
      location: 'Ontario, Waterloo',
    },
    restaurantName: 'KIMYUE Japanese BBQ good meats',
    description:
      'KIMYUE Japanese BBQ is a hidden gem! The meats are always fresh and perfectly grilled. The atmosphere is cozy, making it a great spot for gatherings. Highly recommend the marinated beef!',
    date: '15/5/2025, 10:10:2 AM',
    tags: ['FoodCritic', 'Review', 'Low Calorie'],
    rating: 'new',
    likeCount: 66,
    shareCount: 33,
    wantToGoCount: 12,
    isLiked: false,
    isWantToGo: false,
  },
  // Add more posts as needed
]
