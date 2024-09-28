import { createBrowserRouter } from "react-router-dom";

import { nameRoutes } from "../config/contants";
import { Root } from "../containers/Root";
import { CatalogueRoutes } from "../routes/CatalogueRoutes";
import { CollectionRoutes } from "../routes/CollectionRoutes";
import { CustomerRoutes } from "../routes/CustomerRoutes";
import { ErrorRoutes } from "../routes/ErrorRoutes";
import { OrderRoutes } from "../routes/OrderRoutes";
import { ProductRoutes } from "../routes/ProductRoutes";
import { PublicRoutes } from "../routes/PublicRoutes";
import { PilotRoutes } from "../routes/PilotRoutes";
import { RouteRoutes } from "../routes/RouteRoutes";
import { CustomerAddressRoutes } from "../routes/CustomerAddressRoutes";
import { CashReportRoutes } from "../routes/CashReportRoutes";

import { useAuth } from "./useAuth";

export const useAuthorizationRoutes = () => {
  const { allOperations } = useAuth();

  const routes = createBrowserRouter([
    {
      path: nameRoutes.root,
      element: <Root />,
      children: [
        ...CatalogueRoutes,
        ...CollectionRoutes,
        ...CustomerRoutes,
        ...ProductRoutes,
        ...OrderRoutes,
        ...PilotRoutes,
        ...RouteRoutes,
        ...CustomerAddressRoutes,
        ...CashReportRoutes,
      ],
    },
    {
      path: nameRoutes.root,
      element: <Root />,
      children: [...PublicRoutes, ...ErrorRoutes],
    },
  ]);

  const operations = new Set(
    allOperations.map((operation) => operation.path.toLowerCase()),
  );

  const routesFiltered = routes.routes[0].children?.filter((route) =>
    operations.has(route.path ?? ""),
  );

  routes.routes[0].children = routesFiltered as any;

  return routes;
};
