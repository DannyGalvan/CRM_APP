import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { NotFound } from "../pages/error/NotFound";
import Protected from "./middlewares/Protected";

export const ErrorRoutes: RouteObject[] = [
  {
    path: nameRoutes.forbidden,
    element: (
      <Protected>
        <NotFound
          Message="No tienes autorizacion para ver este contenido, contacta con el administrador"
          Number="403"
        />
      </Protected>
    ),
  },
  {
    path: nameRoutes.unauthorized,
    element: (
      <Protected>
        <NotFound
          Message="Tu sesión ha expirado, por favor inicia sesión nuevamente"
          Number="401"
        />
      </Protected>
    ),
  },
  {
    path: nameRoutes.error,
    lazy: () => import("../pages/error/ErrorPage"),
  },
  {
    path: nameRoutes.notFound,
    element: (
      <Protected>
        <NotFound Message="La página que buscas no existe" Number="404" />
      </Protected>
    ),
  },
];
