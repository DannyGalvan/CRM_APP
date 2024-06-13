import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { Root } from "../containers/Root";
import LoadingPage from "../pages/public/LoadingPage";
import { CatalogueRoutes } from "./CatalogueRoutes";
import { CollectionRoutes } from "./CollectionRoutes";
import { CustomerRoutes } from "./CustomerRoutes";
import { ErrorRoutes } from "./ErrorRoutes";
import { ProductRoutes } from "./ProductRoutes";
import { PublicRoutes } from "./PublicRoutes";

const routes = createBrowserRouter([
  {
    path: nameRoutes.root,
    element: <Root />,
    children: [
      ...PublicRoutes,
      ...ErrorRoutes,
      ...CatalogueRoutes,
      ...CollectionRoutes,
      ...CustomerRoutes,
      ...ProductRoutes,
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={routes} fallbackElement={<LoadingPage />} />;
};

export default AppRoutes;
