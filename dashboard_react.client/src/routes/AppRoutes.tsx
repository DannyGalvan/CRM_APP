import { RouterProvider } from "react-router-dom";
import { useAuthorizationRoutes } from "../hooks/useAuthorizationRoutes";
import LoadingPage from "../pages/public/LoadingPage";

const AppRoutes = () => {
  const routes = useAuthorizationRoutes();

  return <RouterProvider router={routes} fallbackElement={<LoadingPage />} />;
};

export default AppRoutes;
