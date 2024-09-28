import { RouterProvider } from "react-router-dom";

import { useAuthorizationRoutes } from "../hooks/useAuthorizationRoutes";
import LoadingPage from "../pages/public/LoadingPage";

const AppRoutes = () => {
  const routes = useAuthorizationRoutes();

  return <RouterProvider fallbackElement={<LoadingPage />} router={routes} />;
};

export default AppRoutes;
