import UseHook from "@/components/new/use-hook";
import { Suspense } from "react";

export default function UseHookPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-400">Loading...</div>}>
      <UseHook />
    </Suspense>
  );
}
