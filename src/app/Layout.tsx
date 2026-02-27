import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavLink, Outlet } from "react-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

const navItems = [
  { to: "/", label: "Home" },
  { to: "/use-hook", label: "use Hook" },
  { to: "/use-transition", label: "useTransition" },
  { to: "/use-deferred-value", label: "useDeferredValue" },
  { to: "/use-optimistic", label: "useOptimistic" },
  { to: "/use-form", label: "useFormStatus / useFormState" },
  { to: "/activity", label: "<Activity>" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${isActive ? "text-cyan-400 font-semibold" : "text-gray-300 hover:text-white"}`;

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-3">
        <nav>
          <menu className="flex flex-wrap justify-center items-center gap-6 m-0 p-0 list-none">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </menu>
        </nav>
      </header>
     <Outlet />
    </QueryClientProvider>
  );
}

export default RootLayout;
