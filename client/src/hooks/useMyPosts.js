import { useQuery } from "@apollo/client";
import { GET_MY_POSTS } from "../utils/graphql/post";
import { generateRestaurantUrl } from "../utils/slugUtils";

export const useMyPosts = () => {
    const { data, loading, error, refetch } = useQuery(GET_MY_POSTS, {
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
        onError: (error) => {
            console.error("GET_MY_POSTS error:", {
                message: error.message,
                graphQLErrors: error.graphQLErrors,
                networkError: error.networkError,
            });
        },
        onCompleted: (data) => {
            console.log("GET_MY_POSTS completed:", data);
        },
    });

    // Add URLs to posts
    const posts = (data?.myPosts || []).map(post => ({
        ...post,
        url: generateRestaurantUrl(post)
    }))

    return {
        posts,
        loading,
        error,
        refetch,
    };
};
