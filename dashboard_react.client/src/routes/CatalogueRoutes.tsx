import { RouteObject } from "react-router-dom";
import { nameRoutes } from "../config/contants";
import { CataloguePage } from "../pages/catalogue/CataloguePage";
import { CreateCataloguePage } from "../pages/catalogue/CreateCataloguePage";

export const CatalogueRoutes: RouteObject[] = [
  {
    path: nameRoutes.catalogue,
    children: [
      {
        index: true,
        element: <CataloguePage />,
      },
      {
        path: nameRoutes.create,
        element: <CreateCataloguePage />,
      },
    ],
  },
];
