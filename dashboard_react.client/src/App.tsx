import { NextUIProvider } from "@nextui-org/system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";

const ErrorBoundary = lazy(() => import("./pages/error/ErrorBoundary"));
const LoadingPage = lazy(() => import("./pages/public/LoadingPage"));
const AppRoutes = lazy(() => import("./routes/AppRoutes"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      networkMode: "online",
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error({ error });
      },
    },
  },
});

function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NextUIProvider>
              <AppRoutes />
              <ToastContainer />
            </NextUIProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
