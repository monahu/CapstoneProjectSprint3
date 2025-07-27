const mongoose = require('mongoose')

/**
 * Aggregation Pipeline Utilities
 * Shared aggregation pipelines for complex queries across multiple services
 */

/**
 * Build aggregation pipeline for posts with all related data
 * This is a shared pipeline builder to avoid code duplication across services
 * 
 * @param {Object} matchStage - MongoDB match criteria for filtering posts
 * @param {string|null} currentUserId - Current user ID for user-specific fields (isLiked, isOwner, etc.)
 * @param {Object} options - Pipeline options
 * @param {number|null} options.limit - Limit number of results
 * @param {number} options.offset - Skip number of results (for pagination)
 * @param {Object} options.sort - Sort criteria (default: {createdAt: -1})
 * @param {boolean} options.skipPagination - Skip limit/skip stages
 * @returns {Array} MongoDB aggregation pipeline
 */
const buildPostAggregationPipeline = (matchStage = {}, currentUserId = null, options = {}) => {
  const { 
    limit = null, 
    offset = 0, 
    sort = { createdAt: -1 },
    skipPagination = false 
  } = options;

  const pipeline = [
    // Match posts based on provided criteria
    { $match: matchStage },
    
    // Sort posts
    { $sort: sort },
  ];

  // Add pagination if not skipped
  if (!skipPagination) {
    if (offset > 0) pipeline.push({ $skip: offset });
    if (limit) pipeline.push({ $limit: limit });
  }

  // Add all the lookup stages
  pipeline.push(
    // Lookup author information
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'author',
        pipeline: [
          {
            $project: {
              _id: 1,
              id: { $toString: '$_id' },
              displayName: 1,
              photoURL: 1,
              firstName: 1,
              lastName: 1,
              email: 1
            }
          }
        ]
      }
    },
    
    // Lookup rating information
    {
      $lookup: {
        from: 'ratings',
        localField: 'ratingId',
        foreignField: '_id',
        as: 'rating',
        pipeline: [
          {
            $addFields: {
              id: { $toString: '$_id' }
            }
          }
        ]
      }
    },
    
    // Lookup likes
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'postId',
        as: 'likesData',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    id: { $toString: '$_id' },
                    displayName: 1,
                    photoURL: 1
                  }
                }
              ]
            }
          },
          {
            $unwind: '$user'
          },
          {
            $project: {
              _id: 1,
              userId: 1,
              user: 1
            }
          }
        ]
      }
    },
    
    // Lookup attendees (want to go)
    {
      $lookup: {
        from: 'wanttogos',
        localField: '_id',
        foreignField: 'postId',
        as: 'attendeesData',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    id: { $toString: '$_id' },
                    displayName: 1,
                    photoURL: 1,
                    firstName: 1,
                    lastName: 1
                  }
                }
              ]
            }
          },
          {
            $unwind: '$user'
          },
          {
            $project: {
              _id: 1,
              userId: 1,
              user: 1
            }
          }
        ]
      }
    },
    
    // Lookup tags
    {
      $lookup: {
        from: 'poststags',
        localField: '_id',
        foreignField: 'postId',
        as: 'tagAssociations'
      }
    },
    {
      $lookup: {
        from: 'tags',
        localField: 'tagAssociations.tagId',
        foreignField: '_id',
        as: 'tags',
        pipeline: [
          {
            $addFields: {
              id: { $toString: '$_id' }
            }
          }
        ]
      }
    },
    
    // Add computed fields
    {
      $addFields: {
        // Convert MongoDB _id to GraphQL id
        id: { $toString: '$_id' },
        
        // Transform author array to single object
        author: { $arrayElemAt: ['$author', 0] },
        
        // Transform rating array to single object
        rating: { $arrayElemAt: ['$rating', 0] },
        
        // Extract likes array (just the user info)
        likes: '$likesData.user',
        
        // Extract attendees array (just the user info)
        attendees: '$attendeesData.user',
        
        // Calculate counts
        likeCount: { $size: '$likesData' },
        attendeeCount: { $size: '$attendeesData' },
        
        // Calculate user-specific booleans (if currentUserId provided)
        isLiked: currentUserId ? {
          $in: [new mongoose.Types.ObjectId(currentUserId), '$likesData.userId']
        } : false,
        
        isWantToGo: currentUserId ? {
          $in: [new mongoose.Types.ObjectId(currentUserId), '$attendeesData.userId']
        } : false,
        
        isOwner: currentUserId ? {
          $eq: ['$userId', new mongoose.Types.ObjectId(currentUserId)]
        } : false
      }
    },
    
    // Clean up temporary fields
    {
      $project: {
        likesData: 0,
        attendeesData: 0,
        tagAssociations: 0,
        ratingId: 0
      }
    }
  );

  return pipeline;
}

module.exports = {
  buildPostAggregationPipeline,
}