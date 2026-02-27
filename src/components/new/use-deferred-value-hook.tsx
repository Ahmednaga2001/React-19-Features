/**
 * Commit-style Explanation:
 * 
 * Component: DeferredSearchTailwind
 * Purpose: Filter large list efficiently (80k items) without freezing UI
 * Key points:
 * 1. useDeferredValue(query) → delays filtering while typing for smooth input
 */

import { useState, useDeferredValue, useMemo } from 'react';

const ITEMS = Array.from({ length: 80000 }, (_, i) => `Item ${i + 1}`);

function UseDeferredValueHook () {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filteredItems = useMemo(() => {
    return deferredQuery
      ? ITEMS.filter(item =>
          item.toLowerCase().includes(deferredQuery.toLowerCase())
        )
      : ITEMS;
  }, [deferredQuery]);

  return (
    <div className="p-6 max-w-md mx-auto font-sans">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items..."
        className="w-full p-3 mb-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <ul className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
        {filteredItems.map(item => (
          <li
            key={item}
            className="px-4 py-2 hover:bg-gray-50 cursor-default"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default UseDeferredValueHook;
