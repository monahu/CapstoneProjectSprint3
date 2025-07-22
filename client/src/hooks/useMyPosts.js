import { useQuery } from "@apollo/client";
import { GET_MY_POSTS } from "../utils/graphql/post";

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

    return {
        posts: data?.myPosts || [],
        loading,
        error,
        refetch,
    };
};
