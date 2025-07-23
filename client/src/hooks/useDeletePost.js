import { useMutation } from "@apollo/client";
import { DELETE_POST } from "../utils/graphql/post";

export const useDeletePost = () => {
    const [deletePostMutation] = useMutation(DELETE_POST);

    const deletePost = async (postId) => {
        return await deletePostMutation({
            variables: { id: postId },
        });
    };

    return { deletePost };
};
