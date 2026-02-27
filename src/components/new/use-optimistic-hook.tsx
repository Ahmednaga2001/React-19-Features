/**
 * useOptimistic — React 19+ Hook
 *
 * Lets you optimistically update the UI while an async action is in progress.
 * The optimistic state appears immediately; if the action succeeds, the real
 * state takes over, and if it fails, React automatically rolls back the optimistic state.
 *
 * Signature:
 *   const [optimisticState, setOptimistic] = useOptimistic(initialValue, reducer?)
 *
 * Parameters:
 * • initialValue — the committed/source-of-truth state (from useState or props)
 * • reducer?     — optional function (currentState, action) => nextOptimisticState
 *                  for updating multiple related values or handling dynamic updates
 *
 * Returns:
 * • optimisticState — the current optimistic value; equals initialValue unless an Action is pending
 * • setOptimistic    — function to update the optimistic state during an Action
 *
 * Usage Rules:
 * 1. Call setOptimistic(...) **inside an Action** or inside startTransition.
 *    Otherwise, React will show warnings:
 *      - "An optimistic state update occurred outside a Transition or Action"
 *      - "Cannot update optimistic state while rendering"
 * 2. If you pass a reducer, the optimistic value is passed as the second argument.
 * 3. You can detect pending state with:
 *      const isPending = optimisticState !== committedState;

*/
import { useOptimistic, useRef, useState, startTransition } from "react";

const UseOptimisticHook = () => {
  const [todos, setTodos] = useState<string[]>([]);

  const [optimisticTodos, setOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: string) => [...state, newTodo],
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setOptimisticTodo(value);

    startTransition(async () => {
      try {
        await new Promise((res) => setTimeout(res, 1000));
        setTodos((prev) => [...prev, value]);
      } catch (err) {
        console.error("Failed to add todo:", err);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-white mb-1">Todo List</h1>
        <p className="text-slate-400 text-xs mb-5">
          using <code className="text-cyan-400">useOptimistic</code>
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a todo..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-medium text-sm px-4 py-2 rounded-lg transition"
          >
            Add
          </button>
        </form>

        {optimisticTodos.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">
            No todos yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {optimisticTodos.map((todo, i) => {
              const isPending = !todos.includes(todo);
              return (
                <li
                  key={`${todo}-${i}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-opacity ${
                    isPending
                      ? "border-slate-600 bg-slate-700/30 text-slate-400 opacity-60"
                      : "border-slate-600 bg-slate-700/50 text-white"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPending ? "bg-slate-500 animate-pulse" : "bg-emerald-400"}`}
                  />
                  <span>{todo}</span>
                  {isPending && (
                    <span className="ml-auto text-xs text-slate-500">
                      saving…
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UseOptimisticHook;
