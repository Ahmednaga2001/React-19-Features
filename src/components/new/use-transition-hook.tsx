/**
 * React 19+ startTransition:
 *
 * Marks state updates as low-priority.
 * Allows urgent UI (like typing or clicks) to stay responsive
 * while heavy or async updates happen in the background.
 *
 * Example:
 * - Filtering a large list without blocking input.
 */
import { useState, useTransition } from "react";

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const UseTransitionHook = () => {
  const [query, setQuery] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setPosts([]);
      return;
    }

    startTransition(async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(value)}`,
      );
      const data: Post[] = await response.json();
      setPosts([...data]);
    });
  };

  return (
    <div className="flex flex-col items-center mt-10 w-full max-w-xl mx-auto px-4">
      <input
        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        placeholder="Search posts..."
        value={query}
        onChange={handleOnChange}
      />

      <div className="mt-3 w-full flex flex-col gap-2">
        {posts.map((post, index) => (
          <div key={index} className="border border-gray-200 rounded p-3">
            <h2 className="text-sm font-medium text-gray-800">{post.title}</h2>
            <p className="text-xs text-gray-500 mt-1">{post.body}</p>
          </div>
        ))}
        {isPending && <p className="text-sm text-gray-400">Loading...</p>}
      </div>

      {query.trim() && posts.length === 0 && (
        <p className="mt-6 text-sm text-gray-400">No results for "{query}"</p>
      )}
    </div>
  );
};

export default UseTransitionHook;
