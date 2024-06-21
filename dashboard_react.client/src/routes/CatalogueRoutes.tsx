import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { CataloguePage } from "../pages/catalogue/CataloguePage";
import { CreateCataloguePage } from "../pages/catalogue/CreateCataloguePage";

export const CatalogueRoutes: RouteObject[] = [
  {
    path: nameRoutes.catalogue,
    element: <CataloguePage />,
  },
  {
    path: `${nameRoutes.catalogue}/${nameRoutes.create}`,
    element: <CreateCataloguePage />,
  }
];
