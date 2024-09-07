import { NextUIProvider } from "@nextui-org/system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, lazy, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./hooks/useAuth";
import ErrorBoundary from "./pages/error/ErrorBoundary";
import LoadingPage from "./pages/public/LoadingPage";

const LazyAppRoutes = lazy(() =>
  import("./routes/AppRoutes").catch((error) => {
    console.error("Error loading AppRoutes", error);
    throw error; // Para que ErrorBoundary lo capture
  }),
);

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
  const { loading, syncAuth } = useAuth();

  useEffect(() => {
    syncAuth();
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <QueryClientProvider client={queryClient}>
          <NextUIProvider>
            {loading ? <LoadingPage /> : <LazyAppRoutes />}
            <ToastContainer />
          </NextUIProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
