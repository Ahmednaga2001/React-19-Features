# React 19+ New Hooks — `/components/new`

A reference guide for all hooks demonstrated in this folder.

---

## Table of Contents

1. [`use`](#1-use)
2. [`useOptimistic`](#2-useoptimistic)
3. [`useTransition` / `startTransition`](#3-usetransition--starttransition)
4. [`useDeferredValue`](#4-usedeferredvalue)
5. [`useFormStatus`](#5-useformstatus)
6. [`useFormState`](#6-useformstate)

---

## 1. `use`

**File:** `use-hook.tsx`

### What it does

`use` is a new React 19 hook that lets you **read the value of a Promise or Context directly inside a component**. Unlike `useEffect`, it integrates with React's Suspense system — the component suspends while the Promise is pending and renders when it resolves.

### Signature

```ts
const value = use(promise | context);
```

### Key rules

- Must be wrapped in a `<Suspense>` boundary to handle the loading state.
- The Promise must be created **outside** the component (or cached) to avoid re-fetching on every render.
- Works with Context too: `use(MyContext)` is equivalent to `useContext(MyContext)` but can be called conditionally.

### Example (this project)

```tsx
const postReference = fetchPosts(); // created outside the component

const UseHook = () => {
  const posts = use(postReference); // suspends until resolved
  return posts.map(post => <div key={post.id}>{post.title}</div>);
};
```

> Wrap with `<Suspense fallback={<Loading />}>` in the parent page.

---

## 2. `useOptimistic`

**File:** `use-optimistic-hook.tsx`

### What it does

`useOptimistic` lets you **immediately show a predicted UI update** while an async operation (like a network request) is still in progress. If the operation succeeds, the real state takes over. If it fails, React automatically rolls back to the previous state.

### Signature

```ts
const [optimisticState, setOptimistic] = useOptimistic(
  state,
  (currentState, action) => nextOptimisticState // optional reducer
);
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `state` | The committed/source-of-truth state (from `useState` or props) |
| `reducer` | Optional function `(currentState, action) => nextState` to compute the optimistic value |

### Returns

| Value | Description |
|-------|-------------|
| `optimisticState` | The current optimistic value (equals `state` when no action is pending) |
| `setOptimistic` | Function to trigger an optimistic update — **must be called inside a Transition or Action** |

### Key rules

1. Call `setOptimistic()` **inside** `startTransition(async () => { ... })` or a React Action.
2. You can detect a pending item with: `const isPending = optimisticState !== committedState`.
3. Never call `setOptimistic` during render — React will warn.

### Example (this project)

```tsx
const [optimisticTodos, setOptimisticTodo] = useOptimistic(
  todos,
  (state, newTodo: string) => [...state, newTodo]
);

startTransition(async () => {
  setOptimisticTodo(value);          // shows immediately
  await saveTodo(value);             // real async work
  setTodos(prev => [...prev, value]); // commits real state
});
```

---

## 3. `useTransition` / `startTransition`

**File:** `use-transition-hook.tsx`

### What it does

`useTransition` marks certain state updates as **low-priority (non-urgent)**. React keeps the UI responsive to urgent events (typing, clicks) while processing the transition update in the background.

In React 19, `startTransition` also supports **async functions**, making it suitable for wrapping API calls.

### Signature

```ts
const [isPending, startTransition] = useTransition();
```

### Returns

| Value | Description |
|-------|-------------|
| `isPending` | `true` while the transition is still processing |
| `startTransition` | Function to wrap non-urgent state updates (sync or async in React 19) |

### When to use

- Filtering or searching large datasets
- Navigating between views without blocking input
- Any state update that doesn't need to feel instant

### Example (this project)

```tsx
const [isPending, startTransition] = useTransition();

const handleOnChange = async (e) => {
  setQuery(e.target.value);           // urgent — updates input immediately

  startTransition(async () => {       // non-urgent — fetches in background
    const data = await fetchPosts(e.target.value);
    setPosts(data);
  });
};

// In JSX:
{isPending && <p>Loading...</p>}
```

---

## 4. `useDeferredValue`

**File:** `use-deferred-value-hook.tsx`

### What it does

`useDeferredValue` returns a **deferred (slightly stale) copy** of a value. React renders with the current value first (keeping input responsive), then re-renders with the deferred value when the browser is idle.

Think of it as a built-in debounce that React controls automatically.

### Signature

```ts
const deferredValue = useDeferredValue(value);
```

### vs `useTransition`

| | `useTransition` | `useDeferredValue` |
|--|--|--|
| Controls | The state **setter** | The **value** read |
| Use when | You own the state update | You receive the value as a prop or can't modify the setter |

### Example (this project)

```tsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query); // lags behind query

const filteredItems = useMemo(() => {
  return ITEMS.filter(item =>
    item.toLowerCase().includes(deferredQuery.toLowerCase())
  );
}, [deferredQuery]); // only re-filters when deferredQuery settles
```

> Filters 80,000 items without freezing the input field.

---

## 5. `useFormStatus`

**File:** `useFormStatus-useFormState.tsx`

### What it does

`useFormStatus` gives a **child component** access to the submission state of the parent `<form>` — without prop drilling.

It is imported from `react-dom`, not `react`.

### Signature

```ts
const { pending, data, method, action } = useFormStatus();
```

### Returns

| Value | Description |
|-------|-------------|
| `pending` | `true` while the form's async `action` is running |
| `data` | The `FormData` being submitted |
| `method` | The HTTP method (`"get"` or `"post"`) |
| `action` | Reference to the action function |

### Key rule

`useFormStatus` must be called inside a component that is **rendered inside** a `<form>`. It cannot be called in the same component that renders the form.

### Example (this project)

```tsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting…' : 'Submit'}
    </button>
  );
}

function MyForm() {
  async function action(formData: FormData) {
    await submitToServer(formData);
  }
  return (
    <form action={action}>
      <input name="name" />
      <SubmitButton /> {/* reads pending state from parent form */}
    </form>
  );
}
```

---

## 6. `useFormState`

**File:** `useFormStatus-useFormState.tsx`

### What it does

`useFormState` connects a `<form>` to an **async action function** and manages the returned state. It replaces the pattern of manually tracking form results with `useState` + `useEffect`.

It is imported from `react-dom`, not `react`.

### Signature

```ts
const [state, formAction] = useFormState(actionFn, initialState);
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `actionFn` | Async function `(prevState, formData) => newState` |
| `initialState` | The initial value of `state` before the first submission |

### Returns

| Value | Description |
|-------|-------------|
| `state` | The current state returned by the last `actionFn` call |
| `formAction` | Pass this as the `action` prop of your `<form>` |

### Example (this project)

```tsx
type FormState = { message: string; count: number };

const [state, formAction] = useFormState(
  async (_prev: FormState, formData: FormData): Promise<FormState> => {
    await new Promise(r => setTimeout(r, 800));
    const name = formData.get('name') as string;
    return { message: `Submitted: ${name}`, count: (_prev?.count ?? 0) + 1 };
  },
  { message: '', count: 0 }
);

return (
  <form action={formAction}>
    <input name="name" />
    <button type="submit">Submit</button>
    {state.message && <p>{state.message} (#{state.count})</p>}
  </form>
);
```

---

## Quick Comparison

| Hook | React package | Purpose |
|------|--------------|---------|
| `use` | `react` | Unwrap a Promise or Context inside render |
| `useOptimistic` | `react` | Show instant UI update, auto-rollback on failure |
| `useTransition` | `react` | Mark updates as low-priority, keep UI responsive |
| `useDeferredValue` | `react` | Defer a value to avoid blocking urgent renders |
| `useFormStatus` | `react-dom` | Read parent form's pending/data state in a child |
| `useFormState` | `react-dom` | Manage form action result as state |
