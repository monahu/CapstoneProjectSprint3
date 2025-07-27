import { useQuery } from "@apollo/client";
import { GET_MY_WANT_TO_GO_POSTS } from "../utils/graphql/post";
import { generateRestaurantUrl } from "../utils/slugUtils";

export const useMyWantToGoPosts = () => {
    const { data, loading, error, refetch } = useQuery(
        GET_MY_WANT_TO_GO_POSTS,
        {
            fetchPolicy: "cache-and-network",
            notifyOnNetworkStatusChange: true,
            onError: (error) => {
                console.error("GET_MY_WANT_TO_GO_POSTS error:", error);
            },
        }
    );

    // Add URLs to posts
    const goingList = (data?.myWantToGoPosts || []).map(post => ({
        ...post,
        url: generateRestaurantUrl(post)
    }))

    return {
        goingList,
        loading,
        error,
        refetch,
    };
};
