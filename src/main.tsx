import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "./app/Layout.tsx";
import HomePage from "./app/page.tsx";
import UseHookPage from "./app/use-hook/page.tsx";
import UseTransitionPage from "./app/use-transition/page.tsx";
import UseDeferredValuePage from "./app/use-deferred-value/page.tsx";
import UseOptimisticPage from "./app/use-optimistic/page.tsx";
import UseFormPage from "./app/use-form/page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="use-hook" element={<UseHookPage />} />
          <Route path="use-transition" element={<UseTransitionPage />} />
          <Route path="use-deferred-value" element={<UseDeferredValuePage />} />
          <Route path="use-optimistic" element={<UseOptimisticPage />} />
          <Route path="use-form" element={<UseFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
