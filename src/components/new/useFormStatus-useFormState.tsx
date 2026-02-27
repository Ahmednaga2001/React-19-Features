// useFormStatus-useFormState.tsx
import { useFormStatus, useFormState } from 'react-dom';
import { useState } from 'react';

// ------------------- useFormStatus Example -------------------
function SubmitButton() {
  const { pending } = useFormStatus(); // pending = true while form is submitting

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting…' : 'Submit'}
    </button>
  );
}

function FormWithStatus() {
  const [message, setMessage] = useState('');

  async function action(formData: FormData) {
    // simulate async submission
    await new Promise((r) => setTimeout(r, 1500));
    const name = formData.get('name') as string;
    setMessage(`Hello, ${name}!`);
  }

  return (
    <form action={action} className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto"  >
      <input name="name" placeholder="Name" required className="w-full p-2 border border-gray-300 rounded-md" />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">Submit</button>
      <SubmitButton />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </form>
  );
}

// ------------------- useFormState Example -------------------
type FormState = { message: string; count: number };

function FormStateDemo() {
  const [state, formAction] = useFormState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      // simulate async submission
      await new Promise((r) => setTimeout(r, 800));
      const name = formData.get('name') as string;

      return {
        message: `Submitted: ${name}`,
        count: (_prev?.count ?? 0) + 1,
      };
    },
    { message: '', count: 0 } // initial state
  );

  return (
    <form action={formAction} className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
      <input name="name" placeholder="Name" required className="w-full p-2 border border-gray-300 rounded-md" />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">Submit</button>
      {state.message && (
        <p className="text-sm text-gray-500">
          {state.message} (submit #{state.count})
        </p>
      )}
    </form>
  );
}

export { FormWithStatus, FormStateDemo };