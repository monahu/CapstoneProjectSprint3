import { useSelector } from "react-redux";
import { usePosts } from "../hooks/usePost";
import Hero from "./Hero";
import RestaurantCard from "./Post/RestaurantCard";
import heroImage from "../assets/img/resJam_post_1.webp";
import { useNavbar } from "../hooks/useNavbar";
import { useEffect, useRef } from "react";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";

const Profile = () => {
    const { handleSignOut } = useNavbar();
    const user = useSelector((state) => state.user.data); // Access user.data
    const authInitialized = useSelector((state) => state.user.authInitialized);
    const previousUserRef = useRef(user);

    // Use usePosts with authorId filter to trigger GET_MY_POSTS
    const { posts, loading, error, refetch } = usePosts(50, 0, {
        authorId: user?._id,
    });

    // Debug: Log user and posts
    useEffect(() => {
        console.log("User:", user);
        console.log("User ID:", user?._id);
        console.log("Auth Initialized:", authInitialized);
        console.log("Posts:", posts);
        console.log("Error:", error);
    }, [user, authInitialized, posts, error]);

    // Refetch posts when user auth state changes
    useEffect(() => {
        if (authInitialized && previousUserRef.current !== user && refetch) {
            setTimeout(() => {
                refetch({
                    fetchPolicy: "network-only",
                    variables: {
                        limit: 50,
                        offset: 0,
                        filter: { authorId: user?._id },
                    },
                });
            }, 200);
            previousUserRef.current = user;
        }
    }, [user, authInitialized, refetch]);

    // Handle post creation
    const handlePostCreated = () => {
        refetch({
            fetchPolicy: "network-only",
            variables: {
                limit: 50,
                offset: 0,
                filter: { authorId: user?._id },
            },
        });
    };

    if (!authInitialized) {
        return <div>Loading authentication...</div>;
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <main className="flex-1 px-4 sm:px-8 md:px-12">
                    <Hero
                        heroImage={heroImage}
                        title="Rest Jam Profile"
                        description=""
                        showButton={false}
                        className="h-[200px] md:h-[240px] lg:h-[280px]"
                    />

                    <div className="mt-6 mb-10 bg-white shadow-md rounded-xl p-6 text-center">
                        <h2 className="text-xl font-semibold">
                            Hello, {user?.displayName || "Guest"}!
                        </h2>
                        <div className="mt-2 text-sm text-gray-600">
                            <div>Total posts: {posts.length}</div>
                            <img
                                src={
                                    user?.photoURL ||
                                    "https://img.daisyui.com/images/profile/demo/2@94.webp"
                                }
                                alt="Profile"
                                className="mx-auto mt-2 h-16 w-16 rounded-full object-cover"
                            />
                            <div>Total want to go: 6</div>
                        </div>
                        <div className="mt-4 space-x-4">
                            <a
                                href="/profile"
                                className="text-purple-600 font-medium underline"
                            >
                                💜 Check your profile
                            </a>
                            <button
                                onClick={handleSignOut}
                                className="text-red-500 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <section className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">
                            Post List
                        </h3>
                        {loading && (
                            <div className="text-gray-500">
                                Loading posts...
                            </div>
                        )}
                        {error && (
                            <ErrorMessage
                                error={error}
                                onRetry={() =>
                                    refetch({ fetchPolicy: "network-only" })
                                }
                            />
                        )}
                        {!loading && !error && posts.length === 0 && (
                            <EmptyState
                                actionText="Share Your Experience"
                                onAction={handlePostCreated}
                            />
                        )}
                        {!loading && !error && posts.length > 0 && (
                            <ul className="space-y-4">
                                {posts.map((post) => (
                                    <li
                                        key={post.id}
                                        className="border rounded-lg p-4 bg-white shadow"
                                    >
                                        <RestaurantCard
                                            id={post.id}
                                            image={
                                                post.imageUrls?.desktop ||
                                                post.imageUrls?.mobile ||
                                                post.imageUrls?.mobile2x ||
                                                post.imageUrls?.tablet
                                            }
                                            user={{
                                                name:
                                                    user?.displayName || "You",
                                                avatar:
                                                    user?.photoURL ||
                                                    "https://img.daisyui.com/images/profile/demo/2@94.webp",
                                            }}
                                            location={post.location}
                                            title={post.title}
                                            placeName={post.placeName}
                                            description={post.content}
                                            date={new Date(
                                                post.createdAt
                                            ).toLocaleDateString()}
                                            tags={
                                                post.tags?.map(
                                                    (tag) => tag.name
                                                ) || []
                                            }
                                            rating={post.rating?.type}
                                            likeCount={post.likeCount}
                                            shareCount={post.shareCount || 0}
                                            wantToGoCount={post.attendeeCount}
                                            isWantToGo={post.isWantToGo}
                                            isLiked={post.isLiked}
                                            className="max-w-full"
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="mt-10">
                        <h3 className="text-lg font-semibold mb-4">
                            Going List
                        </h3>
                        <div className="rounded-md border border-gray-300 p-4 text-gray-700 text-sm">
                            Going list component goes here.
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Profile;
