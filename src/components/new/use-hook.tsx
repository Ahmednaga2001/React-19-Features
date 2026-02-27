import { use } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

const postReference = fetchPosts();

const UseHook = () => {
  const posts = use(postReference);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Posts</h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 capitalize mb-1">
              {post.title}
            </h2>
            <p className="text-gray-500 text-sm">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UseHook;
