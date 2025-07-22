import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
    GET_ALL_POSTS,
    GET_POST_BY_ID,
    CREATE_POST,
    UPDATE_POST,
    DELETE_POST,
    TOGGLE_LIKE,
    TOGGLE_WANT_TO_GO,
    SEARCH_POSTS,
    SEARCH_POSTS_BY_TAGS,
    GET_ALL_TAGS,
} from "../utils/graphql/post";
import { DEFAULT_POSTS_VARIABLES } from "../utils/constants/posts";

export const usePosts = (limit = 10, offset = 0, filter = {}, options = {}) => {
    const { data, loading, error, fetchMore, refetch } = useQuery(
        GET_ALL_POSTS,
        {
            variables: { limit, offset, filter },
            notifyOnNetworkStatusChange: true,
            ...options,
            onError: (error) => {
                console.error("GET_ALL_POSTS error:", {
                    message: error.message,
                    graphQLErrors: error.graphQLErrors,
                    networkError: error.networkError,
                });
            },
            onCompleted: (data) => {
                console.log("GET_ALL_POSTS completed:", data);
            },
        }
    );

    const loadMore = () => {
        fetchMore({
            variables: {
                offset: data?.posts?.length || 0,
            },
        });
    };

    // Filter posts by authorId (uid) if provided
    const posts =
        data?.posts?.filter((post) => {
            return !filter.authorId || post.author?.id === filter.authorId;
        }) || [];

    return {
        posts, // Return filtered posts
        loading,
        error,
        loadMore,
        refetch,
    };
};

export const usePost = (id) => {
    const { data, loading, error } = useQuery(GET_POST_BY_ID, {
        variables: { id },
        skip: !id,
    });

    return {
        post: data?.post,
        loading,
        error,
    };
};

export const useCreatePost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
    const [createPost, { loading, error }] = useMutation(CREATE_POST, {
        update(cache, { data: { createPost } }) {
            try {
                const existingPosts = cache.readQuery({
                    query: GET_ALL_POSTS,
                    variables: cacheVariables,
                });
                if (existingPosts) {
                    cache.writeQuery({
                        query: GET_ALL_POSTS,
                        variables: cacheVariables,
                        data: {
                            posts: [createPost, ...existingPosts.posts],
                        },
                    });
                }
            } catch {
                console.log("Cache update failed, will refetch posts");
            }
        },
        refetchQueries: [
            {
                query: GET_ALL_POSTS,
                variables: cacheVariables,
            },
        ],
        awaitRefetchQueries: true,
    });

    return { createPost, loading, error };
};

export const useLikePost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
    const [likePost, { loading, error }] = useMutation(TOGGLE_LIKE, {
        refetchQueries: [
            {
                query: GET_ALL_POSTS,
                variables: cacheVariables,
            },
        ],
        awaitRefetchQueries: true,
    });
    return { likePost, loading, error };
};

export const useWantToGoPost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
    const [wantToGoPost, { loading, error }] = useMutation(TOGGLE_WANT_TO_GO, {
        refetchQueries: [
            {
                query: GET_ALL_POSTS,
                variables: cacheVariables,
            },
        ],
        awaitRefetchQueries: true,
    });
    return { wantToGoPost, loading, error };
};

export const useDeletePost = () => {
    const [deletePost, { loading, error }] = useMutation(DELETE_POST, {
        update(cache, { data: { deletePost: deletedId } }) {
            cache.modify({
                fields: {
                    posts(existingPosts = [], { readField }) {
                        return existingPosts.filter(
                            (postRef) => deletedId !== readField("id", postRef)
                        );
                    },
                },
            });
        },
    });

    return { deletePost, loading, error };
};

// ===========================
// SEARCH HOOKS
// ===========================

export const useSearchPosts = () => {
    const [executeSearch, { data, loading, error, called }] = useLazyQuery(
        SEARCH_POSTS,
        {
            notifyOnNetworkStatusChange: true,
            fetchPolicy: "cache-and-network",
            onError: (error) => {
                console.error("SEARCH_POSTS error:", error);
            },
        }
    );

    const searchPosts = (searchTerm, options = {}) => {
        const { tags, location, limit = 20 } = options;

        const hasSearchTerm = searchTerm?.trim();
        const hasTags = tags?.length > 0;
        const hasLocation = location?.trim();

        if (!hasSearchTerm && !hasTags && !hasLocation) {
            return;
        }

        return executeSearch({
            variables: {
                searchTerm: hasSearchTerm || null,
                tags: hasTags ? tags : null,
                location: hasLocation || null,
                limit,
            },
        });
    };

    return {
        searchPosts,
        posts: data?.searchPosts || [],
        loading,
        error,
        called,
        hasSearched: called,
    };
};

export const useSearchPostsByTags = () => {
    const { data, loading, error, called, refetch } = useQuery(
        SEARCH_POSTS_BY_TAGS,
        {
            skip: true,
            notifyOnNetworkStatusChange: true,
            fetchPolicy: "cache-and-network",
            onError: (error) => {
                console.error("SEARCH_POSTS_BY_TAGS error:", error);
            },
        }
    );

    const searchByTags = (tags, limit = 20) => {
        if (!tags || tags.length === 0) return;

        return refetch({
            tags: tags.map((tag) => tag.trim()).filter(Boolean),
            limit,
        });
    };

    return {
        searchByTags,
        posts: data?.searchPostsByTags || [],
        loading,
        error,
        called,
        hasSearched: called && !loading,
    };
};

// ===========================
// TAG HOOKS
// ===========================

export const useTags = () => {
    const { data, loading, error } = useQuery(GET_ALL_TAGS, {
        onError: (error) => {
            console.error("GET_ALL_TAGS error:", error);
        },
    });

    return {
        tags: data?.tags || [],
        loading,
        error,
    };
};
