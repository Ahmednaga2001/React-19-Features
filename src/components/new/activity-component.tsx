/**
 * <Activity> — React 19+ Component
 *
 * mode="visible" → shows the component normally
 * mode="hidden"  → hides the component visually but keeps its state and data
 *
 * Differences from Conditional Rendering ({show && <Component />}):
 * - Conditional Rendering unmounts the component when false → state and async data are lost
 * - <Activity> hides the component but keeps it mounted → state and async data are preserved
 * - Conditional Rendering starts fetch/data only when mounted; <Activity> can fetch data while hidden
 * - <Activity> is non-blocking → UI renders and remains interactive even when children are hidden
 */

import { Activity, useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-white mb-4">{count}</p>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg"
        >
          −
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg"
        >
          +
        </button>
      </div>
    </div>
  );
};

const ActivityComponent = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-white text-xl font-semibold">{"<Activity>"} Demo</h1>

      <button
        onClick={() => setShow((v) => !v)}
        className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-medium rounded-lg"
      >
        {show ? "Hide" : "Show"}
      </button>

      <Activity mode={show ? "visible" : "hidden"}>
        <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl w-64">
          <p className="text-slate-400 text-sm text-center mb-4">
            Counter state is preserved while hidden
          </p>
          <Counter />
        </div>
      </Activity>

  
    </div>
  );
};

export default ActivityComponent;
