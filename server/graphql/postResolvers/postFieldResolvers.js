const User = require("../../models/User");
const Rating = require("../../models/Rating");
const WantToGo = require("../../models/WantToGo");
const Like = require("../../models/Likes");
const PostsTags = require("../../models/PostsTags");
const Tag = require("../../models/Tags");
const {
  DEFAULT_USER_DISPLAY_NAME,
  DEFAULT_USER_PHOTO_URL,
} = require("../../utils/constant");

/**
 * Post Field Resolvers
 * Resolves computed fields and relationships for Post objects
 * These resolvers are called when the corresponding fields are requested in GraphQL queries
 */
const postFieldResolvers = {
  /**
   * Resolve the author of a post
   */
  author: async (parent) => {
    console.log(
      "🔍 Author resolver - Post ID: ----------------------------",
      parent._id
    );
    console.log("📄 userId structure:", parent.userId);

    if (parent.userId._id) {
      console.log("✅ Author already populated:", parent.userId._id);
      console.log("👾 Author displayName:", parent.userId.displayName);

      const result = {
        id: parent.userId._id.toString(),
        displayName: parent.userId.displayName || DEFAULT_USER_DISPLAY_NAME,
        photoURL: parent.userId.photoURL || DEFAULT_USER_PHOTO_URL,
      };

      console.log("📤 Returning author object:", result);
      return result;
    }

    console.log("🔄 Fetching author from database");
    const user = await User.findById(parent.userId);
    return user;
  },

  /**
   * Resolve the rating details for a post
   */
  rating: async (parent) => {
    console.log("🔍 Rating resolver - Post ID:", parent._id);
    console.log("📊 ratingId:", parent.ratingId);

    const rating = await Rating.findById(parent.ratingId);
    console.log("⭐ Rating found:", rating ? rating.type : "Not found");

    return rating;
  },

  /**
   * Get all users who want to go to this post's location
   */
  attendees: async (parent, _, { user, currentUser }) => {
    console.log(
      "🔍 Attendees resolver - Post ID:--------------------------------",
      parent._id
    );

    if (!user || !currentUser) {
      console.log("❌ No authenticated/current user, returning empty array");
      return [];
    }

    const records = await WantToGo.find({ postId: parent._id });
    console.log("📋 WantToGo records found:", records.length);

    const userIds = records.map((r) => r.userId);
    const attendees = await User.find({ _id: { $in: userIds } });
    console.log("👥 Attendees found:", attendees.length);
    // Only return the fields defined in type - AttendeeInfo
    return attendees.map((attendee) => ({
      id: attendee._id.toString(),
      displayName: attendee.displayName,
      photoURL: attendee.photoURL,
    }));
  },

  /**
   * Get the count of users who want to go to this post's location
   */
  attendeeCount: async (parent) => {
    console.log("🔍 AttendeeCount resolver - Post ID:", parent._id);

    const count = await WantToGo.countDocuments({ postId: parent._id });
    console.log("🔢 Attendee count:", count);

    return count;
  },

  /**
   * Check if the current authenticated user wants to go to this post
   * Returns false for unauthenticated users
   */
  isWantToGo: async (parent, _, { user, currentUser }) => {
    console.log(
      "🔍 IsWantToGo resolver - Post ID:--------------------------------",
      parent._id
    );
    console.log("👤 User context:", user ? "Present" : "Missing");

    if (!user) {
      console.log("❌ No authenticated user, returning false");
      return false;
    }

    console.log("👤 User data found:", currentUser ? "Yes" : "No");

    if (!currentUser) {
      console.log("❌ No userData, returning false");
      return false;
    }

    const wantToGo = await WantToGo.findOne({
      userId: currentUser._id,
      postId: parent._id,
    });
    console.log("💚 Want to go record:", wantToGo ? "Found" : "Not found");

    return !!wantToGo;
  },

  /**
   * Get the count of likes for this post
   */
  likeCount: async (parent) => {
    console.log("🔍 LikeCount resolver - Post ID:", parent._id);

    const count = await Like.countDocuments({ postId: parent._id });
    console.log("🔢 Like count:", count);

    return count;
  },

  /**
   * Check if the current authenticated user has liked this post
   * Returns false for unauthenticated users
   */
  isLiked: async (parent, _, { user, currentUser }) => {
    console.log("🔍 IsLiked resolver - Post ID:", parent._id);
    console.log("👤 User context:", user ? "Present" : "Missing");

    if (!user || !currentUser) {
      console.log("❌ No authenticated user, returning false");
      return false;
    }

    if (!currentUser) {
      console.log("❌ No currentUser, returning false");
      return false;
    }

    const like = await Like.findOne({
      userId: currentUser._id,
      postId: parent._id,
    });
    console.log("❤️ Like record:", like ? "Found" : "Not found");

    return !!like;
  },

  /**
   * Get all tags associated with this post
   */
  tags: async (parent) => {
    console.log("🔍 Tags resolver - Post ID:", parent._id);

    const records = await PostsTags.find({ postId: parent._id });
    console.log("🔗 PostsTags records found:", records.length);

    const tagIds = records.map((r) => r.tagId);
    const tags = await Tag.find({ _id: { $in: tagIds } });
    console.log("🏷️ Tags found:", tags.length);

    return tags.map((tag) => ({
      id: tag._id.toString(),
      name: tag.name,
    }));
  },

  /**
   * Check if the current authenticated user is the owner of this post
   * Used by frontend to show/hide edit controls
   * Returns false for unauthenticated users
   */
  isOwner: async (parent, _, { user, currentUser }) => {
    console.log("🔍 IsOwner resolver - Post ID:", parent._id);
    console.log("👤 User context:", user ? "Present" : "Missing");

    if (!user) {
      console.log("❌ No authenticated user, returning false");
      return false;
    }

    console.log("🔑 User UID:", currentUser.uid);

    if (!currentUser) {
      console.log("❌ No currentUser, returning false");
      return false;
    }

    // Direct comparison using populated userId
    console.log("📄 Post userId structure:", parent.userId);

    if (!parent.userId || !parent.userId._id) {
      console.log("❌ No userId or userId._id, returning false");
      return false;
    }

    const postUserId = parent.userId._id.toString();
    const currentUserId = currentUser._id.toString();

    const isOwner = postUserId === currentUserId;
    console.log("✅ Is owner result:", isOwner);

    return isOwner;
  },
};

module.exports = postFieldResolvers;

/*  
  likes: async (parent, _, { user, currentUser }) => {
    console.log("🔍 Likes resolver - Post ID:", parent._id)
    console.log("👤 User context:", user ? "Present" : "Missing")

    if (!user || !currentUser) {
      console.log("❌ No user, returning empty array")
      return []
    }

    const records = await Like.find({ postId: parent._id })
    console.log("❤️ Like records found:", records.length)

    const userIds = records.map((r) => r.userId)
    const likers = await User.find({ _id: { $in: userIds } })
    console.log("👥 Likers found:", likers.length)

    return likers.map((liker) => ({
      id: liker._id.toString(),
      displayName: liker.displayName,
      photoURL: liker.photoURL,
      email: liker.email,
      firstName: liker.firstName,
      lastName: liker.lastName,
      phone: liker.phone,
    }))
  } */
