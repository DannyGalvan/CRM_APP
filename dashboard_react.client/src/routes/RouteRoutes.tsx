import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { RoutePage } from "../pages/routes/RoutePage";
import { CreateRoutePage } from "../pages/routes/CreateRoutePage";

export const RouteRoutes: RouteObject[] = [
  {
    path: nameRoutes.route,
    element: <RoutePage />,
  },
  {
    path: `${nameRoutes.route}/${nameRoutes.create}`,
    element: <CreateRoutePage />,
  }
];