import {
  FormStateDemo,
  FormWithStatus,
} from "@/components/new/useFormStatus-useFormState";

export default function UseFormPage() {
  return (
    <div className="py-10 ">
        <FormWithStatus />
        <FormStateDemo />
    </div>
  );
}
