import { useSelector } from "react-redux";
import { useMyPosts } from "../hooks/useMyPosts";
import Hero from "./Hero";
import heroImage from "../assets/img/resJam_post_1.webp";
import { useNavbar } from "../hooks/useNavbar";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";

const Profile = () => {
    const { handleSignOut } = useNavbar();
    const user = useSelector((state) => state.user.data);
    const authInitialized = useSelector((state) => state.user.authInitialized);
    const { posts, loading, error, refetch } = useMyPosts();

    const handlePostCreated = () => {
        refetch({ fetchPolicy: "network-only" });
    };

    if (!authInitialized) {
        return <div>Loading authentication...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <main className="flex-1 px-4 sm:px-8 md:px-12">
                    {/* Header */}
                    <Hero
                        heroImage={heroImage}
                        title="Rest Jam Profile"
                        description=""
                        showButton={false}
                        className="h-[200px] md:h-[240px] lg:h-[280px]"
                    />

                    {/* Profile Stats */}
                    <div className="mt-6 mb-10 bg-white shadow-md rounded-xl p-6 text-center">
                        <h2 className="text-2xl font-bold mb-6">
                            Hello, {user?.displayName || "Guest"}!
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-16">
                            {/* Total Posts */}
                            <div>
                                <div className="text-gray-500 text-sm">
                                    Total posts
                                </div>
                                <div className="text-4xl font-bold">
                                    {posts.length}
                                </div>
                            </div>

                            {/* Avatar */}
                            <div>
                                <img
                                    src={
                                        user?.photoURL ||
                                        "https://img.daisyui.com/images/profile/demo/2@94.webp"
                                    }
                                    alt="Profile"
                                    className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                                />
                            </div>

                            {/* Total Want to Go */}
                            <div>
                                <div className="text-gray-500 text-sm">
                                    Total want to go
                                </div>
                                <div className="text-4xl font-bold">6</div>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="mt-6 flex flex-col items-center space-y-2">
                            <a
                                href="/profile"
                                className="text-purple-600 font-medium underline flex items-center space-x-1"
                            >
                                <span>💜</span>
                                <span>Check your profile</span>
                                <span>💜</span>
                            </a>
                            <button
                                onClick={handleSignOut}
                                className="text-purple-600 font-medium underline flex items-center space-x-1"
                            >
                                <span>👤</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Post List Section */}
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
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left bg-white shadow-md rounded-xl overflow-hidden">
                                    <thead className="text-gray-700 uppercase bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 w-10">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox bg-white appearance-none border rounded w-5 h-5 bg-white border border-gray-300 checked:bg-purple-600 checked:border-purple-600 focus:outline-none transition"
                                                />
                                            </th>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">
                                                Restaurant Recommendations
                                            </th>
                                            <th className="px-4 py-3">
                                                Address
                                            </th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3 text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map((post, index) => (
                                            <tr
                                                key={post.id}
                                                className="hover:bg-gray-50 border-b last:border-b-0"
                                            >
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox bg-white appearance-none border rounded w-5 h-5 bg-white border border-gray-300 checked:bg-purple-600 checked:border-purple-600 focus:outline-none transition"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-bold">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-bold">
                                                    {post.title}
                                                </td>
                                                <td className="px-4 py-3 font-bold">
                                                    {post.location}
                                                </td>
                                                <td className="px-4 py-3 text-gray-400">
                                                    {
                                                        new Date(post.createdAt)
                                                            .toISOString()
                                                            .split("T")[0]
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <button className="bg-gray-700 hover:bg-gray-800 text-white text-xs px-3 py-1 rounded-2xl">
                                                        Edit
                                                    </button>
                                                    <button className="bg-purple-800 text-white hover:bg-purple-900 text-xs px-3 py-1 rounded-2xl">
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="mt-4 flex justify-center space-x-1">
                                    <button className="px-3 py-1 rounded border border-gray-300 text-sm">
                                        1
                                    </button>
                                    <button className="px-3 py-1 rounded border border-gray-300 text-sm">
                                        2
                                    </button>
                                    <button className="px-3 py-1 rounded border border-gray-300 text-sm">
                                        3
                                    </button>
                                    <button className="px-3 py-1 rounded border border-gray-300 text-sm">
                                        4
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Going List Section (placeholder) */}
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
