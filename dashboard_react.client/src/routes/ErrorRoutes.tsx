import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { NotFound } from "../pages/error/NotFound";

export const ErrorRoutes: RouteObject[] = [
  {
    path: nameRoutes.forbidden,
    element: (
      <NotFound
        Message="No tienes autorizacion para ver este contenido, contacta con el administrador"
        Number="403"
      />
    ),
  },
  {
    path: nameRoutes.unauthorized,
    element: (
      <NotFound
        Message="Tu sesión ha expirado, por favor inicia sesión nuevamente"
        Number="401"
      />
    ),
  },
  {
    path: nameRoutes.error,
    lazy: () => import("../pages/error/ErrorPage"),
  },
  {
    path: nameRoutes.notFound,
    element: <NotFound Message="La página que buscas no existe" Number="404" />,
  },
];
